import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Ensure light mode is always active — remove any stored dark theme
sessionStorage.removeItem('theme');
document.documentElement.classList.remove('dark');


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
