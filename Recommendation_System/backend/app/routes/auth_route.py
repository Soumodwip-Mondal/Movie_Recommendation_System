from fastapi import APIRouter, HTTPException, status, Depends
from jose import JWTError
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from app.schemas.user_auth_schema import UserSignUp, UserLogIn, UserResponse
from app.database.database import user_collection
from app.auth.auth import hash_password, verify_password, create_access_token, verify_token
from bson import ObjectId

auth_router = APIRouter(prefix="/api", tags=["Auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/token")

@auth_router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def signup(user: UserSignUp):
    try:
        print(f"Signup attempt for email: {user.email}")
        existing_user = user_collection.find_one({"email": user.email})
        if existing_user:
            print(f"User already exists: {user.email}")
            raise HTTPException(status_code=400, detail="User already registered")

        # Hash password
        print("Hashing password...")
        hashed_password = hash_password(user.password)

        # Prepare user data
        user_dict = user.model_dump()
        user_dict["password"] = hashed_password

        # Insert into MongoDB
        print(f"Inserting user: {user.email}")
        result = user_collection.insert_one(user_dict)
        print(f"User created with ID: {result.inserted_id}")

        return UserResponse(
            id=str(result.inserted_id),
            name=user.name,
            email=user.email
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Signup error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Signup failed: {str(e)}")

@auth_router.post("/login", status_code=status.HTTP_200_OK)
def login(user: UserLogIn):
    """JSON login endpoint"""
    try:
        print(f"Login attempt for email: {user.email}")
        existing_user = user_collection.find_one({"email": user.email})
        if not existing_user:
            print(f"User not found: {user.email}")
            raise HTTPException(
                status_code=401, 
                detail="Invalid credentials",
                headers={"WWW-Authenticate": "Bearer"}
            )
        
        print("Verifying password...")
        if not verify_password(user.password, existing_user["password"]):
            print("Password verification failed")
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
        
        print("Creating access token...")
        token = create_access_token({
            "user_id": str(existing_user["_id"]),
            "email": existing_user["email"]
        })
        
        print(f"Login successful for: {user.email}")
        return {
            "access_token": token,
            "token_type": "bearer"
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")

@auth_router.post("/token", status_code=status.HTTP_200_OK)
def token_endpoint(form_data: OAuth2PasswordRequestForm = Depends()):
    """OAuth2 compatible token endpoint (required for Swagger UI authorization)"""
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

    try:
        payload = verify_token(token)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing user_id",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Ensure valid ObjectId
        if not ObjectId.is_valid(user_id):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid user ID in token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        user = user_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return UserResponse(
            id=str(user["_id"]),
            name=user.get("name"),
            email=user.get("email"),
        )

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token verification failed",
            headers={"WWW-Authenticate": "Bearer"},
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal error: {str(e)}"
        )
