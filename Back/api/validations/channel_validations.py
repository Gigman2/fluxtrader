"""Request/Response schemas for API validation."""

from datetime import datetime
from typing import Optional
from uuid import UUID

from models.channel import STATUS_ACTIVE


class ChannelSchema:
    """Schema for Channel model."""
    
    @staticmethod
    def validate_create(data: dict) -> dict:
        """Validate channel creation data."""
        required_fields = ['name', 'telegram_channel_id']
        missing = [field for field in required_fields if field not in data]
        if missing:
            raise ValueError(f"Missing required fields: {', '.join(missing)}")
        
        result = {
            'name': str(data['name']),
            'telegram_channel_id': str(data['telegram_channel_id']),
            'status': data.get('status', STATUS_ACTIVE),
            'connection_status': data.get('connection_status', "disconnected"),
        }
        
        # Handle account_id - keep as string, will be converted to UUID in route
        if 'account_id' in data and data['account_id']:
            result['account_id'] = data['account_id']

        return result
    
    @staticmethod
    def validate_update(data: dict) -> dict:
        """Validate channel update data."""
        allowed_fields = ['name', 'description', 'telegram_channel_id', 'account_id', 
                         'status', 'connection_status', 'signal_count']
        return {k: v for k, v in data.items() if k in allowed_fields}
    
    @staticmethod
    def serialize(channel) -> dict:
        """Serialize Channel model to dict."""
        return {
            'id': str(channel.id),
            'account_id': str(channel.account_id) if channel.account_id else None,
            'name': channel.name,
            'telegram_channel_id': channel.telegram_channel_id,
            'status': channel.status,
            'connection_status': channel.connection_status,
            'signal_count': channel.signal_count,
            'created_at': channel.created_at.isoformat() if channel.created_at else None,
            'updated_at': channel.updated_at.isoformat() if channel.updated_at else None,
        }

