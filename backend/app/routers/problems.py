from fastapi import APIRouter, Request, HTTPException, Depends
from ..models import schemas
from ..services import auth as auth_service
from .users import get_current_user

router = APIRouter()


def _objid(id_str: str):
    return __import__("bson").ObjectId(id_str)


@router.get("")
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
        # stringify ObjectId fields for JSON serialization
        try:
            if doc.get("_id") is not None:
                doc["_id"] = str(doc.get("_id"))
        except Exception:
            pass
        try:
            if doc.get("courseId") is not None:
                doc["courseId"] = str(doc.get("courseId"))
        except Exception:
            pass
        items.append(doc)
    return items


@router.post("", status_code=201)
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
    # stringify ObjectId fields
    try:
        if created.get("_id") is not None:
            created["_id"] = str(created.get("_id"))
    except Exception:
        pass
    try:
        if created.get("courseId") is not None:
            created["courseId"] = str(created.get("courseId"))
    except Exception:
        pass
    try:
        if created.get("authorId") is not None:
            created["authorId"] = str(created.get("authorId"))
    except Exception:
        pass
    return created


@router.get("/{problem_id}")
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
    # stringify ObjectId fields
    try:
        if doc.get("_id") is not None:
            doc["_id"] = str(doc.get("_id"))
    except Exception:
        pass
    try:
        if doc.get("courseId") is not None:
            doc["courseId"] = str(doc.get("courseId"))
    except Exception:
        pass
    return doc


@router.post("/{problem_id}/vote")
async def vote_problem(problem_id: str, request: Request):
    db = request.app.state.db
    body = await request.json()
    delta = int(body.get("delta", 1))
    res = await db.problems.find_one_and_update({"_id": _objid(problem_id)}, {"$inc": {"votes": delta}}, return_document=True)
    try:
        if res and res.get("_id") is not None:
            res["_id"] = str(res.get("_id"))
    except Exception:
        pass
    try:
        if res and res.get("courseId") is not None:
            res["courseId"] = str(res.get("courseId"))
    except Exception:
        pass
    return res
