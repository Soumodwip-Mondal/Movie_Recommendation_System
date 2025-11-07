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
  const { getCache, fetchHome } = useMovies()
  
  // Get cache state
  const cache = getCache('home')
  const loading = cache?.loading || false

  useEffect(() => {
    let ignore = false
    
    async function load() {
      try {
        console.log('🏠 [HOME] Loading movies...')
        const res = await fetchHome() // Uses cache automatically!
        const movies = (res || []).map(mapTmdbToCard)
        if (!ignore) {
          setPrimary(movies.slice(0, 12))
          setSecondary(movies.slice(12))
          console.log('🏠 [HOME] Movies loaded successfully')
        }
      } catch (e) {
        console.error('❌ [HOME] Failed to fetch recommendations', e)
      }
    }
    
    load()
    return () => { ignore = true }
  }, [fetchHome]) // fetchHome is stable, won't cause re-runs

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black">
      <style>{`
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12">
        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading amazing movies for you...</div>
        ) : (
          <>
            <ScrollSection title="Top movies for you :)" movies={primary} />
            <ScrollSection title="You can also watch :)" movies={secondary} />

            {/* Grid Section */}
            <section className="w-full">
              <h2 className="text-xl sm:text-2xl lg:text-3xl text-white font-bold mb-4 sm:mb-6 text-center sm:text-left">
                Other Movies
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5 lg:gap-6 w-full">
                {(secondary || []).slice(0, 18).map((movie, idx) => (
                  <MovieCard 
                    key={idx} 
                    title={movie.title} 
                    imageUrl={movie.imageUrl} 
                    rating={movie.rating} 
                    movieId={movie.movieId} 
                  />
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