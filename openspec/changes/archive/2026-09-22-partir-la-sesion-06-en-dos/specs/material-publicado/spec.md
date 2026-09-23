## MODIFIED Requirements

### Requirement: Los tres destinos ciertos se conservan
EL SISTEMA SHALL conservar en esa figura de la sesión 2 los tres destinos que siguen
siendo ciertos: se limpia en la 3, se describe en la 4 y se modela en la 8.

#### Scenario: La figura mantiene lo que sí se cumple
- **WHEN** alguien mira la figura de destinos de la sesión 2
- **THEN** siguen los tres destinos: se limpia en la 3, se describe en la 4 y se modela en la 8

### Requirement: La sesión 4 deja de prometer causalidad en la sesión 6
EL SISTEMA SHALL dejar de anunciar en la sesión 4 que la sesión 6 trata de causalidad o
resuelve la paradoja de Simpson.

#### Scenario: Las dos promesas desaparecen
- **WHEN** alguien recorre la sesión 4
- **THEN** no se anuncia que la sesión 6 trate de causalidad
- **AND** no se anuncia que la sesión 6 resuelva la paradoja de Simpson

#### Scenario: La promesa que sí se cumple se anuncia
- **WHEN** alguien recorre la sesión 4
- **THEN** se anuncia que la paradoja de Simpson se resuelve en la sesión 7

### Requirement: La paradoja de Simpson sigue planteada
EL SISTEMA SHALL conservar en la sesión 4 el planteamiento de la paradoja de Simpson y la
incomodidad que produce, y decir en qué sesión se resuelve: la 7.

#### Scenario: Se quita la promesa, no el contenido
- **WHEN** alguien recorre la sesión 4
- **THEN** la paradoja de Simpson sigue planteada con su figura
- **AND** sigue enunciada la advertencia de que una asociación puede invertirse al agrupar

#### Scenario: La cita es la que se cumple
- **WHEN** alguien lee dónde se resuelve la paradoja
- **THEN** la sesión que se anuncia es la 7
- **AND** la sesión 7 la resuelve

### Requirement: El índice sigue mostrando las ocho sesiones
EL SISTEMA SHALL listar en el índice del curso las nueve sesiones, construidas y
pendientes, en orden, y declarar en la portada y en la cabecera de cada sesión el total de
nueve sin que ese número esté escrito en más de un sitio.

#### Scenario: No falta ninguna fila
- **WHEN** alguien abre el índice del curso
- **THEN** ve las nueve sesiones en orden
- **AND** las que todavía no están construidas se distinguen de las que sí

#### Scenario: El total vive en un solo sitio
- **WHEN** se busca dónde está escrito cuántas sesiones tiene el curso
- **THEN** se encuentra en un único lugar
- **AND** la portada, la cabecera «Sesión NN de NN» y las horas totales salen de ahí
