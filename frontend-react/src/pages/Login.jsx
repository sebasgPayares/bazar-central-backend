/* ============================================
   Inicio de sesion. Reemplaza login.html + login.js.
   ============================================ */
import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTitulo } from '../utils/useTitulo';

export default function Login() {
  useTitulo('Iniciar sesión');
  const { sesion, esAdmin, iniciarSesion } = useAuth();
  const { mostrarToast } = useToast();
  const location = useLocation();

  // Inputs "controlados": su valor vive en el estado de React
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Si ya hay sesion (porque ya estaba, o porque acaba de iniciar), redirige.
  // "desde" lo deja RutaProtegida o el carrito: a donde queria ir el usuario.
  if (sesion) {
    const desde = location.state?.desde;
    const puedeVolver = desde && (!desde.startsWith('/panel') || esAdmin);
    const destino = puedeVolver ? desde : esAdmin ? '/panel' : '/';
    return <Navigate to={destino} replace />;
  }

  async function alEnviar(e) {
    e.preventDefault(); // evita que el formulario recargue la pagina
    setError('');
    setEnviando(true);
    try {
      const datos = await iniciarSesion(nombreUsuario.trim(), password);
      mostrarToast(`¡Hola, ${datos.nombre}!`);
      // No hace falta navegar: al cambiar la sesion, el if de arriba redirige
    } catch (err) {
      setError(err.message);
      setEnviando(false);
    }
  }

  return (
    <main className="auth-main">
      <section className="panel-card auth-card">
        <h1 className="auth-card__title">Iniciar sesión</h1>
        <p className="page-subtitle">Entra con tu usuario y contraseña de Voltio.</p>

        <form onSubmit={alEnviar}>
          <div className="field">
            <label htmlFor="nombreUsuario">Usuario</label>
            <input type="text" id="nombreUsuario" required autoComplete="username"
              value={nombreUsuario} onChange={(e) => setNombreUsuario(e.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" required autoComplete="current-password"
              value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <p className="form-error">{error}</p>

          <button type="submit" className="btn btn-primary btn-full" disabled={enviando}>
            {enviando ? 'Entrando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="auth-card__switch">
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
      </section>
    </main>
  );
}
