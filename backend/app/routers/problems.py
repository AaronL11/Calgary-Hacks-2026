from fastapi import APIRouter, Request, HTTPException, Depends
from ..models import schemas
from ..services import auth as auth_service

router = APIRouter()


def _objid(id_str: str):
    return __import__("bson").ObjectId(id_str)


@router.get("")
async def list_problems(request: Request, courseId: str = None):
    db = request.app.state.db
    q = {}
    if courseId:
        q["courseId"] = _objid(courseId)
    cur = db.problems.find(q).sort([("createdAt", -1)])
    items = []
    async for doc in cur:
        items.append(doc)
    return items


@router.post("", status_code=201)
async def create_problem(payload: schemas.ProblemCreate, request: Request, current_user=Depends(lambda request=...: None)):
    db = request.app.state.db
    now = __import__("datetime").datetime.utcnow()
    doc = payload.dict()
    doc.update({
        "courseId": _objid(payload.courseId),
        "authorId": None,
        "votes": 0,
        "createdAt": now,
        "updatedAt": now,
        "isVerified": False,
        "isFlagged": False,
    })
    res = await db.problems.insert_one(doc)
    return await db.problems.find_one({"_id": res.inserted_id})


@router.get("/{problem_id}")
async def get_problem(problem_id: str, request: Request):
    db = request.app.state.db
    doc = await db.problems.find_one({"_id": _objid(problem_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Problem not found")
    return doc


@router.post("/{problem_id}/vote")
async def vote_problem(problem_id: str, request: Request):
    db = request.app.state.db
    body = await request.json()
    delta = int(body.get("delta", 1))
    res = await db.problems.find_one_and_update({"_id": _objid(problem_id)}, {"$inc": {"votes": delta}}, return_document=True)
    return res
