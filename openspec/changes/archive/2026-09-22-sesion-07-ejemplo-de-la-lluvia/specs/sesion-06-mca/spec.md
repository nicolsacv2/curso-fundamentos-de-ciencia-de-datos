## MODIFIED Requirements

### Requirement: El MCA abre desde el análisis de correspondencias simples
EL SISTEMA SHALL abrir el bloque de MCA diciendo que es el análisis de correspondencias del
bloque anterior aplicado a la tabla indicadora de varias variables a la vez, sin citar ningún
dato de la tabla del salón.

#### Scenario: El puente viene del CA, no de la entrada
- **WHEN** alguien abre el bloque de MCA de la sesión 7
- **THEN** se dice que es el análisis de correspondencias del bloque anterior sobre la tabla indicadora
- **AND** no se cita ninguna cifra de la tabla del salón
