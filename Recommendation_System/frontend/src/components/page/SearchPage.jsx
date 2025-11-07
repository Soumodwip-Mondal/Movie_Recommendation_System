// src/components/page/SearchPage.jsx
import React, { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
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

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const urlQuery = searchParams.get('q') || ''
  
  const [query, setQuery] = useState(urlQuery)
  const [debouncedQuery, setDebouncedQuery] = useState(urlQuery)
  const [movies, setMovies] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const { searchMovies } = useMovies()
  const debounceTimerRef = useRef(null)

  // Update query when URL changes
  useEffect(() => {
    const newQuery = searchParams.get('q') || ''
    setQuery(newQuery)
    if (newQuery.trim().length >= 2) {
      setDebouncedQuery(newQuery.trim())
    }
  }, [searchParams])

  // Debounce search input
  useEffect(() => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Set new timer
    if (query.trim().length >= 2) {
      debounceTimerRef.current = setTimeout(() => {
        const trimmedQuery = query.trim()
        setDebouncedQuery(trimmedQuery)
        // Update URL
        setSearchParams({ q: trimmedQuery })
      }, 500)
    } else {
      setDebouncedQuery('')
      setMovies([])
      setHasSearched(false)
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [query, setSearchParams])

  // Perform search when debounced query changes
  useEffect(() => {
    if (!debouncedQuery) return

    let ignore = false

    async function performSearch() {
      setIsSearching(true)
      setHasSearched(true)

      try {
        const results = await searchMovies(debouncedQuery)
        if (!ignore) {
          setMovies(results || [])
        }
      } catch (error) {
        console.error('Search failed:', error)
        if (!ignore) {
          setMovies([])
        }
      } finally {
        if (!ignore) {
          setIsSearching(false)
        }
      }
    }

    performSearch()

    return () => {
      ignore = true
    }
  }, [debouncedQuery, searchMovies])

  const handleClear = () => {
    setQuery('')
    setDebouncedQuery('')
    setMovies([])
    setHasSearched(false)
    setSearchParams({})
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white px-6 md:px-16 py-10">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl font-black mb-6">Search Movies</h1>
        
        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for movies..."
              className="w-full bg-gray-800 text-white pl-12 pr-12 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 placeholder-gray-500"
              autoFocus
            />
            {query && (
              <button
                onClick={handleClear}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            )}
          </div>
          
          {/* Search status */}
          {query.trim().length > 0 && query.trim().length < 2 && (
            <p className="text-gray-400 text-sm mt-2">Type at least 2 characters to search</p>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto">
        {isSearching ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
            <p className="text-gray-400">Searching for "{debouncedQuery}"...</p>
          </div>
        ) : hasSearched && movies.length > 0 ? (
          <>
            <p className="text-gray-400 mb-6">
              Found {movies.length} result{movies.length !== 1 ? 's' : ''} for "{debouncedQuery}"
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5 lg:gap-6">
              {movies.map((movie) => {
                const cardData = mapTmdbToCard(movie)
                return (
                  <MovieCard
                    key={movie.id}
                    title={cardData.title}
                    imageUrl={cardData.imageUrl}
                    rating={cardData.rating}
                    movieId={cardData.movieId}
                  />
                )
              })}
            </div>
          </>
        ) : hasSearched && movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No results found</h3>
            <p className="text-gray-400">Try searching with different keywords</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-2xl font-bold mb-2">Start Searching</h3>
            <p className="text-gray-400">Search for your favorite movies above</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchPage