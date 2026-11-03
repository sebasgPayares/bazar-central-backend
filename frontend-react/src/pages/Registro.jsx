/* ============================================
   Registro de clientes. Reemplaza registro.html + registro.js.
   ============================================ */
import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthAPI } from '../api/auth';
import { TiposDocumentoAPI } from '../api/tiposDocumento';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTitulo } from '../utils/useTitulo';

const FORM_VACIO = {
  idTipoDocumento: '',
  numeroDocumento: '',
  nombre: '',
  email: '',
  nombreUsuario: '',
  password: '',
  password2: '',
};

export default function Registro() {
  useTitulo('Crear cuenta');
  const { sesion, esAdmin, iniciarSesion } = useAuth();
  const { mostrarToast } = useToast();

  const [tipos, setTipos] = useState([]);
  const [errorTipos, setErrorTipos] = useState(false);
  const [form, setForm] = useState(FORM_VACIO);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    TiposDocumentoAPI.listar()
      .then((lista) => {
        setTipos(lista);
        // Deja seleccionado el primero, como hacia el <select> antes
        if (lista.length > 0) setForm((f) => ({ ...f, idTipoDocumento: String(lista[0].id) }));
      })
      .catch(() => setErrorTipos(true));
  }, []);

  if (sesion) return <Navigate to={esAdmin ? '/panel' : '/'} replace />;

  // Un solo manejador para todos los inputs: usa el atributo name
  function alCambiar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function alEnviar(e) {
    e.preventDefault();
    setError('');
    if (form.password !== form.password2) {
      setError('Las contraseñas no coinciden');
      return;
    }

    const nombreUsuario = form.nombreUsuario.trim();
    const payload = {
      idTipoDocumento: { id: Number(form.idTipoDocumento) },
      numeroDocumento: form.numeroDocumento.trim(),
      nombre: form.nombre.trim(),
      email: form.email.trim(),
      nombreUsuario,
      password: form.password,
      // El backend siempre crea CLIENTE, pero el DTO exige que el campo venga
      rol: 'CLIENTE',
    };

    setEnviando(true);
    try {
      await AuthAPI.registro(payload);
      // El registro no devuelve token: iniciamos sesion con los mismos datos
      const datos = await iniciarSesion(nombreUsuario, form.password);
      mostrarToast(`¡Cuenta creada! Bienvenido, ${datos.nombre}`);
    } catch (err) {
      setError(err.message);
      setEnviando(false);
    }
  }

  return (
    <main className="auth-main">
      <section className="panel-card auth-card">
        <h1 className="auth-card__title">Crear cuenta</h1>
        <p className="page-subtitle">Regístrate como cliente para poder comprar en Voltio.</p>

        <form onSubmit={alEnviar}>
          <div className="field-row">
            <div className="field">
              <label htmlFor="idTipoDocumento">Tipo de documento</label>
              <select id="idTipoDocumento" name="idTipoDocumento" required
                value={form.idTipoDocumento} onChange={alCambiar}>
                {errorTipos && <option value="">No se pudo cargar</option>}
                {tipos.map((t) => <option key={t.id} value={t.id}>{t.tipo}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="numeroDocumento">Número de documento</label>
              <input type="text" id="numeroDocumento" name="numeroDocumento" required
                value={form.numeroDocumento} onChange={alCambiar} />
            </div>
          </div>

          <div className="field">
            <label htmlFor="nombre">Nombre completo</label>
            <input type="text" id="nombre" name="nombre" required value={form.nombre} onChange={alCambiar} />
          </div>

          <div className="field">
            <label htmlFor="email">Correo electrónico</label>
            <input type="email" id="email" name="email" required autoComplete="email"
              value={form.email} onChange={alCambiar} />
          </div>

          <div className="field">
            <label htmlFor="nombreUsuario">Nombre de usuario</label>
            <input type="text" id="nombreUsuario" name="nombreUsuario" required minLength={4} maxLength={30}
              autoComplete="username" value={form.nombreUsuario} onChange={alCambiar} />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="password">Contraseña</label>
              <input type="password" id="password" name="password" required minLength={6}
                autoComplete="new-password" value={form.password} onChange={alCambiar} />
            </div>
            <div className="field">
              <label htmlFor="password2">Confirmar contraseña</label>
              <input type="password" id="password2" name="password2" required minLength={6}
                autoComplete="new-password" value={form.password2} onChange={alCambiar} />
            </div>
          </div>

          <p className="form-error">{error}</p>

          <button type="submit" className="btn btn-primary btn-full" disabled={enviando}>
            {enviando ? 'Creando cuenta...' : 'Crear mi cuenta'}
          </button>
        </form>

        <p className="auth-card__switch">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </section>
    </main>
  );
}
