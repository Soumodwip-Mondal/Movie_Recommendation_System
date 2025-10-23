import React, { useState } from "react";
import { Star, Play, Heart, Share2 } from "lucide-react";

function HistoryMovieCard({ movie, isSaved, onSave, onShare }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const handleSave = () => {
    setIsLiking(true);
    onSave(movie.id);
    setTimeout(() => setIsLiking(false), 500);
  };

  return (
    <div
      className="group relative bg-gray-900 rounded-xl shadow-xl border border-white/15 overflow-hidden hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Poster */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={movie.image}
          alt={movie.name}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />

        {/* Overlay Play Button */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button className="bg-[#E54B4B] hover:bg-[#d14040] text-white p-3 rounded-full shadow-md transition-all duration-200">
            <Play size={20} fill="white" />
          </button>
        </div>

        {/* Like Button */}
        <button
          onClick={handleSave}
          className="absolute top-2 right-2 p-2 bg-black/40 hover:bg-black/60 rounded-full transition-all duration-300"
        >
          <Heart
            size={18}
            className={
              isSaved ? "fill-[#E54B4B] text-[#E54B4B]" : "text-white"
            }
          />
        </button>

        {/* Rating Badge */}
        <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded-md text-xs font-bold text-yellow-400 flex items-center gap-1">
          <Star size={12} /> {movie.rating}
        </div>
      </div>

      {/* Info Section */}
      <div className="p-3 flex flex-col gap-2">
        <h3 className="text-white font-semibold text-sm truncate">
          {movie.name}
        </h3>

        {/* Genres */}
        <div className="flex gap-2 flex-wrap text-xs text-gray-300">
          {movie.genres?.slice(0, 2).map((genre, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 bg-[#E54B4B]/20 text-[#E54B4B] rounded-full border border-[#E54B4B]/30"
            >
              {genre}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between mt-2">
          <button
            onClick={handleSave}
            className={`flex items-center justify-center gap-1 text-xs font-semibold rounded-md px-3 py-1.5 transition-all duration-300 ${
              isSaved
                ? "bg-[#E54B4B] text-white"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            <Heart size={14} className={isSaved ? "fill-current" : ""} />
            {isSaved ? "Saved" : "Save"}
          </button>

          <button
            onClick={() => onShare(movie.id)}
            className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-md text-xs bg-white/10 hover:bg-[#E54B4B]/20 text-white transition-all duration-300"
          >
            <Share2 size={14} />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}

export default HistoryMovieCard;
