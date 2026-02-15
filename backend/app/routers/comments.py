from fastapi import APIRouter, Request, Depends
from ..models import schemas
from .users import get_current_user
from typing import List

router = APIRouter()


def _objid(id_str: str):
    return __import__("bson").ObjectId(id_str)


@router.get("/problem/{problem_id}", response_model=List[schemas.CommentOut])
async def get_comments(problem_id: str, request: Request):
    db = request.app.state.db
    cur = db.comments.find({"problemId": _objid(problem_id)}).sort([("createdAt", -1)])
    items = []
    async for doc in cur:
        try:
            author_id = doc.get("authorId")
            if author_id:
                user = await db.users.find_one({"_id": author_id})
                if user:
                    doc["authorUsername"] = user.get("username")
        except Exception:
            pass
        try:
            items.append(schemas.CommentOut.parse_obj(doc))
        except Exception:
            items.append(doc)
    return items


@router.post("", status_code=201, response_model=schemas.CommentOut)
async def create_comment(payload: schemas.CommentCreate, request: Request, current_user: dict = Depends(get_current_user)):
    db = request.app.state.db
    now = __import__("datetime").datetime.utcnow()
    doc = payload.dict()
    doc.update({
        "problemId": _objid(payload.problemId),
        "authorId": current_user.get("_id"),
        "upvotes": 0,
        "downvotes": 0,
        "createdAt": now,
        "updatedAt": now,
    })
    res = await db.comments.insert_one(doc)
    created = await db.comments.find_one({"_id": res.inserted_id})
    try:
        created["authorUsername"] = current_user.get("username")
    except Exception:
        pass
    # increment user's contribution count
    try:
        await db.users.update_one({"_id": current_user.get("_id")}, {"$inc": {"contributionCount": 1}})
    except Exception:
        pass
    try:
        return schemas.CommentOut.parse_obj(created)
    except Exception:
        return created


@router.post("/{comment_id}/vote", response_model=schemas.CommentOut)
async def vote_comment(comment_id: str, request: Request):
    db = request.app.state.db
    body = await request.json()
    delta = int(body.get("delta", 1))
    res = await db.comments.find_one_and_update({"_id": _objid(comment_id)}, {"$inc": {"upvotes": delta}}, return_document=True)
    try:
        return schemas.CommentOut.parse_obj(res)
    except Exception:
        return res
