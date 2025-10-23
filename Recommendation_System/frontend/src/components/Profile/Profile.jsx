import React from 'react'

function Profile() {
  // Mock user data
  const mockUser = {
    userName: 'Alex',
    email: 'alex@example.com',
    joined: 'January 15, 2023',
    totalWatched: 45,
    totalSaved: 12,
    genres: [
      { name: 'Action', watched: 75 },
      { name: 'Thriller', watched: 50 },
      { name: 'Drama', watched: 80 },
      { name: 'Sci-Fi', watched: 60 },
      { name: 'Comedy', watched: 40 },
      { name: 'Horror', watched: 25 },
    ]
  }

  const user = mockUser

  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-16 py-10">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-10">
        <p className="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-2">
          Welcome Back
        </p>
        <h1 className="text-5xl md:text-6xl font-black mb-2 leading-tight">
          {user.userName}
        </h1>
        <p className="text-gray-400 mb-4">{user.email}</p>

        {/* Stats */}
        <div className="flex flex-wrap gap-6 text-sm text-gray-400">
          <div>
            <span className="font-semibold text-white">{user.totalWatched}</span> Movies Watched
          </div>
          <div>
            <span className="font-semibold text-white">{user.totalSaved}</span> Movies Saved
          </div>
          <div>
            Joined: <span className="font-semibold text-white">{user.joined}</span>
          </div>
        </div>
      </div>

      {/* Genre Progress */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {user.genres.map((genre, idx) => (
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
