

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

const root = document.getElementById('root');
createRoot(root).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
