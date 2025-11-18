from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
from app.config.config import Settings
from typing import Optional

settings = Settings()#type:ignore
# Use a pure-Python hasher to avoid native bcrypt backend issues on some hosts
# NOTE: Existing bcrypt-hashed passwords will no longer verify. For a clean
# deployment, create new users after this change.
context = CryptContext(schemes=["pbkdf2_sha256", "bcrypt"], deprecated="auto")

def hash_password(password: str):
    return context.hash(password)

def verify_password(text_password: str, hashed_password: str):
    return context.verify(text_password, hashed_password)

def create_access_token(data: dict, expire_delta: timedelta = timedelta(days=2)):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expire_delta
    to_encode.update({'exp': expire})
    return jwt.encode(to_encode,key=settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def verify_token(token: str):
    try:
        payload = jwt.decode(token, key=settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None

