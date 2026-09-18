let TODOS_LOS_PRODUCTOS = [];
let categoriaActiva = 'Todas';
let textoBusqueda = '';

const grid = document.getElementById('grid');
const vacio = document.getElementById('vacio');
const contenedorCategorias = document.getElementById('categorias');
const buscador = document.getElementById('buscador');

async function cargarCatalogo() {
  renderHeader('catalogo');
  try {
    TODOS_LOS_PRODUCTOS = await ProductosAPI.listar();
    renderizarCategorias();
    renderizarGrid();
  } catch (err) {
    grid.innerHTML = '';
    vacio.style.display = 'block';
    vacio.textContent = 'No se pudo conectar con la tienda. ¿Está el backend corriendo en el puerto 8094?';
  }
}

function renderizarCategorias() {
  const categorias = ['Todas', ...new Set(TODOS_LOS_PRODUCTOS.map((p) => p.categoria))];
  contenedorCategorias.innerHTML = '';
  categorias.forEach((cat) => {
    const chip = document.createElement('button');
    chip.className = 'chip' + (cat === categoriaActiva ? ' is-active' : '');
    chip.textContent = cat;
    chip.addEventListener('click', () => {
      categoriaActiva = cat;
      renderizarCategorias();
      renderizarGrid();
    });
    contenedorCategorias.appendChild(chip);
  });
}

function renderizarGrid() {
  const filtrados = TODOS_LOS_PRODUCTOS.filter((p) => {
    const coincideCategoria = categoriaActiva === 'Todas' || p.categoria === categoriaActiva;
    const coincideTexto = p.nombre.toLowerCase().includes(textoBusqueda.toLowerCase());
    return coincideCategoria && coincideTexto;
  });

  grid.innerHTML = '';
  vacio.style.display = filtrados.length === 0 ? 'block' : 'none';
  if (filtrados.length === 0) {
    vacio.textContent = 'No encontramos productos con ese filtro.';
  }

  filtrados.forEach((producto) => {
    const card = document.createElement('article');
    card.className = 'product-card';

    const stockBajo = producto.stock > 0 && producto.stock <= 5;
    const agotado = producto.stock <= 0;
    const tieneImagen = producto.imagenUrl && producto.imagenUrl.trim() !== '';

    card.innerHTML = `
      <a href="producto.html?id=${producto.id}" class="product-card__link">
        <div class="product-card__image-wrap">
          <div class="product-card__placeholder" aria-hidden="true">${emojiParaCategoria(producto.categoria)}</div>
          ${tieneImagen ? `<img class="product-card__image" src="${escaparHtml(producto.imagenUrl)}" alt="${escaparHtml(producto.nombre)}" loading="lazy" onerror="this.remove()">` : ''}
        </div>
        <div class="product-card__body">
          <span class="product-card__category">${escaparHtml(producto.categoria)}</span>
          <h3 class="product-card__name">${escaparHtml(producto.nombre)}</h3>
          <p class="product-card__desc">${escaparHtml(producto.descripcion || '')}</p>
          <div class="product-card__footer">
            <span class="product-card__price">${formatearPrecio(producto.precio)}</span>
            <span class="product-card__stock ${stockBajo ? 'is-low' : ''}">
              ${producto.stock > 0 ? producto.stock + ' disponibles' : 'Agotado'}
            </span>
          </div>
        </div>
      </a>
      <div class="product-card__actions">
        <button class="btn btn-primary btn-full btn-agregar" type="button" ${agotado ? 'disabled' : ''}>
          ${agotado ? 'Agotado' : 'Agregar al carrito'}
        </button>
      </div>
    `;
    card.querySelector('.btn-agregar').addEventListener('click', () => agregarAlCarrito(producto));
    grid.appendChild(card);
  });
}

buscador.addEventListener('input', (e) => {
  textoBusqueda = e.target.value;
  renderizarGrid();
});

cargarCatalogo();
