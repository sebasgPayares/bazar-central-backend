/* ============================================
   Carrito de compras. Reemplaza carrito.js.
   Igual que antes: vive en localStorage con una llave por usuario
   (bazarcentral_carrito_<usuario>) o de invitado, y al iniciar sesion
   el carrito del invitado pasa a la cuenta (si la cuenta no tenia uno).
   Al comprar se manda a POST /api/pedidos (lo hace CarritoDrawer).
   ============================================ */
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CarritoContext = createContext(null);
const CLAVE_INVITADO = 'bazarcentral_carrito_invitado';

const claveDe = (sesion) => (sesion ? `bazarcentral_carrito_${sesion.nombreUsuario}` : CLAVE_INVITADO);

function leerCarrito(clave) {
  try {
    const items = JSON.parse(localStorage.getItem(clave) || '[]');
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

// Mueve el carrito de invitado a la cuenta, solo si la cuenta no tenia carrito
function migrarCarritoDeInvitado(claveUsuario) {
  const itemsInvitado = leerCarrito(CLAVE_INVITADO);
  if (itemsInvitado.length > 0 && !localStorage.getItem(claveUsuario)) {
    localStorage.setItem(claveUsuario, JSON.stringify(itemsInvitado));
  }
  localStorage.removeItem(CLAVE_INVITADO);
}

export function CarritoProvider({ children }) {
  const { sesion } = useAuth();
  const { mostrarToast } = useToast();
  const clave = claveDe(sesion);

  // Carga inicial (al abrir la pagina)
  const [items, setItems] = useState(() => {
    if (sesion) migrarCarritoDeInvitado(clave);
    return leerCarrito(clave);
  });
  const [abierto, setAbierto] = useState(false);

  // Si cambia el usuario (login / logout) se carga el carrito que le corresponde
  const claveCargada = useRef(clave);
  useEffect(() => {
    if (claveCargada.current === clave) return;
    claveCargada.current = clave;
    if (sesion) migrarCarritoDeInvitado(clave);
    setItems(leerCarrito(clave));
  }, [clave, sesion]);

  // Toda modificacion pasa por aqui: guarda en localStorage y en el estado
  function guardar(nuevosItems) {
    localStorage.setItem(clave, JSON.stringify(nuevosItems));
    setItems(nuevosItems);
  }

  // Devuelve true si se agrego (lo usan los botones para el "✓ Agregado")
  function agregar(producto, cantidad = 1) {
    const existente = items.find((i) => i.id === producto.id);
    const enCarrito = existente ? existente.cantidad : 0;

    if (enCarrito + cantidad > producto.stock) {
      mostrarToast(`Solo quedan ${producto.stock - enCarrito} unidades disponibles de "${producto.nombre}"`, true);
      return false;
    }

    const nuevos = existente
      ? items.map((i) => (i.id === producto.id ? { ...i, cantidad: i.cantidad + cantidad } : i))
      : [...items, {
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          stockDisponible: producto.stock,
          cantidad,
        }];
    guardar(nuevos);
    mostrarToast(`"${producto.nombre}" agregado al carrito${cantidad > 1 ? ` (x${cantidad})` : ''}`);
    return true;
  }

  function cambiarCantidad(id, delta) {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const nuevaCantidad = item.cantidad + delta;

    if (nuevaCantidad <= 0) return quitar(id);
    if (nuevaCantidad > item.stockDisponible) {
      mostrarToast(`Solo quedan ${item.stockDisponible} unidades disponibles`, true);
      return;
    }
    guardar(items.map((i) => (i.id === id ? { ...i, cantidad: nuevaCantidad } : i)));
  }

  function quitar(id) {
    guardar(items.filter((i) => i.id !== id));
  }

  function vaciar() {
    guardar([]);
  }

  // Valores calculados a partir de items (no se guardan aparte)
  const cantidadTotal = items.reduce((suma, i) => suma + i.cantidad, 0);
  const total = items.reduce((suma, i) => suma + i.precio * i.cantidad, 0);

  const valor = {
    items, cantidadTotal, total,
    agregar, cambiarCantidad, quitar, vaciar,
    abierto,
    abrir: () => setAbierto(true),
    cerrar: () => setAbierto(false),
  };

  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>;
}

export function useCarrito() {
  return useContext(CarritoContext);
}
