from pydantic import BaseModel,EmailStr,Field,field_validator
from typing import List
from datetime import datetime
class UserSignup(BaseModel):
    name:str
    email:EmailStr
    password:str
    genres:List=Field(default=[])
    join_date:datetime=Field(default=datetime.now())
    @field_validator('join_date')
    @classmethod
    def validate(cls,v:datetime):
        return v.date()    
class UserLogin(BaseModel):
    email:EmailStr
    password:str
    last_login:datetime=Field(default=datetime.now())
    @field_validator('last_login')
    @classmethod
    def validate(cls,v:datetime):
        return v.date() 