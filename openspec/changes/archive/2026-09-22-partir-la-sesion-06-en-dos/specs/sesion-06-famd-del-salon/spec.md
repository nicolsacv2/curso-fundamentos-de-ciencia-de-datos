## MODIFIED Requirements

### Requirement: El cierre responde «¿qué falta?» con la tabla entera
EL SISTEMA SHALL abrir el cierre diciendo que se aplica el método del bloque 3 a la misma
tabla limpia de la sesión 6, con las mismas personas, y que entran todas las columnas que
llegaron limpias: las cuantitativas que el PCA miró y las no numéricas ya agrupadas.

#### Scenario: Las columnas que entran son las que llegaron limpias
- **WHEN** alguien abre el cierre de la sesión 7
- **THEN** se dice cuántas columnas entran y cuántas son de cada tipo
- **AND** esas columnas son exactamente las que la tabla limpia señala como llegadas hasta el final
- **AND** las cifras salen del conjunto de datos y no están escritas a mano

### Requirement: Lo que queda fuera se dice con su motivo
EL SISTEMA SHALL nombrar las columnas que no entran al análisis y repetir junto a cada una
el motivo que la sesión 6 ya dio.

#### Scenario: Tres columnas, tres motivos ya vistos
- **WHEN** alguien mira qué columnas no entran
- **THEN** ve cada una con su motivo
- **AND** los motivos son los que la sesión 6 dio para descartarlas o declararlas no analizables

### Requirement: La inercia por eje, comparada con el PCA de la entrada
EL SISTEMA SHALL mostrar el porcentaje de inercia de cada eje, comparar lo que retienen los
dos primeros con lo que retenían las dos primeras componentes del PCA de la sesión 6, y
enunciar que los dos porcentajes no miden sobre el mismo total.

#### Scenario: Los dos porcentajes, y por qué no son comparables sin más
- **WHEN** alguien mira la inercia por eje del análisis del salón
- **THEN** ve el porcentaje de cada eje y el acumulado de los dos primeros
- **AND** ve al lado el de las dos primeras componentes del PCA de la sesión 6
- **AND** se enuncia que los totales de los dos análisis son distintos

### Requirement: El filtro se aplica antes de interpretar
EL SISTEMA SHALL mostrar la contribución y el cos² de cada categoría en los dos primeros
ejes, el aporte promedio como umbral de contribución y el umbral de cos², y decir qué
categorías se interpretan y cuáles no.

#### Scenario: El protocolo del bloque 1, aplicado
- **WHEN** alguien lee la interpretación del análisis del salón
- **THEN** ve las contribuciones y los cos² de las categorías en los dos ejes
- **AND** ve los dos umbrales escritos
- **AND** ve qué categorías pasaron el filtro y cuáles no

### Requirement: Las categorías de una sola persona se auditan
EL SISTEMA SHALL identificar en el análisis del salón las categorías con una sola persona,
mostrar su distancia al centroide con la fórmula del bloque 2 y su contribución a cada uno
de los dos primeros ejes, y decir si alguna fabricó un eje.

#### Scenario: La Stevia del salón
- **WHEN** alguien lee la auditoría de las categorías de una persona
- **THEN** ve cuáles son
- **AND** ve la distancia al centroide de cada una calculada con la fórmula
- **AND** ve su contribución a los dos primeros ejes
- **AND** se dice si alguna supera el aporte promedio

#### Scenario: El juicio sigue las cifras
- **WHEN** se compara lo que el texto dice sobre esas categorías con sus contribuciones publicadas
- **THEN** el texto no afirma nada que esas contribuciones contradigan

### Requirement: Su versión suplementaria se muestra
EL SISTEMA SHALL mostrar un segundo análisis con esas categorías proyectadas como
suplementarias, comparar el porcentaje del eje 1, la posición y el cos² de cada una en los
dos análisis, y relacionarlo con la decisión de la sesión 6 de no agruparlas.

#### Scenario: Los dos destinos, en el salón
- **WHEN** alguien mira la versión suplementaria
- **THEN** ve el porcentaje del eje 1 en los dos análisis
- **AND** ve la posición y el cos² de cada categoría de una persona en los dos
- **AND** se remite a la decisión de la sesión 6 de no agrupar los extremos de un orden

### Requirement: Las marcas de celda inventada se proyectan como suplementarias
EL SISTEMA SHALL proyectar como categoría suplementaria, por cada variable que recibió
valores inventados, el grupo de personas cuya celda se inventó; mostrar dónde cae cada
grupo y su cos²; enunciar que no deformaron los ejes; y responder si dejar una celda en
blanco va con algo.

#### Scenario: La pregunta que la entrada dejó abierta
- **WHEN** alguien mira la proyección de las marcas
- **THEN** ve una categoría suplementaria por cada variable con celdas inventadas, con cuántas personas la forman
- **AND** ve su posición y su cos²
- **AND** está escrito que no deformaron los ejes
- **AND** se responde si dejar en blanco va con algo

#### Scenario: La respuesta sigue las cifras
- **WHEN** se compara lo que el texto dice sobre las marcas con sus cos² y posiciones publicados
- **THEN** el texto no afirma nada que esas cifras contradigan

### Requirement: El FAMD del salón se calcula fuera del navegador, sobre la tabla imputada
EL SISTEMA SHALL calcular el análisis del salón de antemano, sobre la misma tabla imputada
y con la misma semilla que la sesión 6 muestra, y mostrar en clase resultados ya calculados.

#### Scenario: La misma tabla que se vio en el paso 6b
- **WHEN** se compara la tabla que entra al análisis con la tabla limpia publicada
- **THEN** son la misma
- **AND** nada se calcula al abrir el cierre
