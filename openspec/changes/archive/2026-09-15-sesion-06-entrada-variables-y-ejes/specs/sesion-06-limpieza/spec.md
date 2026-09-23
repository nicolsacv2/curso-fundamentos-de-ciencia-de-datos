## MODIFIED Requirements

### Requirement: Estandarizar reduce las categorías
EL SISTEMA SHALL mostrar, para cada columna de texto del conjunto, cuántas categorías
distintas tenía antes de estandarizarla y cuántas le quedan después.

#### Scenario: El recuento se ve
- **WHEN** alguien mira el paso de estandarización del texto
- **THEN** ve, para cada columna de texto, su número de categorías distintas antes y después de estandarizarla

#### Scenario: Ninguna columna de texto falta en ese recuento
- **WHEN** se comparan las columnas que aparecen en el recuento con las columnas de texto del conjunto
- **THEN** están todas

## ADDED Requirements

### Requirement: La estandarización se aplica a todas las columnas de texto
EL SISTEMA SHALL enunciar que los cuatro tratamientos del texto se aplican a todas las
columnas de texto del conjunto, y no solo a la que se usa de ejemplo.

#### Scenario: El alcance está escrito
- **WHEN** alguien lee el paso de estandarización del texto
- **THEN** se enuncia que los tratamientos se aplican a todas las columnas de texto

### Requirement: Una columna sirve de ejemplo sin ocultar a las demás
EL SISTEMA SHALL seguir mostrando el efecto de cada tratamiento por separado sobre una
columna concreta, y a la vez el efecto total sobre el resto.

#### Scenario: El caso detallado y el conjunto conviven
- **WHEN** alguien mira el paso de estandarización del texto
- **THEN** una columna aparece recorrida tratamiento a tratamiento
- **AND** las demás columnas de texto aparecen con su efecto total

### Requirement: Una columna que no se movió también se muestra
EL SISTEMA SHALL mostrar las columnas de texto en las que la estandarización no cambió el
número de categorías, en lugar de omitirlas.

#### Scenario: El caso sin efecto está a la vista
- **WHEN** una columna de texto tiene después de estandarizarla las mismas categorías que antes
- **THEN** aparece igualmente en el paso de estandarización
- **AND** se distingue de las columnas en las que el recuento sí bajó

### Requirement: La tabla limpia se muestra entera al terminar la cadena
EL SISTEMA SHALL mostrar la tabla completa ya limpia después del último paso de limpieza y
antes de cualquier análisis sobre ella.

#### Scenario: El resultado de la cadena se ve
- **WHEN** alguien termina de recorrer los pasos de limpieza de la entrada
- **THEN** ve la tabla completa con el resultado de haberlos aplicado
- **AND** la ve antes de que empiece el análisis de componentes principales

#### Scenario: Están todas las filas y todas las columnas publicadas
- **WHEN** alguien mira la tabla limpia
- **THEN** están todas las respuestas del conjunto
- **AND** están todas las columnas publicadas

### Requirement: Cada columna muestra en qué acabó
EL SISTEMA SHALL señalar, en la tabla limpia, las columnas que la cadena descartó y las que
declaró no analizables, distinguiéndolas de las que llegaron limpias hasta el final.

#### Scenario: Lo que quedó fuera sigue a la vista
- **WHEN** una columna fue descartada o declarada no analizable
- **THEN** aparece igualmente en la tabla limpia
- **AND** está señalada como tal
- **AND** se distingue de las columnas que llegaron hasta el final

#### Scenario: Lo que quedó fuera no se rellena
- **WHEN** una columna fue descartada o declarada no analizable
- **THEN** sus celdas vacías siguen vacías en la tabla limpia

### Requirement: Las celdas inventadas se distinguen en la tabla limpia
EL SISTEMA SHALL señalar en la tabla limpia cada celda cuyo valor se inventó, y decir
cuántas son.

#### Scenario: Se ve qué no lo dijo nadie
- **WHEN** alguien mira la tabla limpia
- **THEN** cada celda inventada se distingue de una observada
- **AND** se indica cuántas celdas se inventaron en total

#### Scenario: La tabla limpia y las marcas dicen lo mismo
- **WHEN** se comparan las celdas señaladas en la tabla limpia con las marcas de celda inventada
- **THEN** coinciden

### Requirement: Ninguna variable se analiza sin haberse visto antes
EL SISTEMA SHALL mostrar cada columna publicada en la tabla con la que abre la entrada,
antes de que ningún paso de la cadena opere sobre ella.

#### Scenario: La primera tabla las trae todas
- **WHEN** alguien mira la tabla con la que arranca la entrada
- **THEN** están todas las columnas publicadas
- **AND** están las que no son numéricas

#### Scenario: Una variable no aparece por primera vez a mitad de la cadena
- **WHEN** un paso de la limpieza opera sobre una columna
- **THEN** esa columna ya se había mostrado antes

### Requirement: La tabla del principio y la del final se pueden comparar
EL SISTEMA SHALL mostrar la tabla cruda y la tabla limpia con las mismas columnas y en el
mismo orden, para que la diferencia entre las dos sea lo que hizo la cadena.

#### Scenario: Las dos tablas son la misma tabla
- **WHEN** se comparan las columnas de la tabla de apertura con las de la tabla limpia
- **THEN** son las mismas y están en el mismo orden
