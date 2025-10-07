import React from 'react'
import MovieCard from '../ui/MovieCard'

function Page() {
  const movies = [
    {
      title: "Stranger Things",
      imageUrl: "https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg",
      rating: 8.7
    },
    {
      title: "The Witcher",
      imageUrl: "https://image.tmdb.org/t/p/w500/6Xj6qv9rUVFAGdLx0g2ZY5rEw0L.jpg",
      rating: 8.3
    },
    {
      title: "Money Heist",
      imageUrl: "https://image.tmdb.org/t/p/w500/8fVq3USN3CZ8JdW0CqSFLHqz6EI.jpg",
      rating: 8.5
    },
    {
      title: "Dark",
      imageUrl: "https://image.tmdb.org/t/p/w500/n0XH5c46VZk9iw4C1F1jTjFhe1M.jpg",
      rating: 8.8
    },
  ]

  return (
    <div className='w-full min-h-screen p-4 space-y-8 bg-primary'>
      {/* Section 1 */}
      <section className='w-full'>
        <h1 className='text-white text-xl font-bold mb-4'>Top movies for you :)</h1>
        <div className='w-full flex justify-evenly overflow-x-auto scrollbar-hide'>
          {movies.map((movie, idx) => (
            <MovieCard
              key={idx}
              title={movie.title}
              imageUrl={movie.imageUrl}
              rating={movie.rating}
            />
          ))}
        </div>
      </section>

      {/* Section 2 */}
      <section>
        <h1 className='text-white text-xl font-bold mb-4'>You can also watch :)</h1>
        <div className='flex gap-4 overflow-x-auto justify-evenly scrollbar-hide'>
          {movies.map((movie, idx) => (
            <MovieCard
              key={idx + movies.length}
              title={movie.title}
              imageUrl={movie.imageUrl}
              rating={movie.rating}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Page
