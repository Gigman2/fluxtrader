from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import QueuePool

from config.logging_handler import LoggingHandler
from config.env_handler import EnvHandler
from config.exceptions_handler import DatabaseError

# Create the declarative base - this is what all models inherit from
Base = declarative_base()

# Export Base for use in models
__all__ = ["Base", "DatabaseConnectionHandler"]

class DatabaseConnectionHandler:
    DEFAULT_POOL_SIZE = 10
    DEFAULT_MAX_OVERFLOW = 20
    DEFAULT_POOL_PRE_PING = True
    DEFAULT_POOL_RECYCLE = 1800

    def __init__(self, base=None):
        """
        Initialize database connection handler.
        
        Args:
            base: SQLAlchemy declarative_base instance (optional)
                 If not provided, uses the default Base defined in this module
                 Can also be set later via set_base()
        """
        self.env_handler = EnvHandler()
        self.logger = LoggingHandler().get_logger("database")
        self.database_url = self.env_handler.get_database_url()
        self._engine = None
        self._session_factory = None
        # Use provided base or default Base (defined above)
        self._base = base or Base

    def get_engine(self):
        """Create and return database engine (singleton pattern)."""
        if self._engine is None:
            try:
                self._engine = create_engine(
                    self.database_url,
                    echo=True,
                    poolclass=QueuePool,
                    pool_size=self.DEFAULT_POOL_SIZE,
                    max_overflow=self.DEFAULT_MAX_OVERFLOW,
                    pool_pre_ping=self.DEFAULT_POOL_PRE_PING,
                    pool_recycle=self.DEFAULT_POOL_RECYCLE,
                )
                self.logger.info("Database engine created successfully")
            except Exception as e:
                self.logger.error(f"Failed to create database engine: {e}")
                raise DatabaseError(f"Failed to create database engine: {e}")
        return self._engine


    def get_session_factory(self):
        """Create and return sessionmaker factory (singleton pattern)."""
        if self._session_factory is None:
            try:
                self._session_factory = sessionmaker(
                    autocommit=False,
                    autoflush=False,
                    bind=self.get_engine(),
                    expire_on_commit=False,
                )
                self.logger.info("Session factory created successfully")
            except Exception as e:
                self.logger.error(f"Failed to create session factory: {e}")
                raise DatabaseError(f"Failed to create session factory: {e}")
        return self._session_factory

    def get_db(self):
        """
        Dependency injection function for FastAPI to get database session.
        
        This is a generator function that:
        1. Creates a new database session
        2. Yields it for use in the request
        3. Rolls back on exception
        4. Closes the session in finally block
        
        Usage in FastAPI:
            @app.get("/users")
            def get_users(db: Session = Depends(db_handler.get_db)):
                return db.query(User).all()
        
        Yields:
            Database session instance
        
        Raises:
            DatabaseError: If session creation or operation fails
        """
        db = None
        try:
            # Create actual session instance from sessionmaker
            SessionLocal = self.get_session_factory()
            db = SessionLocal()
            yield db
        except Exception as e:
            if db:
                db.rollback()
            self.logger.error(f"Database session error: {e}")
            raise DatabaseError(f"Database session error: {e}")
        finally:
            if db:
                db.close()


    def set_base(self, base):
        """
        Set the declarative base for table operations.
        
        Args:
            base: SQLAlchemy declarative_base instance
        """
        self._base = base
        self.logger.info("Base metadata set for database operations")

    def init_db(self, base=None):
        """
        Initialize database by creating all tables.
        
        Args:
            base: SQLAlchemy declarative_base instance (optional)
                 If not provided, uses the default Base defined in this module
                 If provided, temporarily uses this base for this operation
        
        Raises:
            DatabaseError: If no base is available or initialization fails
        """
        # Use provided base, instance base, or default Base
        base_to_use = base or self._base or Base
        
        if base_to_use is None:
            raise DatabaseError(
                "No base available. Make sure database.py exists with Base definition, "
                "or pass base as argument: DatabaseConnectionHandler(base=Base)"
            )
        
        try:
            base_to_use.metadata.create_all(bind=self.get_engine())
            self.logger.info("Database tables created successfully")
        except Exception as e:
            self.logger.error(f"Failed to initialize database: {e}")
            raise DatabaseError(f"Failed to initialize database: {e}")

    def drop_all_tables(self, base=None):
        """
        Drop all tables from the database.
        
        Args:
            base: SQLAlchemy declarative_base instance (optional)
                 If not provided, uses the default Base defined in this module
                 If provided, temporarily uses this base for this operation
        
        Raises:
            DatabaseError: If no base is available or drop operation fails
        """
        # Use provided base, instance base, or default Base
        base_to_use = base or self._base or Base
        
        if base_to_use is None:
            raise DatabaseError(
                "No base available. Make sure database.py exists with Base definition, "
                "or pass base as argument: DatabaseConnectionHandler(base=Base)"
            )
        
        try:
            base_to_use.metadata.drop_all(bind=self.get_engine())
            self.logger.info("All database tables dropped successfully")
        except Exception as e:
            self.logger.error(f"Failed to drop database tables: {e}")
            raise DatabaseError(f"Failed to drop database tables: {e}")