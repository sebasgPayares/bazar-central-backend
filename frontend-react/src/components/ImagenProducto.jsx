/* Imagen del producto con respaldo: siempre dibuja el icono de la
   categoria y, encima, la foto si existe. Si la foto falla al cargar
   (onError) se quita y queda visible el icono. */
import { useState } from 'react';
import { IconoCategoria } from '../utils/iconosCategoria';

export default function ImagenProducto({ producto, enTabla = false, lazy = false }) {
  const [fallo, setFallo] = useState(false);
  const url = producto.imagenUrl?.trim();
  const mostrarImagen = url && !fallo;

  if (enTabla) {
    return (
      <div className="tabla-thumb">
        <span className="tabla-thumb__placeholder"><IconoCategoria categoria={producto.categoria} /></span>
        {mostrarImagen && <img src={url} alt="" onError={() => setFallo(true)} />}
      </div>
    );
  }

  return (
    <>
      <div className="product-card__placeholder" aria-hidden="true">
        <IconoCategoria categoria={producto.categoria} />
      </div>
      {mostrarImagen && (
        <img className="product-card__image" src={url} alt={producto.nombre}
          loading={lazy ? 'lazy' : undefined} onError={() => setFallo(true)} />
      )}
    </>
  );
}
