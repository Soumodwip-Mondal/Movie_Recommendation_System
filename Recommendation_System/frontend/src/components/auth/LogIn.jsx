import React, { useState } from "react";
import { Check } from "lucide-react";
import { useAuth } from "../../context/authContext";

export default function LogIn({ onClose, onSwitchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
      if (rememberMe) {
        // token already stored by context; could persist additional data here
      }
      onClose?.();
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm bg-gray-900/70 backdrop-blur-2xl rounded-2xl border border-white/20 p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-lg hover:text-red-400"
        >
          ×
        </button>

        <div className="text-center mb-6">
          <div className="inline-block p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-xl border border-blue-400/20 mb-3">
            🎬
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Welcome Back</h1>
          <p className="text-gray-400 text-sm">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
            required
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center cursor-pointer">
              <div
                className={`w-4 h-4 border border-white/30 rounded flex items-center justify-center mr-2 ${
                  rememberMe ? "bg-blue-500" : "bg-transparent"
                }`}
                onClick={() => setRememberMe(!rememberMe)}
              >
                {rememberMe && <Check size={12} className="text-white" />}
              </div>
              <span className="text-gray-300">Remember me</span>
            </label>
            <a href="#" className="text-blue-400 hover:text-cyan-400 font-medium">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-md transition-transform duration-300 hover:scale-105 active:scale-95 disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-5">
          Don’t have an account?{" "}
          <span
            className="text-blue-400 hover:text-cyan-400 cursor-pointer font-semibold transition"
            onClick={onSwitchToSignup}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
