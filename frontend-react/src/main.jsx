/* ============================================
   Punto de entrada. Monta React en <div id="root"> y envuelve la app con:
   - BrowserRouter: navegacion entre paginas sin recargar
   - ToastProvider: avisos flotantes
   - AuthProvider: sesion (usa los avisos)
   - CarritoProvider: carrito (depende de la sesion)
   El orden importa: un provider puede usar los que estan por fuera de el.
   ============================================ */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CarritoProvider } from './context/CarritoContext';
import App from './App';
import './styles/style.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CarritoProvider>
            <App />
          </CarritoProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
);
