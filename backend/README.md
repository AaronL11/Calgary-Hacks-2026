# UArchive Backend

FastAPI backend using MongoDB (Motor). Run locally with environment variables set.

Requirements: Python 3.10+

Install:

```
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Run locally:

```
uvicorn app.main:app --reload --port 8000
```

Environment variables (use `.env`):

- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - HMAC secret for JWT
