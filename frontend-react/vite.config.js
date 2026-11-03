// Configuracion de Vite: el "motor" que corre el proyecto en desarrollo
// (npm run dev) y genera la version final optimizada (npm run build -> carpeta dist/).
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // El plugin de React permite escribir JSX y recarga la pagina al guardar.
  plugins: [react()],
  server: {
    port: 5173,
    open: true, // abre el navegador solo al hacer npm run dev
  },
});
