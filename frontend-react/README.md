# Voltio — Frontend en React

Migración del frontend de Voltio (antes HTML + CSS + JavaScript puro, carpeta `frontend/`) a **React + Vite + React Router**.
El backend (Spring Boot en Railway) **no cambió**: se usan exactamente los mismos endpoints.

---

## 1. Instalar el entorno (una sola vez)

Eclipse sirve para el backend, pero para React se usa otro editor.

1. **Node.js LTS**: descárgalo de <https://nodejs.org> (botón "LTS") e instálalo con las opciones por defecto.
   Trae `npm`, el gestor de paquetes. Verifica en una terminal nueva (PowerShell):
   ```
   node -v
   npm -v
   ```
   `node -v` debe mostrar `v22` o superior (Vite 7 lo necesita).
2. **Visual Studio Code**: <https://code.visualstudio.com>. Es el editor recomendado para React.
   Extensión útil (opcional): *ES7+ React/Redux/React-Native snippets*.
3. Git ya lo tienes porque clonaste el repo.

## 2. Ejecutar en local

```powershell
cd C:\Proyectos\bazar-clon\frontend-react
npm install        # solo la primera vez (o cuando cambie package.json): descarga React, Vite...
npm run dev        # arranca en http://localhost:5173 y abre el navegador
```

- Al guardar un archivo, la página se actualiza sola.
- Por defecto se conecta al **backend de Railway** (archivo `.env`).
- Para usar el backend de tu PC (Eclipse, puerto 8094), crea un archivo `frontend-react/.env.local` con:
  ```
  VITE_API_URL=http://localhost:8094/api
  ```
  y reinicia `npm run dev`. Ese archivo no se sube a git.
- Para detener el servidor: `Ctrl + C` en la terminal.

## 3. Estructura y qué hace cada pieza

```
frontend-react/
├── index.html                ← única página HTML: React dibuja todo dentro de <div id="root">
├── package.json              ← dependencias y scripts (dev, build, preview)
├── vite.config.js            ← configuración de Vite (plugin de React, puerto)
├── .env / .env.example       ← VITE_API_URL: dirección del backend
├── netlify.toml              ← cómo construir el proyecto en Netlify
├── public/_redirects         ← le dice a Netlify que toda URL sirva index.html (SPA)
└── src/
    ├── main.jsx              ← punto de entrada: monta React y los "providers"
    ├── App.jsx               ← tabla de rutas (qué página va en cada URL)
    ├── styles/style.css      ← el mismo CSS de antes, sin cambios
    ├── api/                  ← comunicación con el backend
    │   ├── cliente.js        ← apiFetch(): token Bearer, JSON y errores (data.mensaje)
    │   ├── auth.js · productos.js · pedidos.js · proveedores.js · tiposDocumento.js
    ├── context/              ← estado global compartido
    │   ├── AuthContext.jsx   ← sesión (token, nombre, rol), login y logout
    │   ├── CarritoContext.jsx← carrito por usuario en localStorage
    │   └── ToastContext.jsx  ← avisos flotantes
    ├── routes/
    │   └── RutaProtegida.jsx ← bloquea páginas sin sesión o sin rol ADMIN
    ├── components/           ← piezas reutilizables
    │   ├── Layout.jsx · Header.jsx · Footer.jsx · CarritoDrawer.jsx
    │   ├── ProductCard.jsx · ImagenProducto.jsx · PedidoCard.jsx
    ├── pages/                ← una por pantalla
    │   ├── Catalogo.jsx · ProductoDetalle.jsx · Login.jsx · Registro.jsx · MisPedidos.jsx
    │   ├── PanelProductos.jsx · PanelPedidos.jsx · Proveedores.jsx · NoEncontrado.jsx
    └── utils/
        ├── formato.js        ← formatearPrecio (COP), formatearFecha, estados de pedido
        ├── iconosCategoria.jsx ← íconos SVG por categoría
        └── useTitulo.js      ← cambia el título de la pestaña
```

### Equivalencias con la versión anterior

| Antes (JS puro) | Ahora (React) |
|---|---|
| `index.html` + `app.js` | `pages/Catalogo.jsx` + `components/ProductCard.jsx` |
| `producto.html?id=5` + `producto.js` | `/producto/5` → `pages/ProductoDetalle.jsx` |
| `login.html` / `registro.html` | `pages/Login.jsx` / `pages/Registro.jsx` |
| `mis-pedidos.html` | `pages/MisPedidos.jsx` |
| `panel.html` / `panel-pedidos.html` / `proveedores.html` | `/panel`, `/panel/pedidos`, `/panel/proveedores` |
| `api.js` (`apiFetch`, `ProductosAPI`...) | `api/*.js` |
| `obtenerSesion()`, `guardarSesion()`, `cerrarSesion()` | `context/AuthContext.jsx` → `useAuth()` |
| `renderHeader()` | `components/Header.jsx` |
| `protegerSoloAdmin()` / `protegerRequiereSesion()` | `routes/RutaProtegida.jsx` |
| `carrito.js` | `context/CarritoContext.jsx` + `components/CarritoDrawer.jsx` |
| `mostrarToast()` | `context/ToastContext.jsx` → `useToast()` |
| `efectos.js` | sombra y animación en `Header.jsx`, "✓ Agregado" en `ProductCard.jsx` |
| `escaparHtml()` | ya no hace falta: React escapa el texto automáticamente |
| `API_BASE` escrito en el código | variable de entorno `VITE_API_URL` |

Se conservan las mismas llaves de `localStorage` (`bazarcentral_sesion`, `bazarcentral_carrito_<usuario>`,
`bazarcentral_carrito_invitado`), así que quien ya tenía sesión o carrito los conserva.

## 4. Conceptos para explicar al profesor

- **SPA (Single Page Application):** hay un solo `index.html`. Al cambiar de página no se recarga el navegador;
  React Router cambia el componente que se muestra según la URL. Por eso Netlify necesita `_redirects`:
  si alguien abre directamente `/panel`, Netlify debe devolver `index.html` y React decide qué mostrar.
- **Componente:** una función que devuelve JSX (HTML dentro de JavaScript). Ej.: `ProductCard` recibe un producto
  por **props** y dibuja la tarjeta.
- **Estado (`useState`):** datos que, al cambiar, hacen que React vuelva a dibujar. Ej.: la lista de productos,
  el texto del buscador, la categoría activa. Antes había que llamar `renderizarGrid()` a mano; ahora React lo hace solo.
- **`useEffect`:** código que se ejecuta después de dibujar. Se usa para pedir datos a la API al abrir una página
  (`[]` = una sola vez) o cuando cambia algo (`[id]` en el detalle).
- **Context (`createContext` + `useContext`):** comparte datos con toda la app sin pasarlos de componente en componente.
  Hay tres: sesión, carrito y avisos. Están anidados en `main.jsx` porque el carrito depende de la sesión.
- **Rutas protegidas:** `RutaProtegida` revisa la sesión antes de mostrar una página y redirige al login
  recordando a dónde iba. **Es solo para la interfaz**: la seguridad real está en el backend (Spring Security + JWT),
  que responde 401/403 aunque alguien manipule el frontend.
- **Sesión expirada:** el JWT dura 24 h. Si el backend responde 401 a una petición que llevaba token,
  `apiFetch` avisa al `AuthContext`, que cierra la sesión y pide iniciar de nuevo.
- **Inputs controlados:** el valor de cada campo vive en el estado (`value` + `onChange`), así React siempre sabe
  qué contiene el formulario.
- **Seguridad contra XSS:** antes se usaba `innerHTML` y había que escapar el texto con `escaparHtml()`.
  JSX escapa todo automáticamente.
- **Variables de entorno:** `VITE_API_URL` permite cambiar de backend (local o Railway) sin tocar código.
  Vite solo expone al navegador las variables que empiezan con `VITE_`. No es un secreto: cualquier URL
  que use el navegador es pública.

## 5. Subirlo a GitHub (rama + Pull Request)

Desde `C:\Proyectos\bazar-clon` (PowerShell o Git Bash):

```bash
git checkout master
git pull origin master
git checkout -b feature/frontend-react
# copia aquí la carpeta frontend-react/ (sin node_modules ni dist)
git add frontend-react
git commit -m "Migra el frontend a React con Vite y React Router"
git push -u origin feature/frontend-react
```

Luego en GitHub abre el **Pull Request** de `feature/frontend-react` hacia `master` y haz el merge.
Railway seguirá desplegando el backend igual: solo mira el proyecto Java de la raíz (`pom.xml`),
la carpeta `frontend-react/` no le afecta.

> Después de `npm install` se crea `package-lock.json`: súbelo también a git (fija las versiones exactas).
> `node_modules/` y `dist/` **no** se suben (están en `.gitignore`).

## 6. Desplegar en Netlify

Usa **el mismo sitio** que ya tienes, así se conserva la URL.

### Opción A — Arrastrar la carpeta (como lo hacías antes)

```powershell
cd C:\Proyectos\bazar-clon\frontend-react
npm run build
```

Se crea la carpeta `frontend-react/dist/`. En Netlify: tu sitio → **Deploys** → arrastra la carpeta **`dist`**
(no `frontend-react`). El archivo `_redirects` ya va incluido dentro de `dist`.

### Opción B — Despliegue automático desde GitHub (recomendada a futuro)

1. En Netlify: tu sitio → **Site configuration** → **Build & deploy** → **Link repository** → elige
   `sebasgPayares/bazar-central-backend`.
2. Configura:
   - **Branch to deploy:** `master`
   - **Base directory:** `frontend-react`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend-react/dist`
3. Guarda. Cada merge a `master` desplegará el frontend en Netlify y el backend en Railway.

(Opcional) En **Site configuration → Environment variables** puedes definir `VITE_API_URL`;
si no lo haces, se usa el valor del archivo `.env`.

### Comprobar después de desplegar

- Abre directamente `https://<tu-sitio>.netlify.app/panel`: debe pedir login (no un 404 de Netlify).
- Inicia sesión como cliente, compra algo y revisa **Mis pedidos**.
- Inicia sesión como admin y prueba el panel, los pedidos y los proveedores.

## 7. Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | servidor de desarrollo con recarga automática |
| `npm run build` | genera la versión optimizada en `dist/` |
| `npm run preview` | sirve `dist/` en local para revisarla antes de subirla |
