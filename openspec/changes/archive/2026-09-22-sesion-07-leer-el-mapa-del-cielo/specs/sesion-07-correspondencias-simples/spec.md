## ADDED Requirements

### Requirement: Las distancias entre perfiles se publican y se comprueban
EL SISTEMA SHALL publicar la distancia chi-cuadrado entre cada par de filas y entre cada
par de columnas de la tabla del ejemplo, producidas por el mismo proceso repetible que
produce el análisis, y comprobar antes de publicar que cada una coincide con la distancia
euclídea entre las coordenadas principales de los dos puntos sobre todos los ejes.

#### Scenario: Todos los pares están
- **WHEN** alguien toma las distancias publicadas
- **THEN** encuentra una por cada par de filas y una por cada par de columnas
- **AND** cada una lleva los dos estados que separa

#### Scenario: Cerca en el mapa significa perfiles parecidos
- **WHEN** una distancia publicada no coincide con la distancia entre las coordenadas de sus dos puntos
- **THEN** el proceso falla y no publica

### Requirement: El mapa muestra la celda de cada pareja homónima
EL SISTEMA SHALL mostrar en el mapa, junto a los rótulos de cada pareja formada por un
estado como día observado y el mismo estado como día siguiente, la celda de la diagonal
que esa pareja dibuja: los pares observados y los esperados bajo independencia, con una
leyenda que diga qué es esa línea.

#### Scenario: Tres celdas en el mapa
- **WHEN** alguien mira el mapa del bloque 1
- **THEN** cada pareja «observado X» / «siguiente X» lleva junto a sus rótulos los pares observados y los esperados de su celda
- **AND** hay dónde aprender qué significa esa línea

#### Scenario: Las cifras salen de la tabla
- **WHEN** se comparan las cifras rotuladas con la tabla observada y la esperada
- **THEN** coinciden

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

## MODIFIED Requirements

### Requirement: La lectura del mapa
EL SISTEMA SHALL enunciar las reglas de lectura del mapa —una fila cerca de una columna
significa que esa fila tiene esa columna más de lo esperado; dos filas cercanas tienen
perfiles parecidos y reparten el día siguiente de forma parecida; dos columnas cercanas
vienen de días observados parecidos; la distancia entre una fila y una columna se lee por la
relación baricéntrica y no como una distancia euclídea— y aplicar cada regla a un caso
concreto del mapa del ejemplo, elegido desde los datos y con sus cifras:

- cada estado con su homónimo: las tres parejas «observado X» / «siguiente X», con la celda
  de la diagonal observada contra esperada;
- el par de filas más cercano y el par más lejano, con su distancia chi-cuadrado y sus
  perfiles;
- el par de columnas más cercano, con su distancia;
- una fila junto a la columna de otro estado, leída por dirección, con su celda observada
  contra esperada;
- el punto más cercano al centro, con su perfil frente al margen.

#### Scenario: Las reglas están escritas y aplicadas
- **WHEN** alguien lee la interpretación del mapa
- **THEN** ve las cuatro reglas de lectura
- **AND** cada regla remite a un caso concreto del mapa con sus cifras

#### Scenario: Cada fila con su columna
- **WHEN** alguien lee el caso de las parejas homónimas
- **THEN** ve las tres parejas
- **AND** para cada una ve los pares observados y los esperados de su celda de la diagonal

#### Scenario: Filas con filas
- **WHEN** alguien lee el caso de las filas
- **THEN** ve qué dos estados observados están más cerca y qué dos más lejos
- **AND** ve la distancia chi-cuadrado y los perfiles de cada par
- **AND** los dos pares son los que las distancias publicadas señalan

#### Scenario: Una fila junto a la columna de otro estado
- **WHEN** alguien lee ese caso
- **THEN** se dice que se lee por dirección y no con regla
- **AND** ve la celda observada contra la esperada de esa fila y esa columna

#### Scenario: El punto más cercano al centro
- **WHEN** alguien lee ese caso
- **THEN** ve cuál es el punto más cercano al centro
- **AND** ve su perfil junto al margen
- **AND** no se afirma que haya puntos «cerca del centro» si ninguno lo está

#### Scenario: Los casos siguen a los datos
- **WHEN** se regenera el año y cambia qué par es el más cercano o qué punto está más cerca del centro
- **THEN** los casos que la prosa cita cambian con él
