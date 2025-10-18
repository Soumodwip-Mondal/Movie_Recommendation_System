from pymongo.mongo_client import MongoClient
import os
from dotenv import load_dotenv
load_dotenv()
DATABASE_URL=os.getenv('DATABASE_URL')
print(DATABASE_URL)
client=MongoClient(DATABASE_URL)
db=client['movie_user']
user_collection=db['user']
movie_history=db['movie_history']