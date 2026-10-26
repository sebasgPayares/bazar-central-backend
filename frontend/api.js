/* ============================================
   Voltio — conexion con la API
   Cambia esta URL si mueves el backend a otro puerto/servidor.
   ============================================ */

 const API_BASE = 'https://bazar-central-backend-production.up.railway.app/api';
const AUTH_KEY = 'bazarcentral_sesion';

/* ---------- Sesion (guardada en el navegador) ---------- */

function obtenerSesion() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

function guardarSesion(datosLogin) {
  // datosLogin viene tal cual de LoginResponseDTO: { token, nombreUsuario, nombre, rol }
  localStorage.setItem(AUTH_KEY, JSON.stringify(datosLogin));
}

function cerrarSesion() {
  localStorage.removeItem(AUTH_KEY);
  window.location.href = 'index.html';
}

async function apiFetch(path, options = {}) {
  const sesion = obtenerSesion();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (sesion && sesion.token) {
    headers['Authorization'] = `Bearer ${sesion.token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  // Sin contenido (204) — no intentes parsear JSON
  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const mensaje = (data && (data.mensaje || data.error)) || `Error ${res.status}`;
    throw new Error(mensaje);
  }
  return data;
}

const ProductosAPI = {
  listar: () => apiFetch('/productos'),
  obtener: (id) => apiFetch(`/productos/${id}`),
  crear: (producto) => apiFetch('/productos', { method: 'POST', body: JSON.stringify(producto) }),
  actualizar: (id, producto) => apiFetch(`/productos/${id}`, { method: 'PUT', body: JSON.stringify(producto) }),
  eliminar: (id) => apiFetch(`/productos/${id}`, { method: 'DELETE' }),
  ajustarStock: (id, cantidad) => apiFetch(`/productos/${id}/stock?cantidad=${cantidad}`, { method: 'PATCH' }),
};

const AuthAPI = {
  login: (nombreUsuario, password) =>
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ nombreUsuario, password }) }),
  registro: (usuario) =>
    apiFetch('/auth/registro', { method: 'POST', body: JSON.stringify(usuario) }),
};

const TiposDocumentoAPI = {
  listar: () => apiFetch('/tipos-documento'),
};

const ProveedoresAPI = {
  listar: () => apiFetch('/proveedores'),
  obtener: (id) => apiFetch(`/proveedores/${id}`),
  crear: (proveedor) => apiFetch('/proveedores', { method: 'POST', body: JSON.stringify(proveedor) }),
  actualizar: (id, proveedor) => apiFetch(`/proveedores/${id}`, { method: 'PUT', body: JSON.stringify(proveedor) }),
  eliminar: (id) => apiFetch(`/proveedores/${id}`, { method: 'DELETE' }),
};

const PedidosAPI = {
  crear: (items) => apiFetch('/pedidos', { method: 'POST', body: JSON.stringify({ items }) }),
  misPedidos: () => apiFetch('/pedidos/mis-pedidos'),
  listarTodos: () => apiFetch('/pedidos'),
  obtener: (id) => apiFetch(`/pedidos/${id}`),
  cambiarEstado: (id, estado) => apiFetch(`/pedidos/${id}/estado`, { method: 'PATCH', body: JSON.stringify({ estado }) }),
};

function escaparHtml(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

// Iconos de categoría (SVG de línea). Se usan cuando un producto no tiene imagen.
// Mantiene el nombre emojiParaCategoria para no tocar el resto del código.
const _svg = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICONOS_CATEGORIA = {
  celular: _svg('<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>'),
  computador: _svg('<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 19h20"/>'),
  audio: _svg('<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>'),
  gaming: _svg('<path d="M7 8h10a4 4 0 0 1 3.9 4.9l-.8 3.6a2.4 2.4 0 0 1-4 1.2L14 16h-4l-2.1 1.7a2.4 2.4 0 0 1-4-1.2l-.8-3.6A4 4 0 0 1 7 8z"/><path d="M8 10.5v3M6.5 12h3M16 11.5h.01M18 13h.01"/>'),
  reloj: _svg('<rect x="7" y="6" width="10" height="12" rx="3"/><path d="M9 6l.6-3h4.8l.6 3M9 18l.6 3h4.8l.6-3M12 10v2.5l1.5 1"/>'),
  tablet: _svg('<rect x="4.5" y="3" width="15" height="18" rx="2.5"/><path d="M11 18h2"/>'),
  tv: _svg('<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>'),
  camara: _svg('<path d="M4 8h3l1.5-2.5h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/>'),
  accesorio: _svg('<path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z"/>'),
  generico: _svg('<path d="M12 2.5 3.5 7v10L12 21.5 20.5 17V7z"/><path d="M3.5 7 12 11.5 20.5 7M12 11.5v10"/>'),
};
const PALABRAS_CATEGORIA = [
  ['celular', ['celular', 'smartphone', 'telefon', 'movil']],
  ['computador', ['comput', 'portatil', 'laptop', 'pc', 'dispositivo']],
  ['audio', ['audio', 'audifono', 'parlante', 'sonido', 'bocina']],
  ['gaming', ['gaming', 'gamer', 'consola', 'juego', 'videojuego']],
  ['reloj', ['reloj', 'watch', 'wearable', 'smartwatch']],
  ['tablet', ['tablet', 'ipad']],
  ['tv', ['tv', 'televisor', 'pantalla', 'monitor', 'smart tv']],
  ['camara', ['camara', 'cámara', 'foto', 'drone', 'dron']],
  ['accesorio', ['accesorio', 'cargador', 'cable', 'energia', 'energía', 'bateria', 'batería', 'periferico']],
];

function emojiParaCategoria(categoria) {
  const clave = (categoria || '').trim().toLowerCase();
  for (const [icono, palabras] of PALABRAS_CATEGORIA) {
    if (palabras.some((p) => clave.includes(p))) return ICONOS_CATEGORIA[icono];
  }
  return ICONOS_CATEGORIA.generico;
}

function formatearPrecio(valor) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
    .format(valor);
}

function mostrarToast(mensaje, esError = false) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = mensaje;
  toast.classList.toggle('is-error', esError);
  toast.classList.add('is-visible');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('is-visible'), 3200);
}
