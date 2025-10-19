from fastapi import APIRouter, HTTPException, status,Depends
from app.schemas.user_auth_schema import UserSignUp, UserLogIn, UserResponse
from app.database.database import user_collection
from app.auth.auth import hash_password, varify_password, create_access_token,varify_token
from fastapi.security import OAuth2PasswordBearer
from bson import ObjectId

router = APIRouter(prefix="/api", tags=["Auth"])
oth2_shm=OAuth2PasswordBearer(tokenUrl="/api/login")

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def signup(user: UserSignUp):
    existing_user = user_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already registered")

    # Hash password
    hashed_password = hash_password(user.password)

    # Prepare user data
    user_dict = user.model_dump()
    user_dict["password"] = hashed_password

    # Insert into MongoDB
    result = user_collection.insert_one(user_dict)

    return UserResponse(
        id=str(result.inserted_id),
        name=user.name,
        email=user.email
    )


@router.post("/login", status_code=status.HTTP_200_OK)
def login(user: UserLogIn):
    existing_user = user_collection.find_one({"email": user.email})
    if not existing_user or not varify_password(user.password, existing_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "user_id": str(existing_user["_id"]),
        "email": existing_user["email"]
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }
@router.get("/current_user",status_code=status.HTTP_200_OK)
def get_current_user(token:str=Depends(oth2_shm)):
    payload=varify_token(token=token)
    if not payload:
        raise HTTPException(status_code=404,detail='Not valid token')
    user=user_collection.find_one({'_id':ObjectId(payload['user_id'])})
    if not user:
        raise HTTPException(status_code=404, detail='User Not Found !')
    return user
