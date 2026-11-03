import { apiFetch } from './cliente';

// Lista publica de tipos de documento para el formulario de registro
export const TiposDocumentoAPI = {
  listar: () => apiFetch('/tipos-documento'),
};
