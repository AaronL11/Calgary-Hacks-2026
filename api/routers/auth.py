from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, Union

from models import UserRegister, UserLogin
from database import user_collection
from auth import hash_password, verify_password, create_access_token, verify_access_token

router: APIRouter = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register")
async def register(user: UserRegister) -> Dict[str, str]:

    # Check if username exists:
    existing_user: Union[Dict[str, Any], None] = await user_collection.find_one(
        {"username": user.username}
    )

    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    # Check if email already exists
    if hasattr(user, "email") and user.email:
        existing_email = await user_collection.find_one({"email": user.email})
        if existing_email:
            raise HTTPException(status_code=400, detail="Email already registered")

    # Hash the password
    hashed_pw: bytes = hash_password(user.password)

    # Create new user document
    new_user: Dict[str, Any] = {
        "username": user.username,
        "password": hashed_pw,
        "email": getattr(user, "email", None),
    }

    # Insert into MongoDB
    await user_collection.insert_one(new_user)

    return {"message": "User registered successfully"}


@router.post("/login")
async def login(user: UserLogin) -> Dict[str, str]:
    # Check if username exists:
    db_user: Union[Dict[str, Any], None] = await user_collection.find_one(
        {"username": user.username}
    )

    if not db_user:
        raise HTTPException(status_code=401, detail="Username not found")

    # Verify password
    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Incorrect Password")

    # Create JWT token
    token: str = create_access_token({"username": user.username})

    return {
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer",
    }

# Protected route that returns current logged-in user info.
# Needs JWT token in Authorization header
@router.get("/me")
async def get_current_user(payload: Dict[str, Any] = Depends(verify_access_token)) -> Dict[str, str]:
    """
    Protected route: returns the current logged-in user info.
    Requires JWT token in Authorization header.
    """
    username: str = payload.get("username")
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    db_user: Union[Dict[str, Any], None] = await user_collection.find_one({"username": username})
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"username": username}
