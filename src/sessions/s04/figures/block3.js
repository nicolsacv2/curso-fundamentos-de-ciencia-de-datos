import { C, svg, txt } from '../../../svg/kit.js';
import { axes, dot, pline, rng } from './shared.js';

/* Pearson's r, computed from the actual points drawn so the labels cannot lie. */
function pearson(pts) {
  const n = pts.length;
  const mx = pts.reduce((s, p) => s + p[0], 0) / n;
  const my = pts.reduce((s, p) => s + p[1], 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  pts.forEach(([x, y]) => {
    sxy += (x - mx) * (y - my);
    sxx += (x - mx) ** 2;
    syy += (y - my) ** 2;
  });
  return sxy / Math.sqrt(sxx * syy);
}

function fitLine(pts) {
  const n = pts.length;
  const mx = pts.reduce((s, p) => s + p[0], 0) / n;
  const my = pts.reduce((s, p) => s + p[1], 0) / n;
  let sxy = 0, sxx = 0;
  pts.forEach(([x, y]) => {
    sxy += (x - mx) * (y - my);
    sxx += (x - mx) ** 2;
  });
  const m = sxy / sxx;
  return x => my + m * (x - mx);
}

/* ═══════════ Block 3 · what r sees and what it misses ═══════════
   Four clouds, and under each one the r that Pearson reports. The first three behave:
   tighter cloud, bigger r. The fourth is the trap: a perfect relationship — every
   point obeys the same parabola — and r reports almost zero, because r only knows how
   to look for lines. */
export function scattersPearson() {
  const W = 980, H = 380;
  let b = '';

  const mk = (seed, f, noise, even) => {
    const r = rng(seed);
    const pts = [];
    for (let i = 0; i < 42; i++) {
      /* The parabola takes evenly spaced x: with a random sample the asymmetry around
         0.5 leaks into r, and this panel's whole point is that r comes out ≈ 0. */
      const x = even ? i / 41 : r();
      const y = f(x) + (r() - 0.5) * noise;
      pts.push([x, Math.max(0, Math.min(1, y))]);
    }
    return pts;
  };

  const clouds = [
    { name: 'CASI UNA LÍNEA', pts: mk(11, x => x, 0.22) },
    { name: 'LA MISMA LÍNEA, CON RUIDO', pts: mk(23, x => x, 0.72) },
    { name: 'LÍNEA QUE BAJA', pts: mk(37, x => 1 - x, 0.22) },
    { name: 'LA TRAMPA: PARÁBOLA', pts: mk(53, x => 0.05 + 3.6 * (x - 0.5) ** 2, 0.1, true), trap: true }
  ];

  clouds.forEach((cl, i) => {
    const x0 = 30 + i * 242, y0 = 290, pw = 200, ph = 220;
    const sx = v => x0 + v * pw, sy = v => y0 - v * ph;
    b += txt(x0, 46, cl.name, { fs: 10, fill: cl.trap ? C.reveal : C.ask, ls: 1.2 });
    b += axes(x0, y0, pw, ph);
    cl.pts.forEach(([x, y]) => {
      b += dot(sx(x), sy(y), 3.4, cl.trap ? C.reveal : C.ask, { op: 0.75 });
    });
    const r = pearson(cl.pts);
    b += txt(x0, y0 + 34, `r = ${r.toFixed(2)}`, {
      fs: 15, fill: cl.trap ? C.reveal : C.ink, fw: 600
    });
  });

  b += txt(30, H - 10, 'r MIDE ASOCIACIÓN LINEAL · «r CERCA DE 0» NO SIGNIFICA «NO HAY RELACIÓN»',
    { fs: 11, fill: C.reveal, ls: 1.2 });

  return svg(W, H,
    'Cuatro nubes de puntos con su coeficiente de Pearson: una línea casi perfecta, la ' +
    'misma con ruido, una que baja, y una parábola perfecta cuyo r es casi cero porque ' +
    'la relación existe pero no es lineal',
    b);
}

/* ═══════════ Block 3 · Spearman: the same points, asked by rank ═══════════
   Left, hours of use against time-to-sell: a real, monotone relationship that bends,
   so Pearson under-reports it. Right, the identical points replaced by their position
   in the fila — quién va primero, quién va segundo — and the bend disappears:
   Spearman is just Pearson computed on those positions. */
export function rangosSpearman() {
  const W = 980, H = 400;
  let b = '';

  /* A monotone, convex relationship: every step up in x is a step up in y. */
  const xs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  const ys = xs.map(x => Math.exp(x * 0.32));
  const ymax = ys[ys.length - 1];
  const vals = xs.map((x, i) => [x / 14, ys[i] / ymax]);
  const ranks = xs.map((x, i) => [(i + 1) / 14, (i + 1) / 14]);

  const panel = (x0, name, pts, color) => {
    const y0 = 300, pw = 320, ph = 220;
    const sx = v => x0 + v * pw, sy = v => y0 - v * ph;
    let s = txt(x0, 50, name, { fs: 10.5, fill: C.ask, ls: 1.6 });
    s += axes(x0, y0, pw, ph);
    pts.forEach(([x, y]) => {
      s += dot(sx(x), sy(y), 4.2, color, { op: 0.85 });
    });
    return s;
  };

  b += panel(50, 'EN VALORES', vals, C.ink2);
  b += panel(560, 'EN RANGOS: 1º, 2º, 3º…', ranks, C.ask);

  const rv = pearson(vals), rr = pearson(ranks);
  b += txt(50, 340, `Pearson = ${rv.toFixed(2)}`, { fs: 15, fill: C.ink, fw: 600 });
  b += txt(50, 362, 'la curva lo despista', { fs: 11.5, fill: C.ink3 });
  b += txt(560, 340, `Spearman = ${rr.toFixed(2)}`, { fs: 15, fill: C.ask, fw: 600 });
  b += txt(560, 362, 'el orden es perfecto, y eso era lo que había que medir', { fs: 11.5, fill: C.ink3 });

  /* The arrow of the idea: same data, different question. */
  b += pline([[400, 190], [530, 190]], C.reveal, { sw: 1.4, dash: '5 4' });
  b += txt(465, 176, 'mismos datos', { fs: 11, fill: C.reveal, ta: 'middle' });

  return svg(W, H,
    'Los mismos catorce puntos dos veces: en sus valores forman una curva y Pearson ' +
    'reporta 0.86; convertidos a su puesto en la fila forman una diagonal perfecta y ' +
    'Spearman reporta 1',
    b);
}

/* ═══════════ Block 3 · the Simpson teaser ═══════════
   The full paradox belongs to session 6; this is only the photograph that leaves the
   question planted. Both age groups improve with a bigger dose. Mixed together, the
   trend says the opposite — because who got the big doses was not decided at random. */
export function simpsonTeaser() {
  const W = 980, H = 440;
  let b = '';

  const x0 = 110, y0 = 350, pw = 780, ph = 260;
  const sx = v => x0 + (v / 10) * pw;
  const sy = v => y0 - (v / 90) * ph;

  const r1 = rng(71), r2 = rng(89);
  const jov = [], may = [];
  for (let i = 0; i < 16; i++) {
    const x = 1 + r1() * 3.2;
    jov.push([x, 52 + 6 * x + (r1() - 0.5) * 10]);
  }
  for (let i = 0; i < 16; i++) {
    const x = 5.8 + r2() * 3.2;
    may.push([x, 6 * x - 12 + (r2() - 0.5) * 10]);
  }

  b += axes(x0, y0, pw, ph);
  b += txt(x0 + pw, y0 + 26, 'dosis del medicamento →', { fs: 11.5, fill: C.ink3, ta: 'end' });
  b += txt(x0 - 14, y0 - ph, 'mejoría', { fs: 11.5, fill: C.ink3 });

  jov.forEach(([x, y]) => { b += dot(sx(x), sy(y), 4.5, C.ask, { op: 0.85 }); });
  may.forEach(([x, y]) => { b += dot(sx(x), sy(y), 4.5, C.ink3, { op: 0.9 }); });

  /* Each group's own trend, and the combined one. */
  const fj = fitLine(jov), fm = fitLine(may), fall = fitLine(jov.concat(may));
  b += pline([[sx(1), sy(fj(1))], [sx(4.2), sy(fj(4.2))]], C.ask, { sw: 2 });
  b += pline([[sx(5.8), sy(fm(5.8))], [sx(9), sy(fm(9))]], C.ink2, { sw: 2 });
  b += pline([[sx(1), sy(fall(1))], [sx(9), sy(fall(9))]], C.reveal, { sw: 2.2, dash: '7 5' });

  b += txt(sx(2.4), sy(fj(2.4)) - 16, 'jóvenes: a más dosis, más mejoría', { fs: 12, fill: C.ask });
  b += txt(sx(7.2), sy(fm(7.2)) + 26, 'mayores: a más dosis, más mejoría', { fs: 12, fill: C.ink2 });
  b += txt(sx(5.1), sy(fall(5.1)) - 14, 'todos juntos: «a más dosis, menos mejoría»', { fs: 12.5, fill: C.reveal });

  b += txt(x0, 36, 'LOS DOS GRUPOS MEJORAN · LA MEZCLA DICE LO CONTRARIO · SESIÓN 6',
    { fs: 11, fill: C.reveal, ls: 1.6 });

  return svg(W, H,
    'Reacción a un medicamento: dentro de los jóvenes la mejoría sube con la dosis, ' +
    'dentro de los mayores también, y con los dos grupos revueltos la tendencia global ' +
    'baja. La paradoja de Simpson, que la sesión 6 resuelve',
    b);
}
