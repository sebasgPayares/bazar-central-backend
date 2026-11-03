/* ============================================
   Detalle de un producto: /producto/:id
   Reemplaza producto.html + producto.js (que leia ?id= de la URL).
   ============================================ */
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ProductosAPI } from '../api/productos';
import { useCarrito } from '../context/CarritoContext';
import ImagenProducto from '../components/ImagenProducto';
import { formatearPrecio } from '../utils/formato';
import { useTitulo } from '../utils/useTitulo';

export default function ProductoDetalle() {
  const { id } = useParams(); // el :id de la ruta
  const { agregar } = useCarrito();

  const [producto, setProducto] = useState(null);
  const [estado, setEstado] = useState('cargando'); // 'cargando' | 'listo' | 'no-encontrado'
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);

  useTitulo(producto?.nombre || 'Producto');

  // Se vuelve a ejecutar si cambia el id de la URL
  useEffect(() => {
    setEstado('cargando');
    ProductosAPI.obtener(id)
      .then((datos) => { setProducto(datos); setCantidad(1); setEstado('listo'); })
      .catch(() => setEstado('no-encontrado'));
  }, [id]);

  function alAgregar() {
    const unidades = Math.max(1, Number(cantidad) || 1);
    if (agregar(producto, unidades)) {
      setAgregado(true);
      setTimeout(() => setAgregado(false), 1300);
    }
  }

  let contenido;
  if (estado === 'cargando') {
    contenido = <div className="empty-state">Cargando producto...</div>;
  } else if (estado === 'no-encontrado') {
    contenido = (
      <div className="empty-state">
        No encontramos este producto. Puede que ya no esté disponible.
        <br /><br />
        <Link to="/" className="btn btn-primary btn-small">Volver a la tienda</Link>
      </div>
    );
  } else {
    const agotado = producto.stock <= 0;
    const stockBajo = producto.stock > 0 && producto.stock <= 5;
    contenido = (
      <div className="producto-detalle">
        <div className="producto-detalle__imagen">
          <ImagenProducto producto={producto} />
        </div>

        <div className="producto-detalle__info">
          <span className="product-card__category">{producto.categoria}</span>
          <h1 className="producto-detalle__nombre">{producto.nombre}</h1>
          <p className="producto-detalle__precio">{formatearPrecio(producto.precio)}</p>

          <span className={`product-card__stock${stockBajo ? ' is-low' : ''}`}>
            {agotado ? 'Agotado' : `${producto.stock} disponibles`}
          </span>

          <p className="producto-detalle__desc">{producto.descripcion || 'Sin descripción disponible.'}</p>

          <div className="producto-detalle__acciones">
            {!agotado && (
              <>
                <label htmlFor="producto-cantidad" className="producto-detalle__label-cantidad">Cantidad</label>
                <input type="number" id="producto-cantidad" min="1" max={producto.stock}
                  value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
              </>
            )}
            <button id="btn-agregar-detalle" type="button" disabled={agotado} onClick={alAgregar}
              className={`btn btn-primary btn-full${agregado ? ' agregado' : ''}`}>
              {agotado ? 'Agotado' : agregado ? '✓ Agregado' : 'Agregar al carrito'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main>
      <Link to="/" className="volver-link">&larr; Volver a la tienda</Link>
      {contenido}
    </main>
  );
}
