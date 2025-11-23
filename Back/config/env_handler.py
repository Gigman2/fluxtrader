import os

class EnvHandler:
    REQUIRED_ENV_VARS = [
        {
            "key": "PORT",
            "required": True,
            "type": int,
            "default": 5000,
        },
        {
            "key": "DEBUG",
            "required": True,
            "type": bool,
            "default": False,
        },
        {
            "key": "POSTGRES_DB",
            "required": True,
            "type": str,
        },
        {
            "key": "POSTGRES_USER",
            "required": True,
            "type": str,
        },
        {
            "key": "POSTGRES_PASSWORD",
            "required": True,
            "type": str,
        },
        {
            "key": "POSTGRES_HOST",
            "required": True,
            "type": str,
        },
        {
            "key": "POSTGRES_PORT",
            "required": True,
            "type": int,
        },
        {
            "key": "LOG_FORMAT",
            "required": False,
            "type": str,
            "default": "text",
        },
        {
            "key": "LOG_JSON",
            "required": False,
            "type": bool,
            "default": False,
        },
        {
            "key": "LOG_SEPARATE_LEVELS",
            "required": False,
            "type": bool,
            "default": False,
        },
        {
            "key": "FRONTEND_URL",
            "required": True,
            "type": str,
        },
        {
            "key": "JWT_SECRET_KEY",
            "required": True,
            "type": str,
        },
        {
            "key": "JWT_EXPIRATION_HOURS",
            "required": True,
            "type": int,
        },
        {
            "key": "TWELVE_DATA_API_KEY",
            "required": False,
            "type": str,
            "default": None,
        }
    ]

    def __init__(self):
        self.env_file = ".env"
        self.load_env()

    def load_env(self):
        """Load environment variables from .env file."""
        if not os.path.exists(self.env_file):
            return
        
        with open(self.env_file, "r") as file:
            for line in file:
                line = line.strip()
                # Skip empty lines and comments
                if not line or line.startswith("#"):
                    continue
                
                # Handle key=value format
                if "=" in line:
                    key, value = line.split("=", 1)
                    # Strip whitespace and remove surrounding quotes if present
                    value = value.strip().strip('"').strip("'")
                    os.environ[key.strip()] = value

    def _convert_type(self, value, target_type):
        """Convert string value to target type."""
        if value is None:
            return None
        
        if target_type == int:
            return int(value)
        elif target_type == bool:
            if isinstance(value, str):
                return value.lower() in ("true", "1", "yes", "on")
            return bool(value)
        elif target_type == str:
            return str(value)
        else:
            return target_type(value)

    def get_env(self, key, convert_type=True):
        """Get environment variable, optionally converting to the expected type."""
        raw_value = os.environ.get(key)
        
        if convert_type:
            # Find the variable definition to get its type
            var_def = next((v for v in self.REQUIRED_ENV_VARS if v["key"] == key), None)
            if var_def and var_def.get("type"):
                if raw_value is None:
                    return var_def.get("default")
                return self._convert_type(raw_value, var_def["type"])
        
        return raw_value

    def validate_env(self):
        """Validate all required environment variables."""
        for var in self.REQUIRED_ENV_VARS:
            value = self.get_env(var["key"], convert_type=True)
            
            if var["required"] and value is None:
                raise ValueError(f"Environment variable {var['key']} is required")
            
            if value is not None and var.get("type"):
                if not isinstance(value, var["type"]):
                    raise ValueError(f"Environment variable {var['key']} is not a valid {var['type']}")

    def get_database_url(self):
        """Construct PostgreSQL database URL from environment variables."""
        user = self.get_env("POSTGRES_USER")
        password = self.get_env("POSTGRES_PASSWORD")
        host = self.get_env("POSTGRES_HOST")
        port = self.get_env("POSTGRES_PORT")
        db = self.get_env("POSTGRES_DB")
        
        return f"postgresql://{user}:{password}@{host}:{port}/{db}"
    
    def get_database_config(self):
        """Get database configuration as a dictionary."""
        return {
            "host": self.get_env("POSTGRES_HOST"),
            "port": self.get_env("POSTGRES_PORT"),
            "database": self.get_env("POSTGRES_DB"),
            "user": self.get_env("POSTGRES_USER"),
            "password": self.get_env("POSTGRES_PASSWORD"),
        }