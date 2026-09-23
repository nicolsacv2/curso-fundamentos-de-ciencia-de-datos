import { Panel, Cards, Card, Diagram, Prose }
  from '../../../components/content/index.jsx';
import { COLS, ORDINALES, CATEGORICAS } from '../../../data/salon.js';
import {
  DESCARTADA, PCA, MATRICES
} from '../../../data/salon_limpio.js';
import { nombre } from '../../../data/nombres.js';
import { sedimento, plano, matrizDispersion, matrizCajas, matrizBarras } from '../figures/block3.js';

/* Block 3 of session 6 · what goes with what, and the PCA of the session before. Steps 6c
   and 7 of the chain, cut from the old entrada without rewriting. */

/* Every figure in this block comes out of src/data/salon_limpio.js, which
   scripts/clean_salon.py wrote once with the seed pinned. Nothing is computed while
   the session is open: the class on Tuesday and the class on Thursday see the same
   table, including the same invented values. */

const pct = n => String(n).replace('.', ',');

export default function Block3({ id, tabId, block }) {
  return (
    <Panel id={id} tabId={tabId} block={block}>
      <h3>Paso 6c · Qué va con qué</h3>
      <Prose>
        <p>Antes de analizar nada, una pregunta más simple: <b>¿hay algo que vaya con algo?</b>{' '}
          Mirar dos variables a la vez no es una sola cosa — depende de <b>qué son las dos</b>.
          Hay exactamente tres combinaciones, y cada una tiene su figura.</p>
        <p>Ninguna de las tres muestra todas las variables. Muestran <b>{MATRICES.n}</b>, porque
          con doce cada celda sería del tamaño de una uña. Y el criterio de cuáles{' '}
          <b>se calcula</b>, no lo elegimos a ojo: llevamos una hora diciendo que una decisión
          sin escribir es la que no se puede discutir, y no vamos a hacer en la figura lo que
          prohibimos en los datos.</p>
      </Prose>

      <Cards cols="c3">
        <Card k="cantidad × cantidad" t="Dispersión">
          Una nube. Si sube una y sube la otra, se inclina. Es la única que el método del
          paso siguiente sabe leer.
        </Card>
        <Card k="cantidad × nombre" t="Cajas">
          Una caja por cada nivel del nombre. Si la categoría separa la cantidad, las cajas
          quedan a distinta altura.
        </Card>
        <Card k="nombre × nombre" t="Barras agrupadas">
          Cuántas personas hay en cada combinación. Agrupadas y no apiladas: apilar muestra
          el total, que no es lo que se pregunta.
        </Card>
      </Cards>

      <Diagram fig={matrizDispersion}>
        Las {MATRICES.n} cuantitativas que más se relacionan con alguna otra. El número de
        cada celda es la correlación. Fuera del par{' '}
        <b>{MATRICES.parMasFuerte[0]}–{MATRICES.parMasFuerte[1]}</b>, casi todo son manchas
        redondas: <b>eso es que no van juntas</b>.
      </Diagram>

      <Diagram fig={matrizCajas}>
        Las mismas cantidades contra las {MATRICES.n} cualitativas{' '}
        <b>«sanas»</b> del paso 1b — pocos niveles y repartidos. Una caja <b>hueca</b> está
        hecha con menos de cuatro respuestas: se dibuja, pero no resume nada, y conviene
        saberlo antes de leerle una diferencia.
      </Diagram>

      <Diagram fig={matrizBarras}>
        Y las cualitativas entre sí. Aquí no hay correlación que calcular: lo que se compara
        es si el reparto de una cambia según el nivel de la otra.
      </Diagram>

      <Prose>
        <p>Recuerden esto para dentro de dos minutos: de las tres figuras, el método que viene
          solo sabe leer <b>la primera</b>. Las otras dos no es que salgan mal — es que no
          puede ni intentarlo.</p>
      </Prose>

      <h3>Paso 7 · Y ahora sí, el método de la sesión pasada</h3>
      <Prose>
        <p>Tenemos una tabla utilizable. Le aplicamos <b>exactamente el mismo PCA</b> de la
          sesión 5: estandarizar — obligatorio aquí, porque una columna está en minutos y otra
          en mascotas —, y buscar las direcciones en las que la nube más se estira.</p>
        <p>Entran <b>{PCA.variables.length} variables</b>. Es decir: de las {COLS.length}{' '}
          columnas de la tabla, el análisis mira{' '}
          <b>{Math.round(100 * PCA.variables.length / COLS.length)} %</b>.</p>
      </Prose>

      <Cards cols="c3">
        <Card k="Fuera por no ser números" t={`${CATEGORICAS.length} columnas`}>
          Departamento, área, sector, sangre, música… El PCA trabaja con varianzas, y una
          categoría no tiene varianza: ¿cuánto se desvía «Antioquia» de la media?
        </Card>
        <Card k="Fuera por ser un orden" t={`${ORDINALES.length} columnas`}>
          {ORDINALES.map((c, i) => (
            <span key={c}>{i ? ' y ' : ''}<b>{nombre(c)}</b></span>
          ))}. Sus niveles se ordenan, pero no se suman, y una varianza es una suma.
          Vuelven más adelante, por otra puerta.
        </Card>
        <Card red k="Fuera por los datos" t={`${Object.keys(DESCARTADA).length} columna`}>
          <b>pantalla</b>, la que acabamos de descartar. Esta sí era una cantidad; lo que
          falló fue cómo se recogió.
        </Card>
      </Cards>

      <Diagram fig={sedimento}>
        Cuánto se queda cada componente. Las dos primeras suman {pct(PCA.acumulado[1])} %.
      </Diagram>

      <Diagram fig={plano}>
        Un punto por persona, una flecha por variable. Los ejes se llaman CP 1 y CP 2 y no
        se llaman nada más: ponerles nombre sería interpretar.
      </Diagram>

      <Prose>
        <p>Y el resultado es <b>flojo</b>, hay que decirlo. En la sesión pasada, con cuatro
          indicadores de país, las dos primeras componentes se quedaban con el <b>92 %</b> de
          la información. Aquí se quedan con <b>{pct(PCA.acumulado[1])} %</b>: casi el{' '}
          {Math.round(100 - PCA.acumulado[1])} % de lo que había no cabe en este dibujo.</p>
        <p>No es que el método funcione peor, y tampoco es que le falten variables: acabamos
          de meterle <b>tres más</b> que la primera vez —la edad, el peso y la estatura— y el
          porcentaje <b>bajó</b>. Eso descarta la explicación fácil. Lo que pasa es lo que
          acabamos de ver en la matriz de dispersión: aquellos cuatro indicadores iban juntos
          —donde sube el PIB sube la esperanza de vida— y estas {PCA.variables.length}{' '}
          variables casi nunca.</p>
        <p>Casi. El par más fuerte de toda la tabla es{' '}
          <b>{MATRICES.parMasFuerte[0]} y {MATRICES.parMasFuerte[1]}</b>, con{' '}
          {pct(MATRICES.parMasFuerte[2])} — y se veía en su celda de la matriz, la única con
          una nube inclinada en vez de una mancha. Que sean esas dos no sorprende: las dos
          preguntan por lo mismo, la actividad física, una por días y otra por semanas. Dos
          variables que miden lo mismo no sostienen un plano de doce; lo que enseñan es que el
          método <b>sí sabe</b> encontrar la relación cuando la hay.</p>
        <p>Y hay un detalle incómodo escondido ahí. <b>Peso y estatura</b> deberían ser el otro
          par obvio, y en la tabla cruda lo eran. Después de la cadena se quedan en{' '}
          {pct(MATRICES.fuerza.peso)}, por debajo del corte de la matriz. Los rellenamos
          columna por columna, y eso es exactamente lo que advertimos en el paso 5:{' '}
          <b>la imputación rompe la relación entre columnas</b>. No es una anécdota, se puede
          medir, y acaba de costarnos la pareja que mejor ilustraba el punto.</p>
        <p>Cuando las variables no se dan la mano, no hay dos direcciones que las resuman. Y
          añadir columnas no lo arregla — lo empeora, porque cada una nueva trae su propia
          dirección que nadie más comparte.</p>
        <p>Un detalle que conviene decir en voz alta: <b>minutos</b> ni siquiera entró en la
          matriz de dispersión. Es la variable con la que hemos trabajado desde la sesión 3, y
          el criterio la dejó fuera porque su relación más fuerte con cualquier otra es de{' '}
          {pct(MATRICES.fuerza.minutos)} — la última de {Object.keys(MATRICES.fuerza).length}.
          No la escondimos: <b>es la que menos va con nada</b>, y eso es exactamente lo que
          este paso está diciendo.</p>
      </Prose>
    </Panel>
  );
}
