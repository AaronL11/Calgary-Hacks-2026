from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import connect, close
from .routers import auth, users, courses, problems, responses, search
import os


app = FastAPI(title="UArchive API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await connect(app)


@app.on_event("shutdown")
async def shutdown():
    await close(app)


app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(courses.router, prefix="/api/courses", tags=["courses"])
app.include_router(problems.router, prefix="/api/problems", tags=["problems"])
app.include_router(responses.router, prefix="/api/responses", tags=["responses"])
app.include_router(search.router, prefix="/api/search", tags=["search"])
