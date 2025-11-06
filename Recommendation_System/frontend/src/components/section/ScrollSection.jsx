import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MovieCard from '../ui/MovieCard';
// Mark motion as used for certain eslint configs that don't detect JSX usage
void motion;

function ScrollSection({ title, movies }) {
  const scrollRef = useRef(null);
  const [visibleCards, setVisibleCards] = useState(new Set([0, 1, 2]));

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const containerRect = scrollContainer.getBoundingClientRect();
      const cards = scrollContainer.querySelectorAll('[data-card-index]');
      
      const newVisibleCards = new Set(visibleCards);
      
      cards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const index = parseInt(card.getAttribute('data-card-index'));
        
        // Check if card is visible in the scroll container
        const isVisible = 
          cardRect.left < containerRect.right - 50 &&
          cardRect.right > containerRect.left + 50;
        
        if (isVisible) {
          newVisibleCards.add(index);
        }
      });
      
      setVisibleCards(newVisibleCards);
    };

    // Initial check
    handleScroll();
    
    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 30,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <section className="w-full">
      <motion.h2 
        className="text-xl sm:text-2xl lg:text-3xl text-white font-bold mb-4 sm:mb-6 text-center sm:text-left"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.h2>
      
      <div className="relative group/section">
        <div 
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 lg:gap-5 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
        >
          {movies.map((movie, idx) => (
            <motion.div
              key={idx}
              data-card-index={idx}
              className="flex-shrink-0 w-36 sm:w-40 md:w-44 lg:w-48"
              initial="hidden"
              animate={visibleCards.has(idx) ? "visible" : "hidden"}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              <MovieCard
                title={movie.title}
                imageUrl={movie.imageUrl}
                rating={movie.rating}
                movieId={movie.movieId}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx="true">{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scroll-smooth {
          scroll-behavior: smooth;
        }
      `}</style>
    </section>
  );
}

export default ScrollSection;