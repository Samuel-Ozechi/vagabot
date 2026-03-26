from src.utils.weather_service import WeatherService
from langchain.tools import tool
from typing import List
from src.config.settings import Settings

settings = Settings() # Load settings to access API keys and configurations

class WeatherInfoTool:
    def __init__(self):
        self.api_key = settings.OPEN_WEATHER_API_KEY
        self.weather_service = WeatherService(self.api_key)
        self.weather_tool_list = self._setup_weather_tools()
    
    def _setup_weather_tools(self) -> List:
        """Setup all tools for the weather forecast tool"""
        @tool
        def get_current_weather(city: str) -> str:
            """Get current weather for a city"""
            weather_data = self.weather_service.get_current_weather(city)
            if weather_data:
                temp = weather_data.get('main', {}).get('temp', 'N/A')
                desc = weather_data.get('weather', [{}])[0].get('description', 'N/A')
                return f"Current weather in {city}: {temp}°C, {desc}"
            return f"Could not fetch weather for {city}"
        
        @tool
        def get_weather_forecast(city: str) -> str:
            """Get weather forecast for a city"""
            forecast_data = self.weather_service.get_forecast_weather(city)
            if forecast_data and 'list' in forecast_data:
                forecast_summary = []
                for i in range(len(forecast_data['list'])):
                    item = forecast_data['list'][i]
                    date = item['dt_txt'].split(' ')[0]
                    temp = item['main']['temp']
                    desc = item['weather'][0]['description']
                    forecast_summary.append(f"{date}: {temp} degree celcius , {desc}")
                return f"Weather forecast for {city}:\n" + "\n".join(forecast_summary)
            return f"Could not fetch forecast for {city}"
    
        return [get_current_weather, get_weather_forecast]
    
    def get_tools(self):
        return self.weather_tool_list