## MODIFIED Requirements

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
