import { Panel, Task, Pair, Prose, Idea } from '../../../components/content/index.jsx';

export default function Closing({ id, tabId }) {
  return (
    <Panel id={id} tabId={tabId}>
      <p className="eyebrow">Cierre · 166–180</p>
      <h2>Tu pregunta, y de dónde saldrán sus datos</h2>

      <Task
        label="Ticket de salida · encuesta · 2 minutos"
        big={<>Nombra una variable de <em>nuestro</em> dataset y di qué la puede ensuciar.</>}
      >
        <p>Una línea, con esta forma: <b>«[variable] — [qué la ensucia]»</b>. Vale cualquiera de
          las que acabamos de recoger. Es la puerta de entrada a la sesión 3, que va entera sobre
          eso.</p>
      </Task>

      <Pair>
        <Prose>
          <h4>Respuestas que sirven</h4>
          <ul className="list" style={{ marginTop: '16px' }}>
            <li><b>Minutos de traslado</b> — unos contaron puerta a puerta y otros solo el bus.</li>
            <li><b>Tazas de café</b> — nadie definió si el tinto pequeño cuenta igual que el grande.</li>
            <li><b>Estrés del 1 al 5</b> — mi 4 y tu 4 no son la misma cantidad de nada.</li>
            <li><b>Hora de dormir</b> — quien puso «00:30» y quien puso «12:30» escribieron lo mismo.</li>
          </ul>
        </Prose>
        <Prose>
          <h4>Respuestas que no</h4>
          <ul className="list" style={{ marginTop: '16px' }}>
            <li>«Los datos están malos» — no nombra ninguna variable.</li>
            <li>«La gente miente» — puede ser, pero no dice <em>en cuál</em> ni <em>por qué ahí</em>.</li>
            <li>«Faltan más respuestas» — eso es tamaño de muestra, que es otro problema y ya lo vimos.</li>
          </ul>
        </Prose>
      </Pair>

      <h3>El proyecto individual</h3>
      <p className="lead">De aquí en adelante cada quien lleva su propia pregunta en paralelo al curso.
        Vive en tu zona del tablero durante las seis sesiones que faltan.</p>

      <ul className="list">
        <li>Rotación de personal en una empresa</li>
        <li>Deserción escolar en un colegio</li>
        <li>Ventas de una cafetería de barrio</li>
        <li>Tráfico urbano en un corredor de la ciudad</li>
        <li>Qué hace que una canción funcione</li>
        <li>Consumo de energía en un hogar</li>
        <li>Tiempos de espera en una cita médica</li>
        <li>Reciclaje en el campus</li>
        <li>Precios de arriendo por barrio</li>
        <li>Asistencia a clase a lo largo del semestre</li>
      </ul>

      <Prose>
        <p>El tema es lo de menos: lo que se escribe en el tablero es una <b>pregunta</b>, no un
          área. «Rotación de personal» no sirve; <em>«¿por qué se va la gente antes del primer
          año?»</em> sí. La diferencia es que la segunda se puede responder con datos y la primera
          no se puede ni empezar.</p>
      </Prose>

      <Task label="Rueda relámpago · 20 segundos cada uno" big="Voy a nombrar a seis personas.">
        <p>Escribe tu pregunta en tu zona del tablero. En tus veinte segundos dices <b>dos
          cosas</b>: la pregunta tal como quedó escrita, y qué decisión cambiaría si la
          respondieras. Aviso desde ya que voy a nombrar gente: nadie se relaja.</p>
      </Task>

      <Task label="Reto para la próxima sesión · 20 minutos" big="Cinco variables, y de dónde saldría cada una.">
        <p>Para tu pregunta, una lista de <b>cinco variables</b> que necesitarías. De cada una
          escribe tres cosas: <b>qué mide</b>, <b>de qué tipo es</b> —de los cuatro de hoy— y{' '}
          <b>de qué fuente saldría</b>, de las seis del bloque 2.</p>
      </Task>

      <h4>Así se ve una fila del reto</h4>
      <Prose>
        <p>Para la pregunta <em>«¿por qué se va la gente antes del primer año?»</em>:</p>
      </Prose>
      <ul className="list">
        <li><b>Meses en el cargo</b> — cuantitativa discreta — operación interna (nómina).</li>
        <li><b>Área a la que pertenece</b> — cualitativa nominal — operación interna.</li>
        <li><b>Satisfacción con el jefe directo</b> — cualitativa ordinal — encuesta, y hay que
          diseñarla bien porque nadie responde eso con sinceridad si no es anónima.</li>
        <li><b>Salario frente al promedio del mercado</b> — cuantitativa continua — mitad interna,
          mitad compra a terceros.</li>
        <li><b>Minutos de trayecto hasta la oficina</b> — cuantitativa continua — <b>no hay fuente
          posible</b> hoy: nadie la registra. Habría que empezar a preguntarla.</li>
      </ul>

      <Prose>
        <p>Esa última línea es la más valiosa de las cinco. <b>Descubrir que un dato que necesitas
          no existe es un resultado</b>, no un fracaso: es la diferencia entre responder la
          pregunta que importa y responder la que los datos disponibles permitían.</p>
      </Prose>

      <Idea>Los datos no estaban ahí esperando.{' '}
        <span className="who">Alguien los fabricó, y hoy ese alguien fuiste tú.</span></Idea>
    </Panel>
  );
}
