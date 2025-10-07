import React from 'react'
import Avater from '../ui/Avater'
import SearchBar from '../ui/SearchBar'
function Header() {
  return (
 <header className="sticky top-0 z-50 h-16 flex justify-between items-center px-4 bg-black/80 backdrop-blur-xl text-white border-b border-slate-800">
  <h1 className="text-lg font-semibold">This is header</h1>
    <SearchBar/>
    <Avater />
</header>

  )
}

export default Header
