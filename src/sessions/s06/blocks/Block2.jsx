import { Panel, Pendiente } from '../../../components/content/index.jsx';

/* Block 2 · FAMD. Mounted and labelled, not written — see s06/meta.js. */
export default function Block2({ id, tabId, block }) {
  return (
    <Panel id={id} tabId={tabId} block={block}>
      <Pendiente tema="el análisis factorial de datos mixtos" />
    </Panel>
  );
}
