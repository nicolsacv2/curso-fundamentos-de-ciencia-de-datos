import {
  Panel, Task, Diagram, Pair, Prose, Nots, Cards, Card
} from '../../../components/content/index.jsx';
import { dayTrail, ladder, intersection } from '../figures/block1.js';

export default function Block1({ id, tabId }) {
  return (
    <Panel id={id} tabId={tabId}>
      <p className="eyebrow">Bloque 1</p>
      <h2>Tu rastro de ayer</h2>

      <Task label="Muro colectivo · 4 minutos" big="Tres post-its con tres datos que generaste ayer.">
        <p>El mapa que abriste, la canción que sonó, la compra, el torniquete del transporte,
          la señal de tu celular buscando antenas mientras dormías.</p>
      </Task>

      <Diagram fig={dayTrail}>
        Un día cualquiera, visto desde los registros que deja. Ninguno de estos
        datos se generó con la intención de ser un dato.
      </Diagram>

      <h3>De un número a una decisión</h3>
      <Diagram fig={ladder}>
        El mismo hecho, subiendo cuatro peldaños. Un dato solo no sirve para nada;
        lo que vale es la decisión al final de la escalera.
      </Diagram>

      <h3>Dónde vive la ciencia de datos</h3>
      <Pair>
        <Diagram fig={intersection}>
          Ninguno de los tres círculos basta solo. La estadística sin la pregunta
          del negocio produce respuestas correctas a preguntas que a nadie le importan.
        </Diagram>
        <Prose>
          <h4>Lo que no es</h4>
          <Nots
            style={{ marginTop: '18px' }}
            items={['Magia', 'Una bola de cristal', 'Programar', 'Una respuesta única y correcta', 'Cosa de genios']}
          />
          <p style={{ marginTop: '22px', color: 'var(--ink-2)', fontSize: '18px' }}>Ninguna de estas cinco cosas.
            Y sobre todo: no es un botón que se aprieta al final para que salga la verdad.</p>
        </Prose>
      </Pair>

      <h3>Los cuatro tipos de pregunta</h3>
      <Cards cols="c4">
        <Card k="Descriptiva" t="¿Qué pasó?">
          Cuántos clientes vinieron el martes. Es la que casi siempre se responde.
        </Card>
        <Card k="Diagnóstica" t="¿Por qué pasó?">
          Por qué cayeron las ventas de marzo. Aquí empiezan los problemas serios.
        </Card>
        <Card k="Predictiva" t="¿Qué va a pasar?">
          Cuántos clientes vendrán el martes que viene. Nunca con certeza.
        </Card>
        <Card k="Prescriptiva" t="¿Qué hago?">
          Cuánto café comprar el lunes. Es la única que cambia algo.
        </Card>
      </Cards>

      <Task label="Cascada de chat" big="Una cafetería de barrio.">
        <p>Escribe <b>una</b> pregunta de datos sobre ese negocio y <b>no la envíes todavía</b>.
          A la cuenta de tres, todos envían a la vez. Después las clasificamos entre los cuatro tipos.</p>
      </Task>
    </Panel>
  );
}
