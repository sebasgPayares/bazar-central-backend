/* Tarjeta de un pedido. La usan "Mis pedidos" (cliente) y
   "Gestion de pedidos" (admin). El admin le pasa mostrarCliente y,
   como children, el selector para cambiar el estado. */
import { ETIQUETA_ESTADO, formatearFecha, formatearPrecio } from '../utils/formato';

export default function PedidoCard({ pedido, destacado = false, mostrarCliente = false, children }) {
  const totalBloque = (
    <div className="pedido-card__total">
      <span>Total</span>
      <strong>{formatearPrecio(pedido.total)}</strong>
    </div>
  );

  return (
    <article className={`pedido-card${destacado ? ' pedido-card--destacado' : ''}`}>
      <div className="pedido-card__header">
        <div>
          <span className="pedido-card__numero">Pedido #{pedido.id}</span>
          <span className="pedido-card__fecha">{formatearFecha(pedido.fecha)}</span>
        </div>
        <span className={`estado-badge estado-badge--${pedido.estado}`}>
          {ETIQUETA_ESTADO[pedido.estado] || pedido.estado}
        </span>
      </div>

      {mostrarCliente && (
        <p className="pedido-card__cliente">
          Cliente: <strong>{pedido.nombreCliente}</strong> ({pedido.nombreUsuarioCliente})
        </p>
      )}

      <ul className="pedido-card__items">
        {pedido.items.map((item, indice) => (
          <li key={`${item.productoId}-${indice}`}>
            <span>
              {item.nombreProducto} <span className="pedido-card__cantidad">x{item.cantidad}</span>
            </span>
            <span>{formatearPrecio(item.subtotal)}</span>
          </li>
        ))}
      </ul>

      {children ? (
        <div className="pedido-card__footer">
          {totalBloque}
          {children}
        </div>
      ) : totalBloque}
    </article>
  );
}
