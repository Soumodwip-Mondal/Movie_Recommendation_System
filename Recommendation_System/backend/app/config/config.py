from pydantic_settings import BaseSettings
from pydantic import field_validator, ConfigDict
from typing import Optional

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str
    API_SETTING: str = './api'
    TMDBAPI_KEY: str
    ALLOW_ORIGIN: str = ''
    ACCESS_TOKEN_EXPIRE_MINUTES: Optional[int] = 30
    APP_NAME: Optional[str] = 'Movie Recommendation System'
    DEBUG: Optional[bool] = False

    model_config = {
        'env_file': '.env',
        'env_file_encoding': 'UTF-8',
        'case_sensitive': True,
        'extra': 'ignore'
    }

    @field_validator('ALLOW_ORIGIN', mode='before')
    @classmethod
    def parse_allowed_origins(cls, v):
        return str(v.split()) if v else ''
