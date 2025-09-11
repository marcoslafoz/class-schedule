import ReactDOM from 'react-dom/client'
import '../src/assets/css/main.css'
import { App } from './modules/App.tsx'
import React from 'react'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
