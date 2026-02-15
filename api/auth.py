import bcrypt
from jose import jwt, JWTError
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Dict, Any

import os
from dotenv import load_dotenv
SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"

security: HTTPBearer = HTTPBearer() # for JWT Bearer token

def hash_password(password: str):
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

# Used in login:
def verify_password(password: str, hashed_password: bytes):
    return bcrypt.checkpw(password.encode("utf-8"), hashed_password)

def create_access_token(data: dict):
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

# Used to verify JWT token from Authorization header
def verify_access_token(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> Dict[str, Any]:
    token: str = credentials.credentials
    try:
        payload: Dict[str, Any] = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")