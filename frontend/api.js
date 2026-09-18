/* ============================================
   Bazar Central — conexion con la API
   Cambia esta URL si mueves el backend a otro puerto/servidor.
   ============================================ */

const API_BASE = 'http://localhost:8094/api';
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

const EMOJI_POR_CATEGORIA = {
  'dispositivo tecnologico': '💻',
  'celulares': '📱',
  'comidas': '🍔',
  'bebidas': '🥤',
  'ropa': '👕',
  'hogar': '🏠',
  'libros': '📚',
  'juguetes': '🧸',
};

function emojiParaCategoria(categoria) {
  const clave = (categoria || '').trim().toLowerCase();
  return EMOJI_POR_CATEGORIA[clave] || '🛍️';
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
