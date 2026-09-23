import { Panel, Task, Options, Cards, Card, Diagram, Pair, Prose, List, NumTable }
  from '../../../components/content/index.jsx';
import { PERSONAS, TABLA, TABLA_RARA, MCA, MCA_RARA, SUPL } from '../data/ejemplo.js';
import { fIndicadora, fDistancia, fSalto, fMatricial, fTransicion, fInercia, fContribucion, fSuplementaria,
  mapaBase, mapaRara, mapaSuplementarias } from '../figures/block2.js';
import { UMBRAL_COS2 } from '../figures/shared.js';

/* Block 2 of session 7 · MCA. Parts 1 to 5 of mca_famd_guia.md, in the guide's order, with two
   changes of staging: it opens from block 1's correspondence analysis — the MCA is that
   analysis on the indicator matrix of many variables at once — and
   the table of the eight people comes before the indicator matrix — on a wall a table
   of people is understood and a table of zeros and ones has to be explained.

   Every figure in this block comes out of src/sessions/s07/data/ejemplo.js, which
   scripts/ejemplo_mca_famd.py wrote after asserting its own identities and comparing
   against the guide. Nothing is computed here, and no number is typed: a value that
   changes in the script changes on the wall. */

/* A number the way it is read out loud: decimal comma, real minus sign. */
const f = v => String(v).replace('.', ',').replace('-', '−');
const pct = v => `${f(v)} %`;
const lista = xs => xs.map((x, i, a) =>
  <span key={String(x)}>{i ? (i === a.length - 1 ? ' y ' : ', ') : ''}<b>{x}</b></span>);

const cat = (analisis, nivel) => analisis.categorias.find(c => c.nivel === nivel);
const rotulo = c => /^(Sí|No)$/.test(c.nivel) ? `${c.variable}: ${c.nivel}` : c.nivel;

/* The seeded pattern and its exceptions, read off the table and not declared: coffee
   drinkers are morning people with sugar, tea drinkers night people without. */
const PURO = { Café: ['Mañana', 'Sí'], Té: ['Noche', 'No'] };
const excepciones = TABLA.filas
  .map((fila, i) => (PURO[fila[0]][0] !== fila[1] || PURO[fila[0]][1] !== fila[2] ? i + 1 : null))
  .filter(Boolean);
const puros = TABLA.filas.map((_, i) => i + 1).filter(i => !excepciones.includes(i));

/* Which categories name axis 1: only the ones above the average share. */
const nombran = MCA.categorias.filter(c => c.ctr[0] > MCA.aportePromedio);
const nombreEje1 = [...new Set(nombran.map(c => c.variable))].join(' y ').toLowerCase();

/* Axis 2 is the exceptions: the ones above and the ones below. */
const arriba = excepciones.filter(i => MCA.individuos[i - 1].coord[1] > 0);
const abajo = excepciones.filter(i => MCA.individuos[i - 1].coord[1] < 0);
const catsArriba = MCA.categorias.filter(c => c.coord[1] > 0.01).map(rotulo);
const catsAbajo = MCA.categorias.filter(c => c.coord[1] < -0.01).map(rotulo);

const stevia = cat(MCA_RARA, 'Stevia');
const rara = MCA_RARA.rara;
const ejeF = rara.ejeFabricado - 1;
const steviaSup = SUPL.categorias.find(c => c.nivel === 'Stevia');
const nadaSup = SUPL.categorias.find(c => c.nivel === 'Nada');
const D = SUPL.destinos;

export default function Block1({ id, tabId, block }) {
  const cafe = cat(MCA, 'Café'), manana = cat(MCA, 'Mañana');
  const t = MCA.transicion;
  const sl = MCA.salto;
  const b = MCA.benzecri;
  const ejeFab = MCA_RARA.categorias.slice().sort((a, c) => c.ctr[ejeF] - a.ctr[ejeF]);

  return (
    <Panel id={id} tabId={tabId} block={block}>
      <Task label="Para empezar · 2 minutos" big="El análisis de correspondencias del bloque anterior, sobre todas las variables a la vez.">
        <p>El bloque 1 dibujó una tabla de <b>dos</b> variables. Pero las variables que no son
          números vienen en grupo — el departamento, el área, el sector, la sangre, la música,
          las escalas ordenadas—, y hacen falta todas juntas. El <b>análisis de
          correspondencias múltiples</b>, MCA, es
          exactamente el análisis del bloque 1 aplicado a otra tabla: la <b>tabla indicadora</b>
          de varias variables a la vez, en vez del cruce de dos. Los perfiles, la distancia
          chi-cuadrado, la inercia, la transición, la contribución y el cos² son los mismos.
          Vamos a construirlo entero sobre un ejemplo tan pequeño que se pueda comprobar a
          mano, y en el cierre se lo aplicamos a la tabla del salón.</p>
      </Task>

      <h3>Ocho personas, tres preguntas</h3>
      <Prose>
        <p>Antes de la fórmula, el ejemplo. <b>{PERSONAS} personas</b> respondieron tres
          preguntas de sí o no: qué toman, cuándo lo toman y si le ponen azúcar. Está
          sembrado un patrón: <b>los cafeteros son mañaneros y azucarados; los teteros,
          nocturnos y sin azúcar</b>. Lo cumplen las personas {lista(puros)}. Las otras
          cuatro, {lista(excepciones)}, son las excepciones: rompen el patrón en una de las
          dos preguntas. Y las {MCA.J} categorías tienen la misma frecuencia,{' '}
          {cafe.n} personas cada una, para que nada de lo que salga se deba a que una
          categoría sea más común que otra.</p>
      </Prose>

      <NumTable
        cols={['persona', ...TABLA.columnas]}
        rows={TABLA.filas.map((fila, i) => [i + 1, ...fila])}
        marca={(i) => excepciones.includes(i + 1)}
        caption={<>La tabla del ejemplo: {PERSONAS} filas, {TABLA.columnas.length} variables
          categóricas binarias. Señaladas, las <b>{excepciones.length} excepciones</b> al
          patrón sembrado.</>}
      />

      <h3>Parte 1 · La tabla disyuntiva completa</h3>
      <Prose>
        <p>El método no lee esa tabla: lee su <b>matriz indicadora</b>, que también se llama
          tabla disyuntiva completa. Una columna por cada categoría —no por cada variable—,
          un <b>1</b> donde la persona tiene esa categoría y un <b>0</b> donde no. Con{' '}
          {MCA.Q} variables de dos niveles salen <b>J = {MCA.J} columnas</b>.</p>
        <p>Dos cosas se ven en ella antes de calcular nada: <b>cada fila suma exactamente
          Q = {MCA.Q}</b>, porque cada persona eligió una categoría de cada variable; y{' '}
          <b>cada columna suma n_j</b>, la frecuencia de su categoría — aquí {cafe.n} en
          todas. La tabla entera suma n·Q = {MCA.n * MCA.Q}.</p>
      </Prose>

      <NumTable
        cols={['persona', ...MCA.categorias.map(rotulo), 'Σ fila']}
        rows={[
          ...MCA.Z.map((fila, i) => [i + 1, ...fila, MCA.sumasFila[i]]),
          ['Σ columna', ...MCA.sumasColumna, MCA.n * MCA.Q]
        ]}
        marca={(i, j) => i < MCA.n && j < MCA.J && MCA.Z[i][j] === 1}
        caption={<>La matriz indicadora Z: {MCA.n} × {MCA.J}, y solo ceros y unos. Cada fila
          suma {MCA.Q}; cada columna, {cafe.n}.</>}
      />

      <h3>Parte 1 · El MCA es el análisis de correspondencias de esa tabla</h3>
      <Prose>
        <p>Y ahora sí, el método. Se toma Z como si fuera una tabla de contingencia de
          personas contra categorías y se le aplica el <b>análisis de correspondencias</b> del
          bloque 1, tal cual.
          Eso son tres piezas. Las <b>masas de fila</b>: todas las personas pesan lo mismo,
          r_i = 1/{MCA.n} = {f(MCA.masaFila)}. Las <b>masas de columna</b>: cada categoría
          pesa según su frecuencia, c_j = n_j/(n·Q) = {cafe.n}/{MCA.n * MCA.Q} ={' '}
          {f(cafe.masa)}, igual para las {MCA.J} porque aquí todas tienen {cafe.n}
          personas. Y los <b>residuos estandarizados</b>: en cada celda, lo que hay menos lo
          que habría si personas y categorías fueran independientes, dividido por la raíz
          de lo esperado.</p>
        <p>Ese último es el estadístico <b>chi-cuadrado repartido celda por celda</b>. El MCA
          analiza la dependencia entre personas y categorías <b>más allá de lo esperado bajo
          independencia</b>: no pregunta quién eligió qué, sino quién eligió qué más de lo
          que el azar habría repartido.</p>
      </Prose>

      <Diagram fig={fIndicadora}>
        Las tres piezas, con sus valores en el ejemplo. Los {MCA.n * MCA.J} residuos al
        cuadrado suman la inercia total, que es lo que el paso siguiente reparte en ejes.
      </Diagram>

      <h3>Parte 1 · Los valores propios, y sus dos identidades</h3>
      <Prose>
        <p>De los residuos se hace exactamente lo que la sesión pasada hizo con las
          correlaciones: se descomponen en direcciones —los ejes— y en cuánta inercia
          retiene cada una, que son los <b>valores propios</b> λ. El ejemplo da{' '}
          <b>{MCA.ejes}</b>: {lista(MCA.autovalores.map(f))}.</p>
        <p>Dos cosas cuadran antes de mirar nada más, y las dos se comprueban en el script
          que produjo estas cifras. <b>Suman {f(MCA.inerciaTotal)}</b>, que es
          (J − Q)/Q = ({MCA.J} − {MCA.Q})/{MCA.Q}. Y son <b>exactamente J − Q = {MCA.ejes}</b>:
          los otros valores propios de la descomposición son cero, los triviales del
          centrado. Volveremos sobre esto: que la inercia total no dependa de los datos
          tiene una consecuencia incómoda.</p>
      </Prose>

      <Cards cols="c3">
        {MCA.autovalores.map((l, k) => (
          <Card key={k} k={`eje ${k + 1}`} t={`λ = ${f(l)}`}>
            {pct(MCA.porcentajes[k])} de la inercia · acumulado {pct(MCA.acumulado[k])}
          </Card>
        ))}
      </Cards>

      <Prose>
        <p><b>En una sola línea.</b> Las mismas matrices del bloque 1, sobre la tabla disyuntiva:
          S = U Σ Vᵀ, con σ_k = √λ_k, aquí {lista(MCA.svd.sigma.map(f))}. Lo que cambia es de
          dónde salen S y las masas: P = Z/(nQ), toda masa de fila vale 1/{MCA.n} —así que
          D_r^−½ es √{MCA.n} por la identidad— y D_c = diag(n_j/nQ). Las personas son F = √n U Σ:
          la persona {MCA.matricial.persona.i} en el eje 1 es {f(MCA.matricial.persona.raizN)} ·{' '}
          {f(MCA.matricial.persona.u)} · {f(MCA.matricial.persona.sigma)} ={' '}
          <b>{f(MCA.matricial.persona.producto)}</b>, su coordenada. Las categorías son
          G = D_c^−½ V Σ: {MCA.matricial.categoria.nivel} es {f(MCA.matricial.categoria.v)} ·{' '}
          {f(MCA.matricial.categoria.sigma)} / {f(MCA.matricial.categoria.raizMasa)} ={' '}
          <b>{f(MCA.matricial.categoria.producto)}</b>, la suya. La transición en matrices es la
          del bloque 1, letra por letra.</p>
      </Prose>

      <Diagram fig={fMatricial}>
        Las tres líneas sobre la tabla disyuntiva, con lo que cambia respecto a la lluvia.
      </Diagram>

      <h3>Parte 1 · La métrica chi-cuadrado</h3>
      <Prose>
        <p>Lo que distingue al MCA del PCA no es el algoritmo: es <b>cómo mide la distancia
          entre dos personas</b>. En la distancia chi-cuadrado cada categoría pesa{' '}
          <b>1/n_j</b>, la inversa de su frecuencia. Así que <b>las diferencias en
          categorías raras pesan más</b>: compartir una característica infrecuente acerca
          mucho más que compartir una común. Dos personas que son las únicas que toman
          stevia quedan más cerca que dos que toman café con otras diez.</p>
        <p>Y de esa métrica sale una fórmula cerrada que va a ser la clave de la segunda
          mitad del bloque: la distancia de una categoría al centro del mapa es{' '}
          <b>d² = n/n_j − 1</b>. Solo depende de cuánta gente la tiene. Aquí, con{' '}
          {cafe.n} personas por categoría, todas están a {f(cafe.d2)}.</p>
      </Prose>

      <Diagram fig={fDistancia}>
        La métrica, y su consecuencia. El {MCA.n}/1 − 1 = {MCA.n - 1} de la última línea es
        lo que pasa cuando una categoría la tiene una sola persona, y es la Parte 3.
      </Diagram>

      <h3>Parte 1 · De las distancias al mapa</h3>
      <Prose>
        <p><b>La nube.</b> Cada persona es una fila de Z: un punto con {MCA.J} coordenadas —un 1
          en sus {MCA.Q} categorías, un 0 en las demás—, con masa 1/{MCA.n}, y la regla para
          medir entre dos personas es la distancia chi-cuadrado de arriba. Es la misma nube de
          perfiles del bloque 1, con {MCA.n} puntos en vez de tres.</p>
        <p><b>Los ejes.</b> El mismo salto que en la lluvia: la dirección en la que esa nube{' '}
          <b>más se estira</b> —la que más inercia conserva, pesando cada persona por su masa y
          midiendo con chi-cuadrado—, y después las siguientes, perpendiculares. El gesto es el
          del PCA de la sesión 6; la nube y la regla son estas. Hay J − Q = <b>{MCA.ejes} ejes</b>.</p>
        <p><b>Las coordenadas.</b> La de una persona en un eje es su <b>proyección</b> sobre él, y
          por eso la distancia entre dos personas en el mapa aproxima su distancia chi-cuadrado.
          Se comprueba sobre las personas {sl.personas[0]} y {sl.personas[1]}, las dos más
          lejanas: por la tabla disyuntiva, d = <b>{f(sl.dZ)}</b>; por las coordenadas sobre los{' '}
          {sl.ejes} ejes, <b>{f(sl.dTodosLosEjes)}</b>, la misma; por las {sl.ejesMapa} del mapa,{' '}
          <b>{f(sl.dMapa)}</b>. Lo que falta es lo que el plano no retiene: el{' '}
          {f(Math.round((100 - sl.retenido) * 10) / 10)} %. Es el mismo salto de la lluvia; cambia la
          tabla.</p>
      </Prose>

      <Diagram fig={fSalto}>
        Los mismos tres peldaños del bloque 1, sobre la tabla disyuntiva: la nube, los ejes, las
        coordenadas.
      </Diagram>

      <h3>Parte 1 · Las fórmulas de transición</h3>
      <Prose>
        <p>Las coordenadas de las personas y las de las categorías no son dos resultados
          independientes: <b>cada uno se obtiene del otro</b>. Salvo una dilatación por
          1/√λ, <b>una persona está en el baricentro de sus categorías, y una categoría en
          el baricentro de sus personas</b>. Eso es lo que permite dibujar a las dos en el
          mismo plano y leer una junto a la otra.</p>
        <p>Se comprueba sobre el individuo {t.individuo} en el eje 1. Sus tres categorías
          están en {lista(t.categorias.map(c => f(c.coord)))}; el promedio es{' '}
          <b>{f(t.baricentro)}</b>; dividido por √λ₁ = {f(t.raizLambda)} da{' '}
          <b>{f(t.dilatado)}</b>, que es su coordenada publicada, {f(t.coordPublicada)}. El
          script lo comprueba para las {MCA.n} personas antes de escribir nada.</p>
      </Prose>

      <Diagram fig={fTransicion}>
        Las dos fórmulas, y la verificación sobre el individuo {t.individuo}. La dilatación
        es la misma en las dos direcciones.
      </Diagram>

      <h3>Parte 1 · La inercia total y la corrección de Benzécri</h3>
      <Prose>
        <p>Aquí está la consecuencia incómoda. La inercia total es (J − Q)/Q: <b>depende
          solo de cuántas categorías y cuántas variables hay</b>, no de los datos. Con{' '}
          {MCA.ejes} ejes no triviales, el valor propio promedio es 1/Q = {f(b.umbral)}.
          Eso hace que los porcentajes crudos sean <b>artificialmente pesimistas</b>: buena
          parte de la inercia es un artefacto de la codificación disyuntiva, no estructura
          de los datos.</p>
        <p>La <b>corrección de Benzécri</b> re-escala solo los valores propios que superan
          ese promedio. En el ejemplo lo supera {b.superan.length === 1 ? 'uno solo' : `${b.superan.length}`}
          , el eje {b.superan.join(' y el ')}: λ₁ = {f(MCA.autovalores[0])} pasa a{' '}
          {f(b.ajustados[0])} ajustado. El eje 1 tenía {pct(MCA.porcentajes[0])} crudo y
          pasa a <b>{pct(b.porcentajesAjustados[0])}</b> ajustado — que es exactamente la
          advertencia: <b>con datos tan pequeños la corrección exagera</b>. Greenacre
          propone una variante menos optimista que ajusta también el denominador; lo que
          importa es saber que los dos porcentajes existen y decir cuál se está leyendo.</p>
      </Prose>

      <Diagram fig={fInercia}>
        La inercia total y la corrección, con el umbral 1/Q del ejemplo y qué lo supera.
      </Diagram>

      <h3>Parte 1 · La matriz de Burt</h3>
      <Prose>
        <p>Hay una segunda manera de llegar a lo mismo. La <b>matriz de Burt</b>, B = ZᵀZ,
          contiene todas las tablas de contingencia cruzadas de las variables, dos a dos.
          Aplicarle el análisis de correspondencias da <b>las mismas coordenadas
          estandarizadas de categorías</b>, con los valores propios <b>al cuadrado</b>. En
          el ejemplo: {lista(MCA.burt.autovalores.map(f))}, que son {lista(MCA.burt.cuadrados.map(f))}
          {' '}— los cuadrados de {lista(MCA.autovalores.map(f))}. Es una comprobación que el
          script hace con B calculada aparte, y una razón para no asustarse cuando un
          programa reporta valores propios distintos: puede estar mirando Burt.</p>
      </Prose>

      <NumTable
        cols={['eje', 'λ de Z', 'λ²', 'λ de Burt']}
        rows={MCA.autovalores.map((l, k) => [`eje ${k + 1}`, f(l), f(MCA.burt.cuadrados[k]), f(MCA.burt.autovalores[k])])}
        caption={<>Los valores propios de la tabla disyuntiva, sus cuadrados, y los del análisis
          de la matriz de Burt: las dos últimas columnas son la misma.</>}
      />

      <h3>Parte 1 · Contribución y coseno cuadrado</h3>
      <Prose>
        <p>Dos herramientas para leer lo que salió, y son las dos que la segunda mitad del
          bloque va a necesitar. La <b>contribución</b> de una categoría a un eje es qué
          parte de ese eje puso ella: c_j·g²/λ. Suman 1 por eje, y <b>las altas definen el
          eje</b>. El <b>coseno cuadrado</b> es qué tan fiel es la posición del punto en ese
          eje: g²/d². Suma 1 por punto sobre todos los ejes, y dice de qué puntos uno se
          puede fiar en un dibujo que solo muestra dos.</p>
        <p>Con J = {MCA.J} categorías, el aporte promedio es 1/J = <b>{pct(MCA.aportePromedio)}</b>.
          Solo lo superan {lista(nombran.map(rotulo))}, con {pct(nombran[0].ctr[0])} cada
          una. Por eso <b>el eje 1 se llama «{nombreEje1}»</b>, y no se llama nada más: las
          otras cuatro categorías están por debajo del promedio y no lo nombran.</p>
        <p>De dónde salen las dos —por qué las contribuciones suman uno por eje y los cos² uno por
          punto— lo dedujo el bloque 1, y la deducción es la misma sobre la tabla disyuntiva:
          cambian D_r y D_c, no el argumento.</p>
      </Prose>

      <Diagram fig={fContribucion}>
        Las dos fórmulas, con Café en el eje 1 como ejemplo.
      </Diagram>

      <NumTable
        cols={['categoría', 'ctr eje 1', 'cos² eje 1', 'cos² eje 2']}
        rows={MCA.categorias.map(c => [rotulo(c), pct(c.ctr[0]), f(c.cos2[0]), f(c.cos2[1])])}
        marca={(i, j) => j === 0 && MCA.categorias[i].ctr[0] > MCA.aportePromedio}
        caption={<>Contribución y calidad en el eje 1. Señaladas, las contribuciones que superan
          el aporte promedio de {pct(MCA.aportePromedio)}. {rotulo(manana)} tiene cos²{' '}
          {f(manana.cos2[0])} en el eje 1 y {f(manana.cos2[1])} en el 2: se juzga en el plano
          completo, no en un eje.</>}
      />

      <h3>Parte 2 · El mapa factorial</h3>
      <Diagram fig={mapaBase}>
        Categorías como cuadrados, en el color de su variable; personas como círculos. Las
        que coinciden se dibujan una vez y se nombran juntas.
      </Diagram>

      <Pair>
        <Prose>
          <h4>Eje 1 · {pct(MCA.porcentajes[0])}</h4>
          <p>Un <b>gradiente</b>: «cafeteros mañaneros dulces» contra «teteros nocturnos
            amargos». Café y Té están más lejos del origen (±{f(Math.abs(cafe.coord[0]))})
            que las otras cuatro (±{f(Math.abs(manana.coord[0]))}): <b>la bebida es el
            esqueleto</b> del gradiente, y horario y azúcar lo siguen con excepciones. Los
            perfiles puros, {lista(puros.filter(i => MCA.individuos[i - 1].coord[0] < 0))} y{' '}
            {lista(puros.filter(i => MCA.individuos[i - 1].coord[0] > 0))}, quedan en los
            extremos, ±{f(Math.abs(MCA.individuos[0].coord[0]))}.</p>
        </Prose>
        <Prose>
          <h4>Eje 2 · {pct(MCA.porcentajes[1])}</h4>
          <p><b>Las excepciones al patrón.</b> Café y Té están en cero: no participan. El
            eje opone {lista(catsArriba)} arriba contra {lista(catsAbajo)} abajo, y con ellas
            a los discordantes: {lista(arriba)} arriba, {lista(abajo)} abajo. Un eje entero
            para decir quién rompe el patrón y por dónde.</p>
        </Prose>
      </Pair>

      <Prose>
        <h4>Tres reglas de proximidad, y un filtro</h4>
        <List>
          <li><b>Categoría con categoría de variables distintas:</b> una asociación válida —
            las eligen las mismas personas—. Café cerca de Mañana significa algo.</li>
          <li><b>Categorías de la misma variable:</b> opuestas por construcción. Que Café y Té
            estén lejos no es un hallazgo; lo que sí informa es <i>cuánto</i> se separan,
            que es cuánto discrimina la variable.</li>
          <li><b>Persona con categoría:</b> válido por la relación baricéntrica, y
            cualitativamente — recuerden la dilatación 1/√λ, que no es la misma en los dos
            ejes.</li>
        </List>
        <p>Y antes de interpretar cualquier punto, <b>su cos²</b>. La regla práctica:{' '}
          <b>cos² menor que {f(UMBRAL_COS2)} en el plano, y el punto no se interpreta</b>. El{' '}
          {f(UMBRAL_COS2)} es una decisión, como el 1,5 de la caja: está escrito, y por eso
          se puede discutir.</p>
      </Prose>


      <h3>Parte 3 · La patología de las categorías raras</h3>
      <Prose>
        <p>Ahora un cambio pequeño en la tabla. La tercera variable deja de ser «¿azúcar sí o
          no?» y pasa a ser <b>Endulzante</b>, con tres categorías: {lista(MCA_RARA.categorias
            .filter(c => c.variable === 'Endulzante').map(c => `${c.nivel} (${c.n})`))}.
          Quien decía «no» ahora dice qué toma en vez de azúcar, y resulta que <b>una sola
          persona, la {rara.portador}, toma stevia</b>. Nada más cambió. Ahora J ={' '}
          {MCA_RARA.J}, la inercia total es (J − Q)/Q = {f(MCA_RARA.inerciaTotal)}, y hay{' '}
          {MCA_RARA.ejes} ejes.</p>
      </Prose>

      <NumTable
        cols={['persona', ...TABLA_RARA.columnas]}
        rows={TABLA_RARA.filas.map((fila, i) => [i + 1, ...fila])}
        marca={(i, j) => j === 2 && TABLA_RARA.filas[i][2] === 'Stevia'}
        caption={<>La misma tabla con la tercera variable abierta. Una celda distinta de las
          demás: la de la persona {rara.portador}.</>}
      />

      <Pair>
        <Prose>
          <h4>La distancia explota con exactitud</h4>
          <p>La fórmula cerrada de la Parte 1: d² = n/n_j − 1. Para Stevia, {MCA.n}/{stevia.n} − 1
            = <b>{f(rara.d2)}</b>, una distancia de {f(rara.d)} al centro, mientras <b>todo lo
            demás vive dentro del radio {f(rara.radioResto)}</b>. Y esto <b>no depende de los
            datos</b>: cualquier categoría rara se dispara, y si n_j tiende a cero la
            distancia diverge. Es consecuencia pura de la métrica chi-cuadrado, del 1/n_j en
            cada columna. No es un accidente de estas ocho personas.</p>
        </Prose>
        <Prose>
          <h4>Una sola persona fabricó un eje entero</h4>
          <p>El eje {rara.ejeFabricado} tiene λ = {f(MCA_RARA.autovalores[ejeF])} y se lleva{' '}
            <b>{pct(MCA_RARA.porcentajes[ejeF])}</b> de la inercia. Stevia está en{' '}
            {f(stevia.coord[ejeF])}, pone <b>{pct(stevia.ctr[ejeF])}</b> de ese eje y tiene
            cos² {f(stevia.cos2[ejeF])} en él. Detrás de un eje que se lleva un tercio de la
            historia hay <b>un solo individuo entre {MCA_RARA.n}</b>. Y Stevia acapara además{' '}
            {pct(rara.inerciaTotalPct)} de la inercia total.</p>
        </Prose>
      </Pair>

      <NumTable
        cols={['categoría', `coord. eje ${rara.ejeFabricado}`, 'contribución', `cos² eje ${rara.ejeFabricado}`]}
        rows={ejeFab.map(c => [rotulo(c) + (c.n === 1 ? ' (n = 1)' : ''), f(c.coord[ejeF]), pct(c.ctr[ejeF]), f(c.cos2[ejeF])])}
        marca={(i) => ejeFab[i].nivel === 'Stevia'}
        caption={<>El eje {rara.ejeFabricado}, categoría por categoría, ordenado por
          contribución. El aporte promedio es 1/J = {pct(MCA_RARA.aportePromedio)}.</>}
      />

      <Cards cols="c3">
        <Card red k={`individuo ${rara.portador}`} t="secuestrado">
          Estaba en ({rara.individuo7.antes.map(f).join(', ')}) sin Stevia y pasa a
          ({rara.individuo7.despues.map(f).join(', ')}) con ella: arrastrado hacia su
          categoría, fuera del gradiente donde le tocaba.
        </Card>
        <Card red k="eje 1" t={`de ${pct(rara.pctEje1.antes)} a ${pct(rara.pctEje1.despues)}`}>
          El gradiente que era la historia principal se diluye, porque un eje nuevo se
          llevó un tercio de la inercia para una persona.
        </Card>
        <Card red k="inercia total" t={`${pct(rara.inerciaTotalPct)} de Stevia`}>
          Una categoría de {MCA_RARA.J} acapara más de una quinta parte de todo lo que hay
          que explicar, y en cascada aparecen asimetrías que no están en los datos.
        </Card>
      </Cards>

      <Diagram fig={mapaRara}>
        El mismo plano con Endulzante activa. Stevia lleva su frecuencia escrita, porque es
        lo único que la distingue de una categoría que discrimina de verdad.
      </Diagram>


      <Prose>
        <h4>Los cuatro remedios</h4>
        <List>
          <li><b>Fusionar</b> con una categoría afín: Stevia + Nada → «sin azúcar». La
            categoría rara desaparece y la persona que la tenía se queda, con una respuesta
            menos fina pero con la misma información que las demás. Es el remedio más común, y
            hay que decir qué se fusionó con qué.</li>
          <li><b>Ventilar:</b> reasignar al azar los casos por debajo de un umbral,
            típicamente n_j menor que el 2 % de n. Se usa; hay que decir que se usó.</li>
          <li><b>Proyectar como suplementaria</b>, que es la parte siguiente: la categoría se
            dibuja pero no participa.</li>
          <li><b>El MCA específico</b> (Le Roux y Rouanet): se excluyen las categorías de la
            métrica y las personas conservan el resto de sus columnas.</li>
        </List>
      </Prose>

      <h3>Parte 4 · Categorías suplementarias</h3>
      <Prose>
        <p>El montaje: el análisis <b>activo</b> es la codificación gruesa —Bebida, Horario,
          Azúcar sí o no—, el de la Parte 2, con sus {MCA.ejes} ejes y sus{' '}
          {pct(MCA.porcentajes[0])}. Las dos categorías finas, {nadaSup.nivel} (n = {nadaSup.n})
          y {steviaSup.nivel} (n = {steviaSup.n}), <b>se proyectan a posteriori</b>: reciben
          coordenadas sobre unos ejes que no ayudaron a construir.</p>
        <p>La fórmula es la de transición aplicada hacia afuera: el baricentro de las personas
          de la categoría, dilatado por 1/√λ. Para Stevia son las coordenadas de la
          persona {steviaSup.individuos[0]} divididas por √λ:{' '}
          <b>({steviaSup.coord.map(f).join(', ')})</b>. Para Nada, el baricentro de{' '}
          {lista(nadaSup.individuos)}: <b>({nadaSup.coord.map(f).join(', ')})</b>. Y por la{' '}
          <b>vía dual</b> —el perfil de la columna multiplicado por las coordenadas estándar
          de las personas— sale lo mismo: ({steviaSup.coordDual.map(f).join(', ')}) y
          ({nadaSup.coordDual.map(f).join(', ')}). El script las calcula por los dos caminos
          y no publica si difieren.</p>
      </Prose>

      <Diagram fig={fSuplementaria}>
        La fórmula, y Stevia proyectada por ella.
      </Diagram>

      <h3>Parte 4 · Los dos destinos de Stevia</h3>
      <NumTable
        cols={['', 'como categoría activa', 'como suplementaria']}
        rows={[
          ['posición en el plano', `(${D.activa.posicion.map(f).join(', ')})`, `(${D.suplementaria.posicion.map(f).join(', ')})`],
          ['efecto sobre los ejes', `fabricó el eje ${D.ejeFabricado}: ${pct(D.activa.ctrEje)} de contribución`, 'contribución 0, por definición'],
          ['% del eje 1', `diluido a ${pct(D.activa.pctEje1)}`, `intacto en ${pct(D.suplementaria.pctEje1)}`],
          [`individuo ${rara.portador}`, `secuestrado a (${D.activa.individuo7.map(f).join(', ')})`, `en su lugar del gradiente, (${D.suplementaria.individuo7.map(f).join(', ')})`],
          ['cos² en el plano', `${f(D.activa.cos2Plano)} — circular: el eje se hizo para ella`, `${f(D.suplementaria.cos2Plano)} — el diagnóstico honesto`]
        ]}
        caption={<>Las cinco comparaciones, lado a lado. Las dos columnas salen de los dos
          análisis publicados, no de un párrafo.</>}
      />

      <Prose>
        <p>La clave está en la última fila. <b>Como activa, el análisis giró la cámara para
          enfocarla</b>: claro que salía «bien representada», con cos² {f(D.activa.cos2Plano)}.
          Ese cos² alto es circular — el eje existía para ella. <b>Como suplementaria, su cos²
          bajo dice la verdad</b>: {f(D.suplementaria.cos2Plano)}, está lejos, en una
          dirección que este plano no captura. El diagnóstico honesto es el segundo.</p>
      </Prose>

      <Pair>
        <Prose>
          <h4>La asimetría conceptual</h4>
          <p>Los <b>elementos activos</b> definen la métrica y la geometría: participan en los
            residuos, en la descomposición y en los valores propios. Los <b>suplementarios</b>{' '}
            son observadores: reciben coordenadas sobre una geometría ya cerrada, sin ejercer
            fuerza sobre ella. Un punto suplementario nunca mueve un eje.</p>
        </Prose>
        <Prose>
          <h4>Para qué se usan</h4>
          <List>
            <li><b>Categorías raras</b>, como Stevia: se ven, no deforman.</li>
            <li><b>Variables sociodemográficas</b> cuando el análisis es de actitudes: se
              quiere ver dónde caen, no que definan los ejes.</li>
            <li><b>Individuos atípicos</b>, por la misma razón.</li>
            <li><b>Variables de resultado</b>: lo que se quiere explicar se proyecta sobre lo
              que lo explica.</li>
          </List>
        </Prose>
      </Pair>

      <Diagram fig={mapaSuplementarias}>
        El análisis base, con Nada y Stevia como círculos punteados. Los ejes son los de la
        Parte 2, con sus mismos porcentajes: las suplementarias no los tocaron.
      </Diagram>

      <h3>Parte 5 · Los conceptos en versión humana</h3>
      <Cards cols="c4">
        <Card k="baricentro" t="el punto medio de un grupo">
          En una fiesta, «dónde está el grupo del colegio» es el medio de donde están
          parados. Cada persona se para en el medio de sus respuestas y cada categoría cuelga
          su letrero en el medio de su gente. El individuo {t.individuo}: promedio{' '}
          {f(t.baricentro)}, dilatado {f(t.dilatado)}.
        </Card>
        <Card k="inercia" t="cuánta historia hay">
          Si todos respondieran igual, el mapa sería un punto: cero historia. «El eje 1
          explica {pct(MCA.porcentajes[0])}» significa que más de la mitad de toda la historia
          se cuenta con una sola frase: «hay dos tribus». El MCA es un resumen ejecutivo que
          dice cuántas frases hay y cuánto cubre cada una.
        </Card>
        <Card k="contribución" t="quién escribió cada frase">
          Como una vaca colectiva: qué porcentaje de la frase puso cada categoría; suman 100
          por eje. Café y Té pusieron {pct(cafe.ctr[0] * 2)} del eje 1 y por eso se llama
          «{nombreEje1}». El escándalo de Stevia: {pct(stevia.ctr[ejeF])} de un eje puesto
          por una persona.
        </Card>
        <Card k="cos²" t="qué tan en serio tomar un punto">
          El salón real tiene más dimensiones que la hoja: dos personas pueden verse juntas
          en la foto y estar en pisos distintos. Café: {f(cafe.cos2[0])} en el eje 1, léelo
          con confianza. {rotulo(manana)}: {f(manana.cos2[0])} + {f(manana.cos2[1])}, júzgala
          en el plano. Stevia: {f(D.activa.cos2Plano)} activa, {f(D.suplementaria.cos2Plano)}{' '}
          suplementaria.
        </Card>
      </Cards>

      <Task label="El protocolo de lectura profesional" big="En este orden, y no en otro.">
        <Options steps>
          <li><b>Inercia por eje.</b> ¿Cuántas frases tiene el resumen y qué peso tiene cada
            una?</li>
          <li><b>Contribuciones.</b> ¿Quién escribió cada frase? Aquí se nombran los ejes,
            solo con lo que supera el aporte promedio.</li>
          <li><b>cos².</b> ¿De qué puntos me puedo fiar en este dibujo? Por debajo de{' '}
            {f(UMBRAL_COS2)}, no se interpretan.</li>
          <li><b>Posiciones y baricentros.</b> Solo al final, y solo para los puntos que
            pasaron el filtro.</li>
        </Options>
        <p>El error de principiante es saltar directo al paso 4: abrir el mapa y leer
          distancias. Todo lo que hay arriba en este bloque existe para que no lo hagamos en
          el cierre.</p>
      </Task>
    </Panel>
  );
}
