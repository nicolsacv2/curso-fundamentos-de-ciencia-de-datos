import { C, SERIF, svg, txt, arrow, wrap } from '../../../svg/kit.js';
import { camera, dot, farFirst, pline, poly, scale, z, MONO } from './shared.js';
import { PAISES, ESTAD, CAMPOS, PCA3, PCA4, VARS, ANIO } from '../data/paises.js';

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
function varianzaDe(pca, nVars) {
  const W = 980, H = 380, L = 210, B = 96, T = 78;
  const pct = pca.porcentajes;
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
  b += txt(L, 64, `de los ${PAISES.length} países con ${nVars} indicadores. El resto es lo `
    + 'que se pierde al aplanar.', { fs: 12, fill: C.ink3 });

  return svg(W, H, `Varianza explicada por cada componente de ${nVars} indicadores: `
    + pct.map((v, i) => `la ${i + 1} conserva el ${v} por ciento`).join(', ')
    + `; entre las dos primeras, el ${dos.toFixed(1)} por ciento`, b);
}

export const varianzaExplicada = () => varianzaDe(PCA3, 3);
export const varianzaCuatro = () => varianzaDe(PCA4, 4);

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

/* ── How the factorial plane is built, in seven drawings ───
   The first three are the reason this figure grew from five panels to seven.

   Panel 1 draws the cloud in its own units, and it comes out as a line: GDP runs to six
   figures while children per woman stays under eight, so on a shared scale there is only
   one axis left. Panel 2 finds the middle. Panel 3 standardises and the volume appears.

   That sequence answers a question worth asking out loud — centring is part of what PCA
   is, standardising is a decision — and answers it with the drawing rather than with an
   assurance. */
export function pasosPlano() {
  const W = 980, H = 400, PY = 128, PW = 118, GAP = 19;
  const cam = camera(0.72, 0.30);
  const pts = scored().filter((_, i) => i % 4 === 0);
  const mid = KEYS.map((_, i) => {
    const vs = pts.map(p => p.at[i]);
    return (Math.min(...vs) + Math.max(...vs)) / 2;
  });
  const [e1, e2] = PCA3.vectores;
  const U = 13;

  const panel = (i, titulo) => {
    const x0 = 22 + i * (PW + GAP);
    const cx = x0 + PW / 2, cy = PY + 84;
    const proj = at => {
      const [x, y] = cam(at.map((v, k) => v - mid[k]));
      return [cx + x * U, cy - y * U];
    };
    let b = txt(x0, PY - 58, String(i + 1).padStart(2, '0'), { fs: 19, ff: SERIF, fill: C.ask });
    wrap(titulo, 17).forEach((l, k) => {
      b += txt(x0, PY - 38 + k * 13, l, { fs: 10, fill: C.ink2 });
    });
    return { b, proj, cx, cy, x0 };
  };

  const nube = (proj, at) => (at || pts.map(p => p.at)).map((a, i) => {
    const [x, y] = proj(a);
    return dot(x, y, 2, REGION[pts[i].region] || C.ink2, { op: 0.6 });
  }).join('');

  const eje = (proj, e, len, color, rot) => {
    const [x0, y0] = proj(KEYS.map(() => 0));
    const [x1, y1] = proj(e.map(v => v * len));
    return pline([[x0, y0], [x1, y1]], color, { sw: 1.6 })
      + (rot ? txt(x1, y1 - 7, rot, { fs: 9, fill: color, ta: 'middle' }) : '');
  };

  const plano = proj => poly([[2.4, 1.8], [-2.4, 1.8], [-2.4, -1.8], [2.4, -1.8]]
    .map(([u, v]) => proj(e1.map((_, i) => e1[i] * u + e2[i] * v))),
    C.ask, { op: 0.16, stroke: C.ask, sw: 1 });

  let b = '';

  /* 1. raw units: one variable swallows the other two */
  const p1 = panel(0, 'La nube en sus unidades: el PIB se lo come todo');
  const crudo = pts.map(p => KEYS.map((k, i) =>
    (p.at[i] * ESTAD[k].desv) / ESTAD.pib.desv * 1.2));
  const medioCrudo = KEYS.map((_, i) => crudo.reduce((s, c) => s + c[i], 0) / crudo.length);
  b += p1.b + nube(p1.proj, crudo.map(c => c.map((v, i) => v - medioCrudo[i])));

  /* 2. the middle of it */
  const p2 = panel(1, 'El punto medio: el país promedio');
  b += p2.b + nube(p2.proj, crudo.map(c => c.map((v, i) => v - medioCrudo[i])));
  const [mx, my] = p2.proj(KEYS.map(() => 0));
  b += `<circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="5" fill="none"
    stroke="${C.reveal}" stroke-width="1.6"/>`;
  b += `<circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="1.6" fill="${C.reveal}"/>`;

  /* 3. standardise, and the volume appears */
  const p3 = panel(2, 'Estandarizar: un paso vale igual en los tres ejes');
  b += p3.b + nube(p3.proj);
  const [sx, sy] = p3.proj(KEYS.map(() => 0));
  b += `<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="1.6" fill="${C.reveal}"/>`;

  const p4 = panel(3, 'La dirección que más estira: CP 1');
  b += p4.b + nube(p4.proj) + eje(p4.proj, e1, 2.4, C.ask, 'CP 1');

  const p5 = panel(4, 'La perpendicular que más queda: CP 2');
  b += p5.b + nube(p5.proj) + eje(p5.proj, e1, 2.4, C.line)
     + eje(p5.proj, e2, 1.8, C.ask, 'CP 2');

  const p6 = panel(5, 'Las dos son un plano: el plano factorial');
  b += p6.b + plano(p6.proj) + nube(p6.proj);

  const p7 = panel(6, 'Cada país cae: esa sombra son sus coordenadas');
  b += p7.b + plano(p7.proj);
  pts.forEach((p, i) => {
    const s1 = dotp(p.at, e1), s2 = dotp(p.at, e2);
    const sombra = p7.proj(e1.map((_, k) => e1[k] * s1 + e2[k] * s2));
    if (i % 3 === 0) b += pline([p7.proj(p.at), sombra], C.ink3, { sw: 0.6, op: 0.5, dash: '2 2' });
    b += dot(sombra[0], sombra[1], 1.7, C.ask, { op: 0.7 });
  });
  b += nube(p7.proj);

  b += txt(22, 46, 'CÓMO SE CONSTRUYE EL PLANO FACTORIAL', { fs: 11.5, fill: C.ask, ls: 1.6 });
  b += txt(22, H - 18, 'Centrar es parte de lo que el PCA es. Estandarizar es una decisión, '
    + 'y aquí la toma el paso 01: sin ella no hay más que un eje.', { fs: 11, fill: C.ink3 });

  return svg(W, H, 'La construcción del plano factorial en siete pasos: la nube en sus '
    + 'unidades originales, donde el PIB aplasta a las otras dos variables y todo queda en '
    + 'una línea; el punto medio de la nube; la nube estandarizada, que ya tiene volumen; '
    + 'la dirección en la que más se estira, que es la primera componente; la perpendicular '
    + 'que más estira de lo que queda, que es la segunda; el plano que forman las dos; y la '
    + 'sombra de cada país sobre ese plano', b);
}

/* ── The factorial plane of all four ───────────────────────
   The block argues that four variables have no scene to turn, and this is the answer to
   it: there is no cloud, but there is a plane. The 183 countries placed by the first two
   components of the four-variable analysis — the same drawing as the right half of the
   before-and-after, with one more variable folded in and barely any more loss. */
export function planoCuatro() {
  const W = 980, H = 470, T = 60, B = 74;
  const [e1, e2] = PCA4.vectores;
  const keys = PCA4.vars;
  const pts = PAISES.map(p => {
    const at = keys.map(k => z(p[col(k)], ESTAD[k]));
    return {
      s1: at.reduce((s, v, i) => s + v * e1[i], 0),
      s2: at.reduce((s, v, i) => s + v * e2[i], 0),
      region: p[col('region')], nombre: p[col('nombre')],
    };
  });
  const pad = 0.5;
  const sx = scale([Math.min(...pts.map(p => p.s1)) - pad, Math.max(...pts.map(p => p.s1)) + pad],
                   [150, W - 60]);
  const sy = scale([Math.min(...pts.map(p => p.s2)) - pad, Math.max(...pts.map(p => p.s2)) + pad],
                   [H - B, T]);

  let b = pline([[130, sy(0)], [W - 40, sy(0)]], C.lineSoft, { sw: 1 });
  b += pline([[sx(0), T - 20], [sx(0), H - B + 16]], C.lineSoft, { sw: 1 });
  pts.forEach(p => {
    b += dot(sx(p.s1), sy(p.s2), 3.6, REGION[p.region] || C.ink2, { op: 0.72 });
  });

  const co = pts.find(p => p.nombre === 'Colombia');
  if (co) {
    /* Colombia lands in the crowded middle of the U, so its label carries its own ground
       — the same fix the block 1 scatter needed. */
    const cx = sx(co.s1), cy = sy(co.s2);
    b += dot(cx, cy, 5.5, C.reveal);
    b += `<rect x="${(cx + 10).toFixed(1)}" y="${(cy - 22).toFixed(1)}" width="76" height="19"
      rx="3" fill="${C.ground2}" opacity=".88" stroke="${C.reveal}" stroke-width=".8"/>`;
    b += txt(cx + 20, cy - 8, 'Colombia', { fs: 11.5, ff: MONO, fill: C.reveal });
  }

  b += txt(W - 60, sy(0) + 20, `componente 1 · ${PCA4.porcentajes[0]} % →`,
           { fs: 11, fill: C.ink3, ta: 'end' });
  b += txt(sx(0) + 10, T - 24, `↑ componente 2 · ${PCA4.porcentajes[1]} %`,
           { fs: 11, fill: C.ink3 });
  b += txt(56, 40, 'PLANO FACTORIAL', { fs: 11.5, fill: C.ask, ls: 1.6 });
  b += txt(56, 64, 'las cuatro', { fs: 12.5, fill: C.ink3 });
  b += txt(56, 82, 'variables', { fs: 12.5, fill: C.ink3 });
  Object.entries(REGION).forEach(([key, c], i) => {
    const nombre = { africa: 'África', americas: 'América', asia: 'Asia', europe: 'Europa' }[key];
    b += `<circle cx="61" cy="${118 + i * 20}" r="4.5" fill="${c}"/>`;
    b += txt(74, 122 + i * 20, nombre, { fs: 11, fill: C.ink3 });
  });

  return svg(W, H, `Plano factorial de los ${PAISES.length} países con los cuatro `
    + `indicadores: la primera componente conserva el ${PCA4.porcentajes[0]} por ciento y `
    + `la segunda el ${PCA4.porcentajes[1]}, con Colombia señalada`, b);
}
