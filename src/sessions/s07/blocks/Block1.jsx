import { Panel, Task, Cards, Card, Diagram, Pair, Prose, List, NumTable }
  from '../../../components/content/index.jsx';
import { ESTADOS, TABLA, PERFILES, ESPERADAS, CHI2, CA } from '../data/lluvia.js';
import { fPerfiles, fSalto, fTransicionCA, mapaCA } from '../figures/block1.js';
import { UMBRAL_COS2 } from '../figures/shared.js';

/* Block 1 of session 7 · simple correspondence analysis. The same rain table the entrada
   read, now drawn: each row profile is a point, the chi-square distance is the ruler, the
   inertia is χ²/n, and rows and columns share a plane through the transition formulas.
   It teaches, on the sky of today against the sky of tomorrow, every piece the MCA of
   block 2 will reuse on the indicator matrix.

   Every number is interpolated from src/sessions/s07/data/lluvia.js. Nothing is computed
   here, and no number is typed.

   The two variables are «día observado» and «día siguiente», as in the entrada. Two
   sentences below depend on how the counted table came out and are written for both
   outcomes: whether axis 1 alone makes the table «casi una línea» (CASI_LINEA), and
   whether it opposes one state to one state or one to two. */

/* Share of inertia above which axis 1 alone is called «casi una línea». A decision, so
   it is a named constant and the sentence changes when the data cross it. */
const CASI_LINEA = 90;

const f = v => String(v).replace('.', ',').replace('-', '−');
const pct = v => `${f(v)} %`;
const lista = xs => xs.map((x, i, a) =>
  <span key={String(x)}>{i ? (i === a.length - 1 ? ' y ' : ', ') : ''}<b>{x}</b></span>);

const R = ESTADOS, K = ESTADOS;
const t = CA.transicion;
const ti = CA.transicionInversa;
const ultima = R.length - 1;
/* Who names axis 1: the rows and the columns above their average share. */
const filasNombran = CA.filas.filter(r => r.ctr[0] > CA.aportePromedioFilas);
const colsNombran = CA.columnas.filter(c => c.ctr[0] > CA.aportePromedioColumnas);
const lado = x => Math.sign(x.coord[0]);

/* ── The five cases «Aplicado al cielo» reads, every one chosen from the data ──
   Nothing below names a state: the closest pair, the farthest pair, the point nearest
   the centre and the cell of every pair come out of what the script published, so a
   regenerated year moves the cases with it. */
const salto = CA.salto;
const parCerca = CA.distancias.filas[0];
const parLejos = CA.distancias.filas[CA.distancias.filas.length - 1];
const parCols = CA.distancias.columnas[0];
const perfilDe = nivel => PERFILES.fila[R.indexOf(nivel)].map(f).join(', ');
const perfilColDe = nivel => PERFILES.columna[K.indexOf(nivel)].map(f).join(', ');
/* each state with its homonymous column: the diagonal cell, and whether the two points
   sit on the same side of axis 1 */
const homonimas = R.map((nivel, k) => ({
  nivel, obs: TABLA.celdas[k][k], esp: ESPERADAS[k][k],
  mismoLado: lado(CA.filas[k]) === lado(CA.columnas[k]),
}));
const todasMismoLado = homonimas.every(h => h.mismoLado);
const porEncima = homonimas.filter(h => h.obs > h.esp);
/* the row nearest the centre, and the closest column of ANOTHER state on its side */
const norma = p => Math.hypot(p.coord[0], p.coord[1]);
const filaCentro = CA.filas.slice().sort((a, b) => norma(a) - norma(b))[0];
const iC = R.indexOf(filaCentro.nivel);
const colOtra = CA.columnas
  .filter(c => c.nivel !== filaCentro.nivel && lado(c) === lado(filaCentro))
  .sort((a, b) => Math.hypot(a.coord[0] - filaCentro.coord[0], a.coord[1] - filaCentro.coord[1])
    - Math.hypot(b.coord[0] - filaCentro.coord[0], b.coord[1] - filaCentro.coord[1]))[0];
const jO = colOtra ? K.indexOf(colOtra.nivel) : -1;
/* how far above (or below) expected the two cells of case 4 are, as a ratio */
const exceso = (i, j) => TABLA.celdas[i][j] / ESPERADAS[i][j];
/* The two ends of axis 1, by sign: what the axis opposes. */
const extremoPos = CA.filas.filter(r => r.coord[0] > 0).map(r => r.nivel);
const extremoNeg = CA.filas.filter(r => r.coord[0] < 0).map(r => r.nivel);
/* What axis 1 opposes, said for both shapes the counted table can take: one state
   against one, or one against the other two. Sides by sign, so it does not care which
   way the axis came out. */
const opone = extremoPos.length === 1 && extremoNeg.length === 1
  ? `de «${extremoNeg[0]}» a «${extremoPos[0]}»`
  : `${extremoNeg.map(x => `«${x}»`).join(' y ')} a un lado, ${extremoPos.map(x => `«${x}»`).join(' y ')} al otro`;

export default function Block1({ id, tabId, block }) {
  return (
    <Panel id={id} tabId={tabId} block={block}>
      <Task label="Para empezar · 2 minutos" big="La misma tabla, ahora como dibujo.">
        <p>La entrada leyó la tabla del <b>cielo de un día contra el del día siguiente</b> número a
          número: recuentos, perfiles, esperadas, χ². Este bloque la <b>dibuja</b>: cada fila y
          cada columna van a ser un punto en un plano, y las que van juntas en la tabla van a
          quedar cerca. El método se llama <b>análisis de correspondencias</b>, y es el mismo
          algoritmo del PCA de la sesión 6 con otra manera de medir distancias. Todo lo que
          aprendan aquí lo vuelven a usar en el bloque siguiente, sobre muchas variables a la
          vez.</p>
      </Task>

      <NumTable
        cols={['observado \\ siguiente', ...K, 'suma']}
        rows={R.map((r, i) => [r, ...TABLA.celdas[i], TABLA.filas[i]])}
        pie={['suma', ...TABLA.columnas, TABLA.n]}
        caption={<>La tabla de la entrada, tal cual: {TABLA.n} días inventados, {R.length} filas y{' '}
          {K.length} columnas.</>}
      />

      <h3>Los perfiles son la nube</h3>
      <Prose>
        <p>Vuelvan a los perfiles de fila. Cada uno tiene <b>{K.length} números</b> que suman uno:
          es un <b>punto con {K.length} coordenadas</b>. Las {R.length} filas son {R.length} puntos
          en un espacio de {K.length} dimensiones — una nube pequeña. El <b>perfil promedio</b>,
          que es el margen de columna ({CA.centroide.map(f).join(', ')}), es el <b>centroide</b>:
          el centro de la nube. Y cada punto pesa según cuántos días tiene detrás: su <b>masa</b>,
          la suma de la fila sobre el total. «Observado {R[0]}» pesa {CA.filas[0].n}/{TABLA.n} ={' '}
          {f(CA.filas[0].masa)}; «observado {R[ultima]}», {CA.filas[ultima].n}/{TABLA.n} ={' '}
          {f(CA.filas[ultima].masa)}.</p>
      </Prose>

      <NumTable
        cols={['observado', 'días', 'masa', ...K.map(k => `perfil · siguiente ${k}`)]}
        rows={CA.filas.map(r => [r.nivel, r.n, f(r.masa), ...r.perfil.map(f)])}
        caption={<>La nube: {R.length} puntos, cada uno con su masa y sus {K.length} coordenadas. La
          última fila de la entrada —el centroide— es el promedio de estas, pesado por las
          masas.</>}
      />

      <h3>La distancia chi-cuadrado</h3>
      <Prose>
        <p>¿A qué distancia están dos perfiles? No a la de siempre. En el análisis de
          correspondencias, cada diferencia al cuadrado <b>se divide por el centroide de esa
          columna</b>: una diferencia en una columna rara —pocos días— pesa más que la misma
          diferencia en una columna común. Es la misma idea del χ² de la entrada, que dividía por
          lo esperado, y por eso se llama <b>distancia chi-cuadrado</b>. Entre «observado{' '}
          {CA.distancia.filas[0]}» y «observado {CA.distancia.filas[1]}»: d² = <b>{f(CA.distancia.d2)}</b>,
          d = {f(CA.distancia.d)}.</p>
        <p>Y la <b>inercia total</b> de la nube —cuánto se dispersan los perfiles alrededor del
          centroide, pesados por sus masas— es exactamente <b>χ²/n = {f(CHI2.total)}/{TABLA.n} ={' '}
          {f(CA.inerciaTotal)}</b>. El estadístico de la entrada era una geometría. Hay{' '}
          <b>{CA.ejes} ejes</b> —el menor de filas y columnas, menos uno—, con valores propios{' '}
          {lista(CA.autovalores.map(f))}, que suman {f(CA.inerciaTotal)}.</p>
      </Prose>

      <Diagram fig={fPerfiles}>
        Perfil, masa y centroide; la distancia chi-cuadrado; y la inercia como χ² sobre n, con
        los días del ejemplo.
      </Diagram>

      <Cards cols="c2">
        {CA.autovalores.map((l, k) => (
          <Card key={k} k={`eje ${k + 1}`} t={`λ = ${f(l)}`}>
            {pct(CA.porcentajes[k])} de la inercia · acumulado {pct(CA.acumulado[k])}
          </Card>
        ))}
      </Cards>

      <h3>De las distancias al mapa</h3>
      <Prose>
        <p><b>La nube.</b> Ya está construida: cada fila es un punto con {K.length} coordenadas
          —su perfil—, pesa lo que su masa, y la regla para medir entre dos puntos es la
          distancia chi-cuadrado. Lo que falta es pasar de esa nube a un dibujo.</p>
        <p><b>Los ejes.</b> Es el mismo gesto que el PCA de la sesión 6: buscar la dirección en la
          que la nube <b>más se estira</b> —la que más inercia conserva— y después la siguiente,
          perpendicular a la primera. Lo que cambia es la nube (perfiles en vez de personas), el
          peso (cada punto por su masa) y la regla (chi-cuadrado en vez de la distancia de
          siempre). Lo que no cambia es el gesto. Y el número de cada eje, su <b>valor
          propio</b>, sale en tres pasos. Primero, los <b>residuos estandarizados</b>: en cada
          celda, lo observado menos lo esperado, en proporciones, sobre la raíz de lo esperado.
          Es el χ² de la entrada con signo y sobre n: sus cuadrados suman <b>{f(CA.traza)}</b>,
          que es χ²/n. Están en la tabla de abajo. Segundo, la <b>matriz de residuos
          cruzados</b>, columnas contra columnas: en su diagonal, cuánto residuo acumula cada
          columna ({lista(CA.matriz.map((fila, k) => f(fila[k])))}), y su traza —la suma de esa
          diagonal— es otra vez {f(CA.traza)}. Tercero, <b>diagonalizarla</b>, exactamente lo que
          el PCA hizo con la matriz de correlaciones: el mayor valor propio,{' '}
          <b>{f(CA.autovaloresConTrivial[0])}</b>, es la inercia de la dirección que más
          conserva; el siguiente, <b>{f(CA.autovaloresConTrivial[1])}</b>, la de la perpendicular;
          y el tercero vale <b>{f(CA.autovaloresConTrivial[CA.autovaloresConTrivial.length - 1])}</b>,
          porque los residuos suman cero en cada fila y en cada columna —el centrado— y esa
          dirección no tiene nada que repartir. Los tres suman {f(CA.traza)}, y por eso hay{' '}
          <b>{CA.ejes} ejes</b> y no {K.length}: el menor de filas y columnas menos uno. De los
          vectores propios salen las coordenadas de las columnas y, por la transición de más
          abajo, las de las filas.</p>
        <p><b>Las coordenadas.</b> La coordenada de una fila en un eje es su <b>proyección</b>{' '}
          sobre él: esa es su <b>f_ik</b>, la f de la fila i en el eje k, el número que el mapa
          dibuja; la de una columna se llama g_jk. Por eso la distancia entre dos filas{' '}
          <b>en el mapa</b> aproxima su distancia
          chi-cuadrado, y es exacta cuando se suman todos los ejes. Se comprueba sobre las dos
          filas más lejanas, «observado {salto.par[0]}» y «observado {salto.par[1]}»: por los
          perfiles, d = <b>{f(salto.dPerfiles)}</b>; por las coordenadas, <b>{f(salto.dCoord)}</b>.{' '}
          {salto.retenido === 100
            ? <>Iguales, porque los {salto.ejes} ejes retienen el 100 %: aquí el mapa no aproxima, dibuja.</>
            : <>Cerca, porque los ejes del mapa retienen el {f(salto.retenido)} %.</>}</p>
      </Prose>

      <NumTable
        cols={['residuo · observado \\ siguiente', ...K]}
        rows={R.map((r, i) => [r, ...CA.residuos[i].map(f)])}
        marca={(i, j) => CA.residuos[i][j] > 0}
        caption={<>Los residuos estandarizados del ejemplo, con signo: positivo donde hubo más pares
          de los esperados, negativo donde menos. Cada fila y cada columna suman cero, y los
          nueve cuadrados suman {f(CA.traza)} = χ²/n.</>}
      />

      <Diagram fig={fSalto}>
        Cinco peldaños: la nube, los residuos, la matriz y sus valores propios, los ejes, las
        coordenadas. El bloque siguiente da el mismo salto sobre otra tabla.
      </Diagram>

      <h3>Filas y columnas en el mismo plano</h3>
      <Prose>
        <p><b>Dos nubes.</b> Hasta aquí dibujamos una sola nube: los {R.length} perfiles de fila,
          cada uno con {K.length} coordenadas —una por columna—, su masa y la distancia
          chi-cuadrado. Pero la tabla tiene otra nube igual de legítima: los {K.length} perfiles
          de <b>columna</b>, cada uno con {R.length} coordenadas —una por fila—, con la masa de su
          columna y la misma regla. Son dos nubes en dos espacios distintos, y de entrada no hay
          ninguna razón para dibujarlas en el mismo papel.</p>
        <p><b>Los mismos ejes.</b> Si se le da el salto de arriba a cada nube por separado, salen
          los mismos valores propios: {lista(CA.autovalores.map(f))}. No es casualidad: las dos
          nubes son la misma tabla leída por filas o por columnas, y la inercia que una reparte en
          sus ejes es la que la otra reparte en los suyos. Cada eje de la nube de filas tiene su
          pareja en la nube de columnas con la misma inercia, así que hay <b>un solo juego de
          ejes</b> que dibujar.</p>
        <p><b>La transición.</b> Y las coordenadas se corresponden una a una: las filas y las
          columnas comparten el plano por las <b>fórmulas de transición</b>. Cada fila está en el
          promedio de las columnas, pesado por su perfil y dilatado por 1/√λ; cada columna, en el
          promedio de las filas, pesado por su perfil de columna y dilatado igual. Ida: «observado{' '}
          {t.fila}» en el eje {t.eje} es{' '}
          {t.sumandos.map(x => `${f(x.perfil)} · (${f(x.coord)})`).join(' + ')} ={' '}
          <b>{f(t.promedioPonderado)}</b>, y {f(t.promedioPonderado)}/{f(t.raizLambda)} ={' '}
          <b>{f(t.dilatado)}</b>, su coordenada publicada ({f(t.coordPublicada)}). Vuelta:
          «siguiente {ti.columna}» en el eje {ti.eje} es{' '}
          {ti.sumandos.map(x => `${f(x.perfil)} · (${f(x.coord)})`).join(' + ')} ={' '}
          <b>{f(ti.promedioPonderado)}</b>, y {f(ti.promedioPonderado)}/{f(ti.raizLambda)} ={' '}
          <b>{f(ti.dilatado)}</b>, su coordenada publicada ({f(ti.coordPublicada)}). Con la ida y
          la vuelta comprobadas, superponer las dos nubes sobre los mismos ejes no es un truco de
          dibujo: es lo que las fórmulas dicen.</p>
        <p><b>El precio.</b> Entre dos filas, la distancia del mapa es la chi-cuadrado
          {CA.acumulado[1] === 100 ? ' —aquí exacta—' : ' —aproximada por el plano—'}; entre dos
          columnas, también. Entre una fila y una columna <b>no hay distancia</b>: viven en
          espacios distintos y lo único que las une es el promedio ponderado. Por eso una de las
          reglas de lectura de abajo habla de dirección y no de distancia.</p>
      </Prose>

      <Diagram fig={mapaCA}>
        Los cielos del día observado como círculos y los del día siguiente como cuadrados, con su
        número de días. Bajo cada pareja, la celda de la diagonal que dibuja.
      </Diagram>

      <Prose>
        <p>Los {CA.ejes} ejes retienen <b>{pct(CA.acumulado[1])}</b> de la inercia: con tres filas y
          tres columnas hay exactamente dos ejes, así que el plano dibuja la tabla <b>entera</b>,
          sin perder nada. Es la excepción y no la regla; con más filas o columnas el plano
          retiene una parte, y lo que retiene se lee en sus porcentajes.{' '}
          {CA.porcentajes[0] > CASI_LINEA
            ? <>Aquí además el eje 1 lleva {pct(CA.porcentajes[0])} solo: la tabla es <b>casi una
              línea</b>, porque el cielo se ordena —{opone}— y un orden se dibuja en un eje.</>
            : <>Aquí el eje 1 lleva {pct(CA.porcentajes[0])} y el eje 2 el resto: la tabla no es
              una sola línea, y hacen falta los dos ejes para leerla. Lo que opone el eje 1 es{' '}
              {opone}.</>}</p>
      </Prose>

      <Diagram fig={fTransicionCA}>
        Las dos direcciones de la transición, y la contribución y el cos² de un punto.
      </Diagram>

      <h3>Contribución y coseno cuadrado</h3>
      <Prose>
        <p>Las dos herramientas de lectura. La <b>contribución</b> de un punto a un eje —masa por
          coordenada al cuadrado sobre el valor propio— dice qué parte del eje puso ese punto;
          suman 100 por eje. El <b>coseno cuadrado</b> —coordenada al cuadrado sobre la distancia
          al centroide— dice qué tan fiel es la posición del punto en ese eje; suma 1 por punto.
          El aporte promedio de una fila es 1/{R.length} = <b>{pct(CA.aportePromedioFilas)}</b>, y el
          de una columna 1/{K.length} = {pct(CA.aportePromedioColumnas)}.</p>
        <p>Por eso <b>el eje 1 se nombra</b> con las filas {lista(filasNombran.map(r => `«observado ${r.nivel}»`))}{' '}
          y las columnas {lista(colsNombran.map(c => `«siguiente ${c.nivel}»`))}, que superan el
          promedio; las demás lo acompañan sin construirlo. Es un eje del <b>día observado y del
          día siguiente</b> a la vez, y lo que opone es lo que esas filas y columnas oponen:{' '}
          {opone}.</p>
      </Prose>

      <NumTable
        cols={['punto', 'tipo', 'días', 'coord. eje 1', 'ctr eje 1', 'cos² eje 1']}
        rows={[
          ...CA.filas.map(r => [`observado ${r.nivel}`, 'fila · observado', r.n, f(r.coord[0]), pct(r.ctr[0]), f(r.cos2[0])]),
          ...CA.columnas.map(c => [`siguiente ${c.nivel}`, 'columna · siguiente', c.n, f(c.coord[0]), pct(c.ctr[0]), f(c.cos2[0])])
        ]}
        marca={(i, j) => j === 3 && (i < R.length
          ? CA.filas[i].ctr[0] > CA.aportePromedioFilas
          : CA.columnas[i - R.length].ctr[0] > CA.aportePromedioColumnas)}
        caption={<>Contribución y calidad en el eje 1, filas y columnas. Señaladas, las
          contribuciones que superan el aporte promedio de su tipo. Un cos² por debajo de{' '}
          {f(UMBRAL_COS2)} no se interpreta en el plano, como en el protocolo que viene.</>}
      />

      <Pair>
        <Prose>
          <h4>Cómo se lee el mapa</h4>
          <List>
            <li><b>Una fila cerca de una columna:</b> esa fila tiene esa columna <b>más de lo
              esperado</b>. Es la celda observada por encima de la esperada, dibujada. Abajo:
              cada estado con su homónimo.</li>
            <li><b>Dos filas cercanas:</b> perfiles parecidos — reparten igual el cielo del día
              siguiente. Abajo: el par de filas más cercano y el más lejano.</li>
            <li><b>Dos columnas cercanas:</b> vienen de días observados parecidos. Es la misma
              regla leída al revés. Abajo: el par de columnas más cercano.</li>
            <li><b>La distancia entre una fila y una columna no se mide con regla:</b> se lee la
              dirección, por la relación baricéntrica. Cada una está en el promedio de las otras,
              dilatado. Abajo: una fila junto a la columna de otro estado.</li>
          </List>
        </Prose>
        <Prose>
          <h4>Aplicado al cielo</h4>
          <List>
            <li><b>Cada estado con su homónimo.</b>{' '}
              {todasMismoLado
                ? <>Las tres parejas «observado X» / «siguiente X» están juntas y al mismo lado
                  del eje 1</>
                : <>Comparten lado del eje 1 las parejas de{' '}
                  {lista(homonimas.filter(h => h.mismoLado).map(h => h.nivel))}</>}: el cielo se
              repite, y se ve {homonimas.filter(h => h.mismoLado).length} veces. Son las celdas
              de la diagonal,{' '}
              {porEncima.length === homonimas.length
                ? 'todas por encima de lo esperado'
                : <>por encima de lo esperado en {lista(porEncima.map(h => h.nivel))}</>}:{' '}
              {homonimas.map((h, i, a) => (
                <span key={h.nivel}>{h.nivel} <b>{h.obs}</b> pares donde se esperaban{' '}
                  {f(h.esp)}{i < a.length - 1 ? '; ' : '.'}</span>
              ))}</li>
            <li><b>Filas con filas.</b> Los dos estados observados más cercanos son{' '}
              «{parCerca.a}» y «{parCerca.b}», a d = <b>{f(parCerca.d)}</b>: reparten el día
              siguiente de forma parecida — perfiles ({perfilDe(parCerca.a)}) y{' '}
              ({perfilDe(parCerca.b)}). Los más lejanos, «{parLejos.a}» y «{parLejos.b}», a{' '}
              <b>{f(parLejos.d)}</b>: perfiles ({perfilDe(parLejos.a)}) y ({perfilDe(parLejos.b)}),
              casi opuestos. Esa distancia es la chi-cuadrado de arriba
              {salto.retenido === 100 ? ', y en este plano es exacta' : ', aproximada por el plano'}.</li>
            <li><b>Columnas con columnas.</b> Las dos columnas más cercanas son «siguiente{' '}
              {parCols.a}» y «siguiente {parCols.b}», a <b>{f(parCols.d)}</b>: un día siguiente{' '}
              {parCols.a} y uno {parCols.b} vienen de días observados parecidos — perfiles de
              columna ({perfilColDe(parCols.a)}) y ({perfilColDe(parCols.b)}).</li>
            <li><b>Una fila junto a la columna de otro estado.</b>{' '}
              {colOtra
                ? <>«observado {filaCentro.nivel}» comparte lado del eje 1 con «siguiente{' '}
                  {colOtra.nivel}». No se mide con regla: se lee que van en la misma dirección, y
                  la celda lo dice — <b>{TABLA.celdas[iC][jO]}</b> pares donde se esperaban{' '}
                  {f(ESPERADAS[iC][jO])}, {exceso(iC, jO) > 1 ? 'por encima' : 'por debajo'} de lo
                  esperado{exceso(iC, iC) > exceso(iC, jO)
                    ? <>, pero menos que su pareja homónima, que está más cerca y se aparta más
                      ({homonimas[iC].obs} donde se esperaban {f(homonimas[iC].esp)})</>
                    : null}.</>
                : <>«observado {filaCentro.nivel}» no comparte lado del eje 1 con la columna de
                  ningún otro estado: las columnas de los otros estados le quedan enfrente, y sus
                  celdas están por debajo de lo esperado.</>}</li>
            <li><b>El punto más cercano al centro.</b> Es «observado {filaCentro.nivel}», en{' '}
              ({f(filaCentro.coord[0])}, {f(filaCentro.coord[1])}): su perfil ({perfilDe(filaCentro.nivel)})
              es el que menos se aparta del margen ({TABLA.marginalColumna.map(f).join(', ')}), y
              aun así se aparta. Lo que va junto en la tabla queda junto en el dibujo, y la
              distancia que lo pone junto pesa por frecuencia: lo raro pesa más.</li>
          </List>
        </Prose>
      </Pair>

      <h3>El puente al bloque 2</h3>
      <Prose>
        <p>El bloque siguiente es <b>este mismo análisis</b> aplicado a otra tabla. En vez de cruzar
          dos variables, se toma la <b>tabla indicadora</b> de todas las variables a la vez —una
          fila por persona, una columna por categoría, un 1 donde la persona la tiene— y se le
          aplica el análisis de correspondencias tal cual. Se llama análisis de correspondencias{' '}
          <b>múltiples</b>, y todo lo de este bloque se conserva: los perfiles, la distancia chi-cuadrado,
          la inercia, la transición, la contribución y el cos². Cambia la tabla; no cambia el
          método.</p>
      </Prose>
    </Panel>
  );
}
