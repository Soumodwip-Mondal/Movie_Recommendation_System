import React, { useEffect, useState } from 'react'
import ScrollSection from '../section/ScrollSection'
import MovieCard from '../ui/MovieCard'
import { useMovies } from '../../context/movieContext'

function mapTmdbToCard(movie) {
  return {
    title: movie.title || movie.name || 'Untitled',
    imageUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
    rating: movie.vote_average ? Number(movie.vote_average).toFixed(1) : null,
    movieId: movie.id,
  }
}

function TopRated() {
  const [primary, setPrimary] = useState([])
  const [secondary, setSecondary] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { getCache, fetchTopRated } = useMovies()
  
  // Use the correct cache category name
  const cache = getCache('topRated')

  useEffect(() => {
    let ignore = false
    
    async function load() {
      try {
        // Only show loading if there's no cached data
        if (!cache?.data || cache.data.length === 0) {
          setIsLoading(true)
        }
        
        const res = await fetchTopRated()
        const raw = Array.isArray(res) ? res : []

        // TMDB already returns results sorted by vote_average.desc.
        // Take the top N as "Most Top Rated" and the rest for the grid
        const allCards = raw.map(mapTmdbToCard)
        const mostCards = allCards.slice(0, 12)
        const restCards = allCards.slice(12)

        if (!ignore) {
          setPrimary(mostCards)
          setSecondary(restCards)
          setError(null)
          setIsLoading(false)
        }
      } catch (e) {
        console.error('Failed to fetch top rated', e)
        if (!ignore) {
          setError(e?.message || 'Failed to load top rated movies')
          setPrimary([])
          setSecondary([])
          setIsLoading(false)
        }
      }
    }
    
    load()
    return () => { ignore = true }
  }, [fetchTopRated, cache?.data])

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-primary via-secondary to-primary">
      <style>{`
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12">
        {isLoading ? (
          <div className="text-center text-gray-400 py-20 animate-pulse">Loading top rated movies...</div>
        ) : error ? (
          <div className="text-center text-red-400 py-20">
            Failed to load top rated movies: {error}
          </div>
        ) : primary.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            No top rated movies found.
          </div>
        ) : (
          <>
            <div className="animate-slide-up">
              <ScrollSection title="Most Top Rated (>8)" movies={primary} />
            </div>

            <section className="w-full animate-slide-up" style={{animationDelay: '0.2s'}}>
              <h2 className="text-xl sm:text-2xl lg:text-3xl text-white font-bold mb-4 sm:mb-6 text-center sm:text-left animate-slide-in-left">
                All Top Rated
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 lg:gap-7 w-full">
                {(secondary || []).slice(0, 30).map((movie, idx) => (
                  <div
                    key={idx}
                    className="animate-scale-in"
                    style={{animationDelay: `${idx * 0.05}s`}}
                  >
                    <MovieCard 
                      title={movie.title} 
                      imageUrl={movie.imageUrl} 
                      rating={movie.rating} 
                      movieId={movie.movieId} 
                    />
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}

export default TopRated
