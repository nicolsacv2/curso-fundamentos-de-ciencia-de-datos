import { C, SERIF, svg, txt } from '../../../svg/kit.js';
import { axes, bar, box, dot, pline, scale, MONO } from './shared.js';
import { PAISES, CAMPOS, REGIONES, ANIO } from '../data/paises.js';

/* The five charts of block 1, all drawn from the same 183 countries. Using one dataset
   for all five is what makes them comparable: the differences the class sees between a
   bar chart and a box plot are differences between the charts, not between the data. */

const col = k => CAMPOS.indexOf(k);
export const REGION_COLOR = {
  africa: '#E0A458', americas: '#5BC8CE', asia: '#7FB069', europe: '#9EB0C3',
};

/* Countries grouped by region, with the mean of one indicator. */
function byRegion(key) {
  return REGIONES.map(([id, nombre]) => {
    const vals = PAISES.filter(p => p[col('region')] === id).map(p => p[col(key)]);
    return {
      id, nombre, n: vals.length,
      media: vals.reduce((a, b) => a + b, 0) / vals.length,
    };
  });
}

/* ── Bars: one length per category ────────────────────── */
export function barras() {
  const W = 980, H = 430, L = 150, B = 74, T = 46;
  const data = byRegion('vida');
  const top = Math.ceil(Math.max(...data.map(d => d.media)) / 10) * 10;
  const sy = scale([0, top], [H - B, T]);
  const wide = (W - L - 60) / data.length;

  let b = axes(L, H - B, W - L - 40, H - B - T);
  [0, 20, 40, 60, 80].filter(v => v <= top).forEach(v => {
    b += pline([[L - 5, sy(v)], [W - 40, sy(v)]], C.lineSoft, { sw: 1 });
    b += txt(L - 12, sy(v) + 4, String(v), { fs: 11, fill: C.ink3, ta: 'end' });
  });

  data.forEach((d, i) => {
    const x = L + 30 + i * wide;
    b += bar(x, sy(d.media), wide - 58, H - B - sy(d.media), REGION_COLOR[d.id], { op: 0.85 });
    b += txt(x + (wide - 58) / 2, sy(d.media) - 12, d.media.toFixed(1),
             { fs: 15, ff: SERIF, fill: C.ink, ta: 'middle' });
    b += txt(x + (wide - 58) / 2, H - B + 22, d.nombre, { fs: 12.5, fill: C.ink2, ta: 'middle' });
    b += txt(x + (wide - 58) / 2, H - B + 40, `${d.n} países`, { fs: 11, fill: C.ink3, ta: 'middle' });
  });

  b += txt(L - 12, T - 16, '↑ Esperanza de vida media (años)', { fs: 12, fill: C.ink3 });
  b += txt(56, 40, 'BARRAS', { fs: 11.5, fill: C.ask, ls: 1.6 });
  b += txt(56, 64, 'una categoría,', { fs: 12.5, fill: C.ink3 });
  b += txt(56, 82, 'un número', { fs: 12.5, fill: C.ink3 });

  return svg(W, H, 'Gráfico de barras: la esperanza de vida media de cada región, '
    + data.map(d => `${d.nombre} ${d.media.toFixed(1)} años`).join(', '), b);
}

/* ── Pie: parts of one whole ──────────────────────────── */
function slice(cx, cy, r, a0, a1, fill) {
  const p = a => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  const big = a1 - a0 > Math.PI ? 1 : 0;
  return `<path d="M${cx},${cy} L${x0.toFixed(1)},${y0.toFixed(1)}
    A${r},${r} 0 ${big} 1 ${x1.toFixed(1)},${y1.toFixed(1)} Z"
    fill="${fill}" opacity=".85" stroke="${C.ground2}" stroke-width="1.5"/>`;
}

export function circular() {
  const W = 980, H = 430, CXP = 330, CY = 225, R = 140;
  const data = byRegion('vida');
  const total = data.reduce((s, d) => s + d.n, 0);

  let b = '', a = -Math.PI / 2;
  data.forEach(d => {
    const next = a + (d.n / total) * Math.PI * 2;
    b += slice(CXP, CY, R, a, next, REGION_COLOR[d.id]);
    a = next;
  });

  /* The same numbers as bars, next to the pie. The comparison is the lesson: four
     angles are hard to rank by eye, four lengths are not. */
  data.forEach((d, i) => {
    const y = 120 + i * 46;
    b += `<rect x="620" y="${y - 12}" width="14" height="14" fill="${REGION_COLOR[d.id]}"/>`;
    b += txt(646, y, d.nombre, { fs: 13.5, ff: SERIF, fill: C.ink });
    b += txt(646, y + 18, `${d.n} países · ${(100 * d.n / total).toFixed(1)} %`,
             { fs: 11.5, fill: C.ink3 });
  });

  b += txt(56, 40, 'CIRCULAR', { fs: 11.5, fill: C.ask, ls: 1.6 });
  b += txt(56, 64, 'partes de', { fs: 12.5, fill: C.ink3 });
  b += txt(56, 82, 'un todo', { fs: 12.5, fill: C.ink3 });
  b += txt(CXP, 400, `${total} países repartidos por región · ${ANIO}`,
           { fs: 11.5, fill: C.ink3, ta: 'middle' });

  return svg(W, H, 'Gráfico circular: cómo se reparten los ' + total
    + ' países entre las cuatro regiones, ' + data.map(d =>
      `${d.nombre} ${(100 * d.n / total).toFixed(1)} por ciento`).join(', '), b);
}

/* ── Box: the five numbers of session 4, drawn ─────────── */
/* Interpolated quantile, the spreadsheet default and the one session 4 used. Changing
   the method here would move a median the class already wrote down. */
function quantile(sorted, q) {
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos), hi = Math.ceil(pos);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

function fiveNumbers(values) {
  const s = values.slice().sort((a, b) => a - b);
  const q1 = quantile(s, 0.25), med = quantile(s, 0.5), q3 = quantile(s, 0.75);
  const iqr = q3 - q1;
  const inside = s.filter(v => v >= q1 - 1.5 * iqr && v <= q3 + 1.5 * iqr);
  return {
    q1, med, q3,
    lo: Math.min(...inside), hi: Math.max(...inside),
    out: s.filter(v => v < q1 - 1.5 * iqr || v > q3 + 1.5 * iqr),
  };
}

export function caja() {
  const W = 980, H = 430, L = 150, B = 74, T = 46;
  const groups = REGIONES.map(([id, nombre]) => ({
    id, nombre,
    ...fiveNumbers(PAISES.filter(p => p[col('region')] === id).map(p => p[col('fertilidad')])),
  }));
  const sy = scale([0, 8], [H - B, T]);
  const wide = (W - L - 60) / groups.length;

  let b = axes(L, H - B, W - L - 40, H - B - T);
  [0, 2, 4, 6, 8].forEach(v => {
    b += pline([[L - 5, sy(v)], [W - 40, sy(v)]], C.lineSoft, { sw: 1 });
    b += txt(L - 12, sy(v) + 4, String(v), { fs: 11, fill: C.ink3, ta: 'end' });
  });

  groups.forEach((g, i) => {
    const cx = L + 30 + i * wide + (wide - 58) / 2, half = 34;
    b += pline([[cx, sy(g.hi)], [cx, sy(g.q3)]], C.ink3, { sw: 1.2 });
    b += pline([[cx, sy(g.q1)], [cx, sy(g.lo)]], C.ink3, { sw: 1.2 });
    b += pline([[cx - 16, sy(g.hi)], [cx + 16, sy(g.hi)]], C.ink3, { sw: 1.2 });
    b += pline([[cx - 16, sy(g.lo)], [cx + 16, sy(g.lo)]], C.ink3, { sw: 1.2 });
    b += bar(cx - half, sy(g.q3), half * 2, sy(g.q1) - sy(g.q3), REGION_COLOR[g.id],
             { op: 0.35, stroke: REGION_COLOR[g.id] });
    b += pline([[cx - half, sy(g.med)], [cx + half, sy(g.med)]], C.ink, { sw: 2.4 });
    g.out.forEach(v => { b += dot(cx, sy(v), 3.2, C.reveal, { op: 0.75 }); });
    b += txt(cx, H - B + 22, g.nombre, { fs: 12.5, fill: C.ink2, ta: 'middle' });
    b += txt(cx + half + 10, sy(g.med) + 4, g.med.toFixed(2), { fs: 11.5, ff: MONO, fill: C.ink });
  });

  /* The anatomy, named once, on the last box. A box plot is five numbers and nobody
     remembers which is which the first time. */
  const last = groups[groups.length - 1];
  const cx = L + 30 + (groups.length - 1) * wide + (wide - 58) / 2;
  [[last.hi, 'máximo sin atípicos'], [last.q3, 'cuartil 3'], [last.med, 'mediana'],
   [last.q1, 'cuartil 1'], [last.lo, 'mínimo']].forEach(([v, name]) => {
    b += txt(cx + 90, sy(v) + 4, name, { fs: 11, fill: C.ink3 });
    b += pline([[cx + 40, sy(v)], [cx + 84, sy(v)]], C.lineSoft, { sw: 1, dash: '2 3' });
  });

  b += txt(L - 12, T - 16, '↑ Hijos por mujer', { fs: 12, fill: C.ink3 });
  b += txt(56, 40, 'CAJA', { fs: 11.5, fill: C.ask, ls: 1.6 });
  b += txt(56, 64, 'la forma de', { fs: 12.5, fill: C.ink3 });
  b += txt(56, 82, 'un reparto', { fs: 12.5, fill: C.ink3 });
  b += txt(56, 112, 'en rojo, los', { fs: 11, fill: C.reveal });
  b += txt(56, 128, 'atípicos', { fs: 11, fill: C.reveal });

  return svg(W, H, 'Diagramas de caja de los hijos por mujer en cada región: '
    + groups.map(g => `${g.nombre} mediana ${g.med.toFixed(2)}`).join(', '), b);
}

/* ── Histogram: the same data, two bin widths ──────────── */
function bins(values, width) {
  const top = Math.ceil(Math.max(...values) / width) * width;
  const out = Array.from({ length: top / width }, () => 0);
  values.forEach(v => { out[Math.min(out.length - 1, Math.floor(v / width))] += 1; });
  return { out, width, top };
}

function histPanel(x0, y0, w, h, values, width, title) {
  const { out } = bins(values, width);
  const sy = scale([0, Math.max(...out)], [y0 + h, y0 + 26]);
  const bw = w / out.length;
  let b = axes(x0, y0 + h, w, h - 10);
  out.forEach((n, i) => {
    b += bar(x0 + i * bw, sy(n), Math.max(1, bw - 1.5), y0 + h - sy(n), C.ask, { op: 0.7 });
  });
  b += txt(x0, y0 + 6, title, { fs: 12.5, fill: C.ink2 });
  b += txt(x0, y0 + h + 22, `${out.length} intervalos`, { fs: 11, fill: C.ink3 });
  b += txt(x0 + w, y0 + h + 22, 'PIB per cápita →', { fs: 11, fill: C.ink3, ta: 'end' });
  return b;
}

export function histograma() {
  const W = 980, H = 430;
  const pib = PAISES.map(p => p[col('pib')]);
  let b = txt(56, 40, 'HISTOGRAMA', { fs: 11.5, fill: C.ask, ls: 1.6 });
  b += txt(56, 64, 'cómo se reparte', { fs: 12.5, fill: C.ink3 });
  b += txt(56, 82, 'una variable', { fs: 12.5, fill: C.ink3 });

  b += histPanel(230, 70, 330, 250, pib, 2500, 'intervalos de 2 500 dólares');
  b += histPanel(620, 70, 330, 250, pib, 20000, 'intervalos de 20 000 dólares');

  b += box(230, 366, 720, 44, C.reveal, { fill: C.ground2, sw: 1.2, stroke: C.reveal });
  b += txt(250, 394, 'Los mismos 183 países en los dos. El ancho del intervalo no viene '
    + 'con los datos: lo eliges tú.', { fs: 13, ff: SERIF, fill: C.ink });

  return svg(W, H, 'Dos histogramas del mismo PIB per cápita, uno con intervalos de 2 500 '
    + 'dólares y otro de 20 000: la misma variable cambia de forma según el ancho elegido', b);
}
