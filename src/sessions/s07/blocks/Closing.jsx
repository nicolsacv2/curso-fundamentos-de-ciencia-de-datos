import { Panel, Task, Cards, Card, Diagram, Pair, Prose, List, NumTable }
  from '../../../components/content/index.jsx';
import { COLS } from '../../../data/salon.js';
import { SEMILLA, FILAS, ORDEN_COLS, DESTINO, DESCARTADA, NO_ANALIZABLES, MARCAS, RAROS,
  ANALIZADAS, PCA, FAMD } from '../../../data/salon_limpio.js';
import { PENDIENTES } from '../../../data/syllabus.js';
import { nombre } from '../../../data/nombres.js';
import { inerciaEjes, cuadradoSalon, circuloSalon, mapaSalon } from '../figures/closing.js';
import { pasaFiltro, UMBRAL_COS2 } from '../figures/shared.js';

/* Closing of session 7 · the FAMD of the whole clean table. The order is design D7: what enters and
   what does not, the inertia by block, the inertia by axis against session 6's PCA,
   then the three plots in the protocol's order — square, circle, map —, the filter,
   the audit of the one-person categories and their supplementary version, the
   invented-cell markers as supplementary, the exit ticket and what is left.

   Every number is an interpolation from FAMD in src/data/salon_limpio.js, which step 10
   of scripts/clean_salon.py wrote and scripts/check_salon.py audits. The qualitative
   sentences were written AFTER running the script and reading the figures, and wherever
   it was possible they are built from lists filtered by a written threshold — a
   dimension is named by the variables that clear the threshold, not by a typed word.
   Where a sentence could not be built that way, a comment beside it says which export
   it depends on, so whoever regenerates the file knows what to reread. */

const f = v => String(v).replace('.', ',').replace('-', '−');
const pct = v => `${f(v)} %`;
const lista = xs => xs.map((x, i, a) =>
  <span key={String(x)}>{i ? (i === a.length - 1 ? ' y ' : ', ') : ''}<b>{x}</b></span>);
const par = c => `(${c[0] < 0 ? '−' : ''}${f(Math.abs(c[0]))}, ${c[1] < 0 ? '−' : ''}${f(Math.abs(c[1]))})`;

const A = FAMD.activo, S = FAMD.sinRaras;
const entran = ORDEN_COLS.filter(c => DESTINO[c] === 'limpia');
const fuera = ORDEN_COLS.filter(c => DESTINO[c] !== 'limpia');
const motivo = c => c in DESCARTADA ? DESCARTADA[c].motivo : NO_ANALIZABLES[c].motivo;

/* ── The written thresholds ──
   The average share is the contribution threshold, the protocol's own: a category that
   puts less than the average did not build the axis. UMBRAL_COS2 is the plane's quality
   threshold, shared with block 1. UMBRAL_VINCULO names a dimension in the square: a
   variable names an axis when it puts at least half of the 1 it could put — a decision,
   written here so that it can be argued with and so that regenerating the analysis
   renames the axes by itself. */
const UMBRAL_VINCULO = 0.5;
const vinculo = (c, k) => (A.r2[c] ? A.r2[c][k] : A.eta2[c][k]);
const nombran = k => entran.filter(c => vinculo(c, k) >= UMBRAL_VINCULO)
  .sort((a, b) => vinculo(b, k) - vinculo(a, k));

/* The categories in the plane, by what they put and how well they are shown. */
const cats = A.categorias.slice().sort((a, b) => Math.max(...b.ctr) - Math.max(...a.ctr));
const pasan = cats.filter(c => pasaFiltro(c, A.aportePromedio));
const sobrePromedio = cats.filter(c => c.ctr[0] >= A.aportePromedio || c.ctr[1] >= A.aportePromedio);
const sinCalidad = sobrePromedio.filter(c => !pasan.includes(c));
const lado = (k, signo) => pasan.filter(c => c.ctr[k] >= A.aportePromedio && Math.sign(c.coord[k]) === signo)
  .sort((a, b) => b.ctr[k] - a.ctr[k]);
const etiqueta = c => `${nombre(c.variable)}: ${c.nivel}`;

/* The one-person categories, and where the entrada's decision left them. */
const raras = A.raras;
const supl = S.suplementarias.categorias;
const suplDe = r => supl.find(s => s.variable === r.variable && s.nivel === r.nivel);
const fabrican = raras.filter(r => r.superaPromedio.some(Boolean));
const extremos = raras.filter(r => (RAROS[r.variable].extremosDevueltos || []).includes(r.nivel));
const sacos = raras.filter(r => r.nivel === RAROS[r.variable].etiqueta);
const deltaEje1 = Math.round((A.porcentajes[0] - S.porcentajes[0]) * 100) / 100;

/* The markers: the variables with invented cells, largest group first. */
const marcas = Object.entries(A.suplementarias.marcas).sort((a, b) => b[1].n - a[1].n);
const grupos = marcas.filter(([, m]) => m.n >= 3);
const mayor = marcas[0];

const numericasPorCalidad = FAMD.numericas.slice().sort((a, b) => A.variables[b].cos2 - A.variables[a].cos2);
const inerciaPorVariable = Object.entries(A.inercia.porVariable).sort((a, b) => b[1] - a[1]);
/* The session after this one, read from the syllabus: the course has nine sessions and
   this is the seventh, so what comes next is the eighth. */
const [s8titulo, s8objetivo] = PENDIENTES[8];

export default function Closing({ id, tabId, block }) {
  return (
    <Panel id={id} tabId={tabId} block={block}>
      <Task label="El salón entero" big="El método del bloque 3, sobre la tabla que la sesión 6 dejó limpia.">
        <p>Las mismas <b>{FILAS} personas</b>, la misma tabla imputada del paso 6b, con la misma
          semilla ({SEMILLA}). Entran <b>{entran.length} columnas de {COLS.length}</b>:
          las <b>{FAMD.numericas.length} cantidades</b> que el PCA de la sesión 6 ya miró{' '}
          <b>y</b> las <b>{FAMD.categoricas.length} que no son números</b> —los nombres y los
          dos órdenes— que la sesión 6 estandarizó, agrupó y rellenó, y que hasta hoy no
          habían entrado a ningún análisis. Nada se calcula aquí: el análisis corrió una vez,
          en el mismo proceso de la cadena de limpieza, y el verificador de la sesión 6 lo
          audita.</p>
      </Task>

      <h3>Qué entra, y qué no</h3>
      <Prose>
        <p>Entran exactamente las columnas que la tabla limpia marca como llegadas hasta el
          final. Quedan fuera <b>{fuera.length}</b>, y por los tres motivos que la sesión 6 ya
          dio: no hay ninguna decisión nueva en este cierre.</p>
      </Prose>

      <Cards cols="c3">
        {fuera.map(c => (
          <Card key={c} red={c in DESCARTADA} k={nombre(c)}
            t={c in DESCARTADA ? 'descartada' : 'no es una categoría'}>
            {motivo(c)}.
          </Card>
        ))}
      </Cards>

      <h3>Cuántas categorías, y cuánta inercia</h3>
      <Prose>
        <p>Las {FAMD.categoricas.length} variables no numéricas se abren en{' '}
          <b>{A.categoriasActivas} categorías</b>. La inercia total es la que el bloque 3
          predijo: p_num + Σ(J_q − 1) = {A.inercia.numericas} + {A.inercia.categoricas} ={' '}
          <b>{f(A.inercia.total)}</b>, y los {A.ejes} valores propios la suman exacta.</p>
        <p>Aquí está la advertencia del bloque 3 en vivo. <b>{nombre(inerciaPorVariable[0][0])}</b>{' '}
          y <b>{nombre(inerciaPorVariable[1][0])}</b>, con {FAMD.niveles[inerciaPorVariable[0][0]].length} niveles
          cada una, ponen {f(inerciaPorVariable[0][1])} unidades de inercia total cada una;{' '}
          <b>{nombre(inerciaPorVariable[inerciaPorVariable.length - 1][0])}</b>, con{' '}
          {FAMD.niveles[inerciaPorVariable[inerciaPorVariable.length - 1][0]].length}, pone{' '}
          {f(inerciaPorVariable[inerciaPorVariable.length - 1][1])}. Una variable de muchas
          categorías <b>pone más inercia total</b> aunque por eje siga acotada por 1: hay que
          mirar las contribuciones por grupo, no dar por hecho que todas pesan igual.</p>
      </Prose>

      <NumTable
        cols={['variable', 'niveles J_q', 'inercia J_q − 1']}
        rows={inerciaPorVariable.map(([c, v]) => [nombre(c), FAMD.niveles[c].length, f(v)])}
        caption={<>Lo que pone cada una de las {FAMD.categoricas.length} cualitativas. Las{' '}
          {FAMD.numericas.length} cantidades ponen 1 cada una.</>}
      />

      <h3>La inercia por eje, contra el PCA de la sesión 6</h3>
      <Diagram fig={inerciaEjes}>
        Los {A.ejes} ejes, con el acumulado. La línea punteada es el PCA de la sesión 6, en la
        misma escala, para que se vea y para que se vea que no es lo mismo.
      </Diagram>

      <Prose>
        <p>El eje 1 retiene <b>{pct(A.porcentajes[0])}</b> y el eje 2, <b>{pct(A.porcentajes[1])}</b>:
          entre los dos, <b>{pct(A.acumulado[1])}</b>. Las dos primeras componentes del PCA de la
          sesión 6 retenían <b>{pct(PCA.acumulado[1])}</b>. Y esos dos porcentajes <b>no miden sobre el
          mismo total</b>: el del PCA era {PCA.variables.length}, una unidad por variable; el de
          hoy es {f(A.inercia.total)}, porque cada variable de J_q niveles puso J_q − 1. Un
          porcentaje de {f(A.inercia.total)} unidades nunca va a parecerse a uno de{' '}
          {PCA.variables.length}. Lo comparable no es el porcentaje: es <b>qué entró</b>.
          Allá, {PCA.variables.length} variables; aquí, {entran.length}, y las{' '}
          {FAMD.categoricas.length} nuevas son las que la sesión 6 dijo que probablemente mejor
          distinguen a unas personas de otras. Ahora se va a ver si es cierto, con el protocolo
          y no con el ojo.</p>
      </Prose>

      <h3>Primero, el cuadrado de relaciones</h3>
      <Diagram fig={cuadradoSalon}>
        Las {entran.length} variables como iguales: círculos las cantidades, cuadrados los
        nombres. Cuanto más lejos del origen, más participa una variable del plano.
      </Diagram>

      <Prose>
        <p>El cuadrado nombra las dimensiones, y aquí se nombran <b>solo con las variables
          que superan un umbral escrito</b>: r² o η² de al menos {f(UMBRAL_VINCULO)}, la mitad
          de lo que una variable puede poner en un eje. Regenerar el análisis vuelve a
          nombrar los ejes solo.</p>
        <List>
          <li><b>Eje 1 · {pct(A.porcentajes[0])}:</b>{' '}
            {nombran(0).length
              ? <>{lista(nombran(0).map(nombre))} — con vínculos de{' '}
                  {nombran(0).map(c => f(vinculo(c, 0))).join(', ')} y contribuciones de{' '}
                  {nombran(0).map(c => pct(A.variables[c].ctr[0])).join(', ')}. Lo que se
                  comparte en este eje es eso, y no otra cosa.</>
              : <>ninguna variable llega a {f(UMBRAL_VINCULO)}: el eje no tiene nombre.</>}
          </li>
          <li><b>Eje 2 · {pct(A.porcentajes[1])}:</b>{' '}
            {nombran(1).length
              ? <>{lista(nombran(1).map(nombre))} — vínculos de{' '}
                  {nombran(1).map(c => f(vinculo(c, 1))).join(', ')}, contribuciones de{' '}
                  {nombran(1).map(c => pct(A.variables[c].ctr[1])).join(', ')}.</>
              : <>ninguna variable llega a {f(UMBRAL_VINCULO)}: el eje no tiene nombre.</>}
          </li>
        </List>
        <p>Todo lo demás está cerca del origen. <b>{entran.length - nombran(0).length - nombran(1).length}</b>{' '}
          de las {entran.length} variables participan poco de este plano — igual que en el
          PCA de la sesión 6, la mayoría de las columnas no se dan la mano.</p>
      </Prose>

      <h3>Después, el círculo de correlaciones</h3>
      <Diagram fig={circuloSalon}>
        Las {FAMD.numericas.length} cantidades, con los mismos dos ejes del cuadrado.
      </Diagram>

      <Prose>
        <p>El detalle de las numéricas. Las mejor representadas en el plano son{' '}
          {lista(numericasPorCalidad.slice(0, 3).map(nombre))}, con cos² de{' '}
          {numericasPorCalidad.slice(0, 3).map(c => f(A.variables[c].cos2)).join(', ')}.{' '}
          {nombre(numericasPorCalidad[0])} crece hacia{' '}
          {A.correlaciones[numericasPorCalidad[0]][0] > 0 ? 'los valores positivos' : 'los valores negativos'}{' '}
          del eje 1 (r = {f(A.correlaciones[numericasPorCalidad[0]][0])}). La peor es{' '}
          <b>{nombre(numericasPorCalidad[numericasPorCalidad.length - 1])}</b>, con cos²{' '}
          {f(A.variables[numericasPorCalidad[numericasPorCalidad.length - 1]].cos2)}: su flecha
          es corta porque apunta a otros ejes, no porque no varíe. Ninguna llega al borde.</p>
      </Prose>

      <h3>Y al final, el mapa con los baricentros</h3>
      <Diagram fig={mapaSalon}>
        Las {FILAS} personas y los {A.categoriasActivas} baricentros. Los rótulos son el
        resultado del filtro que sigue, no una elección a ojo.
      </Diagram>

      <h3>El filtro, antes de interpretar</h3>
      <Prose>
        <p>El protocolo del bloque 2, aplicado. Dos umbrales, los dos escritos. El{' '}
          <b>aporte promedio</b>: con {A.categoriasActivas} categorías y {FAMD.numericas.length}{' '}
          cantidades, una contribución promedio es <b>{pct(A.aportePromedio)}</b>; una
          categoría que no llega a eso en el eje 1 ni en el 2 no construyó este plano. Y el{' '}
          <b>cos² mínimo</b> de <b>{f(UMBRAL_COS2)}</b>: por debajo, el plano no muestra la
          categoría donde está. Se interpretan las que pasan los dos.</p>
      </Prose>

      <NumTable
        cols={['categoría', 'n', 'ctr eje 1', 'ctr eje 2', 'cos² plano', 'se interpreta']}
        rows={sobrePromedio.map(c => [etiqueta(c), c.n, pct(c.ctr[0]), pct(c.ctr[1]), f(c.cos2),
          pasan.includes(c) ? 'sí' : `no: cos² < ${f(UMBRAL_COS2)}`])}
        marca={(i, j) => (j === 1 && sobrePromedio[i].ctr[0] >= A.aportePromedio)
          || (j === 2 && sobrePromedio[i].ctr[1] >= A.aportePromedio)
          || (j === 4 && !pasan.includes(sobrePromedio[i]))}
        caption={<>Las {sobrePromedio.length} categorías que superan el aporte promedio de{' '}
          {pct(A.aportePromedio)} en alguno de los dos ejes, ordenadas por su contribución
          mayor. Señalado, lo que pasa el umbral de contribución y lo que no pasa el de cos².
          Las otras {A.categoriasActivas - sobrePromedio.length} están por debajo del promedio en
          los dos ejes: se dibujan, no se leen.</>}
      />

      <Pair>
        <Prose>
          <h4>Eje 1 · qué categorías lo forman</h4>
          <p>De un lado, {lado(0, 1).length ? lista(lado(0, 1).map(etiqueta)) : 'nada que pase el filtro'}
            {lado(0, 1).length ? <> ({lado(0, 1).map(c => `${c.n}`).join(', ')} personas)</> : null}.
            Del otro, {lado(0, -1).length ? lista(lado(0, -1).map(etiqueta)) : 'nada que pase el filtro'}
            {lado(0, -1).length ? <> ({lado(0, -1).map(c => `${c.n}`).join(', ')} personas)</> : null}.
            Miren los n: {lado(0, 1).concat(lado(0, -1)).filter(c => c.n <= 2).length} de las{' '}
            {lado(0, 1).length + lado(0, -1).length} que forman este eje tienen una o dos
            personas. Es la Parte 3 del bloque 2, y se audita abajo.</p>
        </Prose>
        <Prose>
          <h4>Eje 2 · qué categorías lo forman</h4>
          <p>De un lado, {lado(1, 1).length ? lista(lado(1, 1).map(etiqueta)) : 'nada que pase el filtro'}
            {lado(1, 1).length ? <> ({lado(1, 1).map(c => `${c.n}`).join(', ')} personas)</> : null}.
            Del otro, {lado(1, -1).length ? lista(lado(1, -1).map(etiqueta)) : 'nada que pase el filtro'}
            {lado(1, -1).length ? <> ({lado(1, -1).map(c => `${c.n}`).join(', ')} personas)</> : null}.
            Aquí los grupos son más grandes: este eje lo sostienen más personas que el
            primero.</p>
        </Prose>
      </Pair>

      <Prose>
        <p>Pasan el filtro <b>{pasan.length} de {A.categoriasActivas}</b> categorías.{' '}
          {sinCalidad.length
            ? <>{lista(sinCalidad.map(etiqueta))} superan el promedio en un eje pero tienen cos²
                por debajo de {f(UMBRAL_COS2)}: construyeron algo, pero no aquí — no se interpretan
                en este plano.</>
            : <>Todas las que superan el promedio tienen también cos² suficiente.</>}{' '}
          Y de las personas, la mejor representada en el plano tiene cos²{' '}
          {f(Math.max(...A.personas.map(p => p.cos2)))} y la peor,{' '}
          {f(Math.min(...A.personas.map(p => p.cos2)))}: leer la posición de una persona
          concreta en este dibujo es, en la mayoría de los casos, leer una sombra muy corta.</p>
      </Prose>

      <h3>Las categorías de una sola persona</h3>
      <Prose>
        <p>La Stevia del salón. Antes de creerle al eje 1 hay que preguntar quién lo hizo, y la
          fórmula del bloque 2 dice dónde mirar: una categoría con una persona está a{' '}
          d² = {FILAS}/1 − 1 = <b>{f(raras[0].d2)}</b> del centro, contra un máximo de{' '}
          {f(FILAS / 2 - 1)} para una que tenga a la mitad de la clase. El script las busca{' '}
          <b>por frecuencia, n_j = 1, no por nombre</b>, y encuentra <b>{raras.length}</b>:{' '}
          {lista(raras.map(r => `${nombre(r.variable)}: ${r.nivel}`))}.</p>
        <p>{extremos.length
            ? <>{lista(extremos.map(r => `${r.nivel} de ${nombre(r.variable)}`))} son los extremos
                de un orden que el paso 3b decidió no agrupar, a sabiendas. </>
            : null}
          {sacos.length
            ? <>{lista(sacos.map(r => `el «${r.nivel}» de ${nombre(r.variable)}`))} son otra
                cosa: sacos de «raro» con <b>una sola persona dentro</b>, porque en esa variable
                solo un nivel era raro. Agrupar no garantiza tamaño, y esto lo enseña.</>
            : null}</p>
      </Prose>

      <NumTable
        cols={['categoría', 'fila', 'd²', 'ctr eje 1', 'ctr eje 2', 'activa: posición · cos²', 'suplementaria: posición · cos²']}
        rows={raras.map(r => {
          const s = suplDe(r);
          return [`${nombre(r.variable)}: ${r.nivel}`, r.fila, f(r.d2), pct(r.ctr[0]), pct(r.ctr[1]),
            `${par(r.coord)} · ${f(r.cos2)}`, s ? `${par(s.coord)} · ${f(s.cos2)}` : '—'];
        })}
        marca={(i, j) => (j === 2 && raras[i].superaPromedio[0]) || (j === 3 && raras[i].superaPromedio[1])}
        caption={<>Las {raras.length} categorías de una persona en los dos montajes. Señaladas, las
          contribuciones que superan el aporte promedio de {pct(A.aportePromedio)}.</>}
      />

      <Prose>
        {/* Depends on FAMD.activo.raras[*].superaPromedio and .ctr: reread after regenerating. */}
        <p>{fabrican.length
            ? <><b>Sí</b>: {lista(fabrican.map(r => `${nombre(r.variable)}: ${r.nivel}`))} superan el
                aporte promedio en el eje {fabrican[0].superaPromedio[0] ? 1 : 2}, con{' '}
                {fabrican.map(r => pct(r.ctr[fabrican[0].superaPromedio[0] ? 0 : 1])).join(' y ')} frente a{' '}
                {pct(A.aportePromedio)}. Una persona
                {fabrican.length > 1 && new Set(fabrican.map(r => r.fila)).size === 1
                  ? <>, la de la fila {fabrican[0].fila}, que tiene las {fabrican.length} a la vez,</>
                  : null}{' '}
                puso sola una parte del eje que ninguna categoría de la clase entera puso.</>
            : <><b>No</b>: ninguna de las {raras.length} supera el aporte promedio en los dos primeros
                ejes. Están lejos del centro, pero este plano no las enfocó.</>}</p>
        {/* Depends on FAMD.sinRaras.porcentajes[0] against FAMD.activo.porcentajes[0]. */}
        <p>Y el segundo montaje dice cuánto mandan. Sin ellas en el análisis, proyectadas como
          suplementarias al estilo del MCA específico —la persona conserva el resto de sus
          columnas—, el eje 1 pasa de {pct(A.porcentajes[0])} a <b>{pct(S.porcentajes[0])}</b>
          {Math.abs(deltaEje1) < 0.5
            ? <>: casi no se mueve. A diferencia de Stevia, aquí las categorías de una persona
                no fabricaron el eje: <b>lo subrayaron</b>. </>
            : <>: {f(Math.abs(deltaEje1))} puntos de diferencia, el eje sí dependía de ellas. </>}
          {fabrican.length && suplDe(fabrican[0])
            ? <>Como suplementaria, {nombre(fabrican[0].variable)}: {fabrican[0].nivel} pasa de{' '}
                {par(fabrican[0].coord)} a {par(suplDe(fabrican[0]).coord)} y su cos² de{' '}
                {f(fabrican[0].cos2)} a {f(suplDe(fabrican[0]).cos2)}
                {Math.hypot(...suplDe(fabrican[0]).coord) > 2
                  ? <>: su persona sigue lejos, por sus otras respuestas. El eje 1 no era de ella;
                      ella estaba en él.</>
                  : <>: su persona vuelve al centro. El eje 1 la tenía a ella por sujeto.</>}</>
            : null}</p>
        <p>Lo que esto dice sobre la decisión de la sesión 6: no agrupar los extremos de un
          orden fue lo correcto <b>y</b> tuvo un precio que ahora está medido. Agrupar el «5»
          con el «4» habría dicho que comer muy balanceado es raro; dejarlo solo lo puso a{' '}
          {f(raras[0].d2)} del centro. La decisión sigue siendo buena; lo que cambia es que
          ahora se sabe cuánto costó.</p>
      </Prose>

      <h3>Las marcas de celda inventada</h3>
      <Prose>
        <p>La pregunta que la sesión 6 dejó abierta: <b>¿dejar cosas en blanco va con algo?</b>{' '}
          Por cada variable que recibió valores inventados, el grupo de personas cuya celda
          se inventó se proyecta como <b>categoría suplementaria</b>: su baricentro y su cos²,
          sin haber entrado en X. <b>No deformaron los ejes</b>, por construcción — es lo
          que la sesión 6 exigió de las marcas cuando dijo que al análisis no entran.</p>
      </Prose>

      <NumTable
        cols={['marca de', 'personas', 'filas', 'posición', 'cos² plano']}
        rows={marcas.map(([c, m]) => [`${nombre(c)} inventado`, m.n, m.filas.join(', '), par(m.coord), f(m.cos2)])}
        marca={(i, j) => j === 0 && marcas[i][1].n >= 3}
        caption={<>Las {marcas.length} marcas, una por variable con celdas inventadas, ordenadas
          por cuántas personas las forman. Señaladas, las que juntan a tres o más.</>}
      />

      <Prose>
        {/* Depends on FAMD.activo.suplementarias.marcas[*].cos2 and .n: reread after regenerating. */}
        <p>La respuesta, con las cifras delante. {grupos.length
            ? <>La única marca que junta a un grupo de verdad es la de <b>{nombre(mayor[0])}</b>,
                con {mayor[1].n} personas, y su cos² en el plano es <b>{f(mayor[1].cos2)}</b>: está
                en el centro del mapa, en la dirección de nada. </>
            : <>Ninguna marca junta a tres personas o más. </>}
          Las marcas de una o dos personas <b>son esas personas</b>, no un grupo: donde una tiene
          cos² alto es porque su única persona está lejos del centro por sus otras
          respuestas, no porque dejar esa celda en blanco vaya con algo. <b>Dejar en blanco no
          va con nada</b> que este plano pueda ver. Y la respuesta honesta tiene la forma que
          el bloque 2 enseñó: no es que las marcas no importen, es que su cos² dice que este
          plano no las captura.</p>
      </Prose>


      <Task
        label="Ticket de salida · chat · 2 minutos"
        big={<>Nombra una variable no numérica que hoy entró al análisis, y di qué te dijo —o qué
          no te dijo— el cuadrado de relaciones sobre ella.</>}
      >
        <p>Las dos mitades cuentan igual. Elegir una de las {FAMD.categoricas.length} que hasta hoy
          no habían entrado a nada, y leerle su punto en el cuadrado: cerca de un eje, cerca del
          otro, o cerca del origen. Las tres respuestas son válidas si se dice cuál es.</p>
      </Task>

      <Pair>
        <Prose>
          <h4>Respuestas que sirven</h4>
          <List>
            <li>«{nombre(nombran(1)[0] || FAMD.categoricas[0])}: está pegada al eje 2, con η² de{' '}
              {f(vinculo(nombran(1)[0] || FAMD.categoricas[0], 1))}. Ese eje se llama en parte
              así.»</li>
            <li>«{nombre(nombran(0)[0] || FAMD.categoricas[1])}: es de las que nombran el eje 1,
              y en el mapa sus categorías con más contribución tienen dos personas. Lo leo con
              cuidado.»</li>
            <li>«{nombre(entran.filter(c => !A.r2[c]).sort((a, b) => Math.max(...A.eta2[a].slice(0, 2)) - Math.max(...A.eta2[b].slice(0, 2)))[0])}:
              está en el origen del cuadrado. El plano no me dijo nada de ella, y eso es un
              resultado: no va con lo que forma estos dos ejes.»</li>
          </List>
        </Prose>
        <Prose>
          <h4>Respuestas que no</h4>
          <List>
            <li>«El departamento, porque en el mapa Antioquia está lejos» — lejos de qué, y con
              cuántas personas. Sin el n y sin el cos², una posición no es una lectura.</li>
            <li>«La música, porque el eje 1 es el eje de la música» — ¿con qué contribución?
              Un eje se nombra con lo que supera el promedio, no con lo que uno quiere ver.</li>
            <li>«Ninguna, el plano solo tiene {pct(A.acumulado[1])}» — el porcentaje es bajo, y
              aun así el cuadrado dijo qué variables van juntas y cuáles no. Poco no es nada.</li>
          </List>
        </Prose>
      </Pair>

      <h3>Lo que queda</h3>
      <Prose>
        <p>Dos sesiones abrieron con la misma limitación: la tabla del salón llevaba tres
          sesiones con nosotros y no la habíamos analizado entera, porque casi nada de lo que
          dice son números. La sesión 6 la dejó limpia y preguntó qué faltaba; <b>hoy se
          analizó entera</b>: {entran.length} columnas de {COLS.length}, y las{' '}
          {fuera.length} que faltan tienen su motivo escrito, no olvidado. Con el mismo
          algoritmo de la sesión 5 y dos maneras de escalar columnas, y con un protocolo de
          lectura que va antes que el ojo.</p>
        <p>La sesión que viene se llama <b>«{s8titulo}»</b>: {s8objetivo.charAt(0).toLowerCase() + s8objetivo.slice(1)}{' '}
          Lo que llevamos es una tabla limpia que ya se puede analizar toda, y la costumbre de
          preguntar quién construyó cada resultado antes de creerle.</p>
      </Prose>
    </Panel>
  );
}
