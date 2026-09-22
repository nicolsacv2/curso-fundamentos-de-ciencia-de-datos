import { Panel, Task, Cards, Card, Diagram, Pair, Prose, List, NumTable }
  from '../../../components/content/index.jsx';
import { ESTADOS, TABLA, ESPERADAS, CHI2, CA } from '../data/lluvia.js';
import { fPerfiles, fTransicionCA, mapaCA } from '../figures/block1.js';
import { UMBRAL_COS2 } from '../figures/shared.js';

/* Block 1 of session 7 · simple correspondence analysis. The same rain table the entrada
   read, now drawn: each row profile is a point, the chi-square distance is the ruler, the
   inertia is χ²/n, and rows and columns share a plane through the transition formulas.
   It teaches, on the sky of today against the sky of tomorrow, every piece the MCA of
   block 2 will reuse on the indicator matrix.

   Every number is interpolated from src/sessions/s07/data/lluvia.js. Nothing is computed
   here, and no number is typed. */

const f = v => String(v).replace('.', ',').replace('-', '−');
const pct = v => `${f(v)} %`;
const lista = xs => xs.map((x, i, a) =>
  <span key={String(x)}>{i ? (i === a.length - 1 ? ' y ' : ', ') : ''}<b>{x}</b></span>);

const R = ESTADOS, K = ESTADOS;
const t = CA.transicion;
const ultima = R.length - 1;
/* Who names axis 1: the rows and the columns above their average share. */
const filasNombran = CA.filas.filter(r => r.ctr[0] > CA.aportePromedioFilas);
const colsNombran = CA.columnas.filter(c => c.ctr[0] > CA.aportePromedioColumnas);
/* The strongest row–column pair on the same side of axis 1, and its observed/expected cell. */
const lado = x => Math.sign(x.coord[0]);
const filaLejos = CA.filas.slice().sort((a, b) => Math.abs(b.coord[0]) - Math.abs(a.coord[0]))[0];
const colLejos = CA.columnas.filter(c => lado(c) === lado(filaLejos))
  .sort((a, b) => Math.abs(b.coord[0]) - Math.abs(a.coord[0]))[0];
const iL = R.indexOf(filaLejos.nivel), jL = K.indexOf(colLejos.nivel);
/* The two ends of axis 1, by sign: what the axis opposes. */
const extremoPos = CA.filas.filter(r => r.coord[0] > 0).map(r => r.nivel);
const extremoNeg = CA.filas.filter(r => r.coord[0] < 0).map(r => r.nivel);

export default function Block1({ id, tabId, block }) {
  return (
    <Panel id={id} tabId={tabId} block={block}>
      <Task label="Para empezar · 2 minutos" big="La misma tabla, ahora como dibujo.">
        <p>La entrada leyó la tabla del <b>cielo de hoy contra el cielo de mañana</b> número a
          número: recuentos, perfiles, esperadas, χ². Este bloque la <b>dibuja</b>: cada fila y
          cada columna van a ser un punto en un plano, y las que van juntas en la tabla van a
          quedar cerca. El método se llama <b>análisis de correspondencias</b>, y es el mismo
          algoritmo del PCA de la sesión 6 con otra manera de medir distancias. Todo lo que
          aprendan aquí lo vuelven a usar en el bloque siguiente, sobre muchas variables a la
          vez.</p>
      </Task>

      <NumTable
        cols={['hoy \\ mañana', ...K, 'suma']}
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
          la suma de la fila sobre el total. «Hoy {R[0]}» pesa {CA.filas[0].n}/{TABLA.n} ={' '}
          {f(CA.filas[0].masa)}; «hoy {R[ultima]}», {CA.filas[ultima].n}/{TABLA.n} ={' '}
          {f(CA.filas[ultima].masa)}.</p>
      </Prose>

      <NumTable
        cols={['hoy', 'días', 'masa', ...K.map(k => `perfil · mañana ${k}`)]}
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
          lo esperado, y por eso se llama <b>distancia chi-cuadrado</b>. Entre «hoy{' '}
          {CA.distancia.filas[0]}» y «hoy {CA.distancia.filas[1]}»: d² = <b>{f(CA.distancia.d2)}</b>,
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

      <h3>Filas y columnas en el mismo plano</h3>
      <Diagram fig={mapaCA}>
        Los cielos de hoy como círculos y los de mañana como cuadrados, con su número de días.
      </Diagram>

      <Prose>
        <p>Los {CA.ejes} ejes retienen <b>{pct(CA.acumulado[1])}</b> de la inercia: con tres filas y
          tres columnas hay exactamente dos ejes, así que el plano dibuja la tabla <b>entera</b>,
          sin perder nada. Es la excepción y no la regla; con más filas o columnas el plano
          retiene una parte, y lo que retiene se lee en sus porcentajes. Aquí además el eje 1
          lleva {pct(CA.porcentajes[0])} solo: la tabla es casi una línea, porque el cielo se ordena
          —del {extremoPos.join(' y ')} a la {extremoNeg.join(' y la ')}— y un orden se dibuja en un
          eje.</p>
        <p>Las filas y las columnas comparten el plano por las <b>fórmulas de transición</b>:
          cada fila está en el promedio de las columnas, pesado por su perfil y dilatado por
          1/√λ; cada columna, en el promedio de las filas, pesado por su perfil de columna y
          dilatado igual. Se comprueba sobre «hoy {t.fila}» en el eje {t.eje}:{' '}
          {t.sumandos.map(x => `${f(x.perfil)} · (${f(x.coord)})`).join(' + ')} ={' '}
          <b>{f(t.promedioPonderado)}</b>, y {f(t.promedioPonderado)}/{f(t.raizLambda)} ={' '}
          <b>{f(t.dilatado)}</b>, que es su coordenada publicada, {f(t.coordPublicada)}.</p>
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
        <p>Por eso <b>el eje 1 se nombra</b> con las filas {lista(filasNombran.map(r => `«hoy ${r.nivel}»`))}{' '}
          y las columnas {lista(colsNombran.map(c => `«mañana ${c.nivel}»`))}, que superan el
          promedio; las demás lo acompañan sin construirlo. Es un eje de <b>hoy y mañana</b> a la
          vez, y lo que opone es lo que esas filas y columnas oponen: los dos extremos del cielo.</p>
      </Prose>

      <NumTable
        cols={['punto', 'tipo', 'días', 'coord. eje 1', 'ctr eje 1', 'cos² eje 1']}
        rows={[
          ...CA.filas.map(r => [`hoy ${r.nivel}`, 'fila · hoy', r.n, f(r.coord[0]), pct(r.ctr[0]), f(r.cos2[0])]),
          ...CA.columnas.map(c => [`mañana ${c.nivel}`, 'columna · mañana', c.n, f(c.coord[0]), pct(c.ctr[0]), f(c.cos2[0])])
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
              esperado</b>. Es la celda observada por encima de la esperada, dibujada.</li>
            <li><b>Dos filas cercanas:</b> perfiles parecidos — reparten igual el cielo de mañana.</li>
            <li><b>La distancia entre una fila y una columna no se mide con regla:</b> se lee la
              dirección, por la relación baricéntrica. Cada una está en el promedio de las otras,
              dilatado.</li>
          </List>
        </Prose>
        <Prose>
          <h4>Aplicado al cielo</h4>
          <p>La fila más lejos del centro es «hoy {filaLejos.nivel}» ({filaLejos.n} días), y la
            columna que va con ella hacia el mismo lado del eje 1 es «mañana {colLejos.nivel}»{' '}
            ({colLejos.n}). Vuelvan a la tabla de la entrada: en esa celda hubo{' '}
            <b>{TABLA.celdas[iL][jL]} días</b> donde la independencia esperaba{' '}
            <b>{f(ESPERADAS[iL][jL])}</b>. El mapa no inventó nada: dibujó esa celda. Y las filas y
            columnas cerca del centro son las que reparten el cielo de mañana como el promedio —
            las que no cuentan nada por sí solas. Lo que va junto en la tabla queda junto en el
            dibujo, y la distancia que lo pone junto pesa por frecuencia: lo raro pesa más.</p>
        </Prose>
      </Pair>

      <h3>El puente al bloque 2</h3>
      <Prose>
        <p>El bloque siguiente es <b>este mismo análisis</b> aplicado a otra tabla. En vez de cruzar
          dos variables, se toma la <b>tabla indicadora</b> de todas las variables a la vez —una
          fila por persona, una columna por categoría, un 1 donde la persona la tiene— y se le
          aplica el análisis de correspondencias tal cual. Se llama análisis de correspondencias{' '}
          <b>múltiples</b>, y todo lo de hoy se conserva: los perfiles, la distancia chi-cuadrado,
          la inercia, la transición, la contribución y el cos². Cambia la tabla; no cambia el
          método.</p>
      </Prose>
    </Panel>
  );
}
