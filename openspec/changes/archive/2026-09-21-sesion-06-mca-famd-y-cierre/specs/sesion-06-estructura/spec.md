## ADDED Requirements

### Requirement: Cuatro bloques rotulados
EL SISTEMA SHALL dividir la sesión 6 en cuatro bloques rotulados entrada, bloque 1,
bloque 2 y cierre.

#### Scenario: Los cuatro bloques están
- **WHEN** alguien abre la sesión 6
- **THEN** ve cuatro bloques rotulados entrada, bloque 1, bloque 2 y cierre
- **AND** no ve ningún bloque 3

### Requirement: El índice refleja los cuatro bloques
EL SISTEMA SHALL mostrar en el índice del curso, para la sesión 6, las fichas de sus cuatro
bloques con sus franjas.

#### Scenario: Cuatro fichas en el índice
- **WHEN** alguien mira la sesión 6 en el índice del curso
- **THEN** ve cuatro fichas de bloque con sus franjas
- **AND** ninguna anuncia segmentación

## MODIFIED Requirements

### Requirement: Las rutas conservan el esquema del curso
EL SISTEMA SHALL direccionar cada bloque de la sesión 6 con los mismos identificadores de
bloque que las sesiones anteriores, salvo el del bloque 3, que la sesión 6 no tiene.

#### Scenario: Una ruta de bloque se puede compartir
- **WHEN** alguien abre la dirección de un bloque concreto de la sesión 6
- **THEN** se abre ese bloque y no otro
- **AND** el identificador del bloque es uno de entrada, bloque-1, bloque-2 o cierre

#### Scenario: Una dirección antigua al bloque 3 no rompe nada
- **WHEN** alguien abre la dirección que antes correspondía al bloque 3 de la sesión 6
- **THEN** se abre la sesión 6 en su entrada
- **AND** no se produce ningún error

### Requirement: Las franjas caben en tres horas y no se solapan
EL SISTEMA SHALL declarar franjas que no se solapen entre sí y que no excedan los ciento
ochenta minutos.

#### Scenario: Las franjas son consistentes
- **WHEN** se leen las franjas de los cuatro bloques de la sesión 6
- **THEN** ninguna se solapa con otra
- **AND** ninguna termina después del minuto ciento ochenta

## REMOVED Requirements

### Requirement: Cinco bloques rotulados
**Reason**: El bloque 3, la segmentación, se elimina: nunca se escribió y no hace falta
para responder la pregunta con la que termina la entrada. La sesión 6 pasa a tener cuatro
bloques.
**Migration**: Lo sustituye el requisito «Cuatro bloques rotulados». Las direcciones de
entrada, bloque-1, bloque-2 y cierre no cambian; la de bloque-3 abre la sesión en su
entrada.
