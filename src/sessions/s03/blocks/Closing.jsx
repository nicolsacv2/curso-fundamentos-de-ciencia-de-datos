import { Panel, Task, Pair, Prose, Idea } from '../../../components/content/index.jsx';
import { MEDIAS } from '../data/salon.js';

export default function Closing({ id, tabId }) {
  return (
    <Panel id={id} tabId={tabId}>
      <p className="eyebrow">Cierre · 166–180</p>
      <h2>La decisión que cambia la conclusión</h2>

      <Task
        label="Ticket de salida · chat · 2 minutos"
        big={<>Nombra una decisión que tomamos hoy y di qué conclusión cambiaría si hubiéramos
          decidido lo contrario.</>}
      >
        <p>Una línea, con las <b>dos mitades</b>. La primera es fácil porque acabamos de votarla;
          la segunda es la que enseña, y es la que no vale saltarse.</p>
      </Task>

      <Pair>
        <Prose>
          <h4>Respuestas que sirven</h4>
          <ul className="list" style={{ marginTop: '16px' }}>
            <li>Unificamos los seis «Bogotá» — si no, la ciudad de más de la mitad del salón se
              habría partido en seis grupos de una a cinco personas.</li>
            <li>Dejamos la columna F fuera — si hubiéramos multiplicado los valores pequeños por
              60, el promedio habría pasado de {MEDIAS.sinAtipico} a {MEDIAS.horasAMinutos} minutos.</li>
            <li>No rellenamos las siete vacías de E — si lo hubiéramos hecho, habríamos afirmado
              que quien no revisa su celular lo usa como quien sí.</li>
            <li>No borramos la fila 16 — si la borramos, Boyacá y Derecho desaparecen del salón.</li>
          </ul>
        </Prose>
        <Prose>
          <h4>Respuestas que no</h4>
          <ul className="list" style={{ marginTop: '16px' }}>
            <li>«Limpiamos los datos» — no nombra ninguna decisión.</li>
            <li>«Unificamos Bogotá», y punto — nombra la decisión y se salta la consecuencia,
              que era la mitad del ejercicio.</li>
            <li>«La tabla quedó mejor» — mejor <em>para qué conclusión</em>. Sin eso, «mejor» no
              quiere decir nada.</li>
          </ul>
        </Prose>
      </Pair>

      <h3>Lo que queda escrito</h3>
      <Prose>
        <p>Salimos con dos archivos y no con uno: <b>salon_v1_crudo</b>, que no volvimos a tocar,
          y <b>salon_v2_limpio</b>, que es el que vamos a usar. Y con la bitácora, que es la única
          de las tres cosas que explica por qué la segunda no es igual a la primera.</p>
        <p>La sesión que viene calcula promedios, medianas y dispersión <b>sobre esta tabla</b>.
          Todo lo que salga de ahí depende de lo que votamos hoy, y eso ya no es una advertencia
          abstracta: hoy vimos la misma columna dar {MEDIAS.sinAtipico} y {MEDIAS.horasAMinutos}{' '}
          minutos según quién la limpiara.</p>
      </Prose>

      <Idea>El trabajo invisible es este.{' '}
        <span className="who">Y es donde se decide lo que va a decir la conclusión.</span></Idea>
    </Panel>
  );
}
