import { C, svg, txt, arrow, wrap } from '../../../svg/kit.js';
import { FAMD } from '../data/ejemplo.js';
import { dot, pline, num, plano, cuadrado, row, frac, measure, label, apilar, CATEGORICO, scale }
  from './shared.js';

/* Block 3 of session 7 · the FAMD on the same eight people. Every id carries the
   ar-s7-b3- prefix. Every number comes out of src/sessions/s07/data/ejemplo.js: the formulas quote the
   example, the three plots take their coordinates from it, and nothing is typed. */

const W = 980;
const FS = 20;
const n3 = v => num(v).replace('-', '−');
/* A trailing space: the piece after «=» gets its own breath without a gap of its own. */
const eq = { t: '= ', gap: 12, fill: C.ink2 };
const X = 400;
const idx = (x, y, t) => txt(x, y, t, { fs: 11, ff: 'serif', fill: C.ink3 });

/* The two kinds of variable get a fixed mark AND a fixed hue: a circle for a quantity,
   a square for a name — the spec asks that the type be readable without the colour. */
const COL_NUM = C.ask;
const colorCat = variable => CATEGORICO[FAMD.categoricas.findIndex(c => c.variable === variable)];
const rotuloNum = clave => FAMD.numericas.find(v => v.clave === clave).rotulo;

function linea(x, y, antes, top, bottom, despues) {
  let s = row(x, y, antes, FS);
  let cur = x + measure(antes, FS) + 10;
  if (top) {
    const w = Math.max(measure(top, FS), measure(bottom, FS)) + 26;
    s += frac(cur + w / 2, y - 7, top, bottom, FS);
    cur += w + 10;
  }
  if (despues) s += row(cur, y, despues, FS);
  return s;
}

/* Same section layout as block2.js: tag and gloss on the left, formula on the right,
   the example line under both at full width. Returns [markup, next y]. */
function seccion(y0, tag, nota, dibuja, ejemplo) {
  const glosa = wrap(nota, 34);
  let s = label(y0, tag, nota) + dibuja(y0 + 28);
  const yEj = y0 + 30 + Math.max(glosa.length * 16 + 10, 44);
  const lineas = wrap(ejemplo, 118);
  lineas.forEach((l, i) => s += txt(56, yEj + i * 16, l, { fs: 12, fill: C.ask }));
  return [s, yEj + lineas.length * 16 + 26];
}

/* ═══════════ 1 · the two re-scalings and the total inertia ═══════════ */
export function fReescalado() {
  const numCols = FAMD.columnas.filter(c => c.tipo === 'num');
  const catCols = FAMD.columnas.filter(c => c.tipo === 'cat');
  let s = '', y = 40, parte;

  [parte, y] = seccion(y, 'UNA NUMÉRICA', 'estandarizada como en el PCA: cada una aporta inercia 1',
    yb => linea(X, yb, [{ t: 'x' }, { t: '↦', gap: 10, fill: C.ink2 }],
      [{ t: 'x − ' }, { t: 'x', bar: true }], [{ t: 's', sub: 'x' }], null),
    `en el ejemplo: ${numCols.map(c => `${rotuloNum(c.variable)} con varianza ${num(c.varianza)}`).join(' y ')} después de estandarizar, con la desviación de la población (dividiendo por n)`);
  s += parte;

  [parte, y] = seccion(y, 'UNA INDICADORA',
    'la ponderación chi-cuadrado del MCA disfrazada de estandarización: varianza 1 − p_j, y cada variable aporta J_q − 1',
    yb => linea(X, yb, [{ t: 'z', sub: 'j' }, { t: '↦', gap: 10, fill: C.ink2 }],
      [{ t: 'z', sub: 'j' }], [{ t: '√p', sub: 'j' }],
      [{ t: '−', gap: 2 }, { t: '√p', gap: 8, sub: 'j' }, { t: 'con', gap: 30, fill: C.ink2, fs: 15 },
       { t: 'p', gap: 10, sub: 'j' }, eq, { t: 'n', sub: 'j' }, { t: '/ n', gap: 4 }]),
    `en el ejemplo: las ${catCols.length} indicadoras tienen p_j = ${num(0.5)} y varianza 1 − p_j = ${num(catCols[0].varianza)} cada una; Bebida aporta ${catCols.length / 2 - 1} y Horario ${catCols.length / 2 - 1}`);
  s += parte;

  [parte, y] = seccion(y, 'INERCIA TOTAL', 'después viene un PCA ordinario de la matriz X con los dos bloques',
    yb => row(X, yb, [{ t: 'I', fs: 24 }, eq, { t: 'p', gap: 4, sub: 'num' }, { t: '+', gap: 12 },
      { t: 'Σ', gap: 12, fs: 26, fill: C.ink2 }, { t: '(J', gap: 6, sub: 'q' }, { t: '− 1)', gap: 4 }], FS)
      + idx(X + measure([{ t: 'I', fs: 24 }, eq, { t: 'p', gap: 4, sub: 'num' }, { t: '+', gap: 12 }], FS) + 16, yb + 20, 'q'),
    `en el ejemplo: ${FAMD.numericas.length} + (2 − 1) + (2 − 1) = ${num(FAMD.inerciaTotal)}, y los ${FAMD.ejes} valores propios suman exactamente ${num(FAMD.inerciaTotal)}`);
  s += parte;

  return svg(W, y,
    'Tres fórmulas: una numérica se estandariza restando su media y dividiendo por su '
    + 'desviación; una indicadora se divide por la raíz de su proporción y se centra '
    + 'restando esa raíz; y la inercia total es el número de numéricas más la suma sobre '
    + 'las categóricas de su número de categorías menos uno', s);
}

/* ═══════════ 2 · the balance property ═══════════ */
export function fEquilibrio() {
  const k = 0;
  const r2 = FAMD.numericas.map(v => FAMD.r2[v.clave][k]);
  const eta2 = FAMD.categoricas.map(v => FAMD.eta2[v.variable][k]);
  let s = '', y = 40, parte;

  [parte, y] = seccion(y, 'LO QUE MAXIMIZA EL PRIMER EJE',
    'ambos indicadores viven en [0, 1]: una variable de cualquier tipo aporta como máximo 1 por eje',
    yb => row(X, yb, [{ t: 'Σ', fs: 26, fill: C.ink2 }, { t: 'r', gap: 8, sup: '2' }, { t: '(F', gap: 2, sub: '1' },
      { t: ', x)' }, { t: '+', gap: 14 }, { t: 'Σ', gap: 14, fs: 26, fill: C.ink2 }, { t: 'η', gap: 8, sup: '2' },
      { t: '(F', gap: 2, sub: '1' }, { t: ', q)' }], FS)
      + idx(X - 4, yb + 20, 'numéricas') + idx(X + 178, yb + 20, 'categóricas'),
    `en el ejemplo, eje 1: ${r2.map(num).join(' + ')} + ${eta2.map(num).join(' + ')} = ${num(FAMD.autovalores[k])} = λ₁. Y en cada eje, Σr² + Ση² = λ_k.`);
  s += parte;

  [parte, y] = seccion(y, 'LOS DOS CASOS LÍMITE', 'el FAMD contiene a los dos métodos anteriores',
    yb => row(X, yb, [{ t: 'todo numérico', fill: C.ink2, fs: 15 }, { t: '→', gap: 10, fill: C.ink2 },
      { t: 'PCA', gap: 10 }, { t: 'todo categórico', gap: 40, fill: C.ink2, fs: 15 }, { t: '→', gap: 10, fill: C.ink2 },
      { t: 'MCA', gap: 10 }, { t: '(salvo una constante)', gap: 10, fill: C.ink2, fs: 15 }], FS),
    'la estandarización de las numéricas es la del PCA de la sesión 5; la de las indicadoras es la métrica chi-cuadrado del bloque 1. Mezclarlas columna a columna es todo el método.');
  s += parte;

  return svg(W, y,
    'La propiedad de equilibrio: el primer eje maximiza la suma sobre las numéricas del '
    + 'r cuadrado con el eje más la suma sobre las categóricas del eta cuadrado con el '
    + 'eje, y en cada eje esa suma es el valor propio. Si todo es numérico el método es '
    + 'el PCA; si todo es categórico, el MCA salvo una constante', s);
}

/* ═══════════ 3 · r², Pearson squared ═══════════ */
export function fR2() {
  const p = FAMD.pearson;
  let s = '', y = 40, parte;

  [parte, y] = seccion(y, 'LAS PUNTUACIONES SON UNA VARIABLE MÁS',
    'y su varianza es el valor propio: λ ES la varianza de las puntuaciones del eje',
    yb => row(X, yb, [{ t: 'var(F', sub: 'k' }, { t: ')' }, eq, { t: 'λ', gap: 2, sub: 'k' }], FS),
    `en el ejemplo, F₁ = (${FAMD.puntuaciones.map(f => n3(Math.round(f[0] * 100) / 100)).join(', ')}) y su varianza es ${num(FAMD.varianzaPuntuaciones[0])} = λ₁`);
  s += parte;

  [parte, y] = seccion(y, 'r²: PEARSON AL CUADRADO', 'la correlación de la sesión 5 entre el eje y la variable, elevada al cuadrado',
    yb => linea(X, yb, [{ t: 'r' }, eq], [{ t: 'cov(F', sub: '1' }, { t: ', x)' }],
      [{ t: 's', sub: 'F₁' }, { t: '·', gap: 10 }, { t: 's', gap: 10, sub: 'x' }],
      [{ t: 'y', gap: 30, fill: C.ink2, fs: 15 }, { t: 'r', gap: 10, sup: '2' }, { t: '∈ [0, 1]', gap: 10 }]),
    `en el ejemplo, ${rotuloNum(p.variable)} en el eje ${p.eje}: cov = ${n3(p.cov)}; s_F = √${num(FAMD.autovalores[0])} = ${num(p.sF)}; s_x = √${num(p.varTazas)} = ${num(p.sTazas)}; r = ${n3(p.cov)}/(${num(p.sF)} · ${num(p.sTazas)}) = ${n3(p.r)}, y r² = ${num(p.r2)}: sabiendo dónde está alguien en el eje se predice el ${Math.round(p.r2 * 100)} % de la variación en tazas.`);
  s += parte;

  return svg(W, y,
    'Dos fórmulas: la varianza de las puntuaciones de un eje es su valor propio; y r es '
    + 'la covarianza entre el eje y la variable dividida por el producto de sus dos '
    + 'desviaciones, cuyo cuadrado está entre cero y uno. Calculada paso a paso para '
    + 'tazas al día en el eje 1', s);
}

/* ═══════════ 4 · η², the ANOVA decomposition ═══════════ */
export function fEta2() {
  const a = FAMD.anova;
  let s = '', y = 40, parte;

  [parte, y] = seccion(y, 'LA SUMA DE CUADRADOS SE PARTE EN DOS',
    'la dispersión de todos es la separación entre las medias de los grupos más la dispersión dentro de cada grupo',
    yb => row(X, yb, [{ t: 'SC', sub: 'total' }, eq, { t: 'SC', gap: 6, sub: 'entre' }, { t: '+', gap: 14 },
      { t: 'SC', gap: 14, sub: 'dentro' }], FS),
    `en el ejemplo, ${a.variable} en el eje ${a.eje}: ${num(a.scTotal)} = ${num(a.scEntre)} + ${num(a.scDentro)}. Los términos cruzados se cancelan: es un teorema, no una aproximación.`);
  s += parte;

  [parte, y] = seccion(y, 'η²: LA PARTE QUE EXPLICA EL GRUPO',
    'η² = 1: grupos que son dos puntos sin mezcla · η² = 0: saber el grupo no sirve de nada',
    yb => linea(X, yb, [{ t: 'η', sup: '2' }, eq], [{ t: 'SC', sub: 'entre' }], [{ t: 'SC', sub: 'total' }],
      [{ t: '=', gap: 30, fill: C.ink2 }, { t: 'Σ', gap: 12, fs: 26, fill: C.ink2 }, { t: 'p', gap: 8, sub: 'j' },
       { t: 'g', gap: 4, bar: true, sub: 'j', sup: '2' }, { t: '/ λ', gap: 8 }])
      + idx(X + measure([{ t: 'η', sup: '2' }, eq], FS) + 10 + 96 + 10 + 60, yb + 20, 'j'),
    `en el ejemplo: ${num(a.scEntre)}/${num(a.scTotal)} = ${num(a.eta2)}. Y por los baricentros, Σ p_j·ḡ_j²/λ₁ = ${num(a.porBaricentros)}: el η² del FAMD, la contribución del MCA y la relación baricéntrica son la misma cantidad vista desde tres ángulos.`);
  s += parte;

  return svg(W, y,
    'Dos fórmulas: la suma de cuadrados total de las puntuaciones se descompone en la '
    + 'de entre grupos más la de dentro de los grupos; y eta cuadrado es la de entre '
    + 'grupos sobre la total, que también sale sumando la proporción de cada categoría '
    + 'por su baricentro al cuadrado, dividido por el valor propio', s);
}

/* ═══════════ 5 · the map of individuals with the barycentres ═══════════ */
export function mapaIndividuos() {
  const L = 440, xa = 300, ya = 56, H = ya + L + 70;
  const pts = FAMD.puntuaciones;
  const lim = Math.ceil(Math.max(...pts.flatMap(p => p.slice(0, 2).map(Math.abs))) * 10) / 10 + 0.3;
  const { sx, sy, b: ejes } = plano(xa, ya, L, [lim, lim], FAMD.porcentajes);
  let b = ejes;

  /* labels to the right of their mark, stacked where they would collide */
  const rotulos = [];
  pts.forEach((p, i) => {
    b += dot(sx(p[0]), sy(p[1]), 5, C.ink3, { op: 0.85 });
    rotulos.push({ x: sx(p[0]) + 8, y: sy(p[1]) + 4, t: String(i + 1), fs: 11, fill: C.ink3, ancho: 60 });
  });
  FAMD.categoricas.forEach(v => {
    Object.entries(FAMD.baricentros[v.variable]).forEach(([nivel, g]) => {
      const x = sx(g.coord[0]), y = sy(g.coord[1]);
      b += cuadrado(x, y, 13, colorCat(v.variable), { op: 0.95 });
      rotulos.push({ x: x + 11, y: y + 4, t: nivel, fs: 12, fill: C.ink, ancho: 70 });
    });
  });
  apilar(rotulos, 13).forEach(r => b += txt(r.x, r.y, r.t, { fs: r.fs, fill: r.fill }));

  b += txt(30, 28, `LAS ${FAMD.n} PERSONAS Y LOS BARICENTROS`, { fs: 11, fill: C.ask, ls: 1.8 });
  let ly = 60;
  FAMD.categoricas.forEach((v, i) => {
    b += cuadrado(36, ly - 4, 11, CATEGORICO[i]);
    b += txt(50, ly, `${v.variable}: ${v.niveles.join(' · ')}`, { fs: 11, fill: C.ink2 });
    ly += 18;
  });
  b += dot(36, ly - 4, 5, C.ink3, { op: 0.85 });
  b += txt(50, ly, 'una persona, con su número', { fs: 11, fill: C.ink2 });
  ly += 26;
  wrap(`Las numéricas —${FAMD.numericas.map(v => v.rotulo).join(' y ')}— no aparecen como puntos, pero ordenaron a la gente a lo largo del eje 1.`, 30)
    .forEach((l, i) => b += txt(30, ly + i * 15, l, { fs: 11, fill: C.ink3 }));

  const pie = wrap(`Cada categoría está en el baricentro de su gente, sin dilatar. El eje 1 retiene ${num(FAMD.porcentajes[0])} % de ${num(FAMD.inerciaTotal)} unidades de inercia.`, 88)
    .map((l, i) => txt(xa, ya + L + 46 + i * 17, l, { fs: 12, fill: C.ink2 })).join('');
  return svg(W, H,
    `El plano de los dos primeros ejes del análisis factorial de datos mixtos del ejemplo: `
    + `${FAMD.n} personas numeradas y los baricentros de las ${Object.values(FAMD.baricentros).flatMap(Object.keys).length} `
    + `categorías como cuadrados. El eje 1 retiene ${num(FAMD.porcentajes[0])} por ciento y el `
    + `eje 2, ${num(FAMD.porcentajes[1])}`, b + pie);
}

/* ═══════════ 6 · the correlation circle ═══════════ */
export function circulo() {
  const H = 470;
  /* Centred to the right of the reading notes: at 490 the left-hand arrow's label ran
     into the notes' column. */
  const cx = 560, cy = 225, R = 170;
  let b = arrow('ar-s7-b3-ci', COL_NUM);
  b += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${C.lineSoft}" stroke-width="1"/>`;
  b += pline([[cx - R - 20, cy], [cx + R + 20, cy]], C.lineSoft, { sw: 1 });
  b += pline([[cx, cy - R - 20], [cx, cy + R + 20]], C.lineSoft, { sw: 1 });
  b += txt(30, 28, 'EL CÍRCULO DE CORRELACIONES · LAS NUMÉRICAS', { fs: 11, fill: C.ask, ls: 1.8 });

  FAMD.numericas.forEach(v => {
    const [r1, r2] = FAMD.correlaciones[v.clave];
    const x = cx + r1 * R, y = cy - r2 * R;
    b += `<path d="M${cx},${cy} L${x.toFixed(1)},${y.toFixed(1)}" fill="none" stroke="${COL_NUM}"
      stroke-width="2" marker-end="url(#ar-s7-b3-ci)"/>`;
    const ta = r1 < 0 ? 'end' : 'start';
    const dx = r1 < 0 ? -12 : 12;
    b += txt(x + dx, y + 4, v.rotulo, { fs: 12.5, fill: C.ink, ta });
    b += txt(x + dx, y + 20, `(${n3(r1)}, ${n3(r2)})`, { fs: 11, fill: C.ink3, ta });
  });
  /* the same two axes as the map, labelled outside the circle as plano() does: at the
     end of the axis the label landed on the arrowhead pointing that way */
  b += txt(cx + R + 20, cy + R + 22, `Eje 1 · ${num(FAMD.porcentajes[0])} %`, { fs: 11, fill: C.ink3, ta: 'end' });
  b += txt(cx - R - 20, cy + R + 22, `Eje 2 · ${num(FAMD.porcentajes[1])} % (vertical)`, { fs: 11, fill: C.ink3 });
  b += txt(cx + R + 4, cy - 6, '1', { fs: 10, fill: C.ink3 });
  b += txt(cx - R - 14, cy - 6, '−1', { fs: 10, fill: C.ink3 });

  let ly = 70;
  b += txt(30, ly, 'CÓMO SE LEE', { fs: 10.5, fill: C.ask, ls: 1.6 });
  [['longitud', 'calidad de representación: su cuadrado es el cos² en el plano'],
   ['ángulo entre flechas', 'aproxima la correlación entre las dos variables'],
   ['proyección sobre un eje', 'su r con ese eje'],
   ['dirección', 'hacia dónde crece la variable en el mapa de individuos']
  ].forEach(([q, t], i) => {
    const y0 = ly + 24 + i * 56;
    b += txt(30, y0, q, { fs: 11.5, fill: C.ink2 });
    wrap(t, 32).forEach((l, k) => b += txt(30, y0 + 16 + k * 14, l, { fs: 10.5, fill: C.ink3 }));
  });

  b += txt(30, H - 22, 'una flecha por cantidad · sus coordenadas son sus correlaciones con cada eje', { fs: 10.5, fill: C.ink3 });
  return svg(W, H,
    `El círculo de correlaciones del ejemplo: una flecha por cada una de las ${FAMD.numericas.length} `
    + `numéricas, con coordenadas iguales a sus correlaciones con los dos ejes, rotuladas: `
    + FAMD.numericas.map(v => `${v.rotulo} en (${FAMD.correlaciones[v.clave].map(n3).join(', ')})`).join(' y '),
    b);
}

/* ═══════════ 7 · the relationship square ═══════════ */
export function cuadradoRelaciones() {
  const H = 500;
  const x0 = 330, y0 = 60, lado = 380;
  const s = scale([0, 1], [0, lado]);
  let b = '';
  b += txt(30, 28, 'EL CUADRADO DE RELACIONES · TODAS LAS VARIABLES COMO IGUALES', { fs: 11, fill: C.ask, ls: 1.8 });
  b += `<rect x="${x0}" y="${y0}" width="${lado}" height="${lado}" fill="none" stroke="${C.line}" stroke-width="1"/>`;
  [0.25, 0.5, 0.75].forEach(t => {
    b += pline([[x0 + s(t), y0], [x0 + s(t), y0 + lado]], C.lineSoft, { sw: 1 });
    b += pline([[x0, y0 + lado - s(t)], [x0 + lado, y0 + lado - s(t)]], C.lineSoft, { sw: 1 });
  });
  [0, 0.5, 1].forEach(t => {
    b += txt(x0 + s(t), y0 + lado + 16, num(t), { fs: 10, fill: C.ink3, ta: 'middle' });
    b += txt(x0 - 8, y0 + lado - s(t) + 4, num(t), { fs: 10, fill: C.ink3, ta: 'end' });
  });
  b += txt(x0 + lado, y0 + lado + 36, `vínculo con el eje 1 (r² o η²) · eje 1 retiene ${num(FAMD.porcentajes[0])} %`, { fs: 10.5, fill: C.ink3, ta: 'end' });
  b += txt(x0, y0 - 14, `vínculo con el eje 2 (r² o η²) · eje 2 retiene ${num(FAMD.porcentajes[1])} % (vertical)`, { fs: 10.5, fill: C.ink3 });

  FAMD.numericas.forEach(v => {
    const [a, c] = FAMD.r2[v.clave];
    const x = x0 + s(a), y = y0 + lado - s(c);
    b += dot(x, y, 6, COL_NUM);
    b += txt(x - 10, y + 4, v.rotulo, { fs: 12, fill: C.ink, ta: 'end' });
  });
  FAMD.categoricas.forEach(v => {
    const [a, c] = FAMD.eta2[v.variable];
    const x = x0 + s(a), y = y0 + lado - s(c);
    b += cuadrado(x, y, 12, colorCat(v.variable));
    b += txt(x, y - 12, v.variable, { fs: 12, fill: C.ink, ta: 'middle' });
  });

  /* corners and origin, said in the figure */
  b += txt(x0 + lado + 8, y0 + lado - 4, '← puro eje 1', { fs: 10, fill: C.ink3 });
  b += txt(x0 + 6, y0 + 14, 'puro eje 2', { fs: 10, fill: C.ink3 });
  b += txt(x0 + 6, y0 + lado - 8, 'origen: no participa del plano', { fs: 10, fill: C.ink3 });

  let ly = 70;
  b += txt(30, ly, 'QUÉ ES CADA PUNTO', { fs: 10.5, fill: C.ask, ls: 1.6 });
  b += dot(36, ly + 20, 5.5, COL_NUM);
  b += txt(50, ly + 24, 'una numérica: (r² eje 1, r² eje 2)', { fs: 11, fill: C.ink2 });
  b += cuadrado(36, ly + 42, 11, C.ink2);
  b += txt(50, ly + 46, 'una categórica: (η² eje 1, η² eje 2)', { fs: 11, fill: C.ink2 });
  wrap('Los dos indicadores viven en [0, 1], así que todo cae en el cuadrado unitario y una variable de cualquier tipo se lee igual. Es el gráfico para nombrar dimensiones cuando hay muchas variables.', 34)
    .forEach((l, i) => b += txt(30, ly + 76 + i * 15, l, { fs: 10.5, fill: C.ink3 }));

  return svg(W, H,
    `El cuadrado de relaciones del ejemplo: cada variable es un punto dentro del cuadrado `
    + `unitario cuyas coordenadas son su vínculo con cada eje, r cuadrado si es numérica y `
    + `eta cuadrado si es categórica; las numéricas son círculos y las categóricas cuadrados. `
    + FAMD.numericas.map(v => `${v.rotulo} en (${FAMD.r2[v.clave].slice(0, 2).map(num).join(', ')})`).join(', ')
    + ', ' + FAMD.categoricas.map(v => `${v.variable} en (${FAMD.eta2[v.variable].slice(0, 2).map(num).join(', ')})`).join(', '),
    b);
}
