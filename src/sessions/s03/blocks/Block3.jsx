import {
  Panel, Task, Options, Diagram, DataTable, Prose, Nots, Idea
} from '../../../components/content/index.jsx';
import { COLS, ROWS, RECUENTOS } from '../../../data/salon.js';
import { versiones } from '../figures/block3.js';

export default function Block3({ id, tabId, block }) {
  return (
    <Panel id={id} tabId={tabId} block={block}>
      <p className="lead">Cinco columnas, cinco decisiones. En cada una hacemos lo mismo:{' '}
        <b>nombrar</b> el defecto con el catálogo, <b>votar</b> una opción por chat con su letra,
        y <b>dictar</b> la fila de bitácora que queda escrita.</p>

      <Diagram fig={versiones}>
        Antes de tocar nada. Es lo único de hoy que es un hábito y no una idea, y se instala
        ahora o no se instala nunca.
      </Diagram>

      <h3>Uno · el municipio</h3>
      <DataTable
        cols={COLS}
        rows={ROWS}
        pick={['codigo', 'depto', 'municipio']}
        /* Which rows these are is the dataset's business, not this panel's: the form
           kept taking answers and the set grew from thirteen to sixteen. */
        mark={RECUENTOS.filasBogota.map(n => 'municipio:' + n)}
        caption={<>Las {RECUENTOS.bogota} filas de Bogotá, señaladas. Y al lado, <b>depto</b>,
          donde {RECUENTOS.bogotaEnCundinamarca} de ellas dicen «Cundinamarca».</>}
      />
      <Task label="Votación por chat" big="¿Qué hacemos con municipio?">
        <Options>
          <li>Unificar todo a «Bogotá D.C.» encima de la columna original.</li>
          <li>Dejarla como está: cada quien escribió lo que quiso decir.</li>
          <li>Crear una columna nueva al lado, unificar ahí, y no tocar la original.</li>
        </Options>
      </Task>
      <Prose>
        <p>La C es la que vamos a usar el resto del curso, y no porque sea más cómoda: es la
          única que deja volver atrás. Si dentro de dos sesiones alguien pregunta por qué
          «Cajicá» y «Cajica» quedaron juntas, la respuesta tiene que poder comprobarse.</p>
      </Prose>

      <h3>Dos · los minutos</h3>
      <DataTable
        cols={COLS}
        rows={ROWS}
        pick={['codigo', 'minutos']}
        mark={[...RECUENTOS.minutosEnHoras, ...RECUENTOS.minutosAtipico].map(n => 'minutos:' + n)}
        caption={<>Los {RECUENTOS.minutosEnHoras.length} que casi seguro contestaron en horas, y
          el 960 que son dieciséis.</>}
      />
      <Task label="Votación por chat" big="¿Qué hacemos con minutos?">
        <Options>
          <li>Borrar los {RECUENTOS.minutosEnHoras.length} valores de 16 o menos: no sabemos qué son.</li>
          <li>Multiplicarlos por 60, asumiendo que están en horas.</li>
          <li>Dejar la columna fuera del análisis y decirlo.</li>
        </Options>
      </Task>
      <Prose>
        <p>La B parece la sensata, pero fíjate en lo que asume: que nadie pasó de verdad{' '}
          <b>ocho minutos</b> en algo ajeno al trabajo. Eso es perfectamente posible en un día
          malo, y si multiplicas por 60 lo conviertes en ocho horas. Estás inventando el dato de
          una persona real para que la columna se vea coherente.</p>
        <p>La C se ve como rendirse y es la única que no inventa nada. <b>Descartar una columna
          es un resultado</b>, y hay que escribirlo en la bitácora igual que los otros.</p>
      </Prose>

      <h3>Tres · la pantalla</h3>
      <DataTable
        cols={COLS}
        rows={ROWS}
        pick={['codigo', 'pantalla']}
        mark={[...RECUENTOS.pantallaImposibles, ...RECUENTOS.pantallaFilasVacias].map(n => 'pantalla:' + n)}
        caption={<>Un imposible y {RECUENTOS.pantallaVacias} huecos. Recuerda cómo estaba escrita
          la pregunta:
          «según el reporte de tiempo de pantalla de tu celular».</>}
      />
      <Task label="Votación por chat" big="¿Qué hacemos con pantalla?">
        <Options>
          <li>Borrar el 30 y rellenar las {RECUENTOS.pantallaVacias} vacías con el promedio de las demás.</li>
          <li>Borrar el 30 y dejar las {RECUENTOS.pantallaVacias} vacías como vacías.</li>
          <li>Cambiar el 30 por 30 ÷ 7, asumiendo que respondió el total de la semana.</li>
        </Options>
      </Task>
      <Prose>
        <p>La A es la que hace todo el mundo y la que más daño hace. Rellenar con el promedio
          afirma que <b>quien no fue a mirar su celular se parece a quien sí fue</b>, y no hay
          ninguna razón para creerlo: es más probable que quien no lo revisa sea justamente quien
          menos lo usa, o quien no quiere saber.</p>
        <p>{RECUENTOS.pantallaVacias} de {RECUENTOS.filas} es casi un tercio de la clase. Cuando el faltante es tan grande y tiene una
          causa nombrable, imputar no es limpiar: es <b>fabricar el resultado que esperabas.</b></p>
      </Prose>

      <h3>Cuatro · la alimentación</h3>
      <DataTable
        cols={COLS}
        rows={ROWS}
        pick={['codigo', 'porciones', 'balanceada']}
        mark={['porciones:1', 'balanceada:1', 'porciones:16', 'balanceada:16', 'porciones:7', 'balanceada:7']}
        caption={<>Tres filas para comparar. La 7 comió cero porciones y se pone 2; la 16 comió
          cero y se pone 5; la 1 comió tres y se pone 1.</>}
      />
      <Task label="Votación por chat" big="¿Qué hacemos con balanceada?">
        <Options>
          <li>Promediarla: da un número y todo el mundo lo entiende.</li>
          <li>Descartarla y quedarnos solo con G, que sí se contó.</li>
          <li>Conservarla, pero prohibido leerla sin G al lado.</li>
        </Options>
      </Task>
      <Prose>
        <p>Esta columna no está sucia. Está perfectamente registrada y es <b>incomparable entre
          personas</b>: el 5 de la fila 16 y el 5 de cualquier otro no miden la misma cantidad de
          nada. No hay operación de limpieza que arregle eso, porque no hay nada roto.</p>
        <p>La discusión de si una escala del 1 al 5 se puede promediar vuelve entera en la
          sesión 4. Hoy basta con dejarla marcada.</p>
      </Prose>

      <h3>Cinco · el área de pregrado</h3>
      <DataTable
        cols={COLS}
        rows={ROWS}
        pick={['codigo', 'area']}
        wrap={['area']}
        mark={['area:2', 'area:3', 'area:12']}
        caption={<>La fila 2 tiene dos respuestas y tres comas. La 12 trae una categoría que
          nadie ofreció. La 3 está vacía.</>}
      />
      <Task label="Votación por chat" big="¿Qué hacemos con área?">
        <Options>
          <li>Partir cada celda por las comas y contar las piezas.</li>
          <li>Contar los valores exactos distintos, tal como están.</li>
          <li>Revisarlas a mano, una por una.</li>
        </Options>
      </Task>
      <Prose>
        <p><b>Ninguna de las tres funciona</b>, y esta vez no es que sean discutibles: es que
          están mal.</p>
      </Prose>
      <Nots items={[
        'Partir por comas rompe «Economía, administración y contaduría» en tres áreas que no existen',
        'Contar valores exactos inventa ocho grupos, y dos de ellos son de una sola persona',
        `A mano se puede con ${RECUENTOS.filas} filas — el mismo formulario a escala nacional trae 23.000`
      ]} />
      <Prose>
        <p>El defecto no está en las respuestas. Está en la pregunta: se ofrecieron categorías que
          <b> contienen comas</b> y a la vez se permitió marcar varias <b>separadas por comas</b>.
          Una vez recogidos así, esos datos no se pueden desarmar sin adivinar.</p>
        <p>Esto no se limpia. Se vuelve a preguntar, con una casilla por categoría. Y por eso lo
          dejé fuera del catálogo: <b>hay defectos que no son de limpieza sino de diseño</b>, y la
          limpieza no puede salvarlos. Es la sesión 2 cobrándose a sí misma.</p>
      </Prose>

      <Idea>La tabla limpia no es más verdadera que la cruda.{' '}
        <span className="who">Es más explícita.</span></Idea>
    </Panel>
  );
}
