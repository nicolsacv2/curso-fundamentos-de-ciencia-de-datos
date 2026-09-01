import { C, svg, txt } from '../../../svg/kit.js';
import { box, die } from './shared.js';

/* ═══════════ Entrada · the two games of the Chevalier de Méré ═══════════
   His own count said the games were equal: 4 × (1/6) = 24 × (1/36) = 2/3. The table
   at the casino said otherwise. The real percentages sit at the bottom in red and are
   revealed at the end of the block, after the class has produced its own frequencies. */
export function juegosDeMere() {
  const W = 980, H = 470;
  let b = '';

  /* ── Game 1 ── */
  b += box(30, 30, 445, 250, C.ask);
  b += txt(52, 62, 'JUEGO 1', { fs: 11, fill: C.ask, ls: 1.8 });
  b += txt(52, 92, 'Un dado, cuatro tiros', { fs: 19, fill: C.ink, ff: "'Iowan Old Style', Palatino, Georgia, serif" });
  b += txt(52, 116, 'Gana si sale al menos un 6', { fs: 12.5, fill: C.ink2 });

  const caras1 = [3, 6, 1, 4];
  caras1.forEach((f, i) => {
    b += die(52 + i * 76, 140, 58, f, f === 6);
  });
  b += txt(52, 252, 'UNA RONDA = 4 RESULTADOS', { fs: 10.5, fill: C.ink3, ls: 1.6 });

  /* ── Game 2 ── */
  b += box(505, 30, 445, 250, C.ask);
  b += txt(527, 62, 'JUEGO 2', { fs: 11, fill: C.ask, ls: 1.8 });
  b += txt(527, 92, 'Dos dados, veinticuatro tiros', { fs: 19, fill: C.ink, ff: "'Iowan Old Style', Palatino, Georgia, serif" });
  b += txt(527, 116, 'Gana si sale al menos un doble 6', { fs: 12.5, fill: C.ink2 });

  /* The first row of the 6 × 4 grid the activity draws: six of the 24 throws, each
     pair laid side by side; the fourth pair is the double six. */
  const pares = [[2, 5], [4, 1], [6, 3], [6, 6], [1, 2], [5, 4]];
  pares.forEach(([f1, f2], i) => {
    const x = 527 + i * 70, hot = f1 === 6 && f2 === 6;
    b += die(x, 148, 26, f1, hot);
    b += die(x + 29, 148, 26, f2, hot);
  });
  b += txt(527, 236, '… y así hasta 24', { fs: 12, fill: C.ink3 });
  b += txt(527, 252, 'UNA RONDA = 24 PARES', { fs: 10.5, fill: C.ink3, ls: 1.6 });

  /* ── De Méré's count, which came out equal ── */
  b += box(30, 310, 920, 64);
  b += txt(52, 336, 'LA CUENTA DE MÉRÉ', { fs: 10.5, fill: C.ink3, ls: 1.6 });
  /* Three separate texts: SVG collapses runs of spaces, so the columns are placed,
     not spaced. */
  b += txt(52, 360, '4 tiros × 1/6 = 2/3', { fs: 14, fill: C.ink });
  b += txt(360, 360, '24 tiros × 1/36 = 2/3', { fs: 14, fill: C.ink });
  b += txt(700, 360, '«Son el mismo juego»', { fs: 14, fill: C.ink });

  /* ── What the table said, revealed at the end of the block ── */
  b += txt(30, 412, 'LO QUE DECÍA SU BOLSILLO', { fs: 11, fill: C.reveal, ls: 1.8 });
  b += txt(30, 442, 'Juego 1: gana 51.77 de cada 100 · Juego 2: gana 49.14 de cada 100',
    { fs: 15, fill: C.reveal });
  b += txt(30, 464, 'Con el juego 1 se hizo rico. Con el juego 2, apostando «lo mismo», se arruinó.',
    { fs: 12.5, fill: C.ink2 });

  return svg(W, H,
    'Los dos juegos del caballero de Méré: cuatro tiros de un dado buscando un seis, y ' +
    'veinticuatro tiros de dos dados buscando un doble seis. Su cuenta daba dos tercios ' +
    'para ambos; en realidad el primero gana el 51.77 por ciento de las veces y el ' +
    'segundo el 49.14',
    b);
}
