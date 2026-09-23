## MODIFIED Requirements

### Requirement: Los huecos se rellenan por muestreo aleatorio
EL SISTEMA SHALL rellenar los valores que faltan tomando al azar valores observados de la
misma columna.

#### Scenario: El método se enuncia
- **WHEN** alguien llega al paso de imputación de la sesión 6
- **THEN** se enuncia que los valores que faltan se rellenan tomando al azar valores observados de la misma columna

### Requirement: La regla de la caja no se aplica a una escala ordinal
EL SISTEMA SHALL no usar el rango intercuartílico para marcar atípicos en una variable que
sea un orden y no una cantidad.

#### Scenario: Un rango no tiene atípicos por dispersión
- **WHEN** alguien recorre el paso de atípicos de la sesión 6
- **THEN** ninguna variable ordinal tiene valores marcados como atípicos por la regla de la caja

### Requirement: Una columna puede quedar fuera en vez de imputarse
EL SISTEMA SHALL dejar fuera de la imputación toda columna en la que el número de valores
a inventar sea tan alto que el resultado dejaría de sostenerse.

#### Scenario: La columna no se imputa
- **WHEN** alguien recorre el paso de imputación de la sesión 6
- **THEN** la columna de horas de pantalla al día no se imputa

### Requirement: El resultado es siempre el mismo
EL SISTEMA SHALL mostrar en clase un resultado de imputación fijo, que no cambia entre una
proyección y la siguiente.

#### Scenario: La clase ve lo mismo dos veces
- **WHEN** alguien abre la sesión 6 dos veces
- **THEN** los valores imputados son los mismos en las dos

### Requirement: La imputación no ocurre en el navegador
EL SISTEMA SHALL mostrar en clase valores imputados ya calculados de antemano, sin
generarlos en el momento de abrir la sesión.

#### Scenario: Nada se sortea durante la clase
- **WHEN** alguien abre la sesión 6
- **THEN** los valores imputados ya están calculados
- **AND** no se sortea ninguno al abrirla
