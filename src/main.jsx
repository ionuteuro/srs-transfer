import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Admin from './components/Admin.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {location.pathname.startsWith('/admin') ? <Admin /> : <App />}
  </React.StrictMode>,
)
