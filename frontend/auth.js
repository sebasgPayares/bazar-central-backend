/* ============================================
   Bazar Central — sesion y header dinamico
   Depende de api.js (obtenerSesion, cerrarSesion, escaparHtml)
   ============================================ */

/**
 * Dibuja el header segun quien este viendo la pagina:
 *  - Sin sesion: "Iniciar sesion" / "Registrarme"
 *  - Cliente logueado: su nombre + "Cerrar sesion" (sin link al panel)
 *  - Admin logueado: su nombre + "Cerrar sesion" + link al panel
 *
 * paginaActiva: 'catalogo' | 'panel' — para resaltar el link activo
 *              y para saber si mostrar el icono del carrito.
 */
function renderHeader(paginaActiva) {
  const root = document.getElementById('header-root');
  if (!root) return;

  const sesion = obtenerSesion();
  const esAdmin = sesion && sesion.rol === 'ADMIN';

  let nav = `<a href="index.html" class="${paginaActiva === 'catalogo' ? 'is-active' : ''}">Catálogo</a>`;
  if (sesion && !esAdmin) {
    nav += `<a href="mis-pedidos.html" class="${paginaActiva === 'mis-pedidos' ? 'is-active' : ''}">Mis pedidos</a>`;
  }
  if (esAdmin) {
    nav += `<a href="panel.html" class="${paginaActiva === 'panel' ? 'is-active' : ''}">Panel del negocio</a>`;
    nav += `<a href="panel-pedidos.html" class="${paginaActiva === 'panel-pedidos' ? 'is-active' : ''}">Pedidos</a>`;
  }

  let bloqueSesion;
  if (sesion) {
    bloqueSesion = `
      <span class="site-header__usuario">Hola, ${escaparHtml(sesion.nombre)}${esAdmin ? ' <span class="badge-admin">admin</span>' : ''}</span>
      <button class="btn btn-secondary btn-small" id="btn-logout" type="button">Cerrar sesión</button>
    `;
  } else {
    bloqueSesion = `
      <a href="login.html" class="btn btn-secondary btn-small">Iniciar sesión</a>
      <a href="registro.html" class="btn btn-primary btn-small">Registrarme</a>
    `;
  }

  const iconoCarrito = (paginaActiva === 'catalogo' || paginaActiva === 'producto')
    ? `<button class="btn-cart" id="btn-abrir-carrito" type="button" aria-label="Ver carrito">
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 7h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 7z"/><path d="M9 7V6a3 3 0 0 1 6 0v1"/></svg>
         <span class="btn-cart__contador" id="carrito-contador">0</span>
       </button>`
    : '';

  root.innerHTML = `
    <div class="site-header__inner">
      <a href="index.html" class="site-header__brand">Bazar <span>Central</span></a>
      <nav class="site-header__nav">${nav}</nav>
      <div class="site-header__sesion">
        ${iconoCarrito}
        ${bloqueSesion}
      </div>
    </div>
  `;

  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) btnLogout.addEventListener('click', cerrarSesion);
}

/**
 * Llamar al principio de panel.html: si no hay sesion de ADMIN,
 * manda a login.html y no deja que el resto del panel cargue.
 * Devuelve true si puede continuar, false si ya redirigio.
 */
function protegerSoloAdmin() {
  const sesion = obtenerSesion();
  if (!sesion || sesion.rol !== 'ADMIN') {
    window.location.href = 'login.html?destino=panel';
    return false;
  }
  return true;
}

/**
 * Llamar al principio de mis-pedidos.html: si no hay ninguna sesion
 * (cliente o admin), manda a login.html. A diferencia de protegerSoloAdmin,
 * aqui cualquier rol logueado puede pasar.
 */
function protegerRequiereSesion(destino) {
  const sesion = obtenerSesion();
  if (!sesion) {
    window.location.href = `login.html?destino=${destino || 'mis-pedidos'}`;
    return false;
  }
  return true;
}
