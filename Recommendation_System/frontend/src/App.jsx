import { useState } from 'react'
import Header from './components/Header/Header'
import Page from './components/page/Page'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <div className='min-h-screen w-full bg-primary overflow-x-hidden'>
          <Header/>
          <Page/>
        </div>
    </>
  )
}

export default App
