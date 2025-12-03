from datetime import datetime, timezone
from decimal import Decimal
from uuid import uuid4

from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from config.database_handler import Base

class Signal(Base):
    """Signal model for storing extracted trading signals."""

    __tablename__ = "signals"

    # Identification
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    channel_id = Column(UUID(as_uuid=True), ForeignKey("channels.id"), nullable=False)
    template_id = Column(UUID(as_uuid=True), ForeignKey("templates.id"), nullable=False)
    user_id = Column(String(50), nullable=False)

    # Message Reference
    original_message_id = Column(Integer, nullable=True)
    original_message_text = Column(Text, nullable=False)

    # Trading Information (CORE FIELDS)
    symbol = Column(String(50), nullable=False, index=True)  # ← MUST HAVE INDEX
    entry_price = Column(Numeric(20, 8), nullable=False) 
    take_profits = Column(JSON, nullable=True, default=list)  # [{"level": "TP1", "price": ..., "hit": false}]
    stop_loss = Column(JSON, nullable=True)  # {"price": ..., "hit": false, "hit_at": null}

    signal_type = Column(String(10), nullable=False) # BUY, SELL, LONG, SHORT
    timeframe = Column(String(10), nullable=True) # 1M, 5M, 15M, 30M, 1H, 4H, 1D

    # Confidence & Metadata
    confidence_score = Column(Numeric(3, 2), default=1.0, nullable=False)
    extraction_metadata = Column(JSON, nullable=True)

    # Tracking timestamps
    created_at = Column(DateTime(timezone=True), default=datetime.now(timezone.utc), 
                       nullable=False, index=True)
    updated_at = Column(DateTime(timezone=True), default=datetime.now(timezone.utc),
                       onupdate=datetime.now(timezone.utc), nullable=False)

    # User & Performance
    user_notes = Column(Text, nullable=True)
    performance_outcome = Column(String(20), nullable=True)  # WIN, LOSS, PENDING
    close_price = Column(Numeric(20, 8), nullable=True)
    pnl = Column(Numeric(20, 8), nullable=True)
    pnl_percent = Column(Numeric(10, 2), nullable=True)
    closed_at = Column(DateTime, nullable=True)

    # Relationships
    channel = relationship("Channel", back_populates="signals")
    template = relationship("Template", foreign_keys=[template_id])

    def __repr__(self) -> str:
        return (
            f"<Signal(id={self.id}, symbol={self.symbol}, "
            f"entry={self.entry_price}, type={self.signal_type})>"
        )