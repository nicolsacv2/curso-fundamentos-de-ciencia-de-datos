import { Panel, Cards, Card, Diagram, Pair, Prose, Idea }
  from '../../../components/content/index.jsx';
import { CUANTITATIVAS, ORDINALES, ORDEN_NIVELES } from '../../../data/salon.js';
import {
  ANTES, CAJAS, RAROS, DESCARTADA
} from '../../../data/salon_limpio.js';
import { nombre } from '../../../data/nombres.js';
import { cajas, descarte, niveles } from '../figures/block1.js';

/* Block 1 of session 6 · the rare values: describe, the boxes, the two ordinal scales and
   the column that cannot be saved. Steps 2 to 4 of the chain, cut from the old entrada
   without rewriting (see s06/meta.js). */

/* Every figure in this block comes out of src/data/salon_limpio.js, which
   scripts/clean_salon.py wrote once with the seed pinned. Nothing is computed while
   the session is open: the class on Tuesday and the class on Thursday see the same
   table, including the same invented values. */

const pct = n => String(n).replace('.', ',');
const d = DESCARTADA.pantalla;
const r = RAROS.balanceada;

export default function Block1({ id, tabId, block }) {
  return (
    <Panel id={id} tabId={tabId} block={block}>
      <h3>Paso 2 · Describir, antes de tocar nada</h3>
      <Prose>
        <p>Las mismas medidas de la sesión 4 — centro y dispersión — sobre las{' '}
          {CUANTITATIVAS.length} columnas que son cantidades. Esto no es trámite: es la
          fotografía contra la que vamos a comparar al final, y sin ella «la limpieza cambió
          los números» es una frase sin nada detrás.</p>
      </Prose>

      <div className="dtable">
        <div className="frame">
          <table>
            <thead>
              <tr>
                <th scope="col"><span className="l">variable</span></th>
                <th scope="col"><span className="h">n</span></th>
                <th scope="col"><span className="h">vacías</span></th>
                <th scope="col"><span className="h">media</span></th>
                <th scope="col"><span className="h">mediana</span></th>
                <th scope="col"><span className="h">Q1</span></th>
                <th scope="col"><span className="h">Q3</span></th>
                <th scope="col"><span className="h">RIC</span></th>
                <th scope="col"><span className="h">desv.</span></th>
              </tr>
            </thead>
            <tbody>
              {CUANTITATIVAS.map(c => (
                <tr key={c}>
                  <th className="n" scope="row" style={{ textAlign: 'left' }}>{nombre(c)}</th>
                  <td>{ANTES[c].n}</td>
                  <td className={ANTES[c].huecos ? 'mk' : undefined}>{ANTES[c].huecos}</td>
                  <td>{ANTES[c].media}</td>
                  <td>{ANTES[c].mediana}</td>
                  <td>{ANTES[c].q1}</td>
                  <td>{ANTES[c].q3}</td>
                  <td>{ANTES[c].iqr}</td>
                  <td>{ANTES[c].desviacion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <figcaption>Las {CUANTITATIVAS.length} cantidades, como llegaron. La columna de
          vacías ya dice dónde va a estar el problema.</figcaption>
      </div>

      <h3>Paso 3 · Dónde están los valores raros</h3>
      <Prose>
        <p>Un <b>diagrama de caja</b> es la tabla de arriba dibujada. La caja va del primer
          al tercer cuartil — la mitad central de la clase—, la línea de dentro es la mediana,
          y los bigotes se estiran hasta el último valor que todavía está cerca. Es decir:
          está hecho con los cuartiles y el rango intercuartílico que <b>acabamos de
          calcular</b>. No es una figura nueva, es la misma caja de medidas puesta de lado.</p>
        <p>Lo que queda fuera de los bigotes es lo que la regla llama atípico. La regla es
          esta, y conviene verla escrita porque tiene un número elegido a dedo:</p>
      </Prose>

      <Cards cols="c2">
        <Card k="Por abajo" t="Q1 − 1,5 × RIC">Todo lo que caiga por debajo de ese corte.</Card>
        <Card k="Por arriba" t="Q3 + 1,5 × RIC">Y todo lo que caiga por encima de este.</Card>
      </Cards>

      <Diagram fig={cajas}>
        Una caja por variable, cada una en sus propias unidades. Los puntos rojos son lo
        que la regla deja fuera.
      </Diagram>

      <Pair>
        <Prose>
          <h4>Un atípico no es un error</h4>
          <p>La fila {CAJAS.minutos.filas[0]} contestó{' '}
            <b>{CAJAS.minutos['1.5'].atipicos[0]} minutos</b> — dieciséis horas — y la regla
            la marca.
            Pero la regla no sabe si eso es un error de captura o el día real de alguien que
            estaba de viaje. <b>Mide distancia, no verdad.</b> Quien decide es la clase, y
            hoy vamos a decidir mal a propósito para ver qué cuesta.</p>
        </Prose>
        <Prose>
          <h4>Y ese 1,5 es una decisión</h4>
          <p>Con <b>3</b> en vez de 1,5, sobre los mismos datos, salen menos puntos:{' '}
            {CUANTITATIVAS.filter(c => CAJAS[c]).map(c =>
              CAJAS[c]['1.5'].atipicos.length).reduce((a, b) => a + b, 0)} pasan a ser{' '}
            {CUANTITATIVAS.filter(c => CAJAS[c]).map(c =>
              CAJAS[c]['3.0'].atipicos.length).reduce((a, b) => a + b, 0)}. Nadie cambió de
            respuesta. Cambió el umbral, que no estaba en los datos: lo pusimos nosotros.</p>
        </Prose>
      </Pair>

      <h3>Paso 3b · Las {ORDINALES.length} variables que no admiten esta regla</h3>
      <Prose>
        <p>Faltan dos columnas en todo lo anterior, y no es un olvido. Una es{' '}
          <b>balanceada</b>, el «del 1 al 5, qué tan balanceada fue tu alimentación». La otra
          es <b>tallaCamiseta</b>, y es la que enseña lo que importa: sus niveles no son
          números, son <b>{ORDEN_NIVELES.tallaCamiseta.join(' · ')}</b>.</p>
        <p>En la sesión 4 discutimos si <b>balanceada</b> se puede promediar: dijimos que no,
          porque el 5 no es cinco veces el 1 — son <b>etiquetas ordenadas</b>, no cantidades.
          Pues bien, el rango intercuartílico es una medida de dispersión, y por el mismo
          motivo tampoco aplica. Si la usáramos, marcaría como atípicas a las{' '}
          <b>{r.reparto['1']} personas que respondieron 1</b>, y después el relleno les
          cambiaría la respuesta.</p>
        <p>Y aquí está el matiz que <b>tallaCamiseta</b> deja ver: una M no es más que una S
          en ninguna cantidad, pero <b>va después</b>. Lo que hace ordinal a una variable no
          es que se escriba con cifras, es que <b>sus niveles se ordenen</b>. Una categórica
          como <b>sangre</b> no tiene eso: O+ no va ni antes ni después de A+.</p>
        <p>Lo que sí tiene sentido en un orden es preguntarse qué niveles eligió tan poca
          gente que no se sostienen solos. Eso es lo que hacemos, y es el equivalente exacto
          de la caja para algo que no es una cantidad.</p>
      </Prose>

      <Diagram fig={niveles}>
        Por debajo de {pct(r.tol * 100)} % de la clase — {r.minimo} personas — un nivel se
        agruparía. Las dos escalas tienen un nivel ahí abajo, y las dos lo conservan.
      </Diagram>

      <Prose>
        <h4>Salvo los extremos, que no se agrupan</h4>
        <p>Un nivel que eligió una sola persona se funde con los demás en un saco
          «{r.etiqueta}». Pero al <b>nivel más alto y al más bajo de un orden</b> no se les
          hace eso, aunque caigan por debajo del umbral. Aquí caen los dos:{' '}
          {ORDINALES.map((c, i) => (
            <span key={c}>{i ? ' y ' : ''}
              <b>«{RAROS[c].extremosDevueltos.join(', ')}» de {nombre(c)}</b></span>
          ))}, con una persona cada uno.</p>
        <p>El motivo es el mismo que el del párrafo anterior. Agrupar el «5» diría que comer
          muy balanceado es una rareza; agrupar la «xl» diría que una camiseta grande es una
          anomalía. <b>En una escala acotada los extremos no son rarezas: son el final de la
          escala</b>, y ahí siempre hay menos gente — por construcción, no por accidente.</p>
        <p>Es una excepción a la regla, así que se dice: igual que el <b>1,5</b> de la caja,
          la puso alguien. Está escrita en la bitácora del archivo que les entregamos.</p>
      </Prose>

      <Idea>A cada variable, el tratamiento de su tipo.{' '}
        <span className="who">La regla de la caja mide dispersión; un orden no tiene.</span></Idea>

      <h3>Paso 4 · Una columna que no se puede salvar</h3>
      <Prose>
        <p>Y ahora la consecuencia de haber mirado. La variable <b>pantalla</b> — las horas
          diarias de celular, la que en la sesión 3 votamos qué hacer con ella — tiene{' '}
          <b>{d.huecos} celdas vacías</b> de {d.filas}, y de las {d.filas - d.huecos} que sí
          contestaron, la regla marca <b>{d.atipicos}</b>. Porque la gente contestó mezclando
          horas y minutos, que es exactamente lo que discutimos entonces.</p>
      </Prose>

      <Diagram fig={descarte}>
        {d.perdidos} de {d.filas} celdas. Si rellenáramos, habría que imputar más de la
        mitad de la columna.
      </Diagram>

      <Prose>
        <p>Así que <b>no entra</b>. Ni al relleno ni al análisis. Si la dejáramos, el plano
          que dibujemos al final estaría mostrando, en buena parte, <b>los sorteos de un
          programa</b> y no a la clase — y lo peor es que se vería igual de bien.</p>
        <p>Esto no es un hueco del temario ni un fracaso de la limpieza: es el último eslabón
          de la cadena. Se estandariza, se describe, se dibujan las cajas, y a veces lo que
          sale de mirar las cajas es que <b>una columna no se puede arreglar</b>. Saberlo, y
          decirlo, es el resultado.</p>
      </Prose>
    </Panel>
  );
}
