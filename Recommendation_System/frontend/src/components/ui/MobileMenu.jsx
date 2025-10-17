import React, { useState } from 'react'
import { Home, Grid, Star, User, Bookmark } from 'lucide-react'

function MobileMenu() {
  const [activeItem, setActiveItem] = useState('home')

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home, href: '#' },
    { id: 'rated', label: 'Top Rated', icon: Star, href: '#' },
    { id: 'list', label: 'My List', icon: Bookmark, href: '#' },
    { id: 'feed', label: 'Genre', icon: Grid, href: '#' },
    { id: 'space', label: 'My Space', icon: User, href: '#' },
  ]

  return (
    <div className='fixed md:hidden bottom-0 left-0 h-16 w-full z-50 bg-gradient-to-b from-gray-900/80 via-gray-900 to-transparent backdrop-blur-md border-t border-white/5'>
      <div className='h-full flex items-center justify-around px-2'>
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeItem === item.id
          
          return (
            <a
              key={item.id}
              href={item.href}
              onClick={() => setActiveItem(item.id)}
              className='flex flex-col items-center justify-center gap-1.5 py-2 px-3 rounded-lg transition-all duration-300 group relative'
            >
              {/* Icon */}
              <Icon 
                size={22}
                className={`transition-all duration-300 ${
                  isActive 
                    ? 'text-red-600 drop-shadow-lg' 
                    : 'text-gray-400 group-hover:text-white'
                }`}
              />
              
              {/* Label */}
              <span className={`text-xs font-medium transition-colors duration-300 whitespace-nowrap ${
                isActive 
                  ? 'text-white' 
                  : 'text-gray-400 group-hover:text-white'
              }`}>
                {item.label}
              </span>
            </a>
          )
        })}
      </div>
    </div>
  )
}

export default MobileMenu