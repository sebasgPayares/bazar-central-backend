import { apiFetch, conCuerpo } from './cliente';

// Endpoints de /api/productos (GET es publico; escribir es solo ADMIN)
export const ProductosAPI = {
  listar: () => apiFetch('/productos'),
  obtener: (id) => apiFetch(`/productos/${id}`),
  crear: (producto) => apiFetch('/productos', conCuerpo('POST', producto)),
  actualizar: (id, producto) => apiFetch(`/productos/${id}`, conCuerpo('PUT', producto)),
  eliminar: (id) => apiFetch(`/productos/${id}`, { method: 'DELETE' }),
  // cantidad positiva repone, negativa descuenta (botones +10 y -1 del panel)
  ajustarStock: (id, cantidad) => apiFetch(`/productos/${id}/stock?cantidad=${cantidad}`, { method: 'PATCH' }),
};
