"""Channel API routes - handles HTTP request/response only."""

from flask import request, jsonify
from uuid import UUID

from utils.auth_utils import auth_required, get_current_account_id
from api import api_bp
from api.validations.channel_validations import ChannelSchema

from utils import get_db, db_session_required, get_module_logger
from services.channel_service import ChannelService
from config.exceptions_handler import DatabaseError, ValidationError


logger = get_module_logger("api.routes.channels")

@api_bp.route('/accounts/channels', methods=['GET'])
@db_session_required
@auth_required
def list_account_channels():
    """Get all channels for the authenticated account."""
    try:
        db = get_db()
        
        # Parse query parameters
        status = request.args.get('status')
        account_id = get_current_account_id()
        

        
        # Get channels via service
        channels = ChannelService.get_all_channels(
            db,
            status=status,
            account_id=account_id,
        )
        
        return jsonify({
            'success': True,
            'data': [ChannelSchema.serialize(channel) for channel in channels],
            'count': len(channels)
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@api_bp.route('/channels/<uuid:channel_id>', methods=['GET'])
@db_session_required
def get_channel(channel_id):
    """Get a specific channel by ID."""
    try:
        db = get_db()
        channel = ChannelService.get_channel_by_id(db, channel_id)
        
        if not channel:
            return jsonify({
                'success': False,
                'error': 'Channel not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': ChannelSchema.serialize(channel)
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@api_bp.route('/channels', methods=['POST'])
@db_session_required
@auth_required
def create_channel():
    """Create a new channel."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                'success': False,
                'error': 'Request body is required'
            }), 400
        
        # Validate input
        validated_data = ChannelSchema.validate_create(data)

        current_account_id = get_current_account_id()
        
        validated_data['account_id'] = current_account_id
        
        # Create channel via service
        db = get_db()
        channel = ChannelService.create_channel(db, validated_data)
        
        return jsonify({
            'success': True,
            'data': ChannelSchema.serialize(channel),
            'message': 'Channel created successfully'
        }), 201
    
    except ValueError as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    except ValidationError as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 404
    except DatabaseError as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 409
    except Exception as e:
        logger.error(f"Error creating channel: {e}", exc_info=True)
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@api_bp.route('/channels/<uuid:channel_id>', methods=['PUT'])
@db_session_required
def update_channel(channel_id):
    """Update an existing channel."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                'success': False,
                'error': 'Request body is required'
            }), 400
        
        # Validate input
        validated_data = ChannelSchema.validate_update(data)
        
        # Convert account_id to UUID if provided
        if 'account_id' in validated_data and validated_data['account_id']:
            try:
                validated_data['account_id'] = UUID(validated_data['account_id'])
            except ValueError:
                return jsonify({
                    'success': False,
                    'error': 'Invalid account_id format'
                }), 400
        
        # Update channel via service
        db = get_db()
        channel = ChannelService.update_channel(db, channel_id, validated_data)
        
        return jsonify({
            'success': True,
            'data': ChannelSchema.serialize(channel),
            'message': 'Channel updated successfully'
        }), 200
    
    except ValidationError as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 404
    except ValueError as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@api_bp.route('/channels/<uuid:channel_id>', methods=['DELETE'])
@db_session_required
def delete_channel(channel_id):
    """Delete a channel."""
    try:
        db = get_db()
        ChannelService.delete_channel(db, channel_id)
        
        return jsonify({
            'success': True,
            'message': 'Channel deleted successfully'
        }), 200
    
    except ValidationError as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 404
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
