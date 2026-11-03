/* ============================================
   Voltio — cliente HTTP comun para toda la API
   Equivale al apiFetch() del antiguo api.js.
   ============================================ */

// La URL del backend sale de la variable de entorno VITE_API_URL (archivo .env).
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8094/api';

// Misma llave que usaba la version anterior: si alguien ya tenia sesion
// abierta, la sigue teniendo despues de la migracion.
export const SESION_KEY = 'bazarcentral_sesion';

export function leerSesion() {
  try {
    const raw = localStorage.getItem(SESION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Hace una peticion a la API:
 *  - agrega el header "Authorization: Bearer <token>" si hay sesion
 *  - convierte la respuesta a JSON
 *  - si el backend responde con error, lanza un Error con data.mensaje
 */
export async function apiFetch(path, options = {}) {
  const sesion = leerSesion();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (sesion?.token) {
    headers.Authorization = `Bearer ${sesion.token}`;
  }

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    // fetch solo falla asi cuando no hay conexion con el servidor
    throw new Error('No se pudo conectar con el servidor. Intenta de nuevo en un momento.');
  }

  // 204 = sin contenido (por ejemplo al eliminar): no hay JSON que leer
  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    // 401 con token enviado = el token vencio (dura 24 h). Avisamos al
    // AuthContext para que cierre la sesion y pida login de nuevo.
    if (res.status === 401 && sesion?.token) {
      window.dispatchEvent(new Event('sesion-expirada'));
    }

    // Errores de validacion (400) traen el detalle de cada campo en data.campos
    const detalleCampos = data?.campos ? ` ${Object.values(data.campos).join('. ')}` : '';
    const mensaje = (data && (data.mensaje || data.error)) || `Error ${res.status}`;
    throw new Error(mensaje + detalleCampos);
  }
  return data;
}

// Atajo para mandar un objeto como JSON en el cuerpo de la peticion
export const conCuerpo = (method, cuerpo) => ({ method, body: JSON.stringify(cuerpo) });
