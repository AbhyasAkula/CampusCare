// main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'   // ⚠️ THIS LINE MUST EXIST
import { initializeSocket } from "./utils/socketInit";
import { Toaster } from "react-hot-toast";

// ⭐ start socket after page loads
initializeSocket();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 3200,
        style: {
          border: "1px solid #e2e8f0",
          borderRadius: "14px",
          background: "#ffffff",
          color: "#0f172a",
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
        },
      }}
    />
  </React.StrictMode>
);
