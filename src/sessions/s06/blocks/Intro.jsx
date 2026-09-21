import { Panel, Task, Cards, Card, Diagram, Pair, Prose, List, Idea, DataTable }
  from '../../../components/content/index.jsx';
import { COLS, ROWS, CUANTITATIVAS, ORDINALES, CATEGORICAS, ORDEN_NIVELES,
  COLS_FORMULARIO } from '../../../data/salon.js';
import {
  SEMILLA, FILAS, PALABRAS_VACIAS, ANALIZADAS, TEXTO, ANTES, CAJAS,
  DESCARTADA, RAROS, DESPUES, POR_MEDIA, IMPUTADAS, PCA,
  NO_NUMERICAS, DIAGNOSTICO, NO_ANALIZABLES, UMBRALES,
  LIMPIA, ORDEN_COLS, DESTINO, MARCAS, CELDAS_INVENTADAS, MATRICES
} from '../../../data/salon_limpio.js';
import { nombre } from '../../../data/nombres.js';
import { textoPasos, cajas, descarte, niveles, relleno, sedimento, plano, noNumericas,
  matrizDispersion, matrizCajas, matrizBarras } from '../figures/intro.js';

/* Every figure in this block comes out of src/data/salon_limpio.js, which
   scripts/clean_salon.py wrote once with the seed pinned. Nothing is computed while
   the session is open: the class on Tuesday and the class on Thursday see the same
   table, including the same invented values. */

const pct = n => String(n).replace('.', ',');

const d = DESCARTADA.pantalla;
const r = RAROS.balanceada;

export default function Intro({ id, tabId, block }) {
  return (
    <Panel id={id} tabId={tabId} block={block}>
      <Task label="Para empezar · 4 minutos" big="La tabla del salón lleva tres sesiones con
        nosotros y todavía no la hemos analizado entera.">
        <p>La sesión pasada terminamos reduciendo cuatro indicadores de país a un plano. El
          método funcionaba, y lo dejamos atado a una condición que no dijimos en voz alta:
          <b> solo sabe leer números</b>. Hoy volvemos a nuestra tabla, que de números tiene
          poco, y vamos a llegar hasta donde ese método alcance. No es hasta el final.</p>
      </Task>

      <h3>Con qué vamos a trabajar</h3>
      <Prose>
        <p>Las mismas <b>{FILAS} respuestas</b> que limpiamos en la sesión 3 y describimos en
          la 4, pero ahora con todas las columnas que se pueden publicar:{' '}
          <b>{COLS.length}</b> de las {COLS_FORMULARIO} del formulario, no diez. Y de
          esas {COLS.length}, solo <b>{CUANTITATIVAS.length}</b> son cantidades. Las
          otras {CATEGORICAS.length + ORDINALES.length} son nombres y órdenes: departamento,
          área, sector, grupo sanguíneo, género musical, qué talla de camiseta usas.</p>
        <p>Ese reparto es el tema de hoy. Pero antes de analizar nada hay que dejar la tabla
          utilizable, y eso son cuatro pasos que se deciden uno por uno.</p>
      </Prose>

      <DataTable
        cols={COLS}
        rows={ROWS}
        rotulo="La tabla del salón como llegó, con todas sus columnas"
        wrap={['area', 'libro', 'sector', 'organiza', 'formaCafe']}
        caption={<>La tabla entera, como llegó: {FILAS} filas ×{' '}
          <b>{COLS.length} columnas</b>. De ellas, <b>{NO_NUMERICAS.length} no son
          números</b> — el método de la sesión pasada no puede leerlas, y son la mayoría.
          Cada columna lleva el <b>nombre de su variable</b>; cada fila, su número. Vuelve
          a mirarla al final de la entrada: será la misma tabla, ya limpia.</>}
      />

      <h3>Paso 1 · El texto, que es casi todo</h3>
      <Prose>
        <p>En la sesión 3 vimos que «Bogotá», «Bogotá D.C.» y «Bogotá␣» son la misma ciudad
          escrita de tres maneras, y que contarlas por separado da una respuesta falsa.
          Entonces lo arreglamos a mano. Hoy no: hoy son {COLS.length} columnas y no se
          arregla a mano nada. Se aplican <b>cuatro tratamientos</b>, siempre los mismos y
          siempre en el mismo orden.</p>
        <p>Y se aplican <b>a todas las columnas de texto</b>, las {Object.keys(TEXTO).length},
          no solo a la que vamos a mirar de cerca. Abajo está primero <b>municipio</b> paso a
          paso, que es como se entiende qué hace cada tratamiento, y después el efecto sobre
          las {Object.keys(TEXTO).length}, que es como se ve que no elegimos el caso que nos
          convenía.</p>
      </Prose>

      <Diagram fig={textoPasos}>
        La variable <b>municipio</b> pasa de {TEXTO.municipio.crudo} categorías distintas
        a {TEXTO.municipio.pasos[3][1]}. Ninguna celda estaba mal escrita. Abajo, lo mismo
        sobre las {Object.keys(TEXTO).length} columnas de texto: lo que se cuenta son{' '}
        <b>categorías distintas</b>, no filas — las filas siguen siendo {FILAS}.
      </Diagram>

      <Pair>
        <Prose>
          <h4>Qué hace cada uno</h4>
          <List>
            <li><b>Recortar</b> los espacios de los extremos. «Bogotá␣» y «Bogotá» dejan de
              ser dos categorías, y nadie habría visto la diferencia mirando.</li>
            <li><b>Quitar las tildes</b>. «Bogotá» y «Bogota» se juntan — y también «Cajicá»
              y «Cajica», que en nuestra tabla están las dos.</li>
            <li><b>Bajar a minúsculas</b>, para que «NINGUNO» y «ninguno» no se cuenten aparte.</li>
            <li><b>Quitar las palabras vacías</b>: las que aparecen en cualquier frase y no
              distinguen ninguna. Es lo que funde «Bogotá D.C.» con «Bogotá».</li>
          </List>
        </Prose>
        <Prose>
          <h4>La lista que usamos</h4>
          <p style={{ fontFamily: 'var(--mono)', fontSize: '12.5px', lineHeight: 1.9 }}>
            {PALABRAS_VACIAS.join(' · ')}</p>
          <p>Y aquí está la primera decisión del día: <b>no se aplica a todas las columnas</b>.
            Sí a{' '}
            {Object.keys(TEXTO).filter(k => TEXTO[k].conStopwords).map((k, i, a) => (
              <span key={k}><b>{nombre(k)}</b>{i < a.length - 2 ? ', ' : i === a.length - 2 ? ' y ' : ''}</span>
            ))}, porque ahí alguien escribió una frase. A <b>sangre</b> o a <b>formaCafe</b> no:
            «Negro, sin azúcar» sin el «sin» es otra respuesta, y no una parecida.</p>
        </Prose>
      </Pair>

      <Idea>Estandarizar no corrige errores: no había ninguno.{' '}
        <span className="who">Decide qué cuenta como «la misma respuesta».</span></Idea>

      <h3>Paso 1b · Qué forma tiene cada una de las {NO_NUMERICAS.length}</h3>
      <Prose>
        <p>Estandarizar deja las columnas comparables. Pero antes de hacer nada más con
          ellas hay que <b>mirarlas</b>, y mirar una variable que no es un número no es
          calcularle un promedio: es contar cuántas respuestas distintas tiene, cuánta gente
          hay en la más popular, y cuántas las dio una sola persona.</p>
        <p>Esas tres cifras bastan para repartirlas en <b>cuatro formas</b>, y cada forma
          sirve para algo distinto. La figura las ordena de un vistazo: cada franja es una
          variable partida en sus niveles, el mayor primero.</p>
      </Prose>

      <Diagram fig={noNumericas}>
        Las {NO_NUMERICAS.length} variables que el PCA no puede leer. La forma se ve antes
        que los números: mira el ancho del primer bloque y cuántas astillas van detrás.
      </Diagram>

      <Cards cols="c4">
        {[['sana', 'Sanas', 'Pocos niveles y repartidos. No hay que hacerles nada más.'],
          ['cola', 'Cola larga', 'Un bloque grande y muchos niveles de una sola persona detrás.'],
          ['dominada', 'Dominadas', 'Casi toda la clase respondió lo mismo.'],
          ['unico', 'Casi todo único', 'Tantos niveles como personas.']
        ].map(([forma, titulo, que]) => {
          const cuales = NO_NUMERICAS.filter(c => DIAGNOSTICO[c].forma === forma);
          return (
            <Card key={forma} red={forma === 'unico'} k={`${cuales.length} variables`} t={titulo}>
              {que} <b>{cuales.map(nombre).join(', ')}</b>.
            </Card>
          );
        })}
      </Cards>

      <Pair>
        <Prose>
          <h4>Lo que se agrupa</h4>
          <p>A un nivel que eligió <b>una sola persona</b> le pasa lo mismo que a un atípico:
            no se sostiene solo. Así que se juntan todos en uno, igual que hicimos con la
            escala del 1 al 5 — y por la misma razón, que es lo que a una variable sin
            cantidades le corresponde en vez de la regla de la caja.</p>
          <p>Se le aplica <b>a las {Object.keys(RAROS).length} que se pueden analizar</b>, no
            solo a las de cola larga: donde no había nada delgado, no cambia nada, y eso
            también hay que verlo. En total se agruparon niveles en{' '}
            <b>{Object.values(RAROS).filter(r => r.agrupados.length).length}</b> de ellas.</p>
          <p>El precio se ve en <b>municipio</b>: de {RAROS.municipio.niveles} niveles quedan{' '}
            {RAROS.municipio.frecuentes} y un «{RAROS.municipio.etiqueta}». Sopó, Tunja y
            Medellín acaban en el mismo saco, que no es un lugar. Ganamos una variable
            utilizable y perdimos el mapa.</p>
        </Prose>
        <Prose>
          <h4>Lo que no se puede arreglar</h4>
          <p>{Object.keys(NO_ANALIZABLES).map((c, i, a) => (
              <span key={c}><b>{nombre(c)}</b>{i < a.length - 2 ? ', ' : i === a.length - 2 ? ' y ' : ''}</span>
            ))} no entran, y no es por sucias: es que <b>no son categorías</b>. Con {FILAS}{' '}
            personas, {Object.values(NO_ANALIZABLES).map(d => d.niveles).join(' y ')} niveles
            distintos significan que un nivel describe a <b>una persona</b>, no a un grupo.
            Una categoría que solo tú cumples no te agrupa con nadie.</p>
          <p>Y las <b>dominadas</b> sí entran, pero conviene saber lo que son: si 24 de{' '}
            {FILAS} contestan lo mismo, esa variable <b>no distingue a nadie</b>. No está
            mal medida; simplemente esta clase es homogénea en eso, y eso también es un
            hallazgo.</p>
          <p>Van ya <b>tres motivos distintos</b> para dejar una columna fuera: por cómo se
            recogió (<b>pantalla</b>), por no ser una categoría, y por no ser un número.</p>
        </Prose>
      </Pair>

      <Idea>Ninguna de estas {NO_NUMERICAS.length} entra al PCA, por limpia que quede.{' '}
        <span className="who">Limpiarlas no las vuelve números.</span></Idea>

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

      <h3>Paso 6c · Qué va con qué</h3>
      <Prose>
        <p>Antes de analizar nada, una pregunta más simple: <b>¿hay algo que vaya con algo?</b>{' '}
          Mirar dos variables a la vez no es una sola cosa — depende de <b>qué son las dos</b>.
          Hay exactamente tres combinaciones, y cada una tiene su figura.</p>
        <p>Ninguna de las tres muestra todas las variables. Muestran <b>{MATRICES.n}</b>, porque
          con doce cada celda sería del tamaño de una uña. Y el criterio de cuáles{' '}
          <b>se calcula</b>, no lo elegimos a ojo: llevamos una hora diciendo que una decisión
          sin escribir es la que no se puede discutir, y no vamos a hacer en la figura lo que
          prohibimos en los datos.</p>
      </Prose>

      <Cards cols="c3">
        <Card k="cantidad × cantidad" t="Dispersión">
          Una nube. Si sube una y sube la otra, se inclina. Es la única que el método del
          paso siguiente sabe leer.
        </Card>
        <Card k="cantidad × nombre" t="Cajas">
          Una caja por cada nivel del nombre. Si la categoría separa la cantidad, las cajas
          quedan a distinta altura.
        </Card>
        <Card k="nombre × nombre" t="Barras agrupadas">
          Cuántas personas hay en cada combinación. Agrupadas y no apiladas: apilar muestra
          el total, que no es lo que se pregunta.
        </Card>
      </Cards>

      <Diagram fig={matrizDispersion}>
        Las {MATRICES.n} cuantitativas que más se relacionan con alguna otra. El número de
        cada celda es la correlación. Fuera del par{' '}
        <b>{MATRICES.parMasFuerte[0]}–{MATRICES.parMasFuerte[1]}</b>, casi todo son manchas
        redondas: <b>eso es que no van juntas</b>.
      </Diagram>

      <Diagram fig={matrizCajas}>
        Las mismas cantidades contra las {MATRICES.n} cualitativas{' '}
        <b>«sanas»</b> del paso 1b — pocos niveles y repartidos. Una caja <b>hueca</b> está
        hecha con menos de cuatro respuestas: se dibuja, pero no resume nada, y conviene
        saberlo antes de leerle una diferencia.
      </Diagram>

      <Diagram fig={matrizBarras}>
        Y las cualitativas entre sí. Aquí no hay correlación que calcular: lo que se compara
        es si el reparto de una cambia según el nivel de la otra.
      </Diagram>

      <Prose>
        <p>Recuerden esto para dentro de dos minutos: de las tres figuras, el método que viene
          solo sabe leer <b>la primera</b>. Las otras dos no es que salgan mal — es que no
          puede ni intentarlo.</p>
      </Prose>

      <h3>Paso 7 · Y ahora sí, el método de la sesión pasada</h3>
      <Prose>
        <p>Tenemos una tabla utilizable. Le aplicamos <b>exactamente el mismo PCA</b> de la
          sesión 5: estandarizar — obligatorio aquí, porque una columna está en minutos y otra
          en mascotas —, y buscar las direcciones en las que la nube más se estira.</p>
        <p>Entran <b>{PCA.variables.length} variables</b>. Es decir: de las {COLS.length}{' '}
          columnas de la tabla, el análisis mira{' '}
          <b>{Math.round(100 * PCA.variables.length / COLS.length)} %</b>.</p>
      </Prose>

      <Cards cols="c3">
        <Card k="Fuera por no ser números" t={`${CATEGORICAS.length} columnas`}>
          Departamento, área, sector, sangre, música… El PCA trabaja con varianzas, y una
          categoría no tiene varianza: ¿cuánto se desvía «Antioquia» de la media?
        </Card>
        <Card k="Fuera por ser un orden" t={`${ORDINALES.length} columnas`}>
          {ORDINALES.map((c, i) => (
            <span key={c}>{i ? ' y ' : ''}<b>{nombre(c)}</b></span>
          ))}. Sus niveles se ordenan, pero no se suman, y una varianza es una suma.
          Vuelven más adelante, por otra puerta.
        </Card>
        <Card red k="Fuera por los datos" t={`${Object.keys(DESCARTADA).length} columna`}>
          <b>pantalla</b>, la que acabamos de descartar. Esta sí era una cantidad; lo que
          falló fue cómo se recogió.
        </Card>
      </Cards>

      <Diagram fig={sedimento}>
        Cuánto se queda cada componente. Las dos primeras suman {pct(PCA.acumulado[1])} %.
      </Diagram>

      <Diagram fig={plano}>
        Un punto por persona, una flecha por variable. Los ejes se llaman CP 1 y CP 2 y no
        se llaman nada más: ponerles nombre sería interpretar.
      </Diagram>

      <Prose>
        <p>Y el resultado es <b>flojo</b>, hay que decirlo. En la sesión pasada, con cuatro
          indicadores de país, las dos primeras componentes se quedaban con el <b>92 %</b> de
          la información. Aquí se quedan con <b>{pct(PCA.acumulado[1])} %</b>: casi el{' '}
          {Math.round(100 - PCA.acumulado[1])} % de lo que había no cabe en este dibujo.</p>
        <p>No es que el método funcione peor, y tampoco es que le falten variables: acabamos
          de meterle <b>tres más</b> que la primera vez —la edad, el peso y la estatura— y el
          porcentaje <b>bajó</b>. Eso descarta la explicación fácil. Lo que pasa es lo que
          acabamos de ver en la matriz de dispersión: aquellos cuatro indicadores iban juntos
          —donde sube el PIB sube la esperanza de vida— y estas {PCA.variables.length}{' '}
          variables casi nunca.</p>
        <p>Casi. El par más fuerte de toda la tabla es{' '}
          <b>{MATRICES.parMasFuerte[0]} y {MATRICES.parMasFuerte[1]}</b>, con{' '}
          {pct(MATRICES.parMasFuerte[2])} — y se veía en su celda de la matriz, la única con
          una nube inclinada en vez de una mancha. Que sean esas dos no sorprende: las dos
          preguntan por lo mismo, la actividad física, una por días y otra por semanas. Dos
          variables que miden lo mismo no sostienen un plano de doce; lo que enseñan es que el
          método <b>sí sabe</b> encontrar la relación cuando la hay.</p>
        <p>Y hay un detalle incómodo escondido ahí. <b>Peso y estatura</b> deberían ser el otro
          par obvio, y en la tabla cruda lo eran. Después de la cadena se quedan en{' '}
          {pct(MATRICES.fuerza.peso)}, por debajo del corte de la matriz. Los rellenamos
          columna por columna, y eso es exactamente lo que advertimos en el paso 5:{' '}
          <b>la imputación rompe la relación entre columnas</b>. No es una anécdota, se puede
          medir, y acaba de costarnos la pareja que mejor ilustraba el punto.</p>
        <p>Cuando las variables no se dan la mano, no hay dos direcciones que las resuman. Y
          añadir columnas no lo arregla — lo empeora, porque cada una nueva trae su propia
          dirección que nadie más comparte.</p>
        <p>Un detalle que conviene decir en voz alta: <b>minutos</b> ni siquiera entró en la
          matriz de dispersión. Es la variable con la que hemos trabajado desde la sesión 3, y
          el criterio la dejó fuera porque su relación más fuerte con cualquier otra es de{' '}
          {pct(MATRICES.fuerza.minutos)} — la última de {Object.keys(MATRICES.fuerza).length}.
          No la escondimos: <b>es la que menos va con nada</b>, y eso es exactamente lo que
          este paso está diciendo.</p>
      </Prose>

      <Task label="Para pensar · 70–75" big="¿Qué falta?">
        <p>Miren otra vez las tres tarjetas de lo que quedó fuera. Son{' '}
          <b>{CATEGORICAS.length + ORDINALES.length} columnas</b> de {COLS.length}: el
          departamento donde vives, el área en la que estudiaste, el sector en el que trabajas,
          qué tanto has usado Python, qué música escuchas.</p>
        <p>Nada de eso ha entrado todavía en ningún análisis de este curso. Y ya no hace falta
          creerme que tienen algo dentro: <b>lo acaban de ver</b>. La matriz de barras y la de
          cajas estaban llenas de repartos que cambian de una columna a otra — estructura, en
          dos tercios de la tabla, que el método de hoy no puede ni mirar.</p>
        <p>No es información de segunda: probablemente es la que <b>mejor distingue</b> a unas
          personas de otras en este salón.</p>
        <p>Así que la pregunta con la que salimos de la entrada es esa, tal cual:{' '}
          <b>¿qué falta?</b> — y, sobre todo, ¿qué se hace con lo que falta? Los tres bloques
          que vienen son la respuesta.</p>
      </Task>

      <Idea>El PCA no se quedó corto: se quedó sin variables que mirar.{' '}
        <span className="who">{CATEGORICAS.length + ORDINALES.length} de {COLS.length} columnas
          ni siquiera pudieron entrar.</span></Idea>
    </Panel>
  );
}
