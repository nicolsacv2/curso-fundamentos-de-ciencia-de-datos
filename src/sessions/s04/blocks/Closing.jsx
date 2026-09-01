import { Panel, Task, Pair, Prose, Idea } from '../../../components/content/index.jsx';
import { MINUTOS, MINUTOS_SIN } from '../data/salon.js';

export default function Closing({ id, tabId }) {
  return (
    <Panel id={id} tabId={tabId}>
      <p className="eyebrow">Cierre · 166–180</p>
      <h2>El resumen que esconde</h2>

      <Task
        label="Ticket de salida · chat · 2 minutos"
        big={<>Nombra un resumen que calculamos hoy y di qué cosa de los datos quedó escondida
          detrás de él.</>}
      >
        <p>Una línea con las <b>dos mitades</b>: el número y su punto ciego. La primera mitad es
          repasar; la segunda es la que muestra que entendiste con qué cuidado usarlo.</p>
      </Task>

      <Pair>
        <Prose>
          <h4>Respuestas que sirven</h4>
          <ul className="list" style={{ marginTop: '16px' }}>
            <li>El promedio de F ({MINUTOS.media}) — esconde que una sola fila lo sostiene: sin
              ella cae a {MINUTOS_SIN.media}.</li>
            <li>La mediana de F ({MINUTOS.mediana}) — esconde los extremos por diseño: 960 y 420
              no dejan rastro en ella.</li>
            <li>El «120 de promedio» de los tres enjambres — esconde la dispersión entera: tres
              grupos distintos con el mismo carné.</li>
            <li>El r ≈ 0 de la parábola — esconde una relación perfecta, porque solo sabe buscar
              líneas.</li>
          </ul>
        </Prose>
        <Prose>
          <h4>Respuestas que no</h4>
          <ul className="list" style={{ marginTop: '16px' }}>
            <li>«El promedio puede engañar» — ¿cuál promedio, escondiendo qué? Sin el punto
              ciego concreto es un refrán, no una respuesta.</li>
            <li>«Hay que usar la mediana» — la mediana también esconde; cambiar de resumen no
              elimina el punto ciego, lo cambia de lugar.</li>
            <li>«Los datos mienten» — hoy ningún número mintió: todos eran correctos y todos
              escondían algo. Esa es exactamente la diferencia.</li>
          </ul>
        </Prose>
      </Pair>

      <h3>Lo que queda</h3>
      <Prose>
        <p>Salimos con una caja de resúmenes y el precio de cada uno: centros que responden
          preguntas distintas, dispersiones que dicen cuánto creerle al centro, y coeficientes
          de asociación que miden líneas y órdenes, no verdades. Y con dos deudas anotadas: la
          paradoja de Simpson espera a la sesión 6, y todos los números de hoy — el {MINUTOS.media},
          el {MINUTOS.mediana}, el {MINUTOS.desviacion} — siguen dependiendo de lo que votamos al
          limpiar la tabla.</p>
        <p>La sesión que viene los volvemos <b>dibujo</b>: qué gráfico le corresponde a cada
          resumen, y cómo detectar un gráfico que miente aunque sus números sean ciertos.</p>
      </Prose>

      <Idea>Todo resumen es una decisión sobre qué esconder.{' '}
        <span className="who">Describir con criterio es saber qué escondiste.</span></Idea>
    </Panel>
  );
}
