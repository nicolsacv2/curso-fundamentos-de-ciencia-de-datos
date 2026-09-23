import { Panel, Task, Cards, Card, Diagram, Pair, Prose, NumTable }
  from '../../../components/content/index.jsx';
import { ESTADOS, ANIO, TABLA, PERFILES, ESPERADAS, CHI2, SIMPSON } from '../data/lluvia.js';
import { anio, tablaChi2, perfilesFila, simpsonTotal, simpsonGrupos, fCondicional, celdaLluvia, celdaMayor }
  from '../figures/intro.js';

/* Entrada of session 7 · conditional probability and contingency tables. It answers the
   question session 6 closed with — «¿qué falta?» — by learning to read TWO variables that
   are not numbers together, on an example of its own before the class table comes back
   in the closing: the sky of one day against the sky of the day after, over a year of
   INVENTED days. The year itself first, then the unit — a pair of consecutive days —, the
   cross table, its margins (and why the two sums of a state differ by one at most), each
   row as a conditional probability, what independence would look like, the chi-square
   cell by cell and a measure in [0, 1]. It ends by paying the debt session 4 left: the
   Simpson paradox, as a table of three variables.

   The two variables are called «día observado» and «día siguiente», never the words for
   today and tomorrow: in a room on a given date those two name the date, not the table.

   Every number is interpolated from src/sessions/s07/data/lluvia.js, which
   scripts/ejemplo_lluvia.py counted from a simulated year after asserting its identities
   and its story. Nothing is computed here, and no number is typed. */

const f = v => String(v).replace('.', ',').replace('-', '−');
const pct = v => `${f(Math.round(v * 1000) / 10)} %`;

const R = ESTADOS, K = ESTADOS;
/* The cell the example is named after: it rained one day, it rains the next. */
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

      <h3>Si un día llueve, ¿llueve el día siguiente?</h3>
      <Prose>
        <p>Imaginen un año de <b>{ANIO.dias} días</b> en un lugar cualquiera, y que cada día se
          anotó el cielo con una de tres palabras: <b>sol</b>, <b>nublado</b> o <b>lluvia</b>.
          Aquí está el año entero. Los días son inventados —nadie los midió, los sorteó un
          programa con el azar fijado— y sirven para aprender; la tabla real llega en el
          cierre.</p>
      </Prose>

      <Diagram fig={anio}>
        Los {ANIO.dias} días, en orden. El primero fue de {ANIO.primerDia}; el último, de{' '}
        {ANIO.ultimoDia}. Debajo, la unidad con la que vamos a contar.
      </Diagram>

      <Prose>
        <p>La pregunta es si el cielo de un día dice algo del cielo del día siguiente. Para
          responderla no se cuentan días: se cuentan <b>pares de días consecutivos</b> —cada
          día con el que le sigue—. Al primero de cada par lo llamamos <b>día observado</b>; al
          segundo, <b>día siguiente</b>. Un año de {ANIO.dias} días da <b>{ANIO.pares} pares</b>:
          el día 1 con el 2, el 2 con el 3, y así hasta el {ANIO.dias - 1} con el {ANIO.dias}.</p>
        <p>Y los pares se cruzan: una fila por cada cielo del <b>día observado</b>, una columna
          por cada cielo del <b>día siguiente</b>, y en cada celda <b>cuántos pares</b> hubo
          con esa combinación. En los bordes, las sumas: la de cada fila, la de cada columna, y
          el total, que son los {TABLA.n} pares. Se llama <b>tabla de contingencia</b>.</p>
      </Prose>

      <NumTable
        cols={['observado \\ siguiente', ...K, 'suma']}
        rows={R.map((r, i) => [r, ...TABLA.celdas[i], TABLA.filas[i]])}
        pie={['suma', ...TABLA.columnas, TABLA.n]}
        marca={(i, j) => i === m.i && j === m.j}
        caption={<>Recuentos de pares de días consecutivos de un año inventado. Las filas son el cielo
          del día observado; las columnas, el del día siguiente. Señalada, la celda que da nombre al
          ejemplo: llovió el día observado y llueve el siguiente, {TABLA.celdas[m.i][m.j]} pares.</>}
      />

      <h3>Las dos sumas de cada estado casi coinciden, y no es casualidad</h3>
      <Prose>
        <p>Miren los bordes. «{TABLA.margenes[0].estado}» suma {TABLA.margenes[0].observado} como día observado y{' '}
          {TABLA.margenes[0].siguiente} como día siguiente. No es un descuido: es lo que tiene que
          pasar. Cada día del año entra en la tabla <b>dos veces</b> —una como observado, en el
          par que empieza con él, y otra como siguiente, en el par que termina con él— salvo dos:
          el <b>día 1</b>, que nunca es siguiente, y el <b>día {ANIO.dias}</b>, que nunca es
          observado. Así que la suma de una fila y la de su columna pueden diferir como máximo en
          uno, y la diferencia la explican esos dos días.</p>
      </Prose>

      <NumTable
        cols={['estado', 'como día observado', 'como día siguiente', 'diferencia']}
        rows={TABLA.margenes.map(g => [g.estado, g.observado, g.siguiente,
          g.diferencia > 0 ? `+${g.diferencia}` : g.diferencia === 0 ? '0' : f(g.diferencia)])}
        marca={(i, j) => j === 2 && TABLA.margenes[i].diferencia !== 0}
        caption={<>Las dos sumas de cada estado, lado a lado.{' '}
          {TABLA.margenes.map((g, i, a) => (
            <span key={g.estado}>{g.estado.charAt(0).toUpperCase() + g.estado.slice(1)}:{' '}
              {g.explicacion}{i < a.length - 1 ? '. ' : '.'}</span>
          ))} Una tabla de días consecutivos que no cumpla esto no salió de ningún año.</>}
      />

      <h3>Cada fila es una probabilidad condicional</h3>
      <Prose>
        <p>Dividan cada fila por su suma. Lo que queda es el <b>perfil de la fila</b>: de los
          pares con ese cielo el día observado, qué parte tuvo cada cielo el día siguiente. Y eso
          tiene nombre propio: es la <b>probabilidad condicional</b>, <b>P(A | B)</b> — «la
          probabilidad de A sabiendo que B». Se lee sobre la celda señalada: de los{' '}
          <b>{TABLA.filas[m.i]}</b> días observados con «{R[m.i]}», <b>{TABLA.celdas[m.i][m.j]}</b>{' '}
          tuvieron «{K[m.j]}» al día siguiente. Así que P(siguiente = «{K[m.j]}» | observado =
          «{R[m.i]}») = {TABLA.celdas[m.i][m.j]}/{TABLA.filas[m.i]} ={' '}
          <b>{f(PERFILES.fila[m.i][m.j])}</b>. Esa es la respuesta a la pregunta del título, y
          es una probabilidad condicional.</p>
        <p>Cada fila suma uno, porque es un reparto. Y las columnas también se pueden dividir
          por su suma: son los perfiles de columna, P(observado | siguiente) — de los días
          siguientes con lluvia, qué cielo tenía el día observado —, la misma tabla leída al
          revés. Las dos lecturas son legítimas y no dicen lo mismo.</p>
      </Prose>

      <NumTable
        cols={['P(siguiente | observado)', ...K, 'suma']}
        rows={R.map((r, i) => [r, ...PERFILES.fila[i].map(f), '1'])}
        marca={(i, j) => i === m.i && j === m.j}
        caption={<>Los perfiles de fila: cada recuento sobre la suma de su fila. Cada fila suma
          uno.</>}
      />

      <Diagram fig={perfilesFila}>
        Las mismas filas dibujadas: cada barra es un cielo del día observado estirado al 100 % y
        partido por el cielo del día siguiente; el ancho es cuántos días hubo con ese cielo. La
        última barra es el margen: si el día observado no dijera nada del siguiente, todas las
        barras se parecerían a esa.
      </Diagram>

      <h3>Marginal contra condicional</h3>
      <Cards cols="c3">
        <Card k="sin saber nada" t={`P(siguiente = «${K[m.j]}») = ${f(TABLA.marginalColumna[m.j])}`}>
          La probabilidad <b>marginal</b>: de los {TABLA.n} pares, {TABLA.columnas[m.j]} tuvieron
          «{K[m.j]}» el día siguiente. Es el margen de la columna, y es lo que se sabe del día
          siguiente sin mirar el día observado.
        </Card>
        <Card k={`sabiendo que observado = «${R[m.i]}»`} t={`P(… | …) = ${f(PERFILES.fila[m.i][m.j])}`}>
          La probabilidad <b>condicional</b>: dentro de los {TABLA.filas[m.i]} pares de esa fila,
          la proporción {PERFILES.fila[m.i][m.j] > TABLA.marginalColumna[m.j] ? 'sube' : 'baja'}{' '}
          a {f(PERFILES.fila[m.i][m.j])}. Saber el cielo del día observado cambió lo que esperamos
          del siguiente.
        </Card>
        <Card red k="la diferencia" t="es la asociación">
          Si para todas las filas la condicional fuera igual a la marginal, saber el cielo del día
          observado no diría nada del siguiente: las dos variables serían <b>independientes</b>.
          Que difieran es exactamente lo que significa que estén asociadas.
        </Card>
      </Cards>

      <h3>La tabla que no existe: la independencia</h3>
      <Prose>
        <p>Independencia se puede escribir como una tabla. Si el cielo del día observado no dijera
          nada del siguiente, cada celda tendría <b>el producto de sus dos márgenes dividido por el
          total</b>: la celda señalada tendría {TABLA.filas[m.i]} · {TABLA.columnas[m.j]} / {TABLA.n} ={' '}
          <b>{f(ESPERADAS[m.i][m.j])}</b> pares, y tiene {TABLA.celdas[m.i][m.j]}. Esa tabla se
          llama <b>esperada</b>, no existe —tiene decimales de par— y conserva los mismos
          márgenes que la observada. La distancia entre las dos tablas es lo que vamos a medir.</p>
      </Prose>

      <NumTable
        cols={['esperado \\ siguiente', ...K, 'suma']}
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
          rara puede pesar mucho con pocos pares. La suma de las {R.length * K.length} celdas
          es el estadístico <b>χ² = {f(CHI2.total)}</b>. La celda señalada pone{' '}
          <b>{f(CHI2.celdas[m.i][m.j])}</b>, porque hubo {TABLA.celdas[m.i][m.j]} pares donde se
          esperaban {f(ESPERADAS[m.i][m.j])}; la que más pone de todas es «observado {R[g.i]},
          siguiente {K[g.j]}», con {f(CHI2.celdas[g.i][g.j])}: {TABLA.celdas[g.i][g.j]} pares donde
          se esperaban {f(ESPERADAS[g.i][g.j])}.</p>
        <p>El χ² crece con la tabla y con el número de pares, así que solo no se interpreta.
          Dividido por n da <b>φ² = {f(CHI2.phi2)}</b>, y normalizado por lo máximo que podría
          valer con estas filas y columnas da la <b>V de Cramér = {f(CHI2.v)}</b>, que vive entre
          0 y 1: cero si el día observado no dijera nada del siguiente, uno si lo dijera todo. Y
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
          revueltos la asociación se daba la vuelta. Dijimos que se resolvía en esta sesión. Se resuelve
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
