import { useState } from 'react'
import Layout from './components/layout/Layout'
import MyList from './components/page/MyList'
import GenrePage from './components/page/GenrePage'
import TopRated from './components/page/TopRated'
import Profile from './components/Profile/Profile'
import LandingPage from './components/page/LandingPage'
import Page from './components/page/Page'
import LandingPageLayout from './components/layout/LandingPageLayout'
import { Route,createBrowserRouter,createRoutesFromElements,RouterProvider } from 'react-router-dom'
function App() {
 const router=createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout/>}>
      <Route path='' element={<Page/>}/>
      <Route path='/genres' element={<GenrePage/>}/>
      <Route path='/top-rated' element={<TopRated/>}/>
      <Route path='/mylist' element={<MyList/>}/>
      <Route path='/profile' element={<Profile/>}/>
    </Route>
  )
 )

  return (
    <>
        <RouterProvider router={router}/>
        {/* <Layout/> */}
        {/* // <LandingPageLayout/> */}
    </>
  )
}
import { Home } from 'lucide-react'

export default App
