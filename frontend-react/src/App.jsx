/* ============================================
   Tabla de rutas de la aplicacion (React Router).
   Cada <Route> asocia una URL con una pagina.
   ============================================ */
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import RutaProtegida from './routes/RutaProtegida';
import Catalogo from './pages/Catalogo';
import ProductoDetalle from './pages/ProductoDetalle';
import Login from './pages/Login';
import Registro from './pages/Registro';
import MisPedidos from './pages/MisPedidos';
import PanelProductos from './pages/PanelProductos';
import PanelPedidos from './pages/PanelPedidos';
import Proveedores from './pages/Proveedores';
import NoEncontrado from './pages/NoEncontrado';

export default function App() {
  return (
    <Routes>
      {/* Tienda y detalle: llevan el carrito lateral */}
      <Route element={<Layout conCarrito />}>
        <Route path="/" element={<Catalogo />} />
        <Route path="/producto/:id" element={<ProductoDetalle />} />
      </Route>

      <Route element={<Layout />}>
        {/* Publicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Requieren sesion (CLIENTE o ADMIN) */}
        <Route element={<RutaProtegida />}>
          <Route path="/mis-pedidos" element={<MisPedidos />} />
        </Route>

        {/* Solo ADMIN */}
        <Route path="/panel" element={<RutaProtegida soloAdmin />}>
          <Route index element={<PanelProductos />} />
          <Route path="pedidos" element={<PanelPedidos />} />
          <Route path="proveedores" element={<Proveedores />} />
        </Route>

        <Route path="*" element={<NoEncontrado />} />
      </Route>
    </Routes>
  );
}
