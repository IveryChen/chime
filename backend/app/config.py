from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    SPOTIFY_CLIENT_ID: str
    SPOTIFY_CLIENT_SECRET: str
    PORT: int = 8000
    FRONTEND_URL: str
    API_URL: str
    CORS_ORIGIN: str
    SPOTIFY_REDIRECT_URI: str

    model_config = SettingsConfigDict(
        env_file=".env",
        extra='ignore',
        populate_by_name=True
    )

settings = Settings()