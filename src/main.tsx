import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// Importações da fonte Roboto (pesos comuns)
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// CssBaseline: Reseta o CSS do navegador para um padrão consistente
import CssBaseline from '@mui/material/CssBaseline';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* CssBaseline deve ficar aqui para normalizar o CSS globalmente */}
    <CssBaseline />
    <App />
  </React.StrictMode>,
)