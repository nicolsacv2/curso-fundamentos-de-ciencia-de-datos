import { Panel, Task, Options, Cards, Card, Diagram, Pair, Prose, List, NumTable }
  from '../../../components/content/index.jsx';
import { PERSONAS, TABLA_MIXTA, FAMD } from '../data/ejemplo.js';
import { fReescalado, fEquilibrio, fR2, fEta2, mapaIndividuos, circulo, cuadradoRelaciones }
  from '../figures/block3.js';

/* Block 3 of session 7 · FAMD. Parts 6 to 8 of mca_famd_guia.md and its final synthesis, in the
   guide's order: the problem before the trick, the trick, the balance property, the
   mixed example with its verification and interpretation, THEN how r², η² and the
   percentages are computed — first the result, then where it came from — and with
   that the three plots and their reading order. The guide's part 8.4 — software and
   the call in R — does not come along: the audience is not technical and the material
   must not depend on a language, so it says in words that the method ships in the
   usual statistical programs (design D6).

   Every number is interpolated from src/sessions/s07/data/ejemplo.js, which the same
   script that wrote block 1's example produced after asserting Σr² + Ση² = λ_k and
   SC_entre + SC_dentro = SC_total. Nothing is computed while the block is open. */

const f = v => String(v).replace('.', ',').replace('-', '−');
const pct = v => `${f(v)} %`;
const lista = xs => xs.map((x, i, a) =>
  <span key={String(x)}>{i ? (i === a.length - 1 ? ' y ' : ', ') : ''}<b>{x}</b></span>);

const rotuloNum = clave => FAMD.numericas.find(v => v.clave === clave).rotulo;
const F1 = FAMD.puntuaciones.map(p => p[0]);
const F2 = FAMD.puntuaciones.map(p => p[1]);

/* Read off the data, not declared: who axis 2 separates, and who is the most extreme
   coffee drinker on axis 1. */
const discordantes = [F2.indexOf(Math.max(...F2)) + 1, F2.indexOf(Math.min(...F2)) + 1];
const cafeteros = TABLA_MIXTA.filas.map((r, i) => (r[0] === 'Café' ? i + 1 : null)).filter(Boolean);
const extremo = cafeteros.slice().sort((a, b) => F1[a - 1] - F1[b - 1])[0];
const otrosCafeteros = cafeteros.filter(i => i !== extremo);
const filaDe = i => TABLA_MIXTA.filas[i - 1];

const A = FAMD.anova, P = FAMD.pearson;
const r2Eje = k => FAMD.numericas.map(v => FAMD.r2[v.clave][k]);
const eta2Eje = k => FAMD.categoricas.map(v => FAMD.eta2[v.variable][k]);
const suma = xs => xs.reduce((a, b) => a + b, 0);
/* The categorical that axis 2 is essentially made of, and how little the numerics put. */
const catEje2 = FAMD.categoricas.reduce((m, v) => (FAMD.eta2[v.variable][1] > FAMD.eta2[m.variable][1] ? v : m));
const numEje2Max = Math.max(...r2Eje(1));

export default function Block2({ id, tabId, block }) {
  const grupos = A.grupos;

  return (
    <Panel id={id} tabId={tabId} block={block}>
      <Task label="El problema" big="No se pueden mezclar variables crudas.">
        <p>El bloque 2 lee categorías; el PCA de la sesión 6 lee cantidades. La tabla
          del salón tiene las dos cosas, y la tentación es meter todo junto en una matriz y
          buscar sus direcciones. Si se hace así, <b>la variable de mayor varianza numérica
          domina por aritmética</b>: unos minutos que van de 0 a 960 aplastan a un
          indicador que vale 0 o 1, y la primera dirección es «minutos» y nada más. No es
          un hallazgo: es una unidad de medida mandando. Hace falta un truco para que
          ningún tipo de variable pese más que el otro por cómo está escrito.</p>
      </Task>

      <h3>Parte 6 · El truco de los dos bloques</h3>
      <Prose>
        <p>El <b>análisis factorial de datos mixtos</b> —FAMD, de Escofier y Pagès— construye
          una matriz X con dos bloques re-escalados. Las <b>numéricas</b> se estandarizan
          como en el PCA: se les resta la media y se dividen por su desviación, así que{' '}
          <b>cada una aporta inercia 1</b>. Las <b>categóricas</b> entran como indicadoras,
          pero cada indicadora se divide por la raíz de su proporción y se centra: es{' '}
          <b>la ponderación chi-cuadrado del MCA disfrazada de estandarización</b>. Cada
          columna queda con varianza 1 − p_j, y <b>cada variable categórica aporta J_q − 1</b>.</p>
        <p>Y después, un <b>PCA ordinario</b> de X: la misma descomposición de la sesión 5.
          La inercia total es la suma de lo que puso cada bloque, p_num + Σ(J_q − 1).</p>
      </Prose>

      <Diagram fig={fReescalado}>
        Las dos transformaciones y la inercia total, con las varianzas del ejemplo que
        viene.
      </Diagram>

      <h3>Parte 6 · La propiedad de equilibrio</h3>
      <Prose>
        <p>Por qué funciona el truco. El primer eje del FAMD <b>maximiza</b> la suma, sobre las
          numéricas, de su <b>r²</b> con el eje, más la suma, sobre las categóricas, de su{' '}
          <b>η²</b> con el eje. Y los dos indicadores viven en [0, 1]: <b>una numérica puede
          aportar como máximo 1 por eje, y una categórica también</b>. Ningún tipo de
          variable puede empujar más que el otro.</p>
        <p>Dos casos límite dicen lo que el método es. <b>Si todo es numérico, el FAMD es el
          PCA</b> de la sesión 5. <b>Si todo es categórico, es el MCA</b> del bloque 2, salvo
          una constante. El FAMD no es un tercer método: es los dos anteriores, mezclados
          columna a columna.</p>
      </Prose>

      <Diagram fig={fEquilibrio}>
        El criterio, verificado sobre el eje 1 del ejemplo, y los dos casos límite.
      </Diagram>

      <h3>Parte 6 · El ejemplo mixto</h3>
      <Prose>
        <p>Las mismas <b>{PERSONAS} personas</b>. Se conservan dos categóricas —Bebida y
          Horario— y se añaden dos cantidades: <b>{rotuloNum('tazas')}</b> y{' '}
          <b>{rotuloNum('sueno')}</b>. Cuatro variables, dos de cada tipo.</p>
      </Prose>

      <NumTable
        cols={['persona', ...TABLA_MIXTA.columnas]}
        rows={TABLA_MIXTA.filas.map((fila, i) => [i + 1, ...fila.map(f)])}
        caption={<>La tabla mixta: {PERSONAS} filas, dos nombres y dos cantidades.</>}
      />

      <Pair>
        <Prose>
          <h4>Cuatro variables, cuatro unidades de inercia</h4>
          <p>La fórmula predice {FAMD.numericas.length} + {FAMD.categoricas.map(v => `(${v.niveles.length} − 1)`).join(' + ')} ={' '}
            <b>{f(FAMD.inerciaTotal)}</b>, y los {FAMD.ejes} valores propios suman
            exactamente {f(FAMD.inerciaTotal)}. Cada columna transformada tiene la varianza
            que el truco anuncia: 1 las numéricas, 1 − p_j = {f(FAMD.columnas.find(c => c.tipo === 'cat').varianza)}{' '}
            las {FAMD.columnas.filter(c => c.tipo === 'cat').length} indicadoras.</p>
        </Prose>
        <Prose>
          <h4>Cuántos ejes salen</h4>
          <p>Con {FAMD.columnas.length} columnas y {PERSONAS} personas, la matriz tiene rango{' '}
            {FAMD.ejes}: dos indicadoras de una misma variable binaria son una sola
            dirección. Salen <b>{FAMD.ejes} ejes</b>, y el primero se lleva casi todo. Las
            cifras vienen del mismo proceso del bloque 2, que comprobó antes de escribirlas
            que Σr² + Ση² es el valor propio en cada eje.</p>
        </Prose>
      </Pair>

      <NumTable
        cols={['columna', 'tipo', 'varianza']}
        rows={FAMD.columnas.map(c => [c.nivel ? `${c.variable} = ${c.nivel}` : rotuloNum(c.variable),
          c.tipo === 'num' ? 'numérica' : 'indicadora', f(c.varianza)])}
        pie={['inercia total', '', f(FAMD.inerciaTotal)]}
        caption={<>Las {FAMD.columnas.length} columnas de X y su varianza después del
          re-escalado.</>}
      />

      <Cards cols={FAMD.ejes === 4 ? 'c4' : 'c3'}>
        {FAMD.autovalores.map((l, k) => (
          <Card key={k} k={`eje ${k + 1}`} t={`λ = ${f(l)}`}>
            {pct(FAMD.porcentajes[k])} de la inercia · acumulado {pct(FAMD.acumulado[k])}
          </Card>
        ))}
      </Cards>

      <h3>Parte 6 · La verificación del teorema</h3>
      <NumTable
        cols={['variable', 'tipo', 'vínculo con el eje 1']}
        rows={[
          ...FAMD.numericas.map(v => [rotuloNum(v.clave), 'r²', f(FAMD.r2[v.clave][0])]),
          ...FAMD.categoricas.map(v => [v.variable, 'η²', f(FAMD.eta2[v.variable][0])])
        ]}
        pie={['suma', '', `${f(Math.round(suma([...r2Eje(0), ...eta2Eje(0)]) * 10000) / 10000)} = λ₁`]}
        caption={<>Los cuatro sumandos del eje 1 y su suma, que es el primer valor propio,{' '}
          {f(FAMD.autovalores[0])}. Ninguna variable pasa de 1.</>}
      />

      <h3>Parte 6 · La interpretación</h3>
      <Pair>
        <Prose>
          <h4>Eje 1 · {pct(FAMD.porcentajes[0])}</h4>
          <p>Un <b>gradiente de estilo de vida completo</b>: cafeteros mañaneros que toman
            mucho y duermen poco contra teteros nocturnos que toman poco y duermen mucho.{' '}
            {rotuloNum('tazas')} tiene r² {f(FAMD.r2.tazas[0])} y {rotuloNum('sueno')},{' '}
            {f(FAMD.r2.sueno[0])}: <b>las numéricas confirmaron y reforzaron la estructura
            categórica</b>, que ya estaba en el bloque 2 con Bebida a η² {f(FAMD.eta2.Bebida[0])}.</p>
        </Prose>
        <Prose>
          <h4>Eje 2 · {pct(FAMD.porcentajes[1])}</h4>
          <p><b>Esencialmente categórico.</b> {catEje2.variable} tiene η² {f(FAMD.eta2[catEje2.variable][1])}{' '}
            en él, y las numéricas r² de {f(FAMD.r2.tazas[1])} y {f(FAMD.r2.sueno[1])} — como
            máximo {f(numEje2Max)}. Separa a los discordantes, las personas {lista(discordantes)}:
            la que rompe el patrón hacia un lado y la que lo rompe hacia el otro.</p>
        </Prose>
      </Pair>

      <Prose>
        <p>Y lo que las numéricas añaden que el MCA no tenía: <b>gradúan a las personas
          dentro de cada tribu</b>. Entre los cafeteros, la persona {extremo} —con{' '}
          {f(filaDe(extremo)[2])} tazas y {f(filaDe(extremo)[3])} horas de sueño— es la más
          extrema del eje 1, en {f(F1[extremo - 1])}, más lejos que las personas{' '}
          {lista(otrosCafeteros)} ({otrosCafeteros.map(i => f(F1[i - 1])).join(', ')}). En
          el bloque 2 las tres primeras eran un mismo punto.</p>
      </Prose>


      <h3>Parte 7 · Cómo se calcula el porcentaje de un eje</h3>
      <Prose>
        <p>Ya vimos el resultado; ahora de dónde salió cada cifra. La primera es la más fácil
          y conviene verla escrita: el porcentaje de un eje es <b>su valor propio dividido por
          la inercia total</b>. De las {f(FAMD.inerciaTotal)} unidades de historia, el eje 1 se
          quedó con {f(FAMD.autovalores[0])}.</p>
      </Prose>

      <Cards cols="c3">
        <Card k="valor propio" t={`λ₁ = ${f(FAMD.autovalores[0])}`}>lo que retiene el eje 1</Card>
        <Card k="inercia total" t={`I = ${f(FAMD.inerciaTotal)}`}>lo que había que explicar</Card>
        <Card k="cociente" t={`${f(FAMD.autovalores[0])} / ${f(FAMD.inerciaTotal)} = ${pct(FAMD.porcentajes[0])}`}>
          el porcentaje del eje 1
        </Card>
      </Cards>

      <h3>Parte 7 · r², paso a paso</h3>
      <Prose>
        <p>Las puntuaciones de un eje son <b>una variable más</b>: {PERSONAS} números, uno por
          persona. En el eje 1 son ({F1.map(v => f(Math.round(v * 100) / 100)).join(', ')}).
          Y hay un dato útil escondido ahí: <b>su varianza es {f(FAMD.varianzaPuntuaciones[0])}
          = λ₁</b>. El valor propio <i>es</i> la varianza de las puntuaciones.</p>
        <p>Con eso, r² es la correlación de Pearson de la sesión 5 entre el eje y la variable,
          al cuadrado. Para {rotuloNum(P.variable)}: la covarianza es {f(P.cov)}; la desviación
          del eje, √{f(FAMD.autovalores[0])} = {f(P.sF)}; la de tazas, √{f(P.varTazas)} ={' '}
          {f(P.sTazas)}. Entonces r = {f(P.cov)} / ({f(P.sF)} · {f(P.sTazas)}) = <b>{f(P.r)}</b>,
          y r² = <b>{f(P.r2)}</b>. En palabras: sabiendo dónde está alguien en el eje se
          predice el {Math.round(P.r2 * 100)} % de la variación en tazas.</p>
      </Prose>

      <Diagram fig={fR2}>
        Las puntuaciones como variable, y Pearson al cuadrado sobre {rotuloNum(P.variable)}.
      </Diagram>

      <h3>Parte 7 · η², la descomposición ANOVA</h3>
      <Prose>
        <p>Para una categórica no hay correlación que calcular. Lo que se hace es <b>partir
          las puntuaciones por grupos</b>. {A.variable} en el eje {A.eje}: los cafeteros tienen
          media {f(grupos[0].media)} y los teteros, {f(grupos[1].media)}. La dispersión de todos,{' '}
          <b>SC_total = {f(A.scTotal)}</b>, se parte en dos: la separación entre las medias de
          los grupos, <b>SC_entre = {f(A.scEntre)}</b>, y la dispersión interna de cada grupo,{' '}
          <b>SC_dentro = {f(A.scDentro)}</b>. Suman el total exacto.</p>
        <p>Y η² = SC_entre / SC_total = {f(A.scEntre)} / {f(A.scTotal)} = <b>{f(A.eta2)}</b>: el{' '}
          {Math.round(A.eta2 * 100)} % de la dispersión en el eje se explica solo sabiendo qué
          toma cada quien. <b>η² = 1</b> serían dos grupos que son dos puntos, sin mezcla;{' '}
          <b>η² = 0</b>, que saber la bebida no sirve de nada.</p>
      </Prose>

      <Diagram fig={fEta2}>
        La descomposición y el cociente, con la identidad por baricentros al final.
      </Diagram>

      <h3>Parte 7 · SC_dentro, en detalle</h3>
      <Prose>
        <p>Es la suma de cuadrados de cada persona respecto a la media de <b>su</b> grupo.
          Grupo por grupo:</p>
      </Prose>

      <Pair>
        {grupos.map(g => (
          <NumTable key={g.nivel}
            cols={['persona', 'F₁', 'desvío de su media', 'cuadrado']}
            rows={g.filas.map(r => [r.individuo, f(r.f), f(r.desvio), f(r.cuadrado)])}
            marca={(i) => g.filas[i].individuo === A.mayorAporte.individuo}
            pie={['subtotal', '', '', f(g.subtotal)]}
            caption={<>Grupo <b>{g.nivel}</b>, media {f(g.media)}.</>}
          />
        ))}
      </Pair>

      <Prose>
        <p>Total: <b>SC_dentro = {f(A.scDentro)}</b>, y {f(A.scEntre)} + {f(A.scDentro)} ={' '}
          {f(A.scTotal)} = SC_total, exacto: es un teorema, los términos cruzados se cancelan.
          SC_dentro mide cuán «impuras» son las tribus, y la persona{' '}
          <b>{A.mayorAporte.individuo}</b> aporta ella sola {f(A.mayorAporte.cuadrado)} de los{' '}
          {f(A.scDentro)} — el <b>{f(A.mayorAporte.fraccion)} %</b>. Los desvíos dentro del grupo
          son el rastro de las otras variables actuando.</p>
        <p>Y la identidad que conecta todo: η² también sale <b>desde los baricentros</b>,
          Σ p_j·ḡ_j²/λ₁ = {f(A.porBaricentros)}. El η² del FAMD, la contribución del MCA y la
          relación baricéntrica del bloque 2 son <b>la misma cantidad vista desde tres
          ángulos</b>.</p>
      </Prose>

      <Pair>
        <Prose>
          <h4>Dos advertencias</h4>
          <List>
            <li>Una categórica de <b>muchas categorías</b> aporta J_q − 1 de inercia total: una
              variable de seis niveles pone cinco unidades y una binaria, una. Su influencia
              por eje sigue acotada por 1, pero conviene revisar las contribuciones por grupo
              cuando las cardinalidades son dispares. Lo veremos en el cierre.</li>
            <li>La <b>patología de las categorías raras</b> del bloque 2 se hereda intacta: el
              1/√p_j sigue ahí, en cada indicadora.</li>
          </List>
        </Prose>
        <Prose>
          <h4>Alternativas, y lo que cuesta cada una</h4>
          <List>
            <li><b>Discretizar las numéricas y hacer MCA:</b> pierde información, pero captura
              relaciones no lineales.</li>
            <li><b>PCA ingenuo de dummies:</b> distorsiona; evitar.</li>
            <li><b>PCAmix:</b> prácticamente el FAMD.</li>
            <li><b>Escalamiento óptimo (CATPCA):</b> otro camino al mismo problema.</li>
            <li><b>Gower + PCoA:</b> para clustering, no para nombrar dimensiones.</li>
          </List>
          <p>El método viene implementado en los <b>programas estadísticos habituales</b>: no
            hay que programarlo, hay que saber leer lo que devuelve. Eso es lo que sigue.</p>
        </Prose>
      </Pair>

      <h3>Parte 8 · Los tres gráficos del FAMD</h3>
      <Prose>
        <p>Tres vistas complementarias que <b>comparten los mismos ejes</b>. Se presentan
          en el orden en que se dibujan; se leen en el orden inverso, que está al final.</p>
      </Prose>

      <Diagram fig={mapaIndividuos}>
        Cada persona en (F₁, F₂); cada categoría en el baricentro de su gente. Las numéricas
        no aparecen como puntos, pero ordenaron a la gente.
      </Diagram>

      <Diagram fig={circulo}>
        Cada numérica es una flecha cuyas coordenadas son sus correlaciones con los dos
        ejes.
      </Diagram>

      <Prose>
        <h4>La gramática del círculo</h4>
        <List>
          <li><b>Longitud:</b> calidad de representación. Su cuadrado es el cos² de la variable
            en el plano.</li>
          <li><b>Ángulo entre flechas:</b> aproxima la correlación entre las dos variables — lo
            de la sesión 5.</li>
          <li><b>Proyección sobre cada eje:</b> su r con ese eje. {rotuloNum('tazas')} está en
            ({FAMD.correlaciones.tazas.map(f).join(', ')}) y {rotuloNum('sueno')} en
            ({FAMD.correlaciones.sueno.map(f).join(', ')}).</li>
          <li><b>Dirección:</b> hacia dónde crece la variable en el mapa de individuos. Las
            tazas crecen hacia los cafeteros; el sueño, hacia los teteros.</li>
        </List>
      </Prose>

      <Diagram fig={cuadradoRelaciones}>
        Cada variable completa es un punto: su vínculo con cada eje, r² si es numérica y η² si
        es categórica. Círculo o cuadrado dicen el tipo antes que el color.
      </Diagram>

      <Prose>
        <p>Como los dos indicadores viven en [0, 1], <b>todo cae en un cuadrado unitario</b> y
          las variables de los dos tipos se leen igual. La <b>esquina inferior derecha</b> es
          «puro eje 1»; la <b>superior izquierda</b>, «puro eje 2»; el <b>origen</b>, «no
          participa del plano». Es el gráfico para <b>nombrar dimensiones</b> cuando hay
          muchas variables — y en el cierre habrá muchas más que aquí.</p>
      </Prose>

      <Task label="El orden de lectura" big="Cuadrado, círculo, mapa. En ese orden.">
        <Options steps>
          <li><b>Cuadrado de relaciones</b> → nombra las dimensiones: qué variables forman
            cada eje.</li>
          <li><b>Círculo de correlaciones</b> → el detalle de las numéricas: hacia dónde
            crece cada una y con qué calidad.</li>
          <li><b>Mapa de individuos con baricentros</b> → el detalle de las categóricas y la
            tipología: quién está con quién.</li>
        </Options>
        <p>En conjuntos grandes —muchas personas, muchas variables— se colorean las personas
          por una variable y <b>se etiquetan solo las de mayor cos² o contribución</b>. Lo demás
          se dibuja y se calla.</p>
      </Task>


    </Panel>
  );
}
