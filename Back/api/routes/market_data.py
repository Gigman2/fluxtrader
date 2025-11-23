"""Market data API routes - handles HTTP request/response only."""

from flask import request, jsonify

from api import api_bp
from services.market_data_service import MarketDataService
from utils.auth_utils import auth_required
from utils.database_utils import db_session_required
from utils.logger_utils import get_module_logger
from config.exceptions_handler import ValidationError

logger = get_module_logger("api.routes.market_data")


@api_bp.route('/market-data/<symbol>', methods=['GET'])
@auth_required
@db_session_required
def get_market_data(symbol):
    """Get real-time market data for a single symbol."""
    try:
        logger.debug(f"Fetching market data for symbol: {symbol}")
        
        # Fetch price with change percentage
        data = MarketDataService.fetch_price_with_change(symbol.upper())
        
        return jsonify({
            'success': True,
            'data': data
        }), 200
        
    except ValidationError as e:
        logger.warning(f"Validation error fetching market data for {symbol}: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    except Exception as e:
        logger.error(f"Error fetching market data for {symbol}: {e}", exc_info=True)
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@api_bp.route('/market-data', methods=['GET'])
@auth_required
@db_session_required
def get_multiple_market_data():
    """Get real-time market data for multiple symbols."""
    try:
        # Get symbols from query parameter (comma-separated)
        symbols_param = request.args.get('symbols', '')
        if not symbols_param:
            return jsonify({
                'success': False,
                'error': 'symbols parameter is required (comma-separated list)'
            }), 400
        
        
        symbols = [s.strip().upper() for s in symbols_param.split(',')]
        logger.debug(f"Fetching market data for symbols: {symbols}")
        
        # Fetch data for all symbols
        data = MarketDataService.fetch_multiple_prices(symbols)
        
        return jsonify({
            'success': True,
            'data': data
        }), 200
        
    except ValidationError as e:
        logger.warning(f"Validation error fetching market data: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    except Exception as e:
        logger.error(f"Error fetching market data: {e}", exc_info=True)
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

