/* Funciones de formato y constantes compartidas por varias paginas */

export function formatearPrecio(valor) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
    .format(valor);
}

export function formatearFecha(fechaIso) {
  const fecha = new Date(fechaIso);
  if (Number.isNaN(fecha.getTime())) return fechaIso;
  return fecha.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })
    + ' · ' + fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
}

// Estados del enum EstadoPedido del backend, en orden
export const ESTADOS = ['PENDIENTE', 'EN_PREPARACION', 'COMPLETADO', 'CANCELADO'];

export const ETIQUETA_ESTADO = {
  PENDIENTE: 'Pendiente',
  EN_PREPARACION: 'En preparación',
  COMPLETADO: 'Completado',
  CANCELADO: 'Cancelado',
};

// Un pedido en estos estados ya no se puede cambiar
export const ESTADOS_FINALES = ['COMPLETADO', 'CANCELADO'];
