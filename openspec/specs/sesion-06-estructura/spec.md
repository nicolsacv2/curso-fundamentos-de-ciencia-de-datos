# sesion-06-estructura Specification

## Purpose

Cubre la existencia de la sesión 6 dentro del curso: que aparezca en el índice, que se
recorra en cuatro bloques rotulados —entrada, bloque 1, bloque 2 y cierre, sin bloque 3:
es la primera sesión del curso con cuatro—, y que anuncie su título, su gancho, su
objetivo y la franja de minutos de cada bloque.

## Requirements

### Requirement: La sesión 6 existe y es alcanzable
EL SISTEMA SHALL ofrecer la sesión 6 desde el índice del curso, igual que las cinco
sesiones ya construidas.

#### Scenario: La sesión se abre desde el índice
- **WHEN** alguien abre el índice del curso
- **THEN** la sesión 6 aparece como construida y no atenuada
- **AND** al activarla se abre la sesión 6

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

### Requirement: La sesión anuncia su título y su objetivo
EL SISTEMA SHALL mostrar en la sesión 6 su título y su objetivo.

#### Scenario: Título y objetivo a la vista
- **WHEN** alguien abre la sesión 6
- **THEN** ve su título y su objetivo

### Requirement: El título es el de la sesión, no el del temario previo
EL SISTEMA SHALL titular la sesión 6 según el contenido que esta sesión trata de verdad,
y no según la entrada de temario que existía antes de este cambio.

#### Scenario: El título dejó de hablar de causalidad
- **WHEN** alguien lee el título de la sesión 6
- **THEN** el título describe el contenido que la sesión 6 trata
- **AND** no anuncia correlación, causalidad ni el arte de concluir

### Requirement: La sesión anuncia su gancho
EL SISTEMA SHALL mostrar en la sesión 6 una frase de apertura que nombre la limitación que
la sesión viene a levantar.

#### Scenario: El gancho nombra la limitación
- **WHEN** alguien abre la sesión 6
- **THEN** ve una frase de apertura
- **AND** esa frase dice que buena parte de la tabla del salón no es numérica

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

### Requirement: Abrir la sesión 6 no carga las otras
EL SISTEMA SHALL cargar el contenido de cada bloque de la sesión 6 por separado, sin traer
el de otros bloques ni el de otras sesiones.

#### Scenario: Cada bloque viaja solo
- **WHEN** alguien abre un bloque de la sesión 6
- **THEN** solo se descarga el contenido de ese bloque
- **AND** no se descarga el de los otros bloques ni el de las otras sesiones
