import {
  Panel, Task, Options, Diagram, Plate, Source, CommonsLink, Pair, Prose,
  Cards, Card, Idea, Story, StoryHead
} from '../../../components/content/index.jsx';
import { population, digest, metadata } from '../figures/block2.js';

export default function Block2({ id, tabId }) {
  return (
    <Panel id={id} tabId={tabId}>
      <p className="eyebrow">Bloque 2 · 70–108</p>
      <h2>Los datos no se encuentran: se fabrican</h2>
      <p className="lead">Nadie tropieza con una tabla en el bosque. Detrás de cada una hay alguien
        que decidió qué medir, a quién preguntarle y qué dejar por fuera.</p>

      <h3>De dónde vienen</h3>
      <Cards cols="c3">
        <Card k="Operación interna" t="Se registran solos">
          Ventas, matrículas, tiquetes. Baratos y abundantes, pero solo ven a quien ya está adentro.
        </Card>
        <Card k="Encuestas" t="Se fabrican preguntando">
          Lo único que sirve para medir opiniones. Responde quien quiere responder.
        </Card>
        <Card k="Sensores" t="Miden sin preguntar">
          Continuos y masivos. Miden lo que el sensor alcanza, y cuando fallan lo hacen en silencio.
        </Card>
        <Card k="Web" t="Se raspan de sitios públicos">
          Enormes y gratuitos. Solo existe ahí lo que alguien decidió publicar.
        </Card>
        <Card k="Datos abiertos" t="Los publica el Estado">
          DANE, portales de la ciudad. Llegan tarde y con las categorías que el Estado eligió.
        </Card>
        <Card k="Compra a terceros" t="Los vende un proveedor">
          Inmediatos y caros. Rara vez te cuentan cómo se recogieron, y ese es el problema.
        </Card>
      </Cards>

      <h3>Población y muestra</h3>
      <Prose>
        <p>Casi nunca se le puede preguntar a todos. La <b>población</b> es el conjunto entero
          sobre el que quieres concluir; la <b>muestra</b>, el pedazo al que de verdad le
          preguntaste.</p>
        <p>La pregunta no es si tu muestra es grande. Es si se parece a la población.</p>
      </Prose>

      <Diagram fig={population}>
        Con la misma cantidad de gente encuestada se puede acertar o fallar por veinte
        puntos. Lo que cambia no es el tamaño: es de dónde salieron.
      </Diagram>

      {/* ── La historia ── */}
      <Story>
        <StoryHead
          num="La encuesta más grande jamás hecha"
          place={<>Estados Unidos · 1936 · <i>The Literary Digest</i></>}
        >
          <h3>Dos millones de respuestas, y se equivocó</h3>
        </StoryHead>

        <Prose>
          <p><i>The Literary Digest</i> llevaba veinte años acertando quién ganaba la presidencia.
            En 1936 hizo su encuesta más ambiciosa: <b>diez millones de cuestionarios enviados</b>,
            dos millones trescientas mil respuestas. Ninguna encuesta de hoy se acerca a ese
            tamaño.</p>
          <p>Anunció que Alf Landon ganaría con el 57 % de los votos.</p>
        </Prose>

        <Pair>
          <Plate
            variant="portrait"
            asset="alf-landon"
            alt="Alf Landon, candidato republicano de 1936, ante un grupo de fotógrafos a la entrada de la Casa Blanca."
          >
            <b>Alf Landon</b>, gobernador de Kansas y candidato republicano. El hombre
            que, según dos millones de respuestas, iba a ser presidente.
            <Source>Harris &amp; Ewing, 1936 · Library of Congress · Dominio público · <CommonsLink asset="alf-landon">Wikimedia Commons</CommonsLink></Source>
          </Plate>
          <Plate
            variant="portrait"
            asset="fdr"
            alt="Retrato fotográfico de Franklin Delano Roosevelt."
          >
            <b>Franklin D. Roosevelt.</b> Ganó 46 de los 48 estados. Es la mayor
            derrota electoral del siglo en Estados Unidos.
            <Source>Retrato de Elias Goldensky, 1933 · Dominio público · <CommonsLink asset="fdr">Wikimedia Commons</CommonsLink></Source>
          </Plate>
        </Pair>

        <Task
          label="Cascada de chat · antes de la respuesta"
          big="Dos millones de respuestas y falló por veinte puntos. ¿Qué pasó?"
        >
          <p>Escribe <b>una sola frase</b> con tu explicación y <b>no la envíes todavía</b>. A la
            cuenta de tres, todos a la vez. Se vale equivocarse: la explicación correcta casi
            nunca es la primera que a uno se le ocurre, y esa es la gracia del ejercicio.</p>
        </Task>

        <Prose>
          <p>Las tres respuestas que siempre aparecen son «la gente mintió», «cambiaron de opinión
            al final» y «los encuestadores hicieron trampa». Ninguna es lo que pasó, y las tres
            tienen algo en común: <b>buscan la falla dentro de la muestra</b>. La falla estaba en
            cómo se armó.</p>
        </Prose>

        <Diagram fig={digest}>
          La predicción y el resultado, uno encima del otro.
        </Diagram>

        <Pair>
          <Prose>
            <p>El <i>Digest</i> armó su lista de destinatarios con tres fuentes: <b>los directorios
              telefónicos, los registros de matrícula de automóviles y sus propios suscriptores</b>.</p>
            <p>En 1936, en plena Gran Depresión, tener teléfono, tener carro o pagar la suscripción
              a una revista no era lo normal: era una señal de clase. La encuesta le preguntó, con
              una precisión enorme, <em>a la parte del país que podía pagar esas tres cosas</em>.</p>
            <p>Ese año, además, la fractura entre ricos y pobres coincidía casi exactamente con la
              fractura entre republicanos y demócratas. El error no se diluyó con el tamaño:{' '}
              <b>se multiplicó por dos millones</b>.</p>
          </Prose>
          <Plate
            asset="migrant-mother"
            alt="Fotografía de Dorothea Lange de una madre trabajadora migrante con sus hijos en un campamento de California, 1936."
          >
            <b>Estos son los que no estaban en la lista.</b> Marzo de 1936, el mismo
            año de la encuesta. Sin teléfono, sin automóvil y sin suscripción: invisibles para el{' '}
            <i>Digest</i>, y mayoría en las urnas.
            <Source>Dorothea Lange, «Migrant Mother», Nipomo, California · Farm Security Administration · Dominio público · <CommonsLink asset="migrant-mother">Wikimedia Commons</CommonsLink></Source>
          </Plate>
        </Pair>

        <Prose>
          <p>Ese mismo año, un publicista llamado George Gallup predijo el resultado correcto con{' '}
            <b>cincuenta mil encuestas</b>: cuarenta y seis veces menos gente, repartida a
            propósito para parecerse al país. La revista cerró dos años después.</p>
        </Prose>

        <Idea>Una muestra grande y torcida no se endereza haciéndola más grande.{' '}
          <span className="who">Solo se vuelve más segura de estar equivocada.</span></Idea>
      </Story>

      <h4>Los tres casos, y por dónde empezar a mirar</h4>
      <Cards cols="c3">
        <Card k="Caso 1 · Encuesta telefónica" t="«Llamamos a 2.000 hogares entre las 9 y las 5»">
          ¿Quién contesta el teléfono un miércoles a las once de la mañana?
        </Card>
        <Card k="Caso 2 · Reseñas de una app" t="«Calificación promedio: 4,6 sobre 5»">
          Casi nadie califica una app que le pareció normal. Solo escriben los encantados y los furiosos.
        </Card>
        <Card k="Caso 3 · Satisfacción del egresado" t="«Encuestamos a los graduados del programa»">
          Los que se retiraron a mitad de carrera no aparecen. Son justo los que peor lo pasaron.
        </Card>
      </Cards>

      <Prose>
        <p>La respuesta útil nunca es «la muestra es pequeña». Es <b>nombrar a quién le pasó algo
          que le impidió entrar</b>: no tiene teléfono, no le pareció suficiente para escribir,
          ya no está en la lista. Ese «algo» es siempre lo mismo que estás tratando de medir, y
          por eso el sesgo duele.</p>
      </Prose>

      <h3>Metadatos: el contexto que hace usable a un número</h3>
      <Diagram fig={metadata}>
        Los metadatos no son burocracia ni relleno del final. Son lo que separa un dato
        de un número suelto, y lo primero que se pierde cuando alguien copia una cifra a una
        diapositiva.
      </Diagram>

      <h3>La pregunta tramposa</h3>
      <p className="lead">Si los datos se fabrican preguntando, entonces la pregunta es el instrumento
        de medición. Un instrumento torcido da cifras torcidas para siempre.</p>

      <Cards cols="c4">
        <Card red k="Ambigua" t="«¿Usa redes sociales con frecuencia?»">
          ¿Qué es frecuencia? Cada persona responde a una pregunta distinta.
        </Card>
        <Card red k="Tendenciosa" t="«¿Apoya el necesario aumento de la matrícula?»">
          La respuesta viene dentro de la pregunta. Una sola palabra basta.
        </Card>
        <Card red k="Doble" t="«¿Le parece rápida y económica la ruta?»">
          Son dos preguntas. Quien responde «no» no dice a cuál de las dos.
        </Card>
        <Card red k="Opciones incompletas" t="«¿Cuántas horas duerme? a) 6–8 b) 8–10»">
          Quien duerme cinco no cabe, y quien duerme ocho cabe dos veces.
        </Card>
      </Cards>

      <Task
        label="Trabajo individual · 8 minutos · 96–108"
        big="Te toca una pregunta mal formulada. Diagnostícala y reescríbela."
      >
        <p>En tu zona del tablero tienes <b>una</b>. Escribe debajo{' '}
          <b>tres líneas</b>, en este orden:</p>
        <Options steps>
          <li><b>Qué defecto tiene.</b> Usa el nombre de las cuatro tarjetas de arriba. Si tiene
            dos defectos a la vez, dilo: pasa más de lo que parece.</li>
          <li><b>A quién perjudica.</b> Qué persona no va a poder responderla con la verdad, o va a
            quedar mal representada por su propia respuesta.</li>
          <li><b>Cómo quedaría bien preguntada.</b> Escríbela completa, con sus opciones de
            respuesta si las lleva.</li>
        </Options>
      </Task>

      <h4>Un caso resuelto</h4>
      <Pair>
        <Prose>
          <h4>Como venía</h4>
          <p style={{ marginTop: '16px' }}>«<b>¿Con qué frecuencia hace usted deporte?</b>
            &nbsp;a) Siempre &nbsp; b) A veces &nbsp; c) Nunca»</p>
          <ul className="list" style={{ marginTop: '16px' }}>
            <li><b>Ambigua</b>, y en dos sitios a la vez: ni «frecuencia» ni «siempre» significan
              lo mismo para dos personas.</li>
            <li>Perjudica a quien hace ejercicio en rachas: dos meses sí, dos no. No tiene casilla.</li>
          </ul>
        </Prose>
        <Prose>
          <h4>Como debería ir</h4>
          <p style={{ marginTop: '16px' }}>«<b>En los últimos siete días, ¿cuántos días hizo al menos 30
            minutos seguidos de actividad física?</b> &nbsp;0 · 1 · 2 · 3 · 4 · 5 · 6 · 7»</p>
          <ul className="list" style={{ marginTop: '16px' }}>
            <li>Ventana de tiempo fija, unidad explícita y umbral definido.</li>
            <li>Las opciones cubren todos los casos y no se solapan.</li>
            <li>Sale cuantitativa discreta, así que después se puede promediar sin mentir.</li>
          </ul>
        </Prose>
      </Pair>

      <Prose>
        <p>Fíjate en lo que pasó de paso: al arreglar la pregunta, <b>cambió el tipo de dato</b>.
          La versión mala producía una variable ordinal de tres categorías borrosas; la buena
          produce un número entre 0 y 7. La calidad de la pregunta decide qué se va a poder hacer
          con la respuesta seis sesiones más adelante.</p>
      </Prose>

      <h4>Pausa 2 · 108–116</h4>
    </Panel>
  );
}
