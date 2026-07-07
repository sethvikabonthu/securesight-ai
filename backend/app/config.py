import os
from dotenv import load_dotenv

# Load optional .env file
load_dotenv()

class Settings:
    PROJECT_NAME: str = "VeriShield AI Backend"
    API_VERSION: str = "v1"
    
    # CORS Allow origins
    ALLOWED_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
    ]
    
    # Custom AI Model keys if provided
    VERISHIELD_AI_KEY: str = os.getenv("VERISHIELD_AI_KEY", "")

settings = Settings()
