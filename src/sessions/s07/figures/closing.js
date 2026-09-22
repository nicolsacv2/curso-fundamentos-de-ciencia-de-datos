import { C, svg, txt, arrow, wrap } from '../../../svg/kit.js';
import { FAMD, PCA } from '../../../data/salon_limpio.js';
import { nombre } from '../../../data/nombres.js';
import { dot, pline, bar, num, scale, eje, ALTO_ROTULO, plano, cuadrado, apilar,
  pasaFiltro, UMBRAL_COS2 } from './shared.js';

/* Closing of session 7 · the FAMD of the whole clean table. Every id carries the ar-s7-c- prefix.
   Everything is read from FAMD in src/data/salon_limpio.js, which scripts/clean_salon.py
   wrote as step 10 of the cleaning chain and scripts/check_salon.py audits: no
   coordinate is placed by hand, and no axis is named in a figure — an axis says its
   number and its percentage, and the prose names it with the contributions.

   The salón has 16 categorical variables and 65 categories, so nothing here is coloured
   by variable: the type of a point is its mark (circle for a quantity, square for a
   category), and a category is labelled only when it passes the reading filter of
   shared.js. The filter is written in the figure that applies it. */

const W = 980;
const A = FAMD.activo;
const n3 = v => num(v).replace('-', '−');
const COL_NUM = C.ask;
const COL_CAT = '#c98500';     /* the mosaic's fourth hue: one hue for every category */

/* ═══════════ 1 · inertia per axis, with the entrada's PCA as a reference ═══════════
   The composition of the entrada's sedimento(): bars and cumulative line on ONE scale,
   0 to 100. The two-component cumulative of the PCA is drawn on that same scale as a
   dashed reference and labelled as what it is — a percentage of a DIFFERENT total, which
   is why the figure says so instead of letting the two lines be compared as equals. */
export function inerciaEjes() {
  const p = A.porcentajes, ac = A.acumulado;
  const H = 400 + ALTO_ROTULO;
  let b = txt(30, 28, `INERCIA RETENIDA POR CADA UNO DE LOS ${p.length} EJES`, { fs: 11, fill: C.ask, ls: 1.8 });

  const x0 = 60, ancho = 860, y0 = 66, alto = 220;
  const w = ancho / p.length;
  const s = scale([0, 100], [y0 + alto, y0]);
  [0, 25, 50, 75, 100].forEach(t => {
    b += pline([[x0 - 6, s(t)], [x0 + ancho, s(t)]], C.lineSoft, { sw: 1 });
    b += txt(x0 - 12, s(t) + 4, `${t}`, { fs: 10, fill: C.ink3, ta: 'end' });
  });
  p.forEach((v, i) => {
    const x = x0 + i * w;
    b += bar(x + 3, s(v), w - 6, y0 + alto - s(v), i < 2 ? C.ask : C.ink3, { op: i < 2 ? 0.8 : 0.4 });
    if (i < 3) b += txt(x + w / 2, s(v) - 8, `${num(v)}`, { fs: 9.5, fill: i < 2 ? C.ask : C.ink3, ta: 'middle' });
    if (i === 0 || (i + 1) % 5 === 0) {
      b += txt(x + w / 2, y0 + alto + 18, `${i + 1}`, { fs: 10, fill: C.ink3, ta: 'middle' });
    }
  });
  b += pline(p.map((_, i) => [x0 + i * w + w / 2, s(ac[i])]), C.reveal, { sw: 1.6 });
  p.forEach((_, i) => b += dot(x0 + i * w + w / 2, s(ac[i]), 2.5, C.reveal));
  /* The two-axis cumulative as a guide line to the right edge, labelled there: a label
     beside the dot sat on the rising line and on the bar labels of axes 2 and 3. */
  const xc = x0 + 1.5 * w, yc = s(ac[1]);
  b += pline([[xc, yc], [x0 + ancho, yc]], C.reveal, { sw: 1, dash: '3 3', op: 0.6 });
  b += txt(x0 + ancho, yc - 6, `dos ejes del FAMD: ${num(ac[1])} % de ${num(A.inercia.total)}`, { fs: 11, fill: C.reveal, ta: 'end' });

  /* the entrada's PCA, as a reference and nothing more */
  const yP = s(PCA.acumulado[1]);
  b += pline([[x0, yP], [x0 + ancho, yP]], C.ink2, { sw: 1, dash: '6 4' });
  b += txt(x0 + ancho, yP - 6, `PCA de la entrada, dos componentes: ${num(PCA.acumulado[1])} % — de un total de ${PCA.variables.length}, no de ${num(A.inercia.total)}`,
    { fs: 10.5, fill: C.ink2, ta: 'end' });

  b += eje('y', x0 - 12, y0 - 14, 'inercia retenida', '% del total');
  b += eje('x', x0 + ancho, y0 + alto + 40, 'eje del FAMD, del 1 al ' + p.length);
  b += txt(30, y0 + alto + 40, 'barras, línea acumulada y referencia del PCA en la misma escala 0–100 %', { fs: 10.5, fill: C.ink3 });
  wrap(`Con ${A.categoriasActivas} categorías y ${FAMD.numericas.length} cantidades hay ${num(A.inercia.total)} unidades de inercia, y ningún eje pasa de ${num(p[0])} %. Los dos primeros retienen ${num(ac[1])} %: el porcentaje del PCA no es comparable, porque su total eran ${PCA.variables.length} unidades y este, ${num(A.inercia.total)}.`, 104)
    .forEach((l, i) => b += txt(30, y0 + alto + 66 + i * 17, l, { fs: 12, fill: C.ink2 }));

  return svg(W, H,
    `Diagrama de la inercia retenida por cada uno de los ${p.length} ejes del análisis `
    + `factorial de datos mixtos del salón, con la línea acumulada: los dos primeros suman `
    + `${num(ac[1])} por ciento. Como referencia, en la misma escala, las dos primeras `
    + `componentes del PCA de la entrada retenían ${num(PCA.acumulado[1])} por ciento de un `
    + `total distinto`, b);
}

/* ═══════════ 2 · the relationship square of the 28 variables ═══════════ */
export function cuadradoSalon() {
  /* 600, not 560: the stacked labels of the points near the origin run below the
     square, and a viewBox that stopped at the square's foot cropped the last one. */
  const H = 600;
  const x0 = 300, y0 = 70, lado = 420;
  const s = scale([0, 1], [0, lado]);
  let b = txt(30, 28, `EL CUADRADO DE RELACIONES · LAS ${FAMD.numericas.length + FAMD.categoricas.length} VARIABLES QUE ENTRARON`,
    { fs: 11, fill: C.ask, ls: 1.8 });
  b += `<rect x="${x0}" y="${y0}" width="${lado}" height="${lado}" fill="none" stroke="${C.line}" stroke-width="1"/>`;
  [0.25, 0.5, 0.75].forEach(t => {
    b += pline([[x0 + s(t), y0], [x0 + s(t), y0 + lado]], C.lineSoft, { sw: 1 });
    b += pline([[x0, y0 + lado - s(t)], [x0 + lado, y0 + lado - s(t)]], C.lineSoft, { sw: 1 });
  });
  [0, 0.5, 1].forEach(t => {
    b += txt(x0 + s(t), y0 + lado + 16, num(t), { fs: 10, fill: C.ink3, ta: 'middle' });
    b += txt(x0 - 8, y0 + lado - s(t) + 4, num(t), { fs: 10, fill: C.ink3, ta: 'end' });
  });
  b += txt(x0 + lado, y0 + lado + 36, `vínculo con el eje 1 (r² o η²) · Eje 1 · ${num(A.porcentajes[0])} %`, { fs: 10.5, fill: C.ink3, ta: 'end' });
  b += txt(x0, y0 - 14, `vínculo con el eje 2 (r² o η²) · Eje 2 · ${num(A.porcentajes[1])} % (vertical)`, { fs: 10.5, fill: C.ink3 });

  const puntos = [
    ...FAMD.numericas.map(c => ({ clave: c, tipo: 'num', v: [A.r2[c][0], A.r2[c][1]] })),
    ...FAMD.categoricas.map(c => ({ clave: c, tipo: 'cat', v: [A.eta2[c][0], A.eta2[c][1]] }))
  ];
  /* A point that puts less than CERCA on both axes sits in the crowd at the origin, and
     its label would land on the axis ticks: those are drawn dim, unlabelled, and listed
     by name in the note — «near the origin» IS their reading. */
  const CERCA = 0.2;
  const cerca = pt => Math.max(...pt.v) < CERCA;
  puntos.forEach(pt => {
    const x = x0 + s(pt.v[0]), y = y0 + lado - s(pt.v[1]);
    const op = cerca(pt) ? 0.45 : 0.95;
    b += pt.tipo === 'num' ? dot(x, y, 5, COL_NUM, { op }) : cuadrado(x, y, 10, COL_CAT, { op });
  });
  const rotulos = apilar(puntos.filter(pt => !cerca(pt)).map(pt => ({
    x: x0 + s(pt.v[0]) + 9, y: y0 + lado - s(pt.v[1]) + 4, t: nombre(pt.clave), ancho: 90
  })), 12);
  rotulos.forEach(r => b += txt(r.x, r.y, r.t, { fs: 10.5, fill: C.ink2 }));
  const enElOrigen = puntos.filter(cerca).map(pt => nombre(pt.clave));

  b += txt(x0 + lado + 8, y0 + lado - 4, '← puro eje 1', { fs: 10, fill: C.ink3 });
  b += txt(x0 + 6, y0 + 14, 'puro eje 2', { fs: 10, fill: C.ink3 });

  let ly = 70;
  b += txt(30, ly, 'QUÉ ES CADA PUNTO', { fs: 10.5, fill: C.ask, ls: 1.6 });
  b += dot(36, ly + 20, 5, COL_NUM);
  b += txt(50, ly + 24, `una cantidad: (r² eje 1, r² eje 2) · ${FAMD.numericas.length}`, { fs: 11, fill: C.ink2 });
  b += cuadrado(36, ly + 42, 10, COL_CAT);
  b += txt(50, ly + 46, `un nombre u orden: (η² eje 1, η² eje 2) · ${FAMD.categoricas.length}`, { fs: 11, fill: C.ink2 });
  const arriba = puntos.slice().sort((p, q) => q.v[0] - p.v[0]).slice(0, 3).map(p => nombre(p.clave));
  const arriba2 = puntos.slice().sort((p, q) => q.v[1] - p.v[1]).slice(0, 3).map(p => nombre(p.clave));
  wrap(`Las tres variables más ligadas al eje 1: ${arriba.join(', ')}. Al eje 2: ${arriba2.join(', ')}.`, 34)
    .forEach((l, i) => b += txt(30, ly + 80 + i * 15, l, { fs: 10.5, fill: C.ink3 }));
  wrap(`Sin rótulo, atenuadas, las ${enElOrigen.length} con r² o η² por debajo de ${num(CERCA)} en los dos ejes: ${enElOrigen.join(', ')}. Cerca del origen es su lectura: participan poco de este plano.`, 34)
    .forEach((l, i) => b += txt(30, ly + 150 + i * 15, l, { fs: 10.5, fill: C.ink3 }));

  return svg(W, H,
    `El cuadrado de relaciones del análisis del salón: ${puntos.length} variables como puntos `
    + `dentro del cuadrado unitario, las ${FAMD.numericas.length} cantidades como círculos por `
    + `su r cuadrado y las ${FAMD.categoricas.length} cualitativas como cuadrados por su eta `
    + `cuadrado, cada una rotulada con su nombre. Las más ligadas al eje 1 son `
    + `${arriba.join(', ')}; al eje 2, ${arriba2.join(', ')}`, b);
}

/* ═══════════ 3 · the correlation circle of the 12 quantities ═══════════ */
export function circuloSalon() {
  const H = 500;
  const cx = 570, cy = 240, R = 185;
  let b = arrow('ar-s7-c-ci', COL_NUM);
  b += txt(30, 28, `EL CÍRCULO DE CORRELACIONES · LAS ${FAMD.numericas.length} CANTIDADES`, { fs: 11, fill: C.ask, ls: 1.8 });
  b += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${C.lineSoft}" stroke-width="1"/>`;
  b += pline([[cx - R - 20, cy], [cx + R + 20, cy]], C.lineSoft, { sw: 1 });
  b += pline([[cx, cy - R - 20], [cx, cy + R + 20]], C.lineSoft, { sw: 1 });

  const rotulos = [];
  FAMD.numericas.forEach(c => {
    const [r1, r2] = A.correlaciones[c];
    const x = cx + r1 * R, y = cy - r2 * R;
    b += `<path d="M${cx},${cy} L${x.toFixed(1)},${y.toFixed(1)}" fill="none" stroke="${COL_NUM}"
      stroke-width="1.6" opacity=".85" marker-end="url(#ar-s7-c-ci)"/>`;
    rotulos.push({ x: x + (r1 < 0 ? -10 : 10), y: y + 4, t: nombre(c), ta: r1 < 0 ? 'end' : 'start', ancho: 80 });
  });
  apilar(rotulos, 13).forEach(r => b += txt(r.x, r.y, r.t, { fs: 11, fill: C.ink, ta: r.ta }));

  /* outside the circle, as plano() does: at the axis' end the label sat under an arrow */
  b += txt(cx + R + 20, cy + R + 24, `Eje 1 · ${num(A.porcentajes[0])} %`, { fs: 11, fill: C.ink3, ta: 'end' });
  b += txt(cx - R - 20, cy + R + 24, `Eje 2 · ${num(A.porcentajes[1])} % (vertical)`, { fs: 11, fill: C.ink3 });
  b += txt(cx + R + 4, cy - 6, '1', { fs: 10, fill: C.ink3 });
  b += txt(cx - R - 14, cy - 6, '−1', { fs: 10, fill: C.ink3 });

  const larga = FAMD.numericas.slice().sort((p, q) => A.variables[q].cos2 - A.variables[p].cos2)[0];
  wrap(`Los mismos dos ejes del cuadrado. Una flecha larga está bien representada en el plano: la más larga es ${nombre(larga)}, con cos² ${num(A.variables[larga].cos2)}. Ninguna llega al borde: ninguna cantidad cabe entera en estos dos ejes.`, 34)
    .forEach((l, i) => b += txt(30, 70 + i * 15, l, { fs: 10.5, fill: C.ink3 }));
  b += txt(30, H - 22, 'una flecha por cantidad · sus coordenadas son sus correlaciones con cada eje', { fs: 10.5, fill: C.ink3 });

  return svg(W, H,
    `El círculo de correlaciones del análisis del salón: una flecha por cada una de las `
    + `${FAMD.numericas.length} cantidades, con coordenadas iguales a sus correlaciones con los `
    + `dos ejes, que retienen ${num(A.porcentajes[0])} y ${num(A.porcentajes[1])} por ciento. La `
    + `mejor representada es ${nombre(larga)}`, b);
}

/* ═══════════ 4 · the map of the 27 people with the 65 barycentres ═══════════ */
export function mapaSalon() {
  /* The legend and the filter go BELOW the plane, not beside it: with one person at
     x ≈ 8 the labels of the far-right categories reached the legend's column. */
  const L = 620, xa = 40, ya = 56, H = ya + L + 226;
  const pts = A.puntuaciones;
  const cats = A.categorias;
  const limX = Math.ceil(Math.max(...pts.map(p => Math.abs(p[0])), ...cats.map(c => Math.abs(c.coord[0]))) + 0.5);
  const limY = Math.ceil(Math.max(...pts.map(p => Math.abs(p[1])), ...cats.map(c => Math.abs(c.coord[1]))) + 0.5);
  const { sx, sy, b: ejes } = plano(xa, ya, L, [limX, limY], A.porcentajes);
  let b = ejes;

  /* people first, dim, with their row number */
  pts.forEach((p, i) => {
    b += dot(sx(p[0]), sy(p[1]), 4, C.ink3, { op: 0.7 });
    b += txt(sx(p[0]) + 6, sy(p[1]) + 3.5, String(i + 1), { fs: 8.5, fill: C.ink3 });
  });
  /* every barycentre is drawn; only the ones that pass the filter get a label */
  const pasan = cats.filter(c => pasaFiltro(c, A.aportePromedio));
  cats.forEach(c => {
    const pasa = pasan.includes(c);
    b += cuadrado(sx(c.coord[0]), sy(c.coord[1]), pasa ? 10 : 7, COL_CAT, { op: pasa ? 0.95 : 0.35 });
  });
  const rotulos = apilar(pasan.map(c => ({
    x: sx(c.coord[0]) + 8, y: sy(c.coord[1]) + 4, t: `${nombre(c.variable)}: ${c.nivel}`, ancho: 160
  })), 12);
  rotulos.forEach(r => b += txt(r.x, r.y, r.t, { fs: 9.5, fill: C.ink }));

  /* the legend and the filter, written where they apply */
  b += txt(30, 28, `LAS ${pts.length} PERSONAS Y LOS ${cats.length} BARICENTROS`, { fs: 11, fill: C.ask, ls: 1.8 });
  const yl = ya + L + 50;
  b += dot(36, yl - 4, 4, C.ink3, { op: 0.7 });
  b += txt(50, yl, 'una persona, con su fila', { fs: 11, fill: C.ink2 });
  b += cuadrado(36, yl + 16, 10, COL_CAT, { op: 0.95 });
  b += txt(50, yl + 20, 'una categoría que pasa el filtro, rotulada', { fs: 11, fill: C.ink2 });
  b += cuadrado(36, yl + 36, 7, COL_CAT, { op: 0.35 });
  b += txt(50, yl + 40, 'una que no lo pasa: se dibuja, no se lee', { fs: 11, fill: C.ink2 });
  wrap(`Cada categoría está en el baricentro de sus personas, sin dilatar. Las ${FAMD.numericas.length} cantidades no aparecen como puntos: están en el círculo.`, 46)
    .forEach((l, i) => b += txt(30, yl + 66 + i * 15, l, { fs: 10.5, fill: C.ink3 }));
  const xf = 500;
  b += txt(xf, yl, 'EL FILTRO', { fs: 10.5, fill: C.ask, ls: 1.6 });
  wrap(`Se rotula una categoría si su contribución al eje 1 o al eje 2 alcanza el aporte promedio, ${num(A.aportePromedio)} %, y su cos² en el plano alcanza ${num(UMBRAL_COS2)}. Lo cumplen ${pasan.length} de ${cats.length}.`, 66)
    .forEach((l, i) => b += txt(xf, yl + 20 + i * 15, l, { fs: 10.5, fill: C.ink3 }));

  return svg(W, H,
    `El plano de los dos primeros ejes del análisis del salón: un punto por cada una de las `
    + `${pts.length} personas, numerado por su fila, y un cuadrado por cada uno de los `
    + `${cats.length} baricentros de categoría. Solo llevan rótulo los ${pasan.length} que pasan `
    + `el filtro escrito en la figura: contribución por encima del aporte promedio de `
    + `${num(A.aportePromedio)} por ciento en alguno de los dos ejes y cos² de al menos `
    + `${num(UMBRAL_COS2)}. Los ejes retienen ${num(A.porcentajes[0])} y ${num(A.porcentajes[1])} por ciento`, b);
}
