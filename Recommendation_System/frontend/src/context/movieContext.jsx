/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useRef, useCallback } from 'react';
import { apiFetch } from '../lib/api';

const MoviesContext = createContext(null);

export function MoviesProvider({ children }) {
  // Use useRef to persist cache across component re-renders and re-mounts
  const cacheRef = useRef({
    topRated: { data: null, loading: false, error: null, timestamp: null, promise: null },
    myList: { data: null, loading: false, error: null, timestamp: null, promise: null },
    genres: { data: null, loading: false, error: null, timestamp: null, promise: null },
    home: { data: null, loading: false, error: null, timestamp: null, promise: null },
    search: {}, // Store multiple search queries: { "query": { data, timestamp, ... } }
  });

  // Cache duration in milliseconds (5 minutes)
  const CACHE_DURATION = 5 * 60 * 1000;

  // Check if cache is still valid
  const isCacheValid = useCallback((timestamp) => {
    if (!timestamp) return false;
    const isValid = Date.now() - timestamp < CACHE_DURATION;
    return isValid;
  }, [CACHE_DURATION]);

  // Generic fetch function with caching
  const fetchWithCache = useCallback(async (category, endpoint) => {
    const cache = cacheRef.current[category];

    // Return cached data if valid
    if (cache.data && isCacheValid(cache.timestamp)) {
      console.log(`✅ [CACHE HIT] Using cached data for ${category} (${cache.data.length} items)`);
      return cache.data;
    }

    // If already loading, return the existing promise
    if (cache.loading && cache.promise) {
      console.log(`⏳ [CACHE] Already loading ${category}, reusing promise...`);
      return cache.promise;
    }

    console.log(`🔄 [CACHE MISS] Fetching fresh data for ${category} from ${endpoint}`);

    // Create the fetch promise
    const fetchPromise = (async () => {
      try {
        // Mark as loading
        cacheRef.current[category] = { 
          ...cacheRef.current[category], 
          loading: true, 
          error: null 
        };

        const res = await apiFetch(endpoint);
        const data = res.movies || res;

        // Update cache with successful data
        cacheRef.current[category] = {
          data,
          loading: false,
          error: null,
          timestamp: Date.now(),
          promise: null
        };

        console.log(`✅ [CACHE] Successfully cached ${category} with ${data?.length || 0} items`);
        return data;
      } catch (error) {
        console.error(`❌ [CACHE ERROR] Failed to fetch ${category}:`, error);
        
        // Update cache with error
        cacheRef.current[category] = { 
          ...cacheRef.current[category], 
          loading: false, 
          error: error.message,
          promise: null
        };

        throw error;
      }
    })();

    // Store the promise so other calls can reuse it
    cacheRef.current[category].promise = fetchPromise;

    return fetchPromise;
  }, [isCacheValid]);

  // Specific fetch functions - these are memoized and won't change
  const fetchTopRated = useCallback(() => {
    // Use dedicated backend endpoint backed by TMDB Discover; fetch >= 7 rating to have enough results
    return fetchWithCache('topRated', '/api/top-rated?min_rating=7&min_votes=1000');
  }, [fetchWithCache]);

  const fetchMyList = useCallback(() => {
    return fetchWithCache('myList', '/api/user/history/');
  }, [fetchWithCache]);

  const fetchGenres = useCallback(() => {
    return fetchWithCache('genres', '/api/cold-sample');
  }, [fetchWithCache]);

  const fetchHome = useCallback(() => {
    return fetchWithCache('home', '/api/cold-sample');
  }, [fetchWithCache]);

  // Search function with per-query caching
  const searchMovies = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const trimmedQuery = query.trim().toLowerCase();
    
    // Check if this specific search is cached
    if (!cacheRef.current.search[trimmedQuery]) {
      cacheRef.current.search[trimmedQuery] = {
        data: null,
        loading: false,
        error: null,
        timestamp: null,
        promise: null
      };
    }

    const searchCache = cacheRef.current.search[trimmedQuery];

    // Return cached search results if valid
    if (searchCache.data && isCacheValid(searchCache.timestamp)) {
      console.log(`✅ [SEARCH CACHE HIT] Using cached results for "${trimmedQuery}"`);
      return searchCache.data;
    }

    // If already searching this query, return existing promise
    if (searchCache.loading && searchCache.promise) {
      console.log(`⏳ [SEARCH] Already searching "${trimmedQuery}", reusing promise...`);
      return searchCache.promise;
    }

    console.log(`🔍 [SEARCH] Searching for "${trimmedQuery}"...`);

    const searchPromise = (async () => {
      try {
        cacheRef.current.search[trimmedQuery].loading = true;

        const res = await apiFetch(`/api/search?query=${encodeURIComponent(trimmedQuery)}`);
        const data = res.movies || [];

        cacheRef.current.search[trimmedQuery] = {
          data,
          loading: false,
          error: null,
          timestamp: Date.now(),
          promise: null
        };

        console.log(`✅ [SEARCH] Found ${data.length} results for "${trimmedQuery}"`);
        return data;
      } catch (error) {
        console.error(`❌ [SEARCH ERROR] Failed to search "${trimmedQuery}":`, error);
        
        cacheRef.current.search[trimmedQuery] = {
          data: null,
          loading: false,
          error: error.message,
          timestamp: null,
          promise: null
        };

        throw error;
      }
    })();

    cacheRef.current.search[trimmedQuery].promise = searchPromise;
    return searchPromise;
  }, [isCacheValid]);

  // Get search cache status
  const getSearchCache = useCallback((query) => {
    const trimmedQuery = query?.trim().toLowerCase();
    if (!trimmedQuery || !cacheRef.current.search[trimmedQuery]) {
      return { data: null, loading: false, error: null, timestamp: null };
    }
    return cacheRef.current.search[trimmedQuery];
  }, []);

  // Force refresh function (bypass cache)
  const refreshCategory = useCallback((category) => {
    console.log(`🔄 [CACHE] Forcing refresh for ${category}`);
    cacheRef.current[category] = { 
      data: null, 
      loading: false, 
      error: null, 
      timestamp: null,
      promise: null
    };
  }, []);

  // Clear all cache
  const clearCache = useCallback(() => {
    console.log('🗑️ [CACHE] Clearing all cache');
    cacheRef.current = {
      topRated: { data: null, loading: false, error: null, timestamp: null, promise: null },
      myList: { data: null, loading: false, error: null, timestamp: null, promise: null },
      genres: { data: null, loading: false, error: null, timestamp: null, promise: null },
      home: { data: null, loading: false, error: null, timestamp: null, promise: null },
      search: {},
    };
  }, []);

  // Clear search cache only
  const clearSearchCache = useCallback(() => {
    console.log('🗑️ [CACHE] Clearing search cache');
    cacheRef.current.search = {};
  }, []);

  // Get current cache state (for UI) with safety check
  const getCache = useCallback((category) => {
    if (!cacheRef.current[category]) {
      console.warn(`⚠️ Cache category "${category}" not found, initializing...`);
      cacheRef.current[category] = { 
        data: null, 
        loading: false, 
        error: null, 
        timestamp: null,
        promise: null
      };
    }
    return cacheRef.current[category];
  }, []);

  // Debug function to see cache status
  const getCacheInfo = useCallback(() => {
    const info = {};
    Object.keys(cacheRef.current).forEach(key => {
      if (key === 'search') {
        info[key] = {
          cachedQueries: Object.keys(cacheRef.current.search).length
        };
      } else {
        const cache = cacheRef.current[key];
        info[key] = {
          hasData: !!cache.data,
          itemCount: cache.data?.length || 0,
          isLoading: cache.loading,
          isValid: cache.timestamp ? isCacheValid(cache.timestamp) : false,
          age: cache.timestamp ? Math.floor((Date.now() - cache.timestamp) / 1000) + 's' : 'never'
        };
      }
    });
    return info;
  }, [isCacheValid]);

  const value = {
    getCache,
    getCacheInfo,
    fetchTopRated,
    fetchMyList,
    fetchGenres,
    fetchHome,
    searchMovies,
    getSearchCache,
    refreshCategory,
    clearCache,
    clearSearchCache,
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