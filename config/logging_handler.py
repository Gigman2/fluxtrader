"""Logging handler for FluxTrader."""

import json
import logging
import logging.handlers
import sys
from pathlib import Path
from typing import Optional

from config.env_handler import EnvHandler


class LevelFilter(logging.Filter):
    """Filter logs by specific level."""
    
    def __init__(self, level):
        super().__init__()
        self.level = level
    
    def filter(self, record):
        return record.levelno == self.level


class JSONFormatter(logging.Formatter):
    """JSON formatter for structured logging."""
    
    def format(self, record):
        log_data = {
            "timestamp": self.formatTime(record, self.datefmt),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }
        
        # Add exception info if present
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)
        
        # Add extra fields if present
        if hasattr(record, "extra"):
            log_data.update(record.extra)
        
        return json.dumps(log_data)


class LoggingHandler:
    LOG_FILE_MAX_BYTES = 10 * 1024 * 1024  # 10MB
    LOG_FILE_PATH = Path("logs/fluxitrader.log")
    LOG_FILE_BACKUP_COUNT = 5
    
    # Log level file configurations
    LOG_LEVEL_FILES = {
        logging.DEBUG: "logs/debug.log",
        logging.INFO: "logs/info.log",
        logging.WARNING: "logs/warning.log",
        logging.ERROR: "logs/error.log",
        logging.CRITICAL: "logs/critical.log",
    }
    
    def __init__(self):
        self.env_handler = EnvHandler()
        log_level_str = self.env_handler.get_env("LOG_LEVEL")
        self.log_level = self._parse_log_level(log_level_str)
        self.log_file = self.env_handler.get_env("LOG_FILE") or self.LOG_FILE_PATH
        self.use_json = self.env_handler.get_env("LOG_JSON") or False
        
        # Check if separate level files are enabled
        separate_levels = self.env_handler.get_env("LOG_SEPARATE_LEVELS")
        self.separate_level_files = bool(separate_levels) if separate_levels is not None else False
        
        # Load log level file configurations from environment
        self._load_log_level_configs()
    
    def _parse_log_level(self, level_str):
        """Convert log level string to logging constant."""
        if level_str is None:
            return logging.INFO
        
        # Remove quotes if present
        level_str = str(level_str).strip().strip('"').strip("'").upper()
        
        level_map = {
            "DEBUG": logging.DEBUG,
            "INFO": logging.INFO,
            "WARNING": logging.WARNING,
            "ERROR": logging.ERROR,
            "CRITICAL": logging.CRITICAL,
        }
        
        return level_map.get(level_str, logging.INFO)
    
    def get_logger(self, name: Optional[str] = None):
        """
        Create and return logger with handlers for different log levels.
        
        Args:
            name: Logger name (default: "fluxitrader"). Use module names like
                  "fluxitrader.database" or "fluxitrader.api" for separate loggers.
        
        Returns:
            Configured logger instance
        """
        try:
            logger_name = name or "fluxitrader"
            logger = logging.getLogger(logger_name)
            logger.setLevel(self.log_level)
            logger.handlers.clear()
            
            # Console handler (all levels)
            console_handler = self._setup_console_handler()
            if console_handler:
                logger.addHandler(console_handler)
            
            # If separate level files are enabled, add handlers for each level
            if self.separate_level_files:
                for level, file_path in self.LOG_LEVEL_FILES.items():
                    level_handler = self._setup_level_handler(level, file_path)
                    if level_handler:
                        logger.addHandler(level_handler)
            else:
                # Single file handler for all logs
                file_handler = self._setup_file_handler()
                if file_handler:
                    logger.addHandler(file_handler)
            
            # Prevent propagation to root logger
            logger.propagate = False
            
            return logger
        except Exception as e:
            print(f"Failed to create logger: {e}")
            return None
    
    
    def _load_log_level_configs(self):
        """Load log level file configurations from environment variables."""
        level_names = {
            "DEBUG": logging.DEBUG,
            "INFO": logging.INFO,
            "WARNING": logging.WARNING,
            "ERROR": logging.ERROR,
            "CRITICAL": logging.CRITICAL,
        }
        
        for level_name, level_const in level_names.items():
            # Check for custom file path for this level
            file_key = f"LOG_{level_name}_FILE"
            log_file = self.env_handler.get_env(file_key)
            if log_file:
                self.LOG_LEVEL_FILES[level_const] = log_file
    
    def _setup_level_handler(self, level: int, file_path: str):
        """Setup file handler for a specific log level."""
        try:
            log_path = Path(file_path)
            log_path.parent.mkdir(parents=True, exist_ok=True)
            
            handler = logging.handlers.RotatingFileHandler(
                str(log_path),
                maxBytes=self.LOG_FILE_MAX_BYTES,
                backupCount=self.LOG_FILE_BACKUP_COUNT,
            )
            # Set handler level to the specific level
            handler.setLevel(level)
            # Add filter to only log messages at this exact level
            handler.addFilter(LevelFilter(level))
            handler.setFormatter(self._get_formatter())
            
            return handler
        except Exception as e:
            print(f"Failed to create level {logging.getLevelName(level)} handler: {e}")
            return None


    def _get_formatter(self, use_json: Optional[bool] = None):
        """Get appropriate formatter based on configuration."""
        use_json = use_json if use_json is not None else self.use_json
        
        if use_json:
            return JSONFormatter()
        else:
            return logging.Formatter(
                fmt="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
                datefmt="%Y-%m-%d %H:%M:%S",
            )
    
    def _setup_console_handler(self):
        """Setup console handler."""
        try:
            console_handler = logging.StreamHandler(sys.stdout)
            console_handler.setLevel(self.log_level)
            console_handler.setFormatter(self._get_formatter())
            return console_handler
        except Exception as e:
            print(f"Failed to create console handler: {e}")
            return None

    def _setup_file_handler(self):
        """Setup file handler for all logs."""
        try:
            log_path = Path(self.log_file) if isinstance(self.log_file, str) else self.log_file
            log_path.parent.mkdir(parents=True, exist_ok=True)
            
            file_handler = logging.handlers.RotatingFileHandler(
                str(log_path),
                maxBytes=self.LOG_FILE_MAX_BYTES,
                backupCount=self.LOG_FILE_BACKUP_COUNT,
            )
            file_handler.setLevel(self.log_level)
            file_handler.setFormatter(self._get_formatter())

            return file_handler
        except Exception as e:
            print(f"Failed to create file handler: {e}")
            return None
    
    def _setup_error_handler(self):
        """Setup separate file handler for ERROR and CRITICAL logs only."""
        try:
            error_path = Path(self.error_log_file) if isinstance(self.error_log_file, str) else self.error_log_file
            error_path.parent.mkdir(parents=True, exist_ok=True)
            
            error_handler = logging.handlers.RotatingFileHandler(
                str(error_path),
                maxBytes=self.LOG_FILE_MAX_BYTES,
                backupCount=self.LOG_FILE_BACKUP_COUNT,
            )
            # Only log ERROR and CRITICAL to error file
            error_handler.setLevel(logging.ERROR)
            error_handler.setFormatter(self._get_formatter())

            return error_handler
        except Exception as e:
            print(f"Failed to create error handler: {e}")
            return None