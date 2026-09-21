import { Panel, Pendiente } from '../../../components/content/index.jsx';

/* Block 1 · MCA. Mounted and labelled, not written — see s06/meta.js.
   It is the one block that says what it is for, because the entrada ends on a
   question and a question with nowhere to land is worse than no question. */
export default function Block1({ id, tabId, block }) {
  return (
    <Panel id={id} tabId={tabId} block={block}>
      <Pendiente tema="el análisis de correspondencias múltiples">
        <p>Es aquí donde se responde la pregunta con la que termina la entrada:
          qué hacer con las variables que quedaron fuera del análisis por no ser
          números.</p>
      </Pendiente>
    </Panel>
  );
}
