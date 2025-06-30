import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import {TelegramProvider} from "./reactContext/TelegramContext.js";


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

