import React, { useState, useEffect } from 'react'
import HistoryMovieCard from '../ui/HistoryMovieCard'
import { useMovies } from '../../context/movieContext'

// Canonical TMDB genre map (id -> display name)
const GENRE_MAP = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
}

// Helper to map TMDB genre id to a label used in the UI
const getGenreName = (id) => {
  if (id == null) return 'Drama'
  return GENRE_MAP[id] || 'Drama'
}

// All genre filter chips we expose in the UI
const ALL_GENRES = Array.from(new Set(Object.values(GENRE_MAP)))

function GenrePage() {
  const genres = ALL_GENRES
  const [activeGenre, setActiveGenre] = useState(null)
  const [savedMovies, setSavedMovies] = useState(new Set())
  const [allMovies, setAllMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { getCache, fetchGenres } = useMovies()
  
  // Get cache state
  const cache = getCache('genres')

  // (Genre mapping helpers are defined at module level)

  useEffect(() => {
    let ignore = false
    
    async function load() {
      try {
        // Only show loading if there's no cached data
        if (!cache?.data || cache.data.length === 0) {
          setIsLoading(true)
        }
        
        const res = await fetchGenres() // Uses cache automatically!
        const list = (res || []).map(m => {
          // Derive genres from either `genre_ids` (arrays of ids) or
          // `genres` (array of { id, name } objects returned by TMDB).
          let movieGenres = []

          if (Array.isArray(m.genre_ids) && m.genre_ids.length) {
            movieGenres = m.genre_ids.map(id => getGenreName(id))
          } else if (Array.isArray(m.genres) && m.genres.length) {
            movieGenres = m.genres
              .map(g => {
                if (!g) return null
                // Prefer mapping by id so labels stay consistent with filters
                if (typeof g.id === 'number') return getGenreName(g.id)
                return typeof g.name === 'string' ? g.name : null
              })
              .filter(Boolean)
          }

          if (!movieGenres.length) {
            movieGenres = ['Drama']
          }

          return ({
            id: m.id,
            name: m.title || m.name || 'Untitled',
            rating: m.vote_average ? Number(m.vote_average).toFixed(1) : null,
            genres: movieGenres,
            image: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
          })
        })
        if (!ignore) {
          console.log('📽️ Loaded movies with genres:', list.slice(0, 3).map(m => ({ name: m.name, genres: m.genres })))
          setAllMovies(list)
          setError(null)
          setIsLoading(false)
        }
      } catch (e) {
        console.error('Failed to fetch movies', e)
        if (!ignore) {
          setAllMovies([])
          setError(e?.message || 'Failed to load movies')
          setIsLoading(false)
        }
      }
    }
    
    load()
    return () => { ignore = true }
  }, [fetchGenres, cache?.data]) // fetchGenres is stable now

  const toggleSave = (id) => {
    const newSaved = new Set(savedMovies)
    if (newSaved.has(id)) newSaved.delete(id)
    else newSaved.add(id)
    setSavedMovies(newSaved)
  }

  const handleShare = (id) => {
    const movie = allMovies.find(m => m.id === id)
    console.log('Sharing:', movie?.name)
  }

  const filteredMovies = activeGenre
    ? allMovies.filter(movie => movie.genres?.includes(activeGenre))
    : allMovies

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary via-secondary to-primary text-white px-6 md:px-16 py-10">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center text-gray-400 py-20 animate-pulse">
            <div className="text-2xl font-bold mb-2">Loading movies...</div>
            <p className="text-sm">Discovering amazing films for you</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center text-red-400 py-20">
            <div className="text-2xl font-bold mb-2">Failed to load movies</div>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      ) : allMovies.length === 0 ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center text-gray-400 py-20">
            <div className="text-2xl font-bold mb-2">No movies found</div>
            <p className="text-sm">Try selecting a different genre</p>
          </div>
        </div>
      ) : (
        <>
          <div className="max-w-7xl mx-auto mb-10 animate-fade-in">
            <h1 className="text-4xl font-black mb-2">Browse by Genre</h1>
            <p className="text-gray-400">Select a genre to explore movies</p>
          </div>

          <div className="flex flex-wrap gap-3 mb-10 max-w-7xl mx-auto animate-slide-up">
            <button
              onClick={() => setActiveGenre(null)}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                activeGenre === null
                  ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 scale-105'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              All
            </button>

            {genres.map((genre, idx) => (
              <button
                key={idx}
                onClick={() => setActiveGenre(genre)}
                className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                  activeGenre === genre
                    ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 scale-105'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMovies.length > 0 ? (
              filteredMovies.slice(0, 12).map((movie, idx) => (
                <div
                  key={movie.id}
                  className="animate-scale-in"
                  style={{animationDelay: `${idx * 0.05}s`}}
                >
                  <HistoryMovieCard
                    movie={movie}
                    isSaved={savedMovies.has(movie.id)}
                    onSave={toggleSave}
                    onShare={handleShare}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 animate-fade-in">
                <h3 className="text-2xl font-bold mb-2">No movies found</h3>
                <p className="text-gray-400">Try selecting a different genre</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default GenrePage
