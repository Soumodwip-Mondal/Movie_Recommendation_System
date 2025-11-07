import React, { useEffect, useState } from 'react'
import { Star, Heart } from 'lucide-react'
import { useAuth } from '../../context/authContext'
import { useMovies } from '../../context/movieContext'

function MyList() {
  const { token } = useAuth()
  const [movies, setMovies] = useState([])
  const { getCache, fetchMyList } = useMovies()
  
  // Get cache state
  const cache = getCache('myList')
  const loading = cache.loading

  useEffect(() => {
    if (!token) return

    let ignore = false
    
    async function load() {
      try {
        const res = await fetchMyList() // Will use cache automatically!
        const list = (res || []).map(m => ({
          id: m.id,
          name: m.title || 'Unavailable',
          rating: m.vote_average ? Number(m.vote_average).toFixed(1) : null,
          image: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
        }))
        if (!ignore) setMovies(list)
      } catch (e) {
        console.error('Failed to fetch history', e)
        if (!ignore) setMovies([])
      }
    }
    
    load()
    return () => { ignore = true }
  }, [token, fetchMyList]) // fetchMyList is stable now

  const handleRemove = (id) => {
    setMovies(movies.filter(movie => movie.id !== id))
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-16 py-10">
      {/* Title */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl font-black mb-2">My History</h1>
        <p className="text-gray-400">Movies you interacted with</p>
      </div>

      {!token && (
        <div className="text-center text-gray-400">Please sign in to view your history.</div>
      )}

      {token && (loading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : movies.length > 0 ? (
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <div key={movie.id} className="bg-gray-900 rounded-lg overflow-hidden border border-white/10 shadow-md relative">
              <div className="relative h-48 overflow-hidden">
                {movie.image ? (
                  <img src={movie.image} alt={movie.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">No Image</div>
                )}
                <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded-md text-xs font-bold text-yellow-400 flex items-center gap-1">
                  <span>⭐</span> {movie.rating || '-'}
                </div>
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-[#E54B4B] px-2 py-1 rounded-md text-xs font-semibold">
                  <Heart size={12} /> Saved
                </div>
              </div>
              <div className="p-3 flex justify-between items-center">
                <h2 className="text-white font-semibold text-sm truncate">{movie.name}</h2>
                <button onClick={() => handleRemove(movie.id)} className="text-red-600 font-bold hover:text-red-700">Remove</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-2xl font-bold mb-2">No movies yet</h3>
          <p className="text-gray-400">Watch some movies to see them here</p>
        </div>
      ))}
    </div>
  )
}

export default MyList