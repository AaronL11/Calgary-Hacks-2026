from fastapi import APIRouter, HTTPException
from typing import List
from database import db
from models import CourseCreateRequest, CourseResponse

router = APIRouter(prefix="/courses", tags=["Courses"])
course_collection = db["courses"]

# Create a new course:
@router.post("/")
async def create_course(request: CourseCreateRequest) -> CourseResponse:
    existing = await course_collection.find_one(
        {"code": request.code, "number": request.number}
    )
    if existing:
        raise HTTPException(status_code=400, detail="Course already exists")

    result = await course_collection.insert_one(request.dict())
    return CourseResponse(
        id=str(result.inserted_id),
        code=request.code,
        number=request.number,
        description=request.description
    )

# List courses, with filters for course code and course number: 
@router.get("/", response_model=List[CourseResponse])
async def list_courses(code: str = None, number: str = None) -> List[CourseResponse]:
    query = {}
    if code:
        query["code"] = code
    if number:
        query["number"] = number

    cursor = course_collection.find(query)
    courses = []
    async for doc in cursor:
        courses.append(CourseResponse(
            id=str(doc["_id"]),
            code=doc["code"],
            number=doc["number"],
            description=doc["description"]
        ))
    return courses
