import { Panel, Pendiente } from '../../../components/content/index.jsx';

/* Block 3 · segmentation. Mounted and labelled, not written — see s06/meta.js. */
export default function Block3({ id, tabId, block }) {
  return (
    <Panel id={id} tabId={tabId} block={block}>
      <Pendiente tema="la segmentación" />
    </Panel>
  );
}
