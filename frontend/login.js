renderHeader(null);

// Si ya hay sesion, no tiene sentido ver el login de nuevo.
const sesionExistente = obtenerSesion();
if (sesionExistente) {
  window.location.href = sesionExistente.rol === 'ADMIN' ? 'panel.html' : 'index.html';
}

const form = document.getElementById('form-login');
const formError = document.getElementById('form-error');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  formError.textContent = '';

  const nombreUsuario = document.getElementById('nombreUsuario').value.trim();
  const password = document.getElementById('password').value;

  try {
    const respuesta = await AuthAPI.login(nombreUsuario, password);
    guardarSesion(respuesta);
    mostrarToast(`¡Hola, ${respuesta.nombre}!`);

    // A donde volver: si venia de un destino especifico, o segun el rol.
    const params = new URLSearchParams(window.location.search);
    const destino = params.get('destino');
    if (destino === 'panel' && respuesta.rol === 'ADMIN') {
      window.location.href = 'panel.html';
    } else {
      window.location.href = 'index.html';
    }
  } catch (err) {
    formError.textContent = err.message;
  }
});
