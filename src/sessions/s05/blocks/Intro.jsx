import { Panel, Diagram } from '../../../components/content/index.jsx';
import formulas from '../figures/intro.js';

export default function Intro({ id, tabId }) {
  return (
    <Panel id={id} tabId={tabId}>
      <p className="eyebrow">Entrada · 0–35</p>
      <h2>Tres fórmulas encadenadas</h2>

      <Diagram fig={formulas}>
        Las tres se construyen una sobre otra: la correlación no es una medida nueva, es la
        covarianza a la que se le quitaron las unidades.
      </Diagram>
    </Panel>
  );
}
