import React, { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { useMovies } from '../../context/movieContext'

function TopRated() {
  const [movies, setMovies] = useState([])
  const { cache, fetchHome } = useMovies() // Use fetchHome since you're calling /cold-sample
  const loading = cache.home.loading

  useEffect(() => {
    let ignore = false
    async function load() {
      try {
        const res = await fetchHome() // Uses cache automatically!
        const list = (res || []).slice(0, 18).map(m => ({
          id: m.id,
          name: m.title || m.name || 'Untitled',
          rating: m.vote_average ? Number(m.vote_average).toFixed(1) : null,
          image: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
        })).sort((a, b) => (b.rating || 0) - (a.rating || 0))
        if (!ignore) setMovies(list)
      } catch (e) {
        console.error('Failed to fetch top rated', e)
        if (!ignore) setMovies([])
      }
    }
    load()
    return () => { ignore = true }
  }, [fetchHome])

  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-16 py-10">
      {/* Title */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl font-black mb-2">Top Rated</h1>
        <p className="text-gray-400">Check out the highest-rated movies</p>
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-gray-900 rounded-lg overflow-hidden border border-white/10 shadow-md"
            >
              <div className="relative h-48 overflow-hidden">
                {movie.image ? (
                  <img src={movie.image} alt={movie.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">No Image</div>
                )}
                <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded-md text-xs font-bold text-yellow-400 flex items-center gap-1">
                  <Star size={12} /> {movie.rating || '-'}
                </div>
              </div>
              <div className="p-3">
                <h2 className="text-white font-semibold text-sm truncate">{movie.name}</h2>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TopRated