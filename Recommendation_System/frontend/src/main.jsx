import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/authContext'
import { MoviesProvider } from './context/movieContext'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <MoviesProvider>
        <App />
      </MoviesProvider>
    </AuthProvider>
  </StrictMode>,
)
