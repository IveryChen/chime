from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
import os

class Settings(BaseSettings):
    SPOTIFY_CLIENT_ID: str
    SPOTIFY_CLIENT_SECRET: str

    PORT: int = int(os.getenv("PORT", 8000))
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    API_URL: str = os.getenv("API_URL", "http://localhost:8000")
    CORS_ORIGIN: str = os.getenv("CORS_ORIGIN", "http://localhost:5173")
    SPOTIFY_REDIRECT_URI: str = os.getenv(
        "SPOTIFY_REDIRECT_URI", 
        "http://localhost:8000/api/auth/callback"
    )

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

    def model_post_init(self, _context) -> None:
        """Post initialization hook to set production values if needed"""
        if self.is_production:
            if self.FRONTEND_URL == "http://localhost:5173":
                self.FRONTEND_URL = "https://chime-theta.vercel.app"
            if self.API_URL == "http://localhost:8000":
                self.API_URL = "https://chime-6r3r.onrender.com/"
            if self.CORS_ORIGIN == "http://localhost:5173":
                self.CORS_ORIGIN = "https://chime-theta.vercel.app"
            if self.SPOTIFY_REDIRECT_URI == "http://localhost:8000/api/auth/callback":
                self.SPOTIFY_REDIRECT_URI = "https://chime-6r3r.onrender.com/api/auth/callback"

settings = Settings()