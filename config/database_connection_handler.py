from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import QueuePool

from config.env_handler import EnvHandler

class DatabaseConnectionHandler:
    DEFAULT_POOL_SIZE = 10
    DEFAULT_MAX_OVERFLOW = 20
    DEFAULT_POOL_PRE_PING = True
    DEFAULT_POOL_RECYCLE = 1800

    def __init__(self):
        self.env_handler = EnvHandler()
        self.database_url = self.env_handler.get_database_url()
       

    def get_engine(self):
        """Create and return database engine."""
        try:
            engine = create_engine(
                self.database_url,
                echo=True,
                poolclass=QueuePool,
                pool_size=self.DEFAULT_POOL_SIZE,
                max_overflow=self.DEFAULT_MAX_OVERFLOW,
                pool_pre_ping=self.DEFAULT_POOL_PRE_PING,
                pool_recycle=self.DEFAULT_POOL_RECYCLE,
            )
            return engine
        except Exception as e:
            raise Exception(f"Failed to create database engine: {e}")