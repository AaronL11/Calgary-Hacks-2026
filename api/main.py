from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from database import user_collection
from routers.auth import router as auth_router  # <-- your auth endpoints

# Handle startup for app
@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    await user_collection.create_index("username", unique=True)
    yield

app: FastAPI = FastAPI(lifespan=lifespan)

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to frontend URL for production (we don't need for this hackathon so use *)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
