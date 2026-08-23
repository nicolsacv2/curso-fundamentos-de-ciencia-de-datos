import { Panel, Task, Diagram, Prose, Idea, Milestones } from '../../../components/content/index.jsx';
import { dataCurve, MILESTONES } from '../figures/closing.js';

export default function Closing({ id, tabId }) {
  return (
    <Panel id={id} tabId={tabId}>
      <p className="eyebrow">Cierre</p>
      <h2>La curva que lo explica todo</h2>

      <Diagram fig={dataCurve} width="1100px">
        Datos producidos en el mundo, en zettabytes al año. Cifras redondeadas de
        estimaciones públicas del sector: sirven para el orden de magnitud, no para citarlas al
        decimal. El tramo punteado es proyección.
      </Diagram>

      <Prose>
        <p>Durante casi toda la historia registrada, la humanidad produjo una cantidad de datos
          que en este eje <b>ni siquiera se despega del suelo</b>. John Snow trabajó con una lista
          de muertes y un mapa dibujado a mano. Wald, con unas tablas de impactos. Con eso bastó
          para cambiar decisiones importantes.</p>
        <p>Después la curva despega, y despega por razones concretas: primero máquinas que
          tabulan, luego máquinas que almacenan, luego una red que conecta, luego un sensor en
          cada bolsillo.</p>
      </Prose>

      <Idea>La ciencia de datos no nació cuando aparecieron las computadoras.
        Nació cuando alguien miró un mapa y preguntó por qué. Lo que cambió no fue la pregunta:{' '}
        <span className="who">fue cuántos datos hay para responderla.</span></Idea>

      <h3>Los escalones de esa rampa</h3>
      <Milestones items={MILESTONES} />

      <Task label="Reto para la próxima sesión · 15 minutos" big="Trae una cifra y una pregunta incómoda.">
        <p>Para la próxima sesión trae una noticia o publicación que use un número, y junto a ella una
          pregunta incómoda sobre ese número: <b>quién lo midió</b>, <b>a quién le conviene</b>,
          <b>quién quedó fuera de la muestra</b>.</p>
      </Task>
    </Panel>
  );
}
