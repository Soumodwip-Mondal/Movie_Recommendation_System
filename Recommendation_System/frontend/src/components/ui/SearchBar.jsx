import React, { useState } from 'react'

function SearchBar() {
  const [text, setText] = useState('')

  const handleSearch = () => {
    console.log('Searching for:', text)
  }

  return (
    <div className='w-1/3 flex items-center gap-2'>
      <input
        type="text"
        placeholder="Search"
        className="w-2/3 bg-secondary text-textLight p-2 rounded"
        value={text}
        onChange={(e) => setText(e.target.value)} 
      />
      <button
        onClick={handleSearch}
        className="bg-accent text-white px-4 py-2 rounded"
      >
        Search
      </button>
    </div>
  )
}
export default SearchBar
