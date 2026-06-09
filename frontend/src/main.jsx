import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { initServerWarmUp } from './services/serverHealth';

// Start polling /api/health immediately on page load.
// This gives Render's free-tier server time to wake up BEFORE
// the user submits any form — preventing cold-start timeouts.
initServerWarmUp();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
