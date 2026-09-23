import { Panel, Task, Cards, Card, Diagram, Pair, Prose, List, Idea, DataTable }
  from '../../../components/content/index.jsx';
import { COLS, ROWS, CUANTITATIVAS, ORDINALES, CATEGORICAS, COLS_FORMULARIO } from '../../../data/salon.js';
import {
  FILAS, PALABRAS_VACIAS, TEXTO, RAROS, PCA, NO_NUMERICAS, DIAGNOSTICO, NO_ANALIZABLES, DESCARTADA
} from '../../../data/salon_limpio.js';
import { nombre } from '../../../data/nombres.js';
import { textoPasos, noNumericas } from '../figures/intro.js';

/* Entrada of session 6 · the table as it arrived, and the text. The first stretch of the
   cleaning chain that used to be the whole entrada: the change partir-la-sesion-06-en-dos
   cut it along its own <h3> into five blocks, and this is the first. Nothing was rewritten. */

/* Every figure in this block comes out of src/data/salon_limpio.js, which
   scripts/clean_salon.py wrote once with the seed pinned. Nothing is computed while
   the session is open: the class on Tuesday and the class on Thursday see the same
   table, including the same invented values. */

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
          a mirarla al final del bloque 2: será la misma tabla, ya limpia.</>}
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
    </Panel>
  );
}
