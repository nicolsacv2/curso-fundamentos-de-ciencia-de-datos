import { C, SERIF, svg, txt, arrow, wrap } from '../../../svg/kit.js';
import { box, dot, pline, scale, z, MONO } from './shared.js';
import { PAISES, CAMPOS, VARS, PCA4, CORR, ESTAD, ANIO } from '../data/paises.js';

const col = k => CAMPOS.indexOf(k);
const KEYS = PCA4.vars;
const LABEL = Object.fromEntries(VARS.map(([k, name]) => [k, name]));
/* Short names for the table heads: the full ones do not fit in a column and the point
   of the figure is the shape of the table, not the wording of its headers. */
const SHORT = { pib: 'PIB', vida: 'vida', fertilidad: 'hijos', mortalidad: 'mortal.' };

/* Six countries, spread across the range rather than the first six alphabetically: a
   sample that is all of Africa teaches the wrong thing about the table. */
function sample() {
  const sorted = PAISES.slice().sort((a, b) => a[col('pib')] - b[col('pib')]);
  return [0, 1, 2, 3, 4, 5].map(i =>
    sorted[Math.round((i * (sorted.length - 1)) / 5)]);
}

/* ── The table, and the same table turned ──────────────────
   Both are cut: 183 rows do not fit on a wall and neither do 183 columns. What has to
   survive the cut is that it is the same table — same six countries, same four
   indicators, same numbers — so one variable is tinted in both, and the eye can follow
   a column becoming a row. */
export function transpuesta() {
  const W = 980, H = 470;
  const rows = sample();
  const HL = 'fertilidad';                 /* the one tinted in both halves */

  let b = arrow('ar-s5-turn', C.ask);
  const cw = 62, rh = 26;

  /* left: countries down, indicators across */
  const lx = 70, ly = 116;
  b += txt(lx, ly - 44, 'LA TABLA', { fs: 11.5, fill: C.ink3, ls: 1.6 });
  b += txt(lx, ly - 24, `${PAISES.length} países × ${KEYS.length} indicadores`,
           { fs: 12, fill: C.ink2 });
  KEYS.forEach((k, j) => {
    b += txt(lx + 96 + j * cw + cw / 2, ly, SHORT[k],
             { fs: 11, fill: k === HL ? C.ask : C.ink3, ta: 'middle' });
  });
  rows.forEach((p, i) => {
    const y = ly + 22 + i * rh;
    b += txt(lx, y, p[col('nombre')].slice(0, 12), { fs: 11.5, ff: MONO, fill: C.ink3 });
    KEYS.forEach((k, j) => {
      const x = lx + 96 + j * cw;
      if (k === HL) b += `<rect x="${x}" y="${y - 15}" width="${cw}" height="${rh - 4}"
        fill="${C.ask}" opacity=".12"/>`;
      b += txt(x + cw / 2, y, String(p[col(k)]), { fs: 11, ff: MONO, fill: C.ink, ta: 'middle' });
    });
  });
  b += txt(lx, ly + 22 + 6 * rh, '⋮', { fs: 14, fill: C.ink3 });
  b += txt(lx + 96, ly + 22 + 6 * rh + 4, `y ${PAISES.length - 6} países más`,
           { fs: 11, fill: C.ink3 });

  /* right: indicators down, countries across — the same numbers, turned */
  const rx = 540, ry = 116;
  b += txt(rx, ry - 44, 'LA TABLA GIRADA', { fs: 11.5, fill: C.ask, ls: 1.6 });
  b += txt(rx, ry - 24, `${KEYS.length} indicadores × ${PAISES.length} países`,
           { fs: 12, fill: C.ink2 });
  rows.forEach((p, j) => {
    b += txt(rx + 92 + j * 52 + 26, ry, p[col('codigo')].toUpperCase(),
             { fs: 10.5, ff: MONO, fill: C.ink3, ta: 'middle' });
  });
  b += txt(rx + 92 + 6 * 52 + 10, ry, '⋯', { fs: 14, fill: C.ink3 });
  KEYS.forEach((k, i) => {
    const y = ry + 22 + i * rh;
    if (k === HL) b += `<rect x="${rx}" y="${y - 15}" width="${92 + 6 * 52}" height="${rh - 4}"
      fill="${C.ask}" opacity=".12"/>`;
    b += txt(rx, y, SHORT[k], { fs: 11.5, ff: MONO, fill: k === HL ? C.ask : C.ink3 });
    rows.forEach((p, j) => {
      b += txt(rx + 92 + j * 52 + 26, y, String(p[col(k)]),
               { fs: 10.5, ff: MONO, fill: C.ink, ta: 'middle' });
    });
  });

  /* the turn itself */
  b += `<path d="M420,250 C468,250 470,206 512,206" fill="none" stroke="${C.ask}"
    stroke-width="1.4" marker-end="url(#ar-s5-turn)"/>`;
  b += txt(466, 286, 'transponer', { fs: 12, fill: C.ask, ta: 'middle' });

  b += box(70, 392, 840, 52, C.ask, { fill: C.ground2, sw: 1.2, stroke: C.ask });
  b += txt(92, 424, `Los mismos números. Lo que era una columna —${LABEL[HL].toLowerCase()}— `
    + 'es ahora una fila: la variable pasó a ser un registro.',
    { fs: 13.5, ff: SERIF, fill: C.ink });

  return svg(W, H, 'La tabla de países e indicadores junto a su transpuesta: los mismos '
    + 'números girados, de modo que cada variable, que era una columna, pasa a ser una '
    + `fila. Se muestran 6 de los ${PAISES.length} países`, b);
}

/* ── The correlation circle ────────────────────────────────
   Each variable as an arrow in the plane of the first two components. Starting from the
   correlation matrix, a loading *is* the correlation between that variable and that
   component, so every arrow fits inside a circle of radius one — and how close it gets
   to the edge is how well the plane represents it (RF-46). */
export function circuloCorrelaciones() {
  const W = 980, H = 520, CXP = 400, CY = 262, R = 190;
  const L = PCA4.cargas;

  let b = arrow('ar-s5-load', C.ask);
  b += `<circle cx="${CXP}" cy="${CY}" r="${R}" fill="none" stroke="${C.line}"
    stroke-width="1.2"/>`;
  b += `<circle cx="${CXP}" cy="${CY}" r="${R / 2}" fill="none" stroke="${C.lineSoft}"
    stroke-width="1" stroke-dasharray="3 4"/>`;
  b += pline([[CXP - R - 18, CY], [CXP + R + 18, CY]], C.lineSoft, { sw: 1 });
  b += pline([[CXP, CY - R - 18], [CXP, CY + R + 18]], C.lineSoft, { sw: 1 });
  b += txt(CXP + R + 24, CY + 66, 'CP 1', { fs: 11, fill: C.ink3 });
  b += txt(CXP + 10, CY - R - 26, 'CP 2', { fs: 11, fill: C.ink3 });

  KEYS.forEach((k, i) => {
    const x = CXP + L[i][0] * R, y = CY - L[i][1] * R;
    b += `<path d="M${CXP},${CY} L${x.toFixed(1)},${y.toFixed(1)}" stroke="${C.ask}"
      stroke-width="2" fill="none" marker-end="url(#ar-s5-load)"/>`;
  });

  /* Labels are placed after every arrow is drawn, and pushed apart when they collide.

     Two of these variables sit three degrees from each other, so their labels landed on
     top of one another: two names and two numbers in the same twelve pixels. Nudging
     them apart in y keeps each one beside its own arrow and readable, which a plane
     whose whole subject is the angle between arrows rather needs. */
  const placed = [];
  KEYS.map((k, i) => {
    const largo = Math.hypot(L[i][0], L[i][1]);
    const away = 1 + 26 / (largo * R);
    return { k, largo, x: CXP + L[i][0] * R * away, y: CY - L[i][1] * R * away };
  }).sort((a, b2) => a.y - b2.y).forEach(lab => {
    const side = lab.x < CXP;
    let y = lab.y;
    placed.filter(o => (o.x < CXP) === side).forEach(o => {
      if (Math.abs(y - o.y) < 40) y = o.y + 40;
    });
    placed.push({ ...lab, y });
    if (Math.abs(y - lab.y) > 2) {
      b += pline([[lab.x, lab.y], [lab.x, y - 4]], C.lineSoft, { sw: 1, dash: '2 3' });
    }
    b += txt(lab.x, y + 4, LABEL[lab.k], { fs: 12.5, ff: SERIF, fill: C.ink,
             ta: side ? 'end' : 'start' });
    b += txt(lab.x, y + 20, `${lab.largo.toFixed(2)}`, { fs: 10.5, ff: MONO, fill: C.ink3,
             ta: side ? 'end' : 'start' });
  });

  /* The reading rules, on the right, where they do not fight the drawing. */
  const rx = 742;
  b += txt(rx, 96, 'CÓMO SE LEE', { fs: 11.5, fill: C.ask, ls: 1.6 });
  [['Ángulo pequeño', 'las dos variables suben juntas'],
   ['Ángulo recto', 'no se dicen nada'],
   ['Ángulo llano', 'una sube cuando la otra baja'],
   ['Flecha larga', 'el plano la representa bien'],
   ['Flecha corta', 'esa variable vive fuera del plano']].forEach(([t, d], i) => {
    const y = 138 + i * 58;
    b += txt(rx, y, t, { fs: 13, ff: SERIF, fill: C.ink });
    b += txt(rx, y + 18, d, { fs: 11, fill: C.ink3 });
  });

  b += txt(CXP, CY + R + 60, `El radio es 1. Las cuatro flechas miden entre `
    + `${Math.min(...L.map(l => Math.hypot(l[0], l[1]))).toFixed(2)} y `
    + `${Math.max(...L.map(l => Math.hypot(l[0], l[1]))).toFixed(2)}: el plano las `
    + 'representa bien a las cuatro.', { fs: 12, fill: C.ink3, ta: 'middle' });

  return svg(W, H, 'Círculo de correlaciones: las cuatro variables como flechas en el plano '
    + 'de las dos primeras componentes. ' + KEYS.map((k, i) =>
      `${LABEL[k]} con longitud ${Math.hypot(L[i][0], L[i][1]).toFixed(2)}`).join(', '), b);
}

/* ── The three angles ──────────────────────────────────────
   Two of them come out of the data. The third does not, and says so.

   Measuring the real circle turned up something the session has to be honest about:
   these four indicators all measure development, so no pair of them is anywhere near
   independent — the closest to a right angle is GDP against life expectancy at 44°.
   The right angle is therefore drawn as a worked illustration, marked as such, instead
   of being faked out of a pair that does not have it. */
function miniCircle(cx, cy, r, arrows, tag, caption, ilustrativo) {
  let b = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none"
    stroke="${ilustrativo ? C.lineSoft : C.line}" stroke-width="1.1"/>`;
  b += pline([[cx - r - 10, cy], [cx + r + 10, cy]], C.lineSoft, { sw: 1 });
  b += pline([[cx, cy - r - 10], [cx, cy + r + 10]], C.lineSoft, { sw: 1 });
  arrows.forEach(([ang, name]) => {
    const x = cx + Math.cos(ang) * r, y = cy - Math.sin(ang) * r;
    b += `<path d="M${cx},${cy} L${x.toFixed(1)},${y.toFixed(1)}"
      stroke="${ilustrativo ? C.ink3 : C.ask}" stroke-width="2" fill="none"
      marker-end="url(#ar-s5-ang)"/>`;
  });
  /* Same pushing apart as the plane needs, and for the same reason: the pair this
     figure exists to show sits three degrees apart, so their names land on each other. */
  const placed = [];
  arrows.map(([ang, name]) => ({
    name, x: cx + Math.cos(ang) * (r + 13), y: cy - Math.sin(ang) * (r + 13),
  })).sort((a, b2) => a.y - b2.y).forEach(lab => {
    let y = lab.y;
    placed.forEach(o => { if (Math.abs(y - o.y) < 18) y = o.y + 18; });
    placed.push({ ...lab, y });
    b += txt(lab.x, y + 4, lab.name, { fs: 10.5, ff: MONO, fill: C.ink2,
             ta: lab.x < cx - 4 ? 'end' : lab.x > cx + 4 ? 'start' : 'middle' });
  });
  b += txt(cx, cy - r - 42, tag, { fs: 11.5, fill: ilustrativo ? C.ink3 : C.ask, ls: 1.6, ta: 'middle' });
  b += txt(cx, cy + r + 52, caption, { fs: 13, ff: SERIF, fill: C.ink, ta: 'middle' });
  return b;
}

export function tresAngulos() {
  const W = 980, H = 470, R = 84, CY = 214;
  const idx = k => KEYS.indexOf(k);
  const ang = k => Math.atan2(PCA4.cargas[idx(k)][1], PCA4.cargas[idx(k)][0]);
  const between = (a, b) => {
    const [va, vb] = [PCA4.cargas[idx(a)], PCA4.cargas[idx(b)]];
    const cos = (va[0] * vb[0] + va[1] * vb[1])
      / (Math.hypot(va[0], va[1]) * Math.hypot(vb[0], vb[1]));
    return { grados: Math.acos(Math.max(-1, Math.min(1, cos))) * 180 / Math.PI, cos };
  };

  const juntas = between('fertilidad', 'mortalidad');
  const opuestas = between('vida', 'mortalidad');
  const rReal = (a, b) => CORR[VARS.findIndex(v => v[0] === a)][VARS.findIndex(v => v[0] === b)];

  let b = arrow('ar-s5-ang', C.ask);

  b += miniCircle(180, CY, R,
    [[ang('fertilidad'), 'hijos'], [ang('mortalidad'), 'mortal.']],
    `${juntas.grados.toFixed(0)}° · CASI JUNTAS`,
    `r = ${rReal('fertilidad', 'mortalidad').toFixed(2)}`, false);

  b += miniCircle(490, CY, R,
    [[0.32, 'variable A'], [0.32 + Math.PI / 2, 'variable B']],
    '90° · PERPENDICULARES', 'r ≈ 0', true);

  b += miniCircle(800, CY, R,
    [[ang('vida'), 'vida'], [ang('mortalidad'), 'mortal.']],
    `${opuestas.grados.toFixed(0)}° · CASI OPUESTAS`,
    `r = ${rReal('vida', 'mortalidad').toFixed(2)}`, false);

  /* The one that is not from the data says so, in its own words. */
  b += box(330, 366, 320, 62, C.ink3, { fill: C.ground2, sw: 1, stroke: C.lineSoft });
  b += txt(490, 390, 'Caso ilustrativo, no de estos países:', { fs: 11.5, fill: C.ink3, ta: 'middle' });
  b += txt(490, 410, 'los cuatro indicadores miden desarrollo', { fs: 11.5, fill: C.ink3, ta: 'middle' });
  b += txt(490, 428, 'y ninguno es independiente de otro.', { fs: 11.5, fill: C.ink3, ta: 'middle' });

  b += txt(490, 60, 'El coseno del ángulo entre dos flechas aproxima su correlación',
           { fs: 14, ff: SERIF, fill: C.ink, ta: 'middle' });

  return svg(W, H, 'Tres casos del ángulo entre dos flechas del círculo de correlaciones: hijos por mujer y '
    + `mortalidad infantil a ${juntas.grados.toFixed(0)} grados con correlación `
    + `${rReal('fertilidad', 'mortalidad').toFixed(2)}; un caso ilustrativo de dos variables `
    + 'perpendiculares con correlación cero; y esperanza de vida contra mortalidad infantil '
    + `a ${opuestas.grados.toFixed(0)} grados con correlación `
    + `${rReal('vida', 'mortalidad').toFixed(2)}`, b);
}

/* ── How the correlation circle is built, in five drawings ──
   The second panel is the reason this figure exists. The turned table shows real values
   — Qatar at 132900 — and the text used to go straight from "a variable is a record" to
   "a record is a vector", which leaves a class thinking the arrows are drawn from those
   numbers. They are not: without centring and dividing by the standard deviation, Qatar's
   vector is decided by its GDP alone and the angle means nothing. */
export function pasosCirculo() {
  const W = 980, H = 430, PY = 116, PW = 168, GAP = 18;
  const rows = sample().slice(0, 4);
  const L = PCA4.cargas;

  const panel = (i, titulo) => {
    const x0 = 34 + i * (PW + GAP);
    let b = txt(x0, PY - 46, String(i + 1).padStart(2, '0'), { fs: 22, ff: SERIF, fill: C.ask });
    wrap(titulo, 24).forEach((l, k) => {
      b += txt(x0, PY - 22 + k * 15, l, { fs: 11, fill: C.ink2 });
    });
    return { b, x0, cx: x0 + PW / 2 };
  };

  let b = '';

  /* 1. the turned table, real values */
  const p1 = panel(0, 'La tabla girada: cada variable, una fila de valores reales');
  b += p1.b;
  KEYS.forEach((k, i) => {
    const y = PY + 26 + i * 22;
    b += txt(p1.x0, y, SHORT[k], { fs: 9.5, ff: MONO, fill: i === 0 ? C.ask : C.ink3 });
    rows.forEach((p, j) => {
      b += txt(p1.x0 + 62 + j * 28, y, String(p[col(k)]).slice(0, 6),
               { fs: 8.5, ff: MONO, fill: C.ink, ta: 'middle' });
    });
  });

  /* 2. the step that was missing */
  const p2 = panel(1, 'Centrar y dividir por la desviación: ahora todas comparables');
  b += p2.b;
  const zc = PY + 26 + 44;
  b += pline([[p2.x0, zc], [p2.x0 + PW - 20, zc]], C.lineSoft, { sw: 1 });
  b += txt(p2.x0 + PW - 16, zc + 4, '0', { fs: 9, fill: C.ink3 });
  KEYS.forEach((k, i) => {
    rows.forEach((p, j) => {
      const zv = z(p[col(k)], ESTAD[k]);
      const x = p2.x0 + 26 + i * 34 + j * 6;
      b += dot(x, zc - zv * 16, 2.6, i === 0 ? C.ask : C.ink3, { op: 0.85 });
    });
    b += txt(p2.x0 + 26 + i * 34, PY + 132, SHORT[k].slice(0, 5),
             { fs: 8.5, ff: MONO, fill: C.ink3, ta: 'middle' });
  });
  b += txt(p2.x0, PY + 156, 'entre −3 y +6, no entre', { fs: 9, fill: C.reveal });
  b += txt(p2.x0, PY + 168, '1,3 y 132 900', { fs: 9, fill: C.reveal });

  /* 3. the correlation of each variable with each component */
  const p3 = panel(2, 'Correlacionar variable y componente: eso es la carga');
  b += p3.b;
  b += box(p3.x0, PY + 20, 62, 26, C.ask);
  b += txt(p3.x0 + 31, PY + 37, SHORT[KEYS[0]], { fs: 9.5, ff: MONO, fill: C.ask, ta: 'middle' });
  [['CP 1', L[0][0]], ['CP 2', L[0][1]]].forEach(([n, v], i) => {
    const y = PY + 76 + i * 40;
    b += box(p3.x0 + 78, y, 62, 26, C.ink3);
    b += txt(p3.x0 + 109, y + 17, n, { fs: 9.5, ff: MONO, fill: C.ink2, ta: 'middle' });
    b += `<path d="M${p3.x0 + 40},${PY + 48} L${p3.x0 + 88},${y - 2}" stroke="${C.ask}"
      stroke-width="1" fill="none" opacity=".8" marker-end="url(#ar-s5-load)"/>`;
    b += txt(p3.x0 + 146, y + 17, v.toFixed(2).replace('-', '−'),
             { fs: 11, ff: MONO, fill: C.ink });
  });

  /* 4. those two numbers are the coordinates of the arrow */
  const p4 = panel(3, 'Esas dos cargas son las coordenadas de su flecha');
  const R4 = 52, cy4 = PY + 84;
  b += p4.b;
  b += pline([[p4.cx - R4 - 8, cy4], [p4.cx + R4 + 8, cy4]], C.lineSoft, { sw: 1 });
  b += pline([[p4.cx, cy4 - R4 - 8], [p4.cx, cy4 + R4 + 8]], C.lineSoft, { sw: 1 });
  const tipx = p4.cx + L[0][0] * R4, tipy = cy4 - L[0][1] * R4;
  b += pline([[tipx, cy4], [tipx, tipy]], C.ink3, { sw: 0.8, dash: '2 2' });
  b += pline([[p4.cx, tipy], [tipx, tipy]], C.ink3, { sw: 0.8, dash: '2 2' });
  b += `<path d="M${p4.cx},${cy4} L${tipx.toFixed(1)},${tipy.toFixed(1)}" stroke="${C.ask}"
    stroke-width="1.8" fill="none" marker-end="url(#ar-s5-load)"/>`;
  b += txt(p4.cx, PY + 168, `(${L[0][0].toFixed(2)}, ${L[0][1].toFixed(2)})`,
           { fs: 10, ff: MONO, fill: C.ink, ta: 'middle' });

  /* 5. all four, inside a circle of radius one */
  const p5 = panel(4, 'Las cuatro, dentro del círculo de radio 1');
  const R5 = 56, cy5 = PY + 84;
  b += p5.b;
  b += `<circle cx="${p5.cx}" cy="${cy5}" r="${R5}" fill="none" stroke="${C.line}" stroke-width="1"/>`;
  b += pline([[p5.cx - R5 - 6, cy5], [p5.cx + R5 + 6, cy5]], C.lineSoft, { sw: 1 });
  b += pline([[p5.cx, cy5 - R5 - 6], [p5.cx, cy5 + R5 + 6]], C.lineSoft, { sw: 1 });
  KEYS.forEach((k, i) => {
    b += `<path d="M${p5.cx},${cy5} L${(p5.cx + L[i][0] * R5).toFixed(1)},${(cy5 - L[i][1] * R5).toFixed(1)}"
      stroke="${C.ask}" stroke-width="1.6" fill="none" marker-end="url(#ar-s5-load)"/>`;
  });
  b += txt(p5.cx, PY + 168, 'la longitud dice cuánto', { fs: 9, fill: C.ink3, ta: 'middle' });
  b += txt(p5.cx, PY + 180, 'cabe en el plano', { fs: 9, fill: C.ink3, ta: 'middle' });

  b += arrow('ar-s5-load', C.ask);
  b += txt(34, 46, 'CÓMO SE CONSTRUYE EL CÍRCULO DE CORRELACIONES',
           { fs: 11.5, fill: C.ask, ls: 1.6 });

  return svg(W, H, 'La construcción del círculo de correlaciones en cinco pasos: la tabla '
    + 'girada con sus valores reales; centrar y dividir cada fila por su desviación típica '
    + 'para que sean comparables; correlacionar cada variable con cada componente, que es '
    + 'la carga; usar esas dos cargas como coordenadas de la flecha; y dibujar las cuatro '
    + 'dentro del círculo de radio uno', b);
}
