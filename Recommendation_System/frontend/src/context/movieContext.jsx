import React, { createContext, useContext, useState, useCallback } from 'react';
import { apiFetch } from '../lib/api';

const MoviesContext = createContext(null);

export function MoviesProvider({ children }) {
  // Cache for different movie categories
  const [cache, setCache] = useState({
    topRated: { data: null, loading: false, error: null, timestamp: null },
    myList: { data: null, loading: false, error: null, timestamp: null },
    genres: { data: null, loading: false, error: null, timestamp: null },
    home: { data: null, loading: false, error: null, timestamp: null },
    // Add more categories as needed
  });

  // Cache duration in milliseconds (5 minutes)
  const CACHE_DURATION = 5 * 60 * 1000;

  // Check if cache is still valid
  const isCacheValid = (timestamp) => {
    if (!timestamp) return false;
    return Date.now() - timestamp < CACHE_DURATION;
  };

  // Generic fetch function with caching
  const fetchWithCache = useCallback(async (category, endpoint) => {
    // Return cached data if valid
    if (cache[category].data && isCacheValid(cache[category].timestamp)) {
      console.log(`[CACHE] Using cached data for ${category}`);
      return cache[category].data;
    }

    // Set loading state
    setCache(prev => ({
      ...prev,
      [category]: { ...prev[category], loading: true, error: null }
    }));

    try {
      console.log(`[FETCH] Fetching fresh data for ${category}`);
      const res = await apiFetch(endpoint);
      const data = res.movies || res;

      // Update cache
      setCache(prev => ({
        ...prev,
        [category]: {
          data,
          loading: false,
          error: null,
          timestamp: Date.now()
        }
      }));

      return data;
    } catch (error) {
      console.error(`[ERROR] Failed to fetch ${category}:`, error);
      
      setCache(prev => ({
        ...prev,
        [category]: { ...prev[category], loading: false, error: error.message }
      }));

      throw error;
    }
  }, [cache]);

  // Specific fetch functions
  const fetchTopRated = useCallback(() => {
    return fetchWithCache('topRated', '/top-rated');
  }, [fetchWithCache]);

  // In MoviesContext.jsx, update these functions:

const fetchMyList = useCallback(() => {
  return fetchWithCache('myList', '/user/history/');
}, [fetchWithCache]);

const fetchGenres = useCallback(() => {
  return fetchWithCache('genres', '/cold-sample');
}, [fetchWithCache]);
  const fetchHome = useCallback(() => {
    return fetchWithCache('home', '/cold-sample');
  }, [fetchWithCache]);

  // Force refresh function (bypass cache)
  const refreshCategory = useCallback((category) => {
    setCache(prev => ({
      ...prev,
      [category]: { data: null, loading: false, error: null, timestamp: null }
    }));
  }, []);

  // Clear all cache
  const clearCache = useCallback(() => {
    setCache({
      topRated: { data: null, loading: false, error: null, timestamp: null },
      myList: { data: null, loading: false, error: null, timestamp: null },
      genres: { data: null, loading: false, error: null, timestamp: null },
      home: { data: null, loading: false, error: null, timestamp: null },
    });
  }, []);

  const value = {
    cache,
    fetchTopRated,
    fetchMyList,
    fetchGenres,
    fetchHome,
    refreshCategory,
    clearCache
  };

  return (
    <MoviesContext.Provider value={value}>
      {children}
    </MoviesContext.Provider>
  );
}

export function useMovies() {
  const context = useContext(MoviesContext);
  if (!context) {
    throw new Error('useMovies must be used within MoviesProvider');
  }
  return context;
}