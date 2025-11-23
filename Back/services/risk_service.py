"""
Risk management service for handling risk-related operations.
"""

from typing import Optional, Dict, List
from uuid import UUID
from sqlalchemy.orm import Session
from decimal import Decimal

from utils.logger_utils import get_module_logger
from models.account import Account
from config.exceptions_handler import ValidationError, DatabaseError

logger = get_module_logger("services.risk_service")


class RiskService:
    """Service for risk management business logic."""
    
    @staticmethod
    def get_risk_settings(db: Session, account_id: UUID) -> Dict:
        """
        Get risk settings for an account.
        
        Args:
            db: Database session
            account_id: Account UUID
            
        Returns:
            Dictionary with risk settings
            
        Raises:
            ValidationError: If account not found
        """
        try:
            account = db.query(Account).filter(Account.id == account_id).first()
            
            if not account:
                raise ValidationError("Account not found")
            
            return {
                'account_balance': float(account.account_balance) if account.account_balance else 0.0,
                'risk_per_trade': float(account.risk_per_trade) if account.risk_per_trade else 0.0,
                'max_drawdown': float(account.max_drawdown) if account.max_drawdown else 0.0,
            }
        except ValidationError:
            raise
        except Exception as e:
            logger.error(f"Error fetching risk settings: {e}", exc_info=True)
            raise DatabaseError(f"Failed to fetch risk settings: {e}") from e
    
    @staticmethod
    def update_risk_settings(
        db: Session,
        account_id: UUID,
        risk_data: Dict
    ) -> Account:
        """
        Update risk settings for an account.
        
        Args:
            db: Database session
            account_id: Account UUID
            risk_data: Dictionary with risk settings to update
                - account_balance (optional): Account balance
                - risk_per_trade (optional): Risk per trade percentage
                - max_drawdown (optional): Maximum drawdown percentage
            
        Returns:
            Updated Account object
            
        Raises:
            ValidationError: If account not found or invalid data
        """
        try:
            account = db.query(Account).filter(Account.id == account_id).first()
            
            if not account:
                raise ValidationError("Account not found")
            
            # Update fields if provided
            if 'account_balance' in risk_data:
                account.account_balance = Decimal(str(risk_data['account_balance']))
            
            if 'risk_per_trade' in risk_data:
                risk_per_trade = float(risk_data['risk_per_trade'])
                if risk_per_trade < 0 or risk_per_trade > 100:
                    raise ValidationError("Risk per trade must be between 0 and 100")
                account.risk_per_trade = Decimal(str(risk_per_trade))
            
            if 'max_drawdown' in risk_data:
                max_drawdown = float(risk_data['max_drawdown'])
                if max_drawdown < 0 or max_drawdown > 100:
                    raise ValidationError("Max drawdown must be between 0 and 100")
                account.max_drawdown = Decimal(str(max_drawdown))
            
            db.commit()
            db.refresh(account)
            
            logger.info(f"Risk settings updated for account: {account_id}")
            return account
            
        except ValidationError:
            raise
        except Exception as e:
            db.rollback()
            logger.error(f"Error updating risk settings: {e}", exc_info=True)
            raise DatabaseError(f"Failed to update risk settings: {e}") from e