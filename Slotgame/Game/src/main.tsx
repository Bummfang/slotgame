import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SlotMachine from './Component/SlotMachine/SlotMachine'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SlotMachine />
  </StrictMode>,
)
