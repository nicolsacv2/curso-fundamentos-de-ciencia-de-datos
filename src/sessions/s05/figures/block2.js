import { C, SERIF, svg, txt, arrow } from '../../../svg/kit.js';
import { camera, dot, farFirst, pline, scale, z, MONO } from './shared.js';
import { PAISES, ESTAD, CAMPOS, PCA3, VARS, ANIO } from '../data/paises.js';

const col = k => CAMPOS.indexOf(k);
const REGION = { africa: '#E0A458', americas: '#5BC8CE', asia: '#7FB069', europe: '#9EB0C3' };
const KEYS = PCA3.vars;
const dotp = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);

/* Every country in standard deviations, and its two scores on the components. The scores
   are the projection: what the plane keeps of each country. */
function scored() {
  const [e1, e2] = PCA3.vectores;
  return PAISES.map(p => {
    const at = KEYS.map(k => z(p[col(k)], ESTAD[k]));
    return { at, s1: dotp(at, e1), s2: dotp(at, e2), region: p[col('region')],
             nombre: p[col('nombre')] };
  });
}

/* ── The same cloud, before and after ──────────────────────
   Left: the cloud as it hangs in three dimensions, from the resting angle. Right: the
   same countries after being projected onto the plane. Same colours, same count, and
   Colombia marked in both, because "the same cloud" is a claim the figure has to make
   good on — otherwise it reads as two unrelated pictures with an arrow between them. */
export function antesYDespues() {
  const W = 980, H = 460;
  const pts = scored();
  const cam = camera(0.72, 0.30);

  let b = arrow('ar-s5-proj', C.ask);

  /* left: three dimensions, flattened by the camera */
  const mid = KEYS.map((_, i) => {
    const vs = pts.map(p => p.at[i]);
    return (Math.min(...vs) + Math.max(...vs)) / 2;
  });
  const projected = pts.map(p => {
    const [x, y, depth] = cam(p.at.map((v, i) => v - mid[i]));
    return { x: 230 + x * 36, y: 250 - y * 36, depth, region: p.region, nombre: p.nombre };
  });
  const near = Math.max(...projected.map(p => p.depth));
  const far = Math.min(...projected.map(p => p.depth));
  farFirst(projected).forEach(p => {
    const t = (p.depth - far) / (near - far || 1);
    b += dot(p.x, p.y, 3 + t * 1.2, REGION[p.region] || C.ink2, { op: 0.3 + t * 0.5 });
  });
  b += txt(230, 78, 'ANTES · tres ejes', { fs: 11.5, fill: C.ink3, ls: 1.6, ta: 'middle' });
  b += txt(230, 104, 'la nube en el aire', { fs: 13.5, ff: SERIF, fill: C.ink2, ta: 'middle' });

  /* right: the plane of the components, seen face on */
  const sx = scale([Math.min(...pts.map(p => p.s1)) - 0.4, Math.max(...pts.map(p => p.s1)) + 0.4],
                   [590, 930]);
  const sy = scale([Math.min(...pts.map(p => p.s2)) - 0.4, Math.max(...pts.map(p => p.s2)) + 0.4],
                   [400, 140]);
  b += pline([[575, sy(0)], [945, sy(0)]], C.lineSoft, { sw: 1 });
  b += pline([[sx(0), 130], [sx(0), 412]], C.lineSoft, { sw: 1 });
  pts.forEach(p => {
    b += dot(sx(p.s1), sy(p.s2), 3.4, REGION[p.region] || C.ink2, { op: 0.72 });
  });
  b += txt(760, 78, 'DESPUÉS · dos ejes', { fs: 11.5, fill: C.ask, ls: 1.6, ta: 'middle' });
  b += txt(760, 104, 'la sombra en el plano', { fs: 13.5, ff: SERIF, fill: C.ink2, ta: 'middle' });
  b += txt(945, sy(0) + 18, 'componente 1 →', { fs: 11, fill: C.ink3, ta: 'end' });
  b += txt(sx(0) + 8, 138, '↑ componente 2', { fs: 11, fill: C.ink3 });

  /* Colombia in both halves: the proof that it is one cloud and not two pictures. */
  const co = pts.find(p => p.nombre === 'Colombia');
  const coLeft = projected.find(p => p.nombre === 'Colombia');
  if (co && coLeft) {
    b += dot(coLeft.x, coLeft.y, 5.5, C.reveal);
    b += txt(coLeft.x + 10, coLeft.y - 8, 'Colombia', { fs: 11.5, ff: MONO, fill: C.reveal });
    b += dot(sx(co.s1), sy(co.s2), 5.5, C.reveal);
    b += txt(sx(co.s1) + 10, sy(co.s2) - 8, 'Colombia', { fs: 11.5, ff: MONO, fill: C.reveal });
  }

  b += `<path d="M430,250 L545,250" stroke="${C.ask}" stroke-width="1.4"
    marker-end="url(#ar-s5-proj)"/>`;
  b += txt(487, 234, 'proyectar', { fs: 11.5, fill: C.ask, ta: 'middle' });
  b += txt(487, 428, `${PAISES.length} países · ${ANIO}`, { fs: 11, fill: C.ink3, ta: 'middle' });

  return svg(W, H, 'La misma nube de países antes y después de proyectarse: a la izquierda '
    + 'en sus tres ejes originales, a la derecha sobre el plano de las dos primeras '
    + 'componentes, con Colombia señalada en las dos', b);
}

/* ── How much each component keeps ─────────────────────────
   The percentages are read out of PCA3, never typed. They are the answer to the only
   question that matters after a projection — what did we lose — and a number on a wall
   that no longer matches its data is worse than no number. */
export function varianzaExplicada() {
  const W = 980, H = 380, L = 210, B = 96, T = 78;
  const pct = PCA3.porcentajes;
  const sy = scale([0, 100], [H - B, T]);
  const wide = (W - L - 120) / pct.length;
  let acc = 0;

  let b = pline([[L - 6, sy(0)], [W - 100, sy(0)]], C.line, { sw: 1.2 });
  [25, 50, 75, 100].forEach(v => {
    b += pline([[L - 6, sy(v)], [W - 100, sy(v)]], C.lineSoft, { sw: 1 });
    b += txt(L - 16, sy(v) + 4, `${v} %`, { fs: 11, fill: C.ink3, ta: 'end' });
  });

  pct.forEach((v, i) => {
    const x = L + i * wide;
    const w = wide - 70;
    b += `<rect x="${x}" y="${sy(v).toFixed(1)}" width="${w}" height="${(sy(0) - sy(v)).toFixed(1)}"
      fill="${i === 0 ? C.ask : C.ink3}" opacity="${i === 0 ? 0.85 : 0.5}"/>`;
    b += txt(x + w / 2, sy(v) - 14, `${v} %`, { fs: 17, ff: SERIF, fill: C.ink, ta: 'middle' });
    b += txt(x + w / 2, sy(0) + 24, `componente ${i + 1}`, { fs: 12, fill: C.ink2, ta: 'middle' });
    acc += v;
    b += txt(x + w / 2, sy(0) + 44, `acumulado ${acc.toFixed(1)} %`,
             { fs: 10.5, ff: MONO, fill: C.ink3, ta: 'middle' });
  });

  const dos = pct[0] + pct[1];
  b += txt(L, 44, `Las dos primeras conservan el ${dos.toFixed(1)} % de la variación`,
           { fs: 15, ff: SERIF, fill: C.ink });
  b += txt(L, 64, `de los ${PAISES.length} países. La tercera es lo que se pierde al aplanar.`,
           { fs: 12, fill: C.ink3 });

  return svg(W, H, `Varianza explicada por cada componente: ${pct.map((v, i) =>
    `la ${i + 1} conserva el ${v} por ciento`).join(', ')}; entre las dos primeras, `
    + `el ${dos.toFixed(1)} por ciento`, b);
}

/* ── Who sits at each end of a component ───────────────────
   Read from the data, not written down: the countries at the extremes are the argument
   for a component's name, so they have to move if the data does. */
export function extremos(j, cuantos) {
  const [e] = [PCA3.vectores[j]];
  const puntuados = PAISES.map(p => ({
    nombre: p[col('nombre')],
    score: PCA3.vars.reduce((s, k, i) => s + z(p[col(k)], ESTAD[k]) * e[i], 0),
  })).sort((a, b) => a.score - b.score);
  const n = cuantos || 3;
  return {
    bajos: puntuados.slice(0, n).map(p => p.nombre),
    altos: puntuados.slice(-n).reverse().map(p => p.nombre),
  };
}
