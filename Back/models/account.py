from datetime import datetime, timezone
from uuid import uuid4

from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text, Numeric, event, update
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from config.database_handler import Base

class Account(Base):
    """
    Account model for storing account information.
    
    Attributes:
        id: Unique account identifier (UUID)
        name: Account name
        username: Account username
        password: Account password
        account_balance: Account balance
        risk_per_trade: Risk per trade
        max_drawdown: Max drawdown
        telegram_connected: Whether Telegram is connected
        mt5_connected: Whether MT5 is connected
        created_at: When account was created
        updated_at: Last update timestamp
    """

    __tablename__ = "accounts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    
    # account information
    username = Column(String(255), nullable=False, unique=True)
    password = Column(String(255), nullable=False)

    # trade parameters
    account_balance = Column(Numeric(20, 8), nullable=True, default=0.0)
    risk_per_trade = Column(Numeric(5, 2), nullable=True, default=0.0)
    max_drawdown = Column(Numeric(5, 2), nullable=True, default=0.0)

    # Integration
    telegram_connected = Column(Boolean, nullable=True, default=False)
    mt5_connected = Column(Boolean, nullable=True, default=False)

    # timestamps
    created_at = Column(DateTime(timezone=True), default=datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc), nullable=False)


    # relationships
    # Note: No cascade delete-orphan - we handle orphaned channels via event listener
    channels = relationship("Channel", back_populates="account", cascade="all")


    def __repr__(self):
        return f"<Account(id={self.id}, username={self.username})>"

    def __str__(self):
        return f"Account: {self.username}"


# Event listener to handle account deletion - set channels to ORPHAN status
@event.listens_for(Account, "before_delete")
def handle_account_delete(mapper, connection, target):
    """
    When an Account is deleted, set all associated channels' status to 'ORPHAN'
    instead of deleting them.
    
    This runs before the account is actually deleted, so we can update the channels.
    """
    from datetime import datetime, timezone
    from models.channel import Channel, STATUS_ORPHAN
    
    # Use the connection directly to update channels
    connection.execute(
        update(Channel.__table__)
        .where(Channel.account_id == target.id)
        .values(
            status=STATUS_ORPHAN,
            account_id=None,
            is_active=False,
            updated_at=datetime.now(timezone.utc)
        )
    )
