import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Heart, Play } from 'lucide-react'

function MovieCard({ title, imageUrl, rating }) {
  const [isFavorited, setIsFavorited] = useState(false)

  return (
    <div className="group w-40 sm:w-44 md:w-48 h-60 sm:h-64 md:h-72 bg-gray-900 rounded-xl shadow-2xl border border-white/15 overflow-hidden transform transition-all duration-300 hover:shadow-2xl flex flex-col flex-shrink-0">
      {/* Image Section */}
      <div className="relative h-32 sm:h-36 md:h-48 overflow-hidden bg-gray-800 ">
        <img
          src={imageUrl || "https://via.placeholder.com/224x192?text=No+Image"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-all duration-200">
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
        <h2 className="text-white font-semibold text-xs sm:text-sm line-clamp-2">{title}</h2>
        
        {rating && (
          <div className="flex items-center gap-1 text-yellow-400 font-semibold text-xs sm:text-sm">
            <span>⭐</span>
            <span>{rating}/10</span>
          </div>
        )}
      </div>
    </div>
  )
}
export default MovieCard
