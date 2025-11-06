import React from 'react'
import { useAuth } from '../../context/authContext'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'

function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/landing')
  }

  if (!user) return null

  // Mock stats for now
  const stats = {
    totalWatched: 45,
    totalSaved: 12,
    joined: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    genres: [
      { name: 'Action', watched: 75 },
      { name: 'Thriller', watched: 50 },
      { name: 'Drama', watched: 80 },
      { name: 'Sci-Fi', watched: 60 },
      { name: 'Comedy', watched: 40 },
      { name: 'Horror', watched: 25 },
    ]
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-16 py-10">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-10">
        <p className="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-2">
          Welcome Back
        </p>
        <h1 className="text-5xl md:text-6xl font-black mb-2 leading-tight">
          {user.name}
        </h1>
        <p className="text-gray-400 mb-4">{user.email}</p>

        {/* Stats */}
        <div className="flex flex-wrap gap-6 text-sm text-gray-400 mb-6">
          <div>
            <span className="font-semibold text-white">{stats.totalWatched}</span> Movies Watched
          </div>
          <div>
            <span className="font-semibold text-white">{stats.totalSaved}</span> Movies Saved
          </div>
          <div>
            Joined: <span className="font-semibold text-white">{stats.joined}</span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>

      {/* Genre Progress */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.genres.map((genre, idx) => (
          <div
            key={idx}
            className="bg-gray-900 rounded-lg p-5 shadow-md border border-white/10"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">{genre.name}</h2>
              <span className="text-sm text-gray-400">{genre.watched}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#E54B4B]"
                style={{ width: `${genre.watched}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Profile
