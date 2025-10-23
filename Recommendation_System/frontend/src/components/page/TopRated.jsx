import React from 'react'
import { Star } from 'lucide-react'

// Mock top-rated movies
const topRatedMovies = [
  { id: 1, name: 'Breaking Bad', rating: 9.5, image: 'https://image.tmdb.org/t/p/w500/ggJZJ60h3_hVlzN5sZXWe3bI9Tf.jpg' },
  { id: 2, name: 'Chernobyl', rating: 9.3, image: 'https://image.tmdb.org/t/p/w500/rX8qS1F1Wq8aHQQxD7PV2YlPLVh.jpg' },
  { id: 3, name: 'Sherlock', rating: 9.1, image: 'https://image.tmdb.org/t/p/w500/jHEEu7tGS3dHv8ySYXZCT8i7VLz.jpg' },
  { id: 4, name: 'Dark', rating: 8.8, image: 'https://image.tmdb.org/t/p/w500/n0XH5c46VZk9iw4C1F1jTjFhe1M.jpg' },
  { id: 5, name: 'The Last of Us', rating: 8.8, image: 'https://image.tmdb.org/t/p/w500/igXrEjJLJXBRLmMeJ0Dv8D1YBLX.jpg' },
  { id: 6, name: 'Stranger Things', rating: 8.7, image: 'https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg' }
]

function TopRated() {
  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-16 py-10">
      {/* Title */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl font-black mb-2">Top Rated</h1>
        <p className="text-gray-400">Check out the highest-rated movies by viewers</p>
      </div>

      {/* Movies Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {topRatedMovies.map((movie) => (
          <div
            key={movie.id}
            className="bg-gray-900 rounded-lg overflow-hidden border border-white/10 shadow-md"
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
            </div>
            <div className="p-3">
              <h2 className="text-white font-semibold text-sm truncate">{movie.name}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopRated
