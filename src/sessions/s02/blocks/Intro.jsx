import {
  Panel, Task, Options, Cards, Card, Pair, Prose, Idea
} from '../../../components/content/index.jsx';

export default function Intro({ id, tabId }) {
  return (
    <Panel id={id} tabId={tabId}>
      <h2>¿De dónde salió esa cifra?</h2>

      <Task label="Todos juegan · Kahoot · 0–10" big="Cinco preguntas sobre la sesión pasada.">
        <p>Ranking visible. No es una evaluación: es la manera más rápida de volver a poner en la
          cabeza de todos lo que ya vimos.</p>
      </Task>

      <h3>La cifra del día</h3>
      <p className="lead">El reto de la sesión pasada era traer un número publicado y, al lado, una
        pregunta incómoda sobre ese número. <b>Tres personas</b> exponen el suyo
        y el resto del salón lo interroga.</p>

      <Task label="Si te toca exponer · un minuto · 10–22" big="En ese minuto caben exactamente tres cosas.">
        <Options steps>
          <li><b>La cifra, tal como la publicaron.</b> Léela literal. No la redondees, no la
            arregles y no la expliques todavía.</li>
          <li><b>De dónde salió.</b> Quién la publicó y cuándo, y si en algún lado dice cómo se
            midió. Si no dice nada, eso <em>también</em> es lo que hay que reportar.</li>
          <li><b>Tu pregunta incómoda.</b> Una sola: la que te quedó sonando cuando la leíste.</li>
        </Options>
      </Task>

      <Task label="Si no te toca exponer · por chat" big="Una pregunta por persona, y no vale repetir la del vecino.">
        <p>Mientras alguien expone, el chat se llena. Leo en voz alta las mejores y las sumo al
          debate. Ojo con el objetivo: <b>no se trata de demostrar que la cifra es falsa.</b> Se
          trata de averiguar qué no nos están contando sobre ella. Casi siempre el número es
          correcto y lo que falta es el contexto.</p>
      </Task>

      <h4>Las tres preguntas con las que se interroga cualquier número</h4>
      <Cards cols="c3">
        <Card k="Pregunta 1" t="¿Quién lo midió?">
          Nadie cuenta el mundo entero. Alguien decidió qué contar, dónde y cuándo.
        </Card>
        <Card k="Pregunta 2" t="¿A quién le conviene?">
          Casi toda cifra que llega a una noticia la pagó alguien que quería publicarla.
        </Card>
        <Card red k="Pregunta 3" t="¿Quién quedó fuera?">
          La de los aviones de Wald. Es la que casi nadie hace, y la que más veces salva.
        </Card>
      </Cards>

      <h3>Cómo se ve un turno que salió bien</h3>
      <Pair>
        <Prose>
          <h4>La cifra</h4>
          <p style={{ marginTop: '16px' }}>«<b>El 68 % de los jóvenes colombianos preferiría trabajar en el exterior.</b>»
            Titular de un portal, publicado el martes. En el cuerpo de la nota dice, en letra
            pequeña, que son 1.200 respuestas recogidas por internet.</p>
        </Prose>
        <Prose>
          <h4>Lo que el salón encontró</h4>
          <ul className="list" style={{ marginTop: '16px' }}>
            <li>«Joven» ¿hasta qué edad? La nota no lo dice, y de eso depende todo.</li>
            <li>Mil doscientas respuestas <b>por internet</b>: ¿quién no contesta encuestas por
              internet, y se parece al resto?</li>
            <li>¿Quién pagó el estudio? Al pie aparece una agencia de reclutamiento en el exterior.</li>
            <li>¿«Preferiría» a secas, o «preferiría si le pagaran el doble»? La pregunta original
              no está publicada.</li>
          </ul>
        </Prose>
      </Pair>

      <Prose>
        <p>Fíjate en que ninguna de las cuatro dice que el 68 % sea mentira. Todas dicen algo más
          incómodo: <b>que con lo publicado no hay manera de saberlo.</b> Las dos primeras vuelven
          hoy mismo, en el bloque 2, con nombre propio: población y muestra.</p>
      </Prose>

      <Idea>Un número sin origen no es información:{' '}
        <span className="who">es un rumor con dígitos.</span></Idea>
    </Panel>
  );
}
