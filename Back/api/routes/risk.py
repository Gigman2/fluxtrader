"""Risk management API routes - handles HTTP request/response only."""

from flask import request, jsonify, g
from uuid import UUID

from utils.database_utils import get_db, db_session_required
from utils.auth_utils import auth_required, get_current_account_id
from utils.logger_utils import get_module_logger

from api import api_bp
from api.validations.risk_validations import RiskSchema
from services.risk_service import RiskService
from config.exceptions_handler import DatabaseError, ValidationError
from api.validations.account_validations import AccountSchema

# Get logger for this module
logger = get_module_logger("api.routes.risk")


@api_bp.route('/risk/settings', methods=['GET'])
@auth_required
@db_session_required
def get_risk_settings():
    """Get risk settings for the authenticated account."""
    try:
        account_id = get_current_account_id()
        if not account_id:
            return jsonify({
                'success': False,
                'error': 'Authentication required'
            }), 401
        
        logger.info(f"Fetching risk settings for account: {account_id}")
        db = get_db()
        risk_settings = RiskService.get_risk_settings(db, account_id)
        
        logger.info(f"Successfully retrieved risk settings for account: {account_id}")
        return jsonify({
            'success': True,
            'data': risk_settings
        }), 200
    except ValidationError as e:
        logger.warning(f"Validation error fetching risk settings: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 404
    except Exception as e:
        logger.error(f"Error fetching risk settings: {e}", exc_info=True)
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@api_bp.route('/risk/settings', methods=['PUT'])
@auth_required
@db_session_required
def update_risk_settings():
    """Update risk settings for the authenticated account."""
    try:
        account_id = get_current_account_id()
        if not account_id:
            return jsonify({
                'success': False,
                'error': 'Authentication required'
            }), 401
        
        data = request.get_json()
        if not data:
            logger.warning(f"Update risk settings request missing body for account: {account_id}")
            return jsonify({
                'success': False,
                'error': 'Request body is required'
            }), 400
        
        logger.info(f"Updating risk settings for account: {account_id}, fields: {list(data.keys())}")
        
        # Validate input
        validated_data = RiskSchema.validate_update_risk(data)
        
        # Update risk settings via service
        db = get_db()
        account = RiskService.update_risk_settings(db, account_id, validated_data)
        
        logger.info(f"Risk settings updated successfully for account: {account_id}")
        return jsonify({
            'success': True,
            'data': AccountSchema.serialize(account),
            'message': 'Risk settings updated successfully'
        }), 200
    
    except ValueError as e:
        logger.warning(f"Validation error updating risk settings: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    except ValidationError as e:
        logger.warning(f"Account not found for risk settings update: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 404
    except Exception as e:
        logger.error(f"Error updating risk settings: {e}", exc_info=True)
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
