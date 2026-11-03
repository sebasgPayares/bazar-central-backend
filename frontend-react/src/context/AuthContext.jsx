/* ============================================
   Sesion del usuario. Reemplaza obtenerSesion / guardarSesion /
   cerrarSesion de api.js y auth.js.
   El estado "sesion" vive aqui y cualquier componente lo lee con useAuth().
   Cuando cambia (login/logout), React vuelve a dibujar lo que dependa de el
   (header, rutas protegidas, carrito...).
   ============================================ */
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AuthAPI } from '../api/auth';
import { leerSesion, SESION_KEY } from '../api/cliente';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Se inicializa con lo que haya en localStorage (sesion de una visita anterior)
  const [sesion, setSesion] = useState(leerSesion);
  const { mostrarToast } = useToast();

  // Llama al backend; si las credenciales son correctas guarda la sesion
  // ({ token, nombreUsuario, nombre, rol }). Si no, el error sube al formulario.
  const iniciarSesion = useCallback(async (nombreUsuario, password) => {
    const datos = await AuthAPI.login(nombreUsuario, password);
    localStorage.setItem(SESION_KEY, JSON.stringify(datos));
    setSesion(datos);
    return datos;
  }, []);

  const cerrarSesion = useCallback(() => {
    localStorage.removeItem(SESION_KEY);
    setSesion(null);
  }, []);

  // apiFetch emite "sesion-expirada" cuando el backend responde 401 con token
  useEffect(() => {
    const alExpirar = () => {
      cerrarSesion();
      mostrarToast('Tu sesión expiró. Inicia sesión de nuevo.', true);
    };
    window.addEventListener('sesion-expirada', alExpirar);
    return () => window.removeEventListener('sesion-expirada', alExpirar);
  }, [cerrarSesion, mostrarToast]);

  const valor = {
    sesion,
    esAdmin: sesion?.rol === 'ADMIN',
    iniciarSesion,
    cerrarSesion,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
