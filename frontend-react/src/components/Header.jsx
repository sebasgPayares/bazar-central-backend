/* ============================================
   Header. Reemplaza renderHeader() de auth.js y parte de efectos.js.
   Muestra enlaces distintos segun el rol:
     - sin sesion: Iniciar sesion / Registrarme
     - CLIENTE: Mis pedidos
     - ADMIN: Panel del negocio, Pedidos, Proveedores
   ============================================ */
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCarrito } from '../context/CarritoContext';

// NavLink pone la clase is-active cuando la URL coincide con el enlace
const claseEnlace = ({ isActive }) => (isActive ? 'is-active' : '');

export default function Header({ conCarrito }) {
  const { sesion, esAdmin, cerrarSesion } = useAuth();
  const { cantidadTotal, abrir } = useCarrito();
  const navigate = useNavigate();

  // Sombra del header al hacer scroll (antes estaba en efectos.js)
  const [conSombra, setConSombra] = useState(false);
  useEffect(() => {
    const actualizar = () => setConSombra(window.scrollY > 6);
    actualizar();
    window.addEventListener('scroll', actualizar, { passive: true });
    return () => window.removeEventListener('scroll', actualizar);
  }, []);

  // Animacion del carrito cuando sube el contador. Cada vez que "golpes"
  // cambia, el boton se vuelve a crear (key) y la animacion CSS se repite.
  const [golpes, setGolpes] = useState(0);
  const cantidadAnterior = useRef(cantidadTotal);
  useEffect(() => {
    if (cantidadTotal > cantidadAnterior.current) setGolpes((n) => n + 1);
    cantidadAnterior.current = cantidadTotal;
  }, [cantidadTotal]);

  function salir() {
    cerrarSesion();
    navigate('/');
  }

  return (
    <header className={`site-header${conSombra ? ' con-sombra' : ''}`}>
      <div className="site-header__inner">
        <Link to="/" className="site-header__brand">Volt<span>io</span></Link>

        <nav className="site-header__nav">
          <NavLink to="/" end className={claseEnlace}>Tienda</NavLink>
          {sesion && !esAdmin && (
            <NavLink to="/mis-pedidos" className={claseEnlace}>Mis pedidos</NavLink>
          )}
          {esAdmin && (
            <>
              <NavLink to="/panel" end className={claseEnlace}>Panel del negocio</NavLink>
              <NavLink to="/panel/pedidos" className={claseEnlace}>Pedidos</NavLink>
              <NavLink to="/panel/proveedores" className={claseEnlace}>Proveedores</NavLink>
            </>
          )}
        </nav>

        <div className="site-header__sesion">
          {conCarrito && (
            <button key={golpes} className={`btn-cart${golpes ? ' golpe' : ''}`}
              type="button" aria-label="Ver carrito" onClick={abrir}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 7h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 7z" />
                <path d="M9 7V6a3 3 0 0 1 6 0v1" />
              </svg>
              <span className={`btn-cart__contador${golpes ? ' pop' : ''}`}
                style={{ display: cantidadTotal > 0 ? 'inline-flex' : 'none' }}>
                {cantidadTotal}
              </span>
            </button>
          )}

          {sesion ? (
            <>
              <span className="site-header__usuario">
                Hola, {sesion.nombre}
                {esAdmin && <> <span className="badge-admin">admin</span></>}
              </span>
              <button className="btn btn-secondary btn-small" type="button" onClick={salir}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-small">Iniciar sesión</Link>
              <Link to="/registro" className="btn btn-primary btn-small">Registrarme</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
