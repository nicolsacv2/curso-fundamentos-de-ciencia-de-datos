import {
  Panel, Task, Options, Diagram, Plate, Source, Pair, Prose, Idea, Story, StoryHead
} from '../../../components/content/index.jsx';
import { snowMap, fluTrends } from '../figures/block3.js';

import kitHarington from '../../../assets/s01/kit-harington.jpg';
import johnSnow from '../../../assets/s01/john-snow.jpg';
import choleraMap from '../../../assets/s01/snow-cholera-map.jpg';
import snowPump from '../../../assets/s01/snow-pump.jpg';
import survivorshipBias from '../../../assets/s01/survivorship-bias.svg';
import abrahamWald from '../../../assets/s01/abraham-wald.jpg';
import billyBeane from '../../../assets/s01/billy-beane.jpg';

export default function Block3({ id, tabId }) {
  return (
    <Panel id={id} tabId={tabId}>
      <p className="eyebrow">Bloque 3</p>
      <h2>Cuatro historias que cambiaron algo</h2>
      <p className="lead">En las cuatro pasa lo mismo: hay un momento en que la respuesta obvia
        era la equivocada. Primero votamos, después se revela.</p>

      {/* ── 01 ── */}
      <Story>
        <StoryHead num="Historia 01" place="Soho, Londres · 1854 · 616 muertos">
          <h3>John Snow y el cólera</h3>
        </StoryHead>

        <Task
          label="Votación · antes de saber nada"
          big="La gente del barrio se está muriendo. ¿Dónde buscarías la causa?"
        >
          <Options>
            <li>En el aire: hay un olor pestilente en toda la zona</li>
            <li>En la gente: quiénes son, cómo viven, qué comen</li>
            <li>En el agua que beben</li>
            <li>En el mapa: dónde vivía exactamente cada muerto</li>
          </Options>
        </Task>

        <Plate
          variant="medium"
          src={kitHarington}
          alt="Retrato del actor Kit Harington en una convención."
          width={808}
          height={820}
        >
          <b>No. Este John Snow no.</b> Este no sabe nada, y llegó 157 años tarde.
          <Source>Kit Harington, Comic-Con 2013. Foto de Gage Skidmore · CC BY-SA 2.0 · Wikimedia Commons</Source>
        </Plate>

        <Pair>
          <Plate
            variant="portrait"
            src={johnSnow}
            alt="Retrato fotográfico del médico británico John Snow."
            width={517}
            height={760}
          >
            <b>Este.</b> John Snow (1813–1858), médico anestesista. En 1854 nadie
            creía en los gérmenes: la teoría oficial era que las epidemias viajaban en el aire.
            <Source>Autotipia de 1856, Wellcome Collection · Dominio público · Wikimedia Commons</Source>
          </Plate>
          <Prose>
            <p>Snow no discutió la teoría del aire. Hizo algo más simple y más terco:
              <b>fue casa por casa anotando dónde había muerto cada persona</b>, y dibujó cada
              muerte como una barra sobre el plano del barrio.</p>
            <p>La lista de 616 muertos no decía nada. La misma lista, puesta sobre un mapa,
              gritaba.</p>
          </Prose>
        </Pair>

        <Diagram fig={snowMap}>
          Recreación esquemática: cada barra es una muerte, colocada en la dirección
          donde ocurrió. Las posiciones son ilustrativas, no las reales — lo que sí es real es
          el patrón: las muertes se apiñan alrededor de una sola bomba de agua.
        </Diagram>

        <Plate
          src={choleraMap}
          alt="Mapa original de John Snow de 1854 mostrando las muertes por cólera en el Soho londinense."
          width={1100}
          height={1032}
        >
          El mapa original. Cada trazo negro apilado sobre una fachada es una persona.
          <Source>John Snow, <em>On the Mode of Communication of Cholera</em>, 1854 · Dominio público · Wikimedia Commons</Source>
        </Plate>

        <Pair>
          <Plate
            variant="portrait"
            src={snowPump}
            alt="Réplica de la bomba de agua de Broad Street en Londres, junto al pub John Snow."
            width={615}
            height={820}
          >
            La bomba de Broad Street, hoy una réplica sin manija en Broadwick Street.
            <Source>Foto de Justinc · CC BY-SA 2.0 · Wikimedia Commons</Source>
          </Plate>
          <Prose>
            <p>Snow convenció a las autoridades de <b>quitarle la manija a la bomba</b>. Los casos
              se desplomaron.</p>
            <p>Es el primer mapa de datos que salvó vidas. Y funcionó sin estadística, sin
              computadoras y sin saber qué era una bacteria.</p>
          </Prose>
        </Pair>

        <Idea>Mirar los datos en el espacio no responde mejor la pregunta:{' '}
          <span className="who">cambia cuál es la pregunta.</span></Idea>
      </Story>

      {/* ── 02 ── */}
      <Story>
        <StoryHead num="Historia 02" place="Segunda Guerra Mundial · 1943">
          <h3>Los aviones que volvían</h3>
        </StoryHead>

        <Prose>
          <p>La Marina de Estados Unidos revisa los bombarderos que <b>regresan</b> de misión
            sobre Europa y marca en un diagrama dónde recibieron impactos. El patrón es clarísimo:
            los agujeros se concentran en las alas, el fuselaje y la cola.</p>
          <p>El blindaje es pesado. No se puede blindar todo el avión: hay que elegir.</p>
        </Prose>

        <Plate
          src={survivorshipBias}
          alt="Diagrama de un bombardero cubierto de puntos rojos que marcan los impactos recibidos, concentrados en alas, fuselaje y cola."
          width={1427}
          height={1063}
        >
          Dónde recibieron impactos los aviones que volvieron.
          <Source>Ilustración de McGeddon, vectorizada por Martin Grandjean · CC BY-SA 4.0 · Wikimedia Commons</Source>
        </Plate>

        <Task label="Anotación colectiva · 45 segundos" big="Marca con una X dónde pondrías el blindaje.">
          <p>Sobre el diagrama, todos a la vez. No lo pienses mucho.</p>
        </Task>

        <Pair>
          <Plate
            variant="portrait"
            src={abrahamWald}
            alt="Retrato fotográfico del matemático Abraham Wald."
            width={332}
            height={520}
          >
            Abraham Wald (1902–1950), del Grupo de Investigación Estadística de
            Columbia. Húngaro, judío, refugiado. Le tocó resolver esto.
            <Source>Foto de Konrad Jacobs, Mathematisches Forschungsinstitut Oberwolfach · CC BY-SA 2.0 DE · Wikimedia Commons</Source>
          </Plate>
          <Prose>
            <p>Wald hizo una sola observación, y da vuelta al problema entero:
              <b>esos son los aviones que volvieron.</b></p>
            <p>Los impactos en las alas son sobrevivibles — justamente por eso están en el
              diagrama: el avión llegó a casa con ellos. Los aviones alcanzados en el motor y en
              la cabina <em>no están en la muestra</em>. Se cayeron sobre el mar.</p>
            <p>El blindaje va donde el diagrama está <b>limpio</b>.</p>
          </Prose>
        </Pair>

        <Idea>Los datos que tienes vienen de los que sobrevivieron para dártelos.
          La pregunta útil casi nunca es «¿qué dicen estos datos?»{' '}
          <span className="who">sino «¿quién falta en esta tabla?».</span></Idea>
      </Story>

      {/* ── 03 ── */}
      <Story>
        <StoryHead num="Historia 03" place="Oakland Athletics · 2002">
          <h3>Moneyball</h3>
        </StoryHead>

        <Task
          label="Encuesta abierta"
          big="Tienes el tercer presupuesto más bajo de la liga de baseball y juegas contra equipos que gastan tres veces más. ¿Qué comprarías?"
        >
          <p>Una sola cosa, en el chat. ¿Qué característica de un jugador buscarías?</p>
        </Task>

        <Pair>
          <Plate
            variant="portrait"
            src={billyBeane}
            alt="Billy Beane, gerente general de los Oakland Athletics, hablando en un evento."
            width={448}
            height={520}
          >
            Billy Beane, gerente general de Oakland.
            <Source>Foto de Leaders (Executive Sport Ltd.), Londres, 2010 · CC BY 2.0 · Wikimedia Commons</Source>
          </Plate>
          <Prose>
            <p>Los ojeadores compraban lo que se ve: velocidad, potencia, si el muchacho
              «tiene cuerpo de jugador». Todo el mercado pagaba por lo mismo, así que todo eso
              estaba caro.</p>
            <p>Oakland compró una variable que nadie estaba mirando: <b>llegar a base</b>.
              Aburrida, poco vistosa, y directamente conectada con anotar carreras.</p>
            <p>Ganaron 20 partidos seguidos, un récord de la Liga Americana, con la nómina de
              un equipo pobre.</p>
          </Prose>
        </Pair>

        <Idea>La ventaja no estuvo en tener más datos.{' '}
          <span className="who">Estuvo en medir lo que nadie estaba midiendo.</span></Idea>
      </Story>

      {/* ── 04 ── */}
      <Story>
        <StoryHead num="Historia 04" place="2008 – 2015">
          <h3>Un fracaso célebre: Google Flu Trends</h3>
        </StoryHead>

        <Prose>
          <p>La idea era preciosa: cuando te da gripe, antes de ir al médico buscas los síntomas
            en internet. Google podía detectar los brotes <b>semanas antes</b> que los organismos
            de salud, contando búsquedas.</p>
          <p>Funcionó. Lo celebraron como el futuro de la epidemiología. Y después empezó a
            sobreestimar los casos, año tras año, hasta que lo apagaron.</p>
        </Prose>

        <Diagram fig={fluTrends}>
          En el pico de la temporada 2012–2013, el modelo predijo cerca del doble de
          consultas por gripe de las que realmente ocurrieron. Valores ilustrativos del patrón
          documentado, no cifras exactas.
        </Diagram>

        <Prose>
          <p>¿Qué falló? Que buscar «gripe» no es tener gripe. Un invierno frío, una noticia
            alarmante o un cambio en el propio buscador movían las búsquedas sin que se moviera
            la enfermedad. El modelo aprendió a predecir <em>el invierno</em>, no la gripe.</p>
        </Prose>

        <Idea>La humildad no es un adorno del método:{' '}
          <span className="who">es parte del método.</span></Idea>
      </Story>
    </Panel>
  );
}
