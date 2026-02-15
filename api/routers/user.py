from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, List
from database import user_collection
from auth import verify_access_token
from models import SetPreferencesRequest

router = APIRouter(prefix="/user", tags=["User"])

# Logged in user sets their preferences: 
@router.post("/preferences")
async def set_preferences(
    request: SetPreferencesRequest,
    payload: Dict = Depends(verify_access_token)
) -> Dict[str, str]:

    username: str = payload.get("username")
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    update_result = await user_collection.update_one(
        {"username": username},
        {"$set": {"preferences": request.preferences}}
    )
    if update_result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "Preferences updated successfully"}


# Get the number of problems the user has resolved (stars):
@router.get("/star_count")
async def get_star_count(payload: Dict = Depends(verify_access_token)) -> Dict[str, int]:

    username: str = payload.get("username")
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    user = await user_collection.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"star_count": user.get("star_count", 0)}
