from app import create_app
from config import LoggingHandler, EnvHandler

app = create_app()  # Call the function to get Flask app instance

if __name__ == "__main__":
    env_handler = EnvHandler()
    env_handler.validate_env()
    env = env_handler.get_env("APP_ENV")
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