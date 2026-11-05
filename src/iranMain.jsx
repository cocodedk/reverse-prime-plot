import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import IranApp from './IranApp.jsx';
import './global.css';

if (import.meta.env.DEV) {
  void import('virtual:stylex:runtime');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <IranApp />
  </StrictMode>,
);
