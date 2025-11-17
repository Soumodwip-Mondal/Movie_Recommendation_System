import { Menu, Search, User, X } from "lucide-react";
import { useState } from "react";
import SearchBar from "../ui/SearchBar"; 
import {Link, NavLink} from 'react-router-dom'

export default function Header() {
  const [showSearch, setShowSearch] = useState(false); 
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Genres", href: "/genres" },
    { label: "Top Rated", href: "/top-rated" },
    { label: "My List", href: "/mylist" },
  ];

  return (
    <>
      {/* Header Section */}
      <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-gray-900 via-gray-900/95 to-transparent backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-14 md:h-16">
          
          {/*  Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
                <span className="text-red-600">Cine</span>Pulse
              </h1>
            </Link>
          </div>

          {/* 🌐 Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-gray-300 flex-1 mx-12">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                to={link.href} 
                className="text-sm font-medium hover:text-white transition-colors duration-200 relative group"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* 🎯 Right Actions */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* 🔍 Search Toggle Button */}
            <button
              onClick={() => setShowSearch((prev) => !prev)}
              className="p-2 px-3 hover:bg-white/10 rounded-lg transition-all duration-200 text-gray-300 hover:text-white flex items-center gap-1"
            >
              {showSearch ? (
                <>
                  <X size={20} className="m-1.5 text-red-500" /> Close
                </>
              ) : (
                <>
                  <Search size={20} className="m-1.5 text-gray-300" /> Search
                </>
              )}
            </button>

            {/* 👤 User Profile */}
            <button className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 text-gray-300 hover:text-white">
              <User size={20} />
              <Link to='/profile' className="text-sm font-medium">My Space</Link>
            </button>
          </div>
        </div>

        {/* 🔽 Search Bar Slide Section */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-visible ${
            showSearch ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 sm:px-6 lg:px-8 py-4 relative z-[60]">
            <SearchBar />
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-14 md:h-16"></div>
    </>
  );
}