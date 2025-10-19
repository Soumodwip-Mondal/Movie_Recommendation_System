from passlib.context import CryptContext
from jose import jwt,JWTError
from datetime import datetime,timedelta
from app.config.config import Settings
settings=Settings()
context=CryptContext(schemes=["argon2"], deprecated="auto")
def hash_password(password:str):
    return context.hash(password)

def varify_password(text_password,hash_password):
    return context.verify(text_password,hash_password)

def create_access_token(data:dict,expire_delta:timedelta=timedelta(minutes=2*24*60)):
    to_encode=data.copy()
    expire=datetime.utcnow() + expire_delta
    to_encode.update({'exp':expire})
    return jwt.encode(to_encode,key=settings.SECRET_KEY,algorithm=settings.ALGORITHM)

def varify_token(token:str):
    try:
        jwt.decode(token,key=settings.SECRET_KEY,algorithms=settings.ALGORITHM)
    except JWTError :
        return None