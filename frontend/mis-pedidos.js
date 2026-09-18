if (!protegerRequiereSesion('mis-pedidos')) {
  throw new Error('Sin sesion: redirigiendo a login.');
}
renderHeader('mis-pedidos');

const ETIQUETA_ESTADO = {
  PENDIENTE: 'Pendiente',
  EN_PREPARACION: 'En preparación',
  COMPLETADO: 'Completado',
  CANCELADO: 'Cancelado',
};

const lista = document.getElementById('pedidos-lista');
const vacio = document.getElementById('pedidos-vacio');

function idDestacado() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get('destacar')) || null;
}

async function cargarMisPedidos() {
  try {
    const pedidos = await PedidosAPI.misPedidos();
    renderizarPedidos(pedidos);
  } catch (err) {
    lista.innerHTML = `<div class="empty-state">No se pudo cargar tu historial: ${escaparHtml(err.message)}</div>`;
  }
}

function renderizarPedidos(pedidos) {
  if (pedidos.length === 0) {
    lista.innerHTML = '';
    vacio.style.display = 'block';
    return;
  }
  vacio.style.display = 'none';

  const destacado = idDestacado();

  lista.innerHTML = pedidos.map((p) => `
    <article class="pedido-card ${p.id === destacado ? 'pedido-card--destacado' : ''}">
      <div class="pedido-card__header">
        <div>
          <span class="pedido-card__numero">Pedido #${p.id}</span>
          <span class="pedido-card__fecha">${formatearFecha(p.fecha)}</span>
        </div>
        <span class="estado-badge estado-badge--${p.estado}">${ETIQUETA_ESTADO[p.estado] || p.estado}</span>
      </div>

      <ul class="pedido-card__items">
        ${p.items.map((i) => `
          <li>
            <span>${escaparHtml(i.nombreProducto)} <span class="pedido-card__cantidad">x${i.cantidad}</span></span>
            <span>${formatearPrecio(i.subtotal)}</span>
          </li>
        `).join('')}
      </ul>

      <div class="pedido-card__total">
        <span>Total</span>
        <strong>${formatearPrecio(p.total)}</strong>
      </div>
    </article>
  `).join('');
}

function formatearFecha(fechaIso) {
  try {
    const fecha = new Date(fechaIso);
    return fecha.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })
      + ' · ' + fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  } catch (err) {
    return fechaIso;
  }
}

cargarMisPedidos();
