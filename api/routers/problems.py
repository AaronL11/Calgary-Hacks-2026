from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict
from datetime import datetime
from database import db
from auth import verify_access_token
from models import ProblemCreateRequest, ProblemResponse

router = APIRouter(prefix="/problems", tags=["Problems"])
problem_collection = db["problems"]

# Post a problem:
@router.post("/")
async def create_problem(
    request: ProblemCreateRequest,
    payload: Dict = Depends(verify_access_token)
) -> ProblemResponse:

    creator_id: str = payload.get("username")
    if not creator_id:
        raise HTTPException(status_code=401, detail="Invalid token")

    problem_doc = {
        "course_code": request.course_code,
        "course_number": request.course_number,
        "professor": request.professor,
        "creator_id": creator_id,
        "title": request.title,
        "text": request.text,
        "tags": request.tags,
        "created_at": datetime.utcnow(),
        "votes": 0,
        "resolved": False,
        "chosen_comment_id": None
    }

    result = await problem_collection.insert_one(problem_doc)
    return ProblemResponse(id=str(result.inserted_id), **problem_doc)


# Get problems, filters for: course code, course number, professor:
@router.get("/", response_model=List[ProblemResponse])
async def get_problems(
    course_code: str = None,
    course_number: str = None,
    professor: str = None
) -> List[ProblemResponse]:

    query: Dict = {}
    if course_code:
        query["course_code"] = course_code
    if course_number:
        query["course_number"] = course_number
    if professor:
        query["professor"] = professor

    cursor = problem_collection.find(query).sort("votes", -1)
    problems: List[ProblemResponse] = []
    async for doc in cursor:
        problems.append(ProblemResponse(
            id=str(doc["_id"]),
            course_code=doc["course_code"],
            course_number=doc["course_number"],
            professor=doc["professor"],
            creator_id=doc["creator_id"],
            title=doc["title"],
            text=doc["text"],
            tags=doc["tags"],
            created_at=doc["created_at"],
            votes=doc["votes"],
            resolved=doc["resolved"],
            chosen_comment_id=doc.get("chosen_comment_id")
        ))
    return problems
