/* ============================================
   Bazar Central — efectos visuales
   Solo presentación: no llama a la API ni cambia datos.
   ============================================ */
(function () {
  // Header con sombra al hacer scroll
  function sombraHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    const actualizar = () => header.classList.toggle('con-sombra', window.scrollY > 6);
    window.addEventListener('scroll', actualizar, { passive: true });
    actualizar();
  }

  // Recuerda qué botón "Agregar" se tocó para darle feedback
  let ultimoBoton = null;
  document.addEventListener('click', (e) => {
    const boton = e.target.closest('.btn-agregar, #btn-agregar-detalle');
    if (boton) ultimoBoton = boton;
  }, true);

  function reiniciarAnimacion(el, clase) {
    el.classList.remove(clase);
    void el.offsetWidth; // fuerza a reiniciar la animación
    el.classList.add(clase);
  }

  // Cuando el contador del carrito sube, animamos carrito y botón.
  // Si el producto no se pudo agregar (sin stock), el contador no cambia y no se anima nada.
  function animarAlAgregar() {
    const contador = document.getElementById('carrito-contador');
    if (!contador) return;
    let anterior = Number(contador.textContent) || 0;

    new MutationObserver(() => {
      const actual = Number(contador.textContent) || 0;
      if (actual > anterior) {
        const botonCarrito = document.getElementById('btn-abrir-carrito');
        if (botonCarrito) reiniciarAnimacion(botonCarrito, 'golpe');
        reiniciarAnimacion(contador, 'pop');

        if (ultimoBoton && document.body.contains(ultimoBoton)) {
          const boton = ultimoBoton;
          const texto = boton.textContent;
          boton.classList.add('agregado');
          boton.textContent = '✓ Agregado';
          setTimeout(() => { boton.classList.remove('agregado'); boton.textContent = texto; }, 1300);
        }
      }
      ultimoBoton = null;
      anterior = actual;
    }).observe(contador, { childList: true, characterData: true, subtree: true });
  }

  // En el hero, si ya hay sesión, el segundo botón lleva a lo que corresponde
  function ajustarBotonHero() {
    const enlace = document.querySelector('.hero__acciones a[href="registro.html"]');
    if (!enlace || typeof obtenerSesion !== 'function') return;
    const sesion = obtenerSesion();
    if (!sesion) return;
    const esAdmin = sesion.rol === 'ADMIN';
    enlace.href = esAdmin ? 'panel.html' : 'mis-pedidos.html';
    enlace.textContent = esAdmin ? 'Ir al panel' : 'Ver mis pedidos';
  }

  document.addEventListener('DOMContentLoaded', () => {
    ajustarBotonHero();
    sombraHeader();
    animarAlAgregar();
  });
})();
