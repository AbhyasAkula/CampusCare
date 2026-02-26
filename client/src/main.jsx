// main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'   // ⚠️ THIS LINE MUST EXIST
import { initializeSocket } from "./utils/socketInit";

// ⭐ start socket after page loads
initializeSocket();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
