import { apiFetch, conCuerpo } from './cliente';

export const PedidosAPI = {
  // items: [{ productoId, cantidad }] -> el backend valida y descuenta stock
  crear: (items) => apiFetch('/pedidos', conCuerpo('POST', { items })),
  misPedidos: () => apiFetch('/pedidos/mis-pedidos'),
  // Solo ADMIN
  listarTodos: () => apiFetch('/pedidos'),
  cambiarEstado: (id, estado) => apiFetch(`/pedidos/${id}/estado`, conCuerpo('PATCH', { estado })),
};
