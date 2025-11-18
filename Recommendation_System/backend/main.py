from app import DATABASE_URL
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.config import Settings
Settings=Settings()#type:ignore
from app.routes.auth_route import auth_router
from app.routes.recommendation import recommendation_router
from app.routes.history import history_router

app=FastAPI(
    title='choose your own adventure game',
    version='0.1.0',
    docs_url='/docs',
    redoc_url='/redoc'
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=['https://movie-recommendation-system-heoh-qounymum7.vercel.app/'],
    allow_headers=['*'],
    allow_methods=['*'],
    allow_credentials=True
)
app.include_router(router=auth_router)
app.include_router(router=recommendation_router)
app.include_router(router=history_router)

@app.get('/')
def main():
    return {'message':'connection estabilished'}

if __name__ == "__main__":
    main()
