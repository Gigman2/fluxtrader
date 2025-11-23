from flask import Flask

from config.database_handler import DatabaseConnectionHandler
from api import api_bp
from utils import close_db

def create_app() -> Flask:
    app = Flask(__name__)

    # Register API blueprint
    app.register_blueprint(api_bp)
    
    # Register database teardown function
    app.teardown_appcontext(close_db)

    # Initialize database (only creates tables if they don't exist)
    db = DatabaseConnectionHandler()
    try:
        db.init_db()
    except Exception:
        pass

    return app

__all__ = ["create_app"]