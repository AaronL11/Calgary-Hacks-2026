from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional
from pydantic_settings import BaseSettings
import os


class Settings(BaseSettings):
    # Provide a sensible default for local development so the app can run
    # without requiring a .env file. Production should set the env var.
    MONGO_URI: str = "mongodb://localhost:27017/ch2026"


settings = Settings(_env_file=".env", _env_file_encoding="utf-8")


client: Optional[AsyncIOMotorClient] = None


async def connect(app):
    global client
    client = AsyncIOMotorClient(settings.MONGO_URI)
    app.state.mongo_client = client
    app.state.db = client.get_default_database()


async def close(app):
    global client
    if client:
        client.close()


def get_db(app):
    return app.state.db
