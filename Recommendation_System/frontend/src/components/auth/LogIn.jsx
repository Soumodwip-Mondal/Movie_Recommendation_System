import React, { useState } from 'react';
import { Check } from 'lucide-react';

export default function LogIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Welcome back, ${email}!`);
  };

  return (
    <div className="absolute z-50 min-h-screen bg-gray-900/80 w-full flex items-center justify-center p-4">
      {/* Background blur circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 -right-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-sm relative z-10">
        <div className="bg-gray-800/40 backdrop-blur-2xl rounded-2xl border border-white/20 p-6 shadow-xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-block p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-xl border border-blue-400/20 mb-3">
              🎬
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Welcome Back</h1>
            <p className="text-gray-400 text-sm">Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                required
              />
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                required
              />
            </div>

            {/* Remember Me + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer">
                <div
                  className={`w-4 h-4 border border-white/30 rounded flex items-center justify-center mr-2 ${rememberMe ? 'bg-blue-500' : 'bg-transparent'}`}
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

            {/* Button */}
            <button
              type="submit"
              className="w-full mt-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-md transition-transform duration-300 hover:scale-105 active:scale-95"
            >
              Sign In
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-400 text-sm mt-5">
            Don’t have an account?{' '}
            <span className="text-blue-400 hover:text-cyan-400 cursor-pointer font-semibold transition">
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
