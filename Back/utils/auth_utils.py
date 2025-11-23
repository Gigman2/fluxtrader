"""
Authentication utilities for protecting API routes.
"""

from functools import wraps
from flask import request, jsonify, g
from typing import Optional
from uuid import UUID

from utils.jwt_utils import verify_token, get_account_id_from_token
from utils.logger_utils import get_module_logger

logger = get_module_logger("utils.auth_utils")


def get_token_from_header() -> Optional[str]:
    """
    Extract JWT token from Authorization header.
    
    Expected format: "Bearer <token>"
    
    Returns:
        Token string if found, None otherwise
    """
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return None
    
    # Check if it starts with "Bearer "
    if auth_header.startswith('Bearer '):
        return auth_header[7:]  # Remove "Bearer " prefix
    
    return None


def auth_required(f):
    """
    Decorator to require authentication for a route.
    
    Extracts JWT token from Authorization header, validates it,
    and stores the account_id in Flask's g object for use in the route handler.
    
    Usage:
        @api_bp.route('/protected')
        @auth_required
        @db_session_required
        def protected_route():
            account_id = g.account_id  # Available here
            # ...
    
    Returns:
        401 Unauthorized if token is missing or invalid
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = get_token_from_header()
        
        if not token:
            logger.warning("Authentication required but no token provided")
            return jsonify({
                'success': False,
                'error': 'Authentication required. Please provide a valid token.'
            }), 401
        
        # Verify token and extract account_id
        account_id = get_account_id_from_token(token)
        
        if not account_id:
            logger.warning("Invalid or expired token provided")
            return jsonify({
                'success': False,
                'error': 'Invalid or expired token. Please login again.'
            }), 401
        
        # Store account_id in Flask's g object for use in route handler
        g.account_id = account_id
        
        # Also store the decoded token payload for additional info if needed
        payload = verify_token(token)
        if payload:
            g.token_payload = payload
        
        logger.debug(f"Authenticated request for account_id: {account_id}")
        return f(*args, **kwargs)
    
    return decorated_function


def get_current_account_id() -> Optional[UUID]:
    """
    Get the current authenticated account ID from Flask's g object.
    
    This should be called within a route decorated with @auth_required.
    
    Returns:
        Account UUID if authenticated, None otherwise
    """
    return getattr(g, 'account_id', None)

