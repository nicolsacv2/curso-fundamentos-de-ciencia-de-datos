import { C, svg, txt, arrow, wrap } from '../../../svg/kit.js';
import {
  TEXTO, PCA, NO_NUMERICAS, DIAGNOSTICO, UMBRALES, FILAS
} from '../../../data/salon_limpio.js';
import { nombre } from '../../../data/nombres.js';
import { box, bar, eje, ALTO_ROTULO, MONO } from './shared.js';

/* Every id carries the ar-s6- prefix. A repeated one would make a url(#…) resolve to
   another figure's marker, and the figures of six other sessions are one route away.

   Session 6's figures used to live in one module; the change partir-la-sesion-06-en-dos
   cut the entrada into five blocks and the figures went with their block, one module
   each, so that a block downloads only the drawings it shows. */

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
