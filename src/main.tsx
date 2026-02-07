import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import HelloWorld from './components/HelloWorld'
import PrintMessage from './components/PrintMessage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelloWorld />
    <PrintMessage message="This is a message from PrintMessage component." />
  </StrictMode>,
)
