import { Panel, Diagram, Pair, Prose, List, Idea, Task }
  from '../../../components/content/index.jsx';
import { transpuesta, planoFactorial, tresAngulos } from '../figures/block3.js';
import { PAISES, PCA4, VARS, CORR, ANIO, FUENTE } from '../data/paises.js';

export default function Block3({ id, tabId }) {
  const dos = (PCA4.porcentajes[0] + PCA4.porcentajes[1]).toFixed(1);
  const iv = VARS.findIndex(v => v[0] === 'vida');
  const if_ = VARS.findIndex(v => v[0] === 'fertilidad');
  const rVidaFert = CORR[iv][if_];
  const cargas = PCA4.cargas;
  const cosVidaFert = (() => {
    const [a, b] = [cargas[iv], cargas[if_]];
    return (a[0] * b[0] + a[1] * b[1]) / (Math.hypot(a[0], a[1]) * Math.hypot(b[0], b[1]));
  })();

  return (
    <Panel id={id} tabId={tabId}>
      <p className="eyebrow">Bloque 3 · 128–166</p>
      <h2>La tabla girada</h2>

      <Task label="El giro" big="Si las cuatro variables no caben en una escena, dejemos de
        mirar los países y miremos las variables.">
        <p>Hasta ahora cada fila era un país y cada columna un indicador. La nube dibujaba
          {' '}<b>países</b>. Pero la tabla se puede girar, y entonces lo que se dibuja son
          las <b>variables</b> — y de esas solo hay cuatro.</p>
      </Task>

      <Diagram fig={transpuesta}>
        Los mismos números, girados. Se muestran 6 de los {PAISES.length} países; con las
        cuatro filas está la tabla entera. Datos de {FUENTE.nombre} ({ANIO}).
      </Diagram>

      <Pair>
        <Prose>
          <h4>Una variable pasa a ser un registro</h4>
          <p>Al <b>transponer</b> la tabla, cada variable deja de ser una columna y se
            convierte en una fila: en un registro más, con {PAISES.length} valores. Ya no
            hay {PAISES.length} casos con 4 medidas, hay 4 casos con {PAISES.length}
            {' '}medidas.</p>
          <p>Y a un registro se le puede hacer lo mismo que a un país: colocarlo como un
            {' '}<b>vector</b>. Cada variable es ahora una flecha.</p>
        </Prose>
        <Prose>
          <h4>Dos vistas del mismo análisis</h4>
          <p>El plano del bloque anterior colocaba los <b>individuos</b>: un punto por país.
            El <b>plano factorial</b> de este bloque coloca las <b>variables</b>: una flecha
            por indicador.</p>
          <p>No son dos análisis, son <b>las dos caras del mismo</b>. Salen de la misma
            matriz y de los mismos autovectores; lo único que cambia es si miras la tabla o
            la tabla girada.</p>
        </Prose>
      </Pair>

      <h3>El plano factorial</h3>
      <Diagram fig={planoFactorial}>
        Las cuatro variables en el plano de las dos primeras componentes, que juntas
        conservan el {dos} % de la información de las cuatro.
      </Diagram>

      <h3>El ángulo es la correlación</h3>
      <Prose>
        <p>Aquí está el cierre del recorrido, y no es una metáfora. Recuerda la fórmula de la
          entrada: <b>r = cov(x, y) / (s<sub>x</sub> · s<sub>y</sub>)</b>. Esa división por
          las desviaciones típicas es, geométricamente, dividir cada vector por su longitud.
          Y el producto de dos vectores unitarios <b>es el coseno del ángulo que forman</b>.</p>
        <p>Por eso el plano factorial se lee sin calcular nada: dos flechas juntas son dos variables
          que suben juntas; dos flechas opuestas, una que sube cuando la otra baja; y dos
          flechas en ángulo recto, dos variables que no se dicen nada.</p>
      </Prose>

      <Diagram fig={tresAngulos}>
        Dos de los tres casos salen de estos países. El del ángulo recto no, y lo dice: los
        cuatro indicadores miden desarrollo y ninguno es independiente de otro.
      </Diagram>

      <Pair>
        <Prose>
          <h4>Por qué «aproxima» y no «es»</h4>
          <p>El coseno del ángulo <b>aproxima</b> la correlación, y la palabra hay que
            tomársela en serio: el plano factorial solo tiene dos dimensiones, y las variables viven
            en cuatro.</p>
          <p>En estos datos, esperanza de vida y fertilidad forman un ángulo cuyo coseno es
            {' '}{cosVidaFert.toFixed(2)}, mientras que su correlación real es
            {' '}{rVidaFert.toFixed(2)}. El dibujo exagera. Sigue siendo la mejor forma de
            ver cuatro variables a la vez, pero para citar un número se va a la tabla.</p>
        </Prose>
        <Prose>
          <h4>Y por eso importa la longitud</h4>
          <p>La longitud de una flecha dice <b>cuán bien representada</b> queda esa variable
            en el plano dibujado. Una flecha que llega al borde está casi entera ahí; una
            corta apenas asoma, y vive sobre todo en las componentes que no se dibujan.</p>
          <p>Aquí las cuatro miden entre {Math.min(...cargas.map(l => Math.hypot(l[0], l[1]))).toFixed(2)}
            {' '}y {Math.max(...cargas.map(l => Math.hypot(l[0], l[1]))).toFixed(2)}, así que
            el plano las sostiene bien. <b>Con flechas cortas, la regla del ángulo deja de
            valer</b> — y ese es el momento de desconfiar del plano, no de creerlo más.</p>
        </Prose>
      </Pair>

      <Idea>La tabla girada convierte cada variable en un vector, y el ángulo entre dos
        vectores es su correlación.{' '}
        <span className="who">El mismo número de la entrada, ahora dibujado.</span></Idea>
    </Panel>
  );
}
