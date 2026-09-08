import { Panel } from '../../../components/content/index.jsx';

export default function Intro({ id, tabId }) {
  return (
    <Panel id={id} tabId={tabId}>
      <p className="eyebrow">Entrada · 0–35</p>
      <h2>Tres fórmulas encadenadas</h2>
    </Panel>
  );
}
