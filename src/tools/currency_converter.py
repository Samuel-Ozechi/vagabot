import os
from src.utils.currency_service import CurrencyService
from typing import List
from langchain.tools import tool
from src.config.settings import Settings

settings = Settings() # Load settings to access API keys and configurations

class CurrencyConverterTool:
    def __init__(self):
        api_key = settings.EXCHANGE_RATE_API_KEY
        self.currency_service = CurrencyService(api_key)
        self.currency_converter_tool_list = self._setup_currency_converter_tool()

    def _setup_currency_converter_tool(self) -> List:
        """Setup the currency converter tool"""
        @tool
        def convert_currency(amount:float, from_currency:str, to_currency:str):
            """Convert amount from one currency to another"""
            return self.currency_service.convert(amount, from_currency, to_currency)
        
        return [convert_currency]

    def get_tools(self):
        return self.currency_converter_tool_list