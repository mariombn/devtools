import React from 'react'
import ReactDOM from 'react-dom/client'
import '@/index.css'
import App from './App.tsx'
import { ThemeProvider } from '@/theme/ThemeProvider'
import { register as registerServiceWorker } from './serviceWorkerRegistration'

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </React.StrictMode>,
  );
} else {
  console.error('Root element not found!');
}

// Registrar service worker para funcionalidade PWA
registerServiceWorker()