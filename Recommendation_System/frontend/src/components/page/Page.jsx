import React from 'react'
import ScrollSection from '../section/ScrollSection'
import MovieCard from '../ui/MovieCard'

function Page() {
  const movies = [
    { title: "Stranger Things", imageUrl: "https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg", rating: 8.7 },
    { title: "The Witcher", imageUrl: "https://image.tmdb.org/t/p/w500/6Xj6qv9rUVFAGdLx0g2ZY5rEw0L.jpg", rating: 8.3 },
    { title: "Money Heist", imageUrl: "https://image.tmdb.org/t/p/w500/8fVq3USN3CZ8JdW0CqSFLHqz6EI.jpg", rating: 8.5 },
    { title: "Dark", imageUrl: "https://image.tmdb.org/t/p/w500/n0XH5c46VZk9iw4C1F1jTjFhe1M.jpg", rating: 8.8 },
    { title: "Breaking Bad", imageUrl: "https://image.tmdb.org/t/p/w500/ggJZJ60h3_hVlzN5sZXWe3bI9Tf.jpg", rating: 9.5 },
    { title: "The Crown", imageUrl: "https://image.tmdb.org/t/p/w500/iI5sRk8B3bLYd9E3uAb2i8hXXEz.jpg", rating: 8.6 }
  ]

  const otherMovies = [
    { title: "The Crown", imageUrl: "https://image.tmdb.org/t/p/w500/iI5sRk8B3bLYd9E3uAb2i8hXXEz.jpg", rating: 8.6 },
    { title: "Ozark", imageUrl: "https://image.tmdb.org/t/p/w500/qqHkuKmBQ4fDFfpH1GI7UYKyKXI.jpg", rating: 8.5 },
    { title: "Sherlock", imageUrl: "https://image.tmdb.org/t/p/w500/jHEEu7tGS3dHv8ySYXZCT8i7VLz.jpg", rating: 9.1 },
    { title: "Westworld", imageUrl: "https://image.tmdb.org/t/p/w500/f8Z0uThNKPcv8bWD94rJ8ScS4fH.jpg", rating: 8.5 },
    { title: "Peaky Blinders", imageUrl: "https://image.tmdb.org/t/p/w500/gHjXvzJQu04yPgoDZl3Yl1cLr5D.jpg", rating: 8.8 },
    { title: "Chernobyl", imageUrl: "https://image.tmdb.org/t/p/w500/rX8qS1F1Wq8aHQQxD7PV2YlPLVh.jpg", rating: 9.3 },
    { title: "Mindhunter", imageUrl: "https://image.tmdb.org/t/p/w500/N2GBZX8Oj1rLYLEQ2j9rh0LwBRy.jpg", rating: 8.7 },
    { title: "The Marvelous Mrs. Maisel", imageUrl: "https://image.tmdb.org/t/p/w500/w16bGl8KtaYl84UNWc2y4cYjCgF.jpg", rating: 8.7 },
    { title: "Succession", imageUrl: "https://image.tmdb.org/t/p/w500/mUlZnNPVMv3hVl3wGFd9VfI0oKV.jpg", rating: 8.9 },
    { title: "The Last of Us", imageUrl: "https://image.tmdb.org/t/p/w500/igXrEjJLJXBRLmMeJ0Dv8D1YBLX.jpg", rating: 8.8 },
    { title: "Dune", imageUrl: "https://image.tmdb.org/t/p/w500/d5iIlW_sXMf1erKGLQDnkeLBIWO.jpg", rating: 8.0 },
    { title: "The Mandalorian", imageUrl: "https://image.tmdb.org/t/p/w500/eU4rFReznqHeGmt1tyAGaG8LeIl.jpg", rating: 8.7 },
    { title: "Wednesday", imageUrl: "https://image.tmdb.org/t/p/w500/9PFonBhy4cQSXjn86c7IVxwow4b.jpg", rating: 8.1 },
    { title: "The Witcher: Blood Origin", imageUrl: "https://image.tmdb.org/t/p/w500/tR9G1J8WLbhE2UdBMCWRB5cVv6K.jpg", rating: 7.2 },
    { title: "House of the Dragon", imageUrl: "https://image.tmdb.org/t/p/w500/z2yahl2uefxDCl2jqwG7ie949tc.jpg", rating: 8.5 },
  ]

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black">
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12">
        <ScrollSection title="Top movies for you :)" movies={movies} />
        <ScrollSection title="You can also watch :)" movies={movies} />

        {/* ✅ Responsive Grid Section */}
        <section className="w-full">
          <h2 className="text-xl sm:text-2xl lg:text-3xl text-white font-bold mb-4 sm:mb-6 text-center sm:text-left">
            Other Movies
          </h2>
          <div
            className="
              grid 
              grid-cols-2              /* 2 cards per row on mobile */
              sm:grid-cols-3           /* 3 on small screens */
              md:grid-cols-4           /* 4 on medium screens */
              lg:grid-cols-5           /* 5 on large screens */
              xl:grid-cols-6           /* 6 on extra large screens */
              gap-4 sm:gap-5 lg:gap-6  /* spacing between cards */
              w-full
            "
          >
            {otherMovies.map((movie, idx) => (
              <MovieCard
                key={idx}
                title={movie.title}
                imageUrl={movie.imageUrl}
                rating={movie.rating}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Page