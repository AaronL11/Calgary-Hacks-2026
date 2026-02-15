from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional
from pydantic_settings import BaseSettings
import os
import logging

logger = logging.getLogger("uvicorn.error")


class Settings(BaseSettings):
    # Provide a sensible default for local development so the app can run
    # without requiring a .env file. Production should set the env var.
    MONGO_URI: str = "mongodb://localhost:27017/ch2026"
    model_config = {"extra": "ignore"}


settings = Settings(_env_file=".env", _env_file_encoding="utf-8")


client: Optional[AsyncIOMotorClient] = None


async def connect(app):
    global client
    client = AsyncIOMotorClient(settings.MONGO_URI)
    app.state.mongo_client = client
    app.state.db = client.get_default_database()


async def init_db(app):
    """Create collections and indexes needed by the application.

    This is idempotent: creating an index that already exists is a no-op.
    Call this after `connect(app)` during application startup.
    """
    db = app.state.db
    # Users: unique username and email
    try:
        idx = await db.users.create_index("username", unique=True)
        logger.info("Created/ensured index on users.username: %s", idx)
        idx = await db.users.create_index("email", unique=True)
        logger.info("Created/ensured index on users.email: %s", idx)
    except Exception:
        logger.exception("Failed to create users indexes")

    # Courses: text search across code, name, description, tags
    try:
        idx = await db.courses.create_index([
            ("courseCode", "text"),
            ("courseName", "text"),
            ("description", "text"),
            ("tags", "text"),
        ])
        logger.info("Created/ensured text index on courses: %s", idx)
    except Exception:
        logger.exception("Failed to create courses text index")

    # Problems: text search and lookup by courseId
    try:
        idx = await db.problems.create_index([
            ("title", "text"),
            ("description", "text"),
            ("tags", "text"),
        ])
        logger.info("Created/ensured text index on problems: %s", idx)
        idx = await db.problems.create_index("courseId")
        logger.info("Created/ensured index on problems.courseId: %s", idx)
        idx = await db.problems.create_index("createdAt")
        logger.info("Created/ensured index on problems.createdAt: %s", idx)
    except Exception:
        logger.exception("Failed to create problems indexes")

    # Responses: lookup by problemId and sort by upvotes
    try:
        idx = await db.responses.create_index("problemId")
        logger.info("Created/ensured index on responses.problemId: %s", idx)
        idx = await db.responses.create_index([("upvotes", -1)])
        logger.info("Created/ensured index on responses.upvotes: %s", idx)
    except Exception:
        logger.exception("Failed to create responses indexes")

    # Seed database with mock data when empty
    try:
        from .seeds import seed_db

        await seed_db(app)
        logger.info("Database seeding (if needed) complete")
    except Exception:
        logger.exception("Failed to seed database")


async def close(app):
    global client
    if client:
        client.close()


def get_db(app):
    return app.state.db
