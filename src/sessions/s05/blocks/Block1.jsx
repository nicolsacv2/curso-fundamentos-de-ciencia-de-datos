import { Panel, Diagram, Story, StoryHead, Pair, Prose, List, Idea, Task }
  from '../../../components/content/index.jsx';
import { barras, circular, caja, histograma, dispersion } from '../figures/block1.js';
import Cloud3D from '../views/Cloud3D.jsx';
import { PAISES, ANIO, FUENTE } from '../data/paises.js';

/* One card per chart, always the same four boxes — what data it takes, what question it
   answers, how it is built, and the drawn example. The repetition is deliberate: the
   comparison between five charts only works if they are described the same way. */
function Ficha({ num, nombre, dato, pregunta, construccion, children }) {
  return (
    <Story>
      <StoryHead num={num} place={dato}>{nombre}</StoryHead>
      <Pair>
        <Prose>
          <h4>Qué pregunta responde</h4>
          <p>{pregunta}</p>
        </Prose>
        <Prose>
          <h4>Cómo se construye</h4>
          {construccion}
        </Prose>
      </Pair>
      {children}
    </Story>
  );
}

export default function Block1({ id, tabId }) {
  return (
    <Panel id={id} tabId={tabId}>
      <p className="eyebrow">Bloque 1 · 35–75</p>
      <h2>Cinco gráficos</h2>

      <Task label="La regla del bloque" big="Cada gráfico admite un tipo de dato y responde
        una pregunta. Elegir mal no es un error de estilo: deforma lo que querías mostrar.">
        <p>Los cinco salen de los mismos {PAISES.length} países, así que las diferencias que
          vas a ver entre ellos son diferencias entre los gráficos, no entre los datos.</p>
      </Task>

      <Ficha num="01" nombre="Barras" dato="una categoría y un número"
        pregunta="¿Cuál es mayor? ¿En qué orden van? Es el gráfico para comparar cantidades
          entre grupos que no tienen orden natural."
        construccion={
          <List>
            <li>Una barra por categoría, todas del mismo ancho.</li>
            <li>La longitud es proporcional al valor.</li>
            <li>Todas arrancan en la <b>misma línea de base, y esa base es cero</b>. Si la
              cortas, las diferencias se exageran solas — volveremos a eso en el cierre.</li>
          </List>
        }>
        <Diagram fig={barras}>
          Esperanza de vida media por región. Datos de {FUENTE.nombre} ({ANIO}).
        </Diagram>
      </Ficha>

      <Ficha num="02" nombre="Circular" dato="partes de un mismo todo"
        pregunta="¿Qué fracción del total es cada parte? Solo tiene sentido si las partes
          suman el todo y no se solapan."
        construccion={
          <List>
            <li>Los 360° del círculo se reparten en proporción: el ángulo de cada sector es
              su fracción del total.</li>
            <li>Por eso solo admite partes de un todo: si los trozos no suman 100 %, el
              círculo miente sobre algo que ni siquiera existe.</li>
            <li>Su punto débil está a la vista: <b>comparar ángulos es mucho más difícil
              que comparar longitudes</b>. Por eso al lado van las cifras.</li>
          </List>
        }>
        <Diagram fig={circular}>
          Cómo se reparten los {PAISES.length} países entre las cuatro regiones.
        </Diagram>
      </Ficha>

      <Ficha num="03" nombre="Caja" dato="una variable numérica, por grupos"
        pregunta="¿Cómo se reparte esta variable? ¿Dónde está el grueso, cuánto se estira y
          qué se sale de lo normal?"
        construccion={
          <List>
            <li>Son los cinco números de la sesión pasada, dibujados: la caja va del cuartil
              1 al 3, la línea gruesa de dentro es la mediana.</li>
            <li>Los bigotes llegan hasta el dato más lejano que siga estando a menos de una
              vez y media el rango intercuartílico.</li>
            <li>Lo que queda fuera se dibuja punto a punto: son los <b>atípicos</b>, y no se
              esconden.</li>
          </List>
        }>
        <Diagram fig={caja}>
          Hijos por mujer en cada región. En rojo, los países atípicos de su grupo.
        </Diagram>
      </Ficha>

      <Ficha num="04" nombre="Histograma" dato="una variable numérica"
        pregunta="¿Qué forma tiene el reparto? ¿Está centrado, tiene una cola larga, tiene
          dos montones?"
        construccion={
          <List>
            <li>Se parte el recorrido de la variable en <b>intervalos del mismo ancho</b> y
              se cuenta cuántos casos caen en cada uno.</li>
            <li>La altura de cada barra es esa cuenta. Las barras se tocan, porque el eje es
              continuo: no son categorías sueltas, es una recta partida.</li>
            <li>Y aquí está la decisión: <b>el ancho del intervalo no viene con los
              datos</b>. La misma variable cambia de forma según lo que elijas.</li>
          </List>
        }>
        <Diagram fig={histograma}>
          El mismo PIB per cápita, dos anchos de intervalo. Ninguno de los dos está mal;
          cuentan cosas distintas.
        </Diagram>
      </Ficha>

      <Ficha num="05" nombre="Dispersión" dato="dos variables numéricas"
        pregunta="¿Se mueven juntas? Es el único de los cinco que responde por dos variables
          a la vez, y es donde vive la correlación de la entrada."
        construccion={
          <List>
            <li>Un eje por variable y <b>un punto por caso</b>: cada país aporta sus dos
              valores y se coloca donde se cruzan.</li>
            <li>No hay que ordenar ni agrupar nada: el gráfico no resume, muestra los 183.</li>
            <li>La inclinación de la nube es el r que definimos en la entrada.</li>
          </List>
        }>
        <Diagram fig={dispersion}>
          PIB per cápita contra esperanza de vida, con Colombia leída sobre los dos ejes.
        </Diagram>
      </Ficha>

      <h3>¿Y si son tres variables?</h3>
      <Prose>
        <p>El diagrama de dispersión aguanta dos. Con tres todavía se puede: un eje más, y la
          nube se va al aire. Gírala — es la misma tabla, con una columna más.</p>
      </Prose>

      <Cloud3D>
        Tres de los cuatro indicadores, un punto por país. Datos de {FUENTE.nombre} ({ANIO}),
        {' '}{FUENTE.licencia}.
      </Cloud3D>

      <Idea>Cada gráfico admite un tipo de dato y responde una pregunta.{' '}
        <span className="who">La cuarta variable, sin embargo, ya no tiene eje donde ir.</span></Idea>
    </Panel>
  );
}
