from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, List
from datetime import datetime
from database import db
from auth import verify_access_token
from models import CommentCreateRequest, CommentResponse, ProblemResponse

router = APIRouter(prefix="/comments", tags=["Comments"])
comment_collection = db["comments"]
problem_collection = db["problems"]
user_collection = db["user"]

# User can comment on a problem: 
@router.post("/")
async def post_comment(request: CommentCreateRequest, payload: Dict = Depends(verify_access_token)) -> CommentResponse:
    creator_id: str = payload.get("username")
    if not creator_id:
        raise HTTPException(status_code=401, detail="Invalid token")

    comment_doc = {
        "problem_id": request.problem_id,
        "creator_id": creator_id,
        "text": request.text,
        "votes": 0,
        "created_at": datetime.utcnow(),
        "starred": False
    }

    result = await comment_collection.insert_one(comment_doc)
    return CommentResponse(id=str(result.inserted_id), **comment_doc)

# Get all comments for a problem: 
@router.get("/{problem_id}", response_model=List[CommentResponse])
async def get_comments(problem_id: str) -> List[CommentResponse]:
    cursor = comment_collection.find({"problem_id": problem_id}).sort("votes", -1)
    comments: List[CommentResponse] = []
    async for doc in cursor:
        comments.append(CommentResponse(
            id=str(doc["_id"]),
            problem_id=doc["problem_id"],
            creator_id=doc["creator_id"],
            text=doc["text"],
            votes=doc["votes"],
            created_at=doc["created_at"],
            starred=doc["starred"]
        ))
    return comments
