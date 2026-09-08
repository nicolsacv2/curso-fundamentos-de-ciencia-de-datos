import { Panel, Diagram, Pair, Prose, List, Idea, Task, Cards, Card }
  from '../../../components/content/index.jsx';
import { antesYDespues, varianzaExplicada, extremos, pasosPlano } from '../figures/block2.js';
import { COMPONENTES } from '../figures/cloud3d.js';
import Cloud3D from '../views/Cloud3D.jsx';
import { PCA3, PAISES, VARS, ANIO, FUENTE } from '../data/paises.js';

export default function Block2({ id, tabId }) {
  const dos = (PCA3.porcentajes[0] + PCA3.porcentajes[1]).toFixed(1);
  const nombre = k => VARS.find(v => v[0] === k)[1].toLowerCase();
  const carga = (i, j) => PCA3.cargas[i][j].toFixed(2).replace('-', '−');

  return (
    <Panel id={id} tabId={tabId}>
      <p className="eyebrow">Bloque 2 · 83–120</p>
      <h2>La sombra de la nube</h2>

      <Task label="El problema" big="La nube vive en tres ejes y la hoja tiene dos. Hay que
        aplanarla, y toda sombra pierde algo. La pregunta es cuánto, y desde qué ángulo se
        pierde menos.">
        <p>Gira la nube del bloque anterior hasta ponerla de canto: casi todos los países se
          amontonan en una línea y no se distingue nada. Gírala de frente y se reparten. Hay
          ángulos mejores que otros, y uno es <b>el mejor</b>.</p>
      </Task>

      <h3>La dirección que más estira la nube</h3>
      <Prose>
        <p>El análisis de componentes principales busca justamente eso: la dirección en la que
          la nube <b>más se estira</b>. Esa es la primera componente. La segunda es la
          dirección que más estira de lo que queda, obligada a ser perpendicular a la
          primera. Con las dos ya hay un plano, y ese plano es la hoja: se llama
          {' '}<b>plano factorial</b>, y es donde vamos a colocar a los países.</p>
      </Prose>

      <Diagram fig={pasosPlano}>
        La misma nube en los cinco pasos: lo que cambia es lo que se le añade encima.
      </Diagram>

      <Prose>
        <h4>Los cinco pasos, uno a uno</h4>
        <List>
          <li><b>01 · La nube en desviaciones típicas.</b> Antes de buscar nada, cada
            variable se centra en su media y se divide por su desviación. Si no, el PIB
            —que va en decenas de miles— decidiría solo la respuesta, y estaríamos midiendo
            las unidades en vez de los países.</li>
          <li><b>02 · La dirección en la que más se estira.</b> Se prueba, en todas las
            direcciones posibles, en cuál queda la nube más larga al proyectarse. Esa es la
            primera componente: la que conserva más variación.</li>
          <li><b>03 · La perpendicular que más queda.</b> La segunda se busca igual, pero
            obligada a formar ángulo recto con la primera. Esa obligación es lo que impide
            que las dos cuenten lo mismo dos veces.</li>
          <li><b>04 · Las dos juntas son un plano.</b> Dos direcciones definen un plano, y
            ese es el <b>plano factorial</b>: la hoja sobre la que vamos a dibujar.</li>
          <li><b>05 · Cada país cae sobre el plano.</b> Se proyecta, como una sombra a
            plomo. Las dos coordenadas de esa sombra son el país en el plano factorial, y
            lo que se pierde es la distancia que ha caído.</li>
        </List>
      </Prose>

      <Diagram fig={antesYDespues}>
        Los mismos {PAISES.length} países antes y después de proyectarse. Colombia está
        señalada en las dos mitades: es una sola nube, vista de dos maneras.
      </Diagram>

      <Pair>
        <Prose>
          <h4>De dónde sale esa dirección</h4>
          <p>De la <b>matriz de covarianza</b> — la tabla de todas las covarianzas de la
            entrada, cada variable contra cada variable. De ella se sacan sus
            <b> autovectores</b>, que son las direcciones, y sus <b>autovalores</b>, que
            dicen cuánto se estira la nube en cada una.</p>
          <p>El cálculo no lo hacemos aquí: se hace una vez, fuera, y lo que llega a esta
            pantalla son sus resultados. Lo que sí hay que saber leer es qué significan.</p>
        </Prose>
        <Prose>
          <h4>Qué es una componente</h4>
          <p>No es ninguna de las variables originales: es una <b>combinación de todas</b>.
            La primera componente de esta nube mezcla PIB, esperanza de vida e hijos por
            mujer en una sola dirección.</p>
          <p>Por eso no tiene unidades ni nombre propio. Se la nombra por lo que uno ve en
            ella, y ponerle nombre ya es una interpretación tuya, no un resultado del
            cálculo.</p>
        </Prose>
      </Pair>

      <h3>Qué pesa en cada una</h3>
      <Prose>
        <p>Una componente llega <b>sin nombre</b>, y aquí se queda así: se llaman CP 1 y
          CP 2. El cálculo produce direcciones, no significados, y en cuanto una se bautiza
          —«nivel de vida», por ejemplo— es facilísimo empezar a tratarla como si fuera una
          variable que alguien midió. No lo es.</p>
        <p>Lo que sí se puede mirar sin inventar nada es <b>qué variables pesan</b> en cada
          una y <b>quién queda en cada extremo</b>. Eso son datos; el nombre sería nuestro.</p>
      </Prose>

      <Cards>
        {COMPONENTES.map((c, j) => {
          const ext = extremos(j);
          return (
            <Card key={c.eje} k={`${c.eje} · ${PCA3.porcentajes[j]} %`} t="cargas">
              {PCA3.vars.map(v => `${nombre(v)} ${carga(PCA3.vars.indexOf(v), j)}`).join(' · ')}
              {' — de '}{ext.bajos.slice(0, 2).join(' y ')}{' en un extremo a '}
              {ext.altos.slice(0, 2).join(' y ')}{' en el otro.'}
            </Card>
          );
        })}
      </Cards>

      <h3>Cuánto conserva cada componente</h3>
      <Diagram fig={varianzaExplicada}>
        Con dos componentes se conserva el {dos} % de la variación de los tres indicadores.
        El resto es lo que la sombra perdió.
      </Diagram>

      <h3>Todo junto, y girando</h3>
      <Prose>
        <p>Aquí está la escena completa: la nube, el plano factorial dentro de ella, la
          sombra de cada país sobre él y una flecha por indicador
          con su propia sombra. Gírala hasta ver el plano de canto — las sombras caen en una
          línea, porque todas viven en él.</p>
      </Prose>

      <Cloud3D plane projections vectors>
        La nube, el plano, las sombras y los vectores. Todo gira junto porque todo está en la
        misma escena. Datos de {FUENTE.nombre} ({ANIO}), {FUENTE.licencia}.
      </Cloud3D>

      <h3>Y si añadimos la cuarta variable</h3>
      <Prose>
        <p>Hasta aquí hemos trabajado con tres indicadores porque tres caben en una escena que
          se puede girar. Pero la tabla tiene <b>cuatro</b>: falta la mortalidad infantil. Y
          con cuatro no hay nube que dibujar — no existe la pantalla de cuatro ejes.</p>
        <p>Ese es el problema, y tiene nombre: la <b>maldición de la dimensionalidad</b>.
          Cuantas más variables, más difícil es mirar los datos, y no solo por el dibujo: en
          muchas dimensiones los puntos se separan tanto entre sí que las distancias dejan de
          distinguir nada, y todo empieza a parecerse a todo.</p>
      </Prose>

      <Cards cols="c3">
        <Card k="2 variables" t="un plano">un punto por caso, se ve todo</Card>
        <Card k="3 variables" t="una nube">hay que girarla, pero se ve</Card>
        <Card red k="4 o más" t="no hay hoja">no existe el dibujo directo</Card>
      </Cards>

      <Prose>
        <p>Y aquí es donde el PCA deja de ser un truco de dibujo para ser una herramienta: si
          {' '}<b>dos</b> componentes conservan el {dos} % de lo que tenían <b>tres</b>
          {' '}variables, quizá dos conserven casi todo lo que tienen cuatro. El PCA es la
          respuesta clásica a la maldición de la dimensionalidad: cambiar muchas variables
          por unas pocas combinaciones, y saber exactamente cuánto se dejó por el camino.</p>
        <p>El bloque siguiente hace justo eso con las cuatro, y para conseguirlo tendremos que
          girar la tabla entera.</p>
      </Prose>

      <Idea>Toda sombra pierde algo; la gracia es elegir el ángulo y saber cuánto.{' '}
        <span className="who">Con cuatro variables ya no hay ángulo: hay que reducir.</span></Idea>
    </Panel>
  );
}
