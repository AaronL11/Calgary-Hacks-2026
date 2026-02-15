from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)


class UserCreate(BaseModel):
    username: str = Field(..., min_length=3)
    email: EmailStr
    password: str = Field(..., min_length=6)
    degree: Optional[str]
    yearOfStudy: Optional[int]


class UserOut(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    username: str
    email: EmailStr
    degree: Optional[str]
    yearOfStudy: Optional[int]
    contributionCount: int = 0
    reputation: int = 0
    joinedAt: datetime

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
