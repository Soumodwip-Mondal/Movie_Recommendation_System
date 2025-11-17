import os
import pickle
import re
from pathlib import Path

import numpy as np
import requests

from app.database.database import movie_data

# ---------------------------------------------------------------------------
# Model loading with optional remote download
# ---------------------------------------------------------------------------
MODEL_DIR = Path(__file__).resolve().parent
MOVIE_DF_PATH = MODEL_DIR / "movie_df.pkl"
VECTOR_PATH = MODEL_DIR / "vector.pkl"


def _ensure_file(path: Path, env_var: str) -> None:
    """Ensure that a model artifact exists locally.

    If the file is missing, this will try to download it from the URL specified
    in the given environment variable. This allows deployment on Render without
    committing large files (e.g. vector.pkl) to Git.
    """
    if path.exists():
        return

    url = os.getenv(env_var)
    if not url:
        raise RuntimeError(
            f"Missing model file: {path.name}. Either place it at {path} or set "
            f"the environment variable {env_var} to a direct download URL."
        )

    path.parent.mkdir(parents=True, exist_ok=True)
    print(f"[MODEL] Downloading {path.name} from {url} ...")

    try:
        with requests.get(url, stream=True, timeout=60) as r:
            r.raise_for_status()
            tmp_path = path.with_suffix(path.suffix + ".tmp")
            with open(tmp_path, "wb") as f:
                for chunk in r.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
            os.replace(tmp_path, path)
    except Exception as exc:  # pragma: no cover - defensive
        # Make sure we do not leave a partial file around
        if path.exists():
            try:
                os.remove(path)
            except OSError:
                pass
        raise RuntimeError(f"Failed to download {path.name}: {exc}") from exc


# Attempt to ensure and load artifacts.
# If this fails (e.g. missing env vars or download error), we log and keep
# the app running so that auth and other endpoints still work.
movie_df = None
vector = None

try:
    _ensure_file(MOVIE_DF_PATH, "MOVIE_DF_URL")
    _ensure_file(VECTOR_PATH, "VECTOR_URL")

    with open(MOVIE_DF_PATH, "rb") as f:
        movie_df = pickle.load(f)

    with open(VECTOR_PATH, "rb") as f:
        vector = pickle.load(f)

    print("[MODEL] Recommendation artifacts loaded successfully")
except Exception as exc:  # pragma: no cover - defensive
    print(f"[MODEL] WARNING: recommendation model not available: {exc}")
    movie_df = None
    vector = None


def _find_mongo_doc_by_title(title: str):
    """Locate a movie document in MongoDB by title (case-insensitive).
    Tries exact match first, then contains.
    """
    if not title:
        return None
    try:
        exact = movie_data.find_one({'title': {'$regex': f'^{re.escape(title.strip())}$', '$options': 'i'}})
        if exact:
            return exact
        partial = movie_data.find_one({'title': {'$regex': re.escape(title.strip()), '$options': 'i'}})
        return partial
    except Exception:
        return None


def _find_movie_index(title: str):
    """Resolve dataframe row index for a given title using Mongo as source of truth.
    Strategy:
    1) Find Mongo document by title (case-insensitive),
    2) Map its TMDB id (doc['id']) to movie_df['id'] to get the exact row,
    3) Fallback to dataframe title matching if needed.
    """
    # 1) Try Mongo first to obtain canonical TMDB id
    doc = _find_mongo_doc_by_title(title)
    if doc:
        try:
            doc_id = None
            for k in ('id', 'tmdb_id', 'movieId', 'movie_id'):
                if k in doc and doc[k] is not None:
                    doc_id = doc[k]
                    break
            if doc_id is not None:
                mask = movie_df['id'] == doc_id #type:ignore
                if getattr(mask, 'any', lambda: False)():
                    return movie_df.index[mask][0] #type:ignore
        except Exception:
            pass

    # 2) Fallback to title matching in dataframe (case-insensitive)
    if not title:
        return None
    t = title.strip().lower()
    try:
        mask = movie_df['title'].str.strip().str.lower() == t #type:ignore
        if mask.any():
            return movie_df.index[mask][0] #type:ignore
    except Exception:
        pass
    try:
        mask = movie_df['title'].str.lower().str.contains(np.str_(t), na=False) #type:ignore
        if mask.any():
            return movie_df.index[mask][0] #type:ignore
    except Exception:
        pass
    return None


def _top_indices_from_distances(distances, self_index: int, start: int, end: int):
    """Get a slice of top indices excluding the self index.
    start/end are 0-based in the sorted (descending) list that excludes self.
    """
    order = np.argsort(distances)[::-1]
    # Exclude self index explicitly
    order = [i for i in order if i != self_index]
    return order[start:end]


def _ensure_model_ready():
    """Ensure recommendation artifacts are loaded before using them.

    Returns a dict error payload if the model is not available, otherwise None.
    """
    if movie_df is None or vector is None:
        return {"error": "Recommendation model not available. Please try again later."}
    return None


def recommand_top_6(movie: str):
    not_ready = _ensure_model_ready()
    if not_ready:
        return not_ready

    # Prefer DataFrame presence; do not hard-fail on Mongo mismatch
    idx = _find_movie_index(movie)
    if idx is None:
        # As a last resort, check Mongo and attempt again with its title field
        doc = movie_data.find_one({'title': movie})
        if doc:
            idx = _find_movie_index(doc.get('title', ''))
    if idx is None:
        return {"error": "Movie not found"}

    distances = vector[idx] #type:ignore
    top_idx = _top_indices_from_distances(distances, idx, 0, 6)
    return movie_df.iloc[top_idx]['id'].tolist()#type:ignore


def recommand_top_7_to_12(movie: str):
    not_ready = _ensure_model_ready()
    if not_ready:
        return not_ready

    idx = _find_movie_index(movie)
    if idx is None:
        doc = movie_data.find_one({'title': movie})
        if doc:
            idx = _find_movie_index(doc.get('title', ''))
    if idx is None:
        return {"error": "Movie not found"}

    distances = vector[idx]  #type:ignore
    next_idx = _top_indices_from_distances(distances, idx, 6, 12)
    return movie_df.iloc[next_idx]['id'].tolist()  #type:ignore


def recommand_sample_30():
    """Return a list of TMDB movie IDs for cold-start.

    We fetch a relatively large random sample so the frontend can display
    dozens of movies across sections (home rows + "Other Movies").

    The priority is:
    1) Random sample from MongoDB collection ``movie_data`` (if available),
    2) Random sample from ``movie_df`` dataframe (if the offline model is loaded),
    3) Hard-coded list of popular TMDB IDs as a final, always-available fallback.

    This ensures the homepage can still show movies even if MongoDB and/or the
    recommendation artifacts are not available, as long as a valid TMDB API key
    is configured on the backend.
    """
    ids = []
    try:
        # Random sample of movies from MongoDB (larger sample for more UI content)
        sample_cursor = movie_data.aggregate([{"$sample": {"size": 72}}])
        for doc in sample_cursor:
            tmdb_id = None
            # Try common id field names
            for k in ("id", "tmdb_id", "movieId", "movie_id"):
                if k in doc and doc[k] is not None:
                    tmdb_id = doc[k]
                    break
            if tmdb_id is not None:
                # Ensure it's an int if possible
                try:
                    tmdb_id = int(tmdb_id)
                except (TypeError, ValueError):
                    pass
                ids.append(tmdb_id)
        # Fallback: if we somehow fetched nothing, and the model is ready,
        # use the dataframe-based sampling as a backup.
        if not ids and movie_df is not None:
            ids = movie_df.sample(72)['id'].values.tolist()
    except Exception:
        # As a last resort, if Mongo sampling fails but the model is ready,
        # fall back to dataframe sampling.
        if movie_df is not None:
            ids = movie_df.sample(72)['id'].values.tolist()

    # Final safety net: if we *still* have no IDs (e.g. no Mongo, no model),
    # use a small curated set of popular TMDB movie IDs so the UI always has
    # something to show.
    if not ids:
        ids = [
            603,    # The Matrix
            278,    # The Shawshank Redemption
            238,    # The Godfather
            424,    # Schindler's List
            680,    # Pulp Fiction
            27205,  # Inception
            155,    # The Dark Knight
            550,    # Fight Club
            13,     # Forrest Gump
            122,    # The Lord of the Rings: The Return of the King
            157336, # Interstellar
            24428,  # The Avengers
            299536, # Avengers: Infinity War
            299534, # Avengers: Endgame
            497,    # The Green Mile
            680,    # Pulp Fiction
            1124,   # The Usual Suspects
            240,    # The Godfather Part II
            769,    # Goodfellas
            122906, # The Hobbit: An Unexpected Journey
            272,    # Batman Begins
            101,    # Léon: The Professional
            8587,   # The Lion King
            98,     # Gladiator
            807,    # Se7en
            27205,  # Inception
            603692, # John Wick: Chapter 4
            497698, # Black Widow
            335984, # Blade Runner 2049
            603661, # John Wick: Chapter 3 – Parabellum
        ]

    # Ensure we never return more than 72 IDs
    return ids[:72]
