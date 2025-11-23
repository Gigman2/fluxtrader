from typing import Optional


class SignalFluxException(Exception):
    """Base exception for the SignalFlux application"""

    def __init__(self, message: str, code: str = "UNKNOWN_ERROR"):
        self.message = message
        self.code = code
        super().__init__(self.message)


class ConfigurationError(SignalFluxException):
    """Exception raised for configuration errors"""

    def __init__(self, message: str):
        super().__init__(message, "CONFIGURATION_ERROR")


class DatabaseError(SignalFluxException):
    """Exception raised for database errors"""

    def __init__(self, message: str):
        super().__init__(message, "DATABASE_ERROR")


class ValidationError(SignalFluxException):
    """Exception raised for validation errors"""

    def __init__(self, message: str, field: Optional[str] = None):
        self.field = field
        super().__init__(message, "VALIDATION_ERROR")



__all__ = [
    "SignalFluxException",
    "ConfigurationError",
    "DatabaseError",
    "ValidationError",
]
