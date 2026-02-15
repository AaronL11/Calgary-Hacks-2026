from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime

# USER MODELS:
class UserRegister(BaseModel):
    username: str = Field(..., min_length=2)
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    username: str
    password: str

class SetPreferencesRequest(BaseModel):
    preferences: List[str]  # ["CPSC", "BIOL", "CHEM"]


# COURSE MODELS:
class CourseCreateRequest(BaseModel):
    code: str = Field(..., min_length=4, max_length=4)      # BIOL
    number: str = Field(..., min_length=3, max_length=3)    # 315
    description: str

class CourseResponse(BaseModel):
    id: str
    code: str
    number: str
    description: str

# PROBLEM MODELS:

class ProblemCreateRequest(BaseModel):
    course_code: str
    course_number: str
    professor: str            # Professor is attached to each problem
    title: str
    text: str
    tags: List[str]

class ProblemResponse(BaseModel):
    id: str
    course_code: str
    course_number: str
    professor: str
    creator_id: str
    title: str
    text: str
    tags: List[str]
    created_at: datetime
    votes: int
    resolved: bool
    chosen_comment_id: Optional[str]


# COMMENT MODELS:
class CommentCreateRequest(BaseModel):
    problem_id: str
    text: str

class CommentResponse(BaseModel):
    id: str
    problem_id: str
    creator_id: str
    text: str
    votes: int
    created_at: datetime
    starred: bool
