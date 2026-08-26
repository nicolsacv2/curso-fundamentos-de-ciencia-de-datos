import {
  Panel, Task, DataTable, Diagram, Prose, Idea
} from '../../../components/content/index.jsx';
import { COLS, ROWS } from '../data/salon.js';
import { bogota } from '../figures/intro.js';

export default function Intro({ id, tabId }) {
  return (
    <Panel id={id} tabId={tabId}>
      <p className="eyebrow">Entrada · 0–22</p>
      <h2>Esta es nuestra tabla</h2>
      <p className="lead">Veintitrés respuestas, diez columnas. Es lo que salió del formulario
        que escribimos entre todos la sesión pasada, sin tocar una sola celda.</p>

      <Task label="Cascada de chat · 0–10" big="Una palabra: ¿qué es lo primero que te chirría?">
        <p>Todavía no hay vocabulario para nombrarlo, y no hace falta. Mira la tabla y escribe
          en el chat <b>una sola palabra</b> con lo que te salta a la vista. Las recojo todas y
          las dejamos ahí: al final del bloque 1 volvemos a ver cuántas cosas se nos habían
          pasado.</p>
      </Task>

      <DataTable
        cols={COLS}
        rows={ROWS}
        wrap={['D', 'J']}
        caption={<>Cada fila es una persona; el <b>código</b> es el que cada quien se inventó.
          Las columnas van con letra y las filas con número: de ahora en adelante, cuando
          señalemos algo lo vamos a hacer con su coordenada — <b>C4</b>, <b>F16</b>.</>}
      />

      <h3>El conteo que no cuadra</h3>

      <Task label="Chat · un número · 10–22" big="¿Cuánta gente de esta clase vive en Bogotá?">
        <p>Mira la columna <b>C</b> y cuenta. Un número al chat, sin discutir con el vecino.</p>
      </Task>

      <Diagram fig={bogota}>
        Si cuentas valores distintos, la columna dice que hay <b>seis municipios</b> con una,
        dos, tres y cinco personas cada uno. Si cuentas ciudades, hay <b>una</b>, con trece.
      </Diagram>

      <Prose>
        <p>Las dos respuestas salen de la misma columna y ninguna de las dos es un error de
          cuentas. Tampoco hay una celda mal escrita: nadie puso el municipio equivocado, y
          «Bogotá» y «Bogotá D.C.» son las dos maneras correctas de decirlo.</p>
        <p>Y sin embargo, de las trece personas que viven en Bogotá, <b>siete</b> escribieron
          «Cundinamarca» en la columna del departamento. Tampoco están equivocadas: es lo que
          uno dice. Lo que estaba mal era la pregunta, que ofrecía una casilla imposible.</p>
        <p>Hoy la sesión entera va de esto: <b>alguien va a tener que decidir</b> cuál de las
          dos respuestas es la buena, esa decisión va a cambiar la conclusión, y casi nunca
          queda escrita en ninguna parte.</p>
      </Prose>

      <Idea>Limpiar no es arreglar lo que está mal.{' '}
        <span className="who">Casi siempre es decidir entre cosas que están bien.</span></Idea>
    </Panel>
  );
}
