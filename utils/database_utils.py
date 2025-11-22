"""
API layer database utilities.

These utilities are Flask-specific and handle database sessions within the HTTP request lifecycle.
They use Flask's `g` object to store sessions per request.

For non-HTTP contexts (CLI, background jobs, etc.), use DatabaseConnectionHandler directly:
    db_handler = DatabaseConnectionHandler()
    db_gen = db_handler.get_db()
    db = next(db_gen)
    # ... use db ...
    db.close()
"""

from functools import wraps
from flask import g
from config.database_handler import DatabaseConnectionHandler

# Global database handler instance (shared across requests)
_db_handler = None


def get_db_handler() -> DatabaseConnectionHandler:
    """
    Get or create database handler instance.
    
    This is a singleton pattern - creates one handler instance shared across requests.
    The handler itself manages connection pooling.
    """
    global _db_handler
    if _db_handler is None:
        _db_handler = DatabaseConnectionHandler()
    return _db_handler


def get_db():
    """
    Get database session for current Flask request.
    
    Uses Flask's `g` object to store the session for the request lifecycle.
    This ensures one session per HTTP request.
    
    Returns:
        SQLAlchemy Session instance
        
    Note:
        This is Flask-specific. For non-HTTP contexts, use DatabaseConnectionHandler.get_db() directly.
    """
    if 'db' not in g:
        db_gen = get_db_handler().get_db()
        g.db = next(db_gen)
        g.db_gen = db_gen
    
    return g.db


def close_db(error=None):
    """
    Close database session after Flask request completes.
    
    This is registered as a Flask teardown function and runs automatically
    after each request, even if an error occurred.
    
    Args:
        error: Exception that occurred during request (if any)
    """
    db = g.pop('db', None)
    if db is not None:
        db_gen = g.pop('db_gen', None)
        if db_gen:
            try:
                next(db_gen, None)  # Consume generator to trigger finally block
            except StopIteration:
                pass
        db.close()


def db_session_required(f):
    """
    Decorator to ensure database session is available in route handler.
    
    Automatically calls get_db() to ensure session exists in Flask's g object.
    
    Usage:
        @api_bp.route('/endpoint')
        @db_session_required
        def my_route():
            db = get_db()  # Session is now available
            # ...
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        db = get_db()
        return f(*args, **kwargs)
    return decorated_function

