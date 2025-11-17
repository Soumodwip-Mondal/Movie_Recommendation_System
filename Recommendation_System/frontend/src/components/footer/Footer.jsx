import React from "react";
import { Youtube, Instagram, Twitter, Facebook } from "lucide-react";

function Footer() {
  return (
    <footer className="w-full bg-gradient-to-b from-black via-gray-900 to-black text-gray-400 py-3 px-4 md:px-12 border-t border-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <h2 className="text-lg font-semibold text-white">CinePulse</h2>
          <div className="flex gap-3 text-gray-400">
            <a href="#" className="hover:text-red-600 transition-colors">
              <Youtube size={18} />
            </a>
            <a href="#" className="hover:text-pink-500 transition-colors">
              <Instagram size={18} />
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              <Twitter size={18} />
            </a>
            <a href="#" className="hover:text-blue-600 transition-colors">
              <Facebook size={18} />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1 mt-3 text-[11px]">
          <a href="#" className="hover:text-white transition">FAQ</a>
          <a href="#" className="hover:text-white transition">Help Center</a>
          <a href="#" className="hover:text-white transition">Terms of Use</a>
          <a href="#" className="hover:text-white transition">Privacy Policy</a>
          <a href="#" className="hover:text-white transition">Cookie Preferences</a>
          <a href="#" className="hover:text-white transition">Corporate Information</a>
          <a href="#" className="hover:text-white transition">Contact Us</a>
          <a href="#" className="hover:text-white transition">Investor Relations</a>
        </div>

        <div className="mt-3 border-t border-gray-800 pt-3 text-center text-[11px] text-gray-500">
          © 2025 CinePulse. All rights reserved.
          <br />
          <span className="text-gray-400">Built with ❤️ by Soumo</span>
        </div>
      </div>
    </footer>
  );
}
export default Footer
