from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
import os

class Settings(BaseSettings):
    SPOTIFY_CLIENT_ID: str
    SPOTIFY_CLIENT_SECRET: str

    PORT: int = int(os.getenv("PORT", 8000))
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    FRONTEND_URL: str
    API_URL: str
    CORS_ORIGIN: str
    SPOTIFY_REDIRECT_URI: str

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
        env_file_encoding='utf-8',
        case_sensitive=False
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Debug print to see what values we're getting
        print(f"Environment: {self.ENVIRONMENT}")
        print(f"Frontend URL: {self.FRONTEND_URL}")
        print(f"API URL: {self.API_URL}")
        print(f"CORS Origin: {self.CORS_ORIGIN}")
        print(f"Spotify Redirect URI: {self.SPOTIFY_REDIRECT_URI}")
        
settings = Settings()