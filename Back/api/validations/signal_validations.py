"""Request/Response schemas for signal API validation."""

from typing import Dict, Any, List, Optional
from decimal import Decimal


class SignalSchema:
    """Schema for Signal model."""
    
    @staticmethod
    def validate_create(data: dict) -> dict:
        """
        Validate signal creation data.
        Only requires channel_id and original_message_text.
        Extraction will be performed using active templates.
        
        Args:
            data: Dictionary with signal data
            
        Returns:
            Validated dictionary
            
        Raises:
            ValueError: If validation fails
        """
        required_fields = ['channel_id', 'original_message_text']
        missing = [field for field in required_fields if field not in data]
        if missing:
            raise ValueError(f"Missing required fields: {', '.join(missing)}")
        
        # Validate original_message_text is not empty
        if not data.get('original_message_text') or not str(data['original_message_text']).strip():
            raise ValueError("original_message_text cannot be empty")
        
        result = {
            'channel_id': data['channel_id'],
            'original_message_text': str(data['original_message_text']),
            'original_message_id': data.get('original_message_id'),
        }
        
        return result
    
    @staticmethod
    def validate_update(data: dict) -> dict:
        """
        Validate signal update data.
        
        Args:
            data: Dictionary with fields to update
            
        Returns:
            Validated dictionary
        """
        allowed_fields = [
            'user_notes', 'performance_outcome', 'close_price',
            'pnl', 'pnl_percent', 'closed_at'
        ]
        validated_data = {k: v for k, v in data.items() if k in allowed_fields}
        
        # Validate performance_outcome if provided
        if 'performance_outcome' in validated_data:
            valid_outcomes = ["WIN", "LOSS", "PENDING"]
            if validated_data['performance_outcome'] not in valid_outcomes:
                raise ValueError(f"Invalid performance_outcome. Must be one of: {', '.join(valid_outcomes)}")
        
        # Validate numeric fields
        numeric_fields = ['close_price', 'pnl', 'pnl_percent']
        for field in numeric_fields:
            if field in validated_data:
                try:
                    validated_data[field] = Decimal(str(validated_data[field]))
                except (ValueError, TypeError):
                    raise ValueError(f"{field} must be a valid number")
        
        return validated_data
    
    @staticmethod
    def serialize(signal) -> dict:
        """
        Serialize Signal model to dict.
        
        Args:
            signal: Signal model instance
            
        Returns:
            Dictionary representation
        """
        return {
            'id': str(signal.id),
            'channel_id': str(signal.channel_id),
            'template_id': str(signal.template_id),
            'user_id': signal.user_id,
            'original_message_id': signal.original_message_id,
            'original_message_text': signal.original_message_text,
            'symbol': signal.symbol,
            'entry_price': float(signal.entry_price) if signal.entry_price else None,
            'take_profits': signal.take_profits,
            'stop_loss': signal.stop_loss,
            'signal_type': signal.signal_type,
            'timeframe': signal.timeframe,
            'confidence_score': float(signal.confidence_score) if signal.confidence_score else None,
            'extraction_metadata': signal.extraction_metadata,
            'risk_reward_ratio': float(signal.risk_reward_ratio) if signal.risk_reward_ratio else None,
            'user_notes': signal.user_notes,
            'performance_outcome': signal.performance_outcome,
            'close_price': float(signal.close_price) if signal.close_price else None,
            'pnl': float(signal.pnl) if signal.pnl else None,
            'pnl_percent': float(signal.pnl_percent) if signal.pnl_percent else None,
            'closed_at': signal.closed_at.isoformat() if signal.closed_at else None,
            'created_at': signal.created_at.isoformat() if signal.created_at else None,
            'updated_at': signal.updated_at.isoformat() if signal.updated_at else None,
        }

