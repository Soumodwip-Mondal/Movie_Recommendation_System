import React, { useEffect, useState } from 'react'
import { Star, Play } from 'lucide-react'
import { useAuth } from '../../context/authContext'
import { useMovies } from '../../context/movieContext'
import { apiFetch } from '../../lib/api'

function MyList() {
  const { token } = useAuth()
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { getCache, fetchMyList, refreshCategory } = useMovies()
  
  // Get cache state
  const cache = getCache('myList')

  useEffect(() => {
    if (!token) {
      setIsLoading(false)
      return
    }

    let ignore = false
    
    async function load() {
      try {
        // Only show loading if there's no cached data
        if (!cache?.data || cache.data.length === 0) {
          setIsLoading(true)
        }
        
        const res = await fetchMyList() // Will use cache automatically!
        const list = (res || []).map(m => ({
          id: m.id,
          name: m.title || 'Unavailable',
          rating: m.vote_average ? Number(m.vote_average).toFixed(1) : null,
          image: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
        }))
        if (!ignore) {
          setMovies(list)
          setIsLoading(false)
        }
      } catch (e) {
        console.error('Failed to fetch history', e)
        if (!ignore) {
          setMovies([])
          setIsLoading(false)
        }
      }
    }
    
    load()
    return () => { ignore = true }
  }, [token, fetchMyList, cache?.data]) // fetchMyList is stable now

  const handleRemove = async (id) => {
    try {
      // Optimistically remove from UI
      setMovies(movies.filter(movie => movie.id !== id))
      
      // Call backend to delete
      await apiFetch(`/api/user/history/${id}`, {
        method: 'DELETE'
      })
      
      // Refresh cache to ensure consistency
      refreshCategory('myList')
      console.log(`✅ Movie ${id} removed from history`)
    } catch (error) {
      console.error('Failed to remove movie:', error)
      // Optionally: reload the list to revert optimistic update
      const res = await fetchMyList()
      const list = (res || []).map(m => ({
        id: m.id,
        name: m.title || 'Unavailable',
        rating: m.vote_average ? Number(m.vote_average).toFixed(1) : null,
        image: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
      }))
      setMovies(list)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary via-secondary to-primary text-white px-6 md:px-16 py-10">
      {!token ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center text-gray-400 animate-fade-in">
            <div className="text-2xl font-bold mb-2">Sign In Required</div>
            <p className="text-sm">Please sign in to view your history</p>
          </div>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center text-gray-400 py-20 animate-pulse">
            <div className="text-2xl font-bold mb-2">Loading your history...</div>
            <p className="text-sm">Fetching your watched movies</p>
          </div>
        </div>
      ) : (
        <>
          {/* Title */}
          <div className="max-w-7xl mx-auto mb-10 animate-fade-in">
            <h1 className="text-4xl font-black mb-2">My History</h1>
            <p className="text-gray-400">Movies you interacted with</p>
          </div>

          {movies.length > 0 ? (
            <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {movies.map((movie, idx) => (
                <div 
                  key={movie.id} 
                  className="bg-gray-900 rounded-lg overflow-hidden border border-white/10 shadow-md relative transition-all duration-300 hover:scale-105 hover:border-accent/50 animate-scale-in"
                  style={{animationDelay: `${idx * 0.05}s`}}
                >
                  <div className="relative h-48 overflow-hidden">
                    {movie.image ? (
                      <img src={movie.image} alt={movie.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">No Image</div>
                    )}
                    <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded-md text-xs font-bold text-yellow-400 flex items-center gap-1">
                      <span>⭐</span> {movie.rating || '-'}
                    </div>
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-blue-600 px-2 py-1 rounded-md text-xs font-semibold">
                      <Play size={12} /> Watched
                    </div>
                  </div>
                  <div className="p-3 flex justify-between items-center">
                    <h2 className="text-white font-semibold text-sm truncate">{movie.name}</h2>
                    <button onClick={() => handleRemove(movie.id)} className="text-red-600 font-bold hover:text-red-700 transition-colors">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-2xl font-bold mb-2">No movies yet</h3>
              <p className="text-gray-400">Watch some movies to see them here</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default MyList