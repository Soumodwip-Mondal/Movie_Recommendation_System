import React from "react";
import LandingPageHeader from "../header/LandingPageHeader";
import movieImage from "../../assets/movieImage.png";

function LandingPage() {
  return (
    <div
      className="relative min-h-screen w-full text-white flex flex-col justify-center px-10 md:px-20 bg-gradient-to-b from-gray-900 via-gray-900 to-black"
      style={{
        backgroundImage: `url(${movieImage})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Header */}
      <LandingPageHeader />

      {/* Hero Text */}
      <div className="relative z-10 max-w-xl space-y-6 mt-20 md:mt-32">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
          Unlimited Movies, TV Shows, and More.
        </h1>
        <p className="text-lg text-gray-300">
          Watch anywhere. Cancel anytime.
        </p>
        <button className="px-8 py-3 bg-red-600 hover:bg-red-700 font-semibold rounded-md transition-all duration-300 shadow-lg hover:shadow-red-600/50">
          Login / Signup
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
