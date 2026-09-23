import {
  Panel, Task, DataTable, Diagram, Prose, Idea
} from '../../../components/content/index.jsx';
import { COLS, COLS_S03, ROWS, RECUENTOS } from '../../../data/salon.js';
import { bogota } from '../figures/intro.js';

export default function Intro({ id, tabId, block }) {
  return (
    <Panel id={id} tabId={tabId} block={block}>
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
        /* The dataset is shared with sessions 4 and 6 and carries 27 columns; this
           session audits ten of them, so it asks for those ten by name. */
        pick={COLS_S03}
        wrap={['area', 'libro']}
        caption={<>Cada fila es una persona; el <b>código</b> es el que cada quien se inventó.
          Cada columna lleva el <b>nombre de su variable</b> y cada fila su número: de ahora
          en adelante, cuando señalemos algo lo vamos a hacer con esos dos —
          <b>municipio, fila 4</b>; <b>minutos, fila 16</b>—. La letra que tenían en la hoja de
          cálculo no dice nada de lo que hay dentro.</>}
      />

      <h3>El conteo que no cuadra</h3>

      <Task label="Chat · un número · 10–22" big="¿Cuánta gente de esta clase vive en Bogotá?">
        <p>Mira la variable <b>municipio</b> y cuenta. Un número al chat, sin discutir con el vecino.</p>
      </Task>

      <Diagram fig={bogota}>
        {/* The spelling count and the sizes used to be written out here — «seis municipios»,
            «una, dos, tres y cinco» — and they were true of the 23 answers the form had when
            this was written. They come out of the data now. */}
        Si cuentas valores distintos, la columna dice que hay{' '}
        <b>{RECUENTOS.bogotaFormas.length + RECUENTOS.bogotaCorregidos.length} municipios</b>{' '}
        con {[...new Set(RECUENTOS.bogotaFormas.map(([, n]) => n))].sort((a, b) => a - b)
          .join(', ').replace(/, (\d+)$/, ' y $1')} personas cada uno. Si cuentas ciudades, hay{' '}
        <b>una</b>, con {RECUENTOS.bogota}.
      </Diagram>

      <Prose>
        <p>Las dos respuestas salen de la misma columna y ninguna de las dos es un error de
          cuentas. Y en {RECUENTOS.bogotaFormas.length} de los{' '}
          {RECUENTOS.bogotaFormas.length + RECUENTOS.bogotaCorregidos.length} valores tampoco
          hay una celda mal escrita: «Bogotá» y «Bogotá D.C.» son las dos maneras correctas
          de decirlo.</p>
        <p>El que falta es de otra clase. Alguien escribió{' '}
          <b>«{RECUENTOS.bogotaCorregidos[0][0]}»</b>, que <b>no es una manera de escribir
          «Bogotá»</b>: es una localidad de Bogotá puesta donde iba el municipio. Esa no la
          arregla ninguna regla — ni recortar espacios, ni quitar tildes, ni bajar a
          minúsculas—, porque lo que hay que saber para arreglarla no está en la tabla: está
          en la cabeza de alguien que conozca la ciudad. La corregimos <b>a mano</b>, y por
          eso queda escrita, con su motivo, junto al código que genera la tabla.</p>
        <p>Y sin embargo, de las {RECUENTOS.bogota} personas que viven en Bogotá, <b>{RECUENTOS.bogotaEnCundinamarca}</b> escribieron
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
