## Context

`Block1.jsx` construye desde `CA` de `lluvia.js` quién nombra el eje 1, la fila más lejos del
centro y la columna que va con ella (`filaLejos`, `colLejos`), y «Aplicado al cielo» solo usa
eso. `CA.distancia` publica una sola distancia chi-cuadrado —entre las dos primeras filas—
para la figura de fórmulas. El mapa (`mapaCA` en `figures/block1.js`) dibuja seis puntos con
rótulo «observado: X (n)» / «siguiente: X (n)» apilados con `apilar()`. Con el año actual el
plano retiene el 100 % (dos ejes de una 3 × 3), así que la distancia euclídea entre dos
puntos del mismo tipo en el plano ES su distancia chi-cuadrado.

En el bloque 1, la sección «La distancia chi-cuadrado» termina con la inercia y los valores
propios y pasa directamente a «Filas y columnas en el mismo plano». En el bloque 2 (`Block2.jsx`),
«Parte 1 · La métrica chi-cuadrado» pasa a las fórmulas de transición y el mapa llega en la
Parte 2 sin haber dicho de dónde salen las coordenadas. `ejemplo.js` publica para el MCA
`Z`, `masaFila`, `residuos`, `individuos[i].coord` sobre los tres ejes y `acumulado`.

Reglas del repositorio: ninguna cifra a mano, nada calculado en el navegador más allá de
elegir entre valores publicados, figuras con los helpers de la sesión, sin motor de fórmulas.
Ver `proposal.md`.

## Goals / Non-Goals

**Goals:** que cada regla de lectura tenga su caso en el mapa con cifras publicadas y que los
casos se elijan desde los datos; que los dos análisis expliquen el mismo salto de las
distancias al mapa con la misma escalera y lo verifiquen con una pareja de su ejemplo.

**Non-Goals:** no se cambia ningún análisis ni el resto de los bloques; no se tocan la
entrada, el bloque 3, el cierre ni las franjas; no se dibujan segmentos entre puntos del mapa
(las parejas homónimas están a pocos píxeles y un segmento no se vería); no se enseña la SVD
como tal: el salto se explica como «el gesto del PCA sobre otra nube con otra regla».

## Decisions

### D1 · Las distancias se publican, la prosa las elige

`ejemplo_lluvia.py` añade `CA.distancias = { filas: [...], columnas: [...] }`, una entrada
`{ a, b, d2, d, dCoord }` por par (tres y tres), ordenadas de menor a mayor `d`. `d` se calcula
desde los perfiles con la fórmula chi-cuadrado y `dCoord` como la distancia euclídea entre las
coordenadas principales sobre los K ejes; el script `assert`a que coinciden, y publica las dos
para que el bloque las muestre iguales sin calcular nada. `CA.distancia` (la de la figura de
fórmulas) se conserva tal cual. El bloque toma `distancias.filas[0]` como el par más cercano
y `distancias.filas.at(-1)` como el más lejano; para columnas, `[0]`.

*Alternativa:* calcular en el bloque la distancia euclídea desde `coord`. Rechazada: sería
calcular en el navegador lo que el script puede publicar y comprobar, y solo vale porque este
plano retiene el 100 %.

### D2 · Los cinco casos, y de dónde sale cada uno

1. **Homónimas.** Para cada estado k: `TABLA.celdas[k][k]` contra `ESPERADAS[k][k]`. La prosa
   dice que las tres parejas están juntas y al mismo lado del eje 1, y lo comprueba con los
   signos de `coord[0]` de fila y columna (si alguna pareja no compartiera lado, la frase
   cambia a nombrar cuáles sí). Lista las tres celdas.
2. **Filas.** `distancias.filas[0]` (más cercano) y el último (más lejano): estados, `d`, y
   los perfiles de `PERFILES.fila` de cada estado. Lectura: los dos más cercanos reparten el
   día siguiente parecido; los más lejanos, opuesto.
3. **Columnas.** `distancias.columnas[0]`: estados y `d`; lectura al revés: vienen de días
   observados parecidos (`PERFILES.columna`).
4. **Fila junto a columna de otro estado.** Se toma la fila más cercana al centro
   (`filaCentro`, por `Math.hypot(coord)` mínimo) y, de las columnas de otro estado, la que
   queda al mismo lado del eje 1 y más cerca; se cita `TABLA.celdas[i][j]` contra
   `ESPERADAS[i][j]`, y se dice que se lee por dirección: comparte lado, pero la pareja
   homónima está más cerca y su celda se aparta más. Si no hay columna de otro estado al mismo
   lado, la frase dice que ninguna lo comparte.
5. **Centro.** `filaCentro`: coordenadas, perfil frente a `TABLA.marginalColumna`, y la frase
   «es la fila que menos se aparta del promedio, y aun así se aparta». La frase antigua sobre
   «las filas y columnas cerca del centro» desaparece.

Todo condicional a los datos; ninguna cifra ni nombre de estado va escrito.

### D3 · Las reglas pasan a cuatro

La lista «Cómo se lee el mapa» gana «Dos columnas cercanas: vienen de días observados
parecidos» y cada regla termina remitiendo a su caso («abajo, X»). Se mantiene el `Pair` con
las reglas a la izquierda y los casos a la derecha; los casos se escriben como `List` de cinco
puntos con negrita en el nombre del caso, para que se lean en la pared.

### D4 · La celda en el mapa

En `mapaCA`, por cada estado se añade a `rotulos` una tercera entrada con el texto
`«${obs} pares · esperados ${esp}»` en `C.ink3`, a la posición del punto de la columna, para
que `apilar()` la coloque bajo las dos líneas de la pareja. La leyenda gana una línea: «bajo
cada pareja: la celda observado X → siguiente X, pares y esperados». `check_figuras.mjs` la
recoge sola.

### D5 · El salto, una escalera de tres peldaños en los dos bloques

La misma sección, con el mismo título y los mismos tres rótulos, en los dos bloques, para que
la clase reconozca en el MCA lo que acaba de ver en el CA:

- **Bloque 1**, nueva sección «De las distancias al mapa» entre «La distancia chi-cuadrado»
  y «Filas y columnas en el mismo plano». Prosa de tres párrafos cortos —la nube, los ejes,
  las coordenadas— y una figura de fórmulas `fSalto()` en `figures/block1.js` con tres
  `seccion`: LA NUBE (r_i, m_i, d² chi-cuadrado, «ya vistos arriba»); LOS EJES («la dirección
  que más inercia conserva, pesando cada punto por su masa: el gesto del PCA de la sesión 6
  sobre esta nube; el segundo, perpendicular; hay min(filas, columnas) − 1»); LAS COORDENADAS
  (f_ik = la proyección del perfil i sobre el eje k; d²(i, i′) ≈ Σ_k (f_ik − f_i′k)², con
  igualdad si se suman todos los ejes). La línea de ejemplo de cada sección interpola
  `CA.salto`: el par `distancias.filas.at(-1)` (el más lejano, que es el que mejor se ve),
  con `d` por perfiles y `dCoord` por coordenadas, y la frase «iguales porque los dos ejes
  retienen el 100 %».
- **Bloque 2**, nueva sección «Parte 1 · De las distancias al mapa» entre «La métrica
  chi-cuadrado» y «Las fórmulas de transición» (antes de la transición, porque la transición
  ya usa las coordenadas). Prosa paralela —la nube son las personas de Z, con masa 1/n y la
  distancia de la sección anterior; los ejes, el mismo gesto sobre esta nube, J − Q de
  ellos; las coordenadas, F— y figura `fSalto()` en `figures/block2.js` con las mismas tres
  secciones y el ejemplo de `MCA.salto`: dos personas, su distancia por Z (fórmula de la
  sección anterior), por los tres ejes (igual) y por los dos del mapa (menor, con
  `acumulado[1]` como el porcentaje retenido). Cierra con una frase que remite al bloque 1:
  «es el mismo salto de la lluvia; cambia la tabla».

Las explicaciones evitan «SVD» y «autovector»: el bloque 1 ya dice «valores propios» y el
curso ya enseñó el PCA como «la dirección en la que la nube más se estira»; el salto se
apoya en eso.

### D6 · Qué publican los scripts para el salto

- `ejemplo_lluvia.py`: `CA.salto = { par: [a, b], dPerfiles, dCoord, ejes: K, retenido: 100 }`
  para el par de filas más lejano; `dPerfiles` y `dCoord` con el aserto de D1.
- `ejemplo_mca_famd.py`: `MCA.salto = { personas: [i, i′], dZ, dTodosLosEjes, dMapa, ejes: K,
  ejesMapa: 2, retenido: acumulado[1] }` para la pareja de individuos más lejana entre sí
  (por `dZ`), con `assert cerca(dZ, dTodosLosEjes)` y `assert dMapa <= dTodosLosEjes`. `dZ`
  se calcula con la fórmula de `fDistancia` (n/Q · Σ (z_ij − z_i′j)²/n_j). Nada más del
  ejemplo cambia; el oráculo de la guía no se toca.

## Risks / Trade-offs

- **Tres líneas por pareja se apilan y tapan un punto vecino.** → Las parejas están lejos
  entre sí (la más cercana a otra dista 0,45 en un plano de ±1,2); `apilar` empuja hacia
  abajo; se mira a 390 px y ampliada.
- **El año se regenera y el «caso 4» no tiene columna al mismo lado.** → La prosa tiene la
  rama alternativa escrita; la tarea la comprueba leyendo el código de la rama.
- **La lectura por dirección se entiende como distancia.** → La frase dice explícitamente que
  la pareja homónima está más cerca y su celda se aparta más, y que lo que se lee es el lado.
- **El salto suena a PCA y la clase cree que es el mismo cálculo.** → Se dice qué cambia:
  la nube (perfiles o personas de Z en vez de variables), el peso (la masa) y la regla (la
  distancia chi-cuadrado); y qué no cambia: buscar la dirección que más inercia conserva.
- **En el MCA la pareja más lejana coincide en varias parejas (los perfiles puros se
  repiten).** → Se toma la primera por índice; la prosa habla de «dos personas» y las nombra.

## Migration Plan

Regenerar `lluvia.js` y `ejemplo.js`, `pnpm build`, `check_figuras.mjs`, bloques 1 y 2 a
390 px. Vuelta atrás: revertir el commit.
