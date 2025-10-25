import React from 'react'
import Header from '../header/Header'
import { Outlet } from 'react-router-dom'
import Footer from '../footer/Footer'
import MobileMenu from '../ui/MobileMenu'
function Layout() {
  return (
    <div className='min-h-screen w-full bg-primary overflow-x-hidden'>      
          <Header/>
          <Outlet/>
          <MobileMenu/>
          <Footer/> 
        </div>
  )
}

export default Layout