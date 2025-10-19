from pymongo.mongo_client import MongoClient
from app.config.config import Settings
settings=Settings()
DATABASE_URL=settings.DATABASE_URL
print(DATABASE_URL)
client=MongoClient(DATABASE_URL)
db=client['movie_user']
user_collection=db['user']
movie_history=db['movies']
