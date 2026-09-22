## Purpose

Cubre la existencia de la sesión 7 dentro del curso: que aparezca en el índice como
construida, que se recorra con los cinco bloques rotulados del curso, que anuncie su título,
su gancho, su objetivo y la franja de cada bloque, y que el curso cuente nueve sesiones.

## ADDED Requirements

### Requirement: La sesión 7 existe y es alcanzable
EL SISTEMA SHALL ofrecer la sesión 7 desde el índice del curso como sesión construida, igual
que las seis anteriores.

#### Scenario: La sesión se abre desde el índice
- **WHEN** alguien abre el índice del curso
- **THEN** la sesión 7 aparece como construida y no atenuada
- **AND** al activarla se abre la sesión 7

### Requirement: El curso tiene nueve sesiones
EL SISTEMA SHALL contar nueve sesiones en el índice, en la portada y en la cabecera de cada
sesión, con las dos que siguen sin construir —la 8 y la 9— anunciadas por el temario con el
título y el objetivo que antes tenían la 7 y la 8.

#### Scenario: Nueve filas, dos pendientes
- **WHEN** alguien abre el índice del curso
- **THEN** ve nueve sesiones en orden
- **AND** las sesiones 8 y 9 aparecen como pendientes con «Cómo aprende una máquina» y «Fundamentos de Inteligencia Artificial»

#### Scenario: La portada y la cabecera cuentan lo mismo
- **WHEN** alguien mira la portada y la cabecera de cualquier sesión
- **THEN** las dos dicen nueve sesiones
- **AND** las horas totales que la portada anuncia son nueve veces tres

### Requirement: Cinco bloques rotulados
EL SISTEMA SHALL dividir la sesión 7 en cinco bloques rotulados entrada, bloque 1, bloque 2,
bloque 3 y cierre, en este orden de contenido: probabilidad condicional y tablas de
contingencia; análisis de correspondencias simples; análisis de correspondencias múltiples;
análisis factorial de datos mixtos; y el análisis del salón entero.

#### Scenario: Los cinco bloques están, en su orden
- **WHEN** alguien abre la sesión 7
- **THEN** ve cinco bloques rotulados entrada, bloque 1, bloque 2, bloque 3 y cierre
- **AND** sus rótulos nombran, en ese orden, las tablas de contingencia, las correspondencias simples, el MCA, el FAMD y el salón entero

### Requirement: Las rutas conservan el esquema del curso
EL SISTEMA SHALL direccionar cada bloque de la sesión 7 con los mismos identificadores de
bloque que las sesiones anteriores.

#### Scenario: Una ruta de bloque se puede compartir
- **WHEN** alguien abre la dirección de un bloque concreto de la sesión 7
- **THEN** se abre ese bloque y no otro
- **AND** el identificador del bloque es uno de entrada, bloque-1, bloque-2, bloque-3 o cierre

### Requirement: La sesión anuncia su título, su gancho y su objetivo
EL SISTEMA SHALL mostrar en la sesión 7 un título, una frase de apertura y un objetivo que
digan que la sesión lee las variables que no son números y termina analizando la tabla del
salón entera.

#### Scenario: Título, gancho y objetivo a la vista
- **WHEN** alguien abre la sesión 7
- **THEN** ve su título, su frase de apertura y su objetivo
- **AND** los tres hablan de leer las variables que no son números hasta analizar la tabla entera

### Requirement: El índice refleja los cinco bloques
EL SISTEMA SHALL mostrar en el índice del curso, para la sesión 7, las fichas de sus cinco
bloques con sus franjas.

#### Scenario: Cinco fichas en el índice
- **WHEN** alguien mira la sesión 7 en el índice del curso
- **THEN** ve cinco fichas de bloque con sus franjas

### Requirement: Las franjas caben en tres horas y no se solapan
EL SISTEMA SHALL declarar para los cinco bloques de la sesión 7 franjas que no se solapen
entre sí y que no excedan los ciento ochenta minutos.

#### Scenario: Las franjas son consistentes
- **WHEN** se leen las franjas de los cinco bloques de la sesión 7
- **THEN** ninguna se solapa con otra
- **AND** ninguna termina después del minuto ciento ochenta

### Requirement: Abrir la sesión 7 no carga las otras
EL SISTEMA SHALL cargar el contenido de cada bloque de la sesión 7 por separado, sin traer el
de otros bloques ni el de otras sesiones.

#### Scenario: Cada bloque viaja solo
- **WHEN** alguien abre un bloque de la sesión 7
- **THEN** solo se descarga el contenido de ese bloque
- **AND** no se descarga el de los otros bloques ni el de las otras sesiones

### Requirement: Las sesiones anteriores anuncian la 7 y la 8 donde corresponde
EL SISTEMA SHALL hacer que lo que las sesiones 2 y 4 anuncian de sesiones posteriores
coincida con el temario nuevo: la tabla del salón se modela en la sesión 8, y la paradoja de
Simpson se resuelve en la sesión 7.

#### Scenario: Ninguna sesión publicada promete lo que otra no cumple
- **WHEN** alguien recorre las sesiones 2 y 4
- **THEN** la figura de destinos de la sesión 2 dice que la tabla se modela en la 8
- **AND** la sesión 4 dice que la paradoja de Simpson se resuelve en la 7
