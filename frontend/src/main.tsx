import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1a1a3e',
            color: '#e0e0eb',
            border: '1px solid rgba(180,255,78,0.2)',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '14px',
            borderRadius: '12px',
          },
          success: { iconTheme: { primary: '#b4ff4e', secondary: '#07071a' } },
          error:   { iconTheme: { primary: '#ff6b6b', secondary: '#07071a' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
);
