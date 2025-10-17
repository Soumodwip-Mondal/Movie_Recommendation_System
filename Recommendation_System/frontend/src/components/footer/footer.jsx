import React from "react";
import { Youtube, Instagram, Twitter, Facebook } from "lucide-react";

function Footer() {
  return (
    <footer className="w-full bg-gradient-to-b from-black via-gray-900 to-black text-gray-400 py-6 px-6 md:px-16 border-t border-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* Top Section: Logo + Socials */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-bold text-white">Streamflix</h2>
          <div className="flex gap-4 text-gray-400">
            <a href="#" className="hover:text-red-600 transition-colors">
              <Youtube size={20} />
            </a>
            <a href="#" className="hover:text-pink-500 transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="hover:text-blue-600 transition-colors">
              <Facebook size={20} />
            </a>
          </div>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-4 text-xs">
          <a href="#" className="hover:text-white transition">FAQ</a>
          <a href="#" className="hover:text-white transition">Help Center</a>
          <a href="#" className="hover:text-white transition">Terms of Use</a>
          <a href="#" className="hover:text-white transition">Privacy Policy</a>
          <a href="#" className="hover:text-white transition">Cookie Preferences</a>
          <a href="#" className="hover:text-white transition">Corporate Information</a>
          <a href="#" className="hover:text-white transition">Contact Us</a>
          <a href="#" className="hover:text-white transition">Investor Relations</a>
        </div>

        {/* Bottom Section */}
        <div className="mt-4 border-t border-gray-800 pt-4 text-center text-xs text-gray-500">
          © 2025 Streamflix. All rights reserved.
          <br />
          <span className="text-gray-400">Built with ❤️ by Soumo</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
