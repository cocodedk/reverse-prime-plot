import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ChainsApp from './ChainsApp.jsx';
import './global.css';

if (import.meta.env.DEV) {
  void import('virtual:stylex:runtime');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChainsApp />
  </StrictMode>,
);
