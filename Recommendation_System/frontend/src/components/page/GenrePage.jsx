import React, { useState, useEffect } from 'react'
import HistoryMovieCard from '../ui/HistoryMovieCard'
import { useMovies } from '../../context/movieContext'

function GenrePage() {
  const genres = ['Action', 'Thriller', 'Drama', 'Sci-Fi', 'Comedy', 'Horror']
  const [activeGenre, setActiveGenre] = useState(null)
  const [savedMovies, setSavedMovies] = useState(new Set())
  const [allMovies, setAllMovies] = useState([])
  const { cache, fetchGenres } = useMovies()
  const loading = cache.genres.loading

  useEffect(() => {
    let ignore = false
    async function load() {
      try {
        const res = await fetchGenres() // Uses cache automatically!
        const list = (res || []).map(m => ({
          id: m.id,
          name: m.title || m.name || 'Untitled',
          rating: m.vote_average ? Number(m.vote_average).toFixed(1) : null,
          genres: m.genres?.map(g => g.name) || ['Drama'],
          image: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
        }))
        if (!ignore) setAllMovies(list)
      } catch (e) {
        console.error('Failed to fetch movies', e)
        if (!ignore) setAllMovies([])
      }
    }
    load()
    return () => { ignore = true }
  }, [fetchGenres])

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
    <div className="min-h-screen bg-black text-white px-6 md:px-16 py-10">
      {/* Title */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl font-black mb-2">Browse by Genre</h1>
        <p className="text-gray-400">Select a genre to explore movies</p>
      </div>

      {/* Genre Buttons */}
      <div className="flex flex-wrap gap-3 mb-10 max-w-7xl mx-auto">
        {/* All Button */}
        <button
          onClick={() => setActiveGenre(null)}
          className={`px-6 py-3 rounded-full text-sm font-bold ${
            activeGenre === null
              ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
              : 'bg-gray-800 hover:bg-gray-700'
          }`}
        >
          All
        </button>

        {genres.map((genre, idx) => (
          <button
            key={idx}
            onClick={() => setActiveGenre(genre)}
            className={`px-6 py-3 rounded-full text-sm font-bold ${
              activeGenre === genre
                ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMovies.length > 0 ? (
            filteredMovies.slice(0, 12).map((movie) => (
            <HistoryMovieCard
              key={movie.id}
              movie={movie}
              isSaved={savedMovies.has(movie.id)}
              onSave={toggleSave}
              onShare={handleShare}
            />
          ))
          ) : (
            <div className="col-span-full text-center py-20">
              <h3 className="text-2xl font-bold mb-2">No movies found</h3>
              <p className="text-gray-400">Try selecting a different genre</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default GenrePage