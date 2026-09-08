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
  const perdido = (100 - PCA4.porcentajes[0] - PCA4.porcentajes[1]).toFixed(1);
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
        <p>El camino completo son tres operaciones <b>en este orden</b>: <b>centrar</b>,
          {' '}<b>transponer</b> y <b>normalizar</b>. El orden no es un detalle: se centra
          primero porque la media que se resta es la de cada variable, y una variable solo
          es una columna mientras no hayas girado la tabla.</p>
      </Prose>

      <Diagram fig={pasosCirculo}>
        Centrar, transponer, normalizar. Y lo que se pierde está en el paso 4, no en el 3.
      </Diagram>

      <Prose>
        <h4>Los cinco pasos, uno a uno</h4>
        <List>
          <li><b>01 · Centrar.</b> A cada valor se le resta <b>la media de su propia
            variable</b>: el PIB de Catar deja de ser {miles(catar[col('pib')])} dólares y
            pasa a ser «tanto por encima del PIB medio». Esto ocurre mientras la tabla
            sigue por columnas, que es donde una variable existe como tal.</li>
          <li><b>02 · Transponer.</b> Ahora sí se gira. Cada variable pasa a ser una fila:
            un <b>vector con {PAISES.length} números</b>, uno por país. Es la tabla girada
            del principio, pero con los valores ya centrados.</li>
          <li><b>03 · Normalizar.</b> Cada uno de esos vectores se lleva a <b>longitud
            1</b> — dividirlo por su desviación típica es hacer justo eso, salvo un factor
            que no cambia ningún ángulo. Y aquí está lo importante: el coseno del ángulo
            entre dos vectores centrados y de longitud 1 <b>es</b> su correlación.
            Exactamente, no aproximadamente, usando los {PAISES.length} números de cada
            uno.</li>
          <li><b>04 · Proyectar.</b> Los cuatro vectores, aunque lleven
            {' '}{PAISES.length} números cada uno, ocupan entre todos un espacio de
            {' '}<b>cuatro</b> dimensiones — hay cuatro variables y nada más. La hoja tiene
            dos, así que se proyectan sobre el plano de las dos primeras componentes. <b>La sombra de un vector es su carga</b> — y aquí se juntan los
            dos caminos de este bloque: girar la tabla explica <i>por qué</i> el ángulo es
            una correlación; las cargas son <i>cómo</i> se calcula. Es el mismo dibujo.</li>
          <li><b>05 · El círculo.</b> Su radio es 1 porque los vectores medían 1. Lo que le
            falte a una flecha para tocar el borde es lo que esa variable dejó fuera del
            plano.</li>
        </List>
      </Prose>

      <Prose>
        <p><b>Y de aquí sale el «aproxima».</b> La correlación no se estropea en el paso 3:
          allí el coseno es exacto. Lo que aproxima es el <b>paso 4</b>, aplastar cuatro
          dimensiones contra dos — y eso tiene precio conocido: el {perdido} % de la
          información que las dos primeras componentes no conservan.</p>
        <p>Por eso una flecha larga —una variable que cabe casi entera en el plano— tiene un
          ángulo fiable, y una corta no: de ella estás viendo una sombra pequeña de algo que
          apunta a otro sitio.</p>
      </Prose>

      <h3>El círculo de correlaciones</h3>
      <Diagram fig={circuloCorrelaciones}>
        Las cuatro variables en el plano de las dos primeras componentes, que juntas
        conservan el {dos} % de la información de las cuatro.
      </Diagram>

      <h3>El ángulo es la correlación</h3>
      <Prose>
        <p>Mira otra vez la fórmula de la entrada: <b>r = cov(x, y) / (s<sub>x</sub> ·
          s<sub>y</sub>)</b>. Esa división por las desviaciones típicas es, palabra por
          palabra, el paso 3 de arriba: dividir cada vector por su longitud. La fórmula que
          escribimos al empezar la sesión y el dibujo que tenemos delante son la misma
          operación.</p>
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
          <h4>Cuánto exagera, en estos datos</h4>
          <p>Esperanza de vida y fertilidad forman en el dibujo un ángulo cuyo coseno es
            {' '}{cosVidaFert.toFixed(2)}, mientras que su correlación real es
            {' '}{rVidaFert.toFixed(2)}. Esa diferencia es el paso 4 en acción: la sombra
            junta lo que en cuatro dimensiones estaba algo más separado.</p>
          <p>Sigue siendo la mejor forma de ver cuatro variables a la vez. Pero para
            <b> citar</b> un número se va a la tabla, no al dibujo.</p>
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
