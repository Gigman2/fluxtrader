"""Channel model for storing trading signal channels."""

from datetime import datetime, timezone
from uuid import uuid4

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

# Import Base from database_handler
from config.database_handler import Base


STATUS_ACTIVE = "ACTIVE"
STATUS_INACTIVE = "INACTIVE"
STATUS_ORPHAN = "ORPHAN"


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
    
    # Foreign key to Account (nullable to allow orphaned channels)
    account_id = Column(UUID(as_uuid=True), ForeignKey("accounts.id", ondelete="SET NULL"), nullable=True, index=True)
    
    # Channel information
    name = Column(String(255), nullable=False, index=True)
    telegram_channel_id = Column(String(100), nullable=False, unique=True, index=True)
    
    # Status - can be "ACTIVE", "INACTIVE", "ORPHAN"
    status = Column(String(20), default=STATUS_ACTIVE, nullable=False, index=True)
    connection_status = Column(String(20), default="disconnected", nullable=False)  # "connected", "disconnected", "error"
    connection_error = Column(Text, nullable=True)
    
    # Statistics
    signal_count = Column(Integer, default=0, nullable=False)
    
    # Timestamps
    last_active_at = Column(DateTime(timezone=True), nullable=True)
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
    
    # Relationship back to Account
    account = relationship("Account", back_populates="channels")
    
    def __repr__(self):
        """String representation of the Channel."""
        return f"<Channel(id={self.id}, name='{self.name}', status='{self.status}')>"
    
    def __str__(self):
        """Human-readable string representation."""
        return f"Channel: {self.name} (Status: {self.status})"

