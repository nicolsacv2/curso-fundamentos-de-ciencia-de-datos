import { C, svg, txt } from '../../../svg/kit.js';
import { dot, pline } from './shared.js';

/* ═══════════ Block 2 · three groups that summarize identically ═══════════
   Eleven values per row, invented for this: the three rows have promedio 120,
   mediana 120 and moda 120. If the class only reports a center, the three groups
   are the same group. They are not. */
export function enjambres() {
  const W = 980, H = 430;
  let b = '';

  const rows = [
    { name: 'A', y: 120, sd: '8.9', rango: 30, vals: [105, 110, 112, 118, 120, 120, 120, 122, 128, 130, 135] },
    { name: 'B', y: 215, sd: '51.6', rango: 180, vals: [30, 60, 85, 100, 120, 120, 120, 140, 155, 180, 210] },
    { name: 'C', y: 310, sd: '92.6', rango: 240, vals: [0, 10, 20, 40, 120, 120, 120, 200, 220, 230, 240] }
  ];

  const x0 = 90, pw = 700;
  const sx = v => x0 + (v / 240) * pw;

  /* The shared center, through the three rows. */
  b += pline([[sx(120), 72], [sx(120), 352]], C.reveal, { sw: 1.2, dash: '4 4', op: 0.9 });
  b += txt(sx(120), 58, 'promedio = mediana = moda = 120', { fs: 12.5, fill: C.reveal, ta: 'middle' });

  rows.forEach(r => {
    b += txt(30, r.y + 5, r.name, { fs: 16, fill: C.ink, ff: "'Iowan Old Style', Palatino, Georgia, serif" });
    b += pline([[x0, r.y], [x0 + pw, r.y]], C.lineSoft, { sw: 1 });
    /* Repeated values stack instead of hiding behind each other. */
    const seen = {};
    r.vals.forEach(v => {
      const k = seen[v] || 0;
      seen[v] = k + 1;
      b += dot(sx(v), r.y - k * 14, 6, C.ask, { op: 0.9 });
    });
    b += txt(x0 + pw + 24, r.y - 4, `desviación ${r.sd}`, { fs: 12, fill: C.ink2 });
    b += txt(x0 + pw + 24, r.y + 14, `rango ${r.rango}`, { fs: 12, fill: C.ink3 });
  });

  b += txt(30, H - 44, '0', { fs: 11, fill: C.ink3 });
  b += txt(x0 + pw, H - 44, '240', { fs: 11, fill: C.ink3, ta: 'end' });
  b += txt(30, H - 16, 'TRES GRUPOS · UN MISMO CENTRO · TRES REALIDADES',
    { fs: 11, fill: C.reveal, ls: 1.6 });

  return svg(W, H,
    'Tres enjambres de once valores con el mismo promedio, la misma mediana y la misma ' +
    'moda, 120, pero con desviaciones de 8.9, 51.6 y 92.6: el centro solo no distingue ' +
    'a los tres grupos',
    b);
}

/* ═══════════ Block 2 · the same deviation is not the same risk ═══════════
   Two savers with the SAME standard deviation on their savings: doce millones. For one
   it is 40% of everything she has; for the other, 3%. The coefficient of variation is
   that division, and it is the number the decision actually depends on. */
export function ahorros() {
  const W = 980, H = 370;
  let b = '';

  const x0 = 250, pw = 660;
  const sx = v => x0 + (v / 450) * pw;

  const rows = [
    { y: 110, who: 'Amalia · 28 años', media: 30, cv: '0.40', lee: 'una mala racha es el 40% de su vida ahorrada' },
    { y: 230, who: 'Bernardo · 62 años', media: 400, cv: '0.03', lee: 'la misma mala racha es el 3% de la suya' }
  ];

  rows.forEach(r => {
    /* On the long bar the labels would run off the 980px canvas, so they flip to the
       left of the whisker and anchor at their end. */
    const flip = sx(r.media) > 620;
    b += txt(30, r.y - 26, `${r.who.toUpperCase()} — $${r.media} MILLONES AHORRADOS`,
      { fs: 11, fill: C.ask, ls: 1.6 });
    b += `<rect x="${x0}" y="${r.y - 12}" width="${sx(r.media) - x0}" height="24"
      fill="rgba(91,200,206,.16)" stroke="${C.ask}" stroke-width="1.2"/>`;
    /* The identical whisker: ±12 millones. */
    const lo = sx(r.media - 12), hi = sx(r.media + 12);
    b += pline([[lo, r.y + 34], [hi, r.y + 34]], C.reveal, { sw: 2.2 });
    b += pline([[lo, r.y + 27], [lo, r.y + 41]], C.reveal, { sw: 2.2 });
    b += pline([[hi, r.y + 27], [hi, r.y + 41]], C.reveal, { sw: 2.2 });
    b += txt(flip ? lo - 12 : hi + 12, r.y + 39, 'desviación: $12 millones — la misma',
      { fs: 11.5, fill: C.reveal, ta: flip ? 'end' : 'start' });
    b += txt(x0, r.y + 68, `CV = 12 / ${r.media} = ${r.cv}  ·  ${r.lee}`, { fs: 12.5, fill: C.ink2 });
  });

  b += txt(30, H - 16, 'MISMA DESVIACIÓN · DECISIONES OPUESTAS · EL CV ES LA DESVIACIÓN PUESTA EN CONTEXTO',
    { fs: 11, fill: C.reveal, ls: 1.2 });

  return svg(W, H,
    'Dos personas con la misma desviación de doce millones en sus ahorros: para quien ' +
    'tiene treinta millones el coeficiente de variación es 0.40; para quien tiene ' +
    'cuatrocientos, 0.03. La misma desviación no es el mismo riesgo',
    b);
}
