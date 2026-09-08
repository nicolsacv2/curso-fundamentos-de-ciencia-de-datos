import { Panel } from '../../../components/content/index.jsx';
import Cloud3D from '../views/Cloud3D.jsx';
import { FUENTE, ANIO } from '../data/paises.js';

export default function Block1({ id, tabId }) {
  return (
    <Panel id={id} tabId={tabId}>
      <p className="eyebrow">Bloque 1 · 35–75</p>
      <h2>Cinco gráficos</h2>

      <Cloud3D>
        Tres de los cuatro indicadores, un punto por país. Datos de {FUENTE.nombre} ({ANIO}),
        {' '}{FUENTE.licencia}.
      </Cloud3D>
    </Panel>
  );
}
