import { Panel, Diagram, Cards, Card, Pair, Prose, List, Idea, Task }
  from '../../../components/content/index.jsx';
import formulas, { scatter } from '../figures/intro.js';
import { VARS, ANIO, FUENTE, PAISES, ESTAD } from '../data/paises.js';

export default function Intro({ id, tabId }) {
  return (
    <Panel id={id} tabId={tabId}>
      <p className="eyebrow">Entrada · 0–35</p>
      <h2>Tres fórmulas encadenadas</h2>

      <Task label="Para empezar · 3 minutos" big="Cuatro variables no caben en un papel de dos
        dimensiones; vamos a dibujarlas todas y a perder menos de lo que crees.">
        <p>La sesión pasada resumimos con números. Hoy los volvemos dibujo, y para eso hace
          falta una medida más: la que dice si dos variables se mueven juntas. Esa medida
          se construye en tres pasos, y ninguno es nuevo.</p>
      </Task>

      <h3>Con qué vamos a trabajar</h3>
      <Prose>
        <p>Hoy no usamos la tabla del salón. Usamos <b>{PAISES.length} países</b> con cuatro
          indicadores de {FUENTE.nombre}, todos del año <b>{ANIO}</b> — el último que la
          fuente publica. Son variables que ya sabes leer, y eso deja la atención libre para
          lo que sí es nuevo: los gráficos.</p>
      </Prose>

      <Cards cols="c4">
        {VARS.map(([key, nombre, unidad, mide]) => (
          <Card key={key} k={unidad} t={nombre}>{mide}</Card>
        ))}
      </Cards>

      <h3>De la varianza a la correlación</h3>
      <Diagram fig={formulas}>
        Las tres se construyen una sobre otra: la correlación no es una medida nueva, es la
        covarianza a la que se le quitaron las unidades.
      </Diagram>

      <Pair>
        <Prose>
          <h4>La cadena, en palabras</h4>
          <List>
            <li>La <b>varianza</b> mide cuánto se separa una variable de su media. En la
              esperanza de vida da {ESTAD.vida.desv} años de desviación típica, que es su
              raíz cuadrada: <b>la desviación típica es la raíz de la varianza</b>.</li>
            <li>La <b>covarianza</b> hace lo mismo con dos variables a la vez. Y si le pasas
              dos veces la misma, vuelve la varianza: <b>la covarianza de una variable
              consigo misma es su varianza</b>. No son dos ideas, es una.</li>
            <li>La <b>correlación</b> es la covarianza dividida por el producto de las dos
              desviaciones típicas. Nada más.</li>
          </List>
        </Prose>
        <Prose>
          <h4>Qué se gana al dividir</h4>
          <List>
            <li>La covarianza entre PIB y esperanza de vida está en «dólares por año», una
              unidad que no significa nada para nadie. Al dividir por las desviaciones
              típicas, las unidades se cancelan: <b>la correlación no tiene unidades</b>.</li>
            <li>Y queda <b>acotada entre −1 y +1</b>. Eso es lo que la vuelve comparable:
              un 0,8 entre dos variables cualesquiera significa lo mismo que un 0,8 entre
              otras dos, aunque una se mida en dólares y la otra en hijos.</li>
            <li>El precio de esa comodidad lo pagamos la sesión pasada, con la parábola de
              r ≈ 0: solo sabe buscar líneas.</li>
          </List>
        </Prose>
      </Pair>

      <h3>Dónde se lee ese número</h3>
      <Prose>
        <p>Una correlación no se mira en una tabla, se mira en un <b>diagrama de
          dispersión</b>: un punto por país, una variable en cada eje. Cómo se construye lo
          vemos en el bloque siguiente, con los otros cuatro gráficos; por ahora basta con
          saber que r es la inclinación de esta nube.</p>
      </Prose>

      <Diagram fig={scatter}>
        Cada punto es un país. Datos de {FUENTE.nombre} ({ANIO}), {FUENTE.licencia}.
      </Diagram>

      <Idea>La correlación no es una medida nueva: es la covarianza sin unidades.{' '}
        <span className="who">Por eso se puede comparar, y por eso solo ve líneas.</span></Idea>
    </Panel>
  );
}
