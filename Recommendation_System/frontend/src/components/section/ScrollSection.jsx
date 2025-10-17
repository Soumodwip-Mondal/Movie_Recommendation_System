import React, { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import MovieCard from '../ui/MovieCard'

function ScrollSection({ title, movies }) {
  const ref = useRef(null)

  const scroll = (direction) => {
    const scrollAmount = 300
    if (direction === 'left') {
      ref.current.scrollLeft -= scrollAmount
    } else {
      ref.current.scrollLeft += scrollAmount
    }
  }

  return (
    <section className="w-full">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        {/* Title on Left */}
        <h2 className="text-xl sm:text-2xl lg:text-3xl text-white font-bold">
          {title}
        </h2>

        {/* Chevron Buttons on Right */}
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 bg-gray-800 hover:bg-red-600 text-white rounded-full transition-all duration-200"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 bg-gray-800 hover:bg-red-600 text-white rounded-full transition-all duration-200"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Scrollable Movie Row */}
      <div
        ref={ref}
        className="w-full flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-2"
      >
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
  )
}

export default ScrollSection
