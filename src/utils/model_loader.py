from dotenv import load_dotenv
from typing import Literal, Optional, Any
from pydantic import BaseModel, Field, ConfigDict
from src.config.settings import Settings
from langchain_groq import ChatGroq
from langchain_openai import ChatOpenAI
import logging

logging.basicConfig(level=logging.INFO)

class ModelLoader(BaseModel): 
    model: Literal["groq", "openai"] = "groq"
    settings: Settings = Field(default_factory=Settings)
    
    model_config = ConfigDict(arbitrary_types_allowed=True)  
    
    def load_llm(self):
        logging.info(f"Loading : {self.model} model...")
        
        if self.model == "groq":
            api_key = self.settings.GROQ_API_KEY 
            model_id = self.settings.config_data["llm"]["groq"]["model_name"]
            
            return ChatGroq(model=model_id, api_key=api_key, max_tokens=2000, temperature=0.0)
            
        elif self.model == "openai":
            api_key = self.settings.OPENAI_API_KEY 
            model_id = self.settings.config_data["llm"]["openai"]["model_name"]
            
            return ChatOpenAI(model=model_id, api_key=api_key)

        logging.info(f"Loaded model: {model_id}")


if __name__ == "__main__":
    model_loader = ModelLoader(model="groq")
    llm = model_loader.load_llm()