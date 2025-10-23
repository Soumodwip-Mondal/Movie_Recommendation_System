import { Menu, Search, User, X } from "lucide-react";
import { useState } from "react";
import SearchBar from "../ui/SearchBar"; // ✅ Import your SearchBar component

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false); // ✅ Control search visibility

  const navLinks = [
    { label: "Home", href: "#" },
    { label: "Genres", href: "#" },
    { label: "Top Rated", href: "#" },
    { label: "My List", href: "#" },
  ];

  return (
    <>
      {/* Header Section */}
      <header className="fixed top-0 left-0 w-full z-40 bg-gradient-to-b from-gray-900 via-gray-900/95 to-transparent backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16 md:h-20">
          
          {/*  Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              <span className="text-red-600">Cine</span>Pulse
            </h1>
          </div>

          {/* 🌐 Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-gray-300 flex-1 mx-12">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium hover:text-white transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300"></span>
              </a>
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
              <span className="text-sm font-medium">My Space</span>
            </button>
          </div>
        </div>

        {/* 🔽 Search Bar Slide Section */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            showSearch ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <SearchBar />
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20"></div>
    </>
  );
}
