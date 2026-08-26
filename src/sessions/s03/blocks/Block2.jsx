import {
  Panel, Task, Options, Cards, Card, Diagram, DataTable,
  Story, StoryHead, Prose, Source, Idea
} from '../../../components/content/index.jsx';
import { COLS, ROWS, MEDIAS } from '../data/salon.js';
import { bitacora } from '../figures/block2.js';

export default function Block2({ id, tabId }) {
  return (
    <Panel id={id} tabId={tabId}>
      <p className="eyebrow">Bloque 2 · 70–108</p>
      <h2>Limpiar es decidir</h2>
      <p className="lead">Encontrar la suciedad fue la parte fácil. Ahora hay que hacer algo con
        ella, y no existe la opción de no decidir: dejar la tabla como está también es una
        decisión, solo que sin firmar.</p>

      <Diagram fig={bitacora}>
        Una fila por decisión. Es la herramienta del día y la vamos a llenar en vivo en el
        bloque 3.
      </Diagram>

      <h3>¿Cuánto es el promedio?</h3>
      <p className="lead">La columna F preguntaba cuántos <b>minutos</b> pasaste ayer en cosas
        ajenas al trabajo o al estudio. Aquí está entera.</p>

      <DataTable
        cols={COLS}
        rows={ROWS}
        pick={['A', 'F']}
        caption={<>Veinte respuestas y tres celdas vacías.</>}
      />

      <Task label="Chat · un número · 78–96" big="Calcula el promedio de la columna F.">
        <p>Sin ponerte de acuerdo con nadie y sin explicar cómo lo hiciste. Un número al chat.</p>
      </Task>

      <h4>Lo que va a pasar</h4>
      <Cards cols="c4">
        <Card k="Si ignoras las vacías" t={`${MEDIAS.ignorarVacias} min`}>
          Sumas las veinte que hay y divides por veinte. Es lo que hace una hoja de cálculo si
          no le dices nada.
        </Card>
        <Card k="Si las cuentas como cero" t={`${MEDIAS.vaciasComoCero} min`}>
          Divides por 23 en vez de por 20. Estás afirmando que quien no respondió pasó cero
          minutos, y eso nadie lo dijo.
        </Card>
        <Card k="Si botas el 960" t={`${MEDIAS.sinAtipico} min`}>
          Dieciséis horas parecen demasiadas, así que fuera. Acabas de borrar a una persona
          porque su respuesta te incomodó.
        </Card>
        <Card red k="Si arreglas las unidades" t={`${MEDIAS.horasAMinutos} min`}>
          Asumes que quien puso 1, 2, 4, 5, 8 o 16 contestó en horas, y los multiplicas por 60.
          Es la más razonable de las cuatro y la que más cambia el resultado.
        </Card>
      </Cards>

      <Prose>
        <p>Cuatro respuestas a la misma pregunta sobre la misma columna, y la más alta es{' '}
          <b>más del doble</b> de la más baja. Nadie repartió estas decisiones: cada quien tomó
          una sin darse cuenta de que estaba decidiendo algo.</p>
        <p>Ninguna de las cuatro es la correcta. Lo que sí es incorrecto es <b>publicar el
          número sin decir cuál tomaste.</b></p>
      </Prose>

      <h3>La fila 16</h3>

      <DataTable
        cols={COLS}
        rows={ROWS}
        only={[16]}
        wrap={['D', 'J']}
        mark={['F16', 'G16', 'H16']}
        caption={<>Novecientos sesenta minutos son dieciséis horas. Cero porciones de fruta o
          verdura, y un 5 sobre 5 en «qué tan balanceada fue tu alimentación». En la tabla
          completa —la de 34 columnas— esta misma persona dejó otras cuatro preguntas sin
          responder.</>}
      />

      <Task label="Votación por chat · 96–104" big="¿Se borra la fila 16?">
        <Options>
          <li>Se borra. Contesta cualquier cosa y ensucia todas las columnas a la vez.</li>
          <li>Se queda. Ninguna de sus respuestas es imposible, solo extremas.</li>
          <li>Se queda marcada, y se decide columna por columna.</li>
        </Options>
      </Task>

      <Prose>
        <p>Antes de votar, mira lo que se va con ella: es la <b>única persona de Boyacá</b> y la{' '}
          <b>única que estudió Derecho</b> en todo el salón. Borrar una fila nunca borra solo
          una fila; borra todas las categorías que solo ella traía.</p>
        <p>Y fíjate en el orden de las cosas: la fila se hizo sospechosa porque sus respuestas
          nos parecieron raras. Ese es exactamente el criterio con el que se cuela un sesgo.</p>
      </Prose>

      <Story>
        <StoryHead num="Colombia · 2021" place="Auto 033 · Sala de Reconocimiento de la JEP">
          <h3>Los 6.402</h3>
        </StoryHead>

        <Prose>
          <p><b>Hoy no discutimos el caso. Discutimos cómo se llegó al número.</b></p>
          <p>La JEP necesitaba saber cuántas personas fueron asesinadas y presentadas como bajas
            en combate entre 2002 y 2008. No existía una lista: existían tres, hechas por
            entidades distintas que nunca habían trabajado juntas — la <b>Fiscalía General de la
            Nación</b>, el <b>Centro Nacional de Memoria Histórica</b> y la <b>Coordinación
            Colombia-Europa-Estados Unidos</b>.</p>
          <p>Lo que hizo la JEP con esas tres listas tiene un nombre que ya conocemos: análisis,{' '}
            <b>depuración y unificación</b>. Decidir si «el mismo nombre con un apellido de más»,
            «la misma fecha corrida un día» y «el municipio escrito como vereda» son una persona
            o son dos. Es la misma operación que acabamos de hacer con García Márquez en la
            columna J, sobre 23 filas.</p>
          <p>El resultado fue <b>6.402 víctimas</b>. De ellas, <b>4.154 no estaban documentadas
            ni por la Fiscalía ni por el Centro de Memoria</b>: aparecían solo al cruzar las tres
            fuentes. Quien hubiera mirado una sola lista habría concluido una cifra mucho más
            baja, y no habría estado mintiendo.</p>
          <p>La propia JEP dice que la cifra es <b>provisional</b>, y puede subir o bajar.</p>
        </Prose>

        <Prose>
          <h4>Por qué esto va hoy y no otro día</h4>
          <p>En todo lo que llevamos, limpiar quita: quitas duplicados, quitas filas incompletas,
            quitas atípicos. Aquí <b>limpiar hizo crecer la cifra</b>, porque ninguna de las tres
            fuentes tenía a todo el mundo y ninguna sabía a quién le faltaba.</p>
          <p>Es la pregunta de Wald por tercera vez. Los aviones que no volvieron en la sesión 1.
            Los que no tenían teléfono en 1936, en la sesión 2. Hoy, los que estaban en una lista
            y no en las otras dos.</p>
          <Source>JEP, Auto 033 de 2021, Caso 03.</Source>
        </Prose>
      </Story>

      <Idea>Una decisión de limpieza que nadie escribió{' '}
        <span className="who">es una conclusión que nadie puede revisar.</span></Idea>
    </Panel>
  );
}
