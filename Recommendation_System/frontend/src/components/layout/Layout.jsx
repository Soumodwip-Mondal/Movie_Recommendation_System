import React from 'react'
import Header from '../header/Header'
import Page from '../page/Page'
import Footer from '../footer/Footer'
import MobileMenu from '../ui/MobileMenu'
import SignUp from '../auth/SignUp'
import LogIn from '../auth/LogIn'
function Layout() {
  return (
    <div className='min-h-screen w-full bg-primary overflow-x-hidden'>
          {/* <SignUp/> */}
          <LogIn/>
          <Header/>
          <Page/>
          <MobileMenu/>
          <Footer/> 
          
        </div>
  )
}

export default Layout