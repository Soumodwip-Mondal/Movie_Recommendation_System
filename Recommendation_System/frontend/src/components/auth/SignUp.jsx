import React, { useState } from 'react';
import { Check } from 'lucide-react';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [genres, setGenres] = useState([]);

  const genresList = [
    'Action', 'Comedy', 'Drama', 'Fantasy',
    'Mystery', 'Sci-Fi', 'Thriller', 'Adventure'
  ];

  const toggleGenre = (genre) => {
    setGenres(genres.includes(genre)
      ? genres.filter(g => g !== genre)
      : [...genres, genre]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Welcome ${name}! Genres: ${genres.join(', ') || 'None selected'}`);
  };

  return (
    <div className="absolute z-50 min-h-screen bg-gray-800/80 w-full flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-gray-900/60 backdrop-blur-2xl rounded-2xl border border-white/30 p-6">
          {/* Header */}
          <h1 className="text-2xl font-bold text-white mb-1">Create Account</h1>
          <p className="text-gray-400 text-sm mb-6">Join us & pick your genres</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full px-3 py-2 bg-white/5 border border-white/30 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
              required
            />

            {/* Email */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-3 py-2 bg-white/5 border border-white/30 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
              required
            />

            {/* Password */}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-3 py-2 bg-white/5 border border-white/30 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
              required
            />

            {/* Genres */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Genres</label>
              <div className="grid grid-cols-2 gap-2">
                {genresList.map((genre) => (
                  <label
                    key={genre}
                    className="flex items-center p-1.5 bg-white/5 border border-white/30 rounded-md cursor-pointer hover:bg-white/10"
                  >
                    <input
                      type="checkbox"
                      checked={genres.includes(genre)}
                      onChange={() => toggleGenre(genre)}
                      className="hidden"
                    />
                    <div
                      className={`w-4 h-4 border border-white/30 rounded flex items-center justify-center ${genres.includes(genre) ? 'bg-blue-500' : ''
                        }`}
                    >
                      {genres.includes(genre) && <Check size={12} className="text-white" />}
                    </div>
                    <span className="ml-2 text-white text-sm">{genre}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full mt-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-md transition"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-4">
            Already have an account?{' '}
            <span className="text-blue-400 cursor-pointer">Sign in</span>
          </p>
        </div>
      </div>
    </div>
  );
}
