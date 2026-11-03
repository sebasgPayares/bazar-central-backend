/* ============================================
   Panel del negocio (solo ADMIN): CRUD de productos y ajuste de stock.
   Reemplaza panel.html + panel.js.
   ============================================ */
import { useEffect, useRef, useState } from 'react';
import { ProductosAPI } from '../api/productos';
import { useToast } from '../context/ToastContext';
import ImagenProducto from '../components/ImagenProducto';
import { formatearPrecio } from '../utils/formato';
import { useTitulo } from '../utils/useTitulo';

const FORM_VACIO = { nombre: '', descripcion: '', categoria: '', precio: '', stock: '', imagenUrl: '' };

export default function PanelProductos() {
  useTitulo('Panel');
  const { mostrarToast } = useToast();

  const [productos, setProductos] = useState([]);
  const [errorCarga, setErrorCarga] = useState('');
  const [form, setForm] = useState(FORM_VACIO);
  const [editandoId, setEditandoId] = useState(null); // null = creando uno nuevo
  const [error, setError] = useState('');
  const inputNombre = useRef(null); // para poner el cursor en "Nombre" al editar

  async function cargarTabla() {
    try {
      setProductos(await ProductosAPI.listar());
      setErrorCarga('');
    } catch (err) {
      setErrorCarga(err.message);
    }
  }

  useEffect(() => {
    cargarTabla();
  }, []);

  function alCambiar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function editar(producto) {
    setEditandoId(producto.id);
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      categoria: producto.categoria,
      precio: producto.precio,
      stock: producto.stock,
      imagenUrl: producto.imagenUrl || '',
    });
    setError('');
    inputNombre.current?.focus();
  }

  function limpiarFormulario() {
    setEditandoId(null);
    setForm(FORM_VACIO);
    setError('');
  }

  async function alEnviar(e) {
    e.preventDefault();
    setError('');
    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      categoria: form.categoria.trim(),
      precio: Number(form.precio),
      stock: Number(form.stock),
      imagenUrl: form.imagenUrl.trim() || null,
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
      setError(err.message);
    }
  }

  // Botones de cada fila: -1 (venta), +10, eliminar
  async function ejecutar(accion, producto) {
    try {
      if (accion === 'vender') {
        await ProductosAPI.ajustarStock(producto.id, -1);
        mostrarToast('Venta registrada: -1 unidad');
      } else if (accion === 'reponer') {
        await ProductosAPI.ajustarStock(producto.id, 10);
        mostrarToast('Stock repuesto: +10 unidades');
      } else if (accion === 'eliminar') {
        if (!window.confirm('¿Eliminar este producto del catálogo?')) return;
        await ProductosAPI.eliminar(producto.id);
        if (editandoId === producto.id) limpiarFormulario();
        mostrarToast('Producto eliminado');
      }
      await cargarTabla();
    } catch (err) {
      mostrarToast(err.message, true);
    }
  }

  let filaMensaje = '';
  if (errorCarga) filaMensaje = `No se pudo conectar con el backend: ${errorCarga}`;
  else if (productos.length === 0) filaMensaje = 'Todavía no hay productos. Agrega el primero desde el formulario.';

  return (
    <main>
      <h1 className="page-title">Panel del negocio</h1>
      <p className="page-subtitle">
        Agrega productos, edítalos y controla el stock. Los cambios se reflejan
        al instante en el catálogo público.
      </p>

      <div className="admin-layout">
        <section className="panel-card">
          <h2>{editandoId ? `Editando: ${form.nombre}` : 'Agregar producto'}</h2>
          <form id="form-producto" onSubmit={alEnviar}>
            <div className="field">
              <label htmlFor="nombre">Nombre</label>
              <input type="text" id="nombre" name="nombre" required ref={inputNombre}
                value={form.nombre} onChange={alCambiar} />
            </div>

            <div className="field">
              <label htmlFor="descripcion">Descripción</label>
              <textarea id="descripcion" name="descripcion" rows="2"
                value={form.descripcion} onChange={alCambiar} />
            </div>

            <div className="field">
              <label htmlFor="categoria">Categoría</label>
              <input type="text" id="categoria" name="categoria" required
                placeholder="Celulares, Audio, Gaming..." value={form.categoria} onChange={alCambiar} />
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="precio">Precio (COP)</label>
                <input type="number" id="precio" name="precio" min="0" step="100" required
                  value={form.precio} onChange={alCambiar} />
              </div>
              <div className="field">
                <label htmlFor="stock">Stock inicial</label>
                <input type="number" id="stock" name="stock" min="0" step="1" required
                  value={form.stock} onChange={alCambiar} />
              </div>
            </div>

            <div className="field">
              <label htmlFor="imagenUrl">URL de imagen (opcional)</label>
              <input type="text" id="imagenUrl" name="imagenUrl" placeholder="https://..."
                value={form.imagenUrl} onChange={alCambiar} />
            </div>

            <p className="form-error">{error}</p>

            <button type="submit" className="btn btn-primary">Guardar producto</button>
            {editandoId && (
              <button type="button" className="btn btn-secondary" onClick={limpiarFormulario}>
                Cancelar edición
              </button>
            )}
          </form>
        </section>

        <section>
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filaMensaje && <tr><td colSpan="6">{filaMensaje}</td></tr>}
              {!errorCarga && productos.map((p) => (
                <tr key={p.id}>
                  <td><ImagenProducto producto={p} enTabla /></td>
                  <td>{p.nombre}</td>
                  <td>{p.categoria}</td>
                  <td>{formatearPrecio(p.precio)}</td>
                  <td><span className={`stock-pill${p.stock <= 5 ? ' is-low' : ''}`}>{p.stock} un.</span></td>
                  <td>
                    <div className="row-actions">
                      <button className="btn btn-secondary btn-small" onClick={() => ejecutar('vender', p)}>-1 (venta)</button>
                      <button className="btn btn-secondary btn-small" onClick={() => ejecutar('reponer', p)}>+10</button>
                      <button className="btn btn-secondary btn-small" onClick={() => editar(p)}>Editar</button>
                      <button className="btn btn-danger btn-small" onClick={() => ejecutar('eliminar', p)}>Eliminar</button>
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
