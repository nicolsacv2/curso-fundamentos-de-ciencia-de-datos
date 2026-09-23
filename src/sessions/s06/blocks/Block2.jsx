import { Panel, Cards, Card, Diagram, Pair, Prose, List, Idea, DataTable }
  from '../../../components/content/index.jsx';
import { COLS } from '../../../data/salon.js';
import {
  SEMILLA, FILAS, ANALIZADAS, ANTES, CAJAS, DESPUES, POR_MEDIA, IMPUTADAS, LIMPIA, ORDEN_COLS, DESTINO, MARCAS, CELDAS_INVENTADAS
} from '../../../data/salon_limpio.js';
import { nombre } from '../../../data/nombres.js';
import { relleno } from '../figures/block2.js';

/* Block 2 of session 6 · fill the holes, remember what was invented, describe again, and
   the clean table. Steps 5 to 6b of the chain, cut from the old entrada without rewriting. */

/* Every figure in this block comes out of src/data/salon_limpio.js, which
   scripts/clean_salon.py wrote once with the seed pinned. Nothing is computed while
   the session is open: the class on Tuesday and the class on Thursday see the same
   table, including the same invented values. */

const pct = n => String(n).replace('.', ',');

export default function Block2({ id, tabId, block }) {
  return (
    <Panel id={id} tabId={tabId} block={block}>
      <h3>Paso 5 · Rellenar los huecos que quedan</h3>
      <Prose>
        <p>En las {Object.keys(MARCAS).length} columnas que siguen en pie quedan huecos y, en
          las que son cantidades, valores marcados. A los dos les hacemos lo mismo:{' '}
          <b>el atípico se convierte en hueco</b>, y todo hueco se rellena tomando al azar un
          valor que alguien haya dado <b>en esa misma columna</b>.</p>
        <p>Vale para todos los tipos. A un hueco en <b>minutos</b> le toca un número que
          alguien contestó; a uno en <b>musica</b>, un género que alguien escuchó; a uno en{' '}
          <b>tallaCamiseta</b>, una talla que alguien usa. Lo que cambia es la bolsa de la que
          se saca, no el método. Y en lo que no es una cantidad <b>solo hay huecos</b>: no hay
          regla de la caja que marque nada, así que ahí nadie pierde una respuesta que dio.</p>
        <p>¿Por qué no borrar la fila entera? Porque esa persona contestó las otras{' '}
          {COLS.length - 1} preguntas. Borrarla por una celda sería tirar {COLS.length - 1}{' '}
          respuestas buenas para no tener que inventar una.</p>
      </Prose>

      <Cards cols="c3">
        {Object.keys(IMPUTADAS).filter(c => IMPUTADAS[c].filas.length).map(c => {
          const huecos = ANTES[c] ? ANTES[c].huecos : IMPUTADAS[c].filas.length;
          const marcadas = IMPUTADAS[c].filas.length - huecos;
          return (
            <Card key={c} red={IMPUTADAS[c].tipo !== 'num'}
              k={nombre(c)} t={`${IMPUTADAS[c].filas.length} celdas`}>
              {huecos} sin respuesta{marcadas ? ` y ${marcadas} marcadas` : ''} —{' '}
              {pct(IMPUTADAS[c].proporcion)} % de la columna. Filas{' '}
              {IMPUTADAS[c].filas.join(', ')}.
            </Card>
          );
        })}
      </Cards>

      <Prose>
        <h4>El caso que incomoda</h4>
        <p>Mira la tarjeta de <b>peso</b>. De sus {IMPUTADAS.peso.filas.length} celdas
          inventadas, una no era un hueco: alguien contestó{' '}
          <b>{CAJAS.peso['1.5'].atipicos[0]} kg</b> y la regla la marcó, porque el bigote de
          arriba llega a {pct(CAJAS.peso['1.5'].corteAlto)}. Le borramos su peso y le pusimos
          el de otra persona, sorteado.</p>
        <p>Es el mismo argumento del paso 3, pero ahora duele. Los 960 minutos <b>podían</b>{' '}
          ser alguien que contestó en la unidad equivocada. {CAJAS.peso['1.5'].atipicos[0]} kg
          no es un error de captura: <b>es un peso perfectamente posible</b>. La regla mide
          distancia, no verdad, y aquí se ve que lo que mide y lo que nos interesa no son lo
          mismo.</p>
        <p>No lo estamos arreglando: lo estamos <b>enseñando</b>. Esta es la celda de la tabla
          sobre la que hay que decidir a mano, y la cadena automática decidió por nosotros.</p>
      </Prose>

      <Diagram fig={relleno}>
        La misma columna rellenada de dos maneras. La tercera es la que se usa por
        defecto en medio mundo.
      </Diagram>

      <Pair>
        <Prose>
          <h4>Por qué muestrear</h4>
          <List>
            <li><b>Conserva la forma.</b> Los valores que entran ya estaban en la columna, así
              que la distribución sigue pareciéndose a la que había.</li>
            <li>Rellenar con la media, en cambio, <b>levanta una torre</b> justo en el centro
              y estrecha la dispersión: {pct(DESPUES.minutos.desviacion)} baja a{' '}
              {pct(POR_MEDIA.minutos.desviacion)}. La columna parece más de acuerdo consigo
              misma de lo que está.</li>
          </List>
        </Prose>
        <Prose>
          <h4>Lo que cuesta igual</h4>
          <List>
            <li><b>No recupera nada.</b> El valor que entra es una invención plausible, no una
              medición. Nadie dijo eso.</li>
            <li><b>Rompe la relación entre columnas.</b> Cada una se rellena por su cuenta, así
              que a una fila le puede tocar un perfil que no tendría sentido junto.</li>
            <li>Y el azar está <b>fijado</b> (semilla {SEMILLA}): si no lo estuviera, cada vez
              que abriéramos esta página los valores serían otros, y el martes y el jueves no
              verían la misma clase.</li>
          </List>
        </Prose>
      </Pair>

      <Prose>
        <h4>Por eso la tabla se acuerda de lo que inventó</h4>
        <p>Una vez rellenada, dentro de la columna un valor inventado y uno observado son{' '}
          <b>indistinguibles</b>: un 120 puesto por el programa se lee igual que un 120 que
          alguien escribió, y un «rock» sorteado, igual que un «rock» contestado. Así que antes
          de rellenar marcamos: por cada variable con celdas por inventar, una columna más que
          vale 1 donde el valor no lo dio nadie. Son{' '}
          <b>{Object.values(MARCAS).filter(m => m.total).length} columnas</b> para{' '}
          <b>{CELDAS_INVENTADAS} celdas</b> en toda la tabla.</p>
        <p>Da igual el tipo de la variable y da igual por qué se inventó —nadie contestó, o la
          regla descartó lo que había—: la marca dice «esto no lo dijo nadie», que es lo único
          que importa a partir de aquí. Y <b>viaja con el archivo</b> que les entregamos, no se
          queda en esta pantalla.</p>
        <p>Al análisis no entran: una marca no es una cantidad. Pero existen, y es lo que nos
          permitirá más adelante preguntarnos si dejar cosas en blanco va con algo.</p>
      </Prose>

      <h3>Paso 6 · Describir otra vez, y comparar</h3>
      <Prose>
        <p>Las mismas medidas del paso 2, sobre la tabla ya limpia. Aquí es donde se ve qué
          movió la limpieza — y qué no se movió, que es igual de informativo.</p>
      </Prose>

      <div className="dtable">
        <div className="frame">
          <table>
            <thead>
              <tr>
                <th scope="col"><span className="l">variable</span></th>
                <th scope="col"><span className="h">media antes</span></th>
                <th scope="col"><span className="h">media después</span></th>
                <th scope="col"><span className="h">mediana antes</span></th>
                <th scope="col"><span className="h">mediana después</span></th>
                <th scope="col"><span className="h">desv. antes</span></th>
                <th scope="col"><span className="h">desv. después</span></th>
              </tr>
            </thead>
            <tbody>
              {ANALIZADAS.map(c => {
                const movio = ANTES[c].media !== DESPUES[c].media;
                return (
                  <tr key={c}>
                    <th className="n" scope="row" style={{ textAlign: 'left' }}>{nombre(c)}</th>
                    <td>{ANTES[c].media}</td>
                    <td className={movio ? 'mk' : undefined}>{DESPUES[c].media}</td>
                    <td>{ANTES[c].mediana}</td>
                    <td className={ANTES[c].mediana !== DESPUES[c].mediana ? 'mk' : undefined}>
                      {DESPUES[c].mediana}</td>
                    <td>{ANTES[c].desviacion}</td>
                    <td className={ANTES[c].desviacion !== DESPUES[c].desviacion ? 'mk' : undefined}>
                      {DESPUES[c].desviacion}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <figcaption>Señalado, lo que cambió. Las columnas sin huecos ni marcados no se
          movieron — no podían.</figcaption>
      </div>

      <Prose>
        <p>Lo que más se mueve es la <b>desviación</b> de las columnas que tenían el atípico
          grande: en <b>minutos</b> cae de {ANTES.minutos.desviacion} a{' '}
          {DESPUES.minutos.desviacion}, porque el 960 se fue. La <b>mediana</b>, en cambio,
          apenas se entera. Es la misma lección de la sesión 4, ahora del otro lado: lo que
          aguanta un atípico aguanta también que se lo quiten.</p>
      </Prose>

      <h3>Paso 6b · La tabla, ya limpia</h3>
      <Prose>
        <p>Aquí está lo que llevamos una hora construyendo. Es la misma tabla con la que
          abrimos —las mismas {FILAS} filas, las mismas {COLS.length} columnas—, pero el texto
          está estandarizado, los niveles que nadie más eligió están agrupados, y los huecos y
          los atípicos están rellenos.</p>
        <p>Dos cosas que mirar antes de seguir. Una: <b>lo que quedó fuera sigue aquí</b>,
          apagado. {ORDEN_COLS.filter(c => DESTINO[c] !== 'limpia').map((c, i, a) => (
            <span key={c}><b>{nombre(c)}</b>{i < a.length - 2 ? ', ' : i === a.length - 2 ? ' y ' : ''}</span>
          ))} no se limpiaron ni se rellenaron, y por eso conservan sus celdas vacías. Borrarlas
          de la tabla habría hecho desaparecer la decisión de dejarlas fuera.</p>
        <p>Y dos: <b>lo rojo son las {CELDAS_INVENTADAS} celdas que no dijo nadie</b>. Míralas
          bien, porque el paso siguiente va a usar esta tabla <b>como si todo fuera real</b> —
          que es exactamente lo que pasa en cualquier análisis que hayan leído.</p>
        <p>Una tercera: <b>no queda ni un hueco</b> fuera de las columnas apagadas. El relleno
          no distingue tipos — a un hueco en <b>musica</b> se le sortea un género de los que
          alguien escuchó, igual que a uno en <b>minutos</b> se le sortea un número de los que
          alguien contestó. Lo que cambia es de dónde se sortea, no el método.</p>
      </Prose>

      <DataTable
        cols={COLS}
        rows={LIMPIA}
        rotulo="La tabla del salón ya limpia, con las celdas inventadas señaladas"
        wrap={['area', 'libro', 'sector', 'organiza', 'formaCafe']}
        mark={Object.entries(MARCAS).flatMap(([c, m]) => m.filas.map(f => `${c}:${f}`))}
        fate={Object.fromEntries(ORDEN_COLS
          .filter(c => DESTINO[c] !== 'limpia')
          .map(c => [c, DESTINO[c] === 'descartada' ? 'descartada' : 'no analizable']))}
        caption={<>La tabla después de la cadena: {FILAS} filas ×{' '}
          {COLS.length} columnas. En rojo, las <b>{CELDAS_INVENTADAS} celdas inventadas</b>;
          apagadas, las {ORDEN_COLS.filter(c => DESTINO[c] !== 'limpia').length} columnas que
          la cadena dejó fuera. Las celdas que siguen vacías son las que el relleno no tocó:
          las de <b>pantalla</b>, que se descartó, y las de las columnas que no son
          cantidades.</>}
      />

      <Idea>Una tabla limpia no es una tabla verdadera.{' '}
        <span className="who">{CELDAS_INVENTADAS} de sus celdas las escribió un programa.</span></Idea>
    </Panel>
  );
}
