"""Signal API routes - handles HTTP request/response only."""

from flask import request, jsonify
from uuid import UUID

from api import api_bp
from api.validations.signal_validations import SignalSchema
from services.signal_service import SignalService
from utils.auth_utils import auth_required, get_current_account_id
from utils.database_utils import get_db, db_session_required
from utils.logger_utils import get_module_logger
from config.exceptions_handler import ValidationError

logger = get_module_logger("api.routes.signals")


@api_bp.route('/signals', methods=['POST'])
@auth_required
@db_session_required
def create_signal():
    """Create a new signal by extracting from message text."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                'success': False,
                'error': 'Request body is required'
            }), 400
        
        # Get current account ID from authenticated token
        account_id = get_current_account_id()
        if not account_id:
            return jsonify({
                'success': False,
                'error': 'Authentication required'
            }), 401
        
        # Validate input (only channel_id and original_message_text required)
        validated_data = SignalSchema.validate_create(data)
        
        # Convert channel_id to UUID
        try:
            channel_id = UUID(validated_data['channel_id'])
        except (ValueError, TypeError) as e:
            return jsonify({
                'success': False,
                'error': f'Invalid channel_id format: {str(e)}'
            }), 400
        
        # Extract and create signal using active templates
        db = get_db()
        signal = SignalService.extract_signal_from_message(
            db,
            channel_id=channel_id,
            original_message_text=validated_data['original_message_text'],
            user_id=str(account_id),
            original_message_id=validated_data.get('original_message_id')
        )
        
        logger.info(f"Signal created successfully: {signal.id}")
        return jsonify({
            'success': True,
            'data': SignalSchema.serialize(signal),
            'message': 'Signal extracted and created successfully'
        }), 201
        
    except ValidationError as e:
        logger.warning(f"Signal creation validation error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    except ValueError as e:
        logger.warning(f"Signal creation validation error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    except Exception as e:
        logger.error(f"Error creating signal: {e}", exc_info=True)
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@api_bp.route('/signals/<uuid:signal_id>', methods=['GET'])
@auth_required
@db_session_required
def get_signal(signal_id):
    """Get a specific signal by ID."""
    try:
        db = get_db()
        signal = SignalService.get_signal_by_id(db, signal_id)
        
        if not signal:
            logger.warning(f"Signal not found: {signal_id}")
            return jsonify({
                'success': False,
                'error': 'Signal not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': SignalSchema.serialize(signal)
        }), 200
        
    except Exception as e:
        logger.error(f"Error fetching signal {signal_id}: {e}", exc_info=True)
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@api_bp.route('/channels/<uuid:channel_id>/signals', methods=['GET'])
@auth_required
@db_session_required
def get_channel_signals(channel_id):
    """Get all signals for a specific channel."""
    try:
        # Get query parameters
        limit = request.args.get('limit', type=int)
        offset = request.args.get('offset', type=int)
        symbol = request.args.get('symbol')
        signal_type = request.args.get('signal_type')
        performance_outcome = request.args.get('performance_outcome')
        
        db = get_db()
        signals = SignalService.get_channel_signals(
            db,
            channel_id,
            limit=limit,
            offset=offset,
            symbol=symbol,
            signal_type=signal_type,
            performance_outcome=performance_outcome
        )
        
        return jsonify({
            'success': True,
            'data': [SignalSchema.serialize(s) for s in signals],
            'count': len(signals)
        }), 200
        
    except Exception as e:
        logger.error(f"Error fetching signals for channel {channel_id}: {e}", exc_info=True)
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@api_bp.route('/signals/user/me', methods=['GET'])
@auth_required
@db_session_required
def get_user_signals():
    """Get all signals for the authenticated user."""
    try:
        # Get current account ID from authenticated token
        account_id = get_current_account_id()
        if not account_id:
            return jsonify({
                'success': False,
                'error': 'Authentication required'
            }), 401
        
        # Get query parameters
        limit = request.args.get('limit', type=int)
        offset = request.args.get('offset', type=int)

        
        db = get_db()
        signals = SignalService.get_user_signals(
            db,
            str(account_id),  # Convert UUID to string since user_id is String(50)
            limit=limit,
            offset=offset
        )

        logger.info(f" Signals fetched successfully: {len(signals)}")

        
        return jsonify({
            'success': True,    
            'data': [SignalSchema.serialize(s) for s in signals],
            'count': len(signals)
        }), 200
        
    except Exception as e:
        logger.error(f"Error fetching signals for user {account_id}: {e}", exc_info=True)
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@api_bp.route('/signals/<uuid:signal_id>', methods=['PUT'])
@auth_required
@db_session_required
def update_signal(signal_id):
    """Update a signal."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                'success': False,
                'error': 'Request body is required'
            }), 400
        
        # Validate input
        validated_data = SignalSchema.validate_update(data)
        
        # Update signal via service
        db = get_db()
        signal = SignalService.update_signal(db, signal_id, validated_data)
        
        logger.info(f"Signal updated successfully: {signal_id}")
        return jsonify({
            'success': True,
            'data': SignalSchema.serialize(signal),
            'message': 'Signal updated successfully'
        }), 200
        
    except ValidationError as e:
        logger.warning(f"Signal update validation error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    except ValueError as e:
        logger.warning(f"Signal update validation error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    except Exception as e:
        logger.error(f"Error updating signal {signal_id}: {e}", exc_info=True)
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@api_bp.route('/signals/<uuid:signal_id>', methods=['DELETE'])
@auth_required
@db_session_required
def delete_signal(signal_id):
    """Delete a signal."""
    try:
        db = get_db()
        SignalService.delete_signal(db, signal_id)
        
        logger.info(f"Signal deleted successfully: {signal_id}")
        return jsonify({
            'success': True,
            'message': 'Signal deleted successfully'
        }), 200
        
    except ValidationError as e:
        logger.warning(f"Signal deletion error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 404
    except Exception as e:
        logger.error(f"Error deleting signal {signal_id}: {e}", exc_info=True)
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

