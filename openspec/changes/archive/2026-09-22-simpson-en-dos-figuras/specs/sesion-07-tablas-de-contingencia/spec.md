## ADDED Requirements

### Requirement: La paradoja de Simpson se cuenta en dos figuras, la pregunta antes que la respuesta
EL SISTEMA SHALL mostrar la paradoja de Simpson en dos figuras separadas y en este orden:
primero una figura con solo el total —una barra por dosis con la proporción que mejora y,
debajo, cuántas personas mejoraron de cuántas— que plantea la pregunta «¿qué dosis es
mejor?»; después una figura con las mismas personas separadas por grupo de edad —dos barras
por grupo— donde en cada grupo la dosis alta mejora más. Las dos figuras comparten la escala
vertical y los colores por dosis, y sus cifras salen de los datos generados.

#### Scenario: La primera figura hace la pregunta
- **WHEN** alguien llega a la paradoja de Simpson
- **THEN** ve primero una figura con solo dos barras, dosis alta y dosis baja, del total
- **AND** la figura plantea la pregunta de qué dosis es mejor
- **AND** en ella la dosis baja mejora más

#### Scenario: La segunda figura muestra la paradoja
- **WHEN** alguien sigue leyendo
- **THEN** ve una segunda figura con las mismas personas separadas por grupo de edad
- **AND** en cada grupo la dosis alta mejora más
- **AND** debajo de cada barra se lee cuántas personas mejoraron de cuántas

#### Scenario: Las dos figuras se comparan a ojo
- **WHEN** alguien mira las dos figuras
- **THEN** la escala vertical y los colores por dosis son los mismos en las dos

## MODIFIED Requirements

### Requirement: La paradoja de Simpson se resuelve con una tabla de tres entradas
EL SISTEMA SHALL retomar la paradoja de Simpson que la sesión 4 dejó plantada —un medicamento,
dos grupos de edad— como una tabla de contingencia de tres variables, mostrar primero la tabla
total y después la tabla de cada grupo, y enunciar que la asociación entre dosis y mejoría
tiene un sentido en el total y el sentido contrario dentro de cada grupo.

#### Scenario: Las tres tablas y la inversión
- **WHEN** alguien llega a la paradoja de Simpson
- **THEN** ve primero la tabla de los dos grupos juntos y después la tabla de cada grupo de edad
- **AND** ve la probabilidad condicional de mejorar dada la dosis en cada una de las tres
- **AND** en la total la dosis alta mejora menos, y en las dos tablas de grupo mejora más
