import { useState } from 'react'
import Layout from './components/layout/Layout'
import LandingPageLayout from './components/layout/LandingPageLayout'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        {/* <Layout/> */}
        <LandingPageLayout/>
    </>
  )
}

export default App
