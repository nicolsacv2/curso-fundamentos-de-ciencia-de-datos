import { C, svg, txt, wrap } from '../../../svg/kit.js';
import { ESTADOS, TABLA, ESPERADAS, CHI2, CA } from '../data/lluvia.js';
import { dot, num, plano, cuadrado, apilar, row, frac, measure, label } from './shared.js';

/* Block 1 of session 7 · the simple correspondence analysis of the rain table. Every id
   carries the ar-s7-b1- prefix. Every coordinate comes out of src/sessions/s07/data/
   lluvia.js, written by scripts/ejemplo_lluvia.py after asserting Σλ = χ²/n, the
   transition formula for every row and column, Σctr = 1 and Σcos² = 1. Rows are the sky
   of the observed day, columns the sky of the day after. */

const W = 980;
const FS = 20;
const n3 = v => num(v).replace('-', '−');
const eq = { t: '= ', gap: 12, fill: C.ink2 };
const X = 400;
const idx = (x, y, t) => txt(x, y, t, { fs: 11, ff: 'serif', fill: C.ink3 });
const COL_FILA = C.ask, COL_COL = '#c98500';

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

/* ═══════════ 1 · profile, centroid, mass, distance, inertia ═══════════ */
export function fPerfiles() {
  const f0 = CA.filas[0];
  let s = '', y = 40, parte;
  [parte, y] = seccion(y, 'EL PERFIL DE UNA FILA', 'la fila dividida por su suma: es la probabilidad condicional de la entrada, y es un punto con tantas coordenadas como columnas · c_j es el perfil promedio: la columna sobre el total, el centroide',
    yb => {
      /* Three equalities on one line, each fraction placed after the text before it, so
         the line cannot overlap however the glyph widths are estimated. */
      const arriba = (top, bottom) => Math.max(measure(top, FS), measure(bottom, FS)) + 26;
      const rij = [{ t: 'r', sub: 'ij' }, eq];
      const masa = [{ t: 'masa', gap: 22, fill: C.ink2, fs: 15 }, { t: 'm', gap: 10, sub: 'i' }, eq];
      const cen = [{ t: 'centroide', gap: 22, fill: C.ink2, fs: 15 }, { t: 'c', gap: 10, sub: 'j' }, eq];
      let cur = X, out = '';
      out += row(cur, yb, rij, FS); cur += measure(rij, FS) + 10;
      let w = arriba([{ t: 'n', sub: 'ij' }], [{ t: 'n', sub: 'i·' }]);
      out += frac(cur + w / 2, yb - 7, [{ t: 'n', sub: 'ij' }], [{ t: 'n', sub: 'i·' }], FS); cur += w + 10;
      out += row(cur, yb, masa, FS); cur += measure(masa, FS) + 10;
      w = arriba([{ t: 'n', sub: 'i·' }], [{ t: 'n' }]);
      out += frac(cur + w / 2, yb - 7, [{ t: 'n', sub: 'i·' }], [{ t: 'n' }], FS); cur += w + 10;
      out += row(cur, yb, cen, FS); cur += measure(cen, FS) + 10;
      w = arriba([{ t: 'n', sub: '·j' }], [{ t: 'n' }]);
      out += frac(cur + w / 2, yb - 7, [{ t: 'n', sub: '·j' }], [{ t: 'n' }], FS);
      return out;
    },
    `en el ejemplo, «observado ${f0.nivel}»: perfil (${f0.perfil.map(num).join(', ')}), masa ${f0.n}/${TABLA.n} = ${num(f0.masa)}. El centroide es el perfil promedio, el margen de columna sobre el total: c = (${CA.centroide.map(num).join(', ')}).`);
  s += parte;
  [parte, y] = seccion(y, 'LA DISTANCIA CHI-CUADRADO', 'entre dos perfiles: cada diferencia al cuadrado, dividida por el centroide de esa columna, c_j — las columnas raras pesan más',
    yb => linea(X, yb, [{ t: 'd', sup: '2' }, { t: '(i, i′)' }, eq, { t: 'Σ', gap: 4, fs: 26, fill: C.ink2 }],
      [{ t: '(r', sub: 'ij' }, { t: '−', gap: 7 }, { t: 'r', gap: 7, sub: 'i′j' }, { t: ')', sup: '2' }],
      [{ t: 'c', sub: 'j' }], null) + idx(X + measure([{ t: 'd', sup: '2' }, { t: '(i, i′)' }, eq], FS) + 8, yb + 20, 'j'),
    `en el ejemplo, entre «observado ${CA.distancia.filas[0]}» y «observado ${CA.distancia.filas[1]}»: d² = ${num(CA.distancia.d2)}, d = ${num(CA.distancia.d)}`);
  s += parte;
  [parte, y] = seccion(y, 'LA INERCIA TOTAL', 'la dispersión de la nube de perfiles, pesada por las masas, es el chi-cuadrado de la entrada sobre n',
    yb => linea(X, yb, [{ t: 'I', fs: 24 }, eq, { t: 'Σ', gap: 4, fs: 26, fill: C.ink2 }, { t: 'λ', gap: 6, sub: 'k' }, { t: '=', gap: 14, fill: C.ink2 }],
      [{ t: 'χ', sup: '2' }], [{ t: 'n' }], [{ t: 'y hay', gap: 30, fill: C.ink2, fs: 15 }, { t: 'min(filas, columnas) − 1', gap: 10 }, { t: 'ejes', gap: 10, fill: C.ink2, fs: 15 }])
      + idx(X + measure([{ t: 'I', fs: 24 }, eq], FS) + 8, yb + 20, 'k'),
    `en el ejemplo: ${num(CHI2.total)} / ${TABLA.n} = ${num(CA.inerciaTotal)}, repartida en ${CA.ejes} ejes: λ = (${CA.autovalores.map(num).join(', ')}), que suman ${num(CA.inerciaTotal)}`);
  s += parte;
  return svg(W, y,
    'Tres fórmulas: el perfil de una fila es cada celda sobre la suma de la fila, y su masa la '
    + 'suma de la fila sobre el total; la distancia chi-cuadrado entre dos perfiles es la suma de '
    + 'las diferencias al cuadrado divididas por el centroide de cada columna; y la inercia total '
    + 'es el chi-cuadrado sobre n, que los valores propios suman. Con los días del ejemplo', s);
}

/* ═══════════ 1b · from the distances to the map ═══════════
   Three steps, the same three block 2 draws for the MCA: the cloud (a profile per row,
   a mass per point, the chi-square rule), the axes (the direction that keeps the most
   inertia — the PCA gesture of session 6 on another cloud with another rule), and the
   coordinates (projections, so that a distance on the map approximates the chi-square
   one and equals it when every axis is summed). Verified on the farthest pair of rows. */
export function fSalto() {
  const sl = CA.salto;
  let s = '', y = 40, parte;
  [parte, y] = seccion(y, 'LA NUBE', 'cada fila es un punto: su perfil, con tantas coordenadas como columnas; pesa lo que su masa; entre dos puntos se mide con la distancia chi-cuadrado',
    yb => linea(X, yb, [{ t: 'r', sub: 'i' }, eq, { t: '(r', sub: 'i1' }, { t: ', …, r', sub: 'iJ' }, { t: ')' },
      { t: 'masa', gap: 26, fill: C.ink2, fs: 15 }, { t: 'm', gap: 10, sub: 'i' }, eq], [{ t: 'n', sub: 'i·' }], [{ t: 'n' }], null),
    `en el ejemplo: ${CA.filas.length} puntos con ${CA.columnas.length} coordenadas cada uno, con masas (${CA.filas.map(r => num(r.masa)).join(', ')}), y la regla chi-cuadrado de arriba`);
  s += parte;
  const ll = ESTADOS.indexOf('lluvia');
  [parte, y] = seccion(y, 'LOS RESIDUOS', 'en cada celda, lo observado menos lo esperado en proporciones, sobre la raíz de lo esperado: el chi-cuadrado de la entrada, con signo y sobre n',
    yb => linea(X, yb, [{ t: 's', sub: 'ij' }, eq],
      [{ t: 'p', sub: 'ij' }, { t: '−', gap: 7 }, { t: 'r', gap: 7, sub: 'i' }, { t: 'c', gap: 4, sub: 'j' }],
      [{ raiz: [{ t: 'r', sub: 'i' }, { t: 'c', gap: 4, sub: 'j' }] }],
      [{ t: 'con', gap: 30, fill: C.ink2, fs: 15 }, { t: 'p', gap: 10, sub: 'ij' }, eq, { t: 'n', sub: 'ij' }, { t: '/ n', gap: 4 }]),
    `en el ejemplo, la celda «${ESTADOS[ll]} → ${ESTADOS[ll]}»: s = ${n3(CA.residuos[ll][ll])}; los ${CA.residuos.length * CA.residuos[0].length} residuos al cuadrado suman ${num(CA.traza)} = χ²/n`);
  s += parte;
  [parte, y] = seccion(y, 'LA MATRIZ Y SUS VALORES PROPIOS', 'los residuos cruzados, columna contra columna; su traza es χ²/n. Se diagonaliza como el PCA de la sesión 6 diagonalizó la matriz de correlaciones: los valores propios son la inercia de cada eje',
    yb => linea(X, yb, [{ t: 'M' }, eq, { t: 'S', sup: 'T' }, { t: 'S', gap: 2 }, { t: 'traza(M)', gap: 30 }, eq, { t: 'Σ', gap: 4, fs: 26, fill: C.ink2 },
      { t: 's', gap: 4, sub: 'ij', sup: '2' }, { t: '=', gap: 14, fill: C.ink2 }], [{ t: 'χ', sup: '2' }], [{ t: 'n' }],
      [{ t: '=', gap: 4, fill: C.ink2 }, { t: 'Σ', gap: 8, fs: 26, fill: C.ink2 }, { t: 'λ', gap: 4, sub: 'k' }]),
    `en el ejemplo: diagonal (${CA.matriz.map((fila, k) => num(fila[k])).join(', ')}), traza ${num(CA.traza)}; los valores propios son (${CA.autovaloresConTrivial.map(num).join(', ')}) y suman ${num(CA.traza)}. El cero es el del centrado: los residuos suman cero por fila y por columna, y esa dirección no reparte nada`);
  s += parte;
  [parte, y] = seccion(y, 'LOS EJES', 'la dirección en la que la nube más se estira —la que más inercia conserva, pesando cada punto por su masa—; después la siguiente, perpendicular. El gesto del PCA de la sesión 6, sobre esta nube y con esta regla',
    yb => linea(X, yb, [{ t: 'λ', sub: '1' }, { t: '≥', gap: 8 }, { t: 'λ', gap: 8, sub: '2' }, { t: '≥ … ≥', gap: 8 }, { t: 'λ', gap: 8, sub: 'K' },
      { t: 'K', gap: 40 }, eq, { t: 'min(filas, columnas) − 1' }], null, null, null),
    `en el ejemplo: K = ${CA.ejes}, λ = (${CA.autovalores.map(num).join(', ')}); el eje 1 conserva ${num(CA.porcentajes[0])} % de la inercia y el eje 2 el resto`);
  s += parte;
  [parte, y] = seccion(y, 'LAS COORDENADAS', 'la coordenada de una fila en un eje es su proyección sobre él; la distancia entre dos filas en el mapa aproxima la chi-cuadrado, y es exacta si se suman todos los ejes',
    /* The letters are defined on their own line BEFORE the formula that uses them: a
       formula that opens with f_ik unexplained reads as a symbol, not as «the
       coordinate», and the wall asked what it was. */
    yb => row(X, yb, [{ t: 'f', sub: 'ik' }, eq, { t: 'coordenada de la fila i en el eje k', fill: C.ink2, fs: 15 },
      { t: 'g', gap: 26, sub: 'jk' }, eq, { t: 'la de la columna j en el eje k', fill: C.ink2, fs: 15 }], FS)
      + linea(X, yb + 40, [{ t: 'd', sup: '2' }, { t: '(i, i′)' }, { t: '≈', gap: 8, fill: C.ink2 }, { t: 'Σ', gap: 6, fs: 26, fill: C.ink2 }, { t: '(f', gap: 4, sub: 'ik' }, { t: '−', gap: 7 }, { t: 'f', gap: 7, sub: 'i′k' }, { t: ')', sup: '2' },
        { t: 'con igualdad si k recorre los K ejes', gap: 30, fill: C.ink2, fs: 15 }], null, null, null)
      + idx(X + measure([{ t: 'd', sup: '2' }, { t: '(i, i′)' }, { t: '≈', gap: 8 }], FS) + 10, yb + 60, 'k'),
    `en el ejemplo, entre «observado ${sl.par[0]}» y «observado ${sl.par[1]}»: por los perfiles d = ${num(sl.dPerfiles)}; por las coordenadas, ${num(sl.dCoord)}. ${sl.retenido === 100 ? `Iguales: los ${sl.ejes} ejes retienen el 100 %, así que el mapa no aproxima, dibuja.` : `Cerca: el mapa retiene ${num(sl.retenido)} %.`}`);
  s += parte;
  return svg(W, y,
    'Los cinco pasos de las distancias al mapa: la nube de perfiles con sus masas y la '
    + 'distancia chi-cuadrado; los residuos estandarizados de cada celda; su matriz cruzada, '
    + 'cuya traza es el chi-cuadrado sobre n y cuyos valores propios, incluido el cero del '
    + 'centrado, son la inercia de cada eje; los ejes, ordenados por la inercia que conservan, tantos como el '
    + 'menor de filas y columnas menos uno; y las coordenadas como proyecciones, con la distancia '
    + 'entre dos filas en el mapa aproximando la chi-cuadrado y coincidiendo con ella cuando se '
    + `suman todos los ejes. Verificado sobre «observado ${sl.par[0]}» y «observado ${sl.par[1]}»`, s);
}

/* ═══════════ 2 · transition, contribution, cos² ═══════════ */
export function fTransicionCA() {
  const t = CA.transicion, ti = CA.transicionInversa;
  const f0 = CA.filas[0];
  let s = '', y = 40, parte;
  [parte, y] = seccion(y, 'DE LAS COLUMNAS A LA FILA', 'una fila está en el promedio de las columnas, pesado por su perfil r_ij, dilatado por 1/√λ — y viceversa, con el perfil de columna c_ji = n_ij / n_·j: la columna repartida entre las filas. No es el c_j de la distancia, que es una sola cifra por columna',
    yb => {
      let cur = X + measure([{ t: 'f', sub: 'ik' }, eq], FS) + 10
        + Math.max(measure([{ t: '1' }], FS), measure([{ raiz: [{ t: 'λ', sub: 'k' }] }], FS)) + 26 + 10 + 20;
      return linea(X, yb, [{ t: 'f', sub: 'ik' }, eq], [{ t: '1' }], [{ raiz: [{ t: 'λ', sub: 'k' }] }], [{ t: '·', gap: 4 }])
        + row(cur, yb, [{ t: 'Σ', fs: 26, fill: C.ink2 }, { t: 'r', gap: 6, sub: 'ij' }, { t: 'g', gap: 6, sub: 'jk' }], FS)
        + idx(cur + 4, yb + 20, 'j')
        + row(cur + 120, yb, [{ t: 'g', sub: 'jk' }, eq], FS)
        + frac(cur + 120 + measure([{ t: 'g', sub: 'jk' }, eq], FS) + 40, yb - 7, [{ t: '1' }], [{ raiz: [{ t: 'λ', sub: 'k' }] }], FS)
        + row(cur + 120 + measure([{ t: 'g', sub: 'jk' }, eq], FS) + 80, yb, [{ t: '·', gap: 4 }, { t: 'Σ', gap: 8, fs: 26, fill: C.ink2 }, { t: 'c', gap: 6, sub: 'ji' }, { t: 'f', gap: 6, sub: 'ik' }], FS)
        + idx(cur + 120 + measure([{ t: 'g', sub: 'jk' }, eq], FS) + 108, yb + 20, 'i');
    },
    `en el ejemplo, ida: «observado ${t.fila}» en el eje ${t.eje}: ${t.sumandos.map(x => `${num(x.perfil)}·(${n3(x.coord)})`).join(' + ')} = ${n3(t.promedioPonderado)}, y ${n3(t.promedioPonderado)}/${num(t.raizLambda)} = ${n3(t.dilatado)}: su coordenada publicada es ${n3(t.coordPublicada)}. Vuelta: «siguiente ${ti.columna}» en el eje ${ti.eje}: ${ti.sumandos.map(x => `${num(x.perfil)}·(${n3(x.coord)})`).join(' + ')} = ${n3(ti.promedioPonderado)}, y ${n3(ti.promedioPonderado)}/${num(ti.raizLambda)} = ${n3(ti.dilatado)}: su coordenada publicada es ${n3(ti.coordPublicada)}`);
  s += parte;
  [parte, y] = seccion(y, 'CONTRIBUCIÓN Y COSENO CUADRADO', 'quién construyó el eje, y qué tan fiel es la posición de cada punto en él; las mismas dos herramientas para filas y para columnas',
    yb => linea(X, yb, [{ t: 'ctr', sub: 'ik' }, eq], [{ t: 'm', sub: 'i' }, { t: 'f', gap: 6, sub: 'ik', sup: '2' }], [{ t: 'λ', sub: 'k' }],
      [{ t: 'cos', gap: 40, sup: '2', sub: 'ik' }, eq])
      + frac(X + 430, yb - 7, [{ t: 'f', sub: 'ik', sup: '2' }], [{ t: 'd', sup: '2' }, { t: '(i, centroide)' }], FS),
    `en el ejemplo, «observado ${f0.nivel}» en el eje 1: ${num(f0.masa)} · (${n3(f0.coord[0])})² / ${num(CA.autovalores[0])} = ${num(f0.ctr[0] / 100)}, es decir ${num(f0.ctr[0])} % del eje; cos² ${num(f0.cos2[0])}. El aporte promedio de una fila es 1/${CA.filas.length} = ${num(CA.aportePromedioFilas)} %.`);
  s += parte;
  return svg(W, y,
    'Las fórmulas de transición en las dos direcciones — la coordenada de una fila es su perfil '
    + 'por las coordenadas de las columnas, dilatado por uno sobre la raíz del valor propio, y la '
    + 'de una columna igual con su perfil por las filas —, y la contribución y el coseno cuadrado '
    + 'de un punto a un eje. Verificadas sobre la primera fila de la tabla del ejemplo', s);
}

/* ═══════════ 3 · the map: rows and columns in one plane ═══════════ */
export function mapaCA() {
  const L = 440, xa = 300, ya = 56, H = ya + L + 96;
  const todos = [...CA.filas.map(f => f.coord), ...CA.columnas.map(c => c.coord)];
  const lim = Math.ceil(Math.max(...todos.flatMap(c => c.slice(0, 2).map(Math.abs))) * 10) / 10 + 0.15;
  const { sx, sy, b: ejes } = plano(xa, ya, L, [lim, lim], CA.porcentajes);
  let b = ejes;
  const rotulos = [];
  CA.filas.forEach(f => {
    const x = sx(f.coord[0]), y = sy(f.coord[1]);
    b += dot(x, y, 6, COL_FILA, { op: 0.9 });
    rotulos.push({ x: x + 10, y: y + 4, t: `observado: ${f.nivel} (${f.n})`, fill: COL_FILA, ancho: 140 });
  });
  CA.columnas.forEach((c, k) => {
    const x = sx(c.coord[0]), y = sy(c.coord[1]);
    b += cuadrado(x, y, 12, COL_COL, { op: 0.95 });
    rotulos.push({ x: x + 10, y: y + 4, t: `siguiente: ${c.nivel} (${c.n})`, fill: COL_COL, ancho: 140 });
    /* the cell this pair draws: observed X → next X, observed against expected. A third
       line under the pair, stacked by apilar() like the other two. */
    rotulos.push({ x: x + 10, y: y + 4, t: `${TABLA.celdas[k][k]} pares · esperados ${num(ESPERADAS[k][k])}`, fill: C.ink3, ancho: 140 });
  });
  apilar(rotulos, 13).forEach(r => b += txt(r.x, r.y, r.t, { fs: 11, fill: r.fill }));

  b += txt(30, 28, 'EL DÍA OBSERVADO Y EL DÍA SIGUIENTE EN EL MISMO PLANO', { fs: 11, fill: C.ask, ls: 1.8 });
  b += dot(36, 56, 6, COL_FILA, { op: 0.9 });
  b += txt(50, 60, 'filas: el cielo del día observado, con sus días', { fs: 11, fill: C.ink2 });
  b += cuadrado(36, 74, 12, COL_COL);
  b += txt(50, 78, 'columnas: el cielo del día siguiente, con sus días', { fs: 11, fill: C.ink2 });
  b += txt(50, 94, 'bajo cada pareja: su celda de la diagonal, pares y esperados', { fs: 11, fill: C.ink3 });
  wrap(`Una fila cerca de una columna: esa combinación tuvo más días de los esperados. Los dos ejes retienen ${num(CA.acumulado[1])} % de la inercia: con tres filas y tres columnas el plano lo dibuja todo, y el eje 1 solo lleva ${num(CA.porcentajes[0])} %.`, 30)
    .forEach((l, i) => b += txt(30, 120 + i * 15, l, { fs: 11, fill: C.ink3 }));
  const pie = wrap('Filas y columnas comparten los ejes por las fórmulas de transición: cada una está en el promedio ponderado de las otras, dilatado. La distancia entre una fila y una columna no se lee como una regla; se lee la dirección.', 88)
    .map((l, i) => txt(xa, ya + L + 46 + i * 17, l, { fs: 12, fill: C.ink2 })).join('');
  return svg(W, H,
    'El plano de los dos ejes del análisis de correspondencias del cielo del día observado contra el '
    + `del día siguiente: los ${CA.filas.length} estados del día observado como círculos y los ${CA.columnas.length} del siguiente `
    + `como cuadrados, cada uno con su número de días y, bajo cada pareja, la celda de la diagonal `
    + `observada contra esperada. El eje 1 retiene ${num(CA.porcentajes[0])} por `
    + `ciento y el eje 2, ${num(CA.porcentajes[1])}`, b + pie);
}
