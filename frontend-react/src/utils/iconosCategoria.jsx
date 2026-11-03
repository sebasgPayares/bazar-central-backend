/* Iconos SVG de linea por categoria. Se muestran cuando un producto
   no tiene imagen (o la imagen no carga). Antes era emojiParaCategoria(). */

const ICONOS = {
  celular: <><rect x="7" y="2.5" width="10" height="19" rx="2.5" /><path d="M10.5 18.5h3" /></>,
  computador: <><rect x="4" y="5" width="16" height="11" rx="1.5" /><path d="M2 19h20" /></>,
  audio: <><path d="M4 15v-3a8 8 0 0 1 16 0v3" /><rect x="3" y="14" width="4" height="6" rx="1.5" /><rect x="17" y="14" width="4" height="6" rx="1.5" /></>,
  gaming: <><path d="M7 8h10a4 4 0 0 1 3.9 4.9l-.8 3.6a2.4 2.4 0 0 1-4 1.2L14 16h-4l-2.1 1.7a2.4 2.4 0 0 1-4-1.2l-.8-3.6A4 4 0 0 1 7 8z" /><path d="M8 10.5v3M6.5 12h3M16 11.5h.01M18 13h.01" /></>,
  reloj: <><rect x="7" y="6" width="10" height="12" rx="3" /><path d="M9 6l.6-3h4.8l.6 3M9 18l.6 3h4.8l.6-3M12 10v2.5l1.5 1" /></>,
  tablet: <><rect x="4.5" y="3" width="15" height="18" rx="2.5" /><path d="M11 18h2" /></>,
  tv: <><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></>,
  camara: <><path d="M4 8h3l1.5-2.5h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" /><circle cx="12" cy="13" r="3.5" /></>,
  accesorio: <path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z" />,
  generico: <><path d="M12 2.5 3.5 7v10L12 21.5 20.5 17V7z" /><path d="M3.5 7 12 11.5 20.5 7M12 11.5v10" /></>,
};

// Palabras que, si aparecen en el nombre de la categoria, eligen ese icono
const PALABRAS_CATEGORIA = [
  ['celular', ['celular', 'smartphone', 'telefon', 'movil']],
  ['computador', ['comput', 'portatil', 'laptop', 'pc', 'dispositivo']],
  ['audio', ['audio', 'audifono', 'parlante', 'sonido', 'bocina']],
  ['gaming', ['gaming', 'gamer', 'consola', 'juego', 'videojuego']],
  ['reloj', ['reloj', 'watch', 'wearable', 'smartwatch']],
  ['tablet', ['tablet', 'ipad']],
  ['tv', ['tv', 'televisor', 'pantalla', 'monitor', 'smart tv']],
  ['camara', ['camara', 'cámara', 'foto', 'drone', 'dron']],
  ['accesorio', ['accesorio', 'cargador', 'cable', 'energia', 'energía', 'bateria', 'batería', 'periferico']],
];

function claveIcono(categoria) {
  const texto = (categoria || '').trim().toLowerCase();
  for (const [icono, palabras] of PALABRAS_CATEGORIA) {
    if (palabras.some((p) => texto.includes(p))) return icono;
  }
  return 'generico';
}

export function IconoCategoria({ categoria }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONOS[claveIcono(categoria)]}
    </svg>
  );
}
