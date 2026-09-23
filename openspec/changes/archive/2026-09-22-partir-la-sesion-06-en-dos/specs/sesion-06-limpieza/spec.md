## MODIFIED Requirements

### Requirement: La entrada parte de la tabla del salón
EL SISTEMA SHALL abrir la sesión 6 con la tabla del salón tal como llegó del
formulario.

#### Scenario: La tabla cruda está a la vista
- **WHEN** alguien abre la sesión 6
- **THEN** ve la tabla del salón con sus valores tal como llegaron

### Requirement: Se dice por qué se vuelve a esa tabla
EL SISTEMA SHALL enunciar en la sesión 6 que se vuelve a la tabla del salón porque es
mayoritariamente no numérica, a diferencia del conjunto de la sesión 5.

#### Scenario: El cambio de material se justifica
- **WHEN** alguien lee la sesión 6
- **THEN** se enuncia que se vuelve a la tabla del salón porque casi todo lo que contiene no son números

### Requirement: El texto se estandariza
EL SISTEMA SHALL mostrar una estandarización del texto de la tabla antes de describirla.

#### Scenario: El texto pasa por un paso propio
- **WHEN** alguien recorre la sesión 6
- **THEN** la estandarización del texto aparece como un paso propio, antes de la descripción

### Requirement: La tabla que se muestra es la de las variables no numéricas
EL SISTEMA SHALL mostrar en la sesión 6 la tabla con las variables que no son numéricas, y
no solo con las que una sesión anterior auditó.

#### Scenario: La tabla enseña de lo que va la sesión
- **WHEN** alguien mira la tabla con la que arranca la sesión 6
- **THEN** ve en ella las variables que no son numéricas

### Requirement: Las variables no numéricas también se limpian
EL SISTEMA SHALL aplicar la limpieza a todas las variables que no son numéricas, y no solo
a las que entran en el análisis de componentes principales.

#### Scenario: Ninguna queda sin tratar
- **WHEN** alguien recorre la limpieza de la sesión 6
- **THEN** las variables que no son numéricas han pasado por ella

### Requirement: La tabla se describe con las medidas de la sesión 4
EL SISTEMA SHALL describir las variables cuantitativas de la tabla con medidas de
localización y de dispersión, las mismas que la sesión 4 introdujo.

#### Scenario: La descripción usa lo ya visto
- **WHEN** alguien mira la descripción de la sesión 6
- **THEN** se usan medidas de localización y de dispersión
- **AND** son las mismas que la sesión 4 introdujo

### Requirement: La descripción se hace dos veces
EL SISTEMA SHALL mostrar esas medidas dos veces: sobre la tabla sin limpiar y sobre la
tabla ya limpia.

#### Scenario: Hay un antes y un después
- **WHEN** alguien recorre la sesión 6
- **THEN** ve las medidas sobre la tabla sin limpiar y sobre la tabla ya limpia

### Requirement: Los atípicos se buscan con diagramas de caja
EL SISTEMA SHALL dibujar un diagrama de caja por cada variable cuantitativa para localizar
sus valores atípicos.

#### Scenario: Cada variable cuantitativa tiene su caja
- **WHEN** alguien mira el paso de atípicos de la sesión 6
- **THEN** hay un diagrama de caja por cada variable cuantitativa

### Requirement: Los puntos atípicos se marcan
EL SISTEMA SHALL señalar en cada diagrama de caja los puntos que la regla deja fuera.

#### Scenario: Los atípicos se ven
- **WHEN** alguien mira un diagrama de caja de la sesión 6
- **THEN** los puntos que la regla deja fuera están señalados

### Requirement: Los huecos se cuentan antes de taparlos
EL SISTEMA SHALL mostrar cuántos valores faltan en cada columna antes de imputarlos.

#### Scenario: El recuento de huecos está a la vista
- **WHEN** alguien recorre la sesión 6
- **THEN** se muestra cuántos valores faltan en cada columna

### Requirement: La limpieza se enuncia como una cadena de decisiones
EL SISTEMA SHALL presentar la limpieza de la sesión 6 como una secuencia de pasos, cada uno
con lo que decide.

#### Scenario: La cadena se ve entera
- **WHEN** alguien recorre la sesión 6
- **THEN** la limpieza aparece como una secuencia de pasos
- **AND** cada paso dice qué decide

### Requirement: La tabla limpia se muestra entera al terminar la cadena
EL SISTEMA SHALL mostrar la tabla completa ya limpia después del último paso de limpieza y
antes de cualquier análisis sobre ella.

#### Scenario: El resultado de la cadena se ve
- **WHEN** alguien termina de recorrer los pasos de limpieza de la sesión 6
- **THEN** ve la tabla completa con el resultado de haberlos aplicado
- **AND** la ve antes de que empiece el análisis de componentes principales

#### Scenario: Están todas las filas y todas las columnas publicadas
- **WHEN** alguien mira la tabla limpia
- **THEN** están todas las respuestas del conjunto
- **AND** están todas las columnas publicadas

### Requirement: Ninguna variable se analiza sin haberse visto antes
EL SISTEMA SHALL mostrar cada columna publicada en la tabla con la que abre la sesión 6,
antes de que ningún paso de la cadena opere sobre ella.

#### Scenario: La primera tabla las trae todas
- **WHEN** alguien mira la tabla con la que arranca la sesión 6
- **THEN** están todas las columnas publicadas
- **AND** están las que no son numéricas

#### Scenario: Una variable no aparece por primera vez a mitad de la cadena
- **WHEN** un paso de la limpieza opera sobre una columna
- **THEN** esa columna ya se había mostrado antes
