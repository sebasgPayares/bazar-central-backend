import { apiFetch, conCuerpo } from './cliente';

// Endpoints publicos de autenticacion (/api/auth/**)
export const AuthAPI = {
  // El backend (LoginRequestDTO) espera { nombreUsuario, password }
  // y responde { token, nombreUsuario, nombre, rol }
  login: (nombreUsuario, password) =>
    apiFetch('/auth/login', conCuerpo('POST', { nombreUsuario, password })),
  registro: (usuario) => apiFetch('/auth/registro', conCuerpo('POST', usuario)),
};
