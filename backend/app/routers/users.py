from fastapi import APIRouter, Request, Depends, HTTPException
from ..models import schemas
from ..services import auth as auth_service
from typing import Optional
from jose import jwt

router = APIRouter()


async def get_current_user(request: Request):
    auth = request.headers.get("authorization")
    if not auth:
        raise HTTPException(status_code=401, detail="Missing authorization")
    scheme, _, token = auth.partition(" ")
    if scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid auth scheme")
    try:
        payload = auth_service.decode_access_token(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    user_id = payload.get("sub")
    user = await request.app.state.db.users.find_one({"_id": __import__("bson").ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/me", response_model=schemas.UserOut)
async def me(current_user: dict = Depends(get_current_user)):
    return current_user


@router.get("/{user_id}", response_model=schemas.UserOut)
async def get_user(user_id: str, request: Request):
    db = request.app.state.db
    user = await db.users.find_one({"_id": __import__("bson").ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
