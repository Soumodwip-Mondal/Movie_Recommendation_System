import React, { useState } from 'react'
import { Search, X } from 'lucide-react'
import { apiFetch } from '../../lib/api'

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setSearching(true);
    try {
      // Search using top_6 endpoint with movie name
      const res = await apiFetch(`/api/top_6?name=${encodeURIComponent(searchTerm)}`);
      const movies = (res?.movies || []).slice(0, 4).map(m => ({
        id: m.id,
        title: m.title || m.name || 'Untitled',
      }));
      setResults(movies);
      if (onSearch) {
        onSearch(searchTerm);
      }
    } catch (e) {
      console.error('Search failed', e);
      setResults([]);
    } finally {
      setSearching(false);
    }
  }

  const handleClear = () => {
    setSearchTerm('')
    setResults([])
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
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
          placeholder="Search movies, TV shows..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyPress={handleKeyPress}
          className={`w-full pl-12 pr-12 py-3 rounded-full bg-gray-800 border-2 transition-all duration-300 outline-none text-white placeholder-gray-500 ${
            isFocused
              ? 'border-red-600 bg-gray-700 shadow-lg shadow-red-600/50'
              : 'border-gray-600 hover:border-gray-500'
          }`}
        />

        {/* Clear Button */}
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-12 p-1 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <X size={18} />
          </button>
        )}

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="absolute right-1.5 bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-full transition-all duration-200 transform hover:scale-110"
        >
          <Search size={18} />
        </button>
      </div>

      {/* Search Results */}
      {isFocused && results.length > 0 && (
        <div className="mt-3 bg-gray-800 rounded-lg shadow-xl overflow-hidden animate-in fade-in-50 duration-200">
          <div className="p-3 border-b border-gray-700">
            <p className="text-sm text-gray-400">Search Results</p>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {results.map((item) => (
              <div
                key={item.id}
                className="w-full text-left px-4 py-2 hover:bg-gray-700 text-white text-sm transition-colors duration-150 flex items-center gap-2"
              >
                <Search size={14} className="text-gray-400" />
                {item.title}
              </div>
            ))}
          </div>
        </div>
      )}
      {searching && (
        <div className="mt-3 text-center text-gray-400 text-sm">Searching...</div>
      )}
    </div>
  )
}

export default SearchBar