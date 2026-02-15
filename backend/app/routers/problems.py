from fastapi import APIRouter, Request, HTTPException, Depends
from ..models import schemas
from ..services import auth as auth_service
from .users import get_current_user
from typing import List

router = APIRouter()


def _objid(id_str: str):
    return __import__("bson").ObjectId(id_str)


@router.get("", response_model=List[schemas.ProblemOut])
async def list_problems(request: Request, courseId: str = None, courseCode: str = None):
    db = request.app.state.db
    q = {}
    if courseCode:
        course = await db.courses.find_one({"courseCode": {"$regex": f"^{courseCode.strip()}$", "$options": "i"}})
        if not course:
            return []
        q["courseId"] = course.get("_id")
    elif courseId:
        q["courseId"] = _objid(courseId)
    cur = db.problems.find(q).sort([("createdAt", -1)])
    items = []
    async for doc in cur:
        # attach courseCode for frontend convenience
        try:
            course = await db.courses.find_one({"_id": doc.get("courseId")})
            if course:
                doc["courseCode"] = course.get("courseCode")
        except Exception:
            pass
        # convert to Pydantic model so FastAPI handles ObjectId encoding
        try:
            items.append(schemas.ProblemOut.parse_obj(doc))
        except Exception:
            items.append(doc)
    return items


@router.post("", status_code=201, response_model=schemas.ProblemOut)
async def create_problem(payload: schemas.ProblemCreate, request: Request, current_user: dict = Depends(get_current_user)):
    db = request.app.state.db
    now = __import__("datetime").datetime.utcnow()
    doc = payload.dict()

    # Allow payload.courseId to be either an ObjectId string or a courseCode
    course_obj = None
    try:
        # first try by ObjectId
        course_obj = await db.courses.find_one({"_id": _objid(payload.courseId)})
    except Exception:
        course_obj = None

    if not course_obj:
        # try by courseCode (case-insensitive, trimmed)
        course_obj = await db.courses.find_one({"courseCode": {"$regex": f"^{payload.courseId.strip()}$", "$options": "i"}})

    if not course_obj:
        raise HTTPException(status_code=400, detail="Invalid course identifier")

    doc.update({
        "courseId": course_obj.get("_id"),
        "courseCode": course_obj.get("courseCode"),
        "authorId": current_user.get("_id"),
        "votes": 0,
        "createdAt": now,
        "updatedAt": now,
        "isVerified": False,
        "isFlagged": False,
    })
    res = await db.problems.insert_one(doc)
    created = await db.problems.find_one({"_id": res.inserted_id})
    # attach courseCode and author username
    created["courseCode"] = course_obj.get("courseCode")
    try:
        created["authorUsername"] = current_user.get("username")
    except Exception:
        pass
    try:
        return schemas.ProblemOut.parse_obj(created)
    except Exception:
        return created


@router.get("/{problem_id}", response_model=schemas.ProblemOut)
async def get_problem(problem_id: str, request: Request):
    db = request.app.state.db
    doc = await db.problems.find_one({"_id": _objid(problem_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Problem not found")
    try:
        course = await db.courses.find_one({"_id": doc.get("courseId")})
        if course:
            doc["courseCode"] = course.get("courseCode")
    except Exception:
        pass
    try:
        return schemas.ProblemOut.parse_obj(doc)
    except Exception:
        return doc


@router.post("/{problem_id}/vote", response_model=schemas.ProblemOut)
async def vote_problem(problem_id: str, request: Request):
    db = request.app.state.db
    body = await request.json()
    delta = int(body.get("delta", 1))
    res = await db.problems.find_one_and_update({"_id": _objid(problem_id)}, {"$inc": {"votes": delta}}, return_document=True)
    try:
        return schemas.ProblemOut.parse_obj(res)
    except Exception:
        return res
