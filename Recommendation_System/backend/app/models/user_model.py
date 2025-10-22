from pydantic import BaseModel,Field
from typing import List
from bson import ObjectId

class User(BaseModel):
    id:str
    email:str
    name:str
    password:str
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        
class UserHistory(BaseModel):
    id:str
    email:str
    movie_list:List
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}