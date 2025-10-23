import { Menu, Search, User, X } from "lucide-react";
import { useState } from "react";
import Button from "../ui/Button";
export default function LandingPageHeader({ onLoginClick, onSignupClick }) {
  return (
    <header className="h-15 md:h-17 fixed top-0 left-0 w-full z-40 bg-gradient-to-b from-gray-900 via-gray-900/95 to-transparent backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-full py-4">
        <div className="flex-shrink-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
            <span className="text-red-600">CinePulse</span>Flix
          </h1>
        </div>

        <div className="items-center gap-3 sm:gap-6 flex">
          <button
            onClick={onLoginClick}
            className="px-4 py-2 text-white hover:text-gray-300 font-medium transition"
          >
            Sign In
          </button>
          <button onClick={onSignupClick} className="px-4 py-2 text-white hover:text-gray-300 font-medium transition">Sign Up</button>
        </div>
      </div>
    </header>
  );
}