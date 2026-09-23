## ADDED Requirements

### Requirement: Por qué filas y columnas caben en el mismo plano
EL SISTEMA SHALL explicar en el bloque 1, antes del mapa, por qué las filas y las columnas se
dibujan sobre los mismos ejes, en tres pasos: que hay dos nubes —los perfiles de fila en el
espacio de las columnas y los perfiles de columna en el espacio de las filas—, cada una con
sus masas y la distancia chi-cuadrado; que las dos nubes tienen los mismos ejes con la misma
inercia, de modo que analizar una o la otra da los mismos valores propios; y que las
fórmulas de transición ponen cada fila en el baricentro de las columnas y cada columna en el
de las filas, dilatados por el mismo factor, y por eso se superponen. Y enunciar el precio:
entre dos filas y entre dos columnas la distancia del mapa es la chi-cuadrado, entre una fila
y una columna no es una distancia sino una dirección.

#### Scenario: Los tres pasos están escritos y en orden
- **WHEN** alguien lee el bloque 1 bajo «Filas y columnas en el mismo plano», antes del mapa
- **THEN** ve las dos nubes, los ejes compartidos y la transición, en ese orden
- **AND** se enuncia que las dos nubes tienen los mismos valores propios

#### Scenario: La transición se verifica en las dos direcciones
- **WHEN** alguien lee la verificación
- **THEN** ve una fila calculada desde las columnas y una columna calculada desde las filas, cada una coincidiendo con su coordenada publicada
- **AND** las cifras salen del proceso que genera el ejemplo y no están escritas a mano

#### Scenario: El precio está enunciado
- **WHEN** alguien termina de leer por qué caben en el mismo plano
- **THEN** se enuncia que la distancia entre una fila y una columna no es una distancia sino una dirección

### Requirement: Cómo se obtienen los valores propios
EL SISTEMA SHALL explicar en el bloque 1, dentro del paso de los ejes, de dónde salen los
valores propios, en tres pasos: los residuos estandarizados de cada celda —la diferencia
entre lo observado y lo esperado, sobre la raíz de lo esperado, en proporciones—, que son
el chi-cuadrado de la entrada con signo y sobre n; la matriz de residuos cruzados, columnas
contra columnas, cuya traza es χ²/n; y diagonalizarla como el análisis de componentes
principales de la sesión 6 diagonalizó la matriz de correlaciones, de modo que el mayor
valor propio es la inercia de la dirección que más conserva, el siguiente es perpendicular,
y el último vale cero por el centrado; y enunciar que de los vectores salen las coordenadas
de las columnas y, por transición, las de las filas.

#### Scenario: Los tres pasos están escritos y en orden
- **WHEN** alguien lee cómo se obtienen los valores propios
- **THEN** ve los residuos, la matriz y la diagonalización, en ese orden
- **AND** se remite al análisis de componentes principales de la sesión 6 como el mismo gesto

#### Scenario: Los residuos del ejemplo están a la vista
- **WHEN** alguien lee el paso de los residuos
- **THEN** ve la fórmula del residuo estandarizado
- **AND** ve la tabla de residuos del ejemplo, con signo, y que sus cuadrados suman χ²/n

#### Scenario: La traza es la inercia
- **WHEN** alguien lee el paso de la matriz
- **THEN** ve que la traza de la matriz de residuos cruzados es χ²/n con las cifras del ejemplo
- **AND** ve que los valores propios la suman

#### Scenario: El valor propio nulo se explica
- **WHEN** alguien lee la diagonalización
- **THEN** ve todos los valores propios del ejemplo, incluido el que vale cero
- **AND** se enuncia que vale cero por el centrado, y que por eso hay un eje menos que columnas

#### Scenario: Las cifras se generan y se comprueban
- **WHEN** se comparan los residuos, la matriz, la traza y los valores propios citados con los publicados
- **THEN** coinciden y ninguno está escrito a mano
- **AND** el proceso que los genera falla si los valores propios no suman la traza

## MODIFIED Requirements

### Requirement: Las fórmulas se ven escritas en la pared
EL SISTEMA SHALL mostrar las fórmulas del bloque de forma legible proyectadas, sin pedir nada a
un servidor externo para dibujarlas, y sin código ni nombres de lenguajes de programación;
compuestas de modo que ningún subíndice ni superíndice se monte sobre el símbolo que le
sigue, que toda raíz cuadrada lleve su barra encima de todo el radicando y a su altura, y
que cada letra griega se lea como la letra que es.

#### Scenario: Las fórmulas no dependen de la red ni de un lenguaje
- **WHEN** alguien abre el bloque 1 sin conexión, con la página ya cargada
- **THEN** todas las fórmulas se ven
- **AND** no hay código ni nombres de lenguajes en pantalla

#### Scenario: Un índice no pisa lo que sigue
- **WHEN** una fórmula del bloque 1 lleva un subíndice o un superíndice de más de una letra
- **THEN** el símbolo que sigue empieza después del índice, sin tocarlo

#### Scenario: La raíz cubre su radicando
- **WHEN** una fórmula del bloque 1 lleva una raíz cuadrada
- **THEN** la barra de la raíz cubre todo el radicando
- **AND** el signo de la raíz tiene la altura del radicando

#### Scenario: La ji es una ji
- **WHEN** una fórmula del bloque 1 escribe χ
- **THEN** se lee como la letra griega y no como una equis

### Requirement: De las distancias al mapa
EL SISTEMA SHALL explicar, entre la distancia chi-cuadrado y el mapa, cómo se pasa de una a
otro en tres pasos: que cada perfil es un punto con una masa medido con esa distancia; que
los ejes son las direcciones que más inercia conservan, lo mismo que hizo el análisis de
componentes principales de la sesión 6 con la nube de personas, ahora pesando cada punto por
su masa y midiendo con chi-cuadrado, con tantos ejes como la tabla admite; y que las
coordenadas son las proyecciones sobre esos ejes, de modo que la distancia entre dos puntos
del mismo tipo en el mapa aproxima su distancia chi-cuadrado y con todos los ejes es exacta.

#### Scenario: Los tres pasos están escritos y en orden
- **WHEN** alguien lee el bloque 1 entre la distancia chi-cuadrado y el mapa
- **THEN** ve los tres pasos —la nube, los ejes, las coordenadas— en ese orden
- **AND** se remite al análisis de componentes principales de la sesión 6 como el mismo gesto
- **AND** se enuncia que la distancia en el mapa aproxima la chi-cuadrado y es exacta con todos los ejes

#### Scenario: El salto se verifica sobre un par de filas
- **WHEN** alguien lee la verificación del salto
- **THEN** ve dos estados observados con su distancia calculada desde los perfiles y desde las coordenadas
- **AND** las dos coinciden
- **AND** se dice por qué coinciden exactamente en este ejemplo: el plano retiene toda la inercia

#### Scenario: Las cifras del salto se generan
- **WHEN** se comparan las distancias citadas en el salto con las publicadas
- **THEN** coinciden y ninguna está escrita a mano

#### Scenario: La notación se define donde se usa
- **WHEN** alguien lee el paso de las coordenadas
- **THEN** ve escrito que f_ik es la coordenada de la fila i en el eje k y g_jk la de la columna j
- **AND** lo ve antes de la fórmula que las usa
