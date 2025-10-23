import React, { useState } from 'react'
import { Star, Heart } from 'lucide-react'

// Mock saved movies
const savedMoviesMock = [
  { id: 1, name: 'Breaking Bad', rating: 9.5, image: 'https://image.tmdb.org/t/p/w500/ggJZJ60h3_hVlzN5sZXWe3bI9Tf.jpg' },
  { id: 2, name: 'Chernobyl', rating: 9.3, image: 'https://image.tmdb.org/t/p/w500/rX8qS1F1Wq8aHQQxD7PV2YlPLVh.jpg' },
  { id: 3, name: 'Sherlock', rating: 9.1, image: 'https://image.tmdb.org/t/p/w500/jHEEu7tGS3dHv8ySYXZCT8i7VLz.jpg' },
  { id: 4, name: 'Dark', rating: 8.8, image: 'https://image.tmdb.org/t/p/w500/n0XH5c46VZk9iw4C1F1jTjFhe1M.jpg' },
]

function MyList() {
  const [savedMovies, setSavedMovies] = useState(savedMoviesMock)

  const handleRemove = (id) => {
    setSavedMovies(savedMovies.filter(movie => movie.id !== id))
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-16 py-10">
      {/* Title */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl font-black mb-2">My List</h1>
        <p className="text-gray-400">All the movies you’ve saved</p>
      </div>

      {/* Saved Movies Grid */}
      {savedMovies.length > 0 ? (
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {savedMovies.map((movie) => (
            <div
              key={movie.id}
              className="bg-gray-900 rounded-lg overflow-hidden border border-white/10 shadow-md relative"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={movie.image}
                  alt={movie.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded-md text-xs font-bold text-yellow-400 flex items-center gap-1">
                  <Star size={12} /> {movie.rating}
                </div>
                {/* Saved Indicator */}
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-[#E54B4B] px-2 py-1 rounded-md text-xs font-semibold">
                  <Heart size={12} /> Saved
                </div>
              </div>
              <div className="p-3 flex justify-between items-center">
                <h2 className="text-white font-semibold text-sm truncate">{movie.name}</h2>
                <button
                  onClick={() => handleRemove(movie.id)}
                  className="text-red-600 font-bold hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-2xl font-bold mb-2">No movies in your list</h3>
          <p className="text-gray-400">Add movies to your list to watch later</p>
        </div>
      )}
    </div>
  )
}

export default MyList
