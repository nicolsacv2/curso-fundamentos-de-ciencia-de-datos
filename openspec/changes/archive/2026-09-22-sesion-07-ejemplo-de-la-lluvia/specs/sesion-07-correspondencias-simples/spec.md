## MODIFIED Requirements

### Requirement: La distancia chi-cuadrado entre perfiles
EL SISTEMA SHALL mostrar la distancia chi-cuadrado entre dos perfiles —cada diferencia al
cuadrado dividida por el perfil promedio de esa columna— calculada sobre dos filas de la tabla
del ejemplo, y enunciar que las columnas raras pesan más.

#### Scenario: Dos filas, una distancia
- **WHEN** alguien lee la distancia chi-cuadrado
- **THEN** ve la fórmula
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

### Requirement: Las fórmulas de transición
EL SISTEMA SHALL mostrar que la coordenada de una fila es el promedio ponderado de las
coordenadas de las columnas según su perfil, dilatado por 1/√λ, y viceversa, y verificarlo
sobre un estado de hoy de la tabla del ejemplo con sus cifras.

#### Scenario: La transición se verifica sobre una fila
- **WHEN** alguien lee las fórmulas de transición
- **THEN** ve la fórmula en las dos direcciones
- **AND** ve el promedio ponderado de una fila concreta, dilatado, coincidiendo con su coordenada publicada

### Requirement: La lectura del mapa
EL SISTEMA SHALL enunciar las reglas de lectura del mapa —una fila cerca de una columna
significa que esa fila tiene esa columna más de lo esperado; dos filas cercanas tienen
perfiles parecidos; la distancia entre una fila y una columna se lee por la relación
baricéntrica y no como una distancia euclídea— y aplicarlas a la tabla del ejemplo.

#### Scenario: Las reglas están escritas y aplicadas
- **WHEN** alguien lee la interpretación del mapa
- **THEN** ve las reglas de lectura
- **AND** ve al menos una lectura sobre los estados del cielo que remite a una celda de la tabla observada contra la esperada
