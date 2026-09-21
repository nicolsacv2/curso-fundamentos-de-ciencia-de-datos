# sesion-06-estructura Specification

## Purpose

Cubre la existencia de la sesión 6 dentro del curso: que aparezca en el índice, que se
recorra con los mismos cinco bloques rotulados que las cinco sesiones anteriores, y que
anuncie su título, su gancho, su objetivo y la franja de minutos de cada bloque.

## Requirements

### Requirement: La sesión 6 existe y es alcanzable
EL SISTEMA SHALL ofrecer la sesión 6 desde el índice del curso, igual que las cinco
sesiones ya construidas.

#### Scenario: La sesión se abre desde el índice
- **WHEN** alguien abre el índice del curso
- **THEN** la sesión 6 aparece como construida y no atenuada
- **AND** al activarla se abre la sesión 6

### Requirement: Cinco bloques rotulados
EL SISTEMA SHALL dividir la sesión 6 en cinco bloques rotulados entrada, bloque 1,
bloque 2, bloque 3 y cierre.

#### Scenario: Los cinco bloques están
- **WHEN** alguien abre la sesión 6
- **THEN** ve cinco bloques rotulados entrada, bloque 1, bloque 2, bloque 3 y cierre

### Requirement: Las rutas conservan el esquema del curso
EL SISTEMA SHALL direccionar cada bloque de la sesión 6 con los mismos identificadores de
bloque que las sesiones anteriores.

#### Scenario: Una ruta de bloque se puede compartir
- **WHEN** alguien abre la dirección de un bloque concreto de la sesión 6
- **THEN** se abre ese bloque y no otro
- **AND** el identificador del bloque es uno de entrada, bloque-1, bloque-2, bloque-3 o cierre

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

### Requirement: La entrada ocupa más de lo habitual
EL SISTEMA SHALL declarar para la entrada de la sesión 6 una franja más larga que la de
cualquier otra entrada del curso.

#### Scenario: La entrada es la más larga del curso
- **WHEN** se compara la franja de la entrada de la sesión 6 con las de las entradas de las sesiones 1 a 5
- **THEN** la de la sesión 6 es más larga que todas ellas

### Requirement: Abrir la sesión 6 no carga las otras
EL SISTEMA SHALL cargar el contenido de cada bloque de la sesión 6 por separado, sin traer
el de otros bloques ni el de otras sesiones.

#### Scenario: Cada bloque viaja solo
- **WHEN** alguien abre un bloque de la sesión 6
- **THEN** solo se descarga el contenido de ese bloque
- **AND** no se descarga el de los otros bloques ni el de las otras sesiones
