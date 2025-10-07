import React from 'react'

function MovieCard({ title, imageUrl, rating }) {
  return (
    <div className="w-48 h-80 bg-secondary rounded-lg overflow-hidden shadow-lg cursor-pointer transform transition duration-300 hover:scale-105">
      {/* Movie Poster */}
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-64 object-cover"
      />

      {/* Movie Info */}
      <div className="p-3">
        <h2 className="text-white font-semibold text-sm truncate">{title}</h2>
        {rating && (
          <p className="text-yellow-400 text-sm mt-1">{`⭐ ${rating}`}</p>
        )}
      </div>
    </div>
  )
}

export default MovieCard
