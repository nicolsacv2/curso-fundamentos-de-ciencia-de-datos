import {
  Panel, Task, Cards, Card, Diagram, Pair, Prose, List, Idea
} from '../../../components/content/index.jsx';
import { MINUTOS, MINUTOS_SIN } from '../data/salon.js';
import { enjambres, ahorros } from '../figures/block2.js';

export default function Block2({ id, tabId }) {
  return (
    <Panel id={id} tabId={tabId}>
      <p className="eyebrow">Bloque 2 · 78–115</p>
      <h2>Lo que el centro no cuenta</h2>
      <p className="lead">Tres grupos de once personas. Mismo promedio, misma mediana, misma
        moda: si el reporte trae solo el centro, son el mismo grupo. Míralos.</p>

      <Diagram fig={enjambres}>
        En el grupo A todo el mundo es parecido al 120. En el C, <b>casi nadie</b>: hay tres
        personas en 120 y el resto vive en los extremos. El centro de los tres es idéntico y no
        describe a ninguno igual de bien.
      </Diagram>

      <Task label="Chat · una letra · 82–88" big="Vas a dictarle clase a uno de los tres grupos y el 120 es su nivel de entrada. ¿A cuál prefieres?">
        <p>Una letra al chat, y una frase de por qué. No hay respuesta correcta: hay una
          consecuencia distinta por cada letra, y eso es lo que queremos que se vea.</p>
      </Task>

      <Cards cols="c3">
        <Card k="Rango" t={`${MINUTOS.rango} min`}>
          Máximo menos mínimo de la columna F: 960 − 1. Lo definen exactamente dos personas;
          las otras dieciocho podrían cambiar sin que se entere.
        </Card>
        <Card k="Varianza" t="promedio de desviaciones²">
          Toma la distancia de cada valor al promedio, elévala al cuadrado y promedia. Funciona,
          pero queda en <b>minutos al cuadrado</b>, que nadie sabe qué son.
        </Card>
        <Card k="Desviación estándar" t={`${MINUTOS.desviacion} min`}>
          La raíz de la varianza: vuelve a las unidades originales. Es «cuánto se aleja del
          promedio una respuesta típica» de la columna F.
        </Card>
      </Cards>

      <h3>La prueba de la fila 16</h3>
      <Prose>
        <p>En la sesión pasada decidimos <b>no borrar</b> la fila 16 — los 960 minutos de Tunja,
          raros pero posibles. Veamos qué le hace esa única fila a cada resumen que llevamos
          hoy:</p>
      </Prose>

      <Pair>
        <Prose>
          <h4>Sensibles al atípico</h4>
          <List>
            <li>Promedio: <b>{MINUTOS.media} → {MINUTOS_SIN.media}</b> — una sola fila lo mueve
              42 minutos.</li>
            <li>Desviación estándar: <b>{MINUTOS.desviacion} → {MINUTOS_SIN.desviacion}</b> — casi
              a la mitad, porque el cuadrado agranda lo lejano.</li>
            <li>Rango: <b>{MINUTOS.rango} → {MINUTOS_SIN.rango}</b> — era, literalmente, esa
              fila.</li>
          </List>
        </Prose>
        <Prose>
          <h4>Robustos</h4>
          <List>
            <li>Mediana: <b>{MINUTOS.mediana} → {MINUTOS_SIN.mediana}</b> — no se movió ni un
              minuto.</li>
            <li>Rango intercuartílico (Q3 − Q1): <b>{MINUTOS.iqr} → {MINUTOS_SIN.iqr}</b> — el
              ancho de la mitad central del salón apenas se entera.</li>
            <li>Desviación mediana: <b>{MINUTOS.desvMediana} → {MINUTOS_SIN.desvMediana}</b> —
              la distancia típica a la mediana, medida también con mediana.</li>
          </List>
        </Prose>
      </Pair>

      <Prose>
        <p>No es que una lista sea mejor que la otra. El promedio y la desviación usan toda la
          información, y por eso mismo se dejan arrastrar; la mediana y el IQR ignoran los
          tamaños extremos, y por eso mismo aguantan. Es la misma decisión de la sesión 3 —
          ¿qué hacemos con la fila 16? — convertida en elección de instrumento.</p>
      </Prose>

      <h3>Una desviación no significa nada sola</h3>
      <Diagram fig={ahorros}>
        El <b>coeficiente de variación</b> divide la desviación por el promedio y la deja sin
        unidades: mide la dispersión <b>en proporción al tamaño</b> de lo que se dispersa. Es la
        diferencia entre «doce millones de vaivén» y «el 40% de todo lo que tengo».
      </Diagram>

      <Idea>Un resumen honesto son dos números:{' '}
        <span className="who">un centro, y cuánto hay que creerle.</span></Idea>
    </Panel>
  );
}
