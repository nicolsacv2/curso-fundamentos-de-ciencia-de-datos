import { Panel, Task, Diagram, Prose, Idea } from '../../../components/content/index.jsx';
import { scattersPearson, rangosSpearman, simpsonTeaser } from '../figures/block3.js';

export default function Block3({ id, tabId }) {
  return (
    <Panel id={id} tabId={tabId}>
      <p className="eyebrow">Bloque 3 · 122–166</p>
      <h2>Cuando una columna mira a otra</h2>
      <p className="lead">Todo lo de hoy describe una columna a la vez. Las preguntas
        interesantes casi siempre son de a dos: ¿a más pantalla, menos lectura? ¿A más dosis,
        más mejoría? Para eso hay que medir <b>asociación</b>.</p>

      <Diagram fig={scattersPearson}>
        El <b>coeficiente de Pearson</b> resume cada nube en un número entre −1 y 1: qué tanto se
        parece la nube a una línea y hacia dónde va. Los tres primeros se portan bien. El cuarto
        es la advertencia de este bloque.
      </Diagram>

      <Task label="Chat · 128–136" big="En la cuarta nube, r ≈ 0. ¿Eso dice que las dos variables no tienen que ver?">
        <p>Míralo antes de contestar: cada punto obedece la misma regla, sin excepción. La
          relación es <b>perfecta</b> — solo que no es una línea. Una asociación lineal de cero
          no es lo mismo que independencia: <b>r</b> no busca relaciones, busca líneas rectas.</p>
      </Task>

      <h3>Preguntarle al orden en lugar del tamaño</h3>
      <Diagram fig={rangosSpearman}>
        El <b>coeficiente de Spearman</b> es Pearson calculado sobre los <b>rangos</b> — el
        puesto de cada punto en la fila, no su valor. Si la relación sube siempre, aunque sea en
        curva, los rangos forman una línea perfecta. Y como los rangos ignoran los tamaños, un
        atípico como la fila 16 tampoco puede arrastrarlo: es el pariente robusto, igual que la
        mediana lo es del promedio.
      </Diagram>

      <Prose>
        <p>La receta se repite: donde el promedio se dejaba arrastrar, la mediana miraba el
          orden; donde Pearson se despista con la curva, Spearman mira el orden. Casi toda la
          estadística robusta es esa sola idea — cambiar los tamaños por los puestos — aplicada
          en sitios distintos.</p>
      </Prose>

      <h3>La foto que dejamos pendiente</h3>
      <Diagram fig={simpsonTeaser}>
        Un medicamento, dos grupos de edad. Dentro de los jóvenes, más dosis se asocia con más
        mejoría. Dentro de los mayores, <b>también</b>. Revueltos, la asociación global da la
        vuelta y «muestra» que la dosis empeora. Ninguna de las tres líneas está mal calculada.
      </Diagram>

      <Prose>
        <p>Esto se llama la <b>paradoja de Simpson</b> y hoy no la vamos a resolver: se resuelve
          en la sesión 6, cuando hablemos de causalidad y de cómo se decide quién recibe qué
          dosis. Hoy basta con llevarse la incomodidad: una asociación puede ser correcta en cada
          grupo y decir lo contrario en el total, así que <b>«¿asociado con qué, dentro de
          qué?»</b> es parte de la pregunta, no un detalle.</p>
      </Prose>

      <Idea>r no mide si hay relación.{' '}
        <span className="who">Mide si hay una línea.</span></Idea>
    </Panel>
  );
}
