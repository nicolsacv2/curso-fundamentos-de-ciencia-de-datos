import { C, SERIF, svg, txt, arrow, wrap } from '../../../svg/kit.js';
import { axes, box, dot, pline, scale, MONO } from './shared.js';
import { PAISES, CAMPOS, VARS, CORR } from '../data/paises.js';

/* The three formulas the entry chains together, drawn rather than typeset.

   KaTeX and MathJax are the obvious tools and both are the fifth dependency principle 1
   refuses. MathML needs none, but its typography changes with the browser, and this has
   to read the same on the classroom projector as on the laptop it was prepared on.

   So there is a small typesetter below. The first attempt placed every glyph at a fixed
   coordinate and the bars of the means landed on the wrong x — close enough to look
   deliberate, which is the worst kind of wrong on a wall. Now a row is a list of pieces
   and the cursor advances, so a bar sits over the letter it belongs to by construction. */

const W = 980, H = 500;

/* Rough advance width of a glyph. Serif digits and letters at this size sit near half
   the font size; it does not have to be exact, it has to be consistent, because every
   position downstream is measured from it. */
const ADV = { serif: 0.5, mono: 0.6 };

function measure(parts, fs) {
  return parts.reduce((w, p) => {
    const f = (p.ff === MONO ? ADV.mono : ADV.serif) * (p.fs || fs);
    return w + p.t.length * f + (p.sup || p.sub ? 0.32 * (p.fs || fs) : 0) + (p.gap || 0);
  }, 0);
}

/* Draws the pieces left to right from x. A piece can carry a bar (the mean), a
   superscript (the square) or a subscript (which variable a deviation belongs to). */
function row(x, y, parts, fs) {
  let cur = x, s = '';
  parts.forEach(p => {
    const size = p.fs || fs;
    const adv = (p.ff === MONO ? ADV.mono : ADV.serif) * size;
    const w = p.t.length * adv;
    cur += p.gap || 0;
    s += txt(cur, y, p.t, { fs: size, ff: p.ff || SERIF, fill: p.fill || C.ink });
    if (p.bar) {
      s += `<line x1="${(cur + w * 0.08).toFixed(1)}" y1="${(y - size * 0.72).toFixed(1)}"
        x2="${(cur + w * 0.92).toFixed(1)}" y2="${(y - size * 0.72).toFixed(1)}"
        stroke="${p.fill || C.ink}" stroke-width="1.3"/>`;
    }
    if (p.sup) s += txt(cur + w + 1, y - size * 0.52, p.sup, { fs: size * 0.62, ff: SERIF, fill: p.fill || C.ink });
    if (p.sub) s += txt(cur + w + 1, y + size * 0.24, p.sub, { fs: size * 0.62, ff: SERIF, fill: p.fill || C.ink });
    cur += w + (p.sup || p.sub ? size * 0.32 : 0);
  });
  return s;
}

/* A fraction: both lines centred on x, the rule as wide as the wider of the two. */
function frac(x, y, top, bottom, fs) {
  const wt = measure(top, fs), wb = measure(bottom, fs);
  const width = Math.max(wt, wb) + 26;
  return row(x - wt / 2, y - 14, top, fs)
    + `<line x1="${(x - width / 2).toFixed(1)}" y1="${y}" x2="${(x + width / 2).toFixed(1)}" y2="${y}"
        stroke="${C.ink2}" stroke-width="1.2"/>`
    + row(x - wb / 2, y + 30, bottom, fs)
    + `<!-- w:${width.toFixed(0)} -->`;
}

/* The label and the one-line gloss on the left of each formula. */
function label(y, tag, note) {
  let s = txt(56, y, tag, { fs: 11.5, fill: C.ask, ls: 1.6 });
  wrap(note, 30).forEach((line, i) => {
    s += txt(56, y + 22 + i * 16, line, { fs: 12, fill: C.ink3 });
  });
  return s;
}

const FS = 20;
const X = 640;                    /* every fraction is centred here */

export default function formulas() {
  let s = arrow('ar-s5-chain', C.ask);

  /* ── variance ── */
  s += label(64, 'VARIANZA', 'cuánto se separa una variable de su media');
  s += row(430, 108, [{ t: 's', fs: 22, sup: '2' }, { t: '=', gap: 16, fill: C.ink2 }], FS);
  s += frac(X, 104,
    [{ t: 'Σ (' }, { t: 'x', sub: 'i' }, { t: '−', gap: 7 },
     { t: 'x', gap: 7, bar: true }, { t: ')', sup: '2' }],
    [{ t: 'n − 1' }], FS);
  s += txt(56, 148, 'en unidades al cuadrado', { fs: 11.5, fill: C.ink3 });

  /* ── covariance ── */
  s += label(232, 'COVARIANZA', 'cuánto se mueven dos variables a la vez');
  s += row(392, 276, [{ t: 'cov(x, y)' }, { t: '=', gap: 16, fill: C.ink2 }], FS);
  s += frac(X, 272,
    [{ t: 'Σ (' }, { t: 'x', sub: 'i' }, { t: '−', gap: 7 }, { t: 'x', gap: 7, bar: true },
     { t: ')(' }, { t: 'y', sub: 'i' }, { t: '−', gap: 7 }, { t: 'y', gap: 7, bar: true },
     { t: ')' }],
    [{ t: 'n − 1' }], FS);
  s += txt(56, 316, 'en el producto de las dos unidades', { fs: 11.5, fill: C.ink3 });

  /* ── correlation ── */
  s += label(400, 'CORRELACIÓN', 'la covarianza sin unidades, entre −1 y +1');
  s += row(430, 444, [{ t: 'r', fs: 22 }, { t: '=', gap: 16, fill: C.ink2 }], FS);
  s += frac(X, 440,
    [{ t: 'cov(x, y)' }],
    [{ t: 's', sub: 'x' }, { t: '·', gap: 10 }, { t: 's', gap: 10, sub: 'y' }], FS);
  s += txt(56, 484, 'sin unidades', { fs: 11.5, fill: C.ink3 });

  /* The chain, which is the point of the figure: each formula is made of the one above.
     Without these two arrows the entry is three definitions; with them it is one. */
  const link = (y0, y1, lines) => {
    let t = `<path d="M330,${y0} C300,${y0 + 34} 300,${y1 - 34} 330,${y1}" fill="none"
      stroke="${C.ask}" stroke-width="1.3" opacity=".7" marker-end="url(#ar-s5-chain)"/>`;
    lines.forEach((l, i) => { t += txt(284, y0 + 44 + i * 15, l, { fs: 11, fill: C.ask, ta: 'end' }); });
    return t;
  };
  s += link(132, 250, ['la covarianza de una variable', 'consigo misma es su varianza']);
  s += link(300, 420, ['dividida por las desviaciones', 'típicas: s = √ s²']);

  return svg(W, H,
    'Tres fórmulas encadenadas: la varianza es la suma de las diferencias al cuadrado '
    + 'con la media, dividida por n menos uno; la covarianza es lo mismo con dos '
    + 'variables; y la correlación es la covarianza dividida por el producto de las dos '
    + 'desviaciones típicas, lo que la deja sin unidades y entre menos uno y más uno',
    s);
}

/* ── Where that r is read ──────────────────────────────────
   The scatter the entry names but does not build: block 1 explains how it is made. Here
   it is only the surface the correlation lives on, so the class sees that r is not an
   abstraction but the tilt of this cloud.

   The coefficient comes out of CORR in the generated file. Typing −0.77 here would work
   until the day the data changes, and then it would be a number on a wall that no
   longer belongs to the dots underneath it. */
export function scatter() {
  const iVida = VARS.findIndex(v => v[0] === 'vida');
  const iFert = VARS.findIndex(v => v[0] === 'fertilidad');
  const r = CORR[iVida][iFert];
  const col = k => CAMPOS.indexOf(k);

  const SW = 980, SH = 470;
  const L = 96, RG = 40, T = 40, B = 62;
  const xs = PAISES.map(p => p[col('fertilidad')]);
  const ys = PAISES.map(p => p[col('vida')]);
  const sx = scale([Math.min(...xs) - 0.2, Math.max(...xs) + 0.2], [L, SW - RG]);
  const sy = scale([Math.min(...ys) - 2, Math.max(...ys) + 2], [SH - B, T]);

  let b = axes(L, SH - B, SW - RG - L, SH - B - T);

  [2, 3, 4, 5, 6, 7].forEach(v => {
    b += txt(sx(v), SH - B + 20, String(v), { fs: 11, fill: C.ink3, ta: 'middle' });
    b += pline([[sx(v), SH - B], [sx(v), SH - B + 5]], C.line, { sw: 1 });
  });
  [50, 60, 70, 80].forEach(v => {
    b += txt(L - 12, sy(v) + 4, String(v), { fs: 11, fill: C.ink3, ta: 'end' });
    b += pline([[L - 5, sy(v)], [L, sy(v)]], C.line, { sw: 1 });
  });

  const REGION = { africa: '#E0A458', americas: '#5BC8CE', asia: '#7FB069', europe: '#9EB0C3' };
  PAISES.forEach(p => {
    b += dot(sx(p[col('fertilidad')]), sy(p[col('vida')]), 4,
             REGION[p[col('region')]] || C.ink2, { op: 0.72 });
  });

  b += txt(SW - RG, SH - B + 38, 'Hijos por mujer →', { fs: 12, fill: C.ink3, ta: 'end' });
  b += txt(L - 12, T - 14, '↑ Esperanza de vida (años)', { fs: 12, fill: C.ink3 });

  /* The number the entry has just defined, sitting on the cloud it describes. */
  b += box(L + 18, T + 14, 232, 74, C.ask, { fill: C.ground2, sw: 1.2, stroke: C.ask });
  b += txt(L + 38, T + 40, 'CORRELACIÓN', { fs: 11, fill: C.ask, ls: 1.6 });
  b += txt(L + 38, T + 70, `r = ${r.toFixed(2)}`, { fs: 22, ff: SERIF, fill: C.ink });

  return svg(SW, SH,
    `Diagrama de dispersión de ${PAISES.length} países: hijos por mujer en el eje `
    + `horizontal y esperanza de vida en el vertical. La correlación entre las dos es `
    + `${r.toFixed(2)}: la nube baja de izquierda a derecha`,
    b);
}
