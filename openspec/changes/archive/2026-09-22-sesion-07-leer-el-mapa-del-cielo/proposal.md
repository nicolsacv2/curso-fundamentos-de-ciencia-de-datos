## Why

El bloque 1 de la sesión 7 enuncia tres reglas para leer el mapa del análisis de
correspondencias —una fila cerca de una columna, dos filas cercanas, y que la distancia
fila–columna no se mide con regla— y después, en «Aplicado al cielo», solo aplica la primera:
señala la fila más lejos del centro, la columna que va con ella y su celda. Las otras dos
reglas quedan enunciadas y sin caso. La clase ve un mapa con seis puntos en tres parejas
evidentes y el texto no le dice qué significa cada pareja, ni por qué «observado nublado» y
«observado lluvia» están cerca entre sí y lejos de «observado sol», ni qué se lee cuando una
fila queda al lado de la columna de otro estado. Y la frase sobre «las filas y columnas cerca
del centro» habla de puntos que en este mapa no existen: ninguno está cerca del centro.

Hay además un salto sin explicar, y está en los dos análisis de correspondencias. El bloque 1
enseña la distancia chi-cuadrado entre perfiles y la inercia, y a continuación muestra el
mapa; el bloque 2 enseña la distancia chi-cuadrado entre personas y a continuación muestra el
suyo. En ninguno de los dos se dice **cómo se pasa de las distancias al mapa**: que los ejes
son las direcciones que más inercia conservan —lo mismo que hizo el PCA de la sesión 6 con la
nube de personas—, que las coordenadas son las proyecciones sobre esos ejes, y que por eso la
distancia entre dos puntos del mapa aproxima su distancia chi-cuadrado, y es exacta cuando se
conservan todos los ejes. Sin ese salto, «cerca en el mapa» es una convención y no una
consecuencia.

## What Changes

- **«Aplicado al cielo» pasa a leer el mapa pareja por pareja, con las cifras de cada caso.**
  - *Cada fila con su propia columna*: las tres parejas «observado X» / «siguiente X» están
    juntas y al mismo lado; para cada una se cita la celda de la diagonal, observada contra
    esperada. Es el cielo que se repite, dibujado tres veces.
  - *Filas con filas*: el par de filas más cercano y el más lejano, con la distancia
    chi-cuadrado entre sus perfiles y los perfiles mismos, y lo que significa: dos días
    observados que reparten el día siguiente de forma parecida, o de forma opuesta.
  - *Columnas con columnas*: lo mismo leído al revés, con el par de columnas más cercano:
    dos días siguientes que vienen de días observados parecidos.
  - *Una fila junto a la columna de otro estado*: el caso que la tercera regla pide, leído
    por dirección y no con regla, con su celda observada contra esperada.
  - *El punto más cercano al centro*: cuál es, su perfil frente al margen, y que aun así se
    aparta; desaparece la frase sobre puntos «cerca del centro» que este mapa no tiene.
  - Todos los casos se eligen desde los datos —el par más cercano, el más lejano, el punto
    más cercano al centro— y las cifras se interpolan. Si el año cambia, cambian los casos.
- **El mapa muestra la celda de cada pareja homónima.** Debajo de los rótulos de cada pareja
  «observado X / siguiente X» aparece una tercera línea con la celda observada y la esperada,
  y la leyenda dice qué es. Los casos de la prosa se ven en la figura.
- **Los dos análisis explican el salto de las distancias al mapa**, con la misma escalera
  de tres peldaños y el ejemplo de cada uno:
  1. *La nube*: cada perfil —una fila de la tabla en el bloque 1, una persona de la tabla
     disyuntiva en el bloque 2— es un punto con una masa, y se mide con la distancia
     chi-cuadrado que se acaba de ver.
  2. *Los ejes*: se buscan las direcciones que más inercia conservan, exactamente lo que
     hizo el PCA de la sesión 6 con la nube de personas, ahora pesando cada punto por su
     masa y midiendo con chi-cuadrado; el primer eje es la de mayor inercia, el segundo la
     siguiente y perpendicular, y hay tantos como la tabla admite.
  3. *Las coordenadas*: la proyección de cada punto sobre cada eje. Por eso la distancia
     entre dos puntos del mismo tipo en el mapa aproxima su distancia chi-cuadrado, y con
     todos los ejes es exacta.
  Cada bloque lo verifica con una pareja de su ejemplo: en el bloque 1, dos estados
  observados con su distancia por perfiles y por coordenadas, idénticas porque el plano
  retiene el 100 %; en el bloque 2, dos personas con su distancia por la tabla disyuntiva,
  por las coordenadas sobre todos los ejes —idéntica— y por las dos del mapa —aproximada,
  con el porcentaje que el plano retiene—. Las cifras las publican y comprueban los scripts.
- **Las distancias entre perfiles se publican y se comprueban.** El script de la lluvia
  emite la distancia chi-cuadrado entre cada par de filas y entre cada par de columnas, y
  comprueba antes de escribir que cada una coincide con la distancia euclídea entre sus
  coordenadas principales sobre todos los ejes. El script del ejemplo de ocho personas emite
  la pareja de individuos con sus tres distancias y comprueba la identidad. La prosa lee esas
  distancias; no las calcula.
- Las tres reglas de lectura del bloque 1 ganan una cuarta, la de columnas con columnas, y
  cada regla remite a su caso.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `sesion-07-correspondencias-simples`: la lectura del mapa se aplica a casos concretos de
  las cuatro clases de cercanía —fila–columna homónima, fila–fila, columna–columna,
  fila–columna de estados distintos— y al punto más cercano al centro, elegidos desde los
  datos y con sus cifras; el mapa muestra la celda de cada pareja homónima; el bloque
  explica el salto de las distancias al mapa y lo verifica con un par de filas; las
  distancias chi-cuadrado entre todos los pares de perfiles se publican y se verifican.
- `sesion-06-mca`: el bloque 2 de la sesión 7 explica el mismo salto de las distancias al
  mapa sobre la tabla disyuntiva y lo verifica con un par de personas, con la distancia por
  la tabla, por todos los ejes y por los dos del mapa.

## Impact

- **Scripts**: `scripts/ejemplo_lluvia.py` publica `CA.distancias` y `CA.salto`;
  `scripts/ejemplo_mca_famd.py` publica `MCA.salto`; `src/sessions/s07/data/lluvia.js` y
  `src/sessions/s07/data/ejemplo.js` regenerados.
- **Código que cambia**: `src/sessions/s07/blocks/Block1.jsx` (las reglas, «Aplicado al
  cielo», la sección del salto); `src/sessions/s07/blocks/Block2.jsx` (la sección del salto);
  `src/sessions/s07/figures/block1.js` (la tercera línea de rótulo por pareja, la leyenda,
  la figura del salto); `src/sessions/s07/figures/block2.js` (la figura del salto).
- **Sin cambios**: la entrada, el bloque 3, el cierre, `check_figuras.mjs`, las
  dependencias, la arquitectura.
