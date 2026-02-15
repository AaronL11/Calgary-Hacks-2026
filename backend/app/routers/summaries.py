from fastapi import APIRouter, Request, HTTPException, Depends
from ..models import schemas
from .users import get_current_user

router = APIRouter()


def _objid(id_str: str):
    return __import__("bson").ObjectId(id_str)


@router.post("", status_code=201)
async def create_summary(payload: schemas.SummaryCreate, request: Request, current_user: dict = Depends(get_current_user)):
    db = request.app.state.db
    now = __import__("datetime").datetime.utcnow()
    doc = payload.dict()

    # Allow payload.courseId to be either an ObjectId string or a courseCode
    course_obj = None
    try:
        course_obj = await db.courses.find_one({"_id": _objid(payload.courseId)})
    except Exception:
        course_obj = None

    if not course_obj:
        course_obj = await db.courses.find_one({"courseCode": {"$regex": f"^{payload.courseId.strip()}$", "$options": "i"}})

    if not course_obj:
        raise HTTPException(status_code=400, detail="Invalid course identifier")

    doc.update({
        "courseId": course_obj.get("_id"),
        "courseCode": course_obj.get("courseCode"),
        "authorId": current_user.get("_id"),
        "authorUsername": current_user.get("username"),
        "votes": 0,
        "createdAt": now,
        "updatedAt": now,
    })
    res = await db.summaries.insert_one(doc)
    created = await db.summaries.find_one({"_id": res.inserted_id})
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


@router.get("")
async def list_summaries(request: Request, courseId: str = None, courseCode: str = None):
    db = request.app.state.db
    q = {}
    if courseCode:
        course = await db.courses.find_one({"courseCode": {"$regex": f"^{courseCode.strip()}$", "$options": "i"}})
        if not course:
            return []
        q["courseId"] = course.get("_id")
    elif courseId:
        try:
            q["courseId"] = _objid(courseId)
        except Exception:
            q["courseId"] = courseId

    cur = db.summaries.find(q).sort([("createdAt", -1)])
    items = []
    async for doc in cur:
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
        items.append(doc)
    return items
