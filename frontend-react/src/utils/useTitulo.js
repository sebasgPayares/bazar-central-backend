import { useEffect } from 'react';

// Hook propio: cambia el titulo de la pestana del navegador en cada pagina.
export function useTitulo(titulo) {
  useEffect(() => {
    document.title = titulo ? `Voltio — ${titulo}` : 'Voltio — Tecnología que prende';
  }, [titulo]);
}
