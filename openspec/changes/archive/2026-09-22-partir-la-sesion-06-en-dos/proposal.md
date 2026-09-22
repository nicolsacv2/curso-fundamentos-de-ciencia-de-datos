## Why

La sesión 6 quedó completa y ya no cabe en tres horas si se le añade lo que el curso
todavía debe: antes de leer categorías con el MCA hace falta saber leer **dos variables no
numéricas juntas** —una tabla de contingencia, la probabilidad condicional que hay en cada
una de sus filas, la independencia y el chi-cuadrado— y el **análisis de correspondencias
simples** que convierte esa tabla en un plano. Hoy la sesión pasa del PCA al MCA de un
salto, con una entrada de 78 minutos que ya es la más larga del curso, y la paradoja de
Simpson que la sesión 4 dejó plantada sigue sin resolverse en ninguna parte. Meter dos
bloques más entre la entrada y el MCA no es posible sin partir la sesión.

## What Changes

- **BREAKING · La sesión 6 se parte en dos y el curso pasa de ocho sesiones a nueve.** La
  sesión 6 se queda con toda la cadena de limpieza y el PCA que hoy son su entrada, repartida
  en **cinco bloques** con las etiquetas del curso; la sesión 7 nueva recibe el resto y lo que
  faltaba. «Cómo aprende una máquina» pasa a ser la 8 y «Fundamentos de Inteligencia
  Artificial» la 9. La portada, el temario, la cabecera «Sesión NN de 08» y el README
  cuentan nueve.
- **Sesión 6 · «De la tabla sucia al primer plano».** El contenido actual de la entrada se
  reparte sin recortes: entrada (la tabla como llegó y el texto estandarizado), bloque 1
  (describir, las cajas, las dos escalas ordinales, la columna que se descarta), bloque 2
  (rellenar, las marcas de celda inventada, describir otra vez, la tabla limpia), bloque 3
  (qué va con qué, y el PCA), y un **cierre nuevo** que hace la pregunta «¿qué falta?»,
  pide un ticket de salida y anuncia la sesión 7 con el título y el objetivo que ella misma
  declara. La pregunta deja de responderla «los bloques que vienen» y la responde la sesión
  siguiente.
- **Sesión 7 · «Todas las variables a la vez»**, nueva, con cinco bloques:
  - **Entrada · Probabilidad condicional y tablas de contingencia.** Sobre dos variables no
    numéricas de la tabla del salón, elegidas por un criterio escrito y no a ojo: la tabla
    cruzada con sus marginales, las probabilidades condicionales como perfiles de fila y de
    columna, qué sería la independencia y las frecuencias que tendría, el chi-cuadrado
    repartido celda por celda, y una medida de asociación en [0, 1]. Cierra la deuda de la
    sesión 4: la **paradoja de Simpson** resuelta con una tabla 2 × 2 × 2 —el medicamento
    por grupos de edad— donde la asociación se invierte al juntar los grupos.
  - **Bloque 1 · Análisis de correspondencias simples.** La misma tabla cruzada como nube
    de perfiles: la distancia chi-cuadrado, la inercia total como χ²/n, los ejes, las
    coordenadas de filas y de columnas en un mismo plano, las fórmulas de transición, la
    contribución y el cos². Es el puente exacto al MCA, que pasa a presentarse como «el
    análisis de correspondencias de la tabla indicadora».
  - **Bloque 2 · MCA**, **bloque 3 · FAMD** y **cierre · El salón entero**: los tres bloques
    actuales de la sesión 6, movidos, con sus puentes reescritos (el MCA abre desde el CA y
    ya no desde «¿qué falta?»; el cierre compara con el PCA «de la sesión 6», no «de la
    entrada», y anuncia la sesión 8).
- **Ninguna cifra se escribe a mano**, como en el resto de la sesión: la tabla cruzada, los
  perfiles, las esperadas, el chi-cuadrado, la medida de asociación, el CA y la tabla de
  Simpson los produce un script sin dependencias que comprueba sus identidades —marginales,
  Σλ = χ²/n, transición, Σctr = 1, y que la inversión de Simpson ocurre— antes de escribir.
- **Las sesiones anteriores dejan de contradecir el temario nuevo.** La figura de destinos de
  la sesión 2 dice que la tabla «se modela» en la 8, no en la 7; la figura de la paradoja de
  Simpson en la sesión 4 vuelve a anunciar dónde se resuelve, ahora la sesión 7; el cierre
  de la sesión 4 sigue anunciando la limpieza de la 6, que sigue siendo cierto.
- **BREAKING (rutas).** `#s6/bloque-1` y `#s6/bloque-2` cambian de contenido (hoy MCA y
  FAMD; pasan a ser los valores raros y el relleno), `#s6/bloque-3` vuelve a existir, y el
  MCA, el FAMD y el salón entero pasan a `#s7/bloque-2`, `#s7/bloque-3` y `#s7/cierre`.
  Ningún enlace deja de abrir algo.

## Capabilities

### New Capabilities

- `sesion-07-estructura`: la sesión 7 existe en el índice, con título, gancho, objetivo,
  cinco bloques rotulados y franjas en tres horas; el curso cuenta nueve sesiones.
- `sesion-07-tablas-de-contingencia`: la entrada de la sesión 7 — la tabla cruzada de dos
  variables no numéricas del salón, la probabilidad condicional, la independencia, el
  chi-cuadrado y la paradoja de Simpson resuelta, con todas las cifras generadas.
- `sesion-07-correspondencias-simples`: el bloque 1 de la sesión 7 — el análisis de
  correspondencias simples de esa misma tabla, del perfil al plano, con sus fórmulas y su
  mapa, y su papel de puente hacia el MCA.

### Modified Capabilities

- `sesion-06-estructura`: la sesión vuelve a tener cinco bloques con las etiquetas del
  curso; el contenido de la antigua entrada se reparte en ellos en un orden fijo; las rutas
  incluyen `bloque-3`; la entrada deja de ser la más larga del curso.
- `sesion-06-limpieza`, `sesion-06-imputacion`: lo que hoy se exige «de la entrada» pasa a
  exigirse de la sesión 6, en el bloque que le toca; ningún contenido cambia.
- `sesion-06-pca-cuantitativas`: la pregunta «¿qué falta?» cierra la sesión, no la entrada,
  y anuncia que la responde la sesión 7; lo demás pasa de «la entrada» a «la sesión 6».
- `sesion-06-mca`, `sesion-06-categorias-raras`, `sesion-06-famd`, `sesion-06-famd-del-salon`:
  el contenido pasa a los bloques 2, 3 y al cierre de la sesión 7; el MCA abre desde el
  análisis de correspondencias simples y no desde la pregunta de la entrada; el cierre
  compara con el PCA de la sesión 6 y anuncia la sesión 8. Las rutas de estas capacidades
  conservan su nombre `sesion-06-*` porque una capacidad no se renombra con un delta; su
  Purpose se corrige en el spec principal como parte de la implementación.
- `sesion-06-figuras-rotuladas`: lo que se exige de las figuras de la sesión 6 se exige
  también de las de la sesión 7.
- `material-publicado`: el índice muestra nueve sesiones; la figura de destinos de la sesión
  2 dice que la tabla se modela en la 8; la sesión 4 vuelve a anunciar dónde se resuelve la
  paradoja de Simpson, que es la sesión 7.
- `datos-del-salon`: las sesiones 3, 4, 6 y 7 leen del mismo conjunto.

## Impact

- **Código nuevo**: `src/sessions/s07/` completa —`meta.js`, `blocks/Intro.jsx` (tablas de
  contingencia), `blocks/Block1.jsx` (CA), `figures/shared.js`, `figures/intro.js`,
  `figures/block1.js`, `data/tablas.js` (generado)—; `src/sessions/s06/blocks/Block1.jsx`,
  `Block2.jsx`, `Block3.jsx` y `Closing.jsx` reescritos con el contenido que hoy está en
  `Intro.jsx`; `scripts/tablas_salon.py` (stdlib pura).
- **Código que se mueve**: `s06/blocks/Block1.jsx` → `s07/blocks/Block2.jsx` (MCA),
  `s06/blocks/Block2.jsx` → `s07/blocks/Block3.jsx` (FAMD), `s06/blocks/Closing.jsx` →
  `s07/blocks/Closing.jsx`, con sus figuras (`block1.js` → `block2.js`, `block2.js` →
  `block3.js`, `closing.js`) y `s06/data/ejemplo.js` → `s07/data/ejemplo.js`; los `id` de
  esas figuras pasan del prefijo `ar-s6-` a `ar-s7-`.
- **Metadatos y portada**: `src/sessions/registry.js` (sesión 7, cinco `import()` por
  sesión), `src/data/syllabus.js` (`SESIONES = 9`, pendientes 8 y 9),
  `src/components/Cover.jsx` (nueve sesiones, 27 horas) y `Session.jsx` («de 09», leído del
  temario y no tecleado).
- **Sesiones anteriores**: `src/sessions/s02/figures/block3.js` (destino «SESIÓN 8 · se
  modela»), `src/sessions/s04/figures/block3.js` y `blocks/Block3.jsx` (la paradoja anuncia la
  sesión 7).
- **Scripts**: `scripts/ejemplo_mca_famd.py` escribe en `s07/data/`;
  `scripts/check_figuras.mjs` recorre las figuras de las sesiones 6 y 7; nuevo
  `scripts/tablas_salon.py`, que lee la tabla limpia publicada y no necesita el `.xlsx`
  crudo ni el entorno virtual.
- **Documentación**: `README.md` (nueve sesiones, siete construidas, el script nuevo, la
  estructura); los Purpose de los specs `sesion-06-*` que cambian de sesión o de bloque.
- **Dependencias**: ninguna nueva, ni en npm ni en los scripts.
- **Arquitectura**: se mantiene todo —rutas por hash, un `import()` por bloque, sin router
  ni gestor de estado, `base: './'`—. Las sesiones 6 y 7 vuelven al patrón de cinco bloques
  que tienen las otras; desaparece la única sesión de cuatro.
