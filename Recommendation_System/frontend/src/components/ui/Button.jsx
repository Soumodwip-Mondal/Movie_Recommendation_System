import React from "react";

function Button({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-md transition-all duration-300 hover:scale-105"
    >
      {children || 'Get Started'}
    </button>
  );
}
export default Button;
