"""Account API routes - handles HTTP request/response only."""

from flask import request, jsonify
from uuid import UUID

from utils.database_utils import get_db, db_session_required
from utils.logger_utils import get_module_logger

from api import api_bp
from api.validations.account_validations import AccountSchema
from services.account_service import AccountService
from config.exceptions_handler import DatabaseError, ValidationError

# Get logger for this module
logger = get_module_logger("api.routes.accounts")


@api_bp.route('/accounts', methods=['GET'])
@db_session_required
def list_accounts():
    """Get all accounts."""
    try:
        logger.info("Fetching all accounts")
        db = get_db()
        accounts = AccountService.get_all_accounts(db)
        
        logger.info(f"Successfully retrieved {len(accounts)} accounts")
        return jsonify({
            'success': True,
            'data': [AccountSchema.serialize(account) for account in accounts],
            'count': len(accounts)
        }), 200
    except Exception as e:
        logger.error(f"Error fetching accounts: {e}", exc_info=True)
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@api_bp.route('/accounts/<uuid:account_id>', methods=['GET'])
@db_session_required
def get_account(account_id):
    """Get a specific account by ID."""
    try:
        logger.debug(f"Fetching account: {account_id}")
        db = get_db()
        account = AccountService.get_account_by_id(db, account_id)
        
        if not account:
            logger.warning(f"Account not found: {account_id}")
            return jsonify({
                'success': False,
                'error': 'Account not found'
            }), 404
        
        logger.debug(f"Successfully retrieved account: {account_id}")
        return jsonify({
            'success': True,
            'data': AccountSchema.serialize(account)
        }), 200
    except Exception as e:
        logger.error(f"Error fetching account {account_id}: {e}", exc_info=True)
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@api_bp.route('/accounts', methods=['POST'])
@db_session_required
def create_account():
    """Create a new account."""
    try:
        data = request.get_json()
        if not data:
            logger.warning("Create account request missing body")
            return jsonify({
                'success': False,
                'error': 'Request body is required'
            }), 400
        
        logger.info(f"Creating account for username: {data.get('username', 'unknown')}")
        
        # Validate input
        validated_data = AccountSchema.validate_create(data)
        
        # Create account via service
        db = get_db()
        account = AccountService.create_account(db, validated_data)
        
        logger.info(f"Account created successfully: {account.id} (username: {account.username})")
        return jsonify({
            'success': True,
            'data': AccountSchema.serialize(account),
            'message': 'Account created successfully'
        }), 201
    
    except ValueError as e:
        logger.warning(f"Validation error creating account: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    except DatabaseError as e:
        logger.error(f"Database error creating account: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 409
    except Exception as e:
        logger.error(f"Unexpected error creating account: {e}", exc_info=True)
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@api_bp.route('/accounts/<uuid:account_id>', methods=['PUT'])
@db_session_required
def update_account(account_id):
    """Update an existing account."""
    try:
        data = request.get_json()
        if not data:
            logger.warning(f"Update account request missing body for account: {account_id}")
            return jsonify({
                'success': False,
                'error': 'Request body is required'
            }), 400
        
        logger.info(f"Updating account: {account_id}, fields: {list(data.keys())}")
        
        # Validate input
        validated_data = AccountSchema.validate_update(data)
        
        # Update account via service
        db = get_db()
        account = AccountService.update_account(db, account_id, validated_data)
        
        logger.info(f"Account updated successfully: {account_id}")
        return jsonify({
            'success': True,
            'data': AccountSchema.serialize(account),
            'message': 'Account updated successfully'
        }), 200
    
    except ValidationError as e:
        logger.warning(f"Account not found for update: {account_id}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 404
    except ValueError as e:
        logger.warning(f"Validation error updating account {account_id}: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    except Exception as e:
        logger.error(f"Error updating account {account_id}: {e}", exc_info=True)
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@api_bp.route('/accounts/<uuid:account_id>', methods=['DELETE'])
@db_session_required
def delete_account(account_id):
    """Delete an account. Associated channels will be set to ORPHAN status."""
    try:
        logger.info(f"Deleting account: {account_id}")
        db = get_db()
        AccountService.delete_account(db, account_id)
        
        logger.info(f"Account deleted successfully: {account_id} (channels set to ORPHAN)")
        return jsonify({
            'success': True,
            'message': 'Account deleted successfully. Associated channels have been set to ORPHAN status.'
        }), 200
    
    except ValidationError as e:
        logger.warning(f"Account not found for deletion: {account_id}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 404
    except Exception as e:
        logger.error(f"Error deleting account {account_id}: {e}", exc_info=True)
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@api_bp.route('/login', methods=['POST'])
def login():
    """Login to the system."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                'success': False,
                'error': 'Request body is required'
            }), 400
        
        # Validate input
        validated_data = AccountSchema.validate_login(data)
        
        # Login via service
        db = get_db()
        account = AccountService.login(db, validated_data)
        
        return jsonify({
            'success': True,
            'data': AccountSchema.serialize(account),
            'message': 'Login successful'
        }), 200
    
    except ValidationError as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    except Exception as e:
        logger.error(f"Error logging in: {e}", exc_info=True)
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# @api_bp.route('/accounts/<uuid:account_id>/channels', methods=['GET'])
# @db_session_required
# def get_account_channels(account_id):
#     """Get all channels for a specific account."""
#     try:
#         db = get_db()
#         channels = AccountService.get_account_channels(db, account_id)
        
#         from api.schemas import ChannelSchema
#         return jsonify({
#             'success': True,
#             'data': [ChannelSchema.serialize(channel) for channel in channels],
#             'count': len(channels)
#         }), 200
#     except ValidationError as e:
#         return jsonify({
#             'success': False,
#             'error': str(e)
#         }), 404
#     except Exception as e:
#         return jsonify({
#             'success': False,
#             'error': str(e)
#         }), 500

