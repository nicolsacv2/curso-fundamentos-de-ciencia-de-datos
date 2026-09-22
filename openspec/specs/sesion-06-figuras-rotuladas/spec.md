# sesion-06-figuras-rotuladas Specification

## Purpose

Fija qué tiene que decir cada figura de las sesiones 6 y 7 sobre sus propios ejes: qué
magnitud mide cada uno, en qué unidad, y con qué escala. Una figura que se proyecta en la
pared sin decir qué mide obliga a la clase a adivinarlo, y una que dibuja dos escalas
distintas como si fueran una hace que lo adivinen mal.

## Requirements

### Requirement: Cada eje dice qué mide
EL SISTEMA SHALL rotular, en cada figura de las sesiones 6 y 7 que tenga ejes —en la
entrada, en los bloques y en el cierre de cada una—, qué magnitud representa cada uno.

#### Scenario: Ningún eje queda mudo
- **WHEN** alguien mira una figura de cualquier bloque de las sesiones 6 o 7 que tiene ejes
- **THEN** cada eje lleva escrito qué magnitud representa

#### Scenario: Un eje factorial dice su número y su porcentaje
- **WHEN** una figura de las sesiones 6 o 7 dibuja un eje de un análisis factorial
- **THEN** ese eje lleva escrito su número y el porcentaje de inercia que retiene

#### Scenario: Una figura sin ejes declara su unidad de todos modos
- **WHEN** una figura de las sesiones 6 o 7 no tiene ejes pero muestra recuentos o magnitudes
- **THEN** lleva escrito de qué son esos recuentos o esas magnitudes

### Requirement: Cada eje dice en qué unidad
EL SISTEMA SHALL declarar la unidad de cada eje rotulado, cuando la magnitud que mide tenga
una.

#### Scenario: La unidad no hay que deducirla del nombre de la variable
- **WHEN** un eje mide una magnitud que tiene unidad
- **THEN** la unidad está escrita en la figura
- **AND** no hay que deducirla del nombre de la variable

### Requirement: Un eje que representa a las personas lo dice
SI un eje reparte el total de la clase entre categorías, ENTONCES EL SISTEMA SHALL escribir
que lo que reparte son las personas que respondieron, y cuántas son.

#### Scenario: El total está escrito
- **WHEN** alguien mira una figura cuyas barras reparten el total de la clase
- **THEN** está escrito que lo repartido son las personas que respondieron
- **AND** está escrito cuántas son

### Requirement: Dos escalas distintas no se dibujan como una
EL SISTEMA SHALL no dibujar en un mismo sistema de ejes dos series medidas en escalas
distintas sin declarar cada escala.

#### Scenario: Cada serie se puede leer contra su escala
- **WHEN** una figura dibuja dos series que no comparten escala
- **THEN** cada serie tiene una escala rotulada contra la que se lee
- **AND** ninguna de las dos se lee contra la escala de la otra

#### Scenario: Compartir eje se comprueba, no se afirma
- **WHEN** una figura o su código afirman que dos series comparten eje
- **THEN** las dos series se dibujan efectivamente contra la misma escala

### Requirement: Cada figura declara la unidad de sus filas
SI una figura dibuja una fila por variable y cada fila está en las unidades de su propia
variable, ENTONCES EL SISTEMA SHALL escribir la unidad de cada fila.

#### Scenario: Las filas no se leen como si compartieran escala
- **WHEN** alguien mira una figura con una fila por variable en sus propias unidades
- **THEN** cada fila lleva escrita su unidad
- **AND** está escrito que las filas no comparten escala

### Requirement: Los rótulos no rompen la figura en una pantalla estrecha
EL SISTEMA SHALL mantener las figuras de todos los bloques de las sesiones 6 y 7 dentro del
ancho de la ventana y sin recortar sus rótulos.

#### Scenario: A 390 px se ve entera y rotulada
- **WHEN** alguien abre cualquier bloque de las sesiones 6 o 7 en una ventana de 390 px de ancho
- **THEN** las figuras se ajustan al ancho
- **AND** la página no se desplaza horizontalmente
- **AND** ningún rótulo de eje queda cortado

#### Scenario: Ampliar funciona en cada bloque
- **WHEN** alguien activa «Ampliar» en una figura de cualquier bloque de las sesiones 6 o 7
- **THEN** se abre el diálogo de ampliación
- **AND** Esc lo cierra
- **AND** el foco vuelve al botón que lo abrió

### Requirement: Ningún texto de una figura queda cortado por su propio marco
EL SISTEMA SHALL mostrar entero todo el texto que una figura dibuje, sin que el marco de la
figura lo recorte por ningún lado.

#### Scenario: Una línea larga no se pierde por el borde
- **WHEN** una figura dibuja una línea de texto
- **THEN** se lee entera
- **AND** no queda cortada por el borde de la figura

### Requirement: Un rótulo queda pegado a lo que nombra
SI un rótulo nombra el valor de un punto concreto de una figura, ENTONCES EL SISTEMA SHALL
colocarlo de modo que no se pueda confundir con otro punto.

#### Scenario: El rótulo no se lee sobre el punto vecino
- **WHEN** alguien mira un rótulo que da la cifra de un punto
- **THEN** el punto al que se refiere es el más cercano al rótulo
- **AND** el texto del rótulo no se extiende sobre otros puntos de la misma serie

### Requirement: Los índices de una fórmula no pisan su letra
EL SISTEMA SHALL colocar cada subíndice y superíndice de las fórmulas dibujadas en las figuras
de las sesiones 6 y 7 a la derecha del borde de la letra que acompaña, sea esa letra ancha o
estrecha, y colocar la fracción o el símbolo que sigue después del índice, sin encimarse.

#### Scenario: Un subíndice tras una letra ancha
- **WHEN** una fórmula lleva un subíndice o superíndice tras una letra ancha como la m
- **THEN** el índice empieza después del borde derecho de la letra
- **AND** la fracción o el símbolo siguiente no se le encima

#### Scenario: Las fracciones siguen alineadas
- **WHEN** una fórmula coloca una fracción midiendo el texto que la precede
- **THEN** la fracción cae después de ese texto, con el mismo avance por glifo con que se dibujó
