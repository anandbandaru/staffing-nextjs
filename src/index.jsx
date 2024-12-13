import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'
import './index.css'
import ContextProvider from './codebase/context/context.jsx'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ContextProvider >
    <App />
  </ContextProvider>
);