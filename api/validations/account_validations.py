"""Request/Response schemas for API validation."""


from utils.password_utils import hash_password

import re

class AccountSchema:
    """Schema for Account model."""
    
    @staticmethod
    def validate_create(data: dict) -> dict:
        """
        Validate account creation data.
        
        Automatically hashes the password before returning.
        """
        required_fields = ['username', 'password']
        missing = [field for field in required_fields if field not in data]
        if missing:
            raise ValueError(f"Missing required fields: {', '.join(missing)}")
        
        # Validate password strength (optional but recommended)
        password = str(data['password'])
        if len(password) < 8:
            raise ValueError("Password must be at least 8 characters long")

        # strip whitespace from username
        username = str(data['username']).strip()
        if not username:
            raise ValueError("Username cannot be empty")

        # validate username format
        if not re.match(r'^[a-zA-Z0-9_]+$', username):
            raise ValueError("Username can only contain letters, numbers, and underscores")

        
        # Hash the password before storing
        hashed_password = hash_password(password)
        
        return {
            'username': username,
            'password': hashed_password,  # Store hashed password, not plain text
        }
    
    @staticmethod
    def validate_update(data: dict) -> dict:
        """
        Validate account update data.
        
        If password is provided, it will be hashed automatically.
        """
        allowed_fields = ['username', 'password', 'account_balance', 'risk_per_trade', 
                         'max_drawdown', 'telegram_connected', 'mt5_connected']
        
        validated_data = {k: v for k, v in data.items() if k in allowed_fields}
        
        # Hash password if provided
        if 'password' in validated_data:
            password = str(validated_data['password'])
            if len(password) < 8:
                raise ValueError("Password must be at least 8 characters long")
            validated_data['password'] = hash_password(password)
        
        return validated_data

    
    @staticmethod
    def validate_account_balance(data: dict) -> dict:
        """Validate account balance data."""
        if not isinstance(data['account_balance'], (int, float)) or data['account_balance'] < 0:
            raise ValueError("account_balance must be a positive number")
        return data['account_balance']


    @staticmethod
    def validate_risk_per_trade(data: dict) -> dict:
        """Validate risk per trade data."""
        if not isinstance(data['risk_per_trade'], (int, float)) or not (0 < data['risk_per_trade'] <= 100):
            raise ValueError("risk_per_trade must be between 0 and 100")
        return data['risk_per_trade']


    @staticmethod
    def validate_max_drawdown(data: dict) -> dict:
        """Validate max drawdown data."""
        if not isinstance(data['max_drawdown'], (int, float)) or not (0 < data['max_drawdown'] <= 100):
            raise ValueError("max_drawdown must be between 0 and 100")
        return data['max_drawdown']

    @staticmethod
    def serialize(account) -> dict:
        """Serialize Account model to dict."""
        return {
            'id': str(account.id),
            'username': account.username,
            'account_balance': float(account.account_balance),
            'risk_per_trade': float(account.risk_per_trade),
            'max_drawdown': float(account.max_drawdown),
            'telegram_connected': account.telegram_connected,
            'mt5_connected': account.mt5_connected,
            'created_at': account.created_at.isoformat() if account.created_at else None,
            'updated_at': account.updated_at.isoformat() if account.updated_at else None,
        }

