"""Channel model for storing trading signal channels."""

from datetime import datetime, timezone
from uuid import uuid4

from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID

# Import Base from database_handler
from config.database_handler import Base


class Channel(Base):
    """
    Represents a trading signal channel.
    
    This model demonstrates how Base works:
    1. Inheriting from Base makes this a database table
    2. All columns are registered in Base.metadata
    3. Base.metadata.create_all() will create this table
    
    Attributes:
        id: Unique channel identifier (UUID)
        name: Channel name
        description: Channel description
        telegram_channel_id: Telegram channel ID
        is_active: Whether channel is currently active
        signal_count: Number of signals from this channel
        created_at: When channel was created
        updated_at: Last update timestamp
    """
    
    # This tells SQLAlchemy what table name to use in the database
    __tablename__ = "channels"
    
    # Primary key - UUID type
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    
    # Channel information
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    
    # Telegram information
    telegram_channel_id = Column(String(100), nullable=False, unique=True, index=True)
    
    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Statistics
    signal_count = Column(Integer, default=0, nullable=False)
    
    # Timestamps
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    
    def __repr__(self):
        """String representation of the Channel."""
        return f"<Channel(id={self.id}, name='{self.name}', is_active={self.is_active})>"
    
    def __str__(self):
        """Human-readable string representation."""
        return f"Channel: {self.name} ({'Active' if self.is_active else 'Inactive'})"

