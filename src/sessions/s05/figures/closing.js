import { C, SERIF, svg, txt } from '../../../svg/kit.js';
import { axes, bar, box, dot, pline, poly, scale, MONO } from './shared.js';
import { PAISES, CAMPOS, REGIONES, VARS, ANIO } from '../data/paises.js';

/* The four junk charts of the closing. All of them draw data the class has already read
   correctly earlier in the session, so the fault is never in the numbers: it is in the
   drawing. That is the whole argument of the block — every one of these is honest data
   made unreadable. */

const col = k => CAMPOS.indexOf(k);
const REGION_COLOR = {
  africa: '#E0A458', americas: '#5BC8CE', asia: '#7FB069', europe: '#9EB0C3',
};

function mediaPorRegion(key) {
  return REGIONES.map(([id, nombre]) => {
    const v = PAISES.filter(p => p[col('region')] === id).map(p => p[col(key)]);
    return { id, nombre, media: v.reduce((a, b) => a + b, 0) / v.length };
  });
}

/* ── 1. Three dimensions for two-dimensional data ──────────
   The same bars as block 1, given depth. Nothing is added: the third dimension carries
   no variable. What it does is put the top of each bar on a slanted face, so the value
   can no longer be read off the axis — the eye has to guess whether to read the front
   edge or the back one, and they differ. */
export function tresDeMas() {
  const W = 980, H = 470, T = 74, B = 96;
  const data = mediaPorRegion('vida');
  const top = 90;

  let b = txt(56, 40, 'ASÍ NO · tres dimensiones para dos variables',
              { fs: 11.5, fill: C.reveal, ls: 1.6 });

  /* left: the 3D version */
  const L = 96, sy = scale([0, top], [H - B, T]);
  const dx = 26, dy = -18;          /* the fake depth */
  b += pline([[L, H - B], [L + 380, H - B]], C.line, { sw: 1.2 });
  b += pline([[L, H - B], [L + dx, H - B + dy]], C.line, { sw: 1 });
  [0, 30, 60, 90].forEach(v => {
    b += txt(L - 12, sy(v) + 4, String(v), { fs: 10.5, fill: C.ink3, ta: 'end' });
    b += pline([[L - 5, sy(v)], [L, sy(v)]], C.line, { sw: 1 });
  });
  data.forEach((d, i) => {
    const x = L + 24 + i * 88, w = 52, y = sy(d.media), h = H - B - y;
    const c = REGION_COLOR[d.id];
    b += poly([[x + w, y], [x + w + dx, y + dy], [x + w + dx, y + dy + h], [x + w, y + h]],
              c, { op: 0.4 });
    b += poly([[x, y], [x + dx, y + dy], [x + w + dx, y + dy], [x + w, y]], c, { op: 0.62 });
    b += bar(x, y, w, h, c, { op: 0.85 });
    b += txt(x + w / 2, H - B + 22, d.nombre, { fs: 11, fill: C.ink3, ta: 'middle' });
  });
  b += txt(L, H - B + 52, '¿el valor se lee en la cara de delante o en la de atrás?',
           { fs: 11.5, fill: C.reveal });

  /* right: the same four numbers, flat */
  const L2 = 600, sy2 = scale([0, top], [H - B, T]);
  b += txt(L2 - 40, 40, 'ASÍ SÍ · los mismos cuatro números',
           { fs: 11.5, fill: C.ask, ls: 1.6 });
  b += axes(L2, H - B, 320, H - B - T);
  [0, 30, 60, 90].forEach(v => {
    b += txt(L2 - 12, sy2(v) + 4, String(v), { fs: 10.5, fill: C.ink3, ta: 'end' });
    b += pline([[L2 - 5, sy2(v)], [L2 + 320, sy2(v)]], C.lineSoft, { sw: 1 });
  });
  data.forEach((d, i) => {
    const x = L2 + 22 + i * 74, w = 48, y = sy2(d.media);
    b += bar(x, y, w, H - B - y, REGION_COLOR[d.id], { op: 0.85 });
    b += txt(x + w / 2, y - 10, d.media.toFixed(1), { fs: 13, ff: SERIF, fill: C.ink, ta: 'middle' });
    b += txt(x + w / 2, H - B + 22, d.nombre, { fs: 11, fill: C.ink3, ta: 'middle' });
  });
  b += txt(L2, H - B + 52, 'el borde de la barra toca el eje: se lee y ya',
           { fs: 11.5, fill: C.ask });

  return svg(W, H, 'El mismo gráfico de barras dibujado en tres dimensiones y en dos: '
    + 'la tercera dimensión no lleva ninguna variable y solo consigue que el valor de '
    + 'cada barra ya no se pueda leer sobre el eje', b);
}
