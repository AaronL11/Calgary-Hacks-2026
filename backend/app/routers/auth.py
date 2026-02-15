from fastapi import APIRouter, HTTPException, Depends, Request
from ..models import schemas
from ..services import auth as auth_service
from fastapi import status
from bson import ObjectId
import logging
from pydantic import ValidationError

logger = logging.getLogger("uvicorn.error")

router = APIRouter()


@router.post("/register", response_model=schemas.UserData)
async def register(request: Request):
    # Read raw body to aid debugging validation errors
    db = request.app.state.db
    try:
        body = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")

    # Log at INFO so it's visible in typical server logs
    logger.info("Register body received: %s", body)

    try:
        user_in = schemas.UserAccount.model_validate(body)
    except ValidationError as ve:
        logger.warning("User registration validation failed: %s", ve)
        # Return FastAPI-style 422 detail for consistency
        raise HTTPException(status_code=422, detail=ve.errors())
    # uniqueness checks
    if await db.users.find_one({"username": user_in.username}):
        raise HTTPException(status_code=400, detail="username already exists")
    if await db.users.find_one({"email": user_in.email}):
        raise HTTPException(status_code=400, detail="email already exists")

    hashed = auth_service.get_password_hash(user_in.password)
    now = __import__("datetime").datetime.utcnow()
    doc = {
        "username": user_in.username,
        "email": user_in.email,
        "passwordHash": hashed,
        "contributionCount": 0,
        "reputation": 0,
        "joinedAt": now,
        "lastLoginAt": now,
    }
    res = await db.users.insert_one(doc)
    created = await db.users.find_one({"_id": res.inserted_id})
    created["_id"] = created["_id"]
    return created


@router.post("/login", response_model=schemas.Token)
async def login(request: Request):
    body = await request.json()
    username = body.get("username")
    password = body.get("password")
    if not username or not password:
        raise HTTPException(status_code=400, detail="username and password required")
    db = request.app.state.db
    user = await db.users.find_one({"username": username})
    if not user:
        # allow login by email
        user = await db.users.find_one({"email": username})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not auth_service.verify_password(password, user.get("passwordHash")):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = auth_service.create_access_token({"sub": str(user.get("_id")), "username": user.get("username")})
    # update lastLoginAt
    await db.users.update_one({"_id": user.get("_id")}, {"$set": {"lastLoginAt": __import__("datetime").datetime.utcnow()}})
    return {"access_token": token, "token_type": "bearer"}
