from app.core.config import Settings


def test_render_postgres_url_uses_psycopg3_driver():
    settings = Settings(database_url="postgresql://user:password@host/database")
    assert settings.database_url == "postgresql+psycopg://user:password@host/database"


def test_legacy_postgres_url_is_also_normalized():
    settings = Settings(database_url="postgres://user:password@host/database")
    assert settings.database_url == "postgresql+psycopg://user:password@host/database"
