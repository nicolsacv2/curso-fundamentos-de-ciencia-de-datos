import { C, svg, txt } from '../../../svg/kit.js';
import {
  ANTES, DESPUES, POR_MEDIA, IMPUTADAS, TABLA, FILAS
} from '../../../data/salon_limpio.js';
import { pline, bar, num, eje, ALTO_ROTULO } from './shared.js';

/* Every id carries the ar-s6- prefix. A repeated one would make a url(#…) resolve to
   another figure's marker, and the figures of six other sessions are one route away.

   Session 6's figures used to live in one module; the change partir-la-sesion-06-en-dos
   cut the entrada into five blocks and the figures went with their block, one module
   each, so that a block downloads only the drawings it shows. */

/* ═══════════ 5 · what each way of filling a hole does to the shape ═══════════
   Three histograms of the same column: as it came, filled by sampling, filled with
   the mean. The third one grows a tower where the mean is, which is the whole
   argument in one picture. */
export function relleno() {
  /* Three lines of prose hang below the histograms, the last at y0 + alto + 98.
     The viewBox has to clear it or SVG crops it without saying anything. */
  const W = 980, H = 390 + ALTO_ROTULO;
  const obs = ANTES.minutos.valores;
  const mues = TABLA.minutos;
  const media = ANTES.minutos.media;
  const conMedia = mues.map((v, i) =>
    String(i + 1) in IMPUTADAS.minutos.valores ? media : v);

  const lo = 0, hi = Math.max(...obs, ...mues);
  const cortes = 10, paso = hi / cortes;
  const cuenta = vals => {
    const c = new Array(cortes).fill(0);
    vals.forEach(v => c[Math.min(cortes - 1, Math.floor(v / paso))]++);
    return c;
  };

  const series = [
    ['COMO LLEGÓ', cuenta(obs), C.ink3, `${obs.length} respuestas`],
    ['RELLENADA MUESTREANDO', cuenta(mues), C.ask, `desviación ${num(DESPUES.minutos.desviacion)}`],
    ['RELLENADA CON LA MEDIA', cuenta(conMedia), C.reveal, `desviación ${num(POR_MEDIA.minutos.desviacion)}`]
  ];

  let b = '';
  const ancho = 288, sep = 20, x0 = 30, y0 = 76, alto = 170;
  const maxC = Math.max(...series.flatMap(s => s[1]));

  series.forEach(([titulo, c, col, pie], k) => {
    const x = x0 + k * (ancho + sep);
    b += txt(x, 28, titulo, { fs: 11, fill: col, ls: 1.6 });
    b += txt(x, 50, pie, { fs: 10.5, fill: C.ink3 });
    b += pline([[x, y0 + alto], [x + ancho, y0 + alto]], C.line, { sw: 1 });
    const w = ancho / cortes;
    c.forEach((n, i) => {
      const h = (n / maxC) * alto;
      b += bar(x + i * w + 1.5, y0 + alto - h, w - 3, h, col, { op: 0.62 });
    });
    b += txt(x, y0 + alto + 18, '0', { fs: 9.5, fill: C.ink3 });
    b += txt(x + ancho, y0 + alto + 18, num(hi), { fs: 9.5, fill: C.ink3, ta: 'end' });
    if (!k) b += eje('y', x, y0 - 8, 'personas', `por tramo · ${FILAS} en total`);
    b += eje('x', x + ancho, y0 + alto + 34, 'minutos ayer');
  });

  const yT = y0 + alto + 54;
  b += txt(30, yT,
    'Muestrear conserva la forma: los valores que entran son valores que ya estaban.',
    { fs: 12.5, fill: C.ask });
  b += txt(30, yT + 22,
    `Rellenar con la media levanta una torre donde está la media y estrecha la columna: ` +
    `${num(DESPUES.minutos.desviacion)} → ${num(POR_MEDIA.minutos.desviacion)} de desviación.`,
    { fs: 12.5, fill: C.reveal });
  b += txt(30, yT + 44,
    'Las dos inventan lo mismo: cinco valores que nadie dio. Solo una lo disimula.',
    { fs: 12.5, fill: C.ink3 });

  return svg(W, H,
    `La variable minutos en tres histogramas: como llegó, rellenada muestreando de la ` +
    `propia columna, y rellenada con la media — esta última levanta una torre en la ` +
    `media y baja la desviación de ${num(DESPUES.minutos.desviacion)} a ` +
    `${num(POR_MEDIA.minutos.desviacion)}`,
    b);
}
