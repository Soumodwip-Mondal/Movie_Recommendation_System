import Layout from './components/layout/Layout'
import MyList from './components/page/MyList'
import GenrePage from './components/page/GenrePage'
import TopRated from './components/page/TopRated'
import Profile from './components/Profile/Profile'
import LandingPage from './components/page/LandingPage'
import Page from './components/page/Page'
import SearchDisplay from './components/page/SearchDisplay'
import SearchPage from './components/page/SearchPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, Navigate } from 'react-router-dom'

function App() {
 const router=createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public landing page */}
      <Route path='/landing' element={<LandingPage />} />
      
      {/* Protected routes */}
      <Route path='/' element={<ProtectedRoute><Layout/></ProtectedRoute>}>
        <Route index element={<Page/>}/>
        <Route path='genres' element={<GenrePage/>}/>
        <Route path='top-rated' element={<TopRated/>}/>
        <Route path='mylist' element={<MyList/>}/>
        <Route path='profile' element={<Profile/>}/>
        {/* Full search results page */}
        <Route path='search' element={<SearchPage/>} />
        {/* Recommendations search display */}
        <Route path='recommend' element={<SearchDisplay/>} />
      </Route>
      
      {/* Fallback redirect */}
      <Route path='*' element={<Navigate to='/' replace />} />
    </>
  )
 )

  return <RouterProvider router={router}/>
}

export default App
