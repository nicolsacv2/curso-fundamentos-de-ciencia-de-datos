## Why

La entrada de la sesión 7 enseña la probabilidad condicional sobre un par de variables del
salón elegido por un criterio —«usa Python × usa R»— que hay que explicar antes de poder
explicar nada: qué pares se consideraron, qué filtros, por qué ese. Para un público no
técnico eso es ruido delante de la idea. Además, la tabla del salón asoma en la entrada, en
el bloque 1 y en los puentes del MCA y el FAMD, cuando la sesión tiene un solo lugar para
ella: el cierre, donde se analiza entera. Y los bloques de «idea» —las frases con la raya
roja— sobran en esta sesión: el público las lee como sentencias y no como resumen.

## What Changes

- **La entrada explica la probabilidad condicional sobre un ejemplo propio**: el cielo de hoy
  y el cielo de mañana, con tres estados —sol, nublado, lluvia— en un año inventado y
  declarado como inventado. Sobre esa tabla 3 × 3 se enseñan los recuentos y las sumas, los
  perfiles como P(mañana | hoy), la marginal contra la condicional, la tabla esperada bajo
  independencia, el chi-cuadrado celda por celda y una medida en [0, 1]. La pregunta que da
  nombre al ejemplo —«si llovió hoy, ¿llueve mañana?»— es la celda sobre la que se lee
  P(A | B). El par del salón, el criterio de elección y la lista de candidatos desaparecen
  de la entrada.
- **El bloque 1 dibuja esa misma tabla** con el análisis de correspondencias simples: tres
  estados de hoy y tres de mañana en un plano de dos ejes que retiene toda la inercia. Los
  perfiles, la distancia chi-cuadrado, la inercia como χ²/n, la transición, la contribución
  y el cos² se verifican sobre los días del ejemplo, no sobre personas del salón.
- **BREAKING (datos).** `scripts/tablas_salon.py` y `src/sessions/s07/data/tablas.js` se
  eliminan: ya no tienen quién los lea. Las cifras del ejemplo —y la tabla de Simpson, que
  vivía en ese archivo— pasan a un generador nuevo sin dependencias que comprueba sus
  identidades y la propia historia del ejemplo (que llover hoy hace más probable llover
  mañana) antes de escribir.
- **Los datos del salón aparecen en la sesión 7 solo en el cierre.** El puente del MCA deja de
  contar cuántas columnas quedaron fuera y de citar el agrupamiento en «raro» de la
  sesión 6; el FAMD deja de anunciar cuántas variables habrá en el cierre. Antes del cierre
  ningún bloque importa la tabla del salón.
- **La sesión 7 no usa bloques de «idea».** Se retiran los ocho que hay —dos en la entrada,
  uno en el bloque 1, dos en el MCA, dos en el FAMD, uno en el cierre—; la prosa y los
  títulos quedan. El componente sigue existiendo para las otras sesiones.
- **Las tablas numéricas de la sesión 7 conservan su esquina fija** al desplazarse en
  horizontal, como la tabla del salón: la celda de esquina de la cabecera se queda en su sitio
  en vez de irse con el desplazamiento y dejar tapada la primera columna. Las cinco copias
  del componente de tabla que hay en los bloques de la sesión 7 pasan a ser una sola, en el
  vocabulario de contenido del curso.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `sesion-07-tablas-de-contingencia`: la tabla de contingencia es un ejemplo propio y
  declarado, no dos variables del salón; se retiran el criterio de elección del par y la lista
  de candidatos; la probabilidad condicional se lee sobre la celda «llovió hoy → llueve
  mañana»; las cifras salen de constantes declaradas y no de la tabla limpia; las tablas
  conservan su esquina fija.
- `sesion-07-correspondencias-simples`: el CA se hace sobre la tabla del ejemplo y sus
  verificaciones —distancia, inercia, transición, lectura— se hacen sobre los días del ejemplo.
- `sesion-07-estructura`: los datos del salón entran a la sesión solo en el cierre, y la
  sesión no usa bloques de «idea».
- `sesion-06-mca`: el puente del MCA ya no cita cuántas columnas del salón quedaron fuera.

## Impact

- **Código nuevo**: `scripts/ejemplo_lluvia.py` (stdlib pura) y `src/sessions/s07/data/lluvia.js`
  (generado); `NumTable` en `src/components/content/index.jsx`.
- **Código que cambia**: `src/sessions/s07/blocks/Intro.jsx`, `Block1.jsx`, `figures/intro.js`,
  `figures/block1.js` (reescritos sobre `lluvia.js`); `Block2.jsx` y `Block3.jsx` (puentes sin
  salón, sin ideas); `Closing.jsx` (sin idea, tabla compartida); `figures/shared.js` (la
  abreviatura de niveles largos deja de hacer falta y se retira).
- **Código que desaparece**: `scripts/tablas_salon.py`, `src/sessions/s07/data/tablas.js`.
- **Documentación**: `README.md` (el script nuevo entre los de stdlib pura, el que desaparece
  fuera de la lista); los Purpose de `sesion-07-tablas-de-contingencia` y
  `sesion-07-correspondencias-simples` en los specs principales.
- **Dependencias**: ninguna nueva. **Arquitectura**: sin cambios; `check_figuras.mjs` sigue
  recorriendo las dos sesiones sin tocarlo.
