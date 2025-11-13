from fastapi import APIRouter, HTTPException
import requests
import time
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from app.recommendation_model.recommand import (
    recommand_sample_30,
    recommand_top_6,
    recommand_top_7_to_12
)
from app.config.config import Settings

# Initialize settings
settings = Settings() # type: ignore
tmdb_api_key = settings.TMDBAPI_KEY

# Router setup
recommendation_router = APIRouter(prefix="/api", tags=["Recommendation"])

# Create a persistent session with connection pooling
session = requests.Session()
retry_strategy = Retry(
    total=3,
    backoff_factor=1,
    status_forcelist=[429, 500, 502, 503, 504],
    allowed_methods=["GET"]
)
adapter = HTTPAdapter(
    max_retries=retry_strategy,
    pool_connections=10,
    pool_maxsize=20
)
session.mount("https://", adapter)
session.mount("http://", adapter)


# Helper function with improved error handling
def fetch_movie_from_tmdb(movie_id: int, retries: int = 3, delay: float = 0.5):
    """
    Fetch movie details from TMDB API with retry logic and exponential backoff.
    
    Args:
        movie_id: TMDB movie ID
        retries: Number of retry attempts
        delay: Initial delay between retries (exponential backoff applied)
    
    Returns:
        Movie data dict or None if failed
    """
    tmdb_url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={tmdb_api_key}"
    
    for attempt in range(retries):
        try:
            response = session.get(tmdb_url, timeout=10)
            if response.status_code == 200:
                return response.json()
            elif response.status_code == 404:
                print(f"Movie {movie_id} not found in TMDB (404)")
                return None
            else:
                print(f"TMDB responded with {response.status_code} for movie {movie_id}")
                if attempt < retries - 1:
                    time.sleep(delay * (2 ** attempt))  # Exponential backoff
        except requests.exceptions.Timeout:
            print(f"Timeout on attempt {attempt+1} for movie {movie_id}")
            if attempt < retries - 1:
                time.sleep(delay * (2 ** attempt))
        except requests.exceptions.ConnectionError as e:
            print(f"Connection error on attempt {attempt+1} for movie {movie_id}: {e}")
            if attempt < retries - 1:
                time.sleep(delay * (2 ** attempt))
        except requests.exceptions.RequestException as e:
            print(f"Request failed on attempt {attempt+1} for movie {movie_id}: {e}")
            if attempt < retries - 1:
                time.sleep(delay * (2 ** attempt))
    
    print(f"Failed to fetch movie {movie_id} after {retries} retries.")
    return None


def fetch_multiple_movies(movie_ids: list, rate_limit_delay: float = 0.1):
    """
    Fetch multiple movies with rate limiting to avoid overwhelming the API.
    
    Args:
        movie_ids: List of TMDB movie IDs
        rate_limit_delay: Delay between consecutive requests (seconds)
    
    Returns:
        List of movie details (with placeholders for failed fetches)
    """
    movie_details = []
    
    for i, movie_id in enumerate(movie_ids):
        # Add delay between requests (except for the first one)
        if i > 0:
            time.sleep(rate_limit_delay)
        
        movie_data = fetch_movie_from_tmdb(movie_id)
        
        if movie_data:
            movie_details.append(movie_data)
        else:
            # Placeholder for missing movies
            movie_details.append({
                "id": movie_id,
                "title": "Unavailable",
                "overview": "Could not fetch movie details from TMDB.",
                "poster_path": None,
                "status": "unavailable"
            })
    
    return movie_details


#  Cold start route (random 30 movies)
@recommendation_router.get("/cold-sample")
def get_random_sample():
    """Get 30 random movie recommendations for cold start."""
    try:
        movie_ids = recommand_sample_30()
        movie_details = fetch_multiple_movies(movie_ids, rate_limit_delay=0.15)
        
        if not movie_details:
            raise HTTPException(status_code=404, detail="No movies found in TMDB response")
        
        return {"movies": movie_details}
    except Exception as e:
        print(f"Error in get_random_sample: {e}")
        raise HTTPException(status_code=500, detail="Internal server error while fetching recommendations")


# 🎬 Top 6 similar movies
@recommendation_router.get("/top_6")
def get_top_6(name: str):
    """Get top 6 similar movies based on movie name."""
    try:
        movie_list = recommand_top_6(name)  
        
        if isinstance(movie_list, dict) and "error" in movie_list:
            raise HTTPException(status_code=404, detail=movie_list["error"])
        
        movie_details = fetch_multiple_movies(movie_list, rate_limit_delay=0.1)
        
        if not movie_details:
            raise HTTPException(status_code=404, detail="No recommended movies found")
        
        return {"movies": movie_details}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in get_top_6: {e}")
        raise HTTPException(status_code=500, detail="Internal server error while fetching recommendations")


# 🎥 Movies ranked 7–12
@recommendation_router.get("/top_6_to_12")
def get_top_6_to_12(name: str):
    """Get movies ranked 7-12 in similarity based on movie name."""
    try:
        movie_list = recommand_top_7_to_12(name)
        
        if isinstance(movie_list, dict) and "error" in movie_list:
            raise HTTPException(status_code=404, detail=movie_list["error"])
        
        movie_details = fetch_multiple_movies(movie_list, rate_limit_delay=0.1)
        
        if not movie_details:
            raise HTTPException(status_code=404, detail="No recommended movies found")
        
        return {"movies": movie_details}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in get_top_6_to_12: {e}")
        raise HTTPException(status_code=500, detail="Internal server error while fetching recommendations")

@recommendation_router.get("/search")
def search_movies(query: str):
    """Search movies by title using TMDB API."""
    try:
        if not query or len(query.strip()) < 2:
            raise HTTPException(status_code=400, detail="Search query must be at least 2 characters")
        
        search_url = f"https://api.themoviedb.org/3/search/movie"
        params = {
            'api_key': tmdb_api_key,
            'query': query.strip(),
            'page': 1,
            'include_adult': False
        }
        
        response = session.get(search_url, params=params, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            movies = data.get('results', [])
            
            # Sort by popularity and limit results
            movies.sort(key=lambda x: x.get('popularity', 0), reverse=True)
            movies = movies[:20]  # Limit to 20 results
            
            return {
                "movies": movies, 
                "total_results": data.get('total_results', 0),
                "query": query
            }
        else:
            print(f"⚠️ TMDB API error: {response.status_code}")
            raise HTTPException(status_code=response.status_code, detail="TMDB API error")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Search request error: {e}")
        raise HTTPException(status_code=500, detail="Search request failed")
    except Exception as e:
        print(f"❌ Unexpected search error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during search")