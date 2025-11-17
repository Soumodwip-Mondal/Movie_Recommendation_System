import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import LandingPageHeader from "../header/LandingPageHeader";
import Footer from "../footer/Footer";
import SignUp from "../auth/SignUp";
import LogIn from "../auth/LogIn";
import movieImage from "../../assets/movieImage.png";
import Button from "../ui/Button";

function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  // Collect all jpg/png assets for slideshow (Vite eager import)
  const slideshowImages = useMemo(() => {
    const modules = import.meta.glob("../../assets/*.{png,jpg}", {
      eager: true,
      import: "default",
    });
    const urls = Object.values(modules);
    // Ensure we always have at least one image
    return urls.length ? urls : [movieImage];
  }, []);

  const [current, setCurrent] = useState(0);

  // Rotate images every 5 seconds
  useEffect(() => {
    if (!slideshowImages.length) return;
    const id = setInterval(() => {
      setCurrent((i) => (i + 1) % slideshowImages.length);
    }, 5000);
    return () => clearInterval(id);
  }, [slideshowImages.length]);

  // Redirect if already logged in: restore last protected route if available
  useEffect(() => {
    if (token) {
      let to = '/';
      try {
        const last = localStorage.getItem('cinepulse.lastRoute');
        if (last && last.startsWith('/')) to = last;
      } catch {}
      navigate(to, { replace: true });
    }
  }, [token, navigate]);

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowSignup(false);
  };

  const handleSignupClick = () => {
    setShowSignup(true);
    setShowLogin(false);
  };

  const handleClose = () => {
    setShowLogin(false);
    setShowSignup(false);
  };

  return (
    <div className="relative min-h-screen">
      <LandingPageHeader 
        onLoginClick={handleLoginClick}
        onSignupClick={handleSignupClick}
      />

      {/* Hero Section */}
      <div
        className="relative min-h-screen w-full text-white flex flex-col justify-center px-10 md:px-20 bg-gradient-to-b from-primary via-secondary to-primary overflow-hidden"
      >
        {/* Background slideshow */}
        <div className="absolute inset-0">
          {slideshowImages.map((src, i) => (
            <img
              key={src}
              src={src}
              alt="background"
              aria-hidden={i !== current}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ${i === current ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
        </div>

        {/* Dark overlays */}
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        {/* Accent ambient glow removed */}

        <div className="relative z-10 max-w-2xl space-y-6 mt-20 md:mt-32">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight animate-slide-up">
            Unlimited Movies, TV Shows, and More.
          </h1>
          <p className="text-lg text-gray-300 animate-fade-in-delayed">
            Watch anywhere. Watch the way you want.
          </p>
          <div className="animate-scale-in">
            <Button onClick={handleSignupClick}>Get Started</Button>
          </div>
        </div>
      </div>

      <Footer />

      {/* Modals */}
      {showLogin && (
        <LogIn
          onClose={handleClose}
          onSwitchToSignup={handleSignupClick}
        />
      )}

      {showSignup && (
        <SignUp
          onClose={handleClose}
          onSwitchToLogin={handleLoginClick}
        />
      )}
    </div>
  );
}

export default LandingPage;
