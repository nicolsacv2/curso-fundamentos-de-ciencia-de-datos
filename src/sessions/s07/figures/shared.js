import { C, MONO, SERIF, txt, wrap } from '../../../svg/kit.js';

/* Session-local helpers, copied from s06/figures/shared.js because each session is its
   own chunk and must not drag in another's to draw a rectangle. Session 7 was split off
   session 6 and took the factorial blocks with it, so it took their helpers too. */

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

/* ═══════════ formulas, drawn rather than typeset ═══════════
   Copied from s05/figures/intro.js, not imported: each session is its own chunk and
   must not drag in another's to draw a fraction bar.

   KaTeX and MathJax are the obvious tools and both are the fifth dependency the
   project refuses. MathML needs none, but its typography changes with the browser,
   and this has to read the same on the classroom projector as on the laptop it was
   prepared on. So a row is a list of pieces and the cursor advances, so a bar sits
   over the letter it belongs to by construction. */

/* Advance width of a glyph, per glyph. Measured in the browser — canvas measureText in
   Iowan Old Style at 20 px, divided by 20 —, which is the face the course laptop draws
   the formulas with; the Greek letters are measured in the face they are drawn with (see
   GRIEGA). «Half an em per glyph» was the first estimate and it put a subscript on top
   of an O: an O is four fifths of an em, an i a third. The table is not exact on another
   face, but the projector mirrors the laptop, and what matters is that every position
   downstream (fractions, indices, roots) is measured with the same numbers it is drawn
   with. The mono advance stays fixed, because a mono face is. */
const ANCHOS = {
  ' ': 0.28, "'": 0.17, '(': 0.42, ')': 0.42, '+': 0.83, ',': 0.28, '.': 0.28, '/': 0.46,
  '=': 0.83, '[': 0.42, ']': 0.42, '|': 0.5, '·': 0.28, '×': 0.83, '−': 0.83, '≈': 0.83,
  '≤': 0.83, '≥': 0.83, '√': 0.63, '′': 0.14, '↦': 0.6, '…': 1.0,
  0: 0.56, 1: 0.56, 2: 0.56, 3: 0.56, 4: 0.56, 5: 0.56, 6: 0.56, 7: 0.56, 8: 0.56, 9: 0.56,
  A: 0.72, B: 0.62, C: 0.71, D: 0.78, E: 0.63, F: 0.58, G: 0.74, H: 0.79, I: 0.34, J: 0.33,
  K: 0.69, L: 0.57, M: 0.91, N: 0.81, O: 0.8, P: 0.59, Q: 0.8, R: 0.7, S: 0.54, T: 0.63,
  U: 0.79, V: 0.72, W: 1.04, X: 0.71, Y: 0.66, Z: 0.67,
  a: 0.48, b: 0.56, c: 0.45, d: 0.56, e: 0.49, f: 0.32, g: 0.52, h: 0.59, i: 0.3, j: 0.27,
  k: 0.55, l: 0.29, m: 0.88, n: 0.58, o: 0.55, p: 0.56, q: 0.56, r: 0.39, s: 0.44, t: 0.36,
  u: 0.59, v: 0.49, w: 0.77, x: 0.53, y: 0.49, z: 0.47,
  Σ: 0.6, η: 0.57, λ: 0.49, μ: 0.58, π: 0.6, σ: 0.57, χ: 0.51,
};
const ADV = { serif: 0.55, mono: 0.6 };

/* Greek letters get a face that draws them as Greek: Iowan Old Style's χ is an x without
   a tail, and «χ²» on the wall read as «x²». Georgia and Times give the chi its tail and
   the λ, η and Σ their usual shapes. Only the piece with the Greek character changes
   face; the Latin pieces around it stay in SERIF. */
export const GRIEGA = "Georgia, 'Times New Roman', serif";
const GRIEGO = /[Ͱ-Ͽ]/;
const familia = p => p.ff || (GRIEGO.test(p.t) ? GRIEGA : SERIF);

/* The advance of a piece of text, in px, at font size fs in family ff. */
export function avance(texto, fs, ff) {
  if (ff === MONO) return texto.length * ADV.mono * fs;
  let w = 0;
  for (const ch of texto) w += (ANCHOS[ch] ?? ADV.serif) * fs;
  return w;
}

/* Sub- and superscripts are set at this fraction of the body. */
const INDICE = 0.62;

/* What the cursor advances after a piece with an index: the wider of its sub- and
   superscript, measured at the index size, plus a breath. It used to be a third of the
   body whatever the index said, which is right for «i» and puts «ij», «AB», «adj» or
   «sup» on top of the next symbol. Used by row() and measure() alike, so that what is
   drawn is what was measured. */
function anchoIndice(p, size) {
  if (!p.sup && !p.sub) return 0;
  const chico = size * INDICE;
  return 1 + Math.max(p.sup ? avance(p.sup, chico, SERIF) : 0, p.sub ? avance(p.sub, chico, SERIF) : 0)
    + size * 0.06;
}

/* ── the square root ──
   A piece { raiz: [...pieces] } or { raiz: { top, bottom } } draws its radicand under a
   drawn sign and a bar. The sign is a path, not the «√» glyph: a glyph has one height,
   and a root over a fraction needs the fraction's height; drawn, it reaches from the
   radicand's descender to above its tallest part, and the bar runs from its vertex over
   everything the root covers. Geometry and drawing share one function so that measure()
   and row() agree. */
const RAIZ = { signo: 0.55, aire: 4, sube: 0.8, subeConIndice: 1.05, baja: 0.22 };

function geometriaRaiz(p, size) {
  const esFrac = !Array.isArray(p.raiz);
  const wi = esFrac
    ? Math.max(measure(p.raiz.top, size), measure(p.raiz.bottom, size)) + 26
    : measure(p.raiz, size);
  const conIndice = !esFrac && p.raiz.some(q => q.sup);
  /* px above and below the baseline the radicand occupies; the fraction is centred at
     y − 7 with its numerator 14 above and its denominator 30 below, as in frac() */
  const arriba = esFrac ? 7 + 14 + size * 0.85 + 2 : size * (conIndice ? RAIZ.subeConIndice : RAIZ.sube) + 2;
  const abajo = esFrac ? 23 + size * RAIZ.baja : size * RAIZ.baja;
  const alto = arriba + abajo;
  const ws = Math.max(size * RAIZ.signo, alto * 0.28);
  return { esFrac, wi, arriba, abajo, alto, ws, w: ws + 2 + wi + RAIZ.aire };
}

function anchoRaiz(p, size) {
  return geometriaRaiz(p, size).w;
}

function raiz(x, y, p, size) {
  const g = geometriaRaiz(p, size);
  const col = p.fill || C.ink;
  const top = y - g.arriba, bottom = y + g.abajo;
  const medio = bottom - g.alto * 0.45;
  const x0 = x + g.ws + 2;
  let s = `<path d="M${x.toFixed(1)},${medio.toFixed(1)} L${(x + g.ws * 0.32).toFixed(1)},${bottom.toFixed(1)}
    L${(x + g.ws).toFixed(1)},${top.toFixed(1)} H${(x0 + g.wi + 2).toFixed(1)}" fill="none" stroke="${col}"
    stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"/>`;
  s += g.esFrac
    ? frac(x0 + g.wi / 2, y - 7, p.raiz.top, p.raiz.bottom, size)
    : row(x0, y, p.raiz, size);
  return { s, w: g.w };
}

export function measure(parts, fs) {
  return parts.reduce((w, p) => {
    const size = p.fs || fs;
    const gap = p.gap || 0;
    if (p.raiz) return w + gap + anchoRaiz(p, size);
    return w + gap + avance(p.t, size, familia(p)) + anchoIndice(p, size);
  }, 0);
}

/* Draws the pieces left to right from x. A piece can carry a bar (the mean), a
   superscript (the square), a subscript (which variable a deviation belongs to), or be
   a root over other pieces. */
export function row(x, y, parts, fs) {
  let cur = x, s = '';
  parts.forEach(p => {
    const size = p.fs || fs;
    cur += p.gap || 0;
    if (p.raiz) {
      const r = raiz(cur, y, p, size);
      s += r.s;
      cur += r.w;
      return;
    }
    const ff = familia(p);
    const w = avance(p.t, size, ff);
    s += txt(cur, y, p.t, { fs: size, ff, fill: p.fill || C.ink });
    if (p.bar) {
      s += `<line x1="${(cur + w * 0.08).toFixed(1)}" y1="${(y - size * 0.72).toFixed(1)}"
        x2="${(cur + w * 0.92).toFixed(1)}" y2="${(y - size * 0.72).toFixed(1)}"
        stroke="${p.fill || C.ink}" stroke-width="1.3"/>`;
    }
    if (p.sup) s += txt(cur + w + 1, y - size * 0.52, p.sup, { fs: size * INDICE, ff: SERIF, fill: p.fill || C.ink });
    if (p.sub) s += txt(cur + w + 1, y + size * 0.24, p.sub, { fs: size * INDICE, ff: SERIF, fill: p.fill || C.ink });
    cur += w + anchoIndice(p, size);
  });
  return s;
}

/* A fraction: both lines centred on x, the rule as wide as the wider of the two. */
export function frac(x, y, top, bottom, fs) {
  const wt = measure(top, fs), wb = measure(bottom, fs);
  const width = Math.max(wt, wb) + 26;
  return row(x - wt / 2, y - 14, top, fs)
    + `<line x1="${(x - width / 2).toFixed(1)}" y1="${y}" x2="${(x + width / 2).toFixed(1)}" y2="${y}"
        stroke="${C.ink2}" stroke-width="1.2"/>`
    + row(x - wb / 2, y + 30, bottom, fs)
    + `<!-- w:${width.toFixed(0)} -->`;
}

/* The label and the one-line gloss on the left of each formula. */
export function label(y, tag, note) {
  let s = txt(56, y, tag, { fs: 11.5, fill: C.ask, ls: 1.6 });
  wrap(note, 30).forEach((line, i) => {
    s += txt(56, y + 22 + i * 16, line, { fs: 12, fill: C.ink3 });
  });
  return s;
}

/* ═══════════ the factorial plane, shared by the three blocks ═══════════
   The composition of the entrada's plano(): a square, the two axes through the origin,
   and the labels OUTSIDE the cloud — at the end of an axis they land on the points near
   the origin, which is where most of a factorial plane's points always are. An axis
   label says the axis' number and its percentage of inertia, and nothing else: naming
   it would be interpreting, and that happens in the prose with its contributions. */
export function plano(xa, ya, L, lim, ejes) {
  const sx = scale([-lim[0], lim[0]], [xa, xa + L]);
  const sy = scale([-lim[1], lim[1]], [ya + L, ya]);
  let b = pline([[sx(0), ya], [sx(0), ya + L]], C.lineSoft, { sw: 1 })
    + pline([[xa, sy(0)], [xa + L, sy(0)]], C.lineSoft, { sw: 1 })
    + txt(xa + L, ya + L + 20, `Eje 1 · ${num(ejes[0])} %`, { fs: 11, fill: C.ink3, ta: 'end' })
    + txt(xa, ya + L + 20, `Eje 2 · ${num(ejes[1])} % (vertical)`, { fs: 11, fill: C.ink3 });
  return { sx, sy, b };
}

/* A category on the plane: a square, because the individuals are circles and the two
   have to be told apart before any colour is read. */
export function cuadrado(cx, cy, lado, fill, o) {
  o = o || {};
  return `<rect x="${(cx - lado / 2).toFixed(1)}" y="${(cy - lado / 2).toFixed(1)}" width="${lado}"
    height="${lado}" rx="2" fill="${fill}" opacity="${o.op || 1}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="1.2"` : ''}/>`;
}

/* A supplementary point: hollow and dashed, because it received coordinates on a
   geometry it did not shape, and the mark has to say so before the caption does. */
export function suplementaria(cx, cy, r, color) {
  return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r}" fill="none" stroke="${color}"
    stroke-width="1.5" stroke-dasharray="4 3"/>`;
}

/* Stacks labels that would land on top of each other: sorted by y, any two closer than
   `minimo` in the same column of x are pushed apart. Simple on purpose — the check is
   check_figuras.mjs for the frame and the eye at 390 px for the rest. */
export function apilar(rotulos, minimo) {
  const orden = rotulos.slice().sort((a, b) => a.y - b.y);
  for (let i = 1; i < orden.length; i++) {
    for (let k = 0; k < i; k++) {
      if (Math.abs(orden[k].x - orden[i].x) < (orden[k].ancho || 60)
          && orden[i].y - orden[k].y < minimo) {
        orden[i].y = orden[k].y + minimo;
      }
    }
  }
  return orden;
}

/* The reading protocol's quality threshold: a point with less than this share of its
   distance captured by the plane is drawn but not interpreted. 0.2 is the rule of
   thumb the guide states, and it is a decision, not a fact — which is why it lives
   here once, is written out on screen wherever it is applied, and is read by block 1,
   by the closing and by the closing's figures from the same place. */
export const UMBRAL_COS2 = 0.2;

/* The reading filter of the closing, in one place for the figure and the prose: a
   category is interpreted when its contribution to axis 1 OR to axis 2 reaches the
   average share, AND its cos² in the plane reaches the threshold. Contributions say
   who built the axes; cos² says whether the plane shows the point where it is. */
export function pasaFiltro(cat, aportePromedio) {
  return (cat.ctr[0] >= aportePromedio || cat.ctr[1] >= aportePromedio)
    && cat.cos2 >= UMBRAL_COS2;
}

export { MONO, SERIF };
