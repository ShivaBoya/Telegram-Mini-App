import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import { TelegramProvider } from "./reactContext/TelegramContext.js";


// Suppress benign TonConnect errors
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && (
    event.reason.message === 'Operation aborted' ||
    (typeof event.reason === 'string' && event.reason.includes('Operation aborted'))
  )) {
    event.preventDefault();
    console.warn('Suppressed benign TonConnect error: Operation aborted');
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TelegramProvider >
      <Router>
        <App />
      </Router>
    </TelegramProvider>
  </React.StrictMode>
);

