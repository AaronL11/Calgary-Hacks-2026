from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional
from pydantic import BaseSettings
import os


class Settings(BaseSettings):
    MONGO_URI: str


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
