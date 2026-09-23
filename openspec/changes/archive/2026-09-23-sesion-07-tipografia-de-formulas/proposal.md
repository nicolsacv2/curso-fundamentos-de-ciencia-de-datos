## Why

Las fórmulas de la sesión 7 se proyectan con tres defectos que se ven en la pared y que
salen todos del mismo sitio, el tipógrafo de `s07/figures/shared.js` que las dibuja pieza a
pieza:

- **Los subíndices se montan sobre lo que sigue.** Después de una pieza con subíndice o
  superíndice el cursor avanza una cantidad fija —un tercio del cuerpo— sin mirar cuánto
  mide el índice. Vale para «i» y no para «ij», «AB», «adj» o «sup»: en «(O_ij − E_ij)²» el
  «ij» de la O cae encima del signo menos, y lo mismo pasa en las fórmulas de la
  transición, la contribución, Benzécri y la suplementaria del bloque 2.
- **La raíz cuadrada es un signo suelto.** «√» es un glifo más grande puesto delante de la
  fracción, sin barra encima del radicando y sin escalar con él: en la V de Cramér el signo
  mide una línea y el radicando dos, y no se ve qué cubre. En «1/√λ_k», «√(r_i c_j)» y
  «√p_j» pasa lo mismo a escala pequeña.
- **La χ se lee como una x.** La familia serif con la que se dibujan las fórmulas —Iowan
  Old Style en el equipo del curso— dibuja la ji griega como una equis sin cola, y «χ²»
  se proyecta como «x²», al lado de una línea en monoespaciada donde sí se lee «χ²».

Nada de esto lo atrapa `check_figuras.mjs`, que solo mira si un texto se sale del marco;
dos textos uno encima de otro pasan.

## What Changes

- **El avance tras un índice se mide.** El tipógrafo avanza lo que mide el subíndice o el
  superíndice más ancho a su tamaño reducido, más un pequeño aire, en vez de una cantidad
  fija. `measure` y `row` cambian juntos, así que fracciones y posiciones siguen coincidiendo
  con lo dibujado. Arregla de una vez las 92 piezas con índice de la sesión.
- **La raíz es una pieza del tipógrafo.** Una pieza `raiz` lleva dentro su radicando —una
  fila de piezas o una fracción— y se dibuja como un signo trazado a la altura del radicando
  con la barra encima, cubriendo todo lo que está bajo la raíz. Las ocho raíces de la sesión
  pasan a usarla: la V de Cramér de la entrada, «√(r_i c_j)» de los residuos, «1/√λ_k» de las
  cuatro transiciones y «√p_j» del reescalado del FAMD.
- **Las letras griegas se dibujan con una fuente que las distingue.** Toda pieza con un
  carácter griego se compone en una familia cuya ji tiene cola, y el resto de la fórmula
  no cambia de fuente. «χ²» se lee como ji al cuadrado.
- **`check_figuras.mjs` detecta solapes.** Además de los recortes, comprueba que dentro de
  una figura dos textos de fórmula no se pisen: estima la caja de cada uno y falla si dos
  se intersecan más allá de un aire tolerable. Con eso, un índice que vuelva a caer sobre
  el signo siguiente no llega a la pared.
- Las cuatro copias de `linea()` en los módulos de figuras no se tocan: componen con las
  piezas del tipógrafo y heredan el arreglo.
- **El bloque 1 explica por qué filas y columnas caben en el mismo plano.** Bajo el título
  «Filas y columnas en el mismo plano», antes del mapa, tres pasos: (1) hay dos nubes, la de
  los perfiles de fila en el espacio de las columnas y la de los perfiles de columna en el
  espacio de las filas, cada una con su masa y la distancia chi-cuadrado; (2) las dos nubes
  tienen los mismos ejes con la misma inercia —analizar una o la otra da los mismos valores
  propios—, así que hay un solo juego de ejes que dibujar; (3) las fórmulas de transición
  ponen cada fila en el baricentro de las columnas y cada columna en el de las filas,
  dilatados por el mismo 1/√λ, y por eso las dos nubes se superponen sobre esos ejes. Y el
  precio: entre dos filas la distancia del mapa es la chi-cuadrado, entre dos columnas
  también, pero entre una fila y una columna no es una distancia, solo una dirección. Se
  verifica con el ejemplo en las dos direcciones: la que ya existe —«observado sol» desde las
  columnas— y una nueva, «siguiente sol» desde las filas, que el script publica.
- **El bloque 1 explica cómo se obtienen los valores propios.** Dentro de «De las distancias
  al mapa», el paso «Los ejes» deja de decir solo «la dirección que más inercia conserva» y
  cuenta de dónde sale el número: (1) los **residuos estandarizados** de cada celda,
  s_ij = (p_ij − r_i c_j)/√(r_i c_j), que son el chi-cuadrado de la entrada con signo y sobre
  n, mostrados como tabla 3 × 3 del ejemplo; (2) la **matriz de residuos cruzados** SᵀS,
  columnas contra columnas, cuya traza —la suma de su diagonal— es χ²/n; (3)
  **diagonalizarla**, el mismo gesto que el PCA de la sesión 6 con la matriz de
  correlaciones: el mayor valor propio es la inercia de la dirección que más conserva, el
  siguiente es perpendicular, y el último vale cero por el centrado, que es por lo que hay
  un eje menos que columnas; de los vectores salen las coordenadas de las columnas y, por
  transición, las de las filas. Con las cifras del ejemplo: los tres valores propios —dos
  útiles y el cero— y la traza igual a χ²/n. El script publica los residuos, la matriz, la
  traza y los valores propios incluido el trivial, y comprueba que suman la traza.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `sesion-07-tablas-de-contingencia`: las fórmulas de la entrada se componen sin solapes,
  con la raíz cubriendo su radicando y la ji reconocible.
- `sesion-07-correspondencias-simples`: lo mismo para las fórmulas del bloque 1, en el
  requisito que ya exige que se vean en la pared; y dos requisitos nuevos: el bloque explica
  por qué filas y columnas caben en el mismo plano y lo verifica en las dos direcciones, y
  explica cómo se obtienen los valores propios desde los residuos.
- `sesion-06-mca`: lo mismo para las fórmulas del bloque 2.
- `sesion-06-famd`: lo mismo para las fórmulas del bloque 3.

## Impact

- **Código que cambia**: `src/sessions/s07/figures/shared.js` (`avance`, `measure`, `row`,
  la pieza `raiz`, la familia para griego); `src/sessions/s07/figures/intro.js`,
  `block1.js`, `block2.js` y `block3.js` (las ocho raíces pasan a la pieza nueva);
  `scripts/check_figuras.mjs` (la comprobación de solapes); `src/sessions/s07/blocks/Block1.jsx`
  (la sección del plano compartido); `figures/block1.js` (la vuelta en la figura de la
  transición; dos secciones más en la figura del salto); `scripts/ejemplo_lluvia.py` y
  `src/sessions/s07/data/lluvia.js` (`CA.transicionInversa`, `CA.residuos`, `CA.matriz`,
  `CA.traza`, `CA.autovaloresConTrivial`).
- **Sin cambios**: los demás bloques `.jsx`, la sesión 6 (que tiene su propia copia del
  tipógrafo en `s06/figures/shared.js` y no se toca en este cambio), dependencias,
  arquitectura.
