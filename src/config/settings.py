# src/config/settings.py

from pydantic import  Field
from pydantic_settings import BaseSettings, SettingsConfigDict
import yaml

class Settings(BaseSettings):
    # load variables from .env file
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    config_data: dict = Field(default_factory=dict)
    GROQ_API_KEY: str = Field(...)
    OPENAI_API_KEY: str = Field(...)
    GOOGLE_PLACES_API_KEY: str = Field(...)
    TAVILY_API_KEY: str = Field(...)
    OPEN_WEATHER_API_KEY: str = Field(...)
    EXCHANGE_RATE_API_KEY: str = Field(...)
    FOURSQUARE_PLACES_API_KEY: str = Field(...)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.config_data = self.load_model_config()

    def load_model_config(self, config_path: str = "src/config/model_config.yaml") -> dict:
        with open(config_path, "r") as file:
            self.config_data = yaml.safe_load(file) # load the YAML file and parse it into a Python dictionary
        return self.config_data
    
    def __getitem__(self, key):
        return self.config_data[key]
    

if __name__ == "__main__":
    settings = Settings()
    print(settings.config_data)
    # output --> {'llm': 
    #             {
    #             'openai': 
    #                 {'provider': 'openai', 'model_name': 'gpt-3.5-turbo', 'temperature': 0.7}, 
    #              'groq': 
    #                 {'provider': 'groq', 'model_name': 'deepseek-r1-distill-llama-70b', 'temperature': 0.7}}
    #                 }