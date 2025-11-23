"""Logger utility for easy access to application logger."""

from typing import Optional
from config.logging_handler import LoggingHandler

# Global logger instance
_logger_instance: Optional[object] = None


def get_logger(name: Optional[str] = None):
    """
    Get or create logger instance.
    
    Args:
        name: Logger name (e.g., "signalflex.api.accounts")
              If None, uses "signalflex"
    
    Returns:
        Logger instance or None if initialization fails
    """
    global _logger_instance
    
    if _logger_instance is None:
        logging_handler = LoggingHandler()
        _logger_instance = logging_handler.get_logger(name or "signalflex")
    
    return _logger_instance


def get_module_logger(module_name: str):
    """
    Get logger for a specific module.
    
    Args:
        module_name: Module name (e.g., "api.accounts", "services.account_service")
    
    Returns:
        Logger instance with name "signalflex.{module_name}"
    """
    full_name = f"signalflex.{module_name}"
    logging_handler = LoggingHandler()
    return logging_handler.get_logger(full_name)

