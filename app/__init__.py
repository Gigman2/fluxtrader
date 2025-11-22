from flask import Flask

from config.database_handler import DatabaseConnectionHandler
    
def create_app() -> Flask:
    app = Flask(__name__)

    # Initialize database
    db = DatabaseConnectionHandler()
    db.init_db()

    return app

__all__ = ["create_app"]