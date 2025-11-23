"""Account service for business logic."""

from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from models.account import Account
from config.exceptions_handler import DatabaseError, ValidationError
from utils.logger_utils import get_module_logger
from utils.password_utils import verify_password

logger = get_module_logger("services.account_service")


class AccountService:
    """Service for account business logic."""
    
    @staticmethod
    def get_all_accounts(db: Session) -> List[Account]:
        """
        Get all accounts.
        
        Args:
            db: Database session
            
        Returns:
            List of Account objects
        """
        return db.query(Account).all()
    
    @staticmethod
    def get_account_by_id(db: Session, account_id: UUID) -> Optional[Account]:
        """
        Get account by ID.
        
        Args:
            db: Database session
            account_id: Account UUID
            
        Returns:
            Account object or None if not found
        """
        return db.query(Account).filter(Account.id == account_id).first()


    @staticmethod
    def get_account_by_username(db: Session, username: str) -> Optional[Account]:
        """
        Get account by username.
        """
        return db.query(Account).filter(Account.username == username).first()
        
    
    @staticmethod
    def create_account(db: Session, account_data: dict) -> Account:
        """
        Create a new account.
        
        Args:
            db: Database session
            account_data: Dictionary with account fields
            
        Returns:
            Created Account object
            
        Raises:
            ValidationError: If validation fails
            DatabaseError: If creation fails
        """
        try:
            logger.info(f"Creating account: {account_data}")
            account = Account(**account_data)
            db.add(account)
            db.commit()
            db.refresh(account)

            logger.info(f"Account created successfully: {account.id} (username: {account.username})")

            from utils.jwt_utils import generate_token
            token = generate_token(account.id, account.username)

            return account, token
        except IntegrityError as e:
            logger.error(f"Account with this username already exists: {e}", exc_info=True)
            db.rollback()
            raise DatabaseError("Account with this username already exists") from e
        except Exception as e:
            db.rollback()
            raise DatabaseError(f"Failed to create account: {e}") from e
    
    @staticmethod
    def update_account(db: Session, account_id: UUID, update_data: dict) -> Account:
        """
        Update an existing account.
        
        Args:
            db: Database session
            account_id: Account UUID
            update_data: Dictionary with fields to update
            
        Returns:
            Updated Account object
            
        Raises:
            ValidationError: If account not found
            DatabaseError: If update fails
        """
        account = AccountService.get_account_by_id(db, account_id)
        if not account:
            raise ValidationError("Account not found")
        
        try:
            # Update fields
            for key, value in update_data.items():
                setattr(account, key, value)
            
            db.commit()
            db.refresh(account)
            return account
        except Exception as e:
            db.rollback()
            raise DatabaseError(f"Failed to update account: {e}") from e
    
    @staticmethod
    def delete_account(db: Session, account_id: UUID) -> None:
        """
        Delete an account.
        Associated channels will be set to ORPHAN status via event listener.
        
        Args:
            db: Database session
            account_id: Account UUID
            
        Raises:
            ValidationError: If account not found
            DatabaseError: If deletion fails
        """
        account = AccountService.get_account_by_id(db, account_id)
        if not account:
            raise ValidationError("Account not found")
        
        try:
            db.delete(account)
            db.commit()
        except Exception as e:
            db.rollback()
            raise DatabaseError(f"Failed to delete account: {e}") from e
    
    @staticmethod
    def get_account_channels(db: Session, account_id: UUID) -> List:
        """
        Get all channels for an account.
        
        Args:
            db: Database session
            account_id: Account UUID
            
        Returns:
            List of Channel objects
            
        Raises:
            ValidationError: If account not found
        """
        account = AccountService.get_account_by_id(db, account_id)
        if not account:
            raise ValidationError("Account not found")
        
        return account.channels

    @staticmethod
    def login(db: Session, login_data: dict) -> tuple[Account, str]:
        """
        Login to the system.
        
        Args:
            db: Database session
            login_data: Dictionary with login data
            
        Returns:
            Tuple of (Account object, JWT token)
            
        Raises:
            ValidationError: If credentials are invalid
        """
        try:
            logger.info(f"Logging in: {login_data}")
            account = AccountService.get_account_by_username(db, login_data['username'])
            if not account:
                raise ValidationError("Account not found")
            if not verify_password(account.password, login_data['password']):
                raise ValidationError("Invalid password")
            
            # Generate JWT token
            from utils.jwt_utils import generate_token
            token = generate_token(account.id, account.username)
            
            logger.info(f"Login successful for account: {account.id} (username: {account.username})")
            return account, token
        except ValidationError:
            raise  # Re-raise validation errors as-is
        except Exception as e:
            logger.error(f"Failed to login: {e}", exc_info=True)
            raise DatabaseError(f"Failed to login: {e}") from e