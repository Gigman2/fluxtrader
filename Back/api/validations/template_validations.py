"""Request/Response schemas for template API validation."""

from typing import Dict, Any
from uuid import UUID


class TemplateSchema:
    """Schema for Template model."""
    
    @staticmethod
    def validate_create(data: dict) -> dict:
        """
        Validate template creation data.
        
        Args:
            data: Dictionary with template data
            
        Returns:
            Validated dictionary
            
        Raises:
            ValueError: If validation fails
        """
        required_fields = ['channel_id', 'extraction_config']
        missing = [field for field in required_fields if field not in data]
        if missing:
            raise ValueError(f"Missing required fields: {', '.join(missing)}")
        
        # Validate extraction_config is a dict
        extraction_config = data.get('extraction_config')
        if not isinstance(extraction_config, dict):
            raise ValueError("extraction_config must be a dictionary")
        
        # Validate extraction_config has fields
        if 'fields' not in extraction_config or not isinstance(extraction_config['fields'], list):
            raise ValueError("extraction_config must contain a 'fields' array")
        
        if len(extraction_config['fields']) == 0:
            raise ValueError("extraction_config must contain at least one field")
        
        # Validate each field has required properties
        for i, field in enumerate(extraction_config['fields']):
            if not isinstance(field, dict):
                raise ValueError(f"Field at index {i} must be a dictionary")
            
            field_required = ['name', 'key', 'type', 'method', 'regex']
            field_missing = [prop for prop in field_required if prop not in field]
            if field_missing:
                raise ValueError(f"Field at index {i} missing required properties: {', '.join(field_missing)}")
            
            # Validate field type
            if field['type'] not in ['string', 'number', 'array']:
                raise ValueError(f"Field at index {i} has invalid type. Must be 'string', 'number', or 'array'")
            
            # Validate method
            if field['method'] not in ['regex', 'marker']:
                raise ValueError(f"Field at index {i} has invalid method. Must be 'regex' or 'marker'")
        
        result = {
            'channel_id': data['channel_id'],
            'extraction_config': extraction_config,
            'test_message': data.get('test_message'),
            'is_active': data.get('is_active', True),
        }
        
        return result
    
    @staticmethod
    def validate_update(data: dict) -> dict:
        """
        Validate template update data.
        
        Args:
            data: Dictionary with fields to update
            
        Returns:
            Validated dictionary
        """
        allowed_fields = ['extraction_config', 'test_message', 'is_active']
        validated_data = {k: v for k, v in data.items() if k in allowed_fields}
        
        # If extraction_config is provided, validate it
        if 'extraction_config' in validated_data:
            extraction_config = validated_data['extraction_config']
            if not isinstance(extraction_config, dict):
                raise ValueError("extraction_config must be a dictionary")
            
            if 'fields' in extraction_config:
                if not isinstance(extraction_config['fields'], list):
                    raise ValueError("extraction_config.fields must be an array")
        
        return validated_data
    
    @staticmethod
    def serialize(template) -> dict:
        """
        Serialize Template model to dict.
        
        Args:
            template: Template model instance
            
        Returns:
            Dictionary representation
        """
        return {
            'id': str(template.id),
            'channel_id': str(template.channel_id),
            'version': template.version,
            'extraction_config': template.extraction_config,
            'test_message': template.test_message,
            'is_active': template.is_active,
            'extraction_success_rate': template.extraction_success_rate,
            'last_used_at': template.last_used_at.isoformat() if template.last_used_at else None,
            'created_at': template.created_at.isoformat() if template.created_at else None,
            'updated_at': template.updated_at.isoformat() if template.updated_at else None,
            'created_by': str(template.created_by),
        }

