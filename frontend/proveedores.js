// Solo ADMIN: si no hay sesion de administrador, redirige a login.html
// (y vuelve aqui despues de iniciar sesion).
if (!protegerSoloAdmin('proveedores')) {
  throw new Error('Sin permisos: redirigiendo a login.');
}
renderHeader('proveedores');

let PROVEEDORES = [];
let editandoId = null;

const tabla = document.getElementById('tabla-proveedores');
const form = document.getElementById('form-proveedor');
const formTitulo = document.getElementById('form-titulo');
const formError = document.getElementById('form-error');
const btnCancelar = document.getElementById('btn-cancelar');
const btnGuardar = document.getElementById('btn-guardar');
const buscador = document.getElementById('buscar');

const campos = {
  nombre: document.getElementById('nombre'),
  nit: document.getElementById('nit'),
  contacto: document.getElementById('contacto'),
  telefono: document.getElementById('telefono'),
  email: document.getElementById('email'),
  direccion: document.getElementById('direccion'),
};

async function cargarTabla() {
  try {
    PROVEEDORES = await ProveedoresAPI.listar();
    renderizarTabla();
  } catch (err) {
    tabla.innerHTML = `<tr><td colspan="5">No se pudo cargar los proveedores: ${escaparHtml(err.message)}</td></tr>`;
  }
}

function proveedoresFiltrados() {
  const texto = buscador.value.trim().toLowerCase();
  if (!texto) return PROVEEDORES;
  return PROVEEDORES.filter((p) =>
    (p.nombre || '').toLowerCase().includes(texto) ||
    (p.nit || '').toLowerCase().includes(texto)
  );
}

function renderizarTabla() {
  const lista = proveedoresFiltrados();

  if (PROVEEDORES.length === 0) {
    tabla.innerHTML = `<tr><td colspan="5">Todavía no hay proveedores. Agrega el primero desde el formulario.</td></tr>`;
    return;
  }
  if (lista.length === 0) {
    tabla.innerHTML = `<tr><td colspan="5">Ningún proveedor coincide con la búsqueda.</td></tr>`;
    return;
  }

  tabla.innerHTML = '';
  lista.forEach((p) => {
    const contacto = [p.contacto, p.telefono].filter(Boolean).map(escaparHtml).join(' · ') || '—';
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>
        <strong>${escaparHtml(p.nombre)}</strong>
        ${p.direccion ? `<br><small>${escaparHtml(p.direccion)}</small>` : ''}
      </td>
      <td style="white-space:nowrap;">${escaparHtml(p.nit)}</td>
      <td>${contacto}</td>
      <td>${p.email ? escaparHtml(p.email) : '—'}</td>
      <td>
        <div class="row-actions">
          <button class="btn btn-secondary btn-small" data-accion="editar" data-id="${p.id}">Editar</button>
          <button class="btn btn-danger btn-small" data-accion="eliminar" data-id="${p.id}">Eliminar</button>
        </div>
      </td>
    `;
    tabla.appendChild(fila);
  });
}

buscador.addEventListener('input', renderizarTabla);

tabla.addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-accion]');
  if (!btn) return;
  const id = Number(btn.dataset.id);
  const accion = btn.dataset.accion;

  try {
    if (accion === 'editar') {
      const proveedor = PROVEEDORES.find((p) => p.id === id);
      cargarFormularioParaEditar(proveedor);
      return; // solo abre el formulario, no recarga la tabla
    }
    if (accion === 'eliminar') {
      const proveedor = PROVEEDORES.find((p) => p.id === id);
      if (!confirm(`¿Eliminar al proveedor "${proveedor ? proveedor.nombre : id}"?`)) return;
      await ProveedoresAPI.eliminar(id);
      if (editandoId === id) limpiarFormulario();
      mostrarToast('Proveedor eliminado');
      await cargarTabla();
    }
  } catch (err) {
    mostrarToast(err.message, true);
  }
});

function cargarFormularioParaEditar(proveedor) {
  editandoId = proveedor.id;
  campos.nombre.value = proveedor.nombre || '';
  campos.nit.value = proveedor.nit || '';
  campos.contacto.value = proveedor.contacto || '';
  campos.telefono.value = proveedor.telefono || '';
  campos.email.value = proveedor.email || '';
  campos.direccion.value = proveedor.direccion || '';
  formTitulo.textContent = `Editando: ${proveedor.nombre}`;
  formError.textContent = '';
  btnGuardar.textContent = 'Guardar cambios';
  btnCancelar.style.display = 'inline-block';
  campos.nombre.focus();
}

function limpiarFormulario() {
  editandoId = null;
  form.reset();
  formTitulo.textContent = 'Agregar proveedor';
  formError.textContent = '';
  btnGuardar.textContent = 'Guardar proveedor';
  btnCancelar.style.display = 'none';
}

btnCancelar.addEventListener('click', limpiarFormulario);

// Los campos opcionales vacios se envian como null.
const opcional = (valor) => {
  const v = valor.trim();
  return v === '' ? null : v;
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  formError.textContent = '';

  const nombre = campos.nombre.value.trim();
  const nit = campos.nit.value.trim();
  if (!nombre) { formError.textContent = 'El nombre es obligatorio.'; campos.nombre.focus(); return; }
  if (!nit) { formError.textContent = 'El NIT es obligatorio.'; campos.nit.focus(); return; }
  if (campos.email.value.trim() && !campos.email.checkValidity()) {
    formError.textContent = 'El correo no tiene un formato válido.';
    campos.email.focus();
    return;
  }

  const payload = {
    nombre,
    nit,
    contacto: opcional(campos.contacto.value),
    telefono: opcional(campos.telefono.value),
    email: opcional(campos.email.value),
    direccion: opcional(campos.direccion.value),
  };

  btnGuardar.disabled = true;
  try {
    if (editandoId) {
      await ProveedoresAPI.actualizar(editandoId, payload);
      mostrarToast('Proveedor actualizado');
    } else {
      await ProveedoresAPI.crear(payload);
      mostrarToast('Proveedor agregado');
    }
    limpiarFormulario();
    await cargarTabla();
  } catch (err) {
    // Ej.: "Ya existe un proveedor con el NIT ..." (409) o errores de validacion (400)
    formError.textContent = err.message;
  } finally {
    btnGuardar.disabled = false;
  }
});

cargarTabla();
