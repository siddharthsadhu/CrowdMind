from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "CrowdMind API"
    debug: bool = False

    database_url: str = "postgresql+asyncpg://crowdmind:crowdmind@localhost:5432/crowdmind"
    database_url_sync: str = "postgresql+psycopg://crowdmind:crowdmind@localhost:5432/crowdmind"

    clerk_secret_key: str = ""
    clerk_publishable_key: str = ""
    clerk_webhook_secret: str = ""

    cors_origins: list[str] = ["http://localhost:5173"]

    gemini_api_key: str = ""
    groq_api_key: str = ""

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
