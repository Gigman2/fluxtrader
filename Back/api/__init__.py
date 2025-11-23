"""API package for SignalFlux."""

from flask import Blueprint

# Create API blueprint
api_bp = Blueprint('api', __name__, url_prefix='/api/v1')

# Import routes to register them
from api.routes import accounts
from api.routes import risk
from api.routes import market_data
from api.routes import channels

__all__ = ["api_bp"]

