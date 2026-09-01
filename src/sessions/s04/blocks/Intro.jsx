import { Panel, Task, Options, Diagram, Prose, Idea } from '../../../components/content/index.jsx';
import { MERE } from '../data/salon.js';
import { juegosDeMere } from '../figures/intro.js';
import DiceActivity from '../activities/DiceActivity.jsx';

export default function Intro({ id, tabId }) {
  return (
    <Panel id={id} tabId={tabId}>
      <p className="eyebrow">Entrada · 0–25</p>
      <h2>La apuesta del caballero</h2>
      <p className="lead">París, 1654. Antoine Gombaud, caballero de Méré, vive de apostar. Tiene
        un juego con el que gana desde hace años, inventa una variante que según su cuenta es
        idéntica, y la variante lo empieza a arruinar.</p>

      <Prose>
        <p>El juego de siempre: lanzar un dado <b>cuatro veces</b> y apostar a que sale al menos
          un 6. La variante: lanzar dos dados <b>veinticuatro veces</b> y apostar a que sale al
          menos un doble 6. Su aritmética decía que eran la misma apuesta — cuatro oportunidades
          entre seis casos es lo mismo que veinticuatro entre treinta y seis —, pero su bolsillo
          decía otra cosa, y de Méré le creyó al bolsillo: le escribió a <b>Blaise Pascal</b>,
          Pascal le escribió a <b>Pierre de Fermat</b>, y en ese intercambio de cartas nació la
          teoría de la probabilidad.</p>
        <p>Antes de ver quién tenía razón, vamos a hacer exactamente lo que hizo él:
          <b> jugar y contar</b>.</p>
      </Prose>

      <Task label="Actividad · en tu pantalla · 5–20" big="Elige tu juego y lanza.">
        <Options steps>
          <li>Escribe tu nombre: cada lanzamiento queda registrado a tu nombre.</li>
          <li>Apuesta: elige <b>uno</b> de los dos juegos. Decide con la intuición, que es lo
            único que tenía de Méré.</li>
          <li>Lanza cuantas veces quieras. Cada «Lanzar» es una ronda completa — los 4 tiros o
            los 24 pares — y suma al marcador de toda la clase.</li>
        </Options>
      </Task>

      <DiceActivity />

      <Prose>
        <p>El marcador lleva dos cuentas. Las rondas ganadas son la <b>frecuencia absoluta</b>:
          un conteo, como los que hicimos con la tabla del salón. Dividirlas entre las rondas
          jugadas da la <b>frecuencia relativa</b>, y esa es la que hay que mirar: con cinco
          rondas baila, con cincuenta se agita menos, y con las rondas de todo el salón juntas
          empieza a quedarse quieta alrededor de un número. Ese número al que la frecuencia
          relativa se le arrima cuando el conteo crece es lo que llamamos <b>probabilidad</b>.</p>
      </Prose>

      <Diagram fig={juegosDeMere}>
        La cuenta de Méré trataba las oportunidades como si se sumaran, y no se suman. El juego 1
        gana el <b>{MERE.gana4}%</b> de las veces; el juego 2, el <b>{MERE.gana24}%</b>. Menos de
        tres puntos de diferencia — invisible en una noche, implacable en un año de apuestas.
      </Diagram>

      <Idea>La probabilidad no nació en un aula.{' '}
        <span className="who">Nació en una mesa de apuestas, contando.</span></Idea>
    </Panel>
  );
}
