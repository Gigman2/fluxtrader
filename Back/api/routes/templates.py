"""Template API routes - handles HTTP request/response only."""

from flask import request, jsonify
from uuid import UUID

from api import api_bp
from api.validations.template_validations import TemplateSchema
from services.template_service import TemplateService
from utils.auth_utils import auth_required, get_current_account_id
from utils.database_utils import get_db, db_session_required
from utils.logger_utils import get_module_logger
from config.exceptions_handler import ValidationError

logger = get_module_logger("api.routes.templates")


@api_bp.route('/templates', methods=['POST'])
@auth_required
@db_session_required
def create_template():
    """Create a new template."""
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
        
        # Validate input
        validated_data = TemplateSchema.validate_create(data)
        
        # Convert channel_id to UUID
        try:
            channel_id = UUID(validated_data['channel_id'])
        except (ValueError, TypeError):
            return jsonify({
                'success': False,
                'error': 'Invalid channel_id format'
            }), 400
        
        # Create template via service
        db = get_db()
        template = TemplateService.create_template(
            db,
            channel_id=channel_id,
            extraction_config=validated_data['extraction_config'],
            created_by=account_id,
            test_message=validated_data.get('test_message'),
            is_active=validated_data.get('is_active', True)
        )
        
        logger.info(f"Template created successfully: {template.id}")
        return jsonify({
            'success': True,
            'data': TemplateSchema.serialize(template),
            'message': 'Template created successfully'
        }), 201
        
    except ValidationError as e:
        logger.warning(f"Template creation validation error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    except ValueError as e:
        logger.warning(f"Template creation validation error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    except Exception as e:
        logger.error(f"Error creating template: {e}", exc_info=True)
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@api_bp.route('/templates/<uuid:template_id>', methods=['GET'])
@auth_required
@db_session_required
def get_template(template_id):
    """Get a specific template by ID."""
    try:
        db = get_db()
        template = TemplateService.get_template_by_id(db, template_id)
        
        if not template:
            logger.warning(f"Template not found: {template_id}")
            return jsonify({
                'success': False,
                'error': 'Template not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': TemplateSchema.serialize(template)
        }), 200
        
    except Exception as e:
        logger.error(f"Error fetching template {template_id}: {e}", exc_info=True)
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@api_bp.route('/channels/<uuid:channel_id>/templates', methods=['GET'])
@auth_required
@db_session_required
def get_channel_templates(channel_id):
    """Get all templates for a specific channel."""
    try:
        active_only = request.args.get('active_only', 'false').lower() == 'true'
        
        db = get_db()
        templates = TemplateService.get_channel_templates(
            db,
            channel_id,
            active_only=active_only
        )
        
        return jsonify({
            'success': True,
            'data': [TemplateSchema.serialize(t) for t in templates],
            'count': len(templates)
        }), 200
        
    except Exception as e:
        logger.error(f"Error fetching templates for channel {channel_id}: {e}", exc_info=True)
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@api_bp.route('/templates/<uuid:template_id>', methods=['PUT'])
@auth_required
@db_session_required
def update_template(template_id):
    """Update an existing template."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                'success': False,
                'error': 'Request body is required'
            }), 400
        
        # Validate input
        validated_data = TemplateSchema.validate_update(data)
        
        # Update template via service
        db = get_db()
        template = TemplateService.update_template(db, template_id, validated_data)
        
        logger.info(f"Template updated successfully: {template_id}")
        return jsonify({
            'success': True,
            'data': TemplateSchema.serialize(template),
            'message': 'Template updated successfully'
        }), 200
        
    except ValidationError as e:
        logger.warning(f"Template update validation error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    except ValueError as e:
        logger.warning(f"Template update validation error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    except Exception as e:
        logger.error(f"Error updating template {template_id}: {e}", exc_info=True)
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@api_bp.route('/templates/<uuid:template_id>', methods=['DELETE'])
@auth_required
@db_session_required
def delete_template(template_id):
    """Delete a template."""
    try:
        db = get_db()
        TemplateService.delete_template(db, template_id)
        
        logger.info(f"Template deleted successfully: {template_id}")
        return jsonify({
            'success': True,
            'message': 'Template deleted successfully'
        }), 200
        
    except ValidationError as e:
        logger.warning(f"Template deletion error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 404
    except Exception as e:
        logger.error(f"Error deleting template {template_id}: {e}", exc_info=True)
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@api_bp.route('/templates/<uuid:template_id>/toggle-active', methods=['PUT'])
@auth_required
@db_session_required
def toggle_template_active(template_id):
    """Toggle template active status."""
    try:
        db = get_db()
        template = TemplateService.toggle_template_active(db, template_id)
        
        logger.info(f"Template {template_id} active status toggled")
        return jsonify({
            'success': True,
            'data': TemplateSchema.serialize(template),
            'message': 'Template status updated successfully'
        }), 200
        
    except ValidationError as e:
        logger.warning(f"Template toggle error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 404
    except Exception as e:
        logger.error(f"Error toggling template {template_id}: {e}", exc_info=True)
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

