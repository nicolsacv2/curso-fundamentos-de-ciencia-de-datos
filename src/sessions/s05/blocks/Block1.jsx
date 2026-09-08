import { Panel, Diagram } from '../../../components/content/index.jsx';
import cloud3d from '../figures/cloud3d.js';
import { FUENTE, ANIO } from '../data/paises.js';

export default function Block1({ id, tabId }) {
  return (
    <Panel id={id} tabId={tabId}>
      <p className="eyebrow">Bloque 1 · 35–75</p>
      <h2>Cinco gráficos</h2>

      <Diagram fig={cloud3d}>
        Tres de los cuatro indicadores, un punto por país. Datos de {FUENTE.nombre} ({ANIO}),
        {' '}{FUENTE.licencia}.
      </Diagram>
    </Panel>
  );
}
