from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import List
from datetime import datetime
from bson import ObjectId
class UserSignUp(BaseModel):
    name: str
    email: EmailStr
    password: str
    genres: List[str] = Field(default=[])
    signin_date: datetime = Field(default_factory=datetime.utcnow)


class UserLogIn(BaseModel):
    email: EmailStr
    password: str
    last_log_date: datetime = Field(default_factory=datetime.utcnow)


class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}