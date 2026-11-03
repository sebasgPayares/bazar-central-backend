/* ============================================
   Proveedores (solo ADMIN): CRUD con buscador por nombre o NIT.
   Reemplaza proveedores.html + proveedores.js.
   ============================================ */
import { useEffect, useRef, useState } from 'react';
import { ProveedoresAPI } from '../api/proveedores';
import { useToast } from '../context/ToastContext';
import { useTitulo } from '../utils/useTitulo';

const FORM_VACIO = { nombre: '', nit: '', contacto: '', telefono: '', email: '', direccion: '' };

// Los campos opcionales vacios se envian como null
const opcional = (valor) => (valor.trim() === '' ? null : valor.trim());

export default function Proveedores() {
  useTitulo('Proveedores');
  const { mostrarToast } = useToast();

  const [proveedores, setProveedores] = useState([]);
  const [errorCarga, setErrorCarga] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [form, setForm] = useState(FORM_VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  // Referencias a inputs para poner el foco o validar el correo
  const refNombre = useRef(null);
  const refNit = useRef(null);
  const refEmail = useRef(null);

  async function cargarTabla() {
    try {
      setProveedores(await ProveedoresAPI.listar());
      setErrorCarga('');
    } catch (err) {
      setErrorCarga(err.message);
    }
  }

  useEffect(() => {
    cargarTabla();
  }, []);

  const texto = busqueda.trim().toLowerCase();
  const filtrados = !texto ? proveedores : proveedores.filter((p) =>
    (p.nombre || '').toLowerCase().includes(texto) || (p.nit || '').toLowerCase().includes(texto));

  function alCambiar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function editar(proveedor) {
    setEditandoId(proveedor.id);
    setForm({
      nombre: proveedor.nombre || '',
      nit: proveedor.nit || '',
      contacto: proveedor.contacto || '',
      telefono: proveedor.telefono || '',
      email: proveedor.email || '',
      direccion: proveedor.direccion || '',
    });
    setError('');
    refNombre.current?.focus();
  }

  function limpiarFormulario() {
    setEditandoId(null);
    setForm(FORM_VACIO);
    setError('');
  }

  async function eliminar(proveedor) {
    if (!window.confirm(`¿Eliminar al proveedor "${proveedor.nombre}"?`)) return;
    try {
      await ProveedoresAPI.eliminar(proveedor.id);
      if (editandoId === proveedor.id) limpiarFormulario();
      mostrarToast('Proveedor eliminado');
      await cargarTabla();
    } catch (err) {
      mostrarToast(err.message, true);
    }
  }

  async function alEnviar(e) {
    e.preventDefault();
    setError('');

    const nombre = form.nombre.trim();
    const nit = form.nit.trim();
    if (!nombre) { setError('El nombre es obligatorio.'); refNombre.current.focus(); return; }
    if (!nit) { setError('El NIT es obligatorio.'); refNit.current.focus(); return; }
    if (form.email.trim() && !refEmail.current.checkValidity()) {
      setError('El correo no tiene un formato válido.');
      refEmail.current.focus();
      return;
    }

    const payload = {
      nombre,
      nit,
      contacto: opcional(form.contacto),
      telefono: opcional(form.telefono),
      email: opcional(form.email),
      direccion: opcional(form.direccion),
    };

    setGuardando(true);
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
      // Ej.: "Ya existe un proveedor con el NIT ..." (409) o validacion (400)
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  }

  let filaMensaje = '';
  if (errorCarga) filaMensaje = `No se pudo cargar los proveedores: ${errorCarga}`;
  else if (proveedores.length === 0) filaMensaje = 'Todavía no hay proveedores. Agrega el primero desde el formulario.';
  else if (filtrados.length === 0) filaMensaje = 'Ningún proveedor coincide con la búsqueda.';

  return (
    <main>
      <h1 className="page-title">Proveedores</h1>
      <p className="page-subtitle">
        Registra y administra los proveedores del negocio. El NIT no se puede repetir.
      </p>

      <div className="admin-layout">
        <section className="panel-card">
          <h2>{editandoId ? `Editando: ${form.nombre}` : 'Agregar proveedor'}</h2>
          {/* noValidate: validamos nosotros para mostrar mensajes propios */}
          <form id="form-proveedor" noValidate onSubmit={alEnviar}>
            <div className="field">
              <label htmlFor="nombre">Nombre</label>
              <input type="text" id="nombre" name="nombre" maxLength={120} required ref={refNombre}
                value={form.nombre} onChange={alCambiar} />
            </div>

            <div className="field">
              <label htmlFor="nit">NIT</label>
              <input type="text" id="nit" name="nit" maxLength={30} placeholder="900123456-7" required ref={refNit}
                value={form.nit} onChange={alCambiar} />
            </div>

            <div className="field">
              <label htmlFor="contacto">Persona de contacto (opcional)</label>
              <input type="text" id="contacto" name="contacto" maxLength={100}
                value={form.contacto} onChange={alCambiar} />
            </div>

            <div className="field">
              <label htmlFor="telefono">Teléfono (opcional)</label>
              <input type="text" id="telefono" name="telefono" maxLength={20} inputMode="tel"
                value={form.telefono} onChange={alCambiar} />
            </div>

            <div className="field">
              <label htmlFor="email">Correo (opcional)</label>
              <input type="email" id="email" name="email" maxLength={150} placeholder="ventas@proveedor.com"
                ref={refEmail} value={form.email} onChange={alCambiar} />
            </div>

            <div className="field">
              <label htmlFor="direccion">Dirección (opcional)</label>
              <input type="text" id="direccion" name="direccion" maxLength={200}
                value={form.direccion} onChange={alCambiar} />
            </div>

            <p className="form-error">{error}</p>

            <button type="submit" className="btn btn-primary" disabled={guardando}>
              {editandoId ? 'Guardar cambios' : 'Guardar proveedor'}
            </button>
            {editandoId && (
              <button type="button" className="btn btn-secondary" onClick={limpiarFormulario}>
                Cancelar edición
              </button>
            )}
          </form>
        </section>

        <section>
          <div className="field" style={{ padding: '2px 2px 0' }}>
            <label htmlFor="buscar">Buscar por nombre o NIT</label>
            <input type="search" id="buscar" placeholder="Escribe para filtrar..."
              value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Proveedor</th>
                <th>NIT</th>
                <th>Contacto</th>
                <th>Correo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filaMensaje && <tr><td colSpan="5">{filaMensaje}</td></tr>}
              {!errorCarga && filtrados.map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.nombre}</strong>
                    {p.direccion && <><br /><small>{p.direccion}</small></>}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{p.nit}</td>
                  <td>{[p.contacto, p.telefono].filter(Boolean).join(' · ') || '—'}</td>
                  <td>{p.email || '—'}</td>
                  <td>
                    <div className="row-actions">
                      <button className="btn btn-secondary btn-small" onClick={() => editar(p)}>Editar</button>
                      <button className="btn btn-danger btn-small" onClick={() => eliminar(p)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}
