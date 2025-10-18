import React, { useState } from 'react'
import { Star, Play, Heart, Share2, Clock, TrendingUp } from 'lucide-react'

function HistoryMovieCard({ movie, isSaved, onSave, onShare }) {
    const [isHovered, setIsHovered] = useState(false)
    const [isLiking, setIsLiking] = useState(false)

    const handleSave = () => {
        setIsLiking(true)
        onSave(movie.id)
        setTimeout(() => setIsLiking(false), 600)
    }

    return (
        <div
            className="group cursor-pointer h-full bg-gray-800 rounded-xl shadow-2xl border border-white/10 overflow-hidden transition-all duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Poster */}
            <div className="relative h-64 overflow-hidden rounded-t-xl">
                <img
                    src={movie.image}
                    alt={movie.name}
                    className={`w-full h-full object-cover transition-transform duration-300 ${
                        isHovered ? 'scale-105' : 'scale-100'
                    }`}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-transform duration-200">
                        <Play size={24} fill="white" />
                    </button>
                </div>

                {/* Favorite Button */}
                <button
                    onClick={handleSave}
                    className="absolute top-2 right-2 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full transition-all duration-200 z-10"
                >
                    <Heart
                        size={18}
                        className={isSaved ? 'fill-red-500 text-red-500' : 'text-white'}
                    />
                </button>

                {/* Year & Rating */}
                <div className="absolute top-2 left-2 flex flex-col gap-2">
                    <span className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/10">
                        {movie.year}
                    </span>
                    <span className="px-3 py-1 rounded-full flex items-center gap-1 text-yellow-400 font-bold bg-yellow-500/80">
                        <Star className="w-4 h-4" /> {movie.rating}
                    </span>
                </div>
            </div>

            {/* Info Section */}
            <div className="p-3 flex flex-col justify-between h-36">
                <h3 className="font-black text-lg line-clamp-2">{movie.name}</h3>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mt-2">
                    {movie.genres.slice(0, 3).map((genre, idx) => (
                        <span
                            key={idx}
                            className="text-xs px-3 py-1 bg-gradient-to-r from-purple-600/40 to-pink-600/40 border border-purple-500/50 rounded-full text-gray-200"
                        >
                            {genre}
                        </span>
                    ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-400 mt-2">
                    <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" /> <span>Popular</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> <span>2h 28m</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-3">
                    <button
                        onClick={handleSave}
                        className={`flex-1 p-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                            isSaved
                                ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg'
                                : 'bg-gray-700 hover:bg-gray-600 text-white'
                        }`}
                    >
                        <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                        <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
                        {isLiking && <div className="absolute inset-0 bg-white/20 rounded-lg animate-pulse"></div>}
                    </button>

                    <button
                        onClick={() => onShare(movie.id)}
                        className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default HistoryMovieCard
