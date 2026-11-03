/* ============================================
   Avisos flotantes (toast). Reemplaza mostrarToast() de api.js.
   Cualquier componente hace:  const { mostrarToast } = useToast();
   ============================================ */
import { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ mensaje: '', esError: false, visible: false });
  const temporizador = useRef(null);

  // useCallback: la funcion es siempre la misma entre renders, asi se puede
  // usar dentro de useEffect sin provocar ciclos.
  const mostrarToast = useCallback((mensaje, esError = false) => {
    setToast({ mensaje, esError, visible: true });
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => {
      setToast((actual) => ({ ...actual, visible: false }));
    }, 3200);
  }, []);

  const clases = ['toast', toast.esError && 'is-error', toast.visible && 'is-visible']
    .filter(Boolean).join(' ');

  return (
    <ToastContext.Provider value={{ mostrarToast }}>
      {children}
      <div className={clases} role="status" aria-live="polite">{toast.mensaje}</div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
