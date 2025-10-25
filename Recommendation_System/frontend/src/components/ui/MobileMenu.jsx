import React from 'react';
import { Home, Grid, Star, User, Bookmark } from 'lucide-react';
import { NavLink } from 'react-router-dom';

function MobileMenu() {
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home, href: '/' },
    { id: 'rated', label: 'Top Rated', icon: Star, href: '/top-rated' },
    { id: 'list', label: 'My List', icon: Bookmark, href: '/mylist' },
    { id: 'feed', label: 'Genre', icon: Grid, href: '/genres' },
    { id: 'space', label: 'My Space', icon: User, href: '/profile' },
  ];

  return (
    <div className="fixed md:hidden bottom-0 left-0 h-16 w-full z-50 bg-gradient-to-t from-gray-900 via-gray-900/95 to-gray-900/80 backdrop-blur-md border-t border-white/10">
      <div className="h-full flex items-center justify-around px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.id}
              to={item.href}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg transition-all duration-300 group relative ${
                  isActive
                    ? 'text-red-500'
                    : 'text-gray-400 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Icon */}
                  <Icon 
                    size={22}
                    className={`transition-all duration-300 ${
                      isActive ? 'scale-110' : 'group-hover:scale-105'
                    }`}
                  />
                  
                  {/* Label */}
                  <span
                    className={`text-xs font-medium transition-colors duration-300 whitespace-nowrap ${
                      isActive ? 'text-red-500' : 'text-gray-400 group-hover:text-white'
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Active Indicator Dot */}
                  {isActive && (
                    <span className="absolute -top-0.5 w-1 h-1 bg-red-500 rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}

export default MobileMenu;