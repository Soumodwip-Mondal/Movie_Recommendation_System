from fastapi import APIRouter, HTTPException
import requests
from app.recommendation_model.recommand import sample_30, recommand_top_6, recommand_top_7_to_12
from app.config.config import Settings

# Initialize settings
settings = Settings()
tmdb_api_key = settings.TMDBAPI_KEY

# Router setup
recommendation_router = APIRouter(prefix='/api', tags=["Recommendation"])

# Helper function to fetch movie details from TMDB
def fetch_movie_from_tmdb(movie_id: int):
    tmdb_url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={tmdb_api_key}"
    try:
        res = requests.get(tmdb_url)
        if res.status_code == 200:
            return res.json()
        else:
            return None
    except Exception as e:
        print(f"Error fetching movie {movie_id}: {e}")
        return None

# 🎲 Cold start route (random 30 movies)
@recommendation_router.get('/cold-sample')
def get_random_sample():
    movie_ids = sample_30()
    movie_details = []

    for movie_id in movie_ids:
        movie_data = fetch_movie_from_tmdb(movie_id)
        if movie_data:
            movie_details.append(movie_data)

    if not movie_details:
        raise HTTPException(status_code=404, detail="No movies found in TMDB response")

    return {"movies": movie_details}

# 🎬 Top 6 similar movies
@recommendation_router.get('/top_6')
def get_top_6(name: str):
    movie_list = recommand_top_6(name)

    # Handle if movie not found in dataset
    if isinstance(movie_list, dict) and "error" in movie_list:
        raise HTTPException(status_code=404, detail=movie_list["error"])

    movie_details = []
    for movie_id in movie_list:
        movie_data = fetch_movie_from_tmdb(movie_id)
        if movie_data:
            movie_details.append(movie_data)

    if not movie_details:
        raise HTTPException(status_code=404, detail="No recommended movies found")

    return {"movies": movie_details}

# 🎥 Movies ranked 7–12
@recommendation_router.get('/top_6_to_12')
def get_top_6_to_12(name: str):
    movie_list = recommand_top_7_to_12(name)

    if isinstance(movie_list, dict) and "error" in movie_list:
        raise HTTPException(status_code=404, detail=movie_list["error"])

    movie_details = []
    for movie_id in movie_list:
        movie_data = fetch_movie_from_tmdb(movie_id)
        if movie_data:
            movie_details.append(movie_data)

    if not movie_details:
        raise HTTPException(status_code=404, detail="No recommended movies found")

    return {"movies": movie_details}
