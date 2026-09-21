import { C, svg, txt, arrow, wrap } from '../../../svg/kit.js';
import {
  TEXTO, ANTES, CAJAS, DESCARTADA, RAROS, DESPUES, POR_MEDIA, IMPUTADAS, TABLA, PCA,
  NO_NUMERICAS, DIAGNOSTICO, NO_ANALIZABLES, UMBRALES, FORMAS, ORDINALES, FILAS,
  MATRICES
} from '../../../data/salon_limpio.js';
import { RECUENTOS, ORDEN_NIVELES } from '../../../data/salon.js';
import { nombre } from '../../../data/nombres.js';
import { box, dot, pline, bar, scale, num, eje, ALTO_ROTULO, MONO,
  panelDispersion, panelHistograma, panelCajas, panelMosaico, CATEGORICO } from './shared.js';

/* Every id carries the ar-s6- prefix. A repeated one would make a url(#…) resolve to
   another figure's marker, and the figures of five other sessions are one route away. */

/* ═══════════ 1 · what each treatment does to the text ═══════════
   The funnel of session 3 again, but now as a pipeline: one column, four steps, and
   the count of distinct categories after each. The point is that the drop is not in
   the step everybody expects. */
export function textoPasos() {
  /* The summary strip below the two examples ends at yT + 34 + 6*22 + 16 = yE + 290,
     with yE = 300. A viewBox that stopped at the old 380 would crop the whole thing
     without a word, which is the failure mode this file warns about three times. */
  const W = 980, H = 620;
  let b = arrow('ar-s6-txt', C.ask);

  const col = TEXTO.municipio;
  const etapas = [
    ['como llegó', col.crudo, 'tal cual lo escribió cada quien'],
    ['recortar', col.pasos[0][1], 'fuera los espacios de los extremos'],
    ['sin tildes', col.pasos[1][1], '«Bogotá» y «Bogota» dejan de ser dos'],
    ['minúsculas', col.pasos[2][1], 'y «BOGOTÁ» tampoco es una tercera'],
    ['sin palabras vacías', col.pasos[3][1], 'fuera «de», «d», «c», «dc»…']
  ];

  b += txt(30, 28, 'LA VARIABLE MUNICIPIO, PASO A PASO', { fs: 11, fill: C.ask, ls: 1.8 });

  const x0 = 30, ancho = 168, sep = 20, y0 = 60, alto = 132;
  const maxN = etapas[0][1];
  etapas.forEach(([nombre, n, pie], i) => {
    const x = x0 + i * (ancho + sep);
    const ultimo = i === etapas.length - 1;
    b += box(x, y0, ancho, alto, ultimo ? C.ask : C.line);
    b += txt(x + 14, y0 + 26, nombre, { fs: 11.5, fill: ultimo ? C.ask : C.ink2 });
    b += txt(x + 14, y0 + 78, String(n), { fs: 40, fill: C.ink, ff: MONO });
    b += txt(x + 14, y0 + 104, n === 1 ? 'categoría' : 'categorías',
      { fs: 11, fill: C.ink3 });
    if (i) {
      const caida = etapas[i - 1][1] - n;
      b += `<path d="M${x - sep + 2},${y0 + alto / 2} H${x - 3}" fill="none"
        stroke="${C.line}" stroke-width="1.2" marker-end="url(#ar-s6-txt)"/>`;
      if (caida) {
        b += txt(x - sep / 2, y0 + alto / 2 - 12, `−${caida}`,
          { fs: 11, fill: C.ask, ta: 'middle' });
      }
    }
    wrap(pie, 24).forEach((l, k) =>
      b += txt(x + 14, y0 + alto + 24 + k * 15, l, { fs: 10.5, fill: C.ink3 }));
  });

  /* The same four steps on the column where the fourth one is the only one that
     does anything: a book title is a sentence, and a sentence is mostly glue. */
  const ej = TEXTO.libro.ejemplo;
  const yE = 300;
  b += txt(30, yE - 12, 'Y SOBRE UN TÍTULO DE LIBRO', { fs: 11, fill: C.ask, ls: 1.8 });
  b += txt(30, yE + 16, `«${ej[0].slice(0, 62)}»`, { fs: 12.5, fill: C.ink3 });
  b += txt(30, yE + 42, `«${ej[4].slice(0, 62)}»`, { fs: 12.5, fill: C.ink });
  b += txt(30, yE + 64,
    `${TEXTO.libro.crudo} títulos distintos antes · ${TEXTO.libro.pasos[3][1]} después`,
    { fs: 11, fill: C.ink3 });

  /* And the same four treatments over EVERY text column, which is what actually
     happened. Walking one column step by step is how you understand the treatment;
     this strip is how you see that it was not a demonstration on a favourite case.
     The ones where nothing moved are in it too — a treatment that runs and changes
     nothing is a result, and the only way to know it is to look. */
  const claves = Object.keys(TEXTO);
  const yT = yE + 108;
  b += txt(30, yT - 14, `Y SOBRE LAS ${claves.length} COLUMNAS DE TEXTO, LAS MISMAS CUATRO`,
    { fs: 11, fill: C.ask, ls: 1.8 });
  b += txt(30, yT + 6, 'categorías distintas antes → después · en gris, las que no se movieron',
    { fs: 10.5, fill: C.ink3 });

  const filas = 6, cols = Math.ceil(claves.length / filas);
  const anchoCol = 940 / cols, altoFila = 22;
  const maxCat = Math.max(...claves.map(k => TEXTO[k].crudo));
  claves.forEach((clave, i) => {
    const cx = 30 + Math.floor(i / filas) * anchoCol;
    const cy = yT + 34 + (i % filas) * altoFila;
    const t = TEXTO[clave];
    const despues = t.pasos[3][1];
    const movio = despues !== t.crudo;
    const destaca = clave === 'municipio';
    const tinta = destaca ? C.ask : movio ? C.ink2 : C.ink3;
    b += txt(cx, cy, nombre(clave), { fs: 11, fill: tinta });
    /* Two little bars, the raw count behind the final one, so the drop has a length
       and not only two numbers to subtract in your head. */
    const bx = cx + 108, bw = (anchoCol - 190) / maxCat;
    b += bar(bx, cy - 8, Math.max(1, t.crudo * bw), 9, C.line, { op: 0.9 });
    b += bar(bx, cy - 8, Math.max(1, despues * bw), 9, destaca ? C.ask : tinta,
      { op: destaca ? 0.85 : 0.5 });
    b += txt(cx + anchoCol - 60, cy, `${t.crudo} → ${despues}`,
      { fs: 10.5, fill: tinta, ta: 'end' });
  });

  const movidas = claves.filter(k => TEXTO[k].pasos[3][1] !== TEXTO[k].crudo).length;
  wrap(`Se movieron ${movidas} de ${claves.length}. En las otras ${claves.length - movidas} ` +
    'los cuatro tratamientos corrieron igual y no cambiaron nada: nadie las había ' +
    'escrito de dos maneras.', 96)
    .forEach((linea, i) =>
      b += txt(30, yT + 34 + filas * altoFila + 16 + i * 18, linea, { fs: 12, fill: C.ink2 }));

  return svg(W, H,
    `Los cuatro tratamientos del texto: la variable municipio paso a paso, de ` +
    `${col.crudo} categorías distintas a ${col.pasos[3][1]}, y el efecto total sobre ` +
    `las ${claves.length} columnas de texto, de las que se movieron ${movidas}`,
    b);
}

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

/* ═══════════ 6 · how much of the table two components hold ═══════════ */
export function sedimento() {
  /* Bars and cumulative line share ONE scale, 0 to 100 %, and it is drawn.
     They used to be on two: the bars stretched to fill the height (0 to the tallest
     percentage) while the line ran 0–100, so a bar and the line at the same height
     meant different things and nothing said so. They measure the same magnitude in
     the same unit — percentage of variance — so the fix is one axis, not two. The
     first bars look shorter than they used to, and that is the honest height. */
  /* +18 over the old height: the closing prose is two wrapped lines now, not one. */
  const W = 980, H = 318 + ALTO_ROTULO;
  const p = PCA.porcentajes, ac = PCA.acumulado;
  let b = '';

  b += txt(30, 28, 'VARIANZA EXPLICADA POR COMPONENTE', { fs: 11, fill: C.ask, ls: 1.8 });

  const x0 = 60, ancho = 800, y0 = 66, alto = 150;
  const w = ancho / p.length;
  const s = scale([0, 100], [y0 + alto, y0]);

  /* the gridlines the shared scale now makes readable */
  [0, 25, 50, 75, 100].forEach(t => {
    b += pline([[x0 - 6, s(t)], [x0 + ancho, s(t)]], C.lineSoft, { sw: 1 });
    b += txt(x0 - 12, s(t) + 4, `${t}`, { fs: 10, fill: C.ink3, ta: 'end' });
  });

  p.forEach((v, i) => {
    const x = x0 + i * w;
    b += bar(x + 6, s(v), w - 12, y0 + alto - s(v), i < 2 ? C.ask : C.ink3,
      { op: i < 2 ? 0.75 : 0.4 });
    b += txt(x + w / 2, s(v) - 9, `${num(v)} %`,
      { fs: 10.5, fill: i < 2 ? C.ask : C.ink3, ta: 'middle' });
    b += txt(x + w / 2, y0 + alto + 20, `CP${i + 1}`, { fs: 11, fill: C.ink3, ta: 'middle' });
  });

  /* the cumulative line, on that same scale — now actually the same one */
  b += pline(p.map((_, i) => [x0 + i * w + w / 2, s(ac[i])]), C.reveal, { sw: 1.6 });
  p.forEach((_, i) => b += dot(x0 + i * w + w / 2, s(ac[i]), 3, C.reveal));
  /* Two short lines ABOVE CP2's dot, with a stub down to it.
     With twelve components a column is 67 px wide and this label is 166: on one line it
     has nowhere to go. To the right it crossed CP3, CP4 and CP5 and read as if it
     labelled CP3 — a different percentage. To the left it ran off the viewBox. Under the
     dot it landed on CP1's «24,95 %». Split in two and set above, it clears the rising
     line, both gridlines and every bar label, and the stub says which dot it means. */
  const xc = x0 + 1.5 * w, yc = s(ac[1]);
  ['dos componentes', `${num(ac[1])} %`].forEach((linea, i) =>
    b += txt(xc, yc - 34 + i * 14, linea,
      { fs: 11.5, fill: C.reveal, ta: 'middle' }));
  b += pline([[xc, yc - 30 + 14], [xc, yc - 5]], C.reveal, { sw: 1, op: 0.55 });

  b += eje('y', x0 - 12, y0 - 14, 'varianza explicada', '% del total');
  b += eje('x', x0 + ancho, y0 + alto + 40, 'componente principal');
  b += txt(30, y0 + alto + 40, 'barras y línea acumulada, en la misma escala 0–100 %',
    { fs: 10.5, fill: C.ink3 });

  b += txt(30, y0 + alto + 56,
    `Con ${PCA.variables.length} variables, las dos primeras se quedan con ${num(ac[1])} % de lo que había.`,
    { fs: 13, fill: C.ink2 });
  /* Wrapped, not one line: at 12 px monospace this ran past x = 1160 inside a 980-wide
     viewBox and SVG cut it off mid-word without a word of its own. */
  wrap('En la sesión pasada, con cuatro indicadores de país, las dos primeras llegaban ' +
    'al 92 %. La diferencia no es el método: es que aquí las variables no van juntas.', 96)
    .forEach((linea, i) =>
      b += txt(30, y0 + alto + 78 + i * 18, linea, { fs: 12, fill: C.ink3 }));

  return svg(W, H,
    `Diagrama de la varianza explicada por cada una de las ${p.length} componentes, con ` +
    `la línea acumulada: las dos primeras suman ${num(ac[1])} por ciento`,
    b);
}

/* ═══════════ 7 · the factorial plane, one dot per person ═══════════
   Points on the left, loadings on the right, sharing nothing but the two components.
   They are drawn apart on purpose: superimposing them is the standard biplot, and a
   biplot invites reading a distance between a dot and an arrow, which means nothing. */
export function plano() {
  /* H has to clear the two lines of prose under the plot: they sit at ya + L + 54
     and + 76, and a viewBox that ends before them silently crops them. */
  const W = 980, H = 558;
  const pts = PCA.puntos, cargas = PCA.cargas, vars = PCA.variables;
  let b = arrow('ar-s6-pl', C.ask);

  const lim = Math.ceil(Math.max(...pts.flatMap(p => p.map(Math.abs))));
  const L = 380, xa = 40, ya = 60;
  const sx = scale([-lim, lim], [xa, xa + L]);
  const sy = scale([-lim, lim], [ya + L, ya]);

  b += txt(xa, 28, `LAS ${pts.length} PERSONAS EN EL PLANO`, { fs: 11, fill: C.ask, ls: 1.8 });
  b += pline([[sx(0), ya], [sx(0), ya + L]], C.lineSoft, { sw: 1 });
  b += pline([[xa, sy(0)], [xa + L, sy(0)]], C.lineSoft, { sw: 1 });
  pts.forEach((p, i) => {
    b += dot(sx(p[0]), sy(p[1]), 4.5, C.ask, { op: 0.62 });
    b += txt(sx(p[0]) + 7, sy(p[1]) + 3.5, String(i + 1), { fs: 8.5, fill: C.ink3 });
  });
  /* Both axis labels live OUTSIDE the cloud. Drawn at the end of their own axis they
     landed on top of the points sitting near the origin, which is where most of a
     factorial plane's points always are. */
  b += txt(xa + L, ya + L + 20, `CP 1 · ${num(PCA.porcentajes[0])} %`,
    { fs: 11, fill: C.ink3, ta: 'end' });
  b += txt(xa, ya + L + 20, `CP 2 · ${num(PCA.porcentajes[1])} % (vertical)`,
    { fs: 11, fill: C.ink3 });

  /* the loadings, as arrows from the origin inside the unit circle */
  const xb = 560, cx = xb + 190, cy = ya + L / 2, R = 170;
  b += txt(xb, 28, 'Y LAS VARIABLES QUE LOS FORMAN', { fs: 11, fill: C.ask, ls: 1.8 });
  b += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${C.lineSoft}" stroke-width="1"/>`;
  b += pline([[cx - R, cy], [cx + R, cy]], C.lineSoft, { sw: 1 });
  b += pline([[cx, cy - R], [cx, cy + R]], C.lineSoft, { sw: 1 });

  vars.forEach(([clave], i) => {
    const x = cx + cargas[i][0] * R, y = cy - cargas[i][1] * R;
    b += `<path d="M${cx},${cy} L${x.toFixed(1)},${y.toFixed(1)}" fill="none"
      stroke="${C.ask}" stroke-width="1.4" opacity=".8" marker-end="url(#ar-s6-pl)"/>`;
    const fuera = 1.08;
    b += txt(cx + cargas[i][0] * R * fuera, cy - cargas[i][1] * R * fuera + 3.5, nombre(clave),
      { fs: 10, fill: C.ink2, ta: cargas[i][0] < 0 ? 'end' : 'start' });
  });

  /* The circle has the SAME two axes as the plane on the left, and that is the one
     thing about it that is not obvious: a reader who does not know it reads the arrows
     as a picture of the variables instead of as their weight on these two components. */
  b += txt(cx + R, cy + 16, `CP 1 · ${num(PCA.porcentajes[0])} %`,
    { fs: 10, fill: C.ink3, ta: 'end' });
  b += txt(cx, cy - R - 10, `CP 2 · ${num(PCA.porcentajes[1])} %`,
    { fs: 10, fill: C.ink3, ta: 'middle' });
  b += txt(xb, ya + L + 20, 'los mismos dos ejes del plano de la izquierda',
    { fs: 10.5, fill: C.ink3 });

  b += txt(xa, ya + L + 54,
    'Cada punto es una persona; cada flecha, una variable. Se leen por separado.',
    { fs: 12.5, fill: C.ink2 });
  wrap(`Dos puntos cerca respondieron parecido en las ${vars.length} variables a la vez. ` +
    'Lo que no se puede leer aquí es qué respondió cada uno: para eso está la tabla.', 96)
    .forEach((linea, i) =>
      b += txt(xa, ya + L + 76 + i * 18, linea, { fs: 12, fill: C.ink3 }));

  return svg(W, H,
    `El plano de las dos primeras componentes con un punto por cada una de las ` +
    `${pts.length} personas, y al lado el círculo con una flecha por cada una de las ` +
    `${vars.length} variables que las forman`,
    b);
}

/* ═══════════ 8 · las diecisiete que no son números ═══════════
   One strip per variable, split into its levels biggest-first. The four shapes are
   meant to be told apart WITHOUT reading a number: a «dominada» is one long block,
   a «cola» is a block followed by slivers, a «único» is nothing but slivers, and a
   «sana» is a handful of comparable blocks. The figures on the right are there to
   confirm what the strip already said, not to carry it. */
export function noNumericas() {
  const claves = NO_NUMERICAS;
  /* +118, not +84: the four legend lines below the strips end at yL + 65, and a
     viewBox that stops before them crops the last one without a word. */
  const W = 980, fila = 34, y0 = 96, H = y0 + claves.length * fila + 118 + ALTO_ROTULO;
  let b = '';

  const COLOR = {
    sana: C.ask,
    cola: '#C9A227',
    dominada: '#7E8FA6',
    unico: C.reveal
  };
  const NOMBRE = {
    sana: 'sana', cola: 'cola larga',
    dominada: 'dominada', unico: 'casi todo único'
  };

  b += txt(30, 28, `LAS ${claves.length} VARIABLES QUE EL PCA NO PUEDE MIRAR`,
    { fs: 11, fill: C.ask, ls: 1.8 });
  b += txt(30, 50,
    'cada franja es una variable, partida en sus niveles, el mayor primero',
    { fs: 10.5, fill: C.ink3 });

  const xN = 30, x0 = 132, x1 = 690, ancho = x1 - x0;

  /* the header of the numeric columns */
  [['niveles', 742], ['mayor', 806], ['de 1', 856]].forEach(([t, x]) =>
    b += txt(x, y0 - 14, t, { fs: 9.5, fill: C.ink3, ta: 'end' }));
  b += txt(886, y0 - 14, 'forma', { fs: 9.5, fill: C.ink3 });

  claves.forEach((c, i) => {
    const d = DIAGNOSTICO[c];
    const y = y0 + i * fila;
    const col = COLOR[d.forma];
    const total = d.tamanos.reduce((a, n) => a + n, 0) || 1;

    b += txt(xN, y + 13, nombre(c), { fs: 11, fill: C.ink2 });

    let x = x0;
    d.tamanos.forEach(n => {
      const w = (n / total) * ancho;
      b += bar(x, y, Math.max(0.8, w - 1), 18, col, { op: n > 1 ? 0.72 : 0.3 });
      x += w;
    });
    /* the empty answers, hatched at the end, so a variable with holes says so */
    if (d.vacias) {
      const w = (d.vacias / (total + d.vacias)) * ancho;
      b += box(x1 - w, y, w, 18, null, { fill: 'none', stroke: C.ink3, dash: '2 2' });
    }

    b += txt(742, y + 13, String(d.niveles), { fs: 10.5, fill: C.ink2, ta: 'end' });
    b += txt(806, y + 13, String(d.mayor), { fs: 10.5, fill: C.ink2, ta: 'end' });
    b += txt(856, y + 13, String(d.solos), { fs: 10.5, fill: d.solos ? col : C.ink3, ta: 'end' });
    b += txt(886, y + 13, NOMBRE[d.forma], { fs: 10, fill: col });
  });

  /* the thresholds, because a classification whose cuts are hidden is an opinion */
  const yL = y0 + claves.length * fila + 26;
  b += txt(30, yL, 'DÓNDE ESTÁN LOS CORTES', { fs: 10.5, fill: C.ask, ls: 1.6 });
  const cortes = [
    [COLOR.unico, `casi todo único: más de ${Math.round(UMBRALES.unico * 100)} % de niveles por persona`],
    [COLOR.dominada, `dominada: el nivel mayor pasa del ${Math.round(UMBRALES.dominada * 100)} % de la clase`],
    [COLOR.cola, `cola larga: más del ${Math.round(UMBRALES.cola * 100)} % de sus niveles los eligió una persona`],
    [COLOR.sana, 'sana: ninguna de las tres cosas']
  ];
  cortes.forEach(([col, t], i) => {
    const y = yL + 20 + i * 15;
    b += bar(30, y - 8, 10, 10, col, { op: 0.8 });
    b += txt(48, y, t, { fs: 10.5, fill: C.ink3 });
  });

  /* What the strips are made of. Every bar is the same length because every bar is
     the whole class — what changes is how it gets cut up. Without this the width
     reads as «how much of something», and there is no something. */
  b += eje('x', 700, H - 10,
    `cada franja reparte las ${FILAS} personas que respondieron, no una cantidad`);

  return svg(W, H,
    `Las ${claves.length} variables no numéricas, cada una partida en sus niveles de mayor ` +
    `a menor, con cuántos niveles tiene, cuánta gente hay en el mayor, cuántos niveles ` +
    `eligió una sola persona, y en cuál de las cuatro formas cae`,
    b);
}

/* ═══════════ 9 · las tres matrices de pares ═══════════
   One per combination of types, because a pair of variables admits exactly one kind of
   picture and which one it is depends on what the two variables ARE. Together they are
   the evidence for what the entrada says afterwards: that these variables mostly do not
   go together, and that two thirds of the table has structure the PCA cannot reach.

   All three share a layout — labels on the outer edge, once per variable, never inside
   a cell — and all three show `MATRICES.n` variables rather than every one, because at
   this width every variable is a panel of about 115 px and twelve would be a smear. */

/* Common furniture: the grid, its edge labels, and the note about the criterion. */
function marcoMatriz(titulo, sub, filas, cols, criterio, fuera, opts) {
  const o = opts || {};
  const xL = o.xL || 150, yT = o.yT || 116;
  const lado = o.lado || 92, hueco = 4;
  const W = 980;
  const anchoRejilla = cols.length * (lado + hueco);
  const altoRejilla = filas.length * (lado + hueco);
  const H = yT + altoRejilla + 140;
  let b = txt(30, 28, titulo, { fs: 11, fill: C.ask, ls: 1.8 });
  wrap(sub, 140).forEach((linea, i) =>
    b += txt(30, 50 + i * 15, linea, { fs: 10.5, fill: C.ink3 }));

  /* Column names along the top, row names down the left. Once each — repeating them in
     every cell is what turns a matrix into a wall of text. */
  cols.forEach(([clave], j) => {
    const x = xL + j * (lado + hueco);
    b += txt(x + lado / 2, yT - 8, nombre(clave),
      { fs: 9.5, fill: C.ink3, ta: 'middle' });
  });
  filas.forEach(([clave], i) => {
    const y = yT + i * (lado + hueco);
    b += txt(xL - 10, y + lado / 2 + 3.5, nombre(clave), { fs: 9.5, fill: C.ink3, ta: 'end' });
  });

  const pie = yT + altoRejilla;
  const lineas = wrap(`Se muestran ${MATRICES.n} variables, no todas. ${criterio}`, 96);
  lineas.forEach((linea, i) =>
    b += txt(30, pie + 26 + i * 18, linea, { fs: 12, fill: C.ink2 }));
  wrap(`Quedan fuera: ${fuera.map(nombre).join(', ')}.`, 104).forEach((linea, i) =>
    b += txt(30, pie + 26 + lineas.length * 18 + 4 + i * 17, linea,
      { fs: 11, fill: C.ink3 }));
  return { b, W, H, xL, yT, lado, hueco, pie, lineasPie: lineas.length };
}

/* 9a · quantity × quantity. The diagonal is each variable on its own, as a histogram,
   because a variable against itself is a line and a line says nothing. */
export function matrizDispersion() {
  const vars = MATRICES.cuantitativas;
  const m = marcoMatriz(
    `DOS CANTIDADES A LA VEZ · ${vars.length} VARIABLES`,
    'cada celda es una nube de las 27 personas · en la diagonal, la variable sola',
    vars, vars, MATRICES.criterioCuant + ' (la relación más fuerte de cada una).',
    MATRICES.dejadasFuera.cuantitativas);
  let b = m.b;

  vars.forEach(([cy], i) => vars.forEach(([cx], j) => {
    const x = m.xL + j * (m.lado + m.hueco), y = m.yT + i * (m.lado + m.hueco);
    b += `<rect x="${x}" y="${y}" width="${m.lado}" height="${m.lado}" fill="none"
      stroke="${C.lineSoft}" stroke-width="1"/>`;
    if (i === j) {
      b += panelHistograma(x, y, m.lado, m.lado, MATRICES.histogramas[cx].cuenta, C.ink3);
      b += txt(x + m.lado / 2, y + m.lado / 2, nombre(cx),
        { fs: 9, fill: C.ink2, ta: 'middle' });
      return;
    }
    const r = MATRICES.correlaciones[cy][cx];
    b += panelDispersion(x, y, m.lado, m.lado,
      MATRICES.valores[cx], MATRICES.valores[cy],
      Math.abs(r) >= 0.5 ? C.ask : C.ink3);
    /* The number in the corner is not decoration: without it «that one looks tilted»
       is a guess, and the whole point of the figure is which ones are not a guess. */
    b += txt(x + m.lado - 4, y + 12, num(r),
      { fs: 9, fill: Math.abs(r) >= 0.5 ? C.ask : C.ink3, ta: 'end' });
  }));

  b += eje('y', 30, m.yT - 30, 'la variable de la fila');
  b += eje('x', m.xL + vars.length * (m.lado + m.hueco), m.pie + 66,
    'la variable de la columna · en la diagonal, el alto son personas');

  return svg(m.W, m.H,
    `Matriz de dispersión de ${vars.length} variables cuantitativas, con el histograma ` +
    `de cada una en la diagonal y el coeficiente de correlación en cada celda`,
    b);
}

/* 9b · quantity × name. No diagonal: the two axes are different sets of variables. */
export function matrizCajas() {
  const filas = MATRICES.cuantitativas, cols = MATRICES.cualitativas;
  const m = marcoMatriz(
    'UNA CANTIDAD CONTRA UN NOMBRE',
    'una caja por nivel · una caja hueca está hecha con menos de 4 respuestas',
    filas, cols, MATRICES.criterioCual + ' · ' + MATRICES.criterioCuant + '.',
    MATRICES.dejadasFuera.cualitativas);
  let b = m.b;

  filas.forEach(([q], i) => cols.forEach(([c], j) => {
    const x = m.xL + j * (m.lado + m.hueco), y = m.yT + i * (m.lado + m.hueco);
    b += `<rect x="${x}" y="${y}" width="${m.lado}" height="${m.lado}" fill="none"
      stroke="${C.lineSoft}" stroke-width="1"/>`;
    b += panelCajas(x, y, m.lado, m.lado,
      MATRICES.cajasPorNivel[q][c], MATRICES.niveles[c], C.ask, 4);
  }));

  b += eje('y', 30, m.yT - 30, 'la cantidad, una por fila');
  b += eje('x', m.xL + cols.length * (m.lado + m.hueco), m.pie + 66,
    'el nombre, uno por columna · dentro de cada celda, una caja por nivel');

  return svg(m.W, m.H,
    `Matriz de diagramas de caja de ${filas.length} variables cuantitativas contra ` +
    `${cols.length} cualitativas, con una caja por cada nivel`,
    b);
}

/* 9c · name × name. A mosaic: each bar is one level of the ROW variable, stretched to
   100 %, and its segments are how that group splits across the COLUMN variable. The bar's
   width is how many people are in it. See panelMosaico for why conditioning is what makes
   stacking legitimate here. */
export function matrizBarras() {
  const vars = MATRICES.cualitativas;
  const m = marcoMatriz(
    `DOS NOMBRES A LA VEZ · ${vars.length} VARIABLES`,
    'cada barra es un nivel de la fila, estirado al 100 % · su ancho es cuánta gente hay ' +
    'en él · la celda enmarcada de cada variable la muestra sola: ahí se ve qué es cada color',
    vars, vars, MATRICES.criterioCual + '.', MATRICES.dejadasFuera.cualitativas);
  let b = m.b;

  vars.forEach(([a], i) => vars.forEach(([bq], j) => {
    const x = m.xL + j * (m.lado + m.hueco), y = m.yT + i * (m.lado + m.hueco);
    b += `<rect x="${x}" y="${y}" width="${m.lado}" height="${m.lado}" fill="none"
      stroke="${C.lineSoft}" stroke-width="1"/>`;
    if (i === j) {
      /* The diagonal is the legend. A colour cannot mean the same thing in two columns —
         every variable has its own levels — so one legend would be a lie and one per
         column would be forty entries. Here each variable appears alone, its levels in
         the palette's own order, and that is where the mapping is learnt. */
      const niv = MATRICES.niveles[a];
      const c = MATRICES.barrasUna[a];
      b += panelMosaico(x, y, m.lado, m.lado,
        { todo: Object.fromEntries(niv.map(n => [n, c[n]])) }, ['todo'], niv);
      /* A brighter frame instead of a label inside: the row and column headers already
         name the variable, and a label here landed on the cell below — the gap between
         cells is 4 px and the text sat 12 px down. What the frame has to say is «this
         cell is the key», and a frame says it without a word. */
      b += `<rect x="${x - 1}" y="${y - 1}" width="${m.lado + 2}" height="${m.lado + 2}"
        fill="none" stroke="${C.ink3}" stroke-width="1.5"/>`;
      return;
    }
    b += panelMosaico(x, y, m.lado, m.lado, MATRICES.barras[a][bq],
      MATRICES.niveles[a], MATRICES.niveles[bq]);
  }));

  b += eje('y', 30, m.yT - 30, 'la variable de la fila · cada barra es uno de sus niveles');
  b += eje('x', m.xL + vars.length * (m.lado + m.hueco), m.pie + 78,
    'la variable de la columna · su reparto dentro de cada barra');

  return svg(m.W, m.H,
    `Matriz de mosaico de ${vars.length} variables cualitativas: cada barra es un nivel ` +
    `de la variable de la fila, con el ancho proporcional a cuánta gente hay en él y ` +
    `partida en el reparto de la variable de la columna`,
    b);
}
