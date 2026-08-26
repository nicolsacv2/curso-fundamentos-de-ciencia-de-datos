import { Panel, Task, Pair, Prose, Idea } from '../../../components/content/index.jsx';

export default function Closing({ id, tabId }) {
  return (
    <Panel id={id} tabId={tabId}>
      <p className="eyebrow">Cierre · 166–180</p>
      <h2>Tu pregunta, y de dónde saldrán sus datos</h2>

      <Task
        label="Ticket de salida · encuesta · 2 minutos"
        big={<>Nombra una variable de <em>nuestro</em> dataset y di qué la puede ensuciar.</>}
      >
        <p>Una línea, con esta forma: <b>«[variable] — [qué la ensucia]»</b>. Vale cualquiera de
          las que acabamos de recoger. Es la puerta de entrada a la sesión 3, que va entera sobre
          eso.</p>
      </Task>

      <Pair>
        <Prose>
          <h4>Respuestas que sirven</h4>
          <ul className="list" style={{ marginTop: '16px' }}>
            <li><b>Minutos de traslado</b> — unos contaron puerta a puerta y otros solo el bus.</li>
            <li><b>Tazas de café</b> — nadie definió si el tinto pequeño cuenta igual que el grande.</li>
            <li><b>Estrés del 1 al 5</b> — mi 4 y tu 4 no son la misma cantidad de nada.</li>
            <li><b>Hora de dormir</b> — quien puso «00:30» y quien puso «12:30» escribieron lo mismo.</li>
          </ul>
        </Prose>
        <Prose>
          <h4>Respuestas que no</h4>
          <ul className="list" style={{ marginTop: '16px' }}>
            <li>«Los datos están malos» — no nombra ninguna variable.</li>
            <li>«La gente miente» — puede ser, pero no dice <em>en cuál</em> ni <em>por qué ahí</em>.</li>
            <li>«Faltan más respuestas» — eso es tamaño de muestra, que es otro problema y ya lo vimos.</li>
          </ul>
        </Prose>
      </Pair>

      <Idea>Los datos no estaban ahí esperando.{' '}
        <span className="who">Alguien los fabricó, y hoy ese alguien fuiste tú.</span></Idea>
    </Panel>
  );
}
