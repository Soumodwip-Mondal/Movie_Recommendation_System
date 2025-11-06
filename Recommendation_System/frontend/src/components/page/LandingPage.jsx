import { useState, useEffect } from "react";
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

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate('/', { replace: true });
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
        className="relative min-h-screen w-full text-white flex flex-col justify-center px-10 md:px-20 bg-gradient-to-b from-gray-900 via-gray-900 to-black"
        style={{
          backgroundImage: `url(${movieImage})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 max-w-xl space-y-6 mt-20 md:mt-32">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Unlimited Movies, TV Shows, and More.
          </h1>
          <p className="text-lg text-gray-300">
            Watch anywhere, Watch as you want.
          </p>
          <Button onClick={handleSignupClick}>Get Started</Button>
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
