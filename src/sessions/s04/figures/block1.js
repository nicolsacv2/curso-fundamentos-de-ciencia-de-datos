import { C, svg, txt } from '../../../svg/kit.js';
import { box, axes, dot, pline } from './shared.js';
import { MINUTOS } from '../data/salon.js';

/* ═══════════ Block 1 · three legitimate centers of one triangle ═══════════
   The same triangle three times. Each panel constructs a different «center» and all
   three constructions are correct: which one is THE center depends on what you were
   going to use it for. Exactly what happens with promedio, mediana and moda. */
export function centrosTriangulo() {
  const W = 980, H = 330;
  let b = '';

  /* One local triangle: clearly scalene — no side repeats — but still acute, so all
     three centers land inside. */
  const A = [6, 260], Bv = [272, 230], Cv = [210, 52];
  const d = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
  const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  /* Side lengths, named opposite their vertex. */
  const a = d(Bv, Cv), c = d(A, Bv), bb = d(A, Cv);

  /* Centroid. */
  const G = [(A[0] + Bv[0] + Cv[0]) / 3, (A[1] + Bv[1] + Cv[1]) / 3];

  /* Circumcenter: intersection of two perpendicular bisectors, solved directly. */
  const [ax, ay] = A, [bx, by] = Bv, [cx, cy] = Cv;
  const D = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
  const O = [
    ((ax * ax + ay * ay) * (by - cy) + (bx * bx + by * by) * (cy - ay) + (cx * cx + cy * cy) * (ay - by)) / D,
    ((ax * ax + ay * ay) * (cx - bx) + (bx * bx + by * by) * (ax - cx) + (cx * cx + cy * cy) * (bx - ax)) / D
  ];

  /* Incenter, weighted by opposite sides. */
  const I = [
    (a * ax + bb * bx + c * cx) / (a + bb + c),
    (a * ay + bb * by + c * cy) / (a + bb + c)
  ];

  /* Where each bisector from a vertex meets the opposite side. */
  const cut = (P, Q, w1, w2) => [(w1 * P[0] + w2 * Q[0]) / (w1 + w2), (w1 * P[1] + w2 * Q[1]) / (w1 + w2)];

  const mAB = mid(A, Bv), mBC = mid(Bv, Cv), mCA = mid(A, Cv);
  const panels = [
    {
      x: 30, name: 'MEDIANAS', center: G, label: 'baricentro',
      lines: [[A, mBC], [Bv, mCA], [Cv, mAB]],
      /* The construction points: the midpoints the medians aim at. */
      marks: [mAB, mBC, mCA]
    },
    {
      x: 355, name: 'MEDIATRICES', center: O,
      label: 'circuncentro',
      /* From each midpoint, through the circumcenter, with a little overshoot. */
      lines: [
        [mAB, [O[0] + (O[0] - mAB[0]) * 0.35, O[1] + (O[1] - mAB[1]) * 0.35], [A, Bv]],
        [mBC, [O[0] + (O[0] - mBC[0]) * 0.35, O[1] + (O[1] - mBC[1]) * 0.35], [Bv, Cv]],
        [mCA, [O[0] + (O[0] - mCA[0]) * 0.35, O[1] + (O[1] - mCA[1]) * 0.35], [A, Cv]]
      ],
      marks: [mAB, mBC, mCA],
      ortho: true
    },
    {
      x: 680, name: 'BISECTRICES', center: I, label: 'incentro',
      lines: [[A, cut(Bv, Cv, bb, c)], [Bv, cut(A, Cv, a, c)], [Cv, cut(A, Bv, a, bb)]],
      marks: [cut(Bv, Cv, bb, c), cut(A, Cv, a, c), cut(A, Bv, a, bb)]
    }
  ];

  panels.forEach(p => {
    const T = q => [q[0] + p.x, q[1] + 20];
    b += txt(p.x, 26, p.name, { fs: 10.5, fill: C.ask, ls: 1.8 });
    b += pline([T(A), T(Bv), T(Cv), T(A)], C.ink2, { sw: 1.4 });
    p.lines.forEach(([from, to, base]) => {
      b += pline([T(from), T(to)], C.ink3, { sw: 1, dash: '4 4', op: 0.9 });
      if (p.ortho && base) {
        /* The ⊥ signal: the right-angle square between the side and its mediatriz. */
        const [f] = [T(from)];
        const vx = base[1][0] - base[0][0], vy = base[1][1] - base[0][1];
        const lv = Math.hypot(vx, vy), u = [vx / lv, vy / lv];
        let w = [-u[1], u[0]];
        const ctr = T(p.center);
        if ((ctr[0] - f[0]) * w[0] + (ctr[1] - f[1]) * w[1] < 0) w = [-w[0], -w[1]];
        const m = 9;
        b += `<path d="M${f[0] + m * u[0]},${f[1] + m * u[1]} L${f[0] + m * (u[0] + w[0])},${f[1] + m * (u[1] + w[1])} L${f[0] + m * w[0]},${f[1] + m * w[1]}" fill="none" stroke="${C.reveal}" stroke-width="1.2"/>`;
      }
    });
    /* Vertices and construction points, highlighted as points. */
    [A, Bv, Cv].forEach(v => { b += dot(...T(v), 4.5, C.ink); });
    p.marks.forEach(mk => { b += dot(...T(mk), 4, C.ask); });
    const ctr = T(p.center);
    b += dot(ctr[0], ctr[1], 5, C.reveal);
    b += txt(ctr[0] + 10, ctr[1] + 4, p.label, { fs: 12, fill: C.reveal });
  });
  b += txt(30, H - 40, '● vértices', { fs: 11, fill: C.ink });
  b += txt(150, H - 40, '● puntos medios y pies', { fs: 11, fill: C.ask });
  b += txt(370, H - 40, '∟ ángulo recto: la mediatriz es ortogonal a su lado', { fs: 11, fill: C.reveal });

  b += txt(30, H - 14, 'TRES CONSTRUCCIONES CORRECTAS · TRES PUNTOS DISTINTOS · NINGUNO ES «EL» CENTRO',
    { fs: 11, fill: C.reveal, ls: 1.4 });

  return svg(W, H,
    'El mismo triángulo tres veces: las medianas se cruzan en el baricentro, las ' +
    'mediatrices en el circuncentro y las bisectrices en el incentro. Tres centros ' +
    'distintos y los tres legítimos',
    b);
}

/* ═══════════ Block 1 · what each summary minimizes ═══════════
   Both curves are computed over the class's own 20 minutes-of-phone values. Move the
   candidate summary along the x axis and add up how wrong it is: penalizing the error
   squared, the best possible number is the promedio; penalizing the absolute error,
   the best possible number is the mediana. Neither minimum is a coincidence. */
export function perdidas() {
  const W = 980, H = 430;
  let b = '';
  const vals = MINUTOS.valores;

  const x0 = 90, y0 = 360, pw = 830, ph = 280;
  const dom = 320;
  const sx = v => x0 + (v / dom) * pw;

  const L1 = c => vals.reduce((s, v) => s + Math.abs(v - c), 0);
  const L2 = c => vals.reduce((s, v) => s + (v - c) * (v - c), 0);

  const cs = [];
  for (let cnd = 0; cnd <= dom; cnd += 2) cs.push(cnd);
  const l1 = cs.map(L1), l2 = cs.map(L2);
  const norm = arr => {
    const lo = Math.min(...arr), hi = Math.max(...arr);
    return arr.map(v => (v - lo) / (hi - lo));
  };
  const sy = t => y0 - 24 - t * (ph - 40);
  const n1 = norm(l1), n2 = norm(l2);

  b += axes(x0, y0, pw, ph);
  b += txt(x0 + pw, y0 + 26, 'si resumieras la columna F con este número →', { fs: 11.5, fill: C.ink3, ta: 'end' });
  b += txt(x0 - 14, y0 - ph, 'cuánto te equivocas en total', { fs: 11.5, fill: C.ink3, ta: 'start' });

  b += pline(cs.map((cnd, i) => [sx(cnd), sy(n2[i])]), C.ask, { sw: 1.8 });
  b += pline(cs.map((cnd, i) => [sx(cnd), sy(n1[i])]), C.ink2, { sw: 1.8, dash: '6 4' });

  b += txt(sx(16) + 12, sy(n2[8]) + 4, 'error al cuadrado', { fs: 12, fill: C.ask });
  b += txt(sx(300), sy(n1[150]) + 24, 'error absoluto', { fs: 12, fill: C.ink2, ta: 'end' });

  /* The two minima. */
  const iMean = cs.findIndex(cnd => cnd >= 152), iMed = cs.findIndex(cnd => cnd >= 120);
  const pm = [sx(cs[iMean]), sy(n2[iMean])], pd = [sx(cs[iMed]), sy(n1[iMed])];
  b += pline([[pm[0], pm[1]], [pm[0], y0]], C.reveal, { sw: 1, dash: '3 4', op: 0.85 });
  b += pline([[pd[0], pd[1]], [pd[0], y0]], C.reveal, { sw: 1, dash: '3 4', op: 0.85 });
  b += dot(pm[0], pm[1], 5, C.reveal);
  b += dot(pd[0], pd[1], 5, C.reveal);
  b += txt(pm[0] + 8, y0 - 6, 'promedio · 152.6', { fs: 12, fill: C.reveal });
  b += txt(pd[0] - 8, y0 - 6, 'mediana · 120', { fs: 12, fill: C.reveal, ta: 'end' });

  b += txt(x0, 30, 'CADA RESUMEN ES EL CAMPEÓN DE SU PROPIA MANERA DE MEDIR EL ERROR',
    { fs: 11, fill: C.reveal, ls: 1.4 });

  return svg(W, H,
    'Dos curvas de error total sobre los veinte valores de la columna F: penalizando ' +
    'el error al cuadrado el mínimo cae exactamente en el promedio, 152.6; penalizando ' +
    'el error absoluto el mínimo cae exactamente en la mediana, 120',
    b);
}

/* ═══════════ Block 1 · quantiles cut ranks, not values ═══════════
   The same twenty answers twice. Above, spread by their rank: the cuts make four
   groups of five people. Below, at their real value in minutes: the same cuts land
   at 7.3, 120 and 187.5, nowhere near evenly spaced. */
export function cuantiles() {
  const W = 980, H = 420;
  let b = '';
  const vals = MINUTOS.valores;
  const x0 = 60, pw = 860;
  const yRank = 120, yVal = 300;

  const rx = i => x0 + (i / (vals.length - 1)) * pw;
  const vmax = 960;
  const vx = v => x0 + (v / vmax) * pw;

  b += txt(x0, 40, 'LAS 20 RESPUESTAS, EN ORDEN', { fs: 10.5, fill: C.ask, ls: 1.8 });
  b += txt(x0, yVal - 58, 'LAS MISMAS 20, EN MINUTOS', { fs: 10.5, fill: C.ask, ls: 1.8 });

  /* Threads from rank to value. */
  vals.forEach((v, i) => {
    b += pline([[rx(i), yRank + 6], [vx(v), yVal - 6]], C.ink3, { sw: 0.8, op: 0.35 });
  });

  vals.forEach((v, i) => {
    b += dot(rx(i), yRank, 5, C.ink2);
    b += dot(vx(v), yVal, 5, C.ink2, { op: 0.85 });
  });

  /* Cuts: after ranks 5, 10 and 15; at values Q1, mediana, Q3. */
  const cuts = [
    { r: 4.5, v: MINUTOS.q1, name: 'Q1 · 7.3' },
    { r: 9.5, v: MINUTOS.mediana, name: 'mediana · 120' },
    { r: 14.5, v: MINUTOS.q3, name: 'Q3 · 187.5' }
  ];
  cuts.forEach(cut => {
    const xr = x0 + (cut.r / (vals.length - 1)) * pw;
    b += pline([[xr, yRank - 26], [xr, yRank + 22]], C.reveal, { sw: 1.4 });
    const xv = vx(cut.v);
    b += pline([[xv, yVal - 22], [xv, yVal + 26]], C.reveal, { sw: 1.4 });
    b += txt(xv, yVal + 44, cut.name, { fs: 11.5, fill: C.reveal, ta: 'middle' });
  });

  ['5 personas', '5 personas', '5 personas', '5 personas'].forEach((s, i) => {
    const xa = x0 + ((i * 5 + 2) / (vals.length - 1)) * pw;
    b += txt(xa, yRank - 34, s, { fs: 11, fill: C.ink3, ta: 'middle' });
  });

  b += txt(x0, yVal + 84, 'MISMOS CORTES · GRUPOS IGUALES DE GENTE · TRAMOS MUY DESIGUALES DE MINUTOS',
    { fs: 11, fill: C.reveal, ls: 1.4 });

  return svg(W, H,
    'Las veinte respuestas de minutos de celular dos veces: espaciadas por su puesto en ' +
    'la fila, los cuartiles hacen cuatro grupos de cinco personas; puestas en su valor ' +
    'real, los mismos cortes caen en 7.3, 120 y 187.5 minutos',
    b);
}
