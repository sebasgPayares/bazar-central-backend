renderHeader(null);

const sesionExistente = obtenerSesion();
if (sesionExistente) {
  window.location.href = sesionExistente.rol === 'ADMIN' ? 'panel.html' : 'index.html';
}

const form = document.getElementById('form-registro');
const formError = document.getElementById('form-error');
const selectTipoDoc = document.getElementById('tipoDocumento');

async function cargarTiposDocumento() {
  try {
    const tipos = await TiposDocumentoAPI.listar();
    selectTipoDoc.innerHTML = tipos
      .map((t) => `<option value="${t.id}">${escaparHtml(t.tipo)}</option>`)
      .join('');
  } catch (err) {
    selectTipoDoc.innerHTML = '<option value="">No se pudo cargar</option>';
  }
}
cargarTiposDocumento();

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  formError.textContent = '';

  const password = document.getElementById('password').value;
  const password2 = document.getElementById('password2').value;
  if (password !== password2) {
    formError.textContent = 'Las contraseñas no coinciden';
    return;
  }

  const nombreUsuario = document.getElementById('nombreUsuario').value.trim();

  const payload = {
    idTipoDocumento: { id: Number(selectTipoDoc.value) },
    numeroDocumento: document.getElementById('numeroDocumento').value.trim(),
    nombre: document.getElementById('nombre').value.trim(),
    email: document.getElementById('email').value.trim(),
    nombreUsuario,
    password,
    // El backend ignora este valor y siempre crea CLIENTE, pero la
    // validacion del DTO exige que el campo no venga vacio.
    rol: 'CLIENTE',
  };

  try {
    await AuthAPI.registro(payload);
    // El registro no devuelve token, asi que iniciamos sesion enseguida
    // con las mismas credenciales para no pedirle el login de nuevo.
    const sesion = await AuthAPI.login(nombreUsuario, password);
    guardarSesion(sesion);
    mostrarToast(`¡Cuenta creada! Bienvenido, ${sesion.nombre}`);
    window.location.href = 'index.html';
  } catch (err) {
    formError.textContent = err.message;
  }
});
