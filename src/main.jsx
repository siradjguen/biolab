import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import LabForge from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LabForge />
  </StrictMode>,
)