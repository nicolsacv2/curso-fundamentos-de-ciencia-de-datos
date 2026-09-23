import { C, svg, txt, wrap } from '../../../svg/kit.js';
import { MCA, MCA_RARA, SUPL } from '../data/ejemplo.js';
import { dot, pline, num, plano, cuadrado, suplementaria, row, frac, measure, label,
  apilar, CATEGORICO } from './shared.js';

/* Block 2 of session 7 · the MCA on the eight-person example. Every id carries the
   ar-s7-b2- prefix. Every coordinate comes out of src/sessions/s07/data/ejemplo.js, which
   scripts/ejemplo_mca_famd.py wrote after checking its own identities: nothing here
   is typed, and the four SVG of the guide were a reference of composition only.

   The formulas are drawn with the small typesetter of shared.js — a fifth dependency
   for KaTeX is not on the table — and each one is followed by its number in the
   example, so a formula on the wall is never a formula alone. */

const W = 980;
const FS = 20;

/* A number the way the class reads it, with the sign the guide prints. */
const n3 = v => num(v).replace('-', '−');

/* Bebida, Horario and the third variable get one hue each. Six hues exist because the
   entrada's mosaic needed six; here three are used, in the same fixed order. */
const colorDe = (analisis, variable) =>
  CATEGORICO[analisis.variables.findIndex(v => v.variable === variable)];

/* «Azúcar: Sí» rather than «Sí»: a yes needs its question next to it on a wall. */
const rotulo = cat => /^(Sí|No)$/.test(cat.nivel) ? `${cat.variable}: ${cat.nivel}` : cat.nivel;

/* A row of pieces, then an in-line fraction, then more pieces, laid out by their
   measured widths so that nothing is placed by eye. */
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

/* One formula and what it comes to in the example, laid out as a section: the tag and
   its gloss on the left, the formula on the right at the same height, and the example
   line under both, at full width and wrapped — a line that starts at x = 400 runs out
   of frame at eighty characters, and every one of these is longer. `dibuja(y)` draws
   the formula with its baseline at y. Returns the markup and where the next section
   starts, so a taller gloss pushes everything below it instead of landing on it. */
function seccion(y0, tag, nota, dibuja, ejemplo) {
  const glosa = wrap(nota, 34);
  let s = label(y0, tag, nota) + dibuja(y0 + 28);
  const yEj = y0 + 30 + Math.max(glosa.length * 16 + 10, 44);
  const lineas = wrap(ejemplo, 118);
  lineas.forEach((l, i) => s += txt(56, yEj + i * 16, l, { fs: 12, fill: C.ask }));
  return [s, yEj + lineas.length * 16 + 26];
}

/* A trailing space: the piece after «=» gets its own breath without a gap of its own. */
const eq = { t: '= ', gap: 12, fill: C.ink2 };
const X = 400;
const idx = (x, y, t) => txt(x, y, t, { fs: 11, ff: 'serif', fill: C.ink3 });

/* ═══════════ 1 · the indicator matrix, the masses and the residuals ═══════════ */
export function fIndicadora() {
  const n = MCA.n, Q = MCA.Q, c = MCA.categorias[0];
  let s = '', y = 40, parte;

  [parte, y] = seccion(y, 'MATRIZ INDICADORA',
    'una columna por categoría: 1 si la persona la tiene, 0 si no',
    yb => row(X, yb, [{ t: 'z', sub: 'ij' }, { t: '∈ {0, 1}', gap: 12 },
      { t: 'Σ', gap: 40, fs: 26, fill: C.ink2 }, { t: 'z', gap: 6, sub: 'ij' }, eq, { t: 'Q' },
      { t: 'Σ', gap: 40, fs: 26, fill: C.ink2 }, { t: 'z', gap: 6, sub: 'ij' }, eq, { t: 'n', sub: 'j' }], FS)
      + idx(X + 168, yb + 16, 'j') + idx(X + 318, yb + 16, 'i'),
    `en el ejemplo: cada fila suma Q = ${Q}, cada columna suma n_j = ${c.n}, y la tabla entera suma n·Q = ${n * Q}`);
  s += parte;

  [parte, y] = seccion(y, 'MASAS', 'cuánto pesa cada fila y cada columna en el análisis',
    yb => linea(X, yb, [{ t: 'r', sub: 'i' }, eq], [{ t: '1' }], [{ t: 'n' }], null)
      + linea(X + 170, yb, [{ t: 'c', sub: 'j' }, eq], [{ t: 'n', sub: 'j' }], [{ t: 'n · Q' }], null),
    `en el ejemplo: r_i = 1/${n} = ${num(MCA.masaFila)} para las ${n} personas · c_j = ${c.n}/${n * Q} = ${num(c.masa)} para las ${MCA.J} categorías, todas con ${c.n} personas`);
  s += parte;

  [parte, y] = seccion(y, 'RESIDUOS ESTANDARIZADOS',
    'el chi-cuadrado repartido celda por celda: lo que hay menos lo que habría si personas y categorías fueran independientes',
    yb => linea(X, yb, [{ t: 's', sub: 'ij' }, eq],
      [{ t: 'p', sub: 'ij' }, { t: '−', gap: 7 }, { t: 'r', gap: 7, sub: 'i' }, { t: 'c', gap: 4, sub: 'j' }],
      [{ t: '√(' }, { t: 'r', sub: 'i' }, { t: 'c', gap: 4, sub: 'j' }, { t: ')' }],
      [{ t: 'con', gap: 30, fill: C.ink2, fs: 15 }, { t: 'p', gap: 10, sub: 'ij' }, eq])
      + frac(X + 470, yb - 7, [{ t: 'z', sub: 'ij' }], [{ t: 'n · Q' }], FS),
    `en el ejemplo: la celda (1, Café) vale ${n3(MCA.residuos[0][0])} y la celda (5, Café), ${n3(MCA.residuos[4][0])}. Los ${n * MCA.J} residuos al cuadrado suman la inercia total, ${num(MCA.inerciaTotal)}.`);
  s += parte;

  return svg(W, y,
    'Tres fórmulas del análisis de correspondencias múltiples: la matriz indicadora de '
    + 'ceros y unos, cuyas filas suman el número de variables y cuyas columnas suman la '
    + 'frecuencia de cada categoría; las masas de fila, uno sobre n, y de columna, la '
    + 'frecuencia sobre n por Q; y los residuos estandarizados, la diferencia entre la '
    + 'proporción observada y la esperada bajo independencia, dividida por la raíz de la '
    + 'esperada', s);
}

/* ═══════════ 2 · the chi-square metric and its consequence ═══════════ */
export function fDistancia() {
  const n = MCA.n, cat = MCA.categorias[0];
  let s = '', y = 40, parte;

  [parte, y] = seccion(y, 'DISTANCIA ENTRE DOS PERSONAS',
    'la métrica chi-cuadrado: cada columna pesa 1/n_j, así que dos personas que comparten una categoría rara quedan más cerca que dos que comparten una común',
    yb => {
      const antes = [{ t: 'd', sup: '2' }, { t: '(i, i′)' }, eq];
      const xs = X + measure(antes, FS) + 10 + 46 + 10 + 22;
      return linea(X, yb, antes, [{ t: 'n' }], [{ t: 'Q' }], [{ t: 'Σ', gap: 6, fs: 26, fill: C.ink2 }])
        + frac(xs + 60, yb - 7, [{ t: '(' }, { t: 'z', sub: 'ij' }, { t: '−', gap: 7 }, { t: 'z', gap: 7, sub: 'i′j' }, { t: ')', sup: '2' }],
          [{ t: 'n', sub: 'j' }], FS)
        + idx(xs - 16, yb + 18, 'j');
    },
    'en el ejemplo todas las categorías tienen la misma frecuencia, así que aquí todas las columnas pesan igual. En una tabla real no: una categoría que tiene una sola persona pesa tantas veces más que una que tienen todos como personas haya.');
  s += parte;

  [parte, y] = seccion(y, 'DE UNA CATEGORÍA AL CENTRO',
    'la fórmula cerrada: solo depende de cuánta gente la tiene',
    yb => linea(X, yb, [{ t: 'd', sup: '2' }, { t: '(j, centroide)' }, eq], [{ t: 'n' }], [{ t: 'n', sub: 'j' }],
      [{ t: '−', gap: 4 }, { t: '1', gap: 8 }]),
    `en el ejemplo: ${n}/${cat.n} − 1 = ${num(cat.d2)} para las ${MCA.J} categorías, todas con ${cat.n} personas. Con una sola persona sería ${n}/1 − 1 = ${n - 1}. Con n_j → 0, la distancia diverge.`);
  s += parte;

  return svg(W, y,
    'Dos fórmulas: la distancia chi-cuadrado entre dos personas, que es n sobre Q por la '
    + 'suma en cada categoría de la diferencia de indicadores al cuadrado dividida por la '
    + 'frecuencia de la categoría; y la distancia de una categoría al centroide, que es n '
    + 'sobre su frecuencia menos uno', s);
}

/* ═══════════ 2b · from the distances to the map ═══════════
   The same three steps block 1 draws for the rain table, on the indicator matrix: the
   cloud (a person per row of Z, mass 1/n, the chi-square rule), the axes (the direction
   that keeps the most inertia, J − Q of them), the coordinates (projections, so that a
   distance on the map approximates the chi-square one and equals it over every axis).
   Verified on the farthest pair of people, three ways. */
export function fSalto() {
  const sl = MCA.salto;
  let s = '', y = 40, parte;
  [parte, y] = seccion(y, 'LA NUBE', 'cada persona es una fila de Z: un punto con J coordenadas, un 1 en sus Q categorías; pesa 1/n; entre dos personas se mide con la distancia chi-cuadrado de arriba',
    yb => linea(X, yb, [{ t: 'z', sub: 'i' }, eq, { t: '(z', sub: 'i1' }, { t: ', …, z', sub: 'iJ' }, { t: ')' },
      { t: 'masa', gap: 26, fill: C.ink2, fs: 15 }, { t: 'm', gap: 10, sub: 'i' }, eq], [{ t: '1' }], [{ t: 'n' }], null),
    `en el ejemplo: ${MCA.n} puntos con J = ${MCA.J} coordenadas, ${MCA.Q} unos en cada fila, masa 1/${MCA.n} = ${num(MCA.masaFila)}`);
  s += parte;
  [parte, y] = seccion(y, 'LOS EJES', 'la dirección en la que la nube más se estira —la que más inercia conserva, pesando cada persona por su masa—; después las siguientes, perpendiculares. El mismo gesto que en la lluvia y que en el PCA de la sesión 6',
    yb => linea(X, yb, [{ t: 'λ', sub: '1' }, { t: '≥', gap: 8 }, { t: 'λ', gap: 8, sub: '2' }, { t: '≥ … ≥', gap: 8 }, { t: 'λ', gap: 8, sub: 'K' },
      { t: 'K', gap: 40 }, eq, { t: 'J − Q' }], null, null, null),
    `en el ejemplo: K = ${MCA.J} − ${MCA.Q} = ${MCA.ejes}, λ = (${MCA.autovalores.map(num).join(', ')}); los dos ejes del mapa retienen ${num(MCA.acumulado[1])} %`);
  s += parte;
  [parte, y] = seccion(y, 'LAS COORDENADAS', 'la coordenada de una persona en un eje es su proyección sobre él; la distancia entre dos personas en el mapa aproxima la chi-cuadrado, y es exacta si se suman todos los ejes',
    yb => linea(X, yb, [{ t: 'd', sup: '2' }, { t: '(i, i′)' }, { t: '≈', gap: 8, fill: C.ink2 }, { t: 'Σ', gap: 6, fs: 26, fill: C.ink2 }, { t: '(f', gap: 4, sub: 'ik' }, { t: '−', gap: 7 }, { t: 'f', gap: 7, sub: 'i′k' }, { t: ')', sup: '2' },
      { t: 'con igualdad si k recorre los K ejes', gap: 30, fill: C.ink2, fs: 15 }], null, null, null)
      + idx(X + measure([{ t: 'd', sup: '2' }, { t: '(i, i′)' }, { t: '≈', gap: 8 }], FS) + 10, yb + 20, 'k'),
    `en el ejemplo, personas ${sl.personas[0]} y ${sl.personas[1]}: por Z, d = ${num(sl.dZ)}; por los ${sl.ejes} ejes, ${num(sl.dTodosLosEjes)}, la misma; por los ${sl.ejesMapa} del mapa, ${num(sl.dMapa)}: lo que falta es el ${num(Math.round((100 - sl.retenido) * 10) / 10)} % que el plano no retiene`);
  s += parte;
  return svg(W, y,
    'Los tres pasos de las distancias al mapa en el MCA: la nube de personas de la tabla '
    + 'disyuntiva con masa uno sobre n y la distancia chi-cuadrado; los ejes ordenados por la '
    + 'inercia que conservan, J menos Q de ellos; y las coordenadas como proyecciones, con la '
    + 'distancia entre dos personas en el mapa aproximando la chi-cuadrado y coincidiendo con '
    + `ella sobre todos los ejes. Verificado sobre las personas ${sl.personas[0]} y ${sl.personas[1]}`, s);
}

/* ═══════════ 3 · the transition formulas ═══════════ */
export function fTransicion() {
  const t = MCA.transicion;
  let s = '', y = 40, parte;
  const transicion = (yb, izq, den, suma, sub) => {
    let cur = X + measure([izq, eq], FS) + 10 + 62 + 10 + 20;
    let m = linea(X, yb, [izq, eq], [{ t: '1' }], [{ t: '√λ', sub: 'k' }], [{ t: '·', gap: 4 }])
      + frac(cur + 22, yb - 7, [{ t: '1' }], [den], FS);
    cur += 44 + 10;
    m += row(cur, yb, [{ t: 'Σ', fs: 26, fill: C.ink2 }, { t: 'z', gap: 6, sub: 'ij' }, suma], FS)
      + idx(cur + 4, yb + 20, sub);
    return m;
  };

  [parte, y] = seccion(y, 'DE LAS CATEGORÍAS A LA PERSONA',
    'una persona está en el baricentro de sus categorías, dilatado por 1/√λ',
    yb => transicion(yb, { t: 'f', sub: 'ik' }, { t: 'Q' }, { t: 'g', gap: 6, sub: 'jk' }, 'j'),
    `en el ejemplo, individuo ${t.individuo}, eje 1: (${t.categorias.map(c => n3(c.coord)).join(' + ')})/${MCA.Q} = ${n3(t.baricentro)}, y ${n3(t.baricentro)}/${num(t.raizLambda)} = ${n3(t.dilatado)}: su coordenada publicada es ${n3(t.coordPublicada)}.`);
  s += parte;

  [parte, y] = seccion(y, 'DE LAS PERSONAS A LA CATEGORÍA',
    'y una categoría, en el baricentro de sus personas, dilatado igual',
    yb => transicion(yb, { t: 'g', sub: 'jk' }, { t: 'n', sub: 'j' }, { t: 'f', gap: 6, sub: 'ik' }, 'i'),
    'salvo la dilatación, cada persona está en el medio de sus respuestas y cada categoría en el medio de su gente: lo que va junto en la vida real termina junto en el dibujo.');
  s += parte;

  return svg(W, y,
    'Las dos fórmulas de transición: la coordenada de una persona en un eje es uno sobre '
    + 'la raíz del valor propio por el promedio de las coordenadas de sus categorías, y la '
    + 'de una categoría es uno sobre la raíz del valor propio por el promedio de las '
    + 'coordenadas de sus personas. Verificada sobre el individuo 1 del ejemplo', s);
}

/* ═══════════ 4 · total inertia and Benzécri's correction ═══════════ */
export function fInercia() {
  const b = MCA.benzecri, Q = MCA.Q, J = MCA.J;
  let s = '', y = 40, parte;

  [parte, y] = seccion(y, 'INERCIA TOTAL',
    'la suma de los valores propios no depende de los datos, solo de cuántas categorías y cuántas variables hay',
    yb => linea(X, yb, [{ t: 'Σ', fs: 26, fill: C.ink2 }, { t: 'λ', gap: 6, sub: 'k' }, eq], [{ t: 'J − Q' }], [{ t: 'Q' }],
      [{ t: 'y hay', gap: 30, fill: C.ink2, fs: 15 }, { t: 'J − Q', gap: 10 }, { t: 'ejes', gap: 10, fill: C.ink2, fs: 15 }])
      + idx(X + 4, yb + 20, 'k'),
    `en el ejemplo: (${J} − ${Q})/${Q} = ${num(MCA.inerciaTotal)}, repartida en ${MCA.ejes} ejes. El valor propio promedio es 1/Q = ${num(b.umbral)}, y por eso los porcentajes crudos son pesimistas.`);
  s += parte;

  [parte, y] = seccion(y, 'CORRECCIÓN DE BENZÉCRI',
    'se re-escalan solo los valores propios que superan el promedio; los demás se dan por ruido',
    yb => row(X, yb, [{ t: 'λ', sup: 'adj', sub: 'k' }, { t: '=', gap: 22, fill: C.ink2 }, { t: '(', gap: 10 }], FS)
      + frac(X + 96, yb - 7, [{ t: 'Q' }], [{ t: 'Q − 1' }], FS)
      + row(X + 132, yb, [{ t: ')', sup: '2' }, { t: '(', gap: 12 }, { t: 'λ', gap: 2, sub: 'k' }, { t: '−', gap: 10 }], FS)
      + frac(X + 232, yb - 7, [{ t: '1' }], [{ t: 'Q' }], FS)
      + row(X + 256, yb, [{ t: ')', sup: '2' }, { t: 'solo si', gap: 24, fill: C.ink2, fs: 15 }, { t: 'λ', gap: 10, sub: 'k' }, { t: '>', gap: 10 }], FS)
      + frac(X + 400, yb - 7, [{ t: '1' }], [{ t: 'Q' }], FS),
    `en el ejemplo solo λ₁ = ${num(MCA.autovalores[0])} supera ${num(b.umbral)}: (${Q}/${Q - 1})² · (${num(MCA.autovalores[0])} − ${num(b.umbral)})² = ${num(b.ajustados[0])}. El eje 1 pasa de ${num(MCA.porcentajes[0])} % crudo a ${num(b.porcentajesAjustados[0])} % ajustado: con ${MCA.n} personas la corrección exagera, que es la crítica de Greenacre.`);
  s += parte;

  return svg(W, y,
    'Dos fórmulas: la inercia total es la suma de los valores propios y vale J menos Q '
    + 'sobre Q, con J menos Q ejes; y la corrección de Benzécri, que re-escala cada valor '
    + 'propio que supera uno sobre Q como Q sobre Q menos uno al cuadrado por la '
    + 'diferencia al cuadrado', s);
}

/* ═══════════ 5 · contribution and squared cosine ═══════════ */
export function fContribucion() {
  const cafe = MCA.categorias.find(c => c.nivel === 'Café');
  let s = '', y = 40, parte;

  [parte, y] = seccion(y, 'CONTRIBUCIÓN',
    'qué parte de un eje puso cada categoría · suman 1 por eje · las altas definen el eje',
    yb => linea(X, yb, [{ t: 'ctr', sub: 'jk' }, eq],
      [{ t: 'c', sub: 'j' }, { t: 'g', gap: 6, sub: 'jk', sup: '2' }], [{ t: 'λ', sub: 'k' }], null),
    `en el ejemplo, Café en el eje 1: ${num(cafe.masa)} · ${n3(cafe.coord[0])}² / ${num(MCA.autovalores[0])} = ${num(cafe.ctr[0] / 100)}, es decir ${num(cafe.ctr[0])} %. El aporte promedio de una categoría es 1/J = ${num(MCA.aportePromedio)} %.`);
  s += parte;

  [parte, y] = seccion(y, 'COSENO CUADRADO',
    'qué tan fiel es la posición de un punto en ese eje · suman 1 por punto sobre todos los ejes',
    yb => linea(X, yb, [{ t: 'cos', sup: '2', sub: 'jk' }, eq],
      [{ t: 'g', sub: 'jk', sup: '2' }], [{ t: 'd', sup: '2' }, { t: '(j, centroide)' }], null),
    `en el ejemplo, Café: ${n3(cafe.coord[0])}² / ${num(cafe.d2)} = ${num(cafe.cos2[0])} en el eje 1, ${num(cafe.cos2[1])} en el eje 2 y ${num(cafe.cos2[2])} en el 3. Suman 1: el eje 1 solo ya cuenta el ${Math.round(cafe.cos2[0] * 100)} % de dónde está Café.`);
  s += parte;

  return svg(W, y,
    'Dos fórmulas: la contribución de una categoría a un eje es su masa por su coordenada '
    + 'al cuadrado sobre el valor propio, y suman uno por eje; el coseno cuadrado es su '
    + 'coordenada al cuadrado sobre su distancia al centroide, y suman uno por categoría', s);
}

/* ═══════════ 6 · the supplementary projection ═══════════ */
export function fSuplementaria() {
  const st = SUPL.categorias.find(c => c.nivel === 'Stevia');
  const f7 = MCA.individuos[st.individuos[0] - 1].coord;
  const raices = MCA.autovalores.map(l => num(Math.round(Math.sqrt(l) * 1000) / 1000));
  let s = '', y = 40, parte;

  [parte, y] = seccion(y, 'PROYECCIÓN SUPLEMENTARIA',
    'la fórmula de transición aplicada hacia afuera: la categoría recibe coordenadas sobre unos ejes ya cerrados, sin haber participado en los residuos, en la SVD ni en los λ',
    yb => {
      let cur = X + measure([{ t: 'g', sup: 'sup', sub: 'jk' }, eq], FS) + 10 + 62 + 10 + 20;
      let m = linea(X, yb, [{ t: 'g', sup: 'sup', sub: 'jk' }, eq], [{ t: '1' }], [{ t: '√λ', sub: 'k' }], [{ t: '·', gap: 4 }])
        + frac(cur + 22, yb - 7, [{ t: '1' }], [{ t: 'n', sub: 'j' }], FS);
      cur += 44 + 10;
      return m + row(cur, yb, [{ t: 'Σ', fs: 26, fill: C.ink2 }, { t: 'f', gap: 6, sub: 'ik' }], FS)
        + idx(cur - 2, yb + 22, 'i ∈ j');
    },
    `en el ejemplo, Stevia tiene una sola persona, la ${st.individuos[0]}, con f = (${f7.map(n3).join(', ')}). Dividida por √λ = (${raices.join(', ')}) queda en (${st.coord.map(n3).join(', ')}). Por la vía dual —el perfil de la columna por las coordenadas estándar de las personas— sale (${st.coordDual.map(n3).join(', ')}): lo mismo.`);
  s += parte;

  return svg(W, y,
    'La fórmula de la proyección suplementaria: la coordenada de una categoría que no '
    + 'participó del análisis es uno sobre la raíz del valor propio por el promedio de las '
    + 'coordenadas de sus personas. Verificada sobre Stevia, que tiene una sola', s);
}

/* ═══════════ the factorial planes ═══════════
   Shared furniture for the three maps: individuals as circles, categories as squares
   coloured by variable, a legend inside the figure, and the two axes labelled with their
   number and their percentage — and nothing else. Individuals that share a position are
   drawn once and labelled together («1, 2»), the way the guide does. */
function mapa(analisis, o) {
  const { L, xa, ya, lim, extra, nota, sup } = o;
  const { sx, sy, b: ejes } = plano(xa, ya, L, lim, analisis.porcentajes);
  let b = ejes;

  /* individuals, grouped where they coincide; categories as squares. Every label goes
     to the RIGHT of its mark and the set is stacked with apilar(), so that a category
     sitting on a person — the rare set-up has several — does not print one label over
     the other. */
  const rotulos = [];
  const grupos = new Map();
  analisis.individuos.forEach((ind, i) => {
    const k = ind.coord.slice(0, 2).map(v => v.toFixed(2)).join(',');
    if (!grupos.has(k)) grupos.set(k, { coord: ind.coord, quienes: [] });
    grupos.get(k).quienes.push(i + 1);
  });
  grupos.forEach(g => {
    const x = sx(g.coord[0]), y = sy(g.coord[1]);
    b += dot(x, y, g.quienes.length > 1 ? 6 : 4.5, C.ink3, { op: 0.85 });
    rotulos.push({ x: x + 9, y: y + 4, t: `ind ${g.quienes.join(', ')}`, fs: 10, fill: C.ink3, ancho: 80 });
  });
  analisis.categorias.forEach(cat => {
    const x = sx(cat.coord[0]), y = sy(cat.coord[1]);
    b += cuadrado(x, y, 13, colorDe(analisis, cat.variable), { op: 0.95 });
    rotulos.push({ x: x + 11, y: y + 4, t: rotulo(cat) + (cat.n === 1 ? ` (n=${cat.n})` : ''),
      fs: 12, fill: C.ink, ancho: 110 });
  });
  apilar(rotulos, 13).forEach(r => b += txt(r.x, r.y, r.t, { fs: r.fs, fill: r.fill }));

  /* supplementary points, if any */
  (sup || []).forEach(sp => {
    const x = sx(sp.coord[0]), y = sy(sp.coord[1]);
    const col = colorDe(analisis, 'Azúcar');
    b += suplementaria(x, y, 9, col);
    b += txt(x + 14, y + 4, `${sp.nivel} (supl., n=${sp.n})`, { fs: 12, fill: C.ink });
  });

  /* legend, inside the frame, top-left */
  b += txt(30, 28, o.titulo, { fs: 11, fill: C.ask, ls: 1.8 });
  let ly = 60;
  analisis.variables.forEach((v, i) => {
    b += cuadrado(36, ly - 4, 11, CATEGORICO[i]);
    b += txt(50, ly, `${v.variable}: ${v.niveles.join(' · ')}`, { fs: 11, fill: C.ink2 });
    ly += 18;
  });
  b += dot(36, ly - 4, 4.5, C.ink3, { op: 0.85 });
  b += txt(50, ly, 'una persona (o varias en el mismo punto)', { fs: 11, fill: C.ink2 });
  ly += 18;
  if (sup) {
    b += suplementaria(36, ly - 4, 6, colorDe(analisis, 'Azúcar'));
    b += txt(50, ly, 'suplementaria: se dibuja, no deformó los ejes', { fs: 11, fill: C.ink2 });
    ly += 18;
  }
  if (nota) {
    ly += 8;
    wrap(nota, 30).forEach((linea, i) => b += txt(30, ly + i * 15, linea, { fs: 11, fill: C.ink3 }));
  }
  if (extra) b += extra(sx, sy);
  return b;
}

/* 7 · the base map: two axes that carry 90 % of one unit of inertia */
export function mapaBase() {
  const L = 440, xa = 300, ya = 56, H = ya + L + 70;
  const b = mapa(MCA, {
    L, xa, ya, lim: [1.25, 1.25],
    titulo: `${MCA.n} PERSONAS Y ${MCA.J} CATEGORÍAS EN EL PLANO`,
    nota: `Cuadros = categorías, en el color de su variable · círculos = personas. Los ejes retienen ${num(MCA.acumulado[1])} % de la inercia.`
  });
  const pie = wrap(`Café y Té están más lejos del origen (±${num(Math.abs(MCA.categorias[0].coord[0]))}) que las demás (±${num(Math.abs(MCA.categorias[2].coord[0]))}): la bebida es el esqueleto del eje 1.`, 88)
    .map((l, i) => txt(xa, ya + L + 46 + i * 17, l, { fs: 12, fill: C.ink2 })).join('');
  return svg(W, H,
    `El plano de los dos primeros ejes del análisis de correspondencias múltiples del `
    + `ejemplo: ${MCA.n} personas como círculos y ${MCA.J} categorías como cuadrados `
    + `coloreados por variable. El eje 1 retiene ${num(MCA.porcentajes[0])} por ciento de la `
    + `inercia y el eje 2, ${num(MCA.porcentajes[1])}`, b + pie);
}

/* 8 · the map with the rare category active: one person, one axis */
export function mapaRara() {
  const L = 440, xa = 300, ya = 56, H = ya + L + 70;
  const r = MCA_RARA.rara;
  const stevia = MCA_RARA.categorias.find(c => c.nivel === 'Stevia');
  const b = mapa(MCA_RARA, {
    L, xa, ya, lim: [1.1, 2.8],
    titulo: `CON ENDULZANTE EN VEZ DE AZÚCAR · ${MCA_RARA.J} CATEGORÍAS`,
    nota: `Todo el resto queda arriba, en la franja |coord| < ${num(r.radioResto)}. Stevia, con una persona, está a ${num(r.d)} del centro.`,
    extra: (sx, sy) => {
      /* the thread from Stevia to the person who put it there */
      const ind = MCA_RARA.individuos[r.portador - 1].coord;
      return pline([[sx(stevia.coord[0]), sy(stevia.coord[1])], [sx(ind[0]), sy(ind[1])]],
        colorDe(MCA_RARA, 'Endulzante'), { sw: 1, dash: '4 3', op: 0.8 });
    }
  });
  const pie = wrap(`El eje 2 se lleva ${num(MCA_RARA.porcentajes[1])} % de la inercia y Stevia pone ${num(stevia.ctr[1])} % de él. Detrás hay una persona de ${MCA_RARA.n}: la ${r.portador}, arrastrada hacia ella.`, 88)
    .map((l, i) => txt(xa, ya + L + 46 + i * 17, l, { fs: 12, fill: C.ink2 })).join('');
  return svg(W, H,
    `El mismo plano con la tercera variable abierta en tres categorías: Stevia, que tiene `
    + `una sola persona, aparece lejos de todo lo demás en el eje 2, que retiene `
    + `${num(MCA_RARA.porcentajes[1])} por ciento, mientras el eje 1 baja a `
    + `${num(MCA_RARA.porcentajes[0])}`, b + pie);
}

/* 9 · the base map with Nada and Stevia projected as supplementary */
export function mapaSuplementarias() {
  const L = 440, xa = 300, ya = 56, H = ya + L + 70;
  const st = SUPL.categorias.find(c => c.nivel === 'Stevia');
  const b = mapa(MCA, {
    L, xa, ya, lim: [1.25, 1.6],
    titulo: 'EL ANÁLISIS BASE, CON DOS SUPLEMENTARIAS',
    sup: SUPL.categorias,
    nota: `Los ejes son los mismos de arriba: ${num(MCA.porcentajes[0])} % y ${num(MCA.porcentajes[1])} %. Nada y Stevia recibieron coordenadas; no cambiaron ni un valor propio.`,
    extra: (sx, sy) => {
      const ind = MCA.individuos[st.individuos[0] - 1].coord;
      return pline([[sx(st.coord[0]), sy(st.coord[1])], [sx(ind[0]), sy(ind[1])]],
        C.line, { sw: 1, dash: '3 3' });
    }
  });
  const pie = wrap(`Stevia queda en (${st.coord.slice(0, 2).map(n3).join(', ')}) con cos² ${num(st.cos2Plano)} en el plano: está lejos, en una dirección que este plano no captura. Como activa tenía ${num(SUPL.destinos.activa.cos2Plano)}.`, 88)
    .map((l, i) => txt(xa, ya + L + 46 + i * 17, l, { fs: 12, fill: C.ink2 })).join('');
  return svg(W, H,
    `El plano del análisis base con Nada y Stevia proyectadas como categorías `
    + `suplementarias, dibujadas como círculos punteados: se dibujan pero no deformaron los `
    + `ejes, que siguen reteniendo ${num(MCA.porcentajes[0])} y ${num(MCA.porcentajes[1])} `
    + `por ciento`, b + pie);
}

