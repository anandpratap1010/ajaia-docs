from functools import lru_cache
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "Ajaia Docs API"
    database_url: str = "sqlite:///./ajaia_docs.db"
    jwt_secret_key: str = "local-development-key-change-me"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 480
    cors_origins: str = "http://localhost:5173"
    environment: str = "development"
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @field_validator("database_url", mode="before")
    @classmethod
    def use_psycopg3_driver(cls, value: str) -> str:
        """Make provider-issued PostgreSQL URLs use the installed Psycopg 3 driver."""
        if value.startswith("postgres://"):
            return value.replace("postgres://", "postgresql+psycopg://", 1)
        if value.startswith("postgresql://"):
            return value.replace("postgresql://", "postgresql+psycopg://", 1)
        return value

    @property
    def cors_origin_list(self) -> list[str]:
        return [item.strip() for item in self.cors_origins.split(",") if item.strip()]

@lru_cache
def get_settings() -> Settings:
    return Settings()
