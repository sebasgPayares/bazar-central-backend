/* Estructura comun de todas las paginas: header arriba, la pagina en
   <Outlet /> y, en tienda y detalle, el panel lateral del carrito. */
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import CarritoDrawer from './CarritoDrawer';

export default function Layout({ conCarrito = false }) {
  const { pathname } = useLocation();

  // En una SPA el navegador no sube solo al cambiar de pagina: lo hacemos aqui
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Header conCarrito={conCarrito} />
      <Outlet />
      {conCarrito && <CarritoDrawer />}
    </>
  );
}
