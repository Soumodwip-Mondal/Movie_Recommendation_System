import React, { useState } from 'react'
import HistoryMovieCard from '../ui/HistoryMovieCard'

function GenrePage() {
  // Mock genres
  const genres = ['Action', 'Thriller', 'Drama', 'Sci-Fi', 'Comedy', 'Horror']

  // Mock movies
  const movies = [
    { id: 1, name: 'Inception', rating: 8.8, genres: ['Sci-Fi', 'Thriller'], image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=600&fit=crop', year: '2010' },
    { id: 2, name: 'The Dark Knight', rating: 9.0, genres: ['Action', 'Drama'], image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop', year: '2008' },
    { id: 3, name: 'Interstellar', rating: 8.6, genres: ['Sci-Fi', 'Drama'], image: 'https://images.unsplash.com/photo-1489599849228-ed4dc6900f2c?w=400&h=600&fit=crop', year: '2014' },
    { id: 4, name: 'Pulp Fiction', rating: 8.9, genres: ['Drama', 'Thriller'], image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop', year: '1994' },
    { id: 5, name: 'Matrix', rating: 8.7, genres: ['Sci-Fi', 'Action'], image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop', year: '1999' },
    { id: 6, name: 'Fight Club', rating: 8.8, genres: ['Drama', 'Thriller'], image: 'https://images.unsplash.com/photo-1517604931442-7e0c6cc4de38?w=400&h=600&fit=crop', year: '1999' }
  ]

  const [activeGenre, setActiveGenre] = useState(null)
  const [savedMovies, setSavedMovies] = useState(new Set())

  const toggleSave = (id) => {
    const newSaved = new Set(savedMovies)
    if (newSaved.has(id)) newSaved.delete(id)
    else newSaved.add(id)
    setSavedMovies(newSaved)
  }

  const handleShare = (id) => {
    const movie = movies.find(m => m.id === id)
    console.log('Sharing:', movie?.name)
  }

  const filteredMovies = activeGenre
    ? movies.filter(movie => movie.genres.includes(activeGenre))
    : movies

  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-16 py-10">
      {/* Title */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl font-black mb-2">Browse by Genre</h1>
        <p className="text-gray-400">Select a genre to explore movies</p>
      </div>

      {/* Genre Buttons */}
      <div className="flex flex-wrap gap-3 mb-10 max-w-7xl mx-auto">
        {/* All Button */}
        <button
          onClick={() => setActiveGenre(null)}
          className={`px-6 py-3 rounded-full text-sm font-bold ${
            activeGenre === null
              ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
              : 'bg-gray-800 hover:bg-gray-700'
          }`}
        >
          All
        </button>

        {genres.map((genre, idx) => (
          <button
            key={idx}
            onClick={() => setActiveGenre(genre)}
            className={`px-6 py-3 rounded-full text-sm font-bold ${
              activeGenre === genre
                ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Movies Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <HistoryMovieCard
              key={movie.id}
              movie={movie}
              isSaved={savedMovies.has(movie.id)}
              onSave={toggleSave}
              onShare={handleShare}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <h3 className="text-2xl font-bold mb-2">No movies found</h3>
            <p className="text-gray-400">Try selecting a different genre</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default GenrePage
