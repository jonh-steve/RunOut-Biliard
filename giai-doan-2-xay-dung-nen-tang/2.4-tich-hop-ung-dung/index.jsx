import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

/**
 * Entry point của ứng dụng
 * 
 * Render App component vào DOM
 */
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);