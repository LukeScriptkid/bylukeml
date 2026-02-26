/**
 * Application entry point.
 * Mounts the React root into the #root div defined in index.html.
 * StrictMode wraps the app to surface potential issues during development
 * (e.g. unsafe lifecycle methods, deprecated APIs, unexpected side effects).
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // Global styles, theme variables, and Tailwind base
import App from './App'

// The "!" asserts #root exists — safe because index.html always includes it
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
