from pydantic import BaseModel, EmailStr, Field
try:
    from pydantic import core_schema  # type: ignore
    PYDANTIC_V2 = True
except Exception:
    core_schema = None  # type: ignore
    PYDANTIC_V2 = False
from typing import List, Optional
from datetime import datetime
from bson import ObjectId


class PyObjectId(ObjectId):
    @staticmethod
    def _validate(v, *args, **kwargs):
        # Accept extra args/kwargs for compatibility with different pydantic versions
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    if PYDANTIC_V2:
        @classmethod
        def __get_pydantic_core_schema__(cls, source, handler):
            return core_schema.no_info_plain_validator_function(cls._validate)
    else:
        @classmethod
        def __get_validators__(cls):
            yield cls._validate


class UserAccount(BaseModel):
    username: str = Field(..., min_length=3)
    email: EmailStr
    # Accept either plain password or pre-hashed passwordHash in incoming data
    password: Optional[str] = Field(None, min_length=6)
    passwordHash: Optional[str] = None

    # Fields present in DB doc; provide defaults so validation accepts partial input
    contributionCount: int = 0
    reputation: int = 0
    joinedAt: Optional[datetime] = None
    lastLoginAt: Optional[datetime] = None


class UserData(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        json_encoders = {ObjectId: str}
        allow_population_by_field_name = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class CourseCreate(BaseModel):
    courseCode: str
    courseName: str
    department: Optional[str]
    professor: Optional[str]
    semester: Optional[str]
    year: Optional[int]
    tags: Optional[List[str]] = []
    description: Optional[str]


class ProblemCreate(BaseModel):
    courseId: str
    title: str
    description: str
    tags: Optional[List[str]] = []
    difficulty: Optional[str]
    examType: Optional[str]


class ResponseCreate(BaseModel):
    problemId: str
    content: str
