import { Panel, Diagram, Pair, Prose, List, Idea, Task }
  from '../../../components/content/index.jsx';
import { transpuesta, circuloCorrelaciones, tresAngulos, pasosCirculo } from '../figures/block3.js';
import { PAISES, PCA4, VARS, CORR, CAMPOS, ESTAD, ANIO, FUENTE } from '../data/paises.js';

export default function Block3({ id, tabId }) {
  const dos = (PCA4.porcentajes[0] + PCA4.porcentajes[1]).toFixed(1);
  /* One country, before and after, with its real numbers: the abstract version of this
     paragraph is true and persuades nobody. */
  const col = k => CAMPOS.indexOf(k);
  const catar = PAISES.find(p => p[col('nombre')] === 'Catar');
  const zc = k => ((catar[col(k)] - ESTAD[k].media) / ESTAD[k].desv).toFixed(2).replace('-', '−');
  /* Thin-spaced thousands, so an interpolated 132900 reads like the 132 900 written in
     the prose beside it. */
  const miles = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
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
          <p>El <b>plano factorial</b> del bloque anterior colocaba los <b>individuos</b>: un
            punto por país. El <b>círculo de correlaciones</b> de este bloque coloca las
            <b> variables</b>: una flecha por indicador.</p>
          <p>No son dos análisis, son <b>las dos caras del mismo</b>. Salen de la misma
            matriz y de los mismos autovectores; lo único que cambia es si miras la tabla o
            la tabla girada.</p>
        </Prose>
      </Pair>

      <h3>De la tabla girada al dibujo</h3>
      <Prose>
        <p>Cuidado aquí, porque hay un paso que es fácil saltarse. La tabla de arriba
          muestra los <b>valores reales</b>: Catar con 132 900 dólares y 1.98 hijos por
          mujer. Con esos números tal cual, el vector de Catar lo decide su PIB y nada más
          — 132 900 aplasta a 1.98 —, y el ángulo entre dos flechas no significaría nada.</p>
      </Prose>

      <Diagram fig={pasosCirculo}>
        Del valor real a la flecha, en cinco pasos. El segundo es el que hace que los demás
        tengan sentido.
      </Diagram>

      <Prose>
        <h4>Los cinco pasos, uno a uno</h4>
        <List>
          <li><b>01 · La tabla girada.</b> Cada variable es ahora una fila con
            {' '}{PAISES.length} valores: un registro, como lo era cada país.</li>
          <li><b>02 · Centrar y dividir por la desviación típica.</b> Son dos operaciones,
            y conviene separarlas. <b>Centrar</b> es restarle a cada valor <b>la media de su
            propia variable</b>: el PIB de un país deja de ser «12 760 dólares» y pasa a ser
            «tanto por encima o por debajo del PIB medio». <b>Dividir</b> es partir ese
            resultado por <b>la desviación típica de esa misma variable</b>, para que un
            paso valga lo mismo en las cuatro.
            <br />Es exactamente la normalización de la entrada — restar la media y dividir
            por las desviaciones típicas es lo que convertía la covarianza en correlación.
            Mira a Catar: pasa de <b>{miles(catar[col('pib')])}</b> dólares y
            {' '}<b>{catar[col('fertilidad')]}</b> hijos por mujer a <b>{zc('pib')}</b> y
            {' '}<b>{zc('fertilidad')}</b>. Dos números comparables donde antes había uno
            enorme y uno diminuto.
            <br />Después de esto, las cuatro filas se mueven entre −3 y +6 en vez de entre
            1.3 y 132 900. Y el <b>origen</b> del círculo deja de ser el cero de los dólares:
            es <b>la media de cada variable</b>, el país promedio.</li>
          <li><b>03 · Correlacionar cada variable con cada componente.</b> Ese número —la
            correlación entre una variable y una componente— es lo que se llama su
            {' '}<b>carga</b>. Y aquí se cierra un detalle del bloque anterior: como las
            variables ya vienen centradas y divididas, la matriz de covarianzas que se
            diagonaliza <b>es</b> la matriz de correlaciones. Por eso las cargas salen ya en
            forma de correlación, sin convertir nada.</li>
          <li><b>04 · Las dos cargas son las coordenadas.</b> La carga con la primera
            componente es la x de la flecha; la de la segunda, su y. Nada más.</li>
          <li><b>05 · Las cuatro, dentro del círculo de radio 1.</b> Las cargas
            <b> son correlaciones</b>, y una correlación nunca pasa de 1: por eso ninguna
            flecha puede salirse del círculo.
            Lo que le falte a una flecha para llegar al borde es lo que esa variable vive
            fuera de este plano.</li>
        </List>
      </Prose>

      <h3>El círculo de correlaciones</h3>
      <Diagram fig={circuloCorrelaciones}>
        Las cuatro variables en el plano de las dos primeras componentes, que juntas
        conservan el {dos} % de la información de las cuatro.
      </Diagram>

      <h3>El ángulo es la correlación</h3>
      <Prose>
        <p>Aquí está el cierre del recorrido, y no es una metáfora. Recuerda la fórmula de la
          entrada: <b>r = cov(x, y) / (s<sub>x</sub> · s<sub>y</sub>)</b>. Esa división por
          las desviaciones típicas es, geométricamente, dividir cada vector por su longitud.
          Y el producto de dos vectores unitarios <b>es el coseno del ángulo que forman</b>.</p>
        <p>Por eso el círculo de correlaciones se lee sin calcular nada: dos flechas juntas son dos variables
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
            tomársela en serio: el círculo solo tiene dos dimensiones, y las variables viven
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
