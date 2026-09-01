import {
  Panel, Task, Options, Cards, Card, Diagram, Prose, Idea
} from '../../../components/content/index.jsx';
import { MINUTOS, BALANCEADA } from '../data/salon.js';
import { centrosTriangulo, perdidas, cuantiles } from '../figures/block1.js';
import TriangleActivity from '../activities/TriangleActivity.jsx';

export default function Block1({ id, tabId }) {
  return (
    <Panel id={id} tabId={tabId}>
      <p className="eyebrow">Bloque 1 · 25–70</p>
      <h2>¿Cuál es el centro?</h2>
      <p className="lead">Resumir una columna en un solo número suena a operación única: «el
        centro». Vamos a buscar el centro de algo mucho más simple que una columna — un
        triángulo — y ver que ni ahí existe uno solo.</p>

      <Task label="Actividad · en tu pantalla · 25–45" big="Encuentra el centro de este triángulo.">
        <Options steps>
          <li>Escribe tu nombre y construye el triángulo: <b>lado 5, ángulo 60°, lado 6</b>.</li>
          <li>Pasa el cursor por la <b>mitad de cada lado</b>: aparece una marca; tócala y
            queda registrado el punto medio.</li>
          <li>Une cada vértice con el punto medio del lado <b>opuesto</b>: <b>arrastra</b> del
            vértice al punto medio. Las tres líneas se cruzan en un punto. Ahí está: el centro.</li>
          <li>Ahora, desde el punto medio de cada lado, <b>arrastra a pulso la perpendicular</b>
            hacia donde creas que es. Si le atinas a menos de 15°, el trazo se endereza solo y
            queda marcado con ⊥. Las tres también se cruzan en un punto… y no es el mismo.</li>
          <li>Decide: <b>«Elegir el centro»</b>, toca el lienzo donde creas que está, y{' '}
            <b>Enviar</b>. Tu apuesta queda marcada con una ✕ y tu nombre, junto a las de todo
            el salón — y las comparamos contra los centros de verdad.</li>
        </Options>
      </Task>

      <TriangleActivity />

      <Diagram fig={centrosTriangulo}>
        Las medianas se cruzan en el <b>baricentro</b> — donde el triángulo se equilibra sobre un
        dedo. Las mediatrices, en el <b>circuncentro</b> — el punto que queda a la misma distancia
        de las tres esquinas. Las bisectrices, en el <b>incentro</b>. Tres construcciones
        correctas, tres respuestas.
      </Diagram>

      <Prose>
        <p>«¿Cuál es el centro?» resultó ser una pregunta incompleta: falta decir <b>centro para
          qué</b>. ¿Para equilibrar? El baricentro. ¿Para quedar igual de lejos de las esquinas?
          El circuncentro. Con una columna de números pasa exactamente lo mismo, y los tres
          centros de una columna tienen nombre propio.</p>
      </Prose>

      <Cards cols="c3">
        <Card k="Promedio" t={`${MINUTOS.media} min`}>
          Suma los {MINUTOS.n} valores de la columna F y reparte por igual. Usa toda la
          información — y por eso mismo cualquier valor extremo lo arrastra.
        </Card>
        <Card k="Mediana" t={`${MINUTOS.mediana} min`}>
          Ordena la fila y toma el del medio: la mitad del salón está por debajo, la mitad por
          encima. Solo le importa el orden, no los tamaños.
        </Card>
        <Card k="Moda" t={`${MINUTOS.moda} min`}>
          El valor más repetido: {MINUTOS.modaVeces} personas contestaron {MINUTOS.moda}. Es el
          único de los tres que también funciona cuando la columna no es numérica.
        </Card>
      </Cards>

      <h3>La discusión pendiente de la sesión 3</h3>
      <Prose>
        <p>Quedamos debiendo una respuesta: ¿se puede promediar la columna H, la de «alimentación
          balanceada del 1 al 5»? El promedio da <b>{BALANCEADA.media}</b>, y ese número suma
          etiquetas: el 5 de la fila 16 — la que comió cero porciones de fruta — no es «cinco
          veces» el 1 de la fila 1, así que la suma no significa nada. Lo que sí se puede: la{' '}
          <b>mediana es {BALANCEADA.mediana}</b> — la respuesta del medio — y la moda es doble,
          {' '}<b>{BALANCEADA.modas[0]} y {BALANCEADA.modas[1]}</b>, con {BALANCEADA.modaVeces}{' '}
          personas cada una. Para una escala ordinal, el centro se busca con orden y con conteo,
          no con suma.</p>
      </Prose>

      <h3>Por qué el promedio y la mediana son esos y no otros</h3>
      <Diagram fig={perdidas}>
        Cada punto de la curva responde una pregunta: «si resumiera la columna con este número,
        ¿cuánto me equivoco en total?». Penalizando el error <b>al cuadrado</b>, el mejor número
        posible es el promedio. Penalizando el error <b>absoluto</b>, es la mediana. Elegir
        resumen es elegir qué errores te duelen más.
      </Diagram>

      <h3>Y la mediana tiene familia</h3>
      <Diagram fig={cuantiles}>
        La mediana parte la fila en dos mitades; los <b>cuartiles</b> la parten en cuatro grupos
        iguales de personas, y los <b>percentiles</b> en cien. Los cortes igualan <b>gente</b>,
        no minutos: entre Q1 y la mediana hay 5 personas y 112.7 minutos; entre la mediana y Q3,
        las mismas 5 personas y solo 67.5 minutos.
      </Diagram>

      <Idea>«El centro» no existe.{' '}
        <span className="who">Existen preguntas distintas, cada una con su centro.</span></Idea>
    </Panel>
  );
}
