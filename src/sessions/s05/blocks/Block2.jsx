import { Panel } from '../../../components/content/index.jsx';
import Cloud3D from '../views/Cloud3D.jsx';
import { FUENTE, ANIO, PCA3 } from '../data/paises.js';

export default function Block2({ id, tabId }) {
  return (
    <Panel id={id} tabId={tabId}>
      <p className="eyebrow">Bloque 2 · 83–120</p>
      <h2>La sombra de la nube</h2>

      <Cloud3D plane projections>
        La misma nube del bloque 1, con el plano de las dos primeras componentes dentro y
        la sombra de cada país sobre él. Gírala hasta ver el plano de canto: las sombras
        caen en una línea. {PCA3.porcentajes[0]} % y {PCA3.porcentajes[1]} % de la varianza.
        {' '}Datos de {FUENTE.nombre} ({ANIO}), {FUENTE.licencia}.
      </Cloud3D>
    </Panel>
  );
}
