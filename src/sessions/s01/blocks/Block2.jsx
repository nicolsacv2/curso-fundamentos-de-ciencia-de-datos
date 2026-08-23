import { Panel, Task, Diagram, Cards, Card } from '../../../components/content/index.jsx';
import { lifecycle, timeSplit } from '../figures/block2.js';

export default function Block2({ id, tabId }) {
  return (
    <Panel id={id} tabId={tabId}>
      <p className="eyebrow">Bloque 2</p>
      <h2>El ciclo de vida de un proyecto de datos</h2>
      <p className="lead">Siete etapas, y una flecha que vuelve al principio. Casi ningún proyecto
        real recorre el círculo una sola vez.</p>

      <Diagram fig={lifecycle}>
        El orden importa: la pregunta va primero. Un proyecto que empieza por los
        datos disponibles casi siempre termina respondiendo lo que se podía, no lo que hacía falta.
      </Diagram>

      <h3>Dónde se va el tiempo de verdad</h3>
      <Diagram fig={timeSplit}>
        Proporciones aproximadas, repetidas una y otra vez en encuestas del sector.
        Sirven para el orden de magnitud: <b>la mayor parte del trabajo ocurre antes de modelar</b>,
        y esa parte no sale en las noticias.
      </Diagram>

      <h3>Quién hace qué</h3>
      <Cards cols="c4">
        <Card k="Analista de datos" t="Responde preguntas">
          Toma los datos que ya existen y saca de ellos una respuesta que alguien pidió.
        </Card>
        <Card k="Ingeniero de datos" t="Construye las tuberías">
          Hace que los datos lleguen, limpios y a tiempo, al lugar donde se usan.
        </Card>
        <Card k="Científico de datos" t="Formula y modela">
          Convierte un problema difuso del negocio en algo medible, y a veces en un modelo.
        </Card>
        <Card k="Ingeniero de ML" t="Lo pone a funcionar">
          Lleva el modelo del portátil al mundo real, donde tiene que responder todos los días.
        </Card>
      </Cards>

      <Task
        label="Trabajo individual · 10 minutos"
        big="Una plataforma de streaming quiere reducir las cancelaciones."
      >
        <p>En tu zona del tablero tienes las siete etapas revueltas. Ordénalas, y debajo de cada
          una escribe <b>una acción concreta</b> para este caso. No vale repetir el nombre de la etapa.</p>
      </Task>
    </Panel>
  );
}
