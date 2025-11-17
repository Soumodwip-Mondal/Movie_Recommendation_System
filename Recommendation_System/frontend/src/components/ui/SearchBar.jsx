// src/components/ui/SearchBar.jsx
import React, { useState, useEffect, useRef } from 'react'
import { Search, X, Loader2, Film } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMovies } from '../../context/movieContext'

function SearchBar({ onSearch, onMovieSelect, placeholder }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedTerm, setDebouncedTerm] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const { searchMovies } = useMovies()
  const navigate = useNavigate()
  const debounceTimerRef = useRef(null)
  const searchBarRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounce search input
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    if (searchTerm.trim().length >= 2) {
      debounceTimerRef.current = setTimeout(() => {
        setDebouncedTerm(searchTerm.trim())
      }, 400) // Wait 400ms after user stops typing
    } else {
      setDebouncedTerm('')
      setResults([])
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [searchTerm])

  // Perform search when debounced term changes
  useEffect(() => {
    if (!debouncedTerm) return

    let ignore = false

    async function performSearch() {
      setSearching(true)

      try {
        const movies = await searchMovies(debouncedTerm)
        if (!ignore) {
          // Take top 6 results for dropdown
          const topResults = (movies || []).slice(0, 6).map(m => ({
            id: m.id,
            title: m.title || m.name || 'Untitled',
            year: m.release_date ? new Date(m.release_date).getFullYear() : null,
            rating: m.vote_average ? Number(m.vote_average).toFixed(1) : null,
            poster: m.poster_path ? `https://image.tmdb.org/t/p/w92${m.poster_path}` : null,
            // Store full data for onMovieSelect
            fullData: m
          }))
          setResults(topResults)
        }
      } catch (error) {
        console.error('Search failed:', error)
        if (!ignore) {
          setResults([])
        }
      } finally {
        if (!ignore) {
          setSearching(false)
        }
      }
    }

    performSearch()

    return () => {
      ignore = true
    }
  }, [debouncedTerm, searchMovies])

  const handleClear = () => {
    setSearchTerm('')
    setDebouncedTerm('')
    setResults([])
  }

  const handleMovieClick = (movie) => {
    setIsFocused(false)
    setSearchTerm('')
    setResults([])
    
    // If onMovieSelect callback is provided (for SearchDisplay), use it
    if (onMovieSelect) {
      onMovieSelect(movie.fullData)
    } else {
      // Otherwise, navigate to full search page with the movie title as query
      if (onSearch) {
        onSearch('')
      }
      const title = movie.title || movie.fullData?.title || movie.fullData?.name || ''
      navigate(`/search?q=${encodeURIComponent(title)}`)
    }
  }

  const handleViewAll = () => {
    setIsFocused(false)
    if (onSearch) {
      onSearch(searchTerm)
    }
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchTerm.trim().length >= 2) {
      handleViewAll()
    }
  }

  const handleSearchClick = () => {
    if (searchTerm.trim().length >= 2) {
      handleViewAll()
    }
  }

  return (
    <div ref={searchBarRef} className="w-full max-w-2xl mx-auto">
      <div className={`relative flex items-center transition-all duration-300 ${
        isFocused ? 'scale-105' : 'scale-100'
      }`}>
        {/* Search Icon */}
        <Search
          size={20}
          className="absolute left-4 text-gray-400 pointer-events-none transition-colors duration-300"
        />

        {/* Input Field */}
        <input
          type="text"
          placeholder={placeholder || "Search movies, TV shows..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyPress={handleKeyPress}
          autoComplete="off"
          className={`w-full pl-12 pr-24 py-3 rounded-full bg-gray-800 border-2 transition-all duration-300 outline-none text-white placeholder-gray-500 ${
            isFocused
              ? 'border-red-600 bg-gray-700 shadow-lg shadow-red-600/50'
              : 'border-gray-600 hover:border-gray-500'
          }`}
        />

        {/* Loading Spinner */}
        {searching && (
          <div className="absolute right-14 pointer-events-none">
            <Loader2 size={18} className="text-gray-400 animate-spin" />
          </div>
        )}

        {/* Clear Button */}
        {searchTerm && !searching && (
          <button
            onClick={handleClear}
            className="absolute right-14 p-1 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <X size={18} />
          </button>
        )}

        {/* Search Button */}
        <button
          onClick={handleSearchClick}
          disabled={searchTerm.trim().length < 2}
          className={`absolute right-1.5 text-white p-2.5 rounded-full transition-all duration-200 transform ${
            searchTerm.trim().length >= 2
              ? 'bg-red-600 hover:bg-red-700 hover:scale-110 cursor-pointer'
              : 'bg-gray-600 cursor-not-allowed'
          }`}
        >
          <Search size={18} />
        </button>
      </div>

      {/* Search Results Dropdown */}
      {isFocused && searchTerm.trim().length >= 2 && (
        <div className="mt-3 bg-gray-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in-50 duration-200 border border-gray-700">
          {searching ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin text-red-600 mr-2" size={20} />
              <span className="text-gray-400 text-sm">Searching for "{debouncedTerm}"...</span>
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="p-3 border-b border-gray-700">
                <p className="text-sm text-gray-400">
                  {onMovieSelect ? 'Select a movie to get recommendations' : 'Top Results'}
                </p>
              </div>
              
              <div className="max-h-80 overflow-y-auto">
                {results.map((movie) => (
                  <button
                    key={movie.id}
                    onClick={() => handleMovieClick(movie)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-700 transition-colors duration-150"
                  >
                    {/* Movie Poster */}
                    {movie.poster ? (
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-10 h-14 object-cover rounded"
                      />
                    ) : (
                      <div className="w-10 h-14 bg-gray-700 rounded flex items-center justify-center shrink-0">
                        <Film size={16} className="text-gray-500" />
                      </div>
                    )}

                    {/* Movie Info */}
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {movie.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                        {movie.year && <span>{movie.year}</span>}
                        {movie.rating && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-0.5">
                              ⭐ {movie.rating}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* View All Button - Only show if not using onMovieSelect */}
              {!onMovieSelect && (
                <button
                  onClick={handleViewAll}
                  className="w-full py-3 bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold text-sm transition-all duration-200"
                >
                  View All Results for "{searchTerm}"
                </button>
              )}
            </>
          ) : debouncedTerm && !searching ? (
            <div className="flex flex-col items-center justify-center py-8 px-4">
              <div className="text-4xl mb-2">🔍</div>
              <p className="text-gray-400 text-sm text-center">
                No results found for "{debouncedTerm}"
              </p>
              <p className="text-gray-500 text-xs mt-1">Try different keywords</p>
            </div>
          ) : null}
        </div>
      )}

      {/* Hint text */}
      {isFocused && searchTerm.trim().length > 0 && searchTerm.trim().length < 2 && (
        <div className="mt-2 text-center">
          <p className="text-gray-500 text-xs">Type at least 2 characters to search</p>
        </div>
      )}
    </div>
  )
}

export default SearchBar