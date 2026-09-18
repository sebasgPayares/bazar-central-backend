// Si no hay sesion de ADMIN, esto redirige a login.html y detiene
// el resto del script (el throw corta la ejecucion de este archivo).
if (!protegerSoloAdmin()) {
  throw new Error('Sin permisos: redirigiendo a login.');
}
renderHeader('panel');

let PRODUCTOS = [];
let editandoId = null;

const tabla = document.getElementById('tabla-productos');
const form = document.getElementById('form-producto');
const formTitulo = document.getElementById('form-titulo');
const formError = document.getElementById('form-error');
const btnCancelar = document.getElementById('btn-cancelar');

const campos = {
  id: document.getElementById('producto-id'),
  nombre: document.getElementById('nombre'),
  descripcion: document.getElementById('descripcion'),
  categoria: document.getElementById('categoria'),
  precio: document.getElementById('precio'),
  stock: document.getElementById('stock'),
  imagenUrl: document.getElementById('imagenUrl'),
};

async function cargarTabla() {
  try {
    PRODUCTOS = await ProductosAPI.listar();
    renderizarTabla();
  } catch (err) {
    tabla.innerHTML = `<tr><td colspan="6">No se pudo conectar con el backend (¿está corriendo en el puerto 8094?)</td></tr>`;
  }
}

function renderizarTabla() {
  if (PRODUCTOS.length === 0) {
    tabla.innerHTML = `<tr><td colspan="6">Todavía no hay productos. Agrega el primero desde el formulario.</td></tr>`;
    return;
  }

  tabla.innerHTML = '';
  PRODUCTOS.forEach((p) => {
    const stockBajo = p.stock <= 5;
    const tieneImagen = p.imagenUrl && p.imagenUrl.trim() !== '';
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>
        <div class="tabla-thumb">
          <span class="tabla-thumb__placeholder">${emojiParaCategoria(p.categoria)}</span>
          ${tieneImagen ? `<img src="${escaparHtml(p.imagenUrl)}" alt="" onerror="this.remove()">` : ''}
        </div>
      </td>
      <td>${escaparHtml(p.nombre)}</td>
      <td>${escaparHtml(p.categoria)}</td>
      <td>${formatearPrecio(p.precio)}</td>
      <td><span class="stock-pill ${stockBajo ? 'is-low' : ''}">${p.stock} un.</span></td>
      <td>
        <div class="row-actions">
          <button class="btn btn-secondary btn-small" data-accion="vender" data-id="${p.id}">-1 (venta)</button>
          <button class="btn btn-secondary btn-small" data-accion="reponer" data-id="${p.id}">+10</button>
          <button class="btn btn-secondary btn-small" data-accion="editar" data-id="${p.id}">Editar</button>
          <button class="btn btn-danger btn-small" data-accion="eliminar" data-id="${p.id}">Eliminar</button>
        </div>
      </td>
    `;
    tabla.appendChild(fila);
  });
}

tabla.addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-accion]');
  if (!btn) return;
  const id = Number(btn.dataset.id);
  const accion = btn.dataset.accion;

  try {
    if (accion === 'vender') {
      await ProductosAPI.ajustarStock(id, -1);
      mostrarToast('Venta registrada: -1 unidad');
    } else if (accion === 'reponer') {
      await ProductosAPI.ajustarStock(id, 10);
      mostrarToast('Stock repuesto: +10 unidades');
    } else if (accion === 'eliminar') {
      if (!confirm('¿Eliminar este producto del catálogo?')) return;
      await ProductosAPI.eliminar(id);
      mostrarToast('Producto eliminado');
    } else if (accion === 'editar') {
      const producto = PRODUCTOS.find((p) => p.id === id);
      cargarFormularioParaEditar(producto);
      return; // no recarga la tabla, solo abre el formulario
    }
    await cargarTabla();
  } catch (err) {
    mostrarToast(err.message, true);
  }
});

function cargarFormularioParaEditar(producto) {
  editandoId = producto.id;
  campos.id.value = producto.id;
  campos.nombre.value = producto.nombre;
  campos.descripcion.value = producto.descripcion || '';
  campos.categoria.value = producto.categoria;
  campos.precio.value = producto.precio;
  campos.stock.value = producto.stock;
  campos.imagenUrl.value = producto.imagenUrl || '';
  formTitulo.textContent = `Editando: ${producto.nombre}`;
  btnCancelar.style.display = 'inline-block';
  campos.nombre.focus();
}

function limpiarFormulario() {
  editandoId = null;
  form.reset();
  formTitulo.textContent = 'Agregar producto';
  formError.textContent = '';
  btnCancelar.style.display = 'none';
}

btnCancelar.addEventListener('click', limpiarFormulario);

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  formError.textContent = '';

  const payload = {
    nombre: campos.nombre.value.trim(),
    descripcion: campos.descripcion.value.trim(),
    categoria: campos.categoria.value.trim(),
    precio: Number(campos.precio.value),
    stock: Number(campos.stock.value),
    imagenUrl: campos.imagenUrl.value.trim() || null,
  };

  try {
    if (editandoId) {
      await ProductosAPI.actualizar(editandoId, payload);
      mostrarToast('Producto actualizado');
    } else {
      await ProductosAPI.crear(payload);
      mostrarToast('Producto agregado al catálogo');
    }
    limpiarFormulario();
    await cargarTabla();
  } catch (err) {
    formError.textContent = err.message;
  }
});

cargarTabla();
