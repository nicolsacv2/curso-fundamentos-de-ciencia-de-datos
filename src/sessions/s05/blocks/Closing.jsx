import { Panel, Diagram, Task, Pair, Prose, List, Idea }
  from '../../../components/content/index.jsx';
import { tresDeMas, basura } from '../figures/closing.js';
import { PAISES, PCA4, ANIO } from '../data/paises.js';

export default function Closing({ id, tabId }) {
  const dos = (PCA4.porcentajes[0] + PCA4.porcentajes[1]).toFixed(1);

  return (
    <Panel id={id} tabId={tabId}>
      <p className="eyebrow">Cierre · 166–180</p>
      <h2>Gráficos que estorban</h2>

      <Prose>
        <p>Los cuatro gráficos que siguen dibujan datos que ya leíste bien hoy: los mismos
          {' '}{PAISES.length} países, los mismos indicadores, el mismo año. <b>Ningún número
          está mal.</b> Lo que falla es el dibujo, y por eso duelen: no hay nada que
          verificar, solo algo que rehacer.</p>
      </Prose>

      <Diagram fig={tresDeMas}>
        La tercera dimensión no lleva ninguna variable. Solo añade caras.
      </Diagram>

      <Prose>
        <p><b>Qué impide entender:</b> al levantar las barras, su extremo deja de tocar el
          eje. Cada barra tiene ahora una cara delantera y otra trasera a distinta altura, y
          el ojo no sabe cuál leer — así que ninguna de las cuatro cifras se puede sacar del
          dibujo. En la versión plana, el borde toca el eje y se lee y ya. Eso es todo lo que
          costó la tercera dimensión: los cuatro números.</p>
      </Prose>

      <Diagram fig={basura}>
        El mismo diagrama de dispersión del bloque 1, arruinado de tres maneras distintas.
      </Diagram>

      <Pair>
        <Prose>
          <h4>Qué impide entender cada uno</h4>
          <List>
            <li><b>Sin etiquetas:</b> hay ejes, hay escala, hay nube — y no hay forma de
              saber qué se está midiendo. Una nube sin unidades no se puede contradecir, y
              lo que no se puede contradecir tampoco enseña nada.</li>
            <li><b>Sin ejes:</b> queda la forma y se pierde la referencia. No se sabe dónde
              empieza el recuento ni cuánto vale la distancia entre dos puntos, así que la
              misma mancha sirve para defender cualquier cosa.</li>
            <li><b>Sobrecargado:</b> están los {PAISES.length} nombres, o sea que está todo.
              Y por eso no está nada: la tinta tapa los puntos que iba a explicar.</li>
          </List>
        </Prose>
        <Prose>
          <h4>El patrón</h4>
          <p>Los cuatro fallan por la misma razón, en dos direcciones opuestas: o le
            <b> quitan</b> al lector lo que necesita para leer —etiquetas, ejes, una base en
            cero— o le <b>añaden</b> lo que no pidió: una dimensión de más, todos los
            nombres, todo a la vez.</p>
          <p>Y ninguno se arregla con mejores datos. Se arreglan decidiendo otra vez qué
            mostrar, que es lo que hicimos toda la sesión: elegir el gráfico, elegir el
            ancho del intervalo, elegir el plano que conserva el {dos} %.</p>
        </Prose>
      </Pair>

      <Task
        label="Ticket de salida · chat · 2 minutos"
        big={<>Elige una de las cuatro variables de hoy, di con qué gráfico la mostrarías y
          qué decisión tuya quedaría dentro de ese dibujo.</>}
      >
        <p>Las <b>dos mitades</b> importan igual. La primera es elegir; la segunda es
          reconocer que elegir deja huella — el ancho del intervalo, la base del eje, las dos
          componentes que conservaste. Un gráfico sin decisiones no existe; uno que no las
          declara es el que acabamos de ver.</p>
      </Task>

      <Pair>
        <Prose>
          <h4>Respuestas que sirven</h4>
          <List>
            <li>«El PIB, con un histograma — y la decisión es el ancho del intervalo: con
              2 500 se ve la cola, con 20 000 desaparece.»</li>
            <li>«Los hijos por mujer, con cajas por región — y la decisión es qué cuento
              como atípico, porque eso mueve los bigotes.»</li>
            <li>«Las cuatro a la vez, con el plano factorial — y la decisión es quedarme con dos
              componentes y perder el {(100 - dos).toFixed(1)} % restante.»</li>
          </List>
        </Prose>
        <Prose>
          <h4>Respuestas que no</h4>
          <List>
            <li>«Un gráfico de barras, porque se ve mejor» — ¿mejor para qué pregunta? Sin la
              pregunta no hay gráfico correcto.</li>
            <li>«Uno en 3D, para que se vea más completo» — hoy vimos lo que cuesta esa
              palabra.</li>
            <li>«Cualquiera, los datos son los mismos» — son los mismos, y ese es justo el
              motivo por el que el dibujo decide lo que se entiende.</li>
          </List>
        </Prose>
      </Pair>

      <h3>Lo que queda</h3>
      <Prose>
        <p>Salimos con cinco gráficos y la pregunta que responde cada uno, con un método para
          mirar más variables de las que caben en la hoja, y con la costumbre de preguntar
          qué se perdió al dibujar. La correlación de la entrada terminó siendo un ángulo; la
          nube terminó siendo una sombra de la que sabemos el precio exacto: {dos} %.</p>
        <p>Para la próxima sesión no hay que traer nada. Volvemos a los mismos datos de
          {' '}{ANIO} con otra pregunta: cuándo dos cosas que se mueven juntas tienen algo que
          ver de verdad.</p>
      </Prose>

      <Idea>Ningún número de estos cuatro gráficos está mal.{' '}
        <span className="who">Lo que decide si se entiende es el dibujo, y el dibujo lo eliges tú.</span></Idea>
    </Panel>
  );
}
