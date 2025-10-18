import React from "react";
import LandingPageHeader from "../header/LandingPageHeader";
import movieImage from "../../assets/movieImage.png";
import Button from "../ui/Button";
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
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 max-w-xl space-y-6 mt-20 md:mt-32">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
          Unlimited Movies, TV Shows, and More.
        </h1>
        <p className="text-lg text-gray-300">
          Watch anywhere, Watch as you want.
        </p>
        <Button/>
      </div>
    </div>
  );
}

export default LandingPage;
