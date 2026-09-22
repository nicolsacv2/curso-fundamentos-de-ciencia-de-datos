# sesion-07-correspondencias-simples Specification

## Purpose

Cubre el bloque 1 de la sesión 7: el análisis de correspondencias simples de la tabla de
contingencia de la entrada —el ejemplo inventado del cielo de hoy contra el cielo de mañana;
del perfil a la nube, de la nube al plano—, con la distancia
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
- **AND** ve su valor entre dos estados de hoy concretos de la tabla del ejemplo
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
estado de hoy de la tabla del ejemplo con sus cifras.

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
perfiles parecidos; la distancia entre una fila y una columna se lee por la relación
baricéntrica y no como una distancia euclídea— y aplicarlas a la tabla del ejemplo.

#### Scenario: Las reglas están escritas y aplicadas
- **WHEN** alguien lee la interpretación del mapa
- **THEN** ve las reglas de lectura
- **AND** ve al menos una lectura sobre los estados del cielo que remite a una celda de la tabla observada contra la esperada

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
