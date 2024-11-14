from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
import os

class Settings(BaseSettings):
    SPOTIFY_CLIENT_ID: str
    SPOTIFY_CLIENT_SECRET: str

    PORT: int = int(os.getenv("PORT", 8000))
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    FRONTEND_URL: str = None
    API_URL: str = None
    CORS_ORIGIN: str = None
    SPOTIFY_REDIRECT_URI: str = None

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"

    @property
    def allowed_origins(self) -> list[str]:
        if self.is_production:
            return [
                self.FRONTEND_URL,
                self.CORS_ORIGIN
            ]
        return [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3000",
            "http://localhost:8000",
            self.CORS_ORIGIN
        ]

    model_config = SettingsConfigDict(
        env_file=".env",
        extra='ignore',
        populate_by_name=True,
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Set defaults based on environment after initialization
        if not self.FRONTEND_URL:
            self.FRONTEND_URL = "https://chime-theta.vercel.app" if self.is_production else "http://localhost:5173"
        
        if not self.API_URL:
            self.API_URL = "https://chime-6r3r.onrender.com" if self.is_production else "http://localhost:8000"
        
        if not self.CORS_ORIGIN:
            self.CORS_ORIGIN = "https://chime-theta.vercel.app" if self.is_production else "http://localhost:5173"
        
        if not self.SPOTIFY_REDIRECT_URI:
            self.SPOTIFY_REDIRECT_URI = (
                "https://chime-6r3r.onrender.com/api/auth/callback" 
                if self.is_production 
                else "http://localhost:8000/api/auth/callback"
            )

        # Debug print
        print(f"Environment: {self.ENVIRONMENT}")
        print(f"Frontend URL: {self.FRONTEND_URL}")
        print(f"API URL: {self.API_URL}")
        print(f"CORS Origin: {self.CORS_ORIGIN}")
        print(f"Spotify Redirect URI: {self.SPOTIFY_REDIRECT_URI}")

settings = Settings()