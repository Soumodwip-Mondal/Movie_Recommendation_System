import React from 'react'
import Header from '../header/Header'
import Page from '../page/Page'
import Footer from '../footer/Footer'
import MobileMenu from '../ui/MobileMenu'
import Profile from '../Profile/Profile'
import GenrePage from '../page/GenrePage'
import TopRated from '../page/TopRated'
import MyList from '../page/MyList'
function Layout() {
  return (
    <div className='min-h-screen w-full bg-primary overflow-x-hidden'>      
          <Header/>
          <Page/>
          <MobileMenu/>
          <Profile/>
          <GenrePage/>
          <TopRated/>
          <MyList/>
          <Footer/> 
        </div>
  )
}

export default Layout