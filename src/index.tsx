import React from 'react'
import ReactDOM from 'react-dom/client'

import 'bootstrap/dist/css/bootstrap.min.css'

import { NextUIProvider } from '@nextui-org/system'
import reportWebVitals from './utils/reportWebVitals'
import { Main } from './components'


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <React.StrictMode>
    <NextUIProvider>
      <Main />
    </NextUIProvider>
  </React.StrictMode>
)

reportWebVitals()
