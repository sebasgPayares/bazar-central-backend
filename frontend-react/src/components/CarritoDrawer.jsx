/* ============================================
   Panel lateral del carrito. Reemplaza inicializarCarrito() y
   renderizarCarrito() de carrito.js. Los datos vienen de CarritoContext.
   ============================================ */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PedidosAPI } from '../api/pedidos';
import { useAuth } from '../context/AuthContext';
import { useCarrito } from '../context/CarritoContext';
import { useToast } from '../context/ToastContext';
import { formatearPrecio } from '../utils/formato';

export default function CarritoDrawer() {
  const { items, total, abierto, cerrar, cambiarCantidad, quitar, vaciar } = useCarrito();
  const { sesion } = useAuth();
  const { mostrarToast } = useToast();
  const navigate = useNavigate();
  const [procesando, setProcesando] = useState(false);

  function confirmarVaciar() {
    if (items.length === 0) return;
    if (window.confirm('¿Vaciar todo el carrito?')) vaciar();
  }

  async function comprar() {
    if (items.length === 0) return;

    if (!sesion) {
      mostrarToast('Inicia sesión para completar la compra', true);
      cerrar();
      navigate('/login', { state: { desde: '/' } });
      return;
    }

    setProcesando(true);
    try {
      const pedido = await PedidosAPI.crear(
        items.map((i) => ({ productoId: i.id, cantidad: i.cantidad })),
      );
      vaciar();
      cerrar();
      mostrarToast(`¡Pedido #${pedido.id} creado por ${formatearPrecio(pedido.total)}!`);
      navigate(`/mis-pedidos?destacar=${pedido.id}`);
    } catch (err) {
      // Stock insuficiente, producto eliminado, etc. El carrito NO se vacia
      // para que el cliente pueda ajustar cantidades y reintentar.
      mostrarToast(err.message, true);
    } finally {
      setProcesando(false);
    }
  }

  return (
    <>
      <div className={`carrito-overlay${abierto ? ' is-visible' : ''}`} onClick={cerrar} />
      <aside className={`carrito-drawer${abierto ? ' is-abierto' : ''}`} aria-hidden={!abierto}>
        <div className="carrito-drawer__header">
          <h2>Tu carrito</h2>
          <button className="btn-cerrar" type="button" aria-label="Cerrar" onClick={cerrar}>✕</button>
        </div>

        <ul className="carrito-lista">
          {items.map((i) => (
            <li key={i.id} className="carrito-item">
              <div className="carrito-item__info">
                <span className="carrito-item__nombre">{i.nombre}</span>
                <span className="carrito-item__precio">{formatearPrecio(i.precio)} c/u</span>
              </div>
              <div className="carrito-item__acciones">
                <button className="btn-cantidad" type="button" onClick={() => cambiarCantidad(i.id, -1)}>−</button>
                <span className="carrito-item__cantidad">{i.cantidad}</span>
                <button className="btn-cantidad" type="button" onClick={() => cambiarCantidad(i.id, 1)}>+</button>
                <button className="btn-quitar" type="button" aria-label="Quitar" onClick={() => quitar(i.id)}>✕</button>
              </div>
            </li>
          ))}
        </ul>
        {items.length === 0 && (
          <p className="carrito-vacio">Tu carrito está vacío. Agrega productos desde el catálogo.</p>
        )}

        <div className="carrito-drawer__footer">
          <div className="carrito-total-row">
            <span>Total</span>
            <strong>{formatearPrecio(total)}</strong>
          </div>
          <button className="btn btn-primary btn-full" type="button" onClick={comprar} disabled={procesando}>
            {procesando ? 'Procesando...' : 'Comprar'}
          </button>
          <button className="btn btn-secondary btn-full" type="button" onClick={confirmarVaciar}>
            Vaciar carrito
          </button>
        </div>
      </aside>
    </>
  );
}
