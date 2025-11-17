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

function Page() {
  const [primary, setPrimary] = useState([])
  const [secondary, setSecondary] = useState([])
  const [others, setOthers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { getCache, fetchHome } = useMovies()
  
  // Get cache state
  const cache = getCache('home')

  useEffect(() => {
    let ignore = false
    
    async function load() {
      try {
        // Only show loading if there's no cached data
        if (!cache?.data || cache.data.length === 0) {
          setIsLoading(true)
        }
        
        console.log('🏠 [HOME] Loading movies...')
        const res = await fetchHome() // Uses cache automatically!
        const movies = (res || []).map(mapTmdbToCard)
        if (!ignore) {
          // Use the first 10 for the top row, next 10 for the second row,
          // and everything else (up to many dozens) for "Other Movies".
          const primaryMovies = movies.slice(0, 10)
          const secondaryMovies = movies.slice(10, 20)
          const otherMovies = movies.slice(20)

          setPrimary(primaryMovies)
          setSecondary(secondaryMovies)
          setOthers(otherMovies)
          setError(null)
          console.log('🏠 [HOME] Movies loaded successfully')
          setIsLoading(false)
        }
      } catch (e) {
        console.error('❌ [HOME] Failed to fetch recommendations', e)
        if (!ignore) {
          setError(e?.message || 'Failed to load movies')
          setPrimary([])
          setSecondary([])
          setOthers([])
          setIsLoading(false)
        }
      }
    }
    
    load()
    return () => { ignore = true }
  }, [fetchHome, cache?.data]) // fetchHome is stable, won't cause re-runs

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-primary via-secondary to-primary">
      <style>{`
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12">
        {isLoading ? (
          <div className="text-center text-gray-400 py-20 animate-pulse">Loading amazing movies for you...</div>
        ) : error ? (
          <div className="text-center text-red-400 py-20">
            Failed to load movies: {error}
          </div>
        ) : primary.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            No movies found.
          </div>
        ) : (
          <>
            <div className="animate-slide-up">
              <ScrollSection title="Top movies for you :)" movies={primary} />
            </div>
            <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
              <ScrollSection title="You can also watch :)" movies={secondary} />
            </div>

            {/* Grid Section */}
            <section className="w-full animate-slide-up" style={{animationDelay: '0.4s'}}>
              <h2 className="text-xl sm:text-2xl lg:text-3xl text-white font-bold mb-4 sm:mb-6 text-center sm:text-left animate-slide-in-left">
                Other Movies
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 w-full">
                {(others || []).slice(0, 48).map((movie, idx) => (
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

export default Page
