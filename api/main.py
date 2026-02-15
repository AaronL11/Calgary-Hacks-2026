from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from database import db, user_collection # database for indexing
from routers.auth import router as auth_router
from routers.user import router as user_router
from routers.courses import router as courses_router
from routers.problems import router as problems_router
from routers.comments import router as comments_router



# Handle startup for app with indices: 
@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    # Users: unique username
    await user_collection.create_index("username", unique=True)

    # Courses: unique code+number
    await db["courses"].create_index([("code", 1), ("number", 1)], unique=True)

    # Problems: course_code+course_number+votes for sorting/filtering
    await db["problems"].create_index([("course_code", 1), ("course_number", 1), ("votes", -1)])
    await db["problems"].create_index("professor")  # filter by professor

    # Comments: problem_id+votes for sorting
    await db["comments"].create_index([("problem_id", 1), ("votes", -1)])

    yield  # everything before yield runs at app startup, everything after is run at shutdown


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
app.include_router(user_router)
app.include_router(courses_router)
app.include_router(problems_router)
app.include_router(comments_router)