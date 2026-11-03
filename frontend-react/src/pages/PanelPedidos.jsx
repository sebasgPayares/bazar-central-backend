/* ============================================
   Gestion de pedidos (solo ADMIN): ver todos y cambiar su estado.
   Reemplaza panel-pedidos.html + panel-pedidos.js.
   ============================================ */
import { useEffect, useState } from 'react';
import { PedidosAPI } from '../api/pedidos';
import { useToast } from '../context/ToastContext';
import PedidoCard from '../components/PedidoCard';
import { ESTADOS, ESTADOS_FINALES, ETIQUETA_ESTADO } from '../utils/formato';
import { useTitulo } from '../utils/useTitulo';

export default function PanelPedidos() {
  useTitulo('Pedidos');
  const { mostrarToast } = useToast();

  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [actualizandoId, setActualizandoId] = useState(null);

  async function cargarPedidos() {
    try {
      setPedidos(await PedidosAPI.listarTodos());
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarPedidos();
  }, []);

  async function cambiarEstado(id, nuevoEstado) {
    setActualizandoId(id);
    try {
      await PedidosAPI.cambiarEstado(id, nuevoEstado);
      mostrarToast(nuevoEstado === 'CANCELADO'
        ? `Pedido #${id} cancelado. El stock volvió al catálogo`
        : `Pedido #${id} actualizado a "${ETIQUETA_ESTADO[nuevoEstado]}"`);
    } catch (err) {
      mostrarToast(err.message, true);
    }
    // Siempre recargamos: si fallo, el select vuelve a su valor real
    await cargarPedidos();
    setActualizandoId(null);
  }

  return (
    <main>
      <h1 className="page-title">Gestión de pedidos</h1>
      <p className="page-subtitle">Todos los pedidos de todos los clientes. Cambia el estado a medida que los procesas.</p>

      {cargando && <div className="empty-state">Cargando pedidos...</div>}
      {error && <div className="empty-state">No se pudo cargar los pedidos: {error}</div>}
      {!cargando && !error && pedidos.length === 0 && (
        <div className="empty-state">Todavía no hay pedidos registrados.</div>
      )}

      <div>
        {pedidos.map((p) => (
          <PedidoCard key={p.id} pedido={p} mostrarCliente>
            <div className="pedido-card__cambiar-estado">
              <label htmlFor={`estado-${p.id}`}>Estado</label>
              <select id={`estado-${p.id}`} value={p.estado}
                disabled={ESTADOS_FINALES.includes(p.estado) || actualizandoId === p.id}
                onChange={(e) => cambiarEstado(p.id, e.target.value)}>
                {ESTADOS.map((estado) => (
                  <option key={estado} value={estado}>{ETIQUETA_ESTADO[estado]}</option>
                ))}
              </select>
            </div>
          </PedidoCard>
        ))}
      </div>
    </main>
  );
}
