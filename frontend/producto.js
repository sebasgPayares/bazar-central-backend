const contenedor = document.getElementById('producto-contenido');

function idDesdeUrl() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get('id'));
}

async function cargarProducto() {
  renderHeader('producto');

  const id = idDesdeUrl();
  if (!id) {
    mostrarNoEncontrado();
    return;
  }

  try {
    const producto = await ProductosAPI.obtener(id);
    renderizarProducto(producto);
  } catch (err) {
    mostrarNoEncontrado();
  }
}

function mostrarNoEncontrado() {
  contenedor.innerHTML = `
    <div class="empty-state">
      No encontramos este producto. Puede que ya no esté disponible.
      <br><br>
      <a href="index.html" class="btn btn-primary btn-small">Volver al catálogo</a>
    </div>
  `;
}

function renderizarProducto(producto) {
  document.title = `Bazar Central — ${producto.nombre}`;

  const tieneImagen = producto.imagenUrl && producto.imagenUrl.trim() !== '';
  const agotado = producto.stock <= 0;
  const stockBajo = producto.stock > 0 && producto.stock <= 5;

  contenedor.innerHTML = `
    <div class="producto-detalle">
      <div class="producto-detalle__imagen">
        <div class="product-card__placeholder" aria-hidden="true">${emojiParaCategoria(producto.categoria)}</div>
        ${tieneImagen ? `<img class="product-card__image" src="${escaparHtml(producto.imagenUrl)}" alt="${escaparHtml(producto.nombre)}" onerror="this.remove()">` : ''}
      </div>

      <div class="producto-detalle__info">
        <span class="product-card__category">${escaparHtml(producto.categoria)}</span>
        <h1 class="producto-detalle__nombre">${escaparHtml(producto.nombre)}</h1>
        <p class="producto-detalle__precio">${formatearPrecio(producto.precio)}</p>

        <span class="product-card__stock ${stockBajo ? 'is-low' : ''}">
          ${producto.stock > 0 ? producto.stock + ' disponibles' : 'Agotado'}
        </span>

        <p class="producto-detalle__desc">${escaparHtml(producto.descripcion || 'Sin descripción disponible.')}</p>

        <div class="producto-detalle__acciones">
          ${!agotado ? `
            <label for="producto-cantidad" class="producto-detalle__label-cantidad">Cantidad</label>
            <input type="number" id="producto-cantidad" value="1" min="1" max="${producto.stock}" />
          ` : ''}
          <button id="btn-agregar-detalle" class="btn btn-primary btn-full" type="button" ${agotado ? 'disabled' : ''}>
            ${agotado ? 'Agotado' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </div>
  `;

  const btnAgregar = document.getElementById('btn-agregar-detalle');
  const inputCantidad = document.getElementById('producto-cantidad');
  if (btnAgregar) {
    btnAgregar.addEventListener('click', () => {
      const cantidad = inputCantidad ? Math.max(1, Number(inputCantidad.value) || 1) : 1;
      agregarAlCarrito(producto, cantidad);
    });
  }
}

cargarProducto();
