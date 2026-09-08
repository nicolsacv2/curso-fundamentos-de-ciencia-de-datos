import { C, SERIF, svg, txt, arrow } from '../../../svg/kit.js';
import { box, dot, pline, scale, MONO } from './shared.js';
import { PAISES, CAMPOS, VARS, PCA4, CORR, ANIO } from '../data/paises.js';

const col = k => CAMPOS.indexOf(k);
const KEYS = PCA4.vars;
const LABEL = Object.fromEntries(VARS.map(([k, name]) => [k, name]));
/* Short names for the table heads: the full ones do not fit in a column and the point
   of the figure is the shape of the table, not the wording of its headers. */
const SHORT = { pib: 'PIB', vida: 'vida', fertilidad: 'hijos', mortalidad: 'mortal.' };

/* Six countries, spread across the range rather than the first six alphabetically: a
   sample that is all of Africa teaches the wrong thing about the table. */
function sample() {
  const sorted = PAISES.slice().sort((a, b) => a[col('pib')] - b[col('pib')]);
  return [0, 1, 2, 3, 4, 5].map(i =>
    sorted[Math.round((i * (sorted.length - 1)) / 5)]);
}

/* ── The table, and the same table turned ──────────────────
   Both are cut: 183 rows do not fit on a wall and neither do 183 columns. What has to
   survive the cut is that it is the same table — same six countries, same four
   indicators, same numbers — so one variable is tinted in both, and the eye can follow
   a column becoming a row. */
export function transpuesta() {
  const W = 980, H = 470;
  const rows = sample();
  const HL = 'fertilidad';                 /* the one tinted in both halves */

  let b = arrow('ar-s5-turn', C.ask);
  const cw = 62, rh = 26;

  /* left: countries down, indicators across */
  const lx = 70, ly = 116;
  b += txt(lx, ly - 44, 'LA TABLA', { fs: 11.5, fill: C.ink3, ls: 1.6 });
  b += txt(lx, ly - 24, `${PAISES.length} países × ${KEYS.length} indicadores`,
           { fs: 12, fill: C.ink2 });
  KEYS.forEach((k, j) => {
    b += txt(lx + 96 + j * cw + cw / 2, ly, SHORT[k],
             { fs: 11, fill: k === HL ? C.ask : C.ink3, ta: 'middle' });
  });
  rows.forEach((p, i) => {
    const y = ly + 22 + i * rh;
    b += txt(lx, y, p[col('nombre')].slice(0, 12), { fs: 11.5, ff: MONO, fill: C.ink3 });
    KEYS.forEach((k, j) => {
      const x = lx + 96 + j * cw;
      if (k === HL) b += `<rect x="${x}" y="${y - 15}" width="${cw}" height="${rh - 4}"
        fill="${C.ask}" opacity=".12"/>`;
      b += txt(x + cw / 2, y, String(p[col(k)]), { fs: 11, ff: MONO, fill: C.ink, ta: 'middle' });
    });
  });
  b += txt(lx, ly + 22 + 6 * rh, '⋮', { fs: 14, fill: C.ink3 });
  b += txt(lx + 96, ly + 22 + 6 * rh + 4, `y ${PAISES.length - 6} países más`,
           { fs: 11, fill: C.ink3 });

  /* right: indicators down, countries across — the same numbers, turned */
  const rx = 540, ry = 116;
  b += txt(rx, ry - 44, 'LA TABLA GIRADA', { fs: 11.5, fill: C.ask, ls: 1.6 });
  b += txt(rx, ry - 24, `${KEYS.length} indicadores × ${PAISES.length} países`,
           { fs: 12, fill: C.ink2 });
  rows.forEach((p, j) => {
    b += txt(rx + 92 + j * 52 + 26, ry, p[col('codigo')].toUpperCase(),
             { fs: 10.5, ff: MONO, fill: C.ink3, ta: 'middle' });
  });
  b += txt(rx + 92 + 6 * 52 + 10, ry, '⋯', { fs: 14, fill: C.ink3 });
  KEYS.forEach((k, i) => {
    const y = ry + 22 + i * rh;
    if (k === HL) b += `<rect x="${rx}" y="${y - 15}" width="${92 + 6 * 52}" height="${rh - 4}"
      fill="${C.ask}" opacity=".12"/>`;
    b += txt(rx, y, SHORT[k], { fs: 11.5, ff: MONO, fill: k === HL ? C.ask : C.ink3 });
    rows.forEach((p, j) => {
      b += txt(rx + 92 + j * 52 + 26, y, String(p[col(k)]),
               { fs: 10.5, ff: MONO, fill: C.ink, ta: 'middle' });
    });
  });

  /* the turn itself */
  b += `<path d="M420,250 C468,250 470,206 512,206" fill="none" stroke="${C.ask}"
    stroke-width="1.4" marker-end="url(#ar-s5-turn)"/>`;
  b += txt(466, 286, 'transponer', { fs: 12, fill: C.ask, ta: 'middle' });

  b += box(70, 392, 840, 52, C.ask, { fill: C.ground2, sw: 1.2, stroke: C.ask });
  b += txt(92, 424, `Los mismos números. Lo que era una columna —${LABEL[HL].toLowerCase()}— `
    + 'es ahora una fila: la variable pasó a ser un registro.',
    { fs: 13.5, ff: SERIF, fill: C.ink });

  return svg(W, H, 'La tabla de países e indicadores junto a su transpuesta: los mismos '
    + 'números girados, de modo que cada variable, que era una columna, pasa a ser una '
    + `fila. Se muestran 6 de los ${PAISES.length} países`, b);
}

/* ── The circle of variables ───────────────────────────────
   Each variable as an arrow in the plane of the first two components. Starting from the
   correlation matrix, a loading *is* the correlation between that variable and that
   component, so every arrow fits inside a circle of radius one — and how close it gets
   to the edge is how well the plane represents it (RF-46). */
export function circulo() {
  const W = 980, H = 520, CXP = 400, CY = 262, R = 190;
  const L = PCA4.cargas;

  let b = arrow('ar-s5-load', C.ask);
  b += `<circle cx="${CXP}" cy="${CY}" r="${R}" fill="none" stroke="${C.line}"
    stroke-width="1.2"/>`;
  b += `<circle cx="${CXP}" cy="${CY}" r="${R / 2}" fill="none" stroke="${C.lineSoft}"
    stroke-width="1" stroke-dasharray="3 4"/>`;
  b += pline([[CXP - R - 18, CY], [CXP + R + 18, CY]], C.lineSoft, { sw: 1 });
  b += pline([[CXP, CY - R - 18], [CXP, CY + R + 18]], C.lineSoft, { sw: 1 });
  b += txt(CXP + R + 24, CY + 4, 'CP 1', { fs: 11, fill: C.ink3 });
  b += txt(CXP, CY - R - 26, 'CP 2', { fs: 11, fill: C.ink3, ta: 'middle' });

  KEYS.forEach((k, i) => {
    const x = CXP + L[i][0] * R, y = CY - L[i][1] * R;
    const largo = Math.hypot(L[i][0], L[i][1]);
    b += `<path d="M${CXP},${CY} L${x.toFixed(1)},${y.toFixed(1)}" stroke="${C.ask}"
      stroke-width="2" fill="none" marker-end="url(#ar-s5-load)"/>`;
    const away = 1 + 26 / (largo * R);
    const tx = CXP + L[i][0] * R * away, ty = CY - L[i][1] * R * away;
    b += txt(tx, ty + 4, LABEL[k], { fs: 12.5, ff: SERIF, fill: C.ink,
             ta: tx < CXP ? 'end' : 'start' });
    b += txt(tx, ty + 20, `${largo.toFixed(2)}`, { fs: 10.5, ff: MONO, fill: C.ink3,
             ta: tx < CXP ? 'end' : 'start' });
  });

  /* The reading rules, on the right, where they do not fight the drawing. */
  const rx = 700;
  b += txt(rx, 96, 'CÓMO SE LEE', { fs: 11.5, fill: C.ask, ls: 1.6 });
  [['Ángulo pequeño', 'las dos variables suben juntas'],
   ['Ángulo recto', 'no se dicen nada'],
   ['Ángulo llano', 'una sube cuando la otra baja'],
   ['Flecha larga', 'el plano la representa bien'],
   ['Flecha corta', 'esa variable vive fuera del plano']].forEach(([t, d], i) => {
    const y = 138 + i * 58;
    b += txt(rx, y, t, { fs: 13, ff: SERIF, fill: C.ink });
    b += txt(rx, y + 18, d, { fs: 11, fill: C.ink3 });
  });

  b += txt(CXP, CY + R + 60, `El radio es 1. Las cuatro flechas miden entre `
    + `${Math.min(...L.map(l => Math.hypot(l[0], l[1]))).toFixed(2)} y `
    + `${Math.max(...L.map(l => Math.hypot(l[0], l[1]))).toFixed(2)}: el plano las `
    + 'representa bien a las cuatro.', { fs: 12, fill: C.ink3, ta: 'middle' });

  return svg(W, H, 'Círculo de variables: las cuatro variables como flechas en el plano '
    + 'de las dos primeras componentes. ' + KEYS.map((k, i) =>
      `${LABEL[k]} con longitud ${Math.hypot(L[i][0], L[i][1]).toFixed(2)}`).join(', '), b);
}
