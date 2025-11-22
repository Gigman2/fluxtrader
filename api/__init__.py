"""API package for FluxTrader."""

from flask import Blueprint

# Create API blueprint
api_bp = Blueprint('api', __name__, url_prefix='/api/v1')

# Import routes to register them
from api.routes import accounts

__all__ = ["api_bp"]

