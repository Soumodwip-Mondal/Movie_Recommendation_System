import React, { useState } from "react";
import { Check } from "lucide-react";
import { useAuth } from "../../context/authContext";

export default function SignUp({ onClose, onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const genresList = [
    "Action", "Comedy", "Drama", "Fantasy",
    "Mystery", "Sci-Fi", "Thriller", "Adventure"
  ];

  const toggleGenre = (genre) => {
    setGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('=== SIGNUP FORM SUBMITTED ===');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Password length:', password?.length);
    console.log('Genres:', genres);
    
    setError("");
    setLoading(true);
    try {
      console.log('Calling signup function...');
      await signup({ name, email, password, genres });
      console.log('Signup successful! Closing modal...');
      onClose?.();
    } catch (err) {
      console.error('Signup failed:', err);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      setError(err.message || "Signup failed. Try a different email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm bg-gray-900/70 backdrop-blur-2xl rounded-2xl border border-white/20 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-lg hover:text-red-400"
        >
          ×
        </button>

        <h1 className="text-2xl font-bold text-white mb-1">Create Account</h1>
        <p className="text-gray-400 text-sm mb-6">Join us & pick your genres</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            className="w-full px-3 py-2 bg-white/5 border border-white/30 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-3 py-2 bg-white/5 border border-white/30 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-3 py-2 bg-white/5 border border-white/30 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            required
          />

          {/* Genre selection */}
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
                    className={`w-4 h-4 border border-white/30 rounded flex items-center justify-center ${
                      genres.includes(genre) ? "bg-blue-500" : ""
                    }`}
                  >
                    {genres.includes(genre) && <Check size={12} className="text-white" />}
                  </div>
                  <span className="ml-2 text-white text-sm">{genre}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-md transition disabled:opacity-60"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-4">
          Already have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={onSwitchToLogin}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}
