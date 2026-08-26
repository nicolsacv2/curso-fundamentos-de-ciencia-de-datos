import {
  Panel, Task, Options, Diagram, DataTable, Prose, Nots, Idea
} from '../../../components/content/index.jsx';
import { COLS, ROWS } from '../data/salon.js';
import { versiones } from '../figures/block3.js';

export default function Block3({ id, tabId }) {
  return (
    <Panel id={id} tabId={tabId}>
      <p className="eyebrow">Bloque 3 · 116–166</p>
      <h2>Limpiamos nuestra tabla</h2>
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
        pick={['A', 'B', 'C']}
        mark={['C3', 'C4', 'C5', 'C7', 'C9', 'C10', 'C11', 'C12', 'C13', 'C18', 'C19', 'C21', 'C22']}
        caption={<>Las trece filas de Bogotá, señaladas. Y al lado, la columna B, donde siete de
          ellas dicen «Cundinamarca».</>}
      />
      <Task label="Votación por chat" big="¿Qué hacemos con la columna C?">
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
        pick={['A', 'F']}
        mark={['F2', 'F3', 'F5', 'F8', 'F13', 'F14', 'F20', 'F16']}
        caption={<>Los siete que casi seguro contestaron en horas, y el 960 que son dieciséis.</>}
      />
      <Task label="Votación por chat" big="¿Qué hacemos con la columna F?">
        <Options>
          <li>Borrar los siete valores de 16 o menos: no sabemos qué son.</li>
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
        pick={['A', 'E']}
        mark={['E1', 'E3', 'E5', 'E8', 'E9', 'E12', 'E19', 'E22']}
        caption={<>Un imposible y siete huecos. Recuerda cómo estaba escrita la pregunta:
          «según el reporte de tiempo de pantalla de tu celular».</>}
      />
      <Task label="Votación por chat" big="¿Qué hacemos con la columna E?">
        <Options>
          <li>Borrar el 30 y rellenar las siete vacías con el promedio de las demás.</li>
          <li>Borrar el 30 y dejar las siete vacías como vacías.</li>
          <li>Cambiar el 30 por 30 ÷ 7, asumiendo que respondió el total de la semana.</li>
        </Options>
      </Task>
      <Prose>
        <p>La A es la que hace todo el mundo y la que más daño hace. Rellenar con el promedio
          afirma que <b>quien no fue a mirar su celular se parece a quien sí fue</b>, y no hay
          ninguna razón para creerlo: es más probable que quien no lo revisa sea justamente quien
          menos lo usa, o quien no quiere saber.</p>
        <p>Siete de 23 es casi un tercio de la clase. Cuando el faltante es tan grande y tiene una
          causa nombrable, imputar no es limpiar: es <b>fabricar el resultado que esperabas.</b></p>
      </Prose>

      <h3>Cuatro · la alimentación</h3>
      <DataTable
        cols={COLS}
        rows={ROWS}
        pick={['A', 'G', 'H']}
        mark={['G1', 'H1', 'G16', 'H16', 'G7', 'H7']}
        caption={<>Tres filas para comparar. La 7 comió cero porciones y se pone 2; la 16 comió
          cero y se pone 5; la 1 comió tres y se pone 1.</>}
      />
      <Task label="Votación por chat" big="¿Qué hacemos con la columna H?">
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
        pick={['A', 'D']}
        wrap={['D']}
        mark={['D2', 'D3', 'D12']}
        caption={<>La fila 2 tiene dos respuestas y tres comas. La 12 trae una categoría que
          nadie ofreció. La 3 está vacía.</>}
      />
      <Task label="Votación por chat" big="¿Qué hacemos con la columna D?">
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
        'A mano se puede con 23 filas — el mismo formulario a escala nacional trae 23.000'
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
