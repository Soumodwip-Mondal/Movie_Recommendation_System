from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from app.schemas.user_auth_schema import UserSignUp, UserLogIn, UserResponse
from app.database.database import user_collection
from app.auth.auth import hash_password, verify_password, create_access_token, verify_token
from bson import ObjectId

auth_router = APIRouter(prefix="/api", tags=["Auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/token")

@auth_router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
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

@auth_router.post("/login", status_code=status.HTTP_200_OK)
def login(user: UserLogIn):
    """JSON login endpoint"""
    existing_user = user_collection.find_one({"email": user.email})
    if not existing_user or not verify_password(user.password, existing_user["password"]):
        raise HTTPException(
            status_code=401, 
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    # Update last login date
    user_collection.update_one(
        {"_id": existing_user["_id"]},
        {"$set": {"last_log_date": user.last_log_date}}
    )
    
    token = create_access_token({
        "user_id": str(existing_user["_id"]),
        "email": existing_user["email"]
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@auth_router.post("/token", status_code=status.HTTP_200_OK)
def token_endpoint(form_data: OAuth2PasswordRequestForm = Depends()):
    """OAuth2 compatible token endpoint (required for Swagger UI authorization)"""
    # OAuth2PasswordRequestForm uses 'username' field, but we use email
    existing_user = user_collection.find_one({"email": form_data.username})
    if not existing_user or not verify_password(form_data.password, existing_user["password"]):
        raise HTTPException(
            status_code=401, 
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    token = create_access_token({
        "user_id": str(existing_user["_id"]),
        "email": existing_user["email"]
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@auth_router.get("/current_user", response_model=UserResponse, status_code=status.HTTP_200_OK)
async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Get currently authenticated user"""
    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=401, 
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    try:
        user = user_collection.find_one({"_id": ObjectId(payload["user_id"])})
    except Exception:
        raise HTTPException(
            status_code=401, 
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # CRITICAL: Convert MongoDB document to UserResponse format
    return UserResponse(
        id=str(user["_id"]),
        name=user["name"],
        email=user["email"]
    )