from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    SPOTIFY_CLIENT_ID: str
    SPOTIFY_CLIENT_SECRET: str
    PORT: int = 8000
    FRONTEND_URL: str
    API_URL: str
    CORS_ORIGIN: str
    SPOTIFY_REDIRECT_URI: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=".env",
        extra='ignore',
        populate_by_name=True
    )

    # Use model_post_init instead of __init__
    def model_post_init(self, *args, **kwargs) -> None:
        super().model_post_init(*args, **kwargs)
        # Set the redirect URI after validation
        if not self.SPOTIFY_REDIRECT_URI:
            self.SPOTIFY_REDIRECT_URI = f"{self.API_URL}/api/auth/callback"

settings = Settings()