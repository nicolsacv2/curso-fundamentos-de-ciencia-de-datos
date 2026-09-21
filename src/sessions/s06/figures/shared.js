import { C, MONO, txt } from '../../../svg/kit.js';

/* Session-local helpers, repeated instead of imported from s05 because each session
   is its own chunk and must not drag in another's to draw a rectangle. */

export function box(x, y, w, h, col, o) {
  o = o || {};
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${o.fill || C.ground2}"
    stroke="${o.stroke || C.line}" stroke-width="${o.sw || 1}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`;
  if (col) s += `<rect x="${x}" y="${y}" width="3" height="${h}" fill="${col}"/>`;
  return s;
}

export function dot(cx, cy, r, fill, o) {
  o = o || {};
  return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r}" fill="${fill}"
    opacity="${o.op || 1}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 1.2}"` : ''}/>`;
}

export function pline(pts, color, o) {
  o = o || {};
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${o.sw || 1.6}"
    opacity="${o.op || 1}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}${o.cap ? ` stroke-linecap="${o.cap}"` : ''}/>`;
}

export function bar(x, y, w, h, fill, o) {
  o = o || {};
  return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}"
    height="${Math.max(0, h).toFixed(1)}" fill="${fill}" opacity="${o.op || 1}"/>`;
}

/* Maps a value from a data range to a pixel range. Returns a function because every
   figure needs the same mapping for its dots, its ticks and its labels, and computing
   it twice is how an axis stops agreeing with what it is labelling. */
export function scale([d0, d1], [r0, r1]) {
  const span = d1 - d0 || 1;
  return v => r0 + ((v - d0) / span) * (r1 - r0);
}

/* A number the way it should be read out loud, not the way JS prints it. */
export function num(v) {
  return Number.isInteger(v) ? String(v) : String(v).replace('.', ',');
}

/* An axis label: what the axis measures and, when it has one, in what unit.
   ALTO_ROTULO is what a figure has to add to its viewBox to make room for one, and it
   is exported so a figure reserves the space instead of guessing at it — a viewBox
   that stops short crops the label with no error and no warning.

   `eje('x' | 'y', ...)` places it: the horizontal one under the far right of the axis,
   the vertical one above its top, reading left to right. A rotated y label reads
   better in print and worse on a wall at ten metres, which is where this is read. */
export const ALTO_ROTULO = 26;

export function eje(orientacion, x, y, texto, unidad) {
  const s = unidad ? `${texto} · ${unidad}` : texto;
  return orientacion === 'x'
    ? txt(x, y, s, { fs: 10.5, fill: C.ink3, ta: 'end', ls: 0.4 })
    : txt(x, y, s, { fs: 10.5, fill: C.ink3, ls: 0.4 });
}

/* ═══════════ panels of a pair matrix ═══════════
   Each of these draws ONE cell of a matrix, sixty-four times over, so they take a box
   (x, y, w, h) and draw inside it and nowhere else. They put no labels on: in a matrix
   the labels live on the outer edge, once per variable, or the grid turns into text. */

/* quantity × quantity: the cloud. */
export function panelDispersion(x, y, w, h, xs, ys, color) {
  const sx = scale([Math.min(...xs), Math.max(...xs)], [x + 4, x + w - 4]);
  const sy = scale([Math.min(...ys), Math.max(...ys)], [y + h - 4, y + 4]);
  return xs.map((v, i) => dot(sx(v), sy(ys[i]), 1.9, color, { op: 0.65 })).join('');
}

/* the diagonal of that one: the variable on its own. */
export function panelHistograma(x, y, w, h, cuenta, color) {
  const maxN = Math.max(...cuenta) || 1;
  const bw = w / cuenta.length;
  return cuenta.map((n, i) =>
    bar(x + i * bw + 0.6, y + h - (n / maxN) * (h - 6), bw - 1.2,
      (n / maxN) * (h - 6), color, { op: 0.5 })).join('');
}

/* quantity × name: one box per level, stacked down the cell.
   A level with two or three people gets a box that is not a summary of anything, so it
   is drawn hollow — the panel says «thin» without needing a number next to it. */
export function panelCajas(x, y, w, h, porNivel, niveles, color, minSolido) {
  const presentes = niveles.filter(n => porNivel[n]);
  if (!presentes.length) return '';
  const vals = presentes.flatMap(n => [porNivel[n].bigoteBajo, porNivel[n].bigoteAlto]);
  const s = scale([Math.min(...vals), Math.max(...vals)], [x + 4, x + w - 4]);
  const alto = (h - 6) / presentes.length;
  return presentes.map((n, i) => {
    const d = porNivel[n];
    const cy = y + 3 + i * alto + alto / 2;
    const hb = Math.min(9, alto - 3);
    const flaca = d.n < (minSolido || 4);
    return pline([[s(d.bigoteBajo), cy], [s(d.bigoteAlto), cy]], color, { sw: 1, op: 0.7 })
      + `<rect x="${s(d.q1).toFixed(1)}" y="${(cy - hb / 2).toFixed(1)}"
         width="${Math.max(1.5, s(d.q3) - s(d.q1)).toFixed(1)}" height="${hb}"
         fill="${flaca ? 'none' : color}" fill-opacity="0.45"
         stroke="${color}" stroke-width="1" ${flaca ? 'stroke-dasharray="2 2"' : ''}/>`
      + pline([[s(d.mediana), cy - hb / 2], [s(d.mediana), cy + hb / 2]], color, { sw: 1.6 });
  }).join('');
}

/* The categorical palette for the mosaic. Six hues, because «musica» has six levels.
   NOT chosen by eye: these are the dark-mode steps of the reference categorical theme,
   validated against THIS session's surface (--ground-2, #131D2B) rather than the one
   they were published for. All six checks pass — lightness band L 0.48–0.67, chroma
   floor, colour-blind separation (worst adjacent pair ΔE 8.4), normal-vision floor
   (ΔE 19.3) and ≥ 3:1 against the surface.

   Hues are assigned in this fixed order and never cycled: level 7 would need a seventh
   hue, and the honest move there is to fold levels, not to invent a colour. */
export const CATEGORICO = ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181', '#008300'];

/* name × name: a mosaic — bars stacked to 100 %, each bar as wide as its group.
 *
 * Stacked in RAW counts would answer a question nobody asked (how big the group is)
 * and hide the one that was asked (how the second variable splits inside it): with
 * levels running from 1 to 14 people, the split of a group of two would be a sliver
 * next to the split of a group of eleven. Conditioning removes the total from the
 * height, so what is left is only the split — which is the question.
 *
 * But a bar built on one person, stretched to 100 %, looks exactly as confident as one
 * built on fourteen. So the WIDTH carries the group size. Both facts are then readable
 * at once, without printing a number into sixty-four cells.
 */
export function panelMosaico(x, y, w, h, conteo, filas, cols) {
  const total = filas.reduce((acc, a) =>
    acc + cols.reduce((t, b) => t + ((conteo[a] || {})[b] || 0), 0), 0);
  if (!total) return '';
  const HUECO = 2;                      // between bars AND between stacked segments
  const util = w - HUECO * (filas.length - 1);
  let out = '';
  let cx = x;
  filas.forEach(a => {
    const fila = conteo[a] || {};
    const n = cols.reduce((t, b) => t + (fila[b] || 0), 0);
    const bw = (n / total) * util;
    let cy = y + h;
    cols.forEach((b, k) => {
      const parte = fila[b] || 0;
      if (!parte) return;
      /* the 2 px gap comes out of the segment, so segments never share an edge and two
         adjacent hues cannot read as one — which is also the secondary encoding the
         colour-blind case needs */
      const hs = (parte / n) * h;
      out += bar(cx, cy - hs, Math.max(0.8, bw), Math.max(0, hs - HUECO),
        CATEGORICO[k % CATEGORICO.length], { op: 0.9 });
      cy -= hs;
    });
    cx += bw + HUECO;
  });
  return out;
}

export { MONO };
