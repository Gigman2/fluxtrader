"""Market data service for fetching external market data."""

import requests
from typing import Dict, Optional
from config.env_handler import EnvHandler
from config.exceptions_handler import ValidationError
from utils.logger_utils import get_module_logger

logger = get_module_logger("services.market_data_service")

env_handler = EnvHandler()


class MarketDataService:
    """Service for fetching market data from external APIs."""
    
    # Symbol mapping for different APIs
    SYMBOL_MAPPING = {
        "XAUUSD": "XAU/USD",  # Gold
        "BTCUSD": "BTC/USD",   # Bitcoin
        "EURUSD": "EUR/USD",   # Euro
        "US30": "US30",        # Dow Jones
    }
    
    @staticmethod
    def get_twelve_data_api_key() -> Optional[str]:
        """Get Twelve Data API key from environment."""
        return env_handler.get_env("TWELVE_DATA_API_KEY", convert_type=False)
    
    @staticmethod
    def fetch_price_twelve_data(symbol: str) -> Dict:
        """
        Fetch price data from Twelve Data API.
        
        Args:
            symbol: Trading symbol (e.g., XAUUSD, BTCUSD, EURUSD, US30)
            
        Returns:
            Dictionary with price data
            
        Raises:
            ValidationError: If API key is missing or request fails
        """
        api_key = MarketDataService.get_twelve_data_api_key()
        if not api_key:
            raise ValidationError("Twelve Data API key is not configured")
        
        # Map symbol to Twelve Data format
        mapped_symbol = MarketDataService.SYMBOL_MAPPING.get(symbol, symbol)
        
        try:
            url = "https://api.twelvedata.com/price"
            params = {
                "symbol": mapped_symbol,
                "apikey": api_key
            }
            
            logger.debug(f"Fetching price for {symbol} (mapped: {mapped_symbol}) from Twelve Data")
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if "code" in data and data["code"] != 200:
                error_msg = data.get("message", "Unknown error from Twelve Data API")
                raise ValidationError(f"Twelve Data API error: {error_msg}")
            
            price = float(data.get("price", 0))
            
            return {
                "symbol": symbol,
                "price": price,
                "timestamp": data.get("timestamp"),
                "source": "twelve_data"
            }
            
        except requests.exceptions.Timeout:
            logger.error(f"Timeout fetching market data for {symbol}")
            raise ValidationError("Request timeout while fetching market data")
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching market data for {symbol}: {e}")
            raise ValidationError(f"Failed to fetch market data: {str(e)}")
        except (ValueError, KeyError) as e:
            logger.error(f"Error parsing market data response for {symbol}: {e}")
            raise ValidationError("Invalid response from market data API")
    
    @staticmethod
    def fetch_price_with_change(symbol: str) -> Dict:
        """
        Fetch price data with percentage change.
        Uses Twelve Data for price and calculates change from previous close.
        
        Args:
            symbol: Trading symbol
            
        Returns:
            Dictionary with price and percentage change
        """
        api_key = MarketDataService.get_twelve_data_api_key()
        if not api_key:
            raise ValidationError("Twelve Data API key is not configured")
        
        mapped_symbol = MarketDataService.SYMBOL_MAPPING.get(symbol, symbol)
        
        try:
            # Fetch real-time price
            price_url = "https://api.twelvedata.com/price"
            price_params = {
                "symbol": mapped_symbol,
                "apikey": api_key
            }
            
            price_response = requests.get(price_url, params=price_params, timeout=10)
            price_response.raise_for_status()
            price_data = price_response.json()
            
            if "code" in price_data and price_data["code"] != 200:
                error_msg = price_data.get("message", "Unknown error")
                raise ValidationError(f"Twelve Data API error: {error_msg}")
            
            current_price = float(price_data.get("price", 0))
            
            # Fetch quote data for previous close and change
            quote_url = "https://api.twelvedata.com/quote"
            quote_params = {
                "symbol": mapped_symbol,
                "apikey": api_key
            }
            
            quote_response = requests.get(quote_url, params=quote_params, timeout=10)
            quote_response.raise_for_status()
            quote_data = quote_response.json()
            
            if "code" in quote_data and quote_data["code"] != 200:
                # If quote fails, return price without change
                logger.warning(f"Quote data unavailable for {symbol}, returning price only")
                return {
                    "symbol": symbol,
                    "price": current_price,
                    "change_percent": 0.0,
                    "timestamp": price_data.get("timestamp"),
                    "source": "twelve_data"
                }
            
            # Calculate percentage change
            previous_close = float(quote_data.get("previous_close", current_price))
            change = current_price - previous_close
            change_percent = (change / previous_close * 100) if previous_close > 0 else 0.0
            
            return {
                "symbol": symbol,
                "price": current_price,
                "change": change,
                "change_percent": round(change_percent, 2),
                "previous_close": previous_close,
                "timestamp": price_data.get("timestamp"),
                "source": "twelve_data"
            }
            
        except requests.exceptions.Timeout:
            logger.error(f"Timeout fetching market data for {symbol}")
            raise ValidationError("Request timeout while fetching market data")
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching market data for {symbol}: {e}")
            raise ValidationError(f"Failed to fetch market data: {str(e)}")
        except (ValueError, KeyError) as e:
            logger.error(f"Error parsing market data response for {symbol}: {e}")
            raise ValidationError("Invalid response from market data API")
    
    @staticmethod
    def fetch_multiple_prices(symbols: list) -> Dict[str, Dict]:
        """
        Fetch price data for multiple symbols.
        
        Args:
            symbols: List of trading symbols
            
        Returns:
            Dictionary mapping symbols to their price data
        """
        results = {}
        for symbol in symbols:
            try:
                results[symbol] = MarketDataService.fetch_price_with_change(symbol)
            except Exception as e:
                logger.error(f"Failed to fetch data for {symbol}: {e}")
                results[symbol] = {
                    "symbol": symbol,
                    "error": str(e)
                }
        return results

