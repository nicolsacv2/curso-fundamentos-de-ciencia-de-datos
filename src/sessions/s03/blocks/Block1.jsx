import {
  Panel, Task, Cards, Card, Diagram, DataTable, Prose, List, Idea
} from '../../../components/content/index.jsx';
import { COLS, ROWS, RECUENTOS } from '../../../data/salon.js';
import { faltantes } from '../figures/block1.js';

export default function Block1({ id, tabId, block }) {
  return (
    <Panel id={id} tabId={tabId} block={block}>
      <p className="lead">Siete nombres. No son categorías de un libro: cada uno está en nuestra
        tabla, con su variable y su fila, y los vamos a usar durante seis sesiones.</p>

      <Cards cols="c4">
        <Card k="Tipo 1" t="Formato">
          La misma cosa escrita distinto. Bogotá de seis maneras, <b>Cajicá</b> con tilde en la
          fila 15 y sin ella en la 20, «ninguno» de cuatro formas en <b>libro</b>.
        </Card>
        <Card k="Tipo 2" t="Categoría mal definida">
          {RECUENTOS.bogotaEnCundinamarca} de los {RECUENTOS.bogota} bogotanos pusieron <b>Cundinamarca</b> en <b>depto</b>. No es error
          de nadie: la pregunta ofrecía una casilla que no existe.
        </Card>
        <Card k="Tipo 3" t="El identificador que no identifica">
          El código <b>9999</b> está dos veces, en A11 y A15. No hay manera de saber si son dos
          personas o una que respondió dos veces.
        </Card>
        <Card k="Tipo 4" t="Unidades revueltas">
          La variable <b>minutos</b> pedía justamente eso. Llegaron 1, 2, 4, 5, 8 y 16 junto a 120, 240 y 960.
          Un 8 es indistinguible: ¿ocho minutos u ocho horas?
        </Card>
        <Card k="Tipo 5" t="Atípico: imposible o raro">
          E1 dice <b>30 horas</b> de pantalla al día, y el día tiene 24: eso es imposible. F16
          dice <b>960 minutos</b>, dieciséis horas, y eso es raro pero puede ser cierto. No se
          tratan igual.
        </Card>
        <Card red k="Tipo 6" t="Faltantes con causa">
          {RECUENTOS.pantallaVacias} de {RECUENTOS.filas} dejaron <b>pantalla</b> vacía, y esa pregunta mandaba a consultar el reporte
          del celular. <b>El que no responde no es una persona al azar.</b>
        </Card>
        <Card k="Tipo 7" t="La respuesta subjetiva">
          La fila 16 comió <b>cero</b> porciones de fruta y se califica <b>5 sobre 5</b> en
          alimentación balanceada. La fila 1 comió tres y se califica 1.
        </Card>
        <Card red k="Y uno que no es suciedad" t="La variable área">
          Una categoría se llama «Economía, administración y contaduría» y las respuestas
          múltiples también van separadas por comas. D2 trae <b>dos respuestas y tres comas</b>.
          Este no se limpia, y por eso no tiene número.
        </Card>
      </Cards>

      <h3>El tipo 6, despacio</h3>
      <p className="lead">Es el único que hay que decir dos veces, porque es el que más se
        confunde y el que peor se arregla.</p>

      <Diagram fig={faltantes}>
        Las tres se ven idénticas al abrir el archivo. Distinguirlas no es un problema técnico:
        depende de saber <b>cómo se preguntó</b>, y esa información no viaja dentro de la tabla.
      </Diagram>

      <Task label="Auditoría colectiva · chat · 38–62" big="Una variable, una fila y un nombre del catálogo. Sin repetir.">
        <p>Vuelve a la tabla de la entrada y busca. No vale decir que algo se ve raro: hay que
          <b> señalarlo y nombrarlo</b>. Una sola por persona, y no repitas la del vecino.</p>
        <List>
          <li><b>municipio, fila 4</b> — formato</li>
          <li><b>codigo, filas 11 y 15</b> — el identificador no identifica</li>
          <li><b>libro, filas 12, 15 y 17</b> — formato: la misma persona, tres escrituras</li>
        </List>
      </Task>

      <h4>Las dos que casi nunca aparecen</h4>
      <DataTable
        cols={COLS}
        rows={ROWS}
        pick={['codigo', 'sangre']}
        mark={['codigo:1', 'codigo:11', 'codigo:15', 'sangre:5']}
        focus
        caption={<>En <b>sangre, fila 5</b> el grupo sanguíneo está escrito con un signo menos tipográfico
          (−) y no con el guion del teclado: buscar «O-» no lo encuentra nunca, y en pantalla
          se ve igual. En <b>codigo, fila 1</b> el código anónimo es <b>1234</b> — no está mal escrito,
          pero nadie elige números al azar, y por eso el 9999 se repitió.</>}
      />

      <Prose>
        <p>Compara lo que encontramos ahora con las palabras que escribimos «a ojo» hace cuarenta
          minutos. La diferencia no es que ahora seamos más listos: es que <b>el catálogo dice
          dónde mirar</b>. Buscar sin una lista de qué buscar es mirar una tabla y sentir que
          está bien.</p>
      </Prose>

      <Idea>Ver que algo está raro no sirve de nada.{' '}
        <span className="who">Lo que sirve es poder nombrarlo.</span></Idea>
    </Panel>
  );
}
