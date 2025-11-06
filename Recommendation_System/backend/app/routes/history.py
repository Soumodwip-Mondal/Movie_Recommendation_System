from fastapi import APIRouter, Depends, HTTPException, status
from app.database.database import movie_history
from app.schemas.history_schema import HistorySchema
from app.routes.auth_route import get_current_user
from app.routes.recommendation import fetch_movie_from_tmdb
import time
import requests

history_router = APIRouter(prefix="/api/user/history", tags=["History"])


def safe_fetch_movie(movie_id, retries=3, delay=1):
    """Fetch movie safely with retry & error handling."""
    for attempt in range(retries):
        try:
            # ✅ Make sure fetch_movie_from_tmdb uses requests.get(..., timeout=10)
            movie_data = fetch_movie_from_tmdb(movie_id)
            if movie_data:
                return movie_data
        except requests.exceptions.RequestException as e:
            print(f"⚠️ Attempt {attempt + 1} failed for movie {movie_id}: {e}")
            time.sleep(delay)
        except Exception as e:
            print(f"❌ Unexpected error fetching movie {movie_id}: {e}")
            return None
    return None


@history_router.get("/")
def get_history(user=Depends(get_current_user)):
    """Fetch user's movie history with TMDB details (includes unavailable movies)."""
    current_user = movie_history.find_one({"email": user.email})

    if not current_user or not current_user.get("movie_list"):
        return {"message": "No history found for this user", "movies": []}

    movie_ids = current_user["movie_list"]
    movies = []

    for movie_id in movie_ids:
        movie_data = safe_fetch_movie(movie_id)

        if movie_data:
            movies.append(movie_data)
        else:
            # ✅ If TMDB fails, return placeholder data
            movies.append({
                "id": movie_id,
                "title": "Unavailable",
                "overview": "Movie data could not be fetched from TMDB.",
                "poster_path": None,
                "status": "unavailable"
            })

    return {"user": user.email, "movies": movies}


@history_router.post("/")
def create_history(req: HistorySchema, user=Depends(get_current_user)):
    """Add a movie to user's watch history."""
    movie_id = req.tmdb_movie_id
    email = user.email

    current_user = movie_history.find_one({"email": email})

    if not current_user:
        # Create new record for user
        movie_history.insert_one({"email": email, "movie_list": [movie_id]})
        return {"message": "Movie added to history."}

    # Avoid duplicates
    if movie_id in current_user.get("movie_list", []):
        return {"message": "Movie already exists in history."}

    movie_history.update_one(
        {"email": email},
        {"$push": {"movie_list": movie_id}}
    )

    return {"message": "Movie added to history."}
