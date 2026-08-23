import {
  Panel, Task, Options, Diagram, Prose, Cards, Card
} from '../../../components/content/index.jsx';
import { types, fakeNumbers, structure, table, quadrants } from '../figures/block1.js';

export default function Block1({ id, tabId }) {
  return (
    <Panel id={id} tabId={tabId}>
      <p className="eyebrow">Bloque 1 · 22–62</p>
      <h2>Tipos de datos y anatomía de una tabla</h2>
      <p className="lead">Antes de analizar nada hay que saber con qué se está tratando. No todos los
        datos admiten las mismas operaciones, y la mitad de los errores del curso nacen aquí.</p>

      <Diagram fig={types}>
        La primera pregunta ante cualquier variable no es «¿qué dice?», sino{' '}
        <b>«¿de qué tipo es?»</b>. De la respuesta depende qué se le puede hacer sin decir
        tonterías.
      </Diagram>

      <h3>Números que no son números</h3>
      <Diagram fig={fakeNumbers}>
        El computador nunca se va a negar a promediar códigos postales. La única
        defensa contra este error eres tú.
      </Diagram>

      <h3>Con qué forma llegan</h3>
      <Diagram fig={structure}>
        Casi todo lo que se produce hoy en el mundo es no estructurado: fotos, audios,
        mensajes. Convertirlo en filas y columnas <b>no es un paso técnico neutro</b>: es una
        decisión, y siempre se pierde algo en el camino.
      </Diagram>

      <h3>La anatomía de una tabla</h3>
      <Diagram fig={table}>
        Tres palabras que vamos a repetir durante seis sesiones: <b>fila</b> es una
        observación, <b>columna</b> es una variable, <b>celda</b> es un valor. Cuando algo no
        encaje en esta forma, es señal de que la tabla está mal armada.
      </Diagram>

      <h3>Clasificados</h3>
      <Diagram fig={quadrants}>
        El tablero que cada quien tiene en su zona, con las tarjetas ya colocadas a
        modo de ejemplo.
      </Diagram>

      <Prose>
        <p>Son veintiséis minutos en dos tiempos: <b>diez</b> clasificando cada quien en su zona
          del tablero, y <b>dieciséis</b> discutiendo en plenaria. No vamos a revisar las
          veinticuatro tarjetas: solo las que nos dividan.</p>
      </Prose>

      <Task label="Trabajo individual · 10 minutos · 36–62" big="Veinticuatro tarjetas, cuatro cuadrantes.">
        <p>Cada tarjeta trae el nombre de una variable —edad, ciudad, temperatura, satisfacción,
          placa del auto, emoji más usado, número de hermanos…—. Arrástrala al cuadrante que le
          corresponde. Si dudas con alguna, <b>déjala en el borde</b>: esas son justamente las que
          vamos a discutir.</p>
      </Task>

      <h4>Dos preguntas, siempre en este orden</h4>
      <Task label="Cómo decidir sin adivinar" big="No mires si tiene dígitos. Mira qué puedes hacer con ella.">
        <Options steps>
          <li><b>¿Sumar dos valores significa algo?</b> Si sí, es <b>cuantitativa</b> y va arriba.
            Si no —sumar dos códigos postales, dos números de camiseta—, es <b>cualitativa</b> y va
            abajo, por mucho que esté escrita con números.</li>
          <li>Ya arriba: <b>¿existe algo entre dos valores seguidos?</b> Entre 2 y 3 hermanos no hay
            nada: <b>discreta</b>. Entre 2 y 3 horas de sueño hay infinitos: <b>continua</b>.<br />
            Ya abajo: <b>¿las categorías tienen un orden natural?</b> Bogotá y Cali no lo tienen:{' '}
            <b>nominal</b>. Primaria y bachillerato sí: <b>ordinal</b>.</li>
        </Options>
      </Task>

      <Prose>
        <p>Cuando termines, cuenta cuántas dejaste en el borde. <b>Tener dudas es el resultado
          esperado</b>, no una señal de que lo hiciste mal: seis de las veinticuatro están puestas
          ahí precisamente para no tener respuesta limpia.</p>
      </Prose>

      <h4>Las seis que siempre parten al grupo en dos</h4>
      <Cards cols="c3">
        <Card red k="Edad" t="¿Discreta o continua?">
          Se mide continua y se reporta redondeada a años. Depende de para qué la quieras.
        </Card>
        <Card red k="Estrés del 1 al 5" t="¿Se puede promediar?">
          Todo el mundo lo hace. Nadie ha demostrado que de 3 a 4 haya lo mismo que de 4 a 5.
        </Card>
        <Card red k="Código postal" t="Números que son etiquetas">
          Nominal disfrazado de cuantitativo. Su promedio no señala ningún lugar.
        </Card>
        <Card red k="Emoji más usado" t="¿Es siquiera un dato?">
          Nominal, y perfectamente analizable. Que sea informal no lo hace menos dato.
        </Card>
        <Card red k="Placa del auto" t="Identificador, no variable">
          No describe nada de la observación: la nombra. Casi nunca entra al análisis.
        </Card>
        <Card red k="Nivel educativo" t="Ordinal con trampa">
          Hay orden, pero los saltos son desiguales. Restarlos no significa nada.
        </Card>
      </Cards>

      <h4>Pausa 1 · 62–70</h4>
    </Panel>
  );
}
