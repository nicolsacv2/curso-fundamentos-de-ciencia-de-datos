import { Panel, Task, Options, Diagram, Prose, Idea } from '../../../components/content/index.jsx';
import { dataset } from '../figures/block3.js';

export default function Block3({ id, tabId }) {
  return (
    <Panel id={id} tabId={tabId}>
      <p className="eyebrow">Bloque 3 · 116–166</p>
      <h2>Construimos el dataset del salón</h2>
      <p className="lead">Todo lo que llevamos dicho —tipos, tabla, fuentes, muestra, metadatos,
        preguntas bien formuladas— lo vamos a hacer ahora, sobre nosotros mismos.</p>

      <Diagram fig={dataset}>
        Esta tabla no se archiva al final de la sesión: es el material de trabajo de
        las seis sesiones que faltan.
      </Diagram>

      <Task label="Todo el grupo · 50 minutos" big="Una fila por cada uno de nosotros.">
        <Options steps>
          <li><b>Diseño colectivo · 15 min.</b> Formulario vacío en pantalla compartida. Ustedes
            dictan las preguntas por chat y por voz; yo las escribo y las discutimos al vuelo.
            Cada propuesta pasa por el filtro de hace un rato: <em>¿está bien formulada?</em> y{' '}
            <em>¿qué tipo de dato produce?</em> Varias se van a corregir en vivo, y eso es parte
            del ejercicio.</li>
          <li><b>Todos responden · 7 min.</b> Formulario abierto, música de fondo, micrófonos
            cerrados. Responde con la verdad y sin pensarlo mucho: el dato que sirve es el real,
            no el que queda bonito.</li>
          <li><b>Se proyecta la hoja en vivo · 20 min.</b> Vemos aparecer las filas en tiempo real
            y le ponemos nombre a lo que ya sabemos: <b>esta fila eres tú, esta columna es una
            variable, esta celda es tu valor</b>. Es la figura del bloque 1, ahora con nuestros
            datos dentro.</li>
          <li><b>Discusión guiada · 8 min.</b> Qué quedó cuantitativo, qué es subjetivo, quién
            exageró, y quiénes hoy no se conectaron.</li>
        </Options>
      </Task>

      <Prose>
        <p><b>Nadie va a poner su nombre.</b> Cada fila lleva un número, no una persona: el
          identificador no es una variable y no entra al análisis —igual que la placa del auto en
          el tablero de hace un rato—. Y si una pregunta te incomoda, déjala en blanco: los vacíos
          también son un dato, y son literalmente el tema de la sesión 3.</p>
      </Prose>

      <h3>Lo que vamos a preguntarnos</h3>
      <ul className="list">
        <li><b>Horas de sueño de anoche</b> — continua. Todo el mundo redondea; eso también es un dato.</li>
        <li><b>Minutos de traslado hasta clase</b> — continua, y con metadatos: ¿puerta a puerta o solo el bus?</li>
        <li><b>Tazas de café de ayer</b> — discreta. ¿El tinto de media mañana cuenta?</li>
        <li><b>Aplicaciones instaladas en el celular</b> — discreta, y casi nadie sabe la cifra exacta.</li>
        <li><b>Hora a la que se durmió</b> — continua y circular: las 23:30 y las 00:30 están a una hora, no a veinticuatro.</li>
        <li><b>Ciudad de origen</b> — nominal.</li>
        <li><b>Nivel de estrés del 1 al 5</b> — ordinal, subjetiva, y la que más vamos a pelear.</li>
      </ul>

      <Task label="Discusión · los últimos 8 minutos" big="¿A quién le acabamos de preguntar?">
        <p>Nuestra población son los inscritos al curso. Nuestra muestra son los que se conectaron
          hoy y respondieron. <b>No son lo mismo</b>, y acabamos de hacer, a escala pequeña, lo
          mismo que hizo <i>The Literary Digest</i>.</p>
      </Task>

      <Idea>A partir de hoy, cuando este curso diga «los datos»,{' '}
        <span className="who">está hablando de nosotros.</span></Idea>
    </Panel>
  );
}
