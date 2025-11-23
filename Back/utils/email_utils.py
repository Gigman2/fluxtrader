"""Email utility for sending emails (password reset, etc.)."""

import os
from typing import Optional
from utils.logger_utils import get_module_logger

logger = get_module_logger("utils.email_utils")


class EmailService:
    """Service for sending emails."""
    
    @staticmethod
    def send_password_reset_email(email: str, reset_token: str, reset_url: str) -> bool:
        """
        Send password reset email to user.
        
        In development, this logs the reset link instead of sending an actual email.
        In production, integrate with an email service (SendGrid, AWS SES, etc.).
        
        Args:
            email: User's email address
            reset_token: Password reset token
            reset_url: Full URL for password reset (includes token)
            
        Returns:
            True if email was sent/logged successfully, False otherwise
        """
        try:
            # In development, log the reset link
            # In production, replace this with actual email sending logic
            env = os.getenv("APP_ENV", "development")
            
            if env == "production":
                # TODO: Integrate with actual email service
                # Example: SendGrid, AWS SES, Mailgun, etc.
                logger.info(f"Password reset email sent to {email}")
                logger.info(f"Reset URL: {reset_url}")
                return True
            else:
                # Development mode: log the reset link
                logger.info("=" * 80)
                logger.info("PASSWORD RESET EMAIL (Development Mode)")
                logger.info("=" * 80)
                logger.info(f"To: {email}")
                logger.info(f"Reset URL: {reset_url}")
                logger.info(f"Token: {reset_token}")
                logger.info("=" * 80)
                return True
                
        except Exception as e:
            logger.error(f"Failed to send password reset email: {e}", exc_info=True)
            return False
    
    @staticmethod
    def get_reset_url(token: str) -> str:
        """
        Generate password reset URL.
        
        Args:
            token: Password reset token
            
        Returns:
            Full URL for password reset page
        """
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5034")
        # Use the first URL if multiple are provided (comma-separated)
        if "," in frontend_url:
            frontend_url = frontend_url.split(",")[0].strip()
        
        return f"{frontend_url}/reset-password?token={token}"

