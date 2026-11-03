import { Link } from 'react-router-dom';
import { useTitulo } from '../utils/useTitulo';

// Se muestra para cualquier URL que no exista (ruta "*")
export default function NoEncontrado() {
  useTitulo('Página no encontrada');
  return (
    <main>
      <div className="empty-state">
        Esta página no existe.
        <br /><br />
        <Link to="/" className="btn btn-primary btn-small">Volver a la tienda</Link>
      </div>
    </main>
  );
}
