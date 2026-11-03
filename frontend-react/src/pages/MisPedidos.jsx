/* ============================================
   Historial de compras del usuario logueado.
   Reemplaza mis-pedidos.html + mis-pedidos.js.
   ============================================ */
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PedidosAPI } from '../api/pedidos';
import PedidoCard from '../components/PedidoCard';
import { useTitulo } from '../utils/useTitulo';

export default function MisPedidos() {
  useTitulo('Mis pedidos');
  // ?destacar=15 -> resalta el pedido recien creado desde el carrito
  const [params] = useSearchParams();
  const destacado = Number(params.get('destacar')) || null;

  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    PedidosAPI.misPedidos()
      .then(setPedidos)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  return (
    <main>
      <h1 className="page-title">Mis pedidos</h1>
      <p className="page-subtitle">Historial de tus compras en Voltio, con el estado de cada una.</p>

      {cargando && <div className="empty-state">Cargando tus pedidos...</div>}
      {error && <div className="empty-state">No se pudo cargar tu historial: {error}</div>}
      {!cargando && !error && pedidos.length === 0 && (
        <div className="empty-state">
          Todavía no has hecho ningún pedido. <Link to="/">Explora el catálogo</Link> para empezar.
        </div>
      )}

      <div>
        {pedidos.map((p) => (
          <PedidoCard key={p.id} pedido={p} destacado={p.id === destacado} />
        ))}
      </div>
    </main>
  );
}
