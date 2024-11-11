from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    SPOTIFY_CLIENT_ID: str
    SPOTIFY_CLIENT_SECRET: str

    PORT: int = 8000
    FRONTEND_URL: str = "http://localhost:5173"
    API_URL: str = "http://localhost:8000"

    # Derived setting using property
    @property
    def SPOTIFY_REDIRECT_URI(self) -> str:
        return f"{self.API_URL}/api/auth/callback"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra='ignore'
    )

settings = Settings()