import React from 'react'
import Header from '../header/Header'
import Page from '../page/Page'
import Footer from '../footer/Footer'
import MobileMenu from '../ui/MobileMenu'
import Profile from '../Profile/Profile'
function Layout() {
  return (
    <div className='min-h-screen w-full bg-primary overflow-x-hidden'>      
          <Header/>
          <Page/>
          <MobileMenu/>
          <Profile/>
          <Footer/> 
        </div>
  )
}

export default Layout