import { C, svg, txt } from '../../../svg/kit.js';
import {
  ANTES, CAJAS, DESCARTADA, RAROS, ORDINALES, FILAS
} from '../../../data/salon_limpio.js';
import { RECUENTOS, ORDEN_NIVELES } from '../../../data/salon.js';
import { nombre } from '../../../data/nombres.js';
import { box, dot, pline, bar, scale, num, eje, ALTO_ROTULO } from './shared.js';

/* Every id carries the ar-s6- prefix. A repeated one would make a url(#…) resolve to
   another figure's marker, and the figures of six other sessions are one route away.

   Session 6's figures used to live in one module; the change partir-la-sesion-06-en-dos
   cut the entrada into five blocks and the figures went with their block, one module
   each, so that a block downloads only the drawings it shows. */

/* ═══════════ 2 · a box per quantitative variable ═══════════
   Drawn in each column's own units, one row each, because a shared axis would put
   «minutos ayer» and «mascotas» on the same scale and flatten nine of them. */
export function cajas() {
  const claves = Object.keys(CAJAS);
  const W = 980, fila = 52, y0 = 74, H = y0 + claves.length * fila + 58 + ALTO_ROTULO;
  let b = '';

  b += txt(30, 28, 'UNA CAJA POR VARIABLE, EN SUS PROPIAS UNIDADES',
    { fs: 11, fill: C.ask, ls: 1.8 });
  b += txt(30, 50, 'la caja va de Q1 a Q3 · la línea es la mediana · los bigotes llegan al último valor dentro del corte',
    { fs: 10.5, fill: C.ink3 });

  const xL = 30, xNom = 148, x0 = 168, x1 = 930;

  claves.forEach((c, i) => {
    const d = CAJAS[c], q = d['1.5'], y = y0 + i * fila + 18;
    const vals = ANTES[c].valores;
    const lo = Math.min(...vals), hi = Math.max(...vals);
    const s = scale([lo, hi], [x0, x1]);
    const med = ANTES[c].mediana;

    b += txt(xL, y + 4, nombre(c), { fs: 11.5, fill: C.ink2 });
    b += txt(xNom, y + 4, `n=${ANTES[c].n}`, { fs: 10, fill: C.ink3, ta: 'end' });
    /* The unit of THIS row. Every row has its own scale, so a label on the figure as a
       whole would be a lie: «mascotas» and «minutos ayer» share nothing but the width. */
    b += txt(xL, y + 18, ANTES[c].rotulo, { fs: 9.5, fill: C.ink3 });
    b += txt(x0, y + 22, num(lo), { fs: 9, fill: C.ink3 });
    b += txt(x1, y + 22, num(hi), { fs: 9, fill: C.ink3, ta: 'end' });

    /* whiskers, then the box over them */
    b += pline([[s(q.bigoteBajo), y], [s(q.bigoteAlto), y]], C.line, { sw: 1.2 });
    [q.bigoteBajo, q.bigoteAlto].forEach(v =>
      b += pline([[s(v), y - 7], [s(v), y + 7]], C.line, { sw: 1.2 }));
    b += box(s(q.q1), y - 11, Math.max(2, s(q.q3) - s(q.q1)), 22, null,
      { fill: C.ground2, stroke: C.ink3 });
    b += pline([[s(med), y - 11], [s(med), y + 11]], C.ink, { sw: 2 });

    /* every value as a faint dot, so the box is visibly a summary of something */
    vals.forEach(v => b += dot(s(v), y, 2, C.ink3, { op: 0.45 }));
    /* and what the rule leaves outside */
    q.atipicos.forEach(v => b += dot(s(v), y, 4, C.reveal, { op: 0.95 }));

    b += txt(x0, y + 22, num(lo), { fs: 9.5, fill: C.ink3 });
    b += txt(x1, y + 22, num(hi), { fs: 9.5, fill: C.ink3, ta: 'end' });
    if (q.atipicos.length) {
      b += txt(s(q.atipicos[q.atipicos.length - 1]), y - 16,
        `${q.atipicos.length} fuera`, { fs: 10, fill: C.reveal, ta: 'middle' });
    }
  });

  const yP = y0 + claves.length * fila + 26;
  b += txt(30, yP, 'Q1 − 1,5·RIC   y   Q3 + 1,5·RIC', { fs: 11.5, fill: C.ink2 });
  b += txt(30, yP + 20,
    'ese 1,5 es una decisión, no un hecho: con 3 en vez de 1,5 salen menos puntos, y los mismos datos.',
    { fs: 10.5, fill: C.ink3 });
  b += dot(640, yP - 4, 4, C.reveal);
  b += txt(652, yP, 'lo que la regla deja fuera', { fs: 10.5, fill: C.reveal });
  b += eje('x', 930, H - 10,
    'cada fila en las unidades de su propia variable — las filas NO comparten escala');

  return svg(W, H,
    `Un diagrama de caja por cada una de las ${claves.length} variables cuantitativas, ` +
    `cada uno en las unidades de su columna, con los puntos que la regla de 1,5 ` +
    `rangos intercuartílicos deja fuera marcados`,
    b);
}

/* ═══════════ 3 · the column that does not survive ═══════════
   Twenty-seven cells, one per person, each coloured by what would have to happen to
   it. The figure exists so that «more than half» is something you see before you
   read it. */
export function descarte() {
  const W = 980, H = 300;
  const d = DESCARTADA.pantalla;
  const huecos = new Set(RECUENTOS.pantallaFilasVacias);
  const fuera = new Set(CAJAS.pantalla.filas);
  let b = '';

  b += txt(30, 28, 'LA VARIABLE PANTALLA, CELDA A CELDA', { fs: 11, fill: C.ask, ls: 1.8 });
  b += txt(30, 50,
    `una celda por persona — las ${d.filas} de la tabla, en su mismo orden de fila`,
    { fs: 10.5, fill: C.ink3 });

  const lado = 54, sep = 10, x0 = 30, y0 = 70, porFila = 14;
  for (let n = 1; n <= d.filas; n++) {
    const i = n - 1;
    const x = x0 + (i % porFila) * (lado + sep);
    const y = y0 + Math.floor(i / porFila) * (lado + sep);
    const esHueco = huecos.has(n), esFuera = fuera.has(n);
    const col = esFuera ? C.reveal : esHueco ? C.ink3 : C.ask;
    b += box(x, y, lado, lado, null, {
      fill: esHueco ? 'none' : C.ground2,
      stroke: col,
      dash: esHueco ? '3 3' : null
    });
    b += txt(x + lado / 2, y + lado / 2 + 5, String(n),
      { fs: 12, fill: esHueco ? C.ink3 : col, ta: 'middle' });
  }

  const yL = y0 + 2 * (lado + sep) + 30;
  [[C.reveal, `${d.atipicos} que la regla deja fuera`, false],
   [C.ink3, `${d.huecos} que nadie respondió`, true],
   [C.ask, `${d.filas - d.perdidos} que se quedarían como están`, false]
  ].forEach(([col, etiqueta, dash], i) => {
    const x = 30 + i * 306;
    b += box(x, yL - 13, 17, 17, null,
      { fill: dash ? 'none' : C.ground2, stroke: col, dash: dash ? '3 3' : null });
    b += txt(x + 27, yL, etiqueta, { fs: 11.5, fill: C.ink2 });
  });

  b += txt(30, yL + 44,
    `${d.perdidos} de ${d.filas} — el ${num(d.porcentaje)} % de la columna — habría que imputarlos.`,
    { fs: 15, fill: C.reveal });
  b += txt(30, yL + 68,
    'Por eso esta columna no entra al análisis. Descartar también es un resultado.',
    { fs: 12.5, fill: C.ink2 });

  return svg(W, H,
    `Las ${d.filas} celdas de la variable pantalla: ${d.atipicos} que la regla de la caja ` +
    `deja fuera, ${d.huecos} que nadie respondió, y ${d.filas - d.perdidos} que se quedarían ` +
    `como están; es decir, el ${num(d.porcentaje)} por ciento habría que imputarlo`,
    b);
}

/* ═══════════ 4 · what a rank gets instead of a box ═══════════ */
export function niveles() {
  /* Both ordinals, not just the numeric one. Which is the whole point of the step:
     what makes a variable a rank is that its levels are ordered, not that they are
     written with digits, and «S · M · L · XL» is the case that shows it. */
  const claves = ORDINALES;
  const banda = 210, y0 = 84;
  const W = 980, H = y0 + claves.length * banda + 20 + ALTO_ROTULO;
  let b = '';

  b += txt(30, 28, 'LAS VARIABLES QUE SON UN ORDEN, NO UNA CANTIDAD',
    { fs: 11, fill: C.ask, ls: 1.8 });
  b += txt(30, 50,
    'no llevan caja — los extremos de una escala acotada son respuestas, no anomalías',
    { fs: 10.5, fill: C.ink3 });

  claves.forEach((clave, k) => {
    const r = RAROS[clave];
    const yb = y0 + k * banda;
    const niveles = ORDEN_NIVELES[clave]
      ? ORDEN_NIVELES[clave].map(v => v.toLowerCase()).filter(v => v in r.reparto)
      : Object.keys(r.reparto);
    const maxN = Math.max(...Object.values(r.reparto));
    const ancho = Math.min(120, (820 - (niveles.length - 1) * 30) / niveles.length);
    const x0 = 70, sep = 30, alto = 112;
    const h = n => (n / maxN) * alto;
    const exento = v => r.extremosDevueltos.includes(v);

    b += txt(30, yb - 8, `${nombre(clave)} · ${r.rotulo}`, { fs: 12.5, fill: C.ink });
    b += eje('y', 30, yb + 12, 'personas', `${FILAS} en total`);

    niveles.forEach((nivel, i) => {
      const x = x0 + i * (ancho + sep);
      const n = r.reparto[nivel];
      const agrupado = r.agrupados.includes(nivel);
      const color = agrupado ? C.reveal : exento(nivel) ? '#C9A227' : C.ask;
      b += bar(x, yb + alto - h(n), ancho, h(n), color,
        { op: agrupado || exento(nivel) ? 0.85 : 0.55 });
      b += txt(x + ancho / 2, yb + alto + 20, nivel, { fs: 14, fill: C.ink, ta: 'middle' });
      b += txt(x + ancho / 2, yb + alto - h(n) - 10, `${n}`,
        { fs: 12, fill: agrupado ? C.reveal : exento(nivel) ? '#C9A227' : C.ink2,
          ta: 'middle' });
    });

    /* The threshold, drawn where it actually falls. What crosses below it and stays
       is the exception, and it is drawn in its own colour so it is not read as an
       oversight. */
    const yU = yb + alto - h(r.minimo);
    const xFin = x0 + niveles.length * (ancho + sep) - sep;
    b += pline([[x0 - 26, yU], [xFin + 10, yU]], C.reveal, { sw: 1, dash: '4 4' });
    b += txt(x0 - 32, yU + 4, `${r.minimo}`, { fs: 10.5, fill: C.reveal, ta: 'end' });

    const devueltos = r.extremosDevueltos.map(v => `«${v}»`).join(' y ');
    const agrupados = r.agrupados.map(v => `«${v}»`).join(' y ');
    b += txt(30, yb + alto + 52,
      devueltos
        ? `${devueltos} está por debajo del umbral y se queda: es el extremo de la escala.`
        : 'ningún nivel cae por debajo del umbral.',
      { fs: 12.5, fill: devueltos ? '#C9A227' : C.ink3 });
    if (agrupados) {
      b += txt(30, yb + alto + 74, `Se agrupa ${agrupados} en «${r.etiqueta}».`,
        { fs: 12.5, fill: C.ink3 });
    }
  });

  b += eje('x', 930, H - 10, 'niveles de la escala, en su orden');
  return svg(W, H,
    `Los niveles de las ${claves.length} variables ordinales con cuántas personas ` +
    `eligió cada uno, y el umbral por debajo del cual un nivel se agruparía: los ` +
    `extremos de la escala quedan exentos`,
    b);
}
