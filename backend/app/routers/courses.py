from fastapi import APIRouter, Request, HTTPException
from ..models import schemas
from typing import List

router = APIRouter()


@router.get("", response_model=List[dict])
async def list_courses(request: Request):
    db = request.app.state.db
    cur = db.courses.find().sort([("courseCode", 1)])
    items = []
    async for doc in cur:
        # Ensure ObjectId values are converted to strings for JSON serialization
        try:
            if doc.get("_id") is not None:
                doc["_id"] = str(doc.get("_id"))
        except Exception:
            pass
        items.append(doc)
    return items


@router.get("/{course_id}")
async def get_course(course_id: str, request: Request):
    db = request.app.state.db
    doc = await db.courses.find_one({"_id": __import__("bson").ObjectId(course_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Course not found")
    try:
        if doc.get("_id") is not None:
            doc["_id"] = str(doc.get("_id"))
    except Exception:
        pass
    return doc


@router.post("", status_code=201)
async def create_course(payload: schemas.CourseCreate, request: Request):
    db = request.app.state.db
    data = payload.dict()
    data.update({"createdAt": __import__("datetime").datetime.utcnow(), "updatedAt": __import__("datetime").datetime.utcnow(), "enrollmentCount": 0, "problemCount": 0})
    res = await db.courses.insert_one(data)
    doc = await db.courses.find_one({"_id": res.inserted_id})
    try:
        if doc.get("_id") is not None:
            doc["_id"] = str(doc.get("_id"))
    except Exception:
        pass
    return doc
