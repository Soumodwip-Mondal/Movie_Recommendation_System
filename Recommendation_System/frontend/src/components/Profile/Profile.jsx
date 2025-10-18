import React, { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import HistoryMovieCard from '../ui/HistoryMovieCard'

function Profile() {
    const [savedMovies, setSavedMovies] = useState(new Set())
    const [activeGenre, setActiveGenre] = useState(null)

    // Mock Data
    const mockUser = {
        userName: 'Alex',
        genres: ['Action', 'Thriller', 'Sci-Fi', 'Drama']
    }

    const mockHistory = [
        { id: 1, name: 'Inception', rating: 8.8, genres: ['Sci-Fi', 'Thriller'], image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=600&fit=crop', year: '2010' },
        { id: 2, name: 'The Dark Knight', rating: 9.0, genres: ['Action', 'Drama'], image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop', year: '2008' },
        { id: 3, name: 'Interstellar', rating: 8.6, genres: ['Sci-Fi', 'Drama'], image: 'https://images.unsplash.com/photo-1489599849228-ed4dc6900f2c?w=400&h=600&fit=crop', year: '2014' },
        { id: 4, name: 'Pulp Fiction', rating: 8.9, genres: ['Drama', 'Thriller'], image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop', year: '1994' },
        { id: 5, name: 'Matrix', rating: 8.7, genres: ['Sci-Fi', 'Action'], image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop', year: '1999' },
        { id: 6, name: 'Fight Club', rating: 8.8, genres: ['Drama', 'Thriller'], image: 'https://images.unsplash.com/photo-1517604931442-7e0c6cc4de38?w=400&h=600&fit=crop', year: '1999' }
    ]

    const user = mockUser
    const history = mockHistory

    const toggleSave = (id) => {
        const newSaved = new Set(savedMovies)
        if (newSaved.has(id)) newSaved.delete(id)
        else newSaved.add(id)
        setSavedMovies(newSaved)
    }

    const handleShare = (id) => {
        const movie = history.find(m => m.id === id)
        console.log('Sharing:', movie?.name)
    }

    const filteredHistory = activeGenre
        ? history.filter(movie => movie.genres.includes(activeGenre))
        : history

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white overflow-hidden">
            {/* Header Section */}
            <div className="relative z-10">
                <div className="px-6 md:px-16 pt-16 pb-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Welcome Text */}
                        <div className="mb-8">
                            <p className="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-2">Welcome Back</p>
                            <h1 className="text-7xl md:text-8xl font-black mb-4 leading-tight">
                                {user.userName}
                            </h1>
                            <p className="text-2xl text-gray-400 font-light">What's your vibe today?</p>
                        </div>

                        {/* Genre Selector */}
                        <div className="flex flex-wrap gap-3 mt-10">
                            {/* All Button */}
                            <button
                                onClick={() => setActiveGenre(null)}
                                className={`group relative px-6 py-3 rounded-full text-sm font-bold overflow-hidden transition-all duration-300 hover:scale-105 ${
                                    activeGenre === null
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                                        : ''
                                }`}
                            >
                                <div className={`absolute inset-0 transition-opacity duration-300 ${activeGenre === null ? 'opacity-0' : 'opacity-100'}`}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute inset-0 bg-gray-800/50 backdrop-blur-sm"></div>
                                </div>
                                <span className="relative flex items-center gap-2">
                                    All
                                </span>
                            </button>

                            {user.genres && user.genres.map((genre, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveGenre(genre)}
                                    className={`group relative px-6 py-3 rounded-full text-sm font-bold overflow-hidden transition-all duration-300 hover:scale-105 ${
                                        activeGenre === genre
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                                            : ''
                                    }`}
                                >
                                    <div className={`absolute inset-0 transition-opacity duration-300 ${activeGenre === genre ? 'opacity-0' : 'opacity-100'}`}>
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="absolute inset-0 bg-gray-800/50 backdrop-blur-sm"></div>
                                    </div>
                                    <span className="relative flex items-center gap-2">
                                        {genre}
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Movies Section */}
            <div className="relative z-10 px-6 md:px-16 pb-20">
                <div className="max-w-7xl mx-auto">
                    {/* Section Title */}
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-black mb-2">Continue Watching</h2>
                            <p className="text-gray-400">{filteredHistory.length} movies available</p>
                        </div>
                    </div>

                    {/* Grid */}
                    {filteredHistory.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredHistory.map((movie) => (
                                <HistoryMovieCard
                                    key={movie.id}
                                    movie={movie}
                                    isSaved={savedMovies.has(movie.id)}
                                    onSave={toggleSave}
                                    onShare={handleShare}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="text-6xl mb-4">🎬</div>
                            <h3 className="text-2xl font-bold mb-2">No movies found</h3>
                            <p className="text-gray-400">Try selecting a different genre</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile
