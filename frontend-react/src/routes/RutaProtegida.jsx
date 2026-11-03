/* ============================================
   Protege rutas. Reemplaza protegerRequiereSesion() y protegerSoloAdmin().
     <RutaProtegida />            -> exige cualquier sesion
     <RutaProtegida soloAdmin />  -> exige rol ADMIN
   Ojo: esto solo cuida la interfaz. La seguridad real la pone el backend
   (Spring Security + JWT): sin token valido la API responde 401/403.
   ============================================ */
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RutaProtegida({ soloAdmin = false }) {
  const { sesion, esAdmin } = useAuth();
  const location = useLocation();

  if (!sesion) {
    // Manda al login y recuerda a donde queria ir, para volver despues
    return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  }
  if (soloAdmin && !esAdmin) {
    return <Navigate to="/" replace />;
  }
  // <Outlet /> dibuja la pagina hija que corresponde a la URL
  return <Outlet />;
}
