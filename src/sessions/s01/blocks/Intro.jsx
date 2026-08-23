import { Panel, Task, Diagram } from '../../../components/content/index.jsx';
import { wordCloud } from '../figures/intro.js';

export default function Intro({ id, tabId }) {
  return (
    <Panel id={id} tabId={tabId}>
      <h2>Antes de cualquier definición</h2>

      <Task label="Todos responden · Mentimeter" big="«Ciencia de datos es…»">
        <p>Una sola palabra. La primera que se te venga a la cabeza. No hay respuesta correcta.</p>
      </Task>

      <Diagram fig={wordCloud}>
        Diagrama de nube de palabras sobre "La ciencia de datos es...".
      </Diagram>
    </Panel>
  );
}
