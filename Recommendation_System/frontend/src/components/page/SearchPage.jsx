// src/components/page/SearchPage.jsx
import React, { useState, useEffect, useRef } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import MovieCard from '../ui/MovieCard'
import { useMovies } from '../../context/movieContext'
import { apiFetch } from '../../lib/api'

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

  // Recommendation state
  const [seedName, setSeedName] = useState('')
  const [top6, setTop6] = useState([])
  const [next6, setNext6] = useState([])
  const [loadingReco, setLoadingReco] = useState(false)
  const [recoError, setRecoError] = useState('')

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
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)

    if (query.trim().length >= 2) {
      debounceTimerRef.current = setTimeout(() => {
        const trimmedQuery = query.trim()
        setDebouncedQuery(trimmedQuery)
        setSearchParams({ q: trimmedQuery })
      }, 500)
    } else {
      setDebouncedQuery('')
      setMovies([])
      setHasSearched(false)
      setTop6([]); setNext6([]); setSeedName(''); setRecoError('')
    }

    return () => { if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current) }
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
        if (!ignore) setMovies(results || [])
      } catch (error) {
        console.error('Search failed:', error)
        if (!ignore) setMovies([])
      } finally {
        if (!ignore) setIsSearching(false)
      }
    }

    performSearch()
    return () => { ignore = true }
  }, [debouncedQuery, searchMovies])

  // Derive a seed title and fetch recommendations (top 6 and next 6)
  useEffect(() => {
    if (!hasSearched || movies.length === 0) { setTop6([]); setNext6([]); setSeedName(''); return }

    // Pick exact match if available, else take top result title
    const exact = movies.find(m => (m.title || m.name || '').toLowerCase() === debouncedQuery.toLowerCase())
    const title = exact?.title || exact?.name || movies[0]?.title || movies[0]?.name || ''
    if (!title) { setTop6([]); setNext6([]); setSeedName(''); return }

    let ignore = false
    setSeedName(title)
    setLoadingReco(true)
    setRecoError('')
    setTop6([]); setNext6([])

    async function loadReco() {
      try {
        const r1 = await apiFetch(`/api/top_6?name=${encodeURIComponent(title)}`)
        if (!ignore) setTop6(r1?.movies || [])
      } catch (e) {
        console.error('Failed to fetch top 6', e)
        if (!ignore) setRecoError('No similar recommendations found for this title.')
      }
      try {
        const r2 = await apiFetch(`/api/top_6_to_12?name=${encodeURIComponent(title)}`)
        if (!ignore) setNext6(r2?.movies || [])
      } catch (e) {
        console.error('Failed to fetch next 6', e)
      } finally {
        if (!ignore) setLoadingReco(false)
      }
    }

    loadReco()
    return () => { ignore = true }
  }, [debouncedQuery, movies, hasSearched])

  const handleClear = () => {
    setQuery('')
    setDebouncedQuery('')
    setMovies([])
    setHasSearched(false)
    setSearchParams({})
    setTop6([]); setNext6([]); setSeedName(''); setRecoError('')
  }

  // Build a set of recommended IDs to exclude from "Other results"
  const recommendedIds = new Set([...(top6||[]), ...(next6||[])].map(m => m.id))
  const otherMovies = (movies || []).filter(m => !recommendedIds.has(m.id))

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white px-6 md:px-16 pt-32 pb-10">
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
      <div className="max-w-7xl mx-auto space-y-10">
        {isSearching ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
            <p className="text-gray-400">Searching for "{debouncedQuery}"...</p>
          </div>
        ) : hasSearched && movies.length > 0 ? (
          <>
            {/* Recommendations sections */}
            <div>
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
                <h2 className="text-2xl md:text-3xl font-bold text-center">
                  <span className="bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">
                    Recommendations{seedName ? ` for "${seedName}"` : ''}
                  </span>
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
              </div>

              {loadingReco ? (
                <div className="flex items-center justify-center py-10 text-gray-400">
                  <Loader2 className="animate-spin mr-2" size={20} /> Loading recommendations...
                </div>
              ) : (
                <>
                  {recoError && (
                    <p className="text-center text-red-300 text-sm mb-4">{recoError}</p>
                  )}

                  {top6.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4">Top 6 Most Similar</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5 lg:gap-6">
                        {top6.map((m) => {
                          const c = mapTmdbToCard(m)
                          return (
                            <MovieCard key={m.id} title={c.title} imageUrl={c.imageUrl} rating={c.rating} movieId={c.movieId} />
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {next6.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4">More Recommendations (7-12)</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5 lg:gap-6">
                        {next6.map((m) => {
                          const c = mapTmdbToCard(m)
                          return (
                            <MovieCard key={m.id} title={c.title} imageUrl={c.imageUrl} rating={c.rating} movieId={c.movieId} />
                          )
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Other search results (excluding ones shown above) */}
            {otherMovies.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Other Results</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5 lg:gap-6">
                  {otherMovies.map((movie) => {
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
              </div>
            )}
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