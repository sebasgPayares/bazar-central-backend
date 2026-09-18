if (!protegerSoloAdmin()) {
  throw new Error('Sin permisos: redirigiendo a login.');
}
renderHeader('panel-pedidos');

const ESTADOS = ['PENDIENTE', 'EN_PREPARACION', 'COMPLETADO', 'CANCELADO'];
const ETIQUETA_ESTADO = {
  PENDIENTE: 'Pendiente',
  EN_PREPARACION: 'En preparación',
  COMPLETADO: 'Completado',
  CANCELADO: 'Cancelado',
};
const ESTADOS_FINALES = ['COMPLETADO', 'CANCELADO'];

const lista = document.getElementById('pedidos-admin-lista');
const vacio = document.getElementById('pedidos-admin-vacio');

async function cargarPedidos() {
  try {
    const pedidos = await PedidosAPI.listarTodos();
    renderizarPedidos(pedidos);
  } catch (err) {
    lista.innerHTML = `<div class="empty-state">No se pudo cargar los pedidos: ${escaparHtml(err.message)}</div>`;
  }
}

function renderizarPedidos(pedidos) {
  if (pedidos.length === 0) {
    lista.innerHTML = '';
    vacio.style.display = 'block';
    return;
  }
  vacio.style.display = 'none';

  lista.innerHTML = pedidos.map((p) => {
    const esFinal = ESTADOS_FINALES.includes(p.estado);
    return `
      <article class="pedido-card">
        <div class="pedido-card__header">
          <div>
            <span class="pedido-card__numero">Pedido #${p.id}</span>
            <span class="pedido-card__fecha">${formatearFecha(p.fecha)}</span>
          </div>
          <span class="estado-badge estado-badge--${p.estado}">${ETIQUETA_ESTADO[p.estado] || p.estado}</span>
        </div>

        <p class="pedido-card__cliente">
          Cliente: <strong>${escaparHtml(p.nombreCliente)}</strong> (${escaparHtml(p.nombreUsuarioCliente)})
        </p>

        <ul class="pedido-card__items">
          ${p.items.map((i) => `
            <li>
              <span>${escaparHtml(i.nombreProducto)} <span class="pedido-card__cantidad">x${i.cantidad}</span></span>
              <span>${formatearPrecio(i.subtotal)}</span>
            </li>
          `).join('')}
        </ul>

        <div class="pedido-card__footer">
          <div class="pedido-card__total">
            <span>Total</span>
            <strong>${formatearPrecio(p.total)}</strong>
          </div>

          <div class="pedido-card__cambiar-estado">
            <label for="estado-${p.id}">Estado</label>
            <select id="estado-${p.id}" data-id="${p.id}" ${esFinal ? 'disabled' : ''}>
              ${ESTADOS.map((e) => `<option value="${e}" ${e === p.estado ? 'selected' : ''}>${ETIQUETA_ESTADO[e]}</option>`).join('')}
            </select>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

lista.addEventListener('change', async (e) => {
  const select = e.target.closest('select[data-id]');
  if (!select) return;

  const id = Number(select.dataset.id);
  const nuevoEstado = select.value;

  select.disabled = true;
  try {
    await PedidosAPI.cambiarEstado(id, nuevoEstado);
    mostrarToast(`Pedido #${id} actualizado a "${ETIQUETA_ESTADO[nuevoEstado]}"`);
    if (nuevoEstado === 'CANCELADO') {
      mostrarToast('El stock de ese pedido volvió al catálogo');
    }
    await cargarPedidos();
  } catch (err) {
    mostrarToast(err.message, true);
    select.disabled = false;
    await cargarPedidos(); // revierte el select a su valor real
  }
});

function formatearFecha(fechaIso) {
  try {
    const fecha = new Date(fechaIso);
    return fecha.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })
      + ' · ' + fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  } catch (err) {
    return fechaIso;
  }
}

cargarPedidos();
