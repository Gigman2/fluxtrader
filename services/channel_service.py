"""Channel service for business logic."""

from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from models.channel import Channel, STATUS_ACTIVE, STATUS_INACTIVE, STATUS_ORPHAN
from models.account import Account
from config.exceptions_handler import DatabaseError, ValidationError


class ChannelService:
    """Service for channel business logic."""
    
    @staticmethod
    def get_all_channels(
        db: Session,
        status: Optional[str] = None,
        account_id: Optional[UUID] = None,
        orphaned_only: bool = False
    ) -> List[Channel]:
        """
        Get all channels with optional filtering.
        
        Args:
            db: Database session
            status: Filter by status (ACTIVE, INACTIVE, ORPHAN)
            account_id: Filter by account ID
            orphaned_only: If True, return only orphaned channels
            
        Returns:
            List of Channel objects
        """
        query = db.query(Channel)
        
        if status:
            query = query.filter(Channel.status == status)
        
        if account_id:
            query = query.filter(Channel.account_id == account_id)
        
        if orphaned_only:
            query = query.filter(Channel.status == STATUS_ORPHAN)
        
        return query.all()
    
    @staticmethod
    def get_channel_by_id(db: Session, channel_id: UUID) -> Optional[Channel]:
        """
        Get channel by ID.
        
        Args:
            db: Database session
            channel_id: Channel UUID
            
        Returns:
            Channel object or None if not found
        """
        return db.query(Channel).filter(Channel.id == channel_id).first()
    
    @staticmethod
    def create_channel(db: Session, channel_data: dict) -> Channel:
        """
        Create a new channel.
        
        Args:
            db: Database session
            channel_data: Dictionary with channel fields
            
        Returns:
            Created Channel object
            
        Raises:
            ValidationError: If validation fails (e.g., account not found)
            DatabaseError: If creation fails
        """
        # Validate account_id if provided
        if 'account_id' in channel_data and channel_data['account_id']:
            account = db.query(Account).filter(Account.id == channel_data['account_id']).first()
            if not account:
                raise ValidationError("Account not found")
        
        try:
            channel = Channel(**channel_data)
            db.add(channel)
            db.commit()
            db.refresh(channel)
            return channel
        except IntegrityError as e:
            db.rollback()
            raise DatabaseError("Channel with this telegram_channel_id already exists") from e
        except Exception as e:
            db.rollback()
            raise DatabaseError(f"Failed to create channel: {e}") from e
    
    @staticmethod
    def update_channel(db: Session, channel_id: UUID, update_data: dict) -> Channel:
        """
        Update an existing channel.
        
        Args:
            db: Database session
            channel_id: Channel UUID
            update_data: Dictionary with fields to update
            
        Returns:
            Updated Channel object
            
        Raises:
            ValidationError: If channel or account not found
            DatabaseError: If update fails
        """
        channel = ChannelService.get_channel_by_id(db, channel_id)
        if not channel:
            raise ValidationError("Channel not found")
        
        # Handle account_id update
        if 'account_id' in update_data:
            if update_data['account_id']:
                account = db.query(Account).filter(Account.id == update_data['account_id']).first()
                if not account:
                    raise ValidationError("Account not found")
                update_data['account_id'] = account.id
                # If reassigning from ORPHAN, set status to ACTIVE
                if channel.status == STATUS_ORPHAN:
                    update_data['status'] = STATUS_ACTIVE
                    update_data['is_active'] = True
            else:
                update_data['account_id'] = None
        
        try:
            # Update fields
            for key, value in update_data.items():
                setattr(channel, key, value)
            
            db.commit()
            db.refresh(channel)
            return channel
        except Exception as e:
            db.rollback()
            raise DatabaseError(f"Failed to update channel: {e}") from e
    
    @staticmethod
    def delete_channel(db: Session, channel_id: UUID) -> None:
        """
        Delete a channel.
        
        Args:
            db: Database session
            channel_id: Channel UUID
            
        Raises:
            ValidationError: If channel not found
            DatabaseError: If deletion fails
        """
        channel = ChannelService.get_channel_by_id(db, channel_id)
        if not channel:
            raise ValidationError("Channel not found")
        
        try:
            db.delete(channel)
            db.commit()
        except Exception as e:
            db.rollback()
            raise DatabaseError(f"Failed to delete channel: {e}") from e
    
    @staticmethod
    def get_orphaned_channels(db: Session) -> List[Channel]:
        """
        Get all orphaned channels.
        
        Args:
            db: Database session
            
        Returns:
            List of orphaned Channel objects
        """
        return ChannelService.get_all_channels(db, orphaned_only=True)
    
    @staticmethod
    def reassign_orphaned_channel(db: Session, channel_id: UUID, account_id: UUID) -> Channel:
        """
        Reassign an orphaned channel to a new account.
        
        Args:
            db: Database session
            channel_id: Channel UUID
            account_id: New account UUID
            
        Returns:
            Updated Channel object
            
        Raises:
            ValidationError: If channel is not orphaned or account not found
            DatabaseError: If reassignment fails
        """
        channel = ChannelService.get_channel_by_id(db, channel_id)
        if not channel:
            raise ValidationError("Channel not found")
        
        if channel.status != STATUS_ORPHAN:
            raise ValidationError("Channel is not orphaned")
        
        account = db.query(Account).filter(Account.id == account_id).first()
        if not account:
            raise ValidationError("Account not found")
        
        try:
            # Reassign channel
            channel.account_id = account_id
            channel.status = STATUS_ACTIVE
            channel.is_active = True
            
            db.commit()
            db.refresh(channel)
            return channel
        except Exception as e:
            db.rollback()
            raise DatabaseError(f"Failed to reassign channel: {e}") from e

