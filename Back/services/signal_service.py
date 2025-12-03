"""Signal service for business logic."""

from typing import List, Optional
from uuid import UUID
from decimal import Decimal
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import desc

from models import Signal, Channel, Template
from config.exceptions_handler import DatabaseError, ValidationError
from utils.logger_utils import get_module_logger

logger = get_module_logger("services.signal_service")


class SignalService:
    """Service for signal business logic."""
    
    @staticmethod
    def extract_signal_from_message(
        db: Session,
        channel_id: UUID,
        original_message_text: str,
        user_id: str,
        original_message_id: Optional[int] = None
    ) -> Signal:
        """
        Extract and create a signal from message text using active templates.
        
        Args:
            db: Database session
            channel_id: Channel UUID
            original_message_text: Message text to extract from
            user_id: User ID string
            original_message_id: Optional original message ID
            
        Returns:
            Created Signal object
            
        Raises:
            ValidationError: If channel not found, no active templates, or extraction fails
            DatabaseError: If creation fails
        """
        import re
        from services.template_service import TemplateService
        from datetime import datetime, timezone
        
        # Verify channel exists
        channel = db.query(Channel).filter(Channel.id == channel_id).first()
        if not channel:
            raise ValidationError("Channel not found")

        logger.info(f"Channel found: {channel.id}")
        
        # Get active templates for this channel
        templates = TemplateService.get_channel_templates(db, channel_id, active_only=True)
        if not templates:
            raise ValidationError("No active templates found for this channel")
        
        logger.info(f"Templates found: {len(templates)}")
        # Try each template until one succeeds
        extraction_errors = []
        for template in templates:
            try:
                logger.info(f"Extracting with template: {template.id}")
                extracted_data = SignalService._extract_with_template(
                    original_message_text,
                    template.extraction_config
                )

                logger.info(f"Extracted data: {extracted_data}")
                
                if extracted_data:
                    # Extract required fields
                    symbol = extracted_data.get('symbol')
                    entry_price = extracted_data.get('entry')
                    signal_type = extracted_data.get('signal_type', 'BUY')
                    
                    if not symbol:
                        raise ValidationError("Could not extract symbol from message")
                    if not entry_price:
                        raise ValidationError("Could not extract entry price from message")
                    
                    # Handle entry price (can be array for ranges)
                    if isinstance(entry_price, list):
                        entry_price = Decimal(str(entry_price[0]))  # Use first price in range
                    else:
                        entry_price = Decimal(str(entry_price))
                    
                    # Normalize signal type
                    signal_type_upper = signal_type.upper()
                    if signal_type_upper in ['BUY', 'LONG']:
                        signal_type = 'BUY'
                    elif signal_type_upper in ['SELL', 'SHORT']:
                        signal_type = 'SELL'
                    else:
                        signal_type = 'BUY'  # Default
                    
                    # Extract stop loss first (needed for R:R calculation)
                    stop_loss = None
                    sl_keys = ['sl', 'stop_loss', 'stop']
                    for sl_key in sl_keys:
                        if sl_key in extracted_data:
                            sl_value = extracted_data[sl_key]
                            if sl_value:
                                stop_loss = {
                                    'price': float(sl_value),
                                    'hit': False,
                                    'hit_at': None
                                }
                            break
                    
                    # Extract take profits and calculate risk/reward ratio for each
                    take_profits = []
                    tp_keys = ['tp', 'tp1', 'tp2', 'tp3', 'take_profit', 'take_profits']
                    for tp_key in tp_keys:
                        if tp_key in extracted_data:
                            tp_value = extracted_data[tp_key]
                            if isinstance(tp_value, list):
                                for idx, tp_price in enumerate(tp_value):
                                    tp_price_float = float(tp_price)
                                    risk_reward_ratio = SignalService._calculate_risk_reward_ratio(
                                        entry_price=entry_price,
                                        stop_loss_price=Decimal(str(stop_loss['price'])) if stop_loss else None,
                                        take_profit_price=Decimal(str(tp_price_float)),
                                        signal_type=signal_type
                                    )
                                    take_profits.append({
                                        'level': f'TP{idx + 1}',
                                        'price': tp_price_float,
                                        'hit': False,
                                        'risk_reward_ratio': float(risk_reward_ratio) if risk_reward_ratio else None
                                    })
                            elif tp_value:
                                tp_price_float = float(tp_value)
                                risk_reward_ratio = SignalService._calculate_risk_reward_ratio(
                                    entry_price=entry_price,
                                    stop_loss_price=Decimal(str(stop_loss['price'])) if stop_loss else None,
                                    take_profit_price=Decimal(str(tp_price_float)),
                                    signal_type=signal_type
                                )
                                take_profits.append({
                                    'level': 'TP1',
                                    'price': tp_price_float,
                                    'hit': False,
                                    'risk_reward_ratio': float(risk_reward_ratio) if risk_reward_ratio else None
                                })
                    
                    # Create signal with extracted data
                    signal = Signal(
                        channel_id=channel_id,
                        template_id=template.id,
                        user_id=user_id,
                        symbol=str(symbol),
                        entry_price=entry_price,
                        signal_type=signal_type,
                        original_message_text=original_message_text,
                        original_message_id=original_message_id,
                        take_profits=take_profits if take_profits else [],
                        stop_loss=stop_loss,
                        timeframe=extracted_data.get('timeframe'),
                        confidence_score=Decimal("1.0"),
                        extraction_metadata=extracted_data,
                        performance_outcome="PENDING"
                    )
                    
                    db.add(signal)
                    
                    # Update channel signal count
                    channel.signal_count = (channel.signal_count or 0) + 1
                    
                    # Update template metrics
                    template.last_used_at = datetime.now(timezone.utc)
                    
                    db.commit()
                    db.refresh(signal)
                    
                    logger.info(f"Signal extracted and created successfully: {signal.id} (symbol: {symbol}, type: {signal_type})")
                    return signal
                    
            except Exception as e:
                extraction_errors.append(f"Template {template.id}: {str(e)}")
                logger.warning(f"Template {template.id} extraction failed: {e}")
                continue
        
        logger.warning(f"All templates failed: {extraction_errors}")
        # If all templates failed
        raise ValidationError(f"Could not extract signal from message. Errors: {'; '.join(extraction_errors)}")
    
    @staticmethod
    def _calculate_risk_reward_ratio(
        entry_price: Decimal,
        stop_loss_price: Optional[Decimal],
        take_profit_price: Decimal,
        signal_type: str
    ) -> Optional[Decimal]:
        """
        Calculate risk/reward ratio for a signal.
        
        Args:
            entry_price: Entry price
            stop_loss_price: Stop loss price (optional)
            take_profit_price: Take profit price
            signal_type: Signal type (BUY or SELL)
            
        Returns:
            Risk/reward ratio as Decimal, or None if calculation not possible
        """
        if not stop_loss_price:
            return None
        
        entry = entry_price
        sl = stop_loss_price
        tp = take_profit_price
        
        if signal_type == "BUY" or signal_type == "LONG":
            # For BUY: Risk = Entry - SL, Reward = TP - Entry
            risk = entry - sl
            reward = tp - entry
        else:  # SELL or SHORT
            # For SELL: Risk = SL - Entry, Reward = Entry - TP
            risk = sl - entry
            reward = entry - tp
        
        # Avoid division by zero
        if risk == 0:
            return None
        
        # Calculate R:R ratio
        rr_ratio = reward / risk
        
        # Round to 2 decimal places
        return rr_ratio.quantize(Decimal("0.01"))
    
    @staticmethod
    def _extract_with_template(message_text: str, extraction_config: dict) -> Optional[dict]:
        """
        Extract signal data from message using template extraction config.
        
        Args:
            message_text: Message text to extract from
            extraction_config: Template extraction configuration
            
        Returns:
            Dictionary with extracted data or None if extraction fails
        """
        import re
        
        extracted = {}
        fields = extraction_config.get('fields', [])

        logger.info(f"Message text: {message_text}")

        for field in fields:
            field_key = field.get('key')
            field_method = field.get('method', 'regex')
            field_regex = field.get('regex')
            field_type = field.get('type', 'string')
            
            if not field_key:
                continue
            
            logger.info(f"Extracting field: {field_key} with method: {field_method}")

            try:
                if field_method == 'regex' and field_regex:
                    if field_type == 'array':
                        # For array types, find all matches (e.g., TP1, TP2, TP3)
                        matches = list(re.finditer(field_regex, message_text, re.IGNORECASE))
                        if matches:
                            values = []
                            for match in matches:
                                # Extract the price value (usually group 1, but could be group 2 for numbered TP)
                                # For patterns like "TP1. 4100.00" or "TP1: 4100.00", we want the price
                                # Check if there are multiple groups and use the last numeric group
                                groups = [g for g in match.groups() if g]
                                if groups:
                                    # For TP patterns, the price is usually the last group
                                    # Handle patterns like: TP\d?\s*[.:]?\s*([0-9]+\.?[0-9]*)
                                    # or TP(\d+)\s*[.:]?\s*([0-9]+\.?[0-9]*) where group 2 is the price
                                    price_value = groups[-1]  # Last group is typically the price
                                    try:
                                        # Try to parse as float to validate it's a number
                                        float_val = float(price_value)
                                        # Only add if it's a reasonable price (not just a single digit like 1 or 2)
                                        if float_val > 10 or '.' in price_value:  # Price should be > 10 or have decimal
                                            values.append(float_val)
                                    except ValueError:
                                        # If parsing fails, check if it's a valid number string
                                        if price_value.replace('.', '').isdigit():
                                            values.append(float(price_value))
                            if values:
                                extracted[field_key] = values
                                logger.info(f"Extracted array {field_key}: {values}")
                    else:
                        # Try regex extraction for single values
                        match = re.search(field_regex, message_text, re.IGNORECASE)
                        if match:
                            logger.info(f"Match found: {match.group(0)}")
                            # Extract first group
                            value = match.group(1) if match.groups() else match.group(0)
                            if field_type == 'number':
                                try:
                                    extracted[field_key] = float(value)
                                except ValueError:
                                    extracted[field_key] = value
                            else:
                                extracted[field_key] = value
                
                elif field_method == 'marker':
                    # Marker-based extraction
                    start_marker = field.get('startMarker')
                    end_marker = field.get('endMarker')
                    
                    if start_marker:
                        start_idx = message_text.find(start_marker)
                        if start_idx != -1:
                            start_idx += len(start_marker)
                            if end_marker:
                                end_idx = message_text.find(end_marker, start_idx)
                                if end_idx != -1:
                                    value = message_text[start_idx:end_idx].strip()
                                else:
                                    value = message_text[start_idx:].strip()
                            else:
                                # Extract until end of line or next marker
                                remaining = message_text[start_idx:]
                                lines = remaining.split('\n')
                                value = lines[0].strip() if lines else remaining.strip()
                            
                            if value:
                                if field_type == 'number':
                                    try:
                                        extracted[field_key] = float(value)
                                    except ValueError:
                                        extracted[field_key] = value
                                else:
                                    extracted[field_key] = value
                                    
            except Exception as e:
                logger.warning(f"Error extracting field {field_key}: {e}")
                continue
        
        # Return extracted data if we got at least symbol and entry
        if 'symbol' in extracted and 'entry' in extracted:
            return extracted
        
        return None
    
    @staticmethod
    def create_signal(
        db: Session,
        channel_id: UUID,
        template_id: UUID,
        user_id: str,
        symbol: str,
        entry_price: Decimal,
        signal_type: str,
        original_message_text: str,
        original_message_id: Optional[int] = None,
        take_profits: Optional[List[dict]] = None,
        stop_loss: Optional[dict] = None,
        timeframe: Optional[str] = None,
        confidence_score: Optional[Decimal] = None,
        extraction_metadata: Optional[dict] = None,
        risk_reward_ratio: Optional[Decimal] = None,
        user_notes: Optional[str] = None
    ) -> Signal:
        """
        Create a new signal.
        
        Args:
            db: Database session
            channel_id: Channel UUID
            template_id: Template UUID used for extraction
            user_id: User ID string
            symbol: Trading symbol (e.g., XAUUSD, BTCUSD)
            entry_price: Entry price
            signal_type: Signal type (BUY, SELL, LONG, SHORT)
            original_message_text: Original message text
            original_message_id: Optional original message ID
            take_profits: Optional list of take profit levels
            stop_loss: Optional stop loss dict
            timeframe: Optional timeframe
            confidence_score: Optional confidence score
            extraction_metadata: Optional extraction metadata
            risk_reward_ratio: Optional risk/reward ratio
            user_notes: Optional user notes
            
        Returns:
            Created Signal object
            
        Raises:
            ValidationError: If channel or template not found
            DatabaseError: If creation fails
        """
        # Verify channel exists
        channel = db.query(Channel).filter(Channel.id == channel_id).first()
        if not channel:
            raise ValidationError("Channel not found")
        
        # Verify template exists
        template = db.query(Template).filter(Template.id == template_id).first()
        if not template:
            raise ValidationError("Template not found")
        
        # Validate signal_type
        valid_types = ["BUY", "SELL", "LONG", "SHORT"]
        if signal_type not in valid_types:
            raise ValidationError(f"Invalid signal_type. Must be one of: {', '.join(valid_types)}")
        
        try:
            signal = Signal(
                channel_id=channel_id,
                template_id=template_id,
                user_id=user_id,
                symbol=symbol,
                entry_price=entry_price,
                signal_type=signal_type,
                original_message_text=original_message_text,
                original_message_id=original_message_id,
                take_profits=take_profits or [],
                stop_loss=stop_loss,
                timeframe=timeframe,
                confidence_score=confidence_score or Decimal("1.0"),
                extraction_metadata=extraction_metadata,
                risk_reward_ratio=risk_reward_ratio,
                user_notes=user_notes,
                performance_outcome="PENDING"
            )
            
            db.add(signal)
            
            # Update channel signal count
            channel.signal_count = (channel.signal_count or 0) + 1
            
            db.commit()
            db.refresh(signal)
            
            logger.info(f"Signal created successfully: {signal.id} (symbol: {symbol}, type: {signal_type})")
            return signal
            
        except IntegrityError as e:
            db.rollback()
            logger.error(f"Integrity error creating signal: {e}", exc_info=True)
            raise DatabaseError("Failed to create signal due to database constraint") from e
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to create signal: {e}", exc_info=True)
            raise DatabaseError(f"Failed to create signal: {e}") from e
    
    @staticmethod
    def get_signal_by_id(db: Session, signal_id: UUID) -> Optional[Signal]:
        """
        Get a signal by ID.
        
        Args:
            db: Database session
            signal_id: Signal UUID
            
        Returns:
            Signal object or None if not found
        """
        return db.query(Signal).filter(Signal.id == signal_id).first()
    
    @staticmethod
    def get_channel_signals(
        db: Session,
        channel_id: UUID,
        limit: Optional[int] = None,
        offset: Optional[int] = None,
        symbol: Optional[str] = None,
        signal_type: Optional[str] = None,
        performance_outcome: Optional[str] = None
    ) -> List[Signal]:
        """
        Get all signals for a specific channel.
        
        Args:
            db: Database session
            channel_id: Channel UUID
            limit: Optional limit on number of results
            offset: Optional offset for pagination
            symbol: Optional filter by symbol
            signal_type: Optional filter by signal type
            performance_outcome: Optional filter by performance outcome
            
        Returns:
            List of Signal objects
        """
        query = db.query(Signal).filter(Signal.channel_id == channel_id)
        
        if symbol:
            query = query.filter(Signal.symbol == symbol)
        
        if signal_type:
            query = query.filter(Signal.signal_type == signal_type)
        
        if performance_outcome:
            query = query.filter(Signal.performance_outcome == performance_outcome)
        
        query = query.order_by(desc(Signal.created_at))
        
        if offset:
            query = query.offset(offset)
        
        if limit:
            query = query.limit(limit)
        
        return query.all()
    
    @staticmethod
    def get_user_signals(
        db: Session,
        user_id: str,
        limit: Optional[int] = None,
        offset: Optional[int] = None
    ) -> List[Signal]:
        """
        Get all signals for a specific user.
        
        Args:
            db: Database session
            user_id: User ID string
            limit: Optional limit on number of results
            offset: Optional offset for pagination
            
        Returns:
            List of Signal objects
        """
        query = db.query(Signal).filter(Signal.user_id == user_id)
        query = query.order_by(desc(Signal.created_at))
        
        if offset:
            query = query.offset(offset)
        
        if limit:
            query = query.limit(limit)
        
        return query.all()
    
    @staticmethod
    def update_signal(
        db: Session,
        signal_id: UUID,
        update_data: dict
    ) -> Signal:
        """
        Update a signal.
        
        Args:
            db: Database session
            signal_id: Signal UUID
            update_data: Dictionary with fields to update
            
        Returns:
            Updated Signal object
            
        Raises:
            ValidationError: If signal not found
            DatabaseError: If update fails
        """
        signal = SignalService.get_signal_by_id(db, signal_id)
        if not signal:
            raise ValidationError("Signal not found")
        
        allowed_fields = [
            'user_notes', 'performance_outcome', 'close_price',
            'pnl', 'pnl_percent', 'closed_at'
        ]
        
        for field, value in update_data.items():
            if field in allowed_fields:
                setattr(signal, field, value)
        
        try:
            db.commit()
            db.refresh(signal)
            
            logger.info(f"Signal updated successfully: {signal_id}")
            return signal
            
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to update signal {signal_id}: {e}", exc_info=True)
            raise DatabaseError(f"Failed to update signal: {e}") from e
    
    @staticmethod
    def delete_signal(db: Session, signal_id: UUID) -> None:
        """
        Delete a signal.
        
        Args:
            db: Database session
            signal_id: Signal UUID
            
        Raises:
            ValidationError: If signal not found
            DatabaseError: If deletion fails
        """
        signal = SignalService.get_signal_by_id(db, signal_id)
        if not signal:
            raise ValidationError("Signal not found")
        
        channel_id = signal.channel_id
        
        try:
            db.delete(signal)
            
            # Update channel signal count
            channel = db.query(Channel).filter(Channel.id == channel_id).first()
            if channel and channel.signal_count:
                channel.signal_count = max(0, channel.signal_count - 1)
            
            db.commit()
            
            logger.info(f"Signal deleted successfully: {signal_id}")
            
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to delete signal {signal_id}: {e}", exc_info=True)
            raise DatabaseError(f"Failed to delete signal: {e}") from e

