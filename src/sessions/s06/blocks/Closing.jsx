import { Panel, Pendiente } from '../../../components/content/index.jsx';

/* Closing. Mounted and labelled, not written — see s06/meta.js. */
export default function Closing({ id, tabId, block }) {
  return (
    <Panel id={id} tabId={tabId} block={block}>
      <Pendiente tema="el cierre de la sesión" />
    </Panel>
  );
}
