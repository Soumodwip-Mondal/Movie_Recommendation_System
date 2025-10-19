from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str
    API_SETTING: str = './api'
    TMDBAPI_KEY: str
    ALLOW_ORIGIN: str

    @field_validator('ALLOW_ORIGIN', mode='before')
    @classmethod
    def parse_allowed_origins(cls, v):
        return str(v.split()) if v else ''

    class Config:
        env_file = '.env'
        env_file_encoding = 'UTF-8'
        case_sensitive = True
