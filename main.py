import os  
from datetime import datetime
from typing import Optional

from flask import Flask
from config import LoggingHandler, EnvHandler

app = Flask(__name__)
port = os.environ.get("PORT", 5000)
debug = os.environ.get("DEBUG", "false").lower() == "true"

if __name__ == "__main__":
    env_handler = EnvHandler()
    env_handler.validate_env()
    env = env_handler.get_env("ENV")
    debug = env_handler.get_env("DEBUG")
    port = env_handler.get_env("PORT")

    logging_handler = LoggingHandler()
    logger = logging_handler.get_logger()
    
    if logger:
        logger.info("========== FluxTrader is starting ==========")
        logger.info(f"Environment: {env}")
        logger.info(f"Debug mode: {debug}")
        logger.info(f"Port: {port}")
    else:
        print("Warning: Logger initialization failed, using print statements")
        print(f"========== FluxTrader is starting ==========")
        print(f"Environment: {env}")
        print(f"Debug mode: {debug}")
        print(f"Port: {port}")
    
    app.run(debug=debug, port=port)