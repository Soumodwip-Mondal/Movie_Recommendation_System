import React from 'react'
import { HomeIcon,StarIcon,UserIcon,VideoIcon} from 'lucide-react'
function MobileMenu() {
  return (
    <div className='fixed md:hidden bottom-0 left-0 h-14 w-full z-50 bg-primary/60 backdrop-blur-xl border-b border-white/10 flex items-center justify-evenly gap-8 text-gray-300'>
        <div className='flex-col justify-center items-center'>
          <HomeIcon/>
           <a href="#" className="hover:text-white text-xs font-medium transition-colors text-center">
            Home
          </a>
        </div>
         <div className='flex-col justify-center'>
          <VideoIcon/>
          <a href="#" className="hover:text-white text-xs font-medium transition-colors ">
            Your feed
          </a>
          </div>
          <div className='flex-col justify-center'>
            <StarIcon/>
            <a href="#" className="hover:text-white text-xs font-medium transition-colors">
            Top Rated
          </a>
          </div>
          <div className='flex-col justify-center'>
            <UserIcon/>
            <a href="#" className="hover:text-white text-xs font-medium transition-colors">
            My Space
          </a>
          </div>
    </div>
  )
}

export default MobileMenu