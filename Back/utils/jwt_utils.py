"""JWT token utilities for authentication."""

import jwt
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict
from uuid import UUID

from config.env_handler import EnvHandler

env_handler = EnvHandler()

# Get JWT secret from environment (fallback to default for development)
JWT_SECRET = env_handler.get_env("JWT_SECRET_KEY") or "your-secret-key-change-in-production"
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = env_handler.get_env("JWT_EXPIRATION_HOURS") or 24


def generate_token(account_id: UUID, username: str) -> str:
    """
    Generate a JWT token for an account.
    
    Args:
        account_id: Account UUID
        username: Account username
        
    Returns:
        JWT token string
    """
    payload = {
        "account_id": str(account_id),
        "username": username,
        "iat": datetime.now(timezone.utc),  # Issued at
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS),  # Expiration
    }
    
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token


def verify_token(token: str) -> Optional[Dict]:
    """
    Verify and decode a JWT token.
    
    Args:
        token: JWT token string
        
    Returns:
        Decoded token payload if valid, None otherwise
    """
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None  # Token has expired
    except jwt.InvalidTokenError:
        return None  # Token is invalid


def get_account_id_from_token(token: str) -> Optional[UUID]:
    """
    Extract account ID from a JWT token.
    
    Args:
        token: JWT token string
        
    Returns:
        Account UUID if token is valid, None otherwise
    """
    payload = verify_token(token)
    if payload and "account_id" in payload:
        try:
            return UUID(payload["account_id"])
        except (ValueError, TypeError):
            return None
    return None

