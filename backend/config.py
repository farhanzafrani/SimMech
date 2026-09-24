"""Application configuration using Pydantic Settings"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    app_name: str = "SimMec API"
    debug: bool = False
    port: int = 8000
    host: str = "0.0.0.0"

    cors_origins: list[str] = [
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # Alternative React dev server
    ]

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
