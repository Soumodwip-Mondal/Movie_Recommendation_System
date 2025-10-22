from fastapi import APIRouter, Depends, HTTPException, status
from app.database.database import movie_history
from app.schemas.history_schema import HistorySchema
from app.routes.auth_route import get_current_user
from app.routes.recommendation import fetch_movie_from_tmdb  

history_router = APIRouter(prefix="/api/user/history", tags=["History"])


@history_router.get("/")
def get_history(user=Depends(get_current_user)):
    """Fetch user's movie history with full TMDB movie details."""
    current_user = movie_history.find_one({"email": user.email})
    
    if not current_user or not current_user.get("movie_list"):
        return {"message": "No history found for this user", "movies": []}
    
    movie_ids = current_user["movie_list"]
    movies = []

    for movie_id in movie_ids:
        try:
            movie_data = fetch_movie_from_tmdb(movie_id)
            movies.append(movie_data)
        except Exception:
            continue  # skip invalid TMDB IDs

    return {"user": user.email, "movies": movies}


@history_router.post("/")
def create_history(req: HistorySchema, user=Depends(get_current_user)):
    """Add a movie to user's watch history."""
    movie_id = req.tmdb_movie_id
    email = user.email

    current_user = movie_history.find_one({"email": email})

    if not current_user:
        # Create new record for user
        movie_history.insert_one(
            {
                "email": email,
                "movie_list": [movie_id]
            }
        )
        return {"message": "Movie added to history."}

    # If movie already exists, skip adding again
    if movie_id in current_user.get("movie_list", []):
        return {"message": "Movie already exists in history."}

    # Otherwise, append new movie ID
    movie_history.update_one(
        {"email": email},
        {"$push": {"movie_list": movie_id}}
    )

    return {"message": "Movie added to history."}
