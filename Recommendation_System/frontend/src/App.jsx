import { useState } from 'react'
import Header from './components/header/Header'
import Page from './components/page/Page'
import MobileMenu from './components/ui/MobileMenu'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <div className='min-h-screen w-full bg-primary overflow-x-hidden'>
          <Header/>
          <Page/>
          <MobileMenu/>
        </div>
    </>
  )
}

export default App
