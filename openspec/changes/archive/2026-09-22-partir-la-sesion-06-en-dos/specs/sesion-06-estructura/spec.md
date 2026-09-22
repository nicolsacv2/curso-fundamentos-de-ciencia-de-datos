## ADDED Requirements

### Requirement: Cinco bloques rotulados
EL SISTEMA SHALL dividir la sesión 6 en cinco bloques rotulados entrada, bloque 1, bloque 2,
bloque 3 y cierre, con las mismas etiquetas que las sesiones 1 a 5.

#### Scenario: Los cinco bloques están
- **WHEN** alguien abre la sesión 6
- **THEN** ve cinco bloques rotulados entrada, bloque 1, bloque 2, bloque 3 y cierre

### Requirement: El índice refleja los cinco bloques
EL SISTEMA SHALL mostrar en el índice del curso, para la sesión 6, las fichas de sus cinco
bloques con sus franjas.

#### Scenario: Cinco fichas en el índice
- **WHEN** alguien mira la sesión 6 en el índice del curso
- **THEN** ve cinco fichas de bloque con sus franjas

### Requirement: La cadena de limpieza se reparte en los cinco bloques, en su orden
EL SISTEMA SHALL repartir en los cinco bloques de la sesión 6 el contenido que antes era su
entrada, sin quitarle nada y en este orden: la tabla como llegó y el texto estandarizado en
la entrada; las medidas, los diagramas de caja, las escalas ordinales y la columna que se
descarta en el bloque 1; el relleno, las marcas de celda inventada, la segunda descripción y
la tabla limpia en el bloque 2; la exploración por pares y el análisis de componentes
principales en el bloque 3; y la pregunta «¿qué falta?» en el cierre.

#### Scenario: Cada paso de la cadena está en su bloque
- **WHEN** alguien recorre los cinco bloques de la sesión 6 en orden
- **THEN** ve la cadena de limpieza entera, en el mismo orden en que antes la recorría la entrada
- **AND** ningún paso de la cadena falta ni se repite

#### Scenario: La sesión 6 no enseña correspondencias
- **WHEN** alguien recorre la sesión 6
- **THEN** no encuentra el análisis de correspondencias múltiples ni el análisis factorial de datos mixtos

### Requirement: El cierre pide un ticket de salida y anuncia la sesión 7
EL SISTEMA SHALL cerrar la sesión 6 con un ticket de salida que pida a cada persona nombrar
una columna de la tabla que quedó fuera del análisis y el motivo por el que quedó fuera, con
ejemplos de respuestas que sirven y que no, y anunciar la sesión siguiente con el título y el
objetivo que ella declara.

#### Scenario: El ticket tiene consigna y ejemplos
- **WHEN** alguien llega al cierre de la sesión 6
- **THEN** ve la consigna
- **AND** ve respuestas que sirven y respuestas que no, con por qué

#### Scenario: El puente coincide con lo que la sesión 7 declara
- **WHEN** alguien lee lo que queda al final de la sesión 6
- **THEN** el título y el objetivo que se anuncian de la sesión 7 son los que la sesión 7 declara

## MODIFIED Requirements

### Requirement: Las rutas conservan el esquema del curso
EL SISTEMA SHALL direccionar cada bloque de la sesión 6 con los mismos identificadores de
bloque que las sesiones anteriores.

#### Scenario: Una ruta de bloque se puede compartir
- **WHEN** alguien abre la dirección de un bloque concreto de la sesión 6
- **THEN** se abre ese bloque y no otro
- **AND** el identificador del bloque es uno de entrada, bloque-1, bloque-2, bloque-3 o cierre

#### Scenario: Una dirección antigua al bloque 3 no rompe nada
- **WHEN** alguien abre la dirección del bloque 3 de la sesión 6
- **THEN** se abre el bloque 3 de la sesión 6
- **AND** no se produce ningún error

### Requirement: Cada bloque declara su franja de minutos
EL SISTEMA SHALL indicar para cada uno de los cinco bloques la franja de minutos que le
corresponde dentro de las tres horas.

#### Scenario: Las franjas están escritas
- **WHEN** alguien recorre los bloques de la sesión 6
- **THEN** cada bloque indica su franja de minutos

### Requirement: Las franjas caben en tres horas y no se solapan
EL SISTEMA SHALL declarar franjas que no se solapen entre sí y que no excedan los ciento
ochenta minutos.

#### Scenario: Las franjas son consistentes
- **WHEN** se leen las franjas de los cinco bloques de la sesión 6
- **THEN** ninguna se solapa con otra
- **AND** ninguna termina después del minuto ciento ochenta

## REMOVED Requirements

### Requirement: Cuatro bloques rotulados
**Reason**: La sesión 6 vuelve a cinco bloques: la cadena de limpieza que era su entrada se
reparte en entrada, tres bloques y cierre, y el MCA, el FAMD y el salón entero pasan a la
sesión 7.
**Migration**: «Cinco bloques rotulados» y «La cadena de limpieza se reparte en los cinco
bloques, en su orden».

### Requirement: El índice refleja los cuatro bloques
**Reason**: Son cinco.
**Migration**: «El índice refleja los cinco bloques».

### Requirement: La entrada ocupa más de lo habitual
**Reason**: La entrada ya no carga la cadena entera; la cadena ocupa la sesión. La entrada
de la sesión 6 vuelve a una franja como la de las demás.
**Migration**: Ninguna: «Las franjas caben en tres horas y no se solapan» sigue rigiendo.
