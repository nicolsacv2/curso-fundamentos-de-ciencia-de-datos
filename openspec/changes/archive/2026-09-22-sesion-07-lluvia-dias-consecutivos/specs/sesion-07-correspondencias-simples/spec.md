## ADDED Requirements

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
- **AND** ve su valor entre dos estados del día observado concretos de la tabla del ejemplo
- **AND** se enuncia que las diferencias en columnas poco frecuentes pesan más

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
