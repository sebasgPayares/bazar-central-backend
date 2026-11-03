/* Tarjeta de producto del catalogo. Antes se armaba con innerHTML en app.js;
   aqui React escapa el texto solo, asi que ya no hace falta escaparHtml(). */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { formatearPrecio } from '../utils/formato';
import ImagenProducto from './ImagenProducto';

export default function ProductCard({ producto }) {
  const { agregar } = useCarrito();
  const [agregado, setAgregado] = useState(false);

  const agotado = producto.stock <= 0;
  const stockBajo = producto.stock > 0 && producto.stock <= 5;

  function alAgregar() {
    if (agregar(producto)) {
      // Feedback visual de 1,3 s en el boton (antes estaba en efectos.js)
      setAgregado(true);
      setTimeout(() => setAgregado(false), 1300);
    }
  }

  return (
    <article className="product-card">
      <Link to={`/producto/${producto.id}`} className="product-card__link">
        <div className="product-card__image-wrap">
          <ImagenProducto producto={producto} lazy />
        </div>
        <div className="product-card__body">
          <span className="product-card__category">{producto.categoria}</span>
          <h3 className="product-card__name">{producto.nombre}</h3>
          <p className="product-card__desc">{producto.descripcion || ''}</p>
          <div className="product-card__footer">
            <span className="product-card__price">{formatearPrecio(producto.precio)}</span>
            <span className={`product-card__stock${stockBajo ? ' is-low' : ''}`}>
              {agotado ? 'Agotado' : `${producto.stock} disponibles`}
            </span>
          </div>
        </div>
      </Link>
      <div className="product-card__actions">
        <button className={`btn btn-primary btn-full btn-agregar${agregado ? ' agregado' : ''}`}
          type="button" disabled={agotado} onClick={alAgregar}>
          {agotado ? 'Agotado' : agregado ? '✓ Agregado' : 'Agregar al carrito'}
        </button>
      </div>
    </article>
  );
}
