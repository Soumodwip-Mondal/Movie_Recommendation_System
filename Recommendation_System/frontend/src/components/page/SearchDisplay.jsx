import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import MovieCard from '../ui/MovieCard';
import { apiFetch } from '../../lib/api';
import { useSearchParams } from 'react-router-dom';

function SearchDisplay() {
  const [searchParams] = useSearchParams();
  const [selectedMovieName, setSelectedMovieName] = useState('');
  const [selectedMovieData, setSelectedMovieData] = useState(null);
  const [top6Movies, setTop6Movies] = useState([]);
  const [next6Movies, setNext6Movies] = useState([]);
  const [isLoadingTop6, setIsLoadingTop6] = useState(false);
  const [isLoadingNext6, setIsLoadingNext6] = useState(false);
  const [showNext6, setShowNext6] = useState(false);
  const [error, setError] = useState('');

  // Fetch top 6 similar movies
  const fetchTop6Movies = async (movieName) => {
    setIsLoadingTop6(true);
    setError('');
    setTop6Movies([]);
    setNext6Movies([]);
    setShowNext6(false);
    
    try {
      const response = await apiFetch(`/api/top_6?name=${encodeURIComponent(movieName)}`);
      setTop6Movies(response.movies || []);
    } catch (err) {
      console.error('Error fetching top 6:', err);
      setError(`Failed to find similar movies for "${movieName}". Please try another movie.`);
      setTop6Movies([]);
    } finally {
      setIsLoadingTop6(false);
    }
  };

  // Fetch next 6 movies (7-12)
  const fetchNext6Movies = async () => {
    if (!selectedMovieName) return;
    
    setIsLoadingNext6(true);
    setError('');
    
    try {
      const response = await apiFetch(`/api/top_6_to_12?name=${encodeURIComponent(selectedMovieName)}`);
      setNext6Movies(response.movies || []);
      setShowNext6(true);
    } catch (err) {
      console.error('Error fetching next 6:', err);
      setError('Failed to load more recommendations');
      setNext6Movies([]);
    } finally {
      setIsLoadingNext6(false);
    }
  };

  // Handle movie selection from SearchBar
  const handleMovieSelect = async (movieData) => {
    const movieName = movieData.title || movieData.name || '';
    
    if (!movieName) return;
    
    setSelectedMovieName(movieName);
    setSelectedMovieData(movieData);
    await fetchTop6Movies(movieName);
  };

  // Handle Load More / Show Less button
  const handleLoadMore = () => {
    if (showNext6) {
      setShowNext6(false);
    } else {
      fetchNext6Movies();
    }
  };

  // Auto-fetch when arriving via /recommend?name=...
  useEffect(() => {
    const name = searchParams.get('name');
    if (name && name !== selectedMovieName) {
      setSelectedMovieName(name);
      setSelectedMovieData(null);
      fetchTop6Movies(name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Map TMDB data to MovieCard format
  const mapToMovieCard = (movie) => ({
    title: movie.title || movie.name || 'Untitled',
    imageUrl: movie.poster_path 
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
      : null,
    rating: movie.vote_average ? Number(movie.vote_average).toFixed(1) : null,
    movieId: movie.id,
  });

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 via-gray-900 to-black text-white px-6 md:px-16 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="text-red-500" size={32} />
            <h1 className="text-4xl md:text-5xl font-black bg-linear-to-r from-red-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Discover Similar Movies
            </h1>
            <Sparkles className="text-purple-500" size={32} />
          </div>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
            Search for any movie and get personalized recommendations based on advanced similarity algorithms
          </p>
        </div>


        {/* Error Message */}
        {error && (
          <div className="max-w-3xl mx-auto mb-8 p-4 bg-red-900/20 border border-red-500/30 rounded-xl flex items-start gap-3">
            <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-red-200 text-sm">{error}</p>
              <p className="text-red-300/70 text-xs mt-1">
                Make sure the movie name is spelled correctly or try searching for another movie.
              </p>
            </div>
          </div>
        )}
        
        {selectedMovieData && !isLoadingTop6 && (
          <div className="max-w-4xl mx-auto mb-12 p-6 bg-linear-to-r from-gray-800/80 via-gray-800/60 to-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group">
                <img
                  src={
                    selectedMovieData.poster_path
                      ? `https://image.tmdb.org/t/p/w185${selectedMovieData.poster_path}`
                      : 'https://via.placeholder.com/185x278?text=No+Image'
                  }
                  alt={selectedMovieName}
                  className="w-32 h-48 object-cover rounded-lg shadow-2xl group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent rounded-lg"></div>
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <div className="inline-block px-3 py-1 bg-red-600/20 border border-red-500/30 rounded-full mb-3">
                  <span className="text-red-400 text-xs font-semibold">🎯 Finding Similar Movies</span>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {selectedMovieName}
                </h2>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm text-gray-400">
                  {selectedMovieData.release_date && (
                    <span className="flex items-center gap-1">
                      📅 {new Date(selectedMovieData.release_date).getFullYear()}
                    </span>
                  )}
                  {selectedMovieData.vote_average > 0 && (
                    <span className="flex items-center gap-1">
                      <span className="text-yellow-400">⭐</span>
                      {selectedMovieData.vote_average.toFixed(1)}/10
                    </span>
                  )}
                </div>
                
                {selectedMovieData.overview && (
                  <p className="text-gray-400 text-sm mt-3 line-clamp-2">
                    {selectedMovieData.overview}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoadingTop6 && (
          <div className="flex flex-col justify-center items-center py-20">
            <Loader2 className="animate-spin text-red-500 mb-4" size={48} />
            <p className="text-gray-400 text-lg">Finding similar movies...</p>
            <p className="text-gray-500 text-sm mt-2">This may take a few seconds</p>
          </div>
        )}

        {/* Top 6 Similar Movies */}
        {!isLoadingTop6 && top6Movies.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-red-500/50 to-transparent"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-center">
                <span className="bg-linear-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">
                  Top 6 Most Similar Movies
                </span>
              </h2>
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-purple-500/50 to-transparent"></div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5 lg:gap-6">
              {top6Movies.map((movie) => {
                const cardData = mapToMovieCard(movie);
                return (
                  <MovieCard
                    key={movie.id}
                    title={cardData.title}
                    imageUrl={cardData.imageUrl}
                    rating={cardData.rating}
                    movieId={cardData.movieId}
                  />
                );
              })}
            </div>

            {/* Load More Button */}
            {selectedMovieName && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingNext6}
                  className="group flex items-center gap-3 px-8 py-4 bg-linear-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 disabled:hover:scale-100"
                >
                  {isLoadingNext6 ? (
                    <>
                      <Loader2 className="animate-spin" size={22} />
                      <span>Loading More...</span>
                    </>
                  ) : showNext6 ? (
                    <>
                      <span>Show Less</span>
                      <ChevronUp size={22} className="group-hover:-translate-y-1 transition-transform" />
                    </>
                  ) : (
                    <>
                      <span>Load More Recommendations</span>
                      <ChevronDown size={22} className="group-hover:translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Next 6 Movies (Ranks 7-12) */}
        {showNext6 && next6Movies.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-purple-500/50 to-transparent"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-center">
                <span className="bg-linear-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  More Recommendations (7-12)
                </span>
              </h2>
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-pink-500/50 to-transparent"></div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5 lg:gap-6">
              {next6Movies.map((movie) => {
                const cardData = mapToMovieCard(movie);
                return (
                  <MovieCard
                    key={movie.id}
                    title={cardData.title}
                    imageUrl={cardData.imageUrl}
                    rating={cardData.rating}
                    movieId={cardData.movieId}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!selectedMovieName && !isLoadingTop6 && (
          <div className="text-center py-20">
            <div className="text-8xl mb-6 animate-bounce">🎬</div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Ready to Discover?
            </h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              Search for any movie above and we'll show you the most similar films using our recommendation engine
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500">
              <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full">
                <span>🎯</span>
                <span>AI-Powered Recommendations</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full">
                <span>🔥</span>
                <span>Discover Hidden Gems</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full">
                <span>⚡</span>
                <span>Instant Results</span>
              </div>
            </div>
          </div>
        )}

        {/* No Results State */}
        {!isLoadingTop6 && selectedMovieName && top6Movies.length === 0 && !error && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😕</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No Similar Movies Found
            </h3>
            <p className="text-gray-400 max-w-md mx-auto">
              We couldn't find recommendations for this movie. Try searching for a different one!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchDisplay;