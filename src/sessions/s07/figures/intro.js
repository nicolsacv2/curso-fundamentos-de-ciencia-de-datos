import { C, svg, txt, wrap, arrow } from '../../../svg/kit.js';
import { ESTADOS, ANIO, TABLA, PERFILES, ESPERADAS, CHI2, SIMPSON } from '../data/lluvia.js';
import { bar, pline, num, eje, ALTO_ROTULO, row, frac, measure, label, cuadrado,
  CATEGORICO } from './shared.js';

/* Entrada of session 7 · the contingency table of the rain example. Every id carries the
   ar-s7-in- prefix. Every number comes out of src/sessions/s07/data/lluvia.js, which
   scripts/ejemplo_lluvia.py counted from a simulated year of INVENTED days after asserting
   its identities and its story: nothing here is typed. Rows are the sky of the observed
   day, columns the sky of the day after, and the states are the same three words
   everywhere. */

const W = 980;
const FS = 20;
const eq = { t: '= ', gap: 12, fill: C.ink2 };
const X = 400;
const idx = (x, y, t) => txt(x, y, t, { fs: 11, ff: 'serif', fill: C.ink3 });
const F = ESTADOS, K = ESTADOS;

/* The cell the example is named after — it rained one day, it rains the next — found by
   its state's name, so that reordering the states cannot move the story to another cell. */
export const LLUVIA = ESTADOS.indexOf('lluvia');
export const celdaLluvia = () => ({ i: LLUVIA, j: LLUVIA });

/* The cell with the largest share of the chi-square: where the table departs most from
   independence. Read off the data, so the prose and the figures point at the same cell. */
export function celdaMayor() {
  let mejor = { i: 0, j: 0, v: -1 };
  CHI2.celdas.forEach((fila, i) => fila.forEach((v, j) => { if (v > mejor.v) mejor = { i, j, v }; }));
  return mejor;
}

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

function seccion(y0, tag, nota, dibuja, ejemplo) {
  const glosa = wrap(nota, 34);
  let s = label(y0, tag, nota) + dibuja(y0 + 28);
  const yEj = y0 + 30 + Math.max(glosa.length * 16 + 10, 44);
  const lineas = wrap(ejemplo, 118);
  lineas.forEach((l, i) => s += txt(56, yEj + i * 16, l, { fs: 12, fill: C.ask }));
  return [s, yEj + lineas.length * 16 + 26];
}

/* ═══════════ 0 · the year, day by day ═══════════
   365 cells in rows of thirty, each the colour of its state, the first and the last day
   with a light border and a label. Under it, one pair of consecutive days blown up with
   the arrow «día observado → día siguiente»: that pair is the UNIT the table counts, and
   the reason 365 days give 364 pairs. It is the answer to «if 170 days had sun, why
   would the next day not have at least 169?» — drawn, before the table says it. */
export function anio() {
  const POR_FILA = 30, celda = 22, x0 = 80, y0 = 92;
  const dias = ANIO.estados;
  const filas = Math.ceil(dias.length / POR_FILA);
  const yGrid = y0 + filas * celda;
  const yPar = yGrid + 58;
  const H = yPar + 84 + ALTO_ROTULO;
  let b = arrow('ar-s7-in-anio', C.ink2);
  b += txt(30, 28, `EL AÑO INVENTADO, DÍA POR DÍA · ${ANIO.dias} DÍAS, ${ANIO.pares} PARES`, { fs: 11, fill: C.ask, ls: 1.8 });
  wrap(`cada celda es un día, de izquierda a derecha y de arriba abajo · el color es el estado del cielo · sorteado con la semilla ${ANIO.semilla}, así que es siempre el mismo año`, 100)
    .forEach((l, i) => b += txt(30, 50 + i * 14, l, { fs: 10.5, fill: C.ink3 }));

  dias.forEach((estado, d) => {
    const fila = Math.floor(d / POR_FILA), col = d % POR_FILA;
    const x = x0 + col * celda, y = y0 + fila * celda;
    const extremo = d === 0 || d === dias.length - 1;
    b += `<rect x="${x + 1}" y="${y + 1}" width="${celda - 2}" height="${celda - 2}" rx="2"
      fill="${CATEGORICO[ESTADOS.indexOf(estado)]}" opacity="0.85"${extremo ? ` stroke="${C.ink}" stroke-width="2"` : ''}/>`;
    if (col === 0) b += txt(x0 - 10, y + celda / 2 + 4, `${d + 1}`, { fs: 9.5, fill: C.ink3, ta: 'end' });
  });
  /* the two ends of the year, named where they sit */
  const ult = dias.length - 1;
  const xu = x0 + (ult % POR_FILA) * celda, yu = y0 + Math.floor(ult / POR_FILA) * celda;
  b += txt(x0 + celda / 2, y0 - 8, `día 1 · ${dias[0]}`, { fs: 10, fill: C.ink, ta: 'middle' });
  b += txt(xu + celda + 8, yu + celda / 2 + 4, `día ${dias.length} · ${dias[ult]}`, { fs: 10, fill: C.ink });

  /* legend */
  const lx = 780, ly = y0;
  b += txt(lx, ly - 8, 'estado del cielo', { fs: 10.5, fill: C.ask, ls: 1.6 });
  ESTADOS.forEach((k, j) => {
    b += cuadrado(lx + 6, ly + 12 + j * 22, 11, CATEGORICO[j]);
    b += txt(lx + 20, ly + 16 + j * 22, k, { fs: 11, fill: C.ink2 });
  });
  b += `<rect x="${lx}" y="${ly + 12 + ESTADOS.length * 22 + 4}" width="12" height="12" rx="2" fill="none" stroke="${C.ink}" stroke-width="2"/>`;
  wrap('borde claro: el primer y el último día', 22).forEach((l, i) =>
    b += txt(lx + 20, ly + 16 + ESTADOS.length * 22 + 6 + i * 13, l, { fs: 10.5, fill: C.ink2 }));

  /* the unit: one pair of consecutive days, blown up */
  const G = 34;
  b += txt(x0, yPar - 12, 'LA UNIDAD DE LA TABLA: UN PAR DE DÍAS CONSECUTIVOS', { fs: 10.5, fill: C.ask, ls: 1.6 });
  [0, 1].forEach(d => {
    const x = x0 + d * 200;
    b += `<rect x="${x}" y="${yPar}" width="${G}" height="${G}" rx="3" fill="${CATEGORICO[ESTADOS.indexOf(dias[d])]}" opacity="0.9"${d === 0 ? ` stroke="${C.ink}" stroke-width="2"` : ''}/>`;
    b += txt(x + G + 10, yPar + 14, d === 0 ? 'día observado' : 'día siguiente', { fs: 11, fill: C.ink });
    b += txt(x + G + 10, yPar + 29, `día ${d + 1} · ${dias[d]}`, { fs: 10.5, fill: C.ink2 });
  });
  b += `<path d="M${x0 + 150},${yPar + G / 2} L${x0 + 190},${yPar + G / 2}" fill="none" stroke="${C.ink2}" stroke-width="1.4" marker-end="url(#ar-s7-in-anio)"/>`;
  wrap(`Este par suma 1 en la celda «${dias[0]} → ${dias[1]}». El siguiente par es el día 2 con el día 3, y así hasta el día ${dias.length - 1} con el ${dias.length}: ${ANIO.pares} pares. Cada día es «observado» una vez y «siguiente» una vez, salvo el día 1, que nunca es siguiente, y el día ${dias.length}, que nunca es observado.`, 58)
    .forEach((l, i) => b += txt(x0 + 430, yPar + 10 + i * 15, l, { fs: 11, fill: C.ink2 }));

  b += eje('x', W - 30, H - 10, `los ${ANIO.dias} días del año inventado, en orden · color: el estado del cielo · un par de días consecutivos es una celda de la tabla`);
  return svg(W, H,
    `El año inventado de ${ANIO.dias} días, un cuadro por día coloreado según el estado del cielo, con el `
    + `primer día (${dias[0]}) y el último (${dias[ult]}) señalados; debajo, un par de días consecutivos `
    + `ampliado como la unidad que la tabla cuenta: ${ANIO.pares} pares`, b);
}

/* ═══════════ 1 · observed against expected, cell by cell ═══════════
   A grid: in every cell the count of days, the count independence would give, and a
   tint whose depth is the cell's share of the chi-square and whose hue says the sign —
   more than expected in cyan, less in red. Margins on the edges, once. */
export function tablaChi2() {
  const x0 = 250, y0 = 96, lado = 150, alto = 78;
  const H = y0 + F.length * alto + 130 + ALTO_ROTULO;
  const maxC = Math.max(...CHI2.celdas.flat());
  let b = txt(30, 28, 'OBSERVADO CONTRA ESPERADO · EL DÍA OBSERVADO × EL DÍA SIGUIENTE',
    { fs: 11, fill: C.ask, ls: 1.8 });
  b += txt(30, 50, `cada celda: cuántos pares de días hubo, y cuántos habría si el día observado no dijera nada del siguiente · ${TABLA.n} pares de ${TABLA.dias} días inventados`,
    { fs: 10.5, fill: C.ink3 });

  b += txt(x0 + (K.length * lado) / 2, y0 - 44, 'día siguiente', { fs: 10.5, fill: C.ask, ta: 'middle', ls: 1.6 });
  K.forEach((k, j) => {
    const x = x0 + j * lado;
    b += txt(x + lado / 2, y0 - 26, k, { fs: 10.5, fill: C.ink2, ta: 'middle' });
    b += txt(x + lado / 2, y0 + F.length * alto + 18, `${TABLA.columnas[j]}`, { fs: 11, fill: C.ink3, ta: 'middle' });
  });
  b += txt(x0 + K.length * lado + 14, y0 - 26, 'suma', { fs: 10.5, fill: C.ink3 });
  b += txt(x0 - 12, y0 + F.length * alto + 18, 'suma', { fs: 10.5, fill: C.ink3, ta: 'end' });
  b += txt(x0 - 12, y0 - 26, 'día observado', { fs: 10.5, fill: C.ask, ta: 'end', ls: 1.6 });

  F.forEach((f, i) => {
    const y = y0 + i * alto;
    b += txt(x0 - 12, y + alto / 2 + 4, f, { fs: 10.5, fill: C.ink2, ta: 'end' });
    b += txt(x0 + K.length * lado + 14, y + alto / 2 + 4, `${TABLA.filas[i]}`, { fs: 11, fill: C.ink3 });
    K.forEach((k, j) => {
      const x = x0 + j * lado;
      const obs = TABLA.celdas[i][j], esp = ESPERADAS[i][j], c = CHI2.celdas[i][j];
      const mas = obs >= esp;
      const op = 0.12 + 0.6 * (c / maxC);
      b += `<rect x="${x + 2}" y="${y + 2}" width="${lado - 4}" height="${alto - 4}" fill="${mas ? C.ask : C.reveal}"
        opacity="${op.toFixed(2)}" stroke="${C.lineSoft}" stroke-width="1"/>`;
      b += txt(x + 14, y + 30, `${obs}`, { fs: 22, fill: C.ink });
      b += txt(x + 14, y + 52, `esperado ${num(esp)}`, { fs: 10.5, fill: C.ink2 });
      b += txt(x + lado - 12, y + 66, `χ² ${num(c)}`, { fs: 10, fill: mas ? C.ask : C.reveal, ta: 'end' });
    });
  });
  b += txt(x0 + K.length * lado + 14, y0 + F.length * alto + 18, `${TABLA.n}`, { fs: 11, fill: C.ink });

  const yl = y0 + F.length * alto + 48;
  b += bar(30, yl - 9, 12, 12, C.ask, { op: 0.6 });
  b += txt(50, yl, 'más pares de los que habría si el día observado y el siguiente fueran independientes', { fs: 11, fill: C.ink2 });
  b += bar(30, yl + 11, 12, 12, C.reveal, { op: 0.6 });
  b += txt(50, yl + 20, 'menos · cuanto más intenso el color, más pone la celda al χ²', { fs: 11, fill: C.ink2 });
  b += txt(30, yl + 46, `χ² = ${num(CHI2.total)} · φ² = χ²/n = ${num(CHI2.phi2)} · V de Cramér = ${num(CHI2.v)}`,
    { fs: 12.5, fill: C.ink });
  b += eje('x', W - 30, H - 10, `filas: el cielo del día observado · columnas: el del día siguiente · recuentos de pares de días consecutivos, ${TABLA.n} en total, inventados`);

  return svg(W, H,
    'Tabla de contingencia del cielo del día observado contra el del día siguiente, en un año inventado: en '
    + 'cada celda el número de pares de días observado y el esperado bajo independencia, coloreada según '
    + 'cuánto aporta al chi-cuadrado y si hay más o menos de lo esperado. Chi-cuadrado '
    + `${num(CHI2.total)}, V de Cramér ${num(CHI2.v)}`, b);
}

/* ═══════════ 2 · row profiles: each row as a bar to 100 % ═══════════
   A bar per state of the observed day, stretched to 100 %, split by the sky of the day
   after, as wide as the row's count of pairs. The last bar is the column margin — what
   every bar would look like if the observed day said nothing about the next. */
export function perfilesFila() {
  const H = 436 + ALTO_ROTULO;
  const x0 = 60, y0 = 100, alto = 210, ancho = 640;
  let b = txt(30, 28, 'P(SIGUIENTE | OBSERVADO) · UNA BARRA POR CADA CIELO DEL DÍA OBSERVADO',
    { fs: 11, fill: C.ask, ls: 1.8 });
  wrap(`cada barra es un estado del cielo del día observado estirado al 100 % · su ancho, cuántos días hubo con ese cielo · la última barra es el margen: lo que valdría cualquier fila si el día observado no dijera nada del siguiente · ${TABLA.n} pares de días inventados`, 118)
    .forEach((l, i) => b += txt(30, 50 + i * 15, l, { fs: 10.5, fill: C.ink3 }));
  const HUECO = 10;
  const total = TABLA.n;
  const util = ancho - HUECO * F.length;
  let cx = x0;
  const barras = [...F.map((f, i) => ({ t: `observado ${f}`, n: TABLA.filas[i], perfil: PERFILES.fila[i] })),
    { t: 'margen', n: total, perfil: TABLA.marginalColumna, margen: true }];
  barras.forEach(bq => {
    const bw = bq.margen ? 70 : (bq.n / total) * (util - 70);
    let cy = y0 + alto;
    bq.perfil.forEach((p, k) => {
      const hs = p * alto;
      if (hs > 0) b += bar(cx, cy - hs, bw, Math.max(0, hs - 2), CATEGORICO[k], { op: bq.margen ? 0.55 : 0.9 });
      if (hs > 16) b += txt(cx + bw / 2, cy - hs / 2 + 4, num(Math.round(p * 100)) + ' %', { fs: 10, fill: C.ink, ta: 'middle' });
      cy -= hs;
    });
    wrap(bq.t, 14).forEach((l, q) => b += txt(cx + bw / 2, y0 + alto + 18 + q * 13, l, { fs: 10.5, fill: bq.margen ? C.ink3 : C.ink2, ta: 'middle' }));
    b += txt(cx + bw / 2, y0 + alto + 48, `${bq.n} días`, { fs: 10, fill: C.ink3, ta: 'middle' });
    cx += bw + HUECO;
  });
  /* the legend: the sky of the day after */
  let ly = y0;
  b += txt(760, ly - 14, 'día siguiente', { fs: 10.5, fill: C.ask, ls: 1.6 });
  K.forEach((k, j) => {
    b += cuadrado(766, ly + 4 + j * 22, 11, CATEGORICO[j]);
    b += txt(780, ly + 8 + j * 22, k, { fs: 11, fill: C.ink2 });
  });
  b += eje('y', x0 - 30, y0 - 14, 'proporción dentro de cada fila', '0 a 100 %');
  b += eje('x', W - 30, H - 10, 'el cielo del día observado, un estado por barra · dentro, el reparto del cielo del día siguiente');
  return svg(W, H,
    'Los perfiles de fila de la tabla: una barra por estado del cielo del día observado, estirada al '
    + 'cien por ciento y partida en los tres estados del cielo del día siguiente, con el ancho '
    + 'proporcional a cuántos días hubo con ese cielo; la última barra es el margen de columna', b);
}

/* ═══════════ 3 · Simpson, in two figures ═══════════
   The same drawing twice, so the two compare by eye: one grid from 0 to 100, one pair of
   bars per group — P(better | dose), the percentage above, «X de Y» below — and the group's
   title over the pair. The first figure shows only the total and asks the naive question;
   the second shows the same people split by age and answers it the other way round. */
const SIMP = { x0: 80, y0: 102, alto: 220, barra: 80, hueco: 24, ancho: 750 };
const sY = v => SIMP.y0 + SIMP.alto - v * SIMP.alto;

function rejillaSimpson() {
  let b = '';
  [0, 0.25, 0.5, 0.75, 1].forEach(t => {
    b += pline([[SIMP.x0 - 6, sY(t)], [SIMP.x0 + SIMP.ancho, sY(t)]], C.lineSoft, { sw: 1 });
    b += txt(SIMP.x0 - 12, sY(t) + 4, `${Math.round(t * 100)}`, { fs: 10, fill: C.ink3, ta: 'end' });
  });
  return b;
}

/* One pair of bars — high dose, low dose — with its title centred over the pair. */
function parejaSimpson(gx, titulo, g, col) {
  let b = '';
  [['dosis alta', g.alta], ['dosis baja', g.baja]].forEach(([t, d], q) => {
    const x = gx + q * (SIMP.barra + SIMP.hueco);
    b += bar(x, sY(d.pMejora), SIMP.barra, SIMP.alto * d.pMejora, col, { op: q ? 0.45 : 0.85 });
    b += txt(x + SIMP.barra / 2, sY(d.pMejora) - 8, `${Math.round(d.pMejora * 100)} %`, { fs: 12, fill: C.ink, ta: 'middle' });
    b += txt(x + SIMP.barra / 2, SIMP.y0 + SIMP.alto + 18, t, { fs: 10.5, fill: C.ink2, ta: 'middle' });
    b += txt(x + SIMP.barra / 2, SIMP.y0 + SIMP.alto + 33, `${d.mejora} de ${d.total}`, { fs: 10, fill: C.ink3, ta: 'middle' });
  });
  b += txt(gx + SIMP.barra + SIMP.hueco / 2, SIMP.y0 - 12, `${titulo} · ${g.personas} personas`, { fs: 11.5, fill: col, ta: 'middle' });
  return b;
}

/* The frame the two figures share: header, grid, the note under the bars, the axis
   labels, and the height that fits them. */
function marcoSimpson(rotulo, subtitulo, cuerpo, nota, ejeX, alt) {
  const lineas = wrap(nota, 104);
  const yT = SIMP.y0 + SIMP.alto + 62;
  const H = yT + lineas.length * 17 + 30 + ALTO_ROTULO;
  let b = txt(30, 28, rotulo, { fs: 11, fill: C.ask, ls: 1.8 });
  b += txt(30, 50, subtitulo, { fs: 10.5, fill: C.ink3 });
  b += rejillaSimpson() + cuerpo;
  lineas.forEach((l, i) => b += txt(30, yT + i * 17, l, { fs: 12, fill: C.ink2 }));
  /* The axis label sits above the group titles, on its own line: at the axis' top it ran
     into «jóvenes · 100 personas». */
  b += eje('y', SIMP.x0 - 12, SIMP.y0 - 34, 'proporción que mejora', '% de quienes recibieron esa dosis');
  b += eje('x', W - 30, H - 10, ejeX);
  return svg(W, H, alt, b);
}

const pct0 = v => Math.round(v * 100);

/* The total alone: two bars, and the question anyone asks of a two-way table. */
export function simpsonTotal() {
  const T = SIMPSON.total;
  const gx = SIMP.x0 + SIMP.ancho / 2 - (2 * SIMP.barra + SIMP.hueco) / 2;
  return marcoSimpson(
    `¿QUÉ DOSIS ES MEJOR? · UN MEDICAMENTO, ${T.personas} PERSONAS`,
    'proporción que mejora, según la dosis · todas las personas juntas',
    parejaSimpson(gx, 'los dos grupos juntos', T, C.reveal),
    `Leída sola, la tabla responde: la dosis baja mejora más, ${pct0(T.baja.pMejora)} % contra ${pct0(T.alta.pMejora)} %. `
    + 'Antes de creerlo, hay una tercera variable que mirar: la edad de quien recibió cada dosis.',
    'dosis, con todas las personas juntas · debajo de cada barra, cuántas personas mejoraron de cuántas',
    `Dos barras con la proporción que mejora con dosis alta y con dosis baja, con los dos grupos de edad `
    + `juntos: la dosis alta mejora ${pct0(T.alta.pMejora)} por ciento y la baja ${pct0(T.baja.pMejora)}. `
    + 'Leída sola, la dosis baja parece mejor');
}

/* The same people, split by age: two pairs, and in each the high dose wins. */
export function simpsonGrupos() {
  const [g0, g1] = SIMPSON.grupos;
  const paso = SIMP.ancho / 2;
  const cuerpo = SIMPSON.grupos.map((g, k) => parejaSimpson(
    SIMP.x0 + k * paso + paso / 2 - (2 * SIMP.barra + SIMP.hueco) / 2, g.grupo, g, C.ask)).join('');
  return marcoSimpson(
    'LAS MISMAS PERSONAS, SEPARADAS POR EDAD',
    'proporción que mejora, según la dosis · dentro de cada grupo de edad',
    cuerpo,
    `En cada grupo la dosis alta mejora más. Juntos, mejoraba menos: los ${g0.grupo} —que casi todos mejoran— `
    + `recibieron casi todos la dosis baja, y los ${g1.grupo} —que casi ninguno mejora— casi todos la alta. `
    + 'El grupo de edad va con la dosis y con la mejoría a la vez.',
    'dosis, dentro de cada grupo de edad · debajo de cada barra, cuántas personas mejoraron de cuántas',
    `Cuatro barras: la proporción que mejora con dosis alta y con dosis baja en cada grupo de edad. En los `
    + `${g0.grupo} la dosis alta mejora ${pct0(g0.alta.pMejora)} por ciento y la baja ${pct0(g0.baja.pMejora)}; `
    + `en los ${g1.grupo}, ${pct0(g1.alta.pMejora)} y ${pct0(g1.baja.pMejora)}. En los dos grupos la dosis alta `
    + 'mejora más, al revés que con los grupos juntos');
}

/* ═══════════ 4 · the formulas, with the rain cell as the example ═══════════ */
export function fCondicional() {
  const m = celdaLluvia();
  const nij = TABLA.celdas[m.i][m.j], nfila = TABLA.filas[m.i], ncol = TABLA.columnas[m.j];
  let s = '', y = 40, parte;
  [parte, y] = seccion(y, 'PROBABILIDAD CONDICIONAL',
    'la probabilidad de A sabiendo que B ocurrió: de los días con B, qué parte tiene A',
    yb => linea(X, yb, [{ t: 'P(A | B)' }, eq], [{ t: 'P(A y B)' }], [{ t: 'P(B)' }],
      [{ t: '=', gap: 20, fill: C.ink2 }])
      + frac(X + measure([{ t: 'P(A | B)' }, eq], FS) + 10 + 118 + 10 + 20 + 40, yb - 7,
        [{ t: 'n', sub: 'AB' }], [{ t: 'n', sub: 'B' }], FS),
    `en el ejemplo: P(siguiente = «${K[m.j]}» | observado = «${F[m.i]}») = ${nij}/${nfila} = ${num(PERFILES.fila[m.i][m.j])}, contra P(siguiente = «${K[m.j]}») = ${ncol}/${TABLA.n} = ${num(TABLA.marginalColumna[m.j])} sin saber nada del día observado`);
  s += parte;
  [parte, y] = seccion(y, 'LO ESPERADO BAJO INDEPENDENCIA',
    'si el día observado no dijera nada del siguiente, cada celda tendría el producto de sus márgenes sobre el total',
    yb => linea(X, yb, [{ t: 'E', sub: 'ij' }, eq], [{ t: 'n', sub: 'i·' }, { t: '·', gap: 6 }, { t: 'n', gap: 6, sub: '·j' }], [{ t: 'n' }], null),
    `en esa celda: ${nfila} · ${ncol} / ${TABLA.n} = ${num(ESPERADAS[m.i][m.j])} pares esperados, y hubo ${nij}`);
  s += parte;
  [parte, y] = seccion(y, 'EL CHI-CUADRADO, CELDA POR CELDA',
    'cuánto se aleja cada celda de lo esperado, en unidades de lo esperado; la suma es el estadístico',
    yb => linea(X, yb, [{ t: 'χ', sup: '2' }, eq, { t: 'Σ', gap: 4, fs: 26, fill: C.ink2 }],
      [{ t: '(O', sub: 'ij' }, { t: '−', gap: 7 }, { t: 'E', gap: 7, sub: 'ij' }, { t: ')', sup: '2' }],
      [{ t: 'E', sub: 'ij' }], null) + idx(X + measure([{ t: 'χ', sup: '2' }, eq], FS) + 8, yb + 20, 'i, j'),
    `en esa celda: (${nij} − ${num(ESPERADAS[m.i][m.j])})² / ${num(ESPERADAS[m.i][m.j])} = ${num(CHI2.celdas[m.i][m.j])}; las ${F.length * K.length} celdas suman χ² = ${num(CHI2.total)}`);
  s += parte;
  [parte, y] = seccion(y, 'UNA MEDIDA EN [0, 1]',
    'la V de Cramér: el chi-cuadrado sobre lo máximo que podría valer con estas filas y columnas',
    yb => linea(X, yb, [{ t: 'V' }, eq, { t: '√', gap: 4, fs: 26 }],
      [{ t: 'χ', sup: '2' }], [{ t: 'n · min(filas − 1, columnas − 1)' }], null),
    `en el ejemplo: √(${num(CHI2.total)} / (${TABLA.n} · ${Math.min(F.length, K.length) - 1})) = ${num(CHI2.v)}. Es una medida de cuánto se asocian el cielo de un día y el del siguiente, no una prueba: los días son inventados.`);
  s += parte;
  return svg(W, y,
    'Cuatro fórmulas: la probabilidad condicional como la probabilidad conjunta sobre la del '
    + 'condicionante, o el recuento de la celda sobre el margen; la frecuencia esperada bajo '
    + 'independencia como el producto de los márgenes sobre el total; el chi-cuadrado como la '
    + 'suma sobre las celdas de la diferencia al cuadrado sobre lo esperado; y la V de Cramér '
    + 'como la raíz del chi-cuadrado sobre n por el menor de filas menos uno y columnas menos uno. '
    + 'Con la celda de lluvia el día observado y lluvia el día siguiente como ejemplo', s);
}
