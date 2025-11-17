import { useEffect, useState } from 'react';

function Loader() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary">
      {/* Background animated gradient circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-bermuda/10 rounded-full blur-3xl animate-pulse-slow-delayed"></div>
      </div>

      {/* Main loader content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Film reel loader */}
        <div className="relative">
          {/* Outer ring */}
          <div className="w-32 h-32 border-4 border-accent/20 rounded-full animate-spin-slow"></div>
          
          {/* Inner spinning film reel */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 border-4 border-t-accent border-r-bermuda border-b-accent/50 border-l-bermuda/50 rounded-full animate-spin"></div>
          </div>

          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg 
              className="w-12 h-12 text-accent animate-pulse" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M10,16.5L16,12L10,7.5V16.5Z" />
            </svg>
          </div>
        </div>

        {/* Loading text */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-textLight animate-fade-in">
            Loading Movies
            <span className="inline-block w-12 text-accent">{dots}</span>
          </h2>
          <p className="text-textMuted text-sm animate-fade-in-delayed">
            Preparing your cinematic experience
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-1 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-linear-to-r from-accent via-bermuda to-accent animate-progress"></div>
        </div>
      </div>
    </div>
  );
}

export default Loader;
