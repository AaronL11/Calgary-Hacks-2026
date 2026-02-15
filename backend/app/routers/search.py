from fastapi import APIRouter, Request

router = APIRouter()


@router.get("")
async def search(q: str, request: Request):
    db = request.app.state.db
    # naive text search across courses and problems
    courses = []
    async for c in db.courses.find({"$text": {"$search": q}}).limit(10):
        courses.append(c)
    problems = []
    async for p in db.problems.find({"$text": {"$search": q}}).limit(20):
        problems.append(p)
    return {"courses": courses, "problems": problems}
