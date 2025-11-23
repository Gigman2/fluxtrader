from flask import Flask
from flask_cors import CORS

from config.env_handler import EnvHandler
from config.database_handler import DatabaseConnectionHandler
from api import api_bp
from utils import close_db

def create_app() -> Flask:
    app = Flask(__name__)
    env_handler = EnvHandler()
    frontend_url = env_handler.get_env("FRONTEND_URL")

    # Enable CORS for all routes

    CORS(app, origins=frontend_url.split(","), supports_credentials=True)

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