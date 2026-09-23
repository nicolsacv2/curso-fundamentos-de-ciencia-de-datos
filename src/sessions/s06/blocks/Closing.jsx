import { Panel, Task, Pair, Prose, List, Idea } from '../../../components/content/index.jsx';
import { COLS, CATEGORICAS, ORDINALES } from '../../../data/salon.js';
import { DESCARTADA, NO_ANALIZABLES } from '../../../data/salon_limpio.js';
import { nombre } from '../../../data/nombres.js';
import meta07 from '../../s07/meta.js';

/* Closing of session 6 · «¿Qué falta?». The question and the Idea that used to end the
   old entrada, an exit ticket, and the bridge to session 7 — which is where the
   question gets answered now, so the bridge reads session 7's own title and goal from
   its meta.js instead of typing them. Importing a meta drags no content chunk in:
   registry.js already ships every meta in the main bundle. */

const noNumericas = CATEGORICAS.length + ORDINALES.length;
const descartada = Object.keys(DESCARTADA)[0];
const noAnalizables = Object.keys(NO_ANALIZABLES);

export default function Closing({ id, tabId, block }) {
  return (
    <Panel id={id} tabId={tabId} block={block}>
      <Task label="Para pensar · 164–170" big="¿Qué falta?">
        <p>Miren otra vez las tres tarjetas de lo que quedó fuera. Son{' '}
          <b>{noNumericas} columnas</b> de {COLS.length}: el departamento donde vives, el área
          en la que estudiaste, el sector en el que trabajas, qué tanto has usado Python, qué
          música escuchas.</p>
        <p>Nada de eso ha entrado todavía en ningún análisis de este curso. Y ya no hace falta
          creerme que tienen algo dentro: <b>lo acaban de ver</b>. La matriz de barras y la de
          cajas estaban llenas de repartos que cambian de una columna a otra — estructura, en
          dos tercios de la tabla, que el método de hoy no puede ni mirar.</p>
        <p>No es información de segunda: probablemente es la que <b>mejor distingue</b> a unas
          personas de otras en este salón.</p>
        <p>Así que la pregunta con la que salimos hoy es esa, tal cual: <b>¿qué falta?</b> — y,
          sobre todo, ¿qué se hace con lo que falta? Hoy no se responde. <b>La sesión que
          viene es la respuesta</b>, entera.</p>
      </Task>

      <Idea>El PCA no se quedó corto: se quedó sin variables que mirar.{' '}
        <span className="who">{noNumericas} de {COLS.length} columnas ni siquiera pudieron
          entrar.</span></Idea>

      <Task
        label="Ticket de salida · chat · 2 minutos"
        big={<>Nombra una columna de la tabla que quedó fuera del análisis, y di por qué quedó
          fuera.</>}
      >
        <p>Hoy salieron columnas por <b>tres motivos distintos</b>, y la mitad del trabajo de
          la sesión fue distinguirlos. Una columna, un motivo: el que la cadena le dio, no el
          que a uno le parezca.</p>
      </Task>

      <Pair>
        <Prose>
          <h4>Respuestas que sirven</h4>
          <List>
            <li>«<b>{nombre(descartada)}</b>: se descartó porque {DESCARTADA[descartada].motivo}.
              Era una cantidad; lo que falló fue cómo se recogió.»</li>
            <li>«<b>{noAnalizables.map(nombre).join('</b> o <b>')}</b>: no son categorías —{' '}
              {NO_ANALIZABLES[noAnalizables[0]].motivo}—, así que no hay nada que agrupar ni que
              contar.»</li>
            <li>«<b>{nombre(CATEGORICAS[1])}</b>, o cualquiera de las {noNumericas} que no son
              números: quedó limpia, agrupada y rellena, y aun así no entró, porque el PCA
              trabaja con varianzas y una categoría no tiene.»</li>
          </List>
        </Prose>
        <Prose>
          <h4>Respuestas que no</h4>
          <List>
            <li>«{nombre(descartada)}, porque estaba sucia» — no estaba sucia: estaba mal
              recogida, y eso no se arregla limpiando.</li>
            <li>«El departamento, porque es texto» — el texto se estandarizó y se agrupó en el
              paso 1; el motivo es que no es un número, que es otra cosa.</li>
            <li>«Ninguna, la tabla quedó limpia» — quedó limpia <b>y</b> más de la mitad
              quedó fuera del análisis. Las dos cosas son ciertas a la vez.</li>
          </List>
        </Prose>
      </Pair>

      <h3>Lo que queda</h3>
      <Prose>
        <p>Salimos con una tabla utilizable: el texto estandarizado, los atípicos a la vista
          y decididos, los huecos rellenos y marcados, una bitácora que dice qué se hizo con
          cada celda, y un plano que resume {COLS.length - noNumericas - 1} de las {COLS.length}{' '}
          columnas y lo dice honestamente. Y con una pregunta abierta sobre las otras{' '}
          {noNumericas}.</p>
        <p>La sesión que viene se llama <b>«{meta07.title}»</b>:{' '}
          {meta07.goal.charAt(0).toLowerCase() + meta07.goal.slice(1)} Empieza por lo más pequeño
          que hoy quedó sin leer: <b>dos</b> de esas columnas, juntas.</p>
      </Prose>
    </Panel>
  );
}
