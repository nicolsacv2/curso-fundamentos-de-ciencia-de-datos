import { Panel, Task, Cards, Card, Diagram, Pair, Prose, NumTable }
  from '../../../components/content/index.jsx';
import { ESTADOS, TABLA, PERFILES, ESPERADAS, CHI2, SIMPSON } from '../data/lluvia.js';
import { tablaChi2, perfilesFila, simpsonTotal, simpsonGrupos, fCondicional, celdaLluvia, celdaMayor }
  from '../figures/intro.js';

/* Entrada of session 7 · conditional probability and contingency tables. It answers the
   question session 6 closed with — «¿qué falta?» — by learning to read TWO variables that
   are not numbers together, on an example of its own before the class table comes back
   in the closing: the sky today against the sky tomorrow, over a year of INVENTED days.
   The cross table, its margins, each row as a conditional probability, what independence
   would look like, the chi-square cell by cell and a measure in [0, 1]. It ends by paying
   the debt session 4 left: the Simpson paradox, as a table of three variables.

   Every number is interpolated from src/sessions/s07/data/lluvia.js, which
   scripts/ejemplo_lluvia.py wrote from a declared table after asserting its identities
   and its story. Nothing is computed here, and no number is typed. */

const f = v => String(v).replace('.', ',').replace('-', '−');
const pct = v => `${f(Math.round(v * 1000) / 10)} %`;

const R = ESTADOS, K = ESTADOS;
/* The cell the example is named after: it rained today, it rains tomorrow. */
const m = celdaLluvia();
/* The cell that puts the most into the chi-square, read off the data. */
const g = celdaMayor();
const [j0, j1] = SIMPSON.grupos;
const T = SIMPSON.total;

export default function Intro({ id, tabId, block }) {
  return (
    <Panel id={id} tabId={tabId} block={block}>
      <Task label="Para empezar · 3 minutos" big="Esta sesión es la respuesta a «¿qué falta?».">
        <p>La sesión pasada terminó con una tabla limpia y una pregunta: las columnas que{' '}
          <b>no son números</b> —el departamento, el área, el sector, la sangre, la música, las
          escalas ordenadas— quedaron fuera del análisis. Hoy entran todas. Pero antes de leer
          muchas a la vez hay que saber leer <b>dos</b>, y para dos variables que no son números
          existe una herramienta más vieja que cualquier análisis factorial: <b>la tabla
          cruzada</b>. Se aprende sobre un ejemplo propio, pequeño e inventado, y la tabla del
          salón vuelve <b>al final de la sesión</b>, cuando ya se sepa leerla entera.</p>
      </Task>

      <h3>Si llovió hoy, ¿llueve mañana?</h3>
      <Prose>
        <p>Imaginen un año de <b>{TABLA.n} días</b> en un lugar cualquiera, y que cada día se anotó
          el cielo con una de tres palabras: <b>sol</b>, <b>nublado</b> o <b>lluvia</b>. La
          pregunta es si el cielo de hoy dice algo del de mañana. Para responderla se cruzan
          los días: una fila por cada cielo de <b>hoy</b>, una columna por cada cielo de{' '}
          <b>mañana</b>, y en cada celda <b>cuántos días</b> hubo con esa combinación. En los
          bordes, las sumas: la de cada fila, la de cada columna, y el total, que son los{' '}
          {TABLA.n} días. Se llama <b>tabla de contingencia</b>. Los días son inventados
          —nadie los midió— y sirven para aprender a leerla; la tabla real llega en el
          cierre.</p>
      </Prose>

      <NumTable
        cols={['hoy \\ mañana', ...K, 'suma']}
        rows={R.map((r, i) => [r, ...TABLA.celdas[i], TABLA.filas[i]])}
        pie={['suma', ...TABLA.columnas, TABLA.n]}
        marca={(i, j) => i === m.i && j === m.j}
        caption={<>Recuentos de días de un año inventado. Las filas son el cielo de hoy; las columnas,
          el de mañana. Señalada, la celda que da nombre al ejemplo: llovió hoy y llueve mañana,{' '}
          {TABLA.celdas[m.i][m.j]} días.</>}
      />

      <h3>Cada fila es una probabilidad condicional</h3>
      <Prose>
        <p>Dividan cada fila por su suma. Lo que queda es el <b>perfil de la fila</b>: de los días
          con ese cielo hoy, qué parte tuvo cada cielo mañana. Y eso tiene nombre propio: es la{' '}
          <b>probabilidad condicional</b>, <b>P(A | B)</b> — «la probabilidad de A sabiendo que
          B». Se lee sobre la celda señalada: de los <b>{TABLA.filas[m.i]}</b> días en que hoy hubo
          «{R[m.i]}», <b>{TABLA.celdas[m.i][m.j]}</b> tuvieron «{K[m.j]}» al día siguiente. Así que
          P(mañana = «{K[m.j]}» | hoy = «{R[m.i]}») = {TABLA.celdas[m.i][m.j]}/{TABLA.filas[m.i]} ={' '}
          <b>{f(PERFILES.fila[m.i][m.j])}</b>. Esa es la respuesta a la pregunta del título, y
          es una probabilidad condicional.</p>
        <p>Cada fila suma uno, porque es un reparto. Y las columnas también se pueden dividir
          por su suma: son los perfiles de columna, P(hoy | mañana) — de los días con lluvia
          mañana, qué cielo tenían hoy —, la misma tabla leída al revés. Las dos lecturas son
          legítimas y no dicen lo mismo.</p>
      </Prose>

      <NumTable
        cols={['P(mañana | hoy)', ...K, 'suma']}
        rows={R.map((r, i) => [r, ...PERFILES.fila[i].map(f), '1'])}
        marca={(i, j) => i === m.i && j === m.j}
        caption={<>Los perfiles de fila: cada recuento sobre la suma de su fila. Cada fila suma
          uno.</>}
      />

      <Diagram fig={perfilesFila}>
        Las mismas filas dibujadas: cada barra es un cielo de hoy estirado al 100 % y partido
        por el cielo de mañana; el ancho es cuántos días hubo con ese cielo. La última barra es
        el margen: si hoy no dijera nada de mañana, todas las barras se parecerían a esa.
      </Diagram>

      <h3>Marginal contra condicional</h3>
      <Cards cols="c3">
        <Card k="sin saber nada" t={`P(mañana = «${K[m.j]}») = ${f(TABLA.marginalColumna[m.j])}`}>
          La probabilidad <b>marginal</b>: de los {TABLA.n} días, {TABLA.columnas[m.j]} tuvieron
          «{K[m.j]}». Es el margen de la columna, y es lo que se sabe de mañana sin mirar el cielo
          de hoy.
        </Card>
        <Card k={`sabiendo que hoy = «${R[m.i]}»`} t={`P(… | …) = ${f(PERFILES.fila[m.i][m.j])}`}>
          La probabilidad <b>condicional</b>: dentro de los {TABLA.filas[m.i]} días de esa fila,
          la proporción {PERFILES.fila[m.i][m.j] > TABLA.marginalColumna[m.j] ? 'sube' : 'baja'}{' '}
          a {f(PERFILES.fila[m.i][m.j])}. Saber el cielo de hoy cambió lo que esperamos del de
          mañana.
        </Card>
        <Card red k="la diferencia" t="es la asociación">
          Si para todas las filas la condicional fuera igual a la marginal, saber el cielo de hoy
          no diría nada del de mañana: las dos variables serían <b>independientes</b>. Que
          difieran es exactamente lo que significa que estén asociadas.
        </Card>
      </Cards>

      <h3>La tabla que no existe: la independencia</h3>
      <Prose>
        <p>Independencia se puede escribir como una tabla. Si el cielo de hoy no dijera nada del
          de mañana, cada celda tendría <b>el producto de sus dos márgenes dividido por el
          total</b>: la celda señalada tendría {TABLA.filas[m.i]} · {TABLA.columnas[m.j]} / {TABLA.n} ={' '}
          <b>{f(ESPERADAS[m.i][m.j])}</b> días, y tiene {TABLA.celdas[m.i][m.j]}. Esa tabla se
          llama <b>esperada</b>, no existe —tiene decimales de día— y conserva los mismos
          márgenes que la observada. La distancia entre las dos tablas es lo que vamos a medir.</p>
      </Prose>

      <NumTable
        cols={['esperado \\ mañana', ...K, 'suma']}
        rows={R.map((r, i) => [r, ...ESPERADAS[i].map(f), TABLA.filas[i]])}
        pie={['suma', ...TABLA.columnas, TABLA.n]}
        marca={(i, j) => i === m.i && j === m.j}
        caption={<>La tabla esperada bajo independencia. Las sumas de fila y de columna son las
          mismas que las observadas; las celdas, no.</>}
      />

      <h3>El chi-cuadrado, celda por celda</h3>
      <Prose>
        <p>Para cada celda: la diferencia entre lo observado y lo esperado, al cuadrado, dividida
          por lo esperado. Es una distancia en <b>unidades de lo esperado</b>, así que una celda
          rara puede pesar mucho con pocos días. La suma de las {R.length * K.length} celdas
          es el estadístico <b>χ² = {f(CHI2.total)}</b>. La celda señalada pone{' '}
          <b>{f(CHI2.celdas[m.i][m.j])}</b>, porque hubo {TABLA.celdas[m.i][m.j]} días donde se
          esperaban {f(ESPERADAS[m.i][m.j])}; la que más pone de todas es «hoy {R[g.i]}, mañana{' '}
          {K[g.j]}», con {f(CHI2.celdas[g.i][g.j])}: {TABLA.celdas[g.i][g.j]} días donde se
          esperaban {f(ESPERADAS[g.i][g.j])}.</p>
        <p>El χ² crece con la tabla y con el número de días, así que solo no se interpreta.
          Dividido por n da <b>φ² = {f(CHI2.phi2)}</b>, y normalizado por lo máximo que podría
          valer con estas filas y columnas da la <b>V de Cramér = {f(CHI2.v)}</b>, que vive entre
          0 y 1: cero si el cielo de hoy no dijera nada del de mañana, uno si lo dijera todo. Y
          una advertencia que hay que decir en voz alta: esto es una <b>medida</b> de cuánto se
          asocian dos variables, no una <b>prueba</b> de que se asocien. Con días inventados no
          hay nada que probar; y con datos reales, el chi-cuadrado como prueba de hipótesis pide
          condiciones que se ven en otro curso.</p>
      </Prose>

      <Diagram fig={tablaChi2}>
        Observado contra esperado en cada celda, con el color según cuánto aporta al χ² y si
        hubo más o menos días de los esperados.
      </Diagram>

      <Diagram fig={fCondicional}>
        Las cuatro fórmulas de la entrada, con la celda señalada como ejemplo.
      </Diagram>

      <h3>La deuda de la sesión 4: la paradoja de Simpson</h3>
      <Prose>
        <p>En la sesión 4 dejamos plantada una figura incómoda: un medicamento, dos grupos de
          edad, y dentro de cada grupo más dosis iba con más mejoría, pero con los dos grupos
          revueltos la asociación se daba la vuelta. Dijimos que se resolvía hoy. Se resuelve
          con lo que acabamos de aprender: es una tabla de contingencia, solo que de{' '}
          <b>tres</b> variables — dosis, mejoría y grupo de edad —, y la probabilidad
          condicional la explica entera. También son cifras inventadas para el ejemplo.
          Empecemos por donde empieza cualquiera: por la tabla de todas las personas juntas.</p>
      </Prose>

      <NumTable
        cols={['todas las personas', 'mejora', 'no mejora', 'P(mejora | dosis)']}
        rows={[['dosis alta', T.alta.mejora, T.alta.noMejora, f(T.alta.pMejora)],
               ['dosis baja', T.baja.mejora, T.baja.noMejora, f(T.baja.pMejora)]]}
        marca={(i, j) => i === 1 && j === 2}
        caption={<>{T.personas} personas, una tabla de dos variables: dosis y mejoría. La pregunta que
          se hace quien la mira es <b>¿qué dosis es mejor?</b>, y la tabla parece responder:
          la baja, {f(T.baja.pMejora)} contra {f(T.alta.pMejora)}.</>}
      />

      <Diagram fig={simpsonTotal}>
        Dos barras, {T.personas} personas. Leída sola, la dosis baja mejora más. Guarden la
        respuesta un momento.
      </Diagram>

      <Prose>
        <p>Ahora separen a <b>las mismas {T.personas} personas</b> por grupo de edad: {j0.personas}{' '}
          {j0.grupo} y {j1.personas} {j1.grupo}. Son las mismas celdas, repartidas en dos tablas
          que suman la de arriba. Ninguna cifra cambia; cambia lo que dicen.</p>
      </Prose>

      <Pair>
        <NumTable
          cols={[j0.grupo, 'mejora', 'no mejora', 'P(mejora | dosis)']}
          rows={[['dosis alta', j0.alta.mejora, j0.alta.noMejora, f(j0.alta.pMejora)],
                 ['dosis baja', j0.baja.mejora, j0.baja.noMejora, f(j0.baja.pMejora)]]}
          marca={(i, j) => i === 0 && j === 2}
          caption={<>{j0.grupo}: {j0.personas} personas. La dosis alta mejora más.</>}
        />
        <NumTable
          cols={[j1.grupo, 'mejora', 'no mejora', 'P(mejora | dosis)']}
          rows={[['dosis alta', j1.alta.mejora, j1.alta.noMejora, f(j1.alta.pMejora)],
                 ['dosis baja', j1.baja.mejora, j1.baja.noMejora, f(j1.baja.pMejora)]]}
          marca={(i, j) => i === 0 && j === 2}
          caption={<>{j1.grupo}: {j1.personas} personas. La dosis alta mejora más.</>}
        />
      </Pair>

      <Diagram fig={simpsonGrupos}>
        Las mismas personas, en dos parejas de barras. En cada grupo la dosis alta mejora más:
        eso es la paradoja. Debajo de cada barra, de cuántas personas está hecha.
      </Diagram>

      <Pair>
        <Prose>
          <h4>Por qué se da la vuelta</h4>
          <p>Miren quién recibió qué. De los {j0.grupo}, el <b>{pct(j0.pAlta)}</b> recibió la dosis
            alta; de los {j1.grupo}, el <b>{pct(j1.pAlta)}</b>. Y miren quién mejora: los{' '}
            {j0.grupo} mejoran el {pct(j0.pMejora)} y los {j1.grupo} el {pct(j1.pMejora)},
            reciban lo que reciban. <b>El grupo de edad va con la dosis y va con la mejoría a la
            vez.</b> Al sumar las dos tablas, la fila «dosis alta» se llena de {j1.grupo} —que
            mejoran poco— y la fila «dosis baja» de {j0.grupo} —que mejoran mucho—. La mezcla
            no compara dosis: compara edades disfrazadas de dosis.</p>
        </Prose>
        <Prose>
          <h4>La pregunta correcta</h4>
          <p>Es la que la sesión 4 dejó abierta: <b>«¿asociado con qué, dentro de qué?»</b>. Dentro
            de cada grupo, la dosis se asocia con mejorar. En el total, la dosis se asocia con la
            edad, y la edad con mejorar. Las tres tablas son correctas; la que responde la
            pregunta que uno quiere hacer es la que separa por la tercera variable. Y la
            tercera variable no siempre está en la tabla: esa es la parte incómoda que queda.
            Una tabla de dos variables puede estar contando la historia de una tercera.</p>
        </Prose>
      </Pair>
    </Panel>
  );
}
