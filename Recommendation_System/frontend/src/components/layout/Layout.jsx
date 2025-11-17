import React from 'react'
import Header from '../header/Header'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from '../footer/Footer'
import MobileMenu from '../ui/MobileMenu'
function Layout() {
  const location = useLocation();

  // Track last visited protected route (excluding landing)
  React.useEffect(() => {
    try {
      if (!location?.pathname || location.pathname.startsWith('/landing')) return;
      localStorage.setItem('cinepulse.lastRoute', location.pathname + (location.search || ''));
    } catch {}
  }, [location]);

  return (
    <div className='relative min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-[#0b0b0b] via-[#0a0a0a] to-black text-white'>
      {/* Ambient cinematic glows (red removed) */}
      <div className="pointer-events-none absolute -top-32 right-0 w-[30rem] h-[30rem] bg-emerald-300/10 rounded-full blur-3xl float-slow" style={{animationDelay:'-2s'}}></div>

      {/* Main content */}
      <div className='relative z-10'>
        <Header/>
        <Outlet/>
        <MobileMenu/>
        <Footer/>
      </div>
    </div>
  )
}

export default Layout
