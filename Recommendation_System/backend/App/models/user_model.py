from pydantic import BaseModel,Field,EmailStr,HttpUrl
from bson import ObjectId
from typing import List,Optional

class User(BaseModel):
    name:str
    email:EmailStr
    hashed_password:str
    join_date:str
    genres:List=Field(default=[])
class MovieHistory(BaseModel):
    id:str
    movie_name:str
    url:HttpUrl
