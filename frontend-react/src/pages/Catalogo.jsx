/* ============================================
   Pagina principal: hero + catalogo con buscador y chips de categoria.
   Reemplaza index.html + app.js.
   ============================================ */
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductosAPI } from '../api/productos';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { useTitulo } from '../utils/useTitulo';

export default function Catalogo() {
  useTitulo(null);
  const { sesion, esAdmin } = useAuth();

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');

  // useEffect con [] = se ejecuta una sola vez, al mostrar la pagina
  useEffect(() => {
    ProductosAPI.listar()
      .then(setProductos)
      .catch(() => setError('No se pudo conectar con la tienda. Intenta recargar la página en un momento.'))
      .finally(() => setCargando(false));
  }, []);

  // Las categorias salen de los productos (sin repetir, gracias a Set)
  const categorias = useMemo(
    () => ['Todas', ...new Set(productos.map((p) => p.categoria))],
    [productos],
  );

  // Filtro por categoria y por texto: se recalcula en cada render
  const filtrados = productos.filter((p) => {
    const coincideCategoria = categoriaActiva === 'Todas' || p.categoria === categoriaActiva;
    const coincideTexto = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideTexto;
  });

  // El segundo boton del hero cambia segun quien este viendo la pagina
  const botonHero = !sesion
    ? { to: '/registro', texto: 'Crear mi cuenta' }
    : esAdmin
      ? { to: '/panel', texto: 'Ir al panel' }
      : { to: '/mis-pedidos', texto: 'Ver mis pedidos' };

  let mensajeVacio = '';
  if (cargando) mensajeVacio = 'Cargando productos...';
  else if (error) mensajeVacio = error;
  else if (filtrados.length === 0) mensajeVacio = 'No encontramos productos con ese filtro.';

  return (
    <>
      <section className="hero">
        <div className="hero__toldo" aria-hidden="true"></div>
        <div className="hero__inner">
          <div>
            <span className="hero__etiqueta"><i></i> Envíos a toda Colombia</span>
            <h1 className="hero__titulo">Tecnología que <em>prende</em>.</h1>
            <p className="hero__texto">
              Celulares, portátiles, audio y gaming con stock real. Arma tu pedido
              en línea y sigue su estado desde tu cuenta.
            </p>
            <div className="hero__acciones">
              <a href="#catalogo" className="btn btn-primary btn-grande">Explorar la tienda</a>
              <Link to={botonHero.to} className="btn btn-secondary btn-grande">{botonHero.texto}</Link>
            </div>
            <div className="hero__datos">
              <div><strong>Stock real</strong><span>actualizado al instante</span></div>
              <div><strong>Pago seguro</strong><span>sesión protegida con JWT</span></div>
              <div><strong>Seguimiento</strong><span>de cada pedido</span></div>
            </div>
          </div>
          <Vitrina />
        </div>
      </section>

      <main id="catalogo">
        <h2 className="page-title">Lo último en tecnología</h2>
        <p className="page-subtitle">
          Celulares, computadores, audio y más. El catálogo y el stock se actualizan
          en tiempo real desde el panel de administración.
        </p>

        <div className="toolbar">
          <input type="text" placeholder="Buscar celulares, portátiles, audífonos..."
            value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          <div id="categorias">
            {categorias.map((cat) => (
              <button key={cat} type="button"
                className={`chip${cat === categoriaActiva ? ' is-active' : ''}`}
                onClick={() => setCategoriaActiva(cat)}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="product-grid">
          {filtrados.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
        {mensajeVacio && <div className="empty-state">{mensajeVacio}</div>}
      </main>

      <Footer />
    </>
  );
}

// Ilustracion decorativa del hero (el mismo SVG del index.html anterior)
function Vitrina() {
  return (
    <div className="vitrina" aria-hidden="true">
      <span className="vitrina__letrero">Nuevo · 2026</span>
      <svg viewBox="0 0 400 360" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="vg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#2a2f4a" /><stop offset="1" stopColor="#12141e" /></linearGradient>
          <linearGradient id="vg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c6ff3d" /><stop offset="1" stopColor="#7c5cff" /></linearGradient>
        </defs>
        <g className="vitrina__flota vitrina__flota--2">
          <rect x="52" y="92" width="236" height="152" rx="12" fill="url(#vg1)" stroke="#ffffff" strokeOpacity=".2" />
          <rect x="62" y="102" width="216" height="132" rx="6" fill="#0a0c14" />
          <rect x="62" y="102" width="216" height="132" rx="6" fill="url(#vg2)" opacity=".22" />
          <path d="M80 210 120 168 150 190 190 140 222 178 260 130" stroke="#c6ff3d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M30 252h280l-18 14H48z" fill="#1c2033" stroke="#ffffff" strokeOpacity=".18" />
        </g>
        <g className="vitrina__flota">
          <rect x="232" y="128" width="104" height="196" rx="20" fill="#0d0f17" stroke="#c6ff3d" strokeOpacity=".7" strokeWidth="2" />
          <rect x="241" y="140" width="86" height="172" rx="12" fill="url(#vg2)" opacity=".85" />
          <rect x="268" y="146" width="32" height="7" rx="3.5" fill="#0d0f17" />
          <circle cx="284" cy="226" r="26" stroke="#0a0c05" strokeOpacity=".55" strokeWidth="3" />
          <path d="M287 207 276 229h8l-3 14 12-23h-8z" fill="#0a0c05" fillOpacity=".8" />
        </g>
        <g className="vitrina__flota vitrina__flota--3">
          <path d="M70 318v-14a30 30 0 0 1 60 0v14" stroke="#29d3ff" strokeWidth="5" strokeLinecap="round" transform="translate(0 -6)" />
          <rect x="62" y="304" width="16" height="30" rx="7" fill="#29d3ff" transform="translate(0 -6)" />
          <rect x="122" y="304" width="16" height="30" rx="7" fill="#29d3ff" transform="translate(0 -6)" />
        </g>
      </svg>
      <div className="vitrina__chip vitrina__chip--a"><b>5G</b> Celulares</div>
      <div className="vitrina__chip vitrina__chip--b"><b>OLED</b> Pantallas</div>
    </div>
  );
}
