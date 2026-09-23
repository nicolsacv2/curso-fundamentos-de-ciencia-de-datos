import { C, svg, txt, arrow, wrap } from '../../../svg/kit.js';
import {
  PCA, MATRICES
} from '../../../data/salon_limpio.js';
import { nombre } from '../../../data/nombres.js';
import { dot, pline, bar, scale, num, eje, ALTO_ROTULO, panelDispersion, panelHistograma, panelCajas, panelMosaico } from './shared.js';

/* Every id carries the ar-s6- prefix. A repeated one would make a url(#…) resolve to
   another figure's marker, and the figures of six other sessions are one route away.

   Session 6's figures used to live in one module; the change partir-la-sesion-06-en-dos
   cut the entrada into five blocks and the figures went with their block, one module
   each, so that a block downloads only the drawings it shows. */

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
