import React, { useState } from 'react';
import { Heart, Play } from 'lucide-react';
import { useAuth } from '../../context/authContext';
import { apiFetch } from '../../lib/api';

function MovieCard({ title, imageUrl, rating, movieId }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const { token } = useAuth();

  const handlePlayClick = () => {
    // Open a YouTube search for the movie trailer in a new tab immediately (avoid popup blockers)
    const query = `${title || ''} trailer`.trim();
    const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    window.open(youtubeUrl, '_blank', 'noopener,noreferrer');

    // Fire-and-forget: record watch history if possible (do not block the new tab)
    try {
      if (movieId) {
        apiFetch('/api/user/history/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Authorization header is auto-injected by apiFetch when available
          },
          body: JSON.stringify({ tmdb_movie_id: movieId }),
        }).catch(() => {});
      }
    } catch (e) {
      // Ignore history failures to not affect UX
      console.error('Failed to add to history', e);
    }
  };

  return (
    <div className="group w-full h-60 sm:h-64 md:h-72 bg-gray-900 rounded-xl shadow-2xl border border-white/15 overflow-hidden transform transition-all duration-300 hover:shadow-2xl flex flex-col">
      {/* Image Section */}
      <div className="relative h-32 sm:h-36 md:h-48 overflow-hidden bg-gray-800">
        <img
          src={imageUrl || "https://via.placeholder.com/224x192?text=No+Image"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button onClick={handlePlayClick} className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-all duration-200">
            <Play size={24} fill="white" />
          </button>
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorited(!isFavorited)}
          className="absolute top-2 right-2 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full transition-all duration-200 z-10"
        >
          <Heart
            size={18}
            className={isFavorited ? 'fill-red-500 text-red-500' : 'text-white'}
          />
        </button>
      </div>

      {/* Info Section */}
      <div className="flex-1 p-2 sm:p-3 flex flex-col justify-between bg-gradient-to-b from-gray-800 to-gray-900">
        <h2 className="text-white font-semibold text-xs sm:text-sm line-clamp-2">
          {title}
        </h2>
        
        {rating && (
          <div className="flex items-center gap-1 text-yellow-400 font-semibold text-xs sm:text-sm">
            <span>⭐</span>
            <span>{rating}/10</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieCard;