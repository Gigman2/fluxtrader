"""
Validation schemas for risk management endpoints.
"""

from typing import Dict, Optional


class RiskSchema:
    """Validation schema for risk management operations."""
    
    @staticmethod
    def validate_update_risk(data: Dict) -> Dict:
        """
        Validate risk settings update data.
        
        Args:
            data: Dictionary with risk settings
            
        Returns:
            Validated dictionary
            
        Raises:
            ValueError: If validation fails
        """
        validated = {}
        
        # Validate account_balance
        if 'account_balance' in data:
            try:
                balance = float(data['account_balance'])
                if balance < 0:
                    raise ValueError("Account balance cannot be negative")
                validated['account_balance'] = balance
            except (ValueError, TypeError):
                raise ValueError("Account balance must be a valid number")
        
        # Validate risk_per_trade
        if 'risk_per_trade' in data:
            try:
                risk = float(data['risk_per_trade'])
                if risk < 0 or risk > 100:
                    raise ValueError("Risk per trade must be between 0 and 100")
                validated['risk_per_trade'] = risk
            except (ValueError, TypeError):
                raise ValueError("Risk per trade must be a valid number between 0 and 100")
        
        # Validate max_drawdown
        if 'max_drawdown' in data:
            try:
                drawdown = float(data['max_drawdown'])
                if drawdown < 0 or drawdown > 100:
                    raise ValueError("Max drawdown must be between 0 and 100")
                validated['max_drawdown'] = drawdown
            except (ValueError, TypeError):
                raise ValueError("Max drawdown must be a valid number between 0 and 100")
        
        if not validated:
            raise ValueError("At least one field must be provided for update")
        
        return validated
    