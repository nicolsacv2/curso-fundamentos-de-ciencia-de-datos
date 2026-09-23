# sesion-07-correspondencias-simples Specification

## Purpose

Cubre el bloque 1 de la sesión 7: el análisis de correspondencias simples de la tabla de
contingencia de la entrada —el ejemplo inventado del cielo del día observado contra el del día
siguiente; del perfil a la nube, de la nube al plano—, con la distancia
chi-cuadrado, la inercia como χ²/n, las coordenadas de filas y columnas, las fórmulas de
transición, la contribución y el cos², y su papel de puente hacia el análisis de
correspondencias múltiples.

## Requirements

### Requirement: El bloque parte de la tabla que la entrada acaba de leer
EL SISTEMA SHALL abrir el bloque 1 con la misma tabla de contingencia de la entrada y enunciar
que el análisis de correspondencias simples es la manera de dibujarla: cada fila y cada
columna como un punto en un plano.

#### Scenario: La misma tabla, ahora como dibujo
- **WHEN** alguien abre el bloque 1 de la sesión 7
- **THEN** ve la misma tabla de contingencia de la entrada
- **AND** se enuncia que el bloque la convierte en un plano con un punto por fila y por columna

### Requirement: Los perfiles son la nube
EL SISTEMA SHALL enunciar que cada perfil de fila es un punto con tantas coordenadas como
columnas, que el perfil promedio es el centroide, y que las masas de las filas son sus
marginales sobre el total.

#### Scenario: Perfil, centroide y masa
- **WHEN** alguien lee cómo se construye la nube
- **THEN** ve que cada perfil de fila es un punto
- **AND** ve el perfil promedio como centroide, con sus cifras
- **AND** ve la masa de cada fila, que es su marginal sobre el total

### Requirement: La distancia chi-cuadrado entre perfiles
EL SISTEMA SHALL mostrar la distancia chi-cuadrado entre dos perfiles —cada diferencia al
cuadrado dividida por el perfil promedio de esa columna— calculada sobre dos filas de la tabla
del ejemplo, definir en la misma figura el símbolo de ese perfil promedio, c_j, como el margen
de la columna sobre el total, y enunciar que las columnas raras pesan más.

#### Scenario: Dos filas, una distancia
- **WHEN** alguien lee la distancia chi-cuadrado
- **THEN** ve la fórmula
- **AND** ve escrito qué es c_j —el margen de la columna sobre n— y su valor en el ejemplo
- **AND** ve su valor entre dos estados del día observado concretos de la tabla del ejemplo
- **AND** se enuncia que las diferencias en columnas poco frecuentes pesan más

### Requirement: La inercia total es el chi-cuadrado sobre n
EL SISTEMA SHALL enunciar que la inercia total de la nube es el estadístico chi-cuadrado de la
entrada dividido por el número de días, mostrarlo con las cifras del ejemplo, y que se
reparte en tantos ejes como el menor de filas o columnas menos uno.

#### Scenario: La inercia cuadra con el chi-cuadrado
- **WHEN** alguien lee la inercia total
- **THEN** ve χ²/n calculado con las cifras de la entrada
- **AND** ve que los valores propios la suman
- **AND** ve cuántos ejes hay y por qué

### Requirement: Filas y columnas en el mismo plano
EL SISTEMA SHALL dibujar el plano de los dos primeros ejes con los niveles de las dos
variables como puntos, distinguidos por su marca según la variable, con cada eje rotulado con
su número y su porcentaje de inercia, y con las coordenadas salidas de los datos generados.

#### Scenario: Un punto por nivel, dos marcas
- **WHEN** alguien mira el mapa del bloque 1
- **THEN** cada nivel de las dos variables está en el plano
- **AND** los niveles de una variable se distinguen de los de la otra por su marca
- **AND** cada eje lleva escrito su número y su porcentaje

#### Scenario: Las posiciones salen de los datos generados
- **WHEN** se comparan las posiciones dibujadas con las coordenadas publicadas
- **THEN** coinciden

### Requirement: Las fórmulas de transición
EL SISTEMA SHALL mostrar que la coordenada de una fila es el promedio ponderado de las
coordenadas de las columnas según su perfil, dilatado por 1/√λ, y viceversa, definir en la
misma figura el perfil de columna c_ji que la segunda dirección usa, y verificarlo sobre un
estado del día observado de la tabla del ejemplo con sus cifras.

#### Scenario: La transición se verifica sobre una fila
- **WHEN** alguien lee las fórmulas de transición
- **THEN** ve la fórmula en las dos direcciones
- **AND** ve escrito qué es c_ji, el perfil de columna, y en qué se distingue de c_j
- **AND** ve el promedio ponderado de una fila concreta, dilatado, coincidiendo con su coordenada publicada

### Requirement: Contribución y coseno cuadrado
EL SISTEMA SHALL definir la contribución de un punto a un eje y su coseno cuadrado, mostrar las
dos para las filas y las columnas en el eje 1, y nombrar el eje solo con los puntos que
superan el aporte promedio.

#### Scenario: El eje 1 se nombra con lo que lo construyó
- **WHEN** alguien mira la tabla de contribuciones del bloque 1
- **THEN** ve la contribución y el cos² de cada fila y cada columna en el eje 1
- **AND** ve el aporte promedio
- **AND** el eje se nombra únicamente con los puntos que lo superan

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

### Requirement: El puente al MCA
EL SISTEMA SHALL cerrar el bloque enunciando que el análisis de correspondencias múltiples del
bloque siguiente es este mismo análisis aplicado a la tabla indicadora de varias variables a la
vez, y que todo lo visto —perfiles, distancia chi-cuadrado, inercia, transición, contribución,
cos²— se conserva.

#### Scenario: Una frase que anuncia el bloque 2
- **WHEN** alguien llega al final del bloque 1
- **THEN** se enuncia que el MCA es el mismo análisis sobre la tabla indicadora
- **AND** se enumeran las piezas que se conservan

### Requirement: Las cifras del análisis se generan y se comprueban
EL SISTEMA SHALL producir los valores propios, las coordenadas, las contribuciones y los cos²
con el mismo proceso repetible que produce la tabla de la entrada, comprobar antes de
publicar que Σλ = χ²/n, que la fórmula de transición se cumple para todas las filas y
columnas y que las contribuciones suman uno por eje, y no escribir ninguna a mano.

#### Scenario: Una identidad rota detiene la publicación
- **WHEN** Σλ no coincide con χ²/n, la transición falla o las contribuciones no suman uno
- **THEN** el proceso falla y no publica

#### Scenario: Nada se calcula en el navegador
- **WHEN** alguien abre el bloque 1
- **THEN** los resultados ya están calculados

### Requirement: Las fórmulas se ven escritas en la pared
EL SISTEMA SHALL mostrar las fórmulas del bloque de forma legible proyectadas, sin pedir nada a
un servidor externo para dibujarlas, y sin código ni nombres de lenguajes de programación.

#### Scenario: Las fórmulas no dependen de la red ni de un lenguaje
- **WHEN** alguien abre el bloque 1 sin conexión, con la página ya cargada
- **THEN** todas las fórmulas se ven
- **AND** no hay código ni nombres de lenguajes en pantalla

### Requirement: El mapa y la prosa nombran el día observado y el día siguiente
EL SISTEMA SHALL nombrar en el bloque 1 las filas como estados del día observado y las
columnas como estados del día siguiente —en la tabla, en los rótulos del mapa, en las tablas
de contribuciones y en la prosa—, y no como «hoy» y «mañana».

#### Scenario: Ni hoy ni mañana en el bloque 1
- **WHEN** alguien recorre el bloque 1 de la sesión 7
- **THEN** cada fila se nombra como estado del día observado y cada columna como estado del día siguiente
- **AND** ningún rótulo ni frase llama «hoy» o «mañana» a las variables de la tabla

### Requirement: La prosa del bloque 1 sigue a las cifras del recuento
EL SISTEMA SHALL sostener toda afirmación del bloque 1 sobre el resultado —qué puntos nombran
el eje 1, cuánto retiene, qué fila y qué columna están más lejos del centro, si la tabla es
casi una línea— sobre las cifras publicadas del análisis de la tabla contada, no sobre una
afirmación escrita para la tabla anterior.

#### Scenario: Regenerar arrastra la prosa
- **WHEN** se regenera el año y cambia una cifra del análisis
- **THEN** las cifras en pantalla cambian con él
- **AND** ninguna afirmación del bloque queda contradicha por las cifras publicadas

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
