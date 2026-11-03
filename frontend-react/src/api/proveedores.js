import { apiFetch, conCuerpo } from './cliente';

// CRUD de /api/proveedores (todo es solo ADMIN). NIT repetido -> 409.
export const ProveedoresAPI = {
  listar: () => apiFetch('/proveedores'),
  crear: (proveedor) => apiFetch('/proveedores', conCuerpo('POST', proveedor)),
  actualizar: (id, proveedor) => apiFetch(`/proveedores/${id}`, conCuerpo('PUT', proveedor)),
  eliminar: (id) => apiFetch(`/proveedores/${id}`, { method: 'DELETE' }),
};
