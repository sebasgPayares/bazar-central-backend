/* ============================================
   Bazar Central — carrito de compras
   El carrito vive en el navegador (localStorage) mientras el cliente
   arma su compra. Al dar "Comprar" se manda a /api/pedidos, que valida
   stock, lo descuenta, y crea el pedido de verdad en la base de datos.

   El carrito se guarda con una llave distinta por usuario (o por
   invitado si no hay sesion), para que cambiar de cuenta no mezcle
   carritos de personas distintas en el mismo navegador.
   ============================================ */

const CARRITO_KEY_INVITADO = 'bazarcentral_carrito_invitado';

function claveCarritoActual() {
  const sesion = obtenerSesion();
  return sesion ? `bazarcentral_carrito_${sesion.nombreUsuario}` : CARRITO_KEY_INVITADO;
}

function obtenerCarrito() {
  try {
    const raw = localStorage.getItem(claveCarritoActual());
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

function guardarCarrito(items) {
  localStorage.setItem(claveCarritoActual(), JSON.stringify(items));
  actualizarContadorCarrito();
}

// Si agregaste productos sin sesion y luego inicias sesion, esto mueve
// lo que tenías como invitado al carrito de tu cuenta (una sola vez).
function migrarCarritoDeInvitadoSiAplica() {
  const sesion = obtenerSesion();
  if (!sesion) return;

  const raw = localStorage.getItem(CARRITO_KEY_INVITADO);
  if (!raw) return;

  try {
    const itemsInvitado = JSON.parse(raw);
    if (Array.isArray(itemsInvitado) && itemsInvitado.length > 0) {
      const claveUsuario = `bazarcentral_carrito_${sesion.nombreUsuario}`;
      const yaTeniaCarrito = localStorage.getItem(claveUsuario);
      // Solo migra si el usuario no tenia ya un carrito propio guardado,
      // para no pisar algo que ya había agregado con su cuenta.
      if (!yaTeniaCarrito) {
        localStorage.setItem(claveUsuario, JSON.stringify(itemsInvitado));
      }
    }
  } catch (err) {
    // JSON invalido, lo ignoramos
  }
  localStorage.removeItem(CARRITO_KEY_INVITADO);
}
migrarCarritoDeInvitadoSiAplica();

function agregarAlCarrito(producto, cantidad = 1) {
  const items = obtenerCarrito();
  const existente = items.find((i) => i.id === producto.id);

  const enCarrito = existente ? existente.cantidad : 0;
  if (enCarrito + cantidad > producto.stock) {
    mostrarToast(`Solo quedan ${producto.stock - enCarrito} unidades disponibles de "${producto.nombre}"`, true);
    return;
  }

  if (existente) {
    existente.cantidad += cantidad;
  } else {
    items.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      stockDisponible: producto.stock,
      cantidad,
    });
  }
  guardarCarrito(items);
  mostrarToast(`"${producto.nombre}" agregado al carrito${cantidad > 1 ? ` (x${cantidad})` : ''}`);
  renderizarCarrito();
}

function cambiarCantidad(id, delta) {
  const items = obtenerCarrito();
  const item = items.find((i) => i.id === id);
  if (!item) return;

  const nuevaCantidad = item.cantidad + delta;
  if (nuevaCantidad <= 0) {
    quitarDelCarrito(id);
    return;
  }
  if (nuevaCantidad > item.stockDisponible) {
    mostrarToast(`Solo quedan ${item.stockDisponible} unidades disponibles`, true);
    return;
  }
  item.cantidad = nuevaCantidad;
  guardarCarrito(items);
  renderizarCarrito();
}

function quitarDelCarrito(id) {
  const items = obtenerCarrito().filter((i) => i.id !== id);
  guardarCarrito(items);
  renderizarCarrito();
}

function vaciarCarrito() {
  guardarCarrito([]);
  renderizarCarrito();
}

function calcularTotalCarrito(items) {
  return items.reduce((total, i) => total + i.precio * i.cantidad, 0);
}

function actualizarContadorCarrito() {
  const contador = document.getElementById('carrito-contador');
  if (!contador) return;
  const total = obtenerCarrito().reduce((sum, i) => sum + i.cantidad, 0);
  contador.textContent = total;
  contador.style.display = total > 0 ? 'inline-flex' : 'none';
}

function renderizarCarrito() {
  const lista = document.getElementById('carrito-lista');
  const totalEl = document.getElementById('carrito-total');
  const vacioEl = document.getElementById('carrito-vacio');
  if (!lista) return; // el drawer no esta en esta pagina

  const items = obtenerCarrito();

  if (items.length === 0) {
    lista.innerHTML = '';
    vacioEl.style.display = 'block';
    totalEl.textContent = formatearPrecio(0);
    return;
  }

  vacioEl.style.display = 'none';
  lista.innerHTML = items.map((i) => `
    <li class="carrito-item">
      <div class="carrito-item__info">
        <span class="carrito-item__nombre">${escaparHtml(i.nombre)}</span>
        <span class="carrito-item__precio">${formatearPrecio(i.precio)} c/u</span>
      </div>
      <div class="carrito-item__acciones">
        <button class="btn-cantidad" data-accion="restar" data-id="${i.id}" type="button">−</button>
        <span class="carrito-item__cantidad">${i.cantidad}</span>
        <button class="btn-cantidad" data-accion="sumar" data-id="${i.id}" type="button">+</button>
        <button class="btn-quitar" data-accion="quitar" data-id="${i.id}" type="button" aria-label="Quitar">✕</button>
      </div>
    </li>
  `).join('');

  totalEl.textContent = formatearPrecio(calcularTotalCarrito(items));
}

function inicializarCarrito() {
  const drawer = document.getElementById('carrito-drawer');
  const overlay = document.getElementById('carrito-overlay');
  const btnAbrir = document.getElementById('btn-abrir-carrito');
  const btnCerrar = document.getElementById('btn-cerrar-carrito');
  const lista = document.getElementById('carrito-lista');
  const btnComprar = document.getElementById('btn-comprar');
  const btnVaciar = document.getElementById('btn-vaciar-carrito');
  if (!drawer) return;

  const abrir = () => { drawer.classList.add('is-abierto'); overlay.classList.add('is-visible'); };
  const cerrar = () => { drawer.classList.remove('is-abierto'); overlay.classList.remove('is-visible'); };

  btnAbrir.addEventListener('click', abrir);
  btnCerrar.addEventListener('click', cerrar);
  overlay.addEventListener('click', cerrar);

  lista.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-accion]');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const accion = btn.dataset.accion;
    if (accion === 'sumar') cambiarCantidad(id, 1);
    else if (accion === 'restar') cambiarCantidad(id, -1);
    else if (accion === 'quitar') quitarDelCarrito(id);
  });

  btnVaciar.addEventListener('click', () => {
    if (obtenerCarrito().length === 0) return;
    if (confirm('¿Vaciar todo el carrito?')) vaciarCarrito();
  });

  btnComprar.addEventListener('click', async () => {
    const items = obtenerCarrito();
    if (items.length === 0) return;

    const sesion = obtenerSesion();
    if (!sesion) {
      mostrarToast('Inicia sesión para completar la compra', true);
      cerrar();
      window.location.href = 'login.html?destino=carrito';
      return;
    }

    const payload = items.map((i) => ({ productoId: i.id, cantidad: i.cantidad }));

    btnComprar.disabled = true;
    btnComprar.textContent = 'Procesando...';
    try {
      const pedido = await PedidosAPI.crear(payload);
      vaciarCarrito();
      cerrar();
      mostrarToast(`¡Pedido #${pedido.id} creado por ${formatearPrecio(pedido.total)}!`);
      window.location.href = `mis-pedidos.html?destacar=${pedido.id}`;
    } catch (err) {
      // Stock insuficiente, producto ya no existe, etc. El carrito NO se
      // vacia para que el cliente pueda ajustar cantidades y reintentar.
      mostrarToast(err.message, true);
    } finally {
      btnComprar.disabled = false;
      btnComprar.textContent = 'Comprar';
    }
  });

  actualizarContadorCarrito();
  renderizarCarrito();
}

document.addEventListener('DOMContentLoaded', inicializarCarrito);
