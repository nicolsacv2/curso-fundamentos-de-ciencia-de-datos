## MODIFIED Requirements

### Requirement: El ejemplo se presenta antes que la fórmula
EL SISTEMA SHALL introducir el método con un ejemplo de ocho personas y tres variables
categóricas binarias —bebida, horario y azúcar—, mostrar su tabla, enunciar el patrón
sembrado y decir quiénes son las excepciones.

#### Scenario: La tabla de las ocho personas está a la vista
- **WHEN** alguien llega al ejemplo del bloque 2
- **THEN** ve una tabla con ocho filas y tres variables categóricas
- **AND** se enuncia el patrón sembrado entre las tres variables
- **AND** se dice qué individuos son las excepciones a ese patrón

### Requirement: La tabla disyuntiva completa se muestra
EL SISTEMA SHALL mostrar la matriz indicadora del ejemplo —una columna por categoría, un
uno donde la persona tiene la categoría y un cero donde no— y enunciar que cada fila suma el
número de variables y cada columna suma la frecuencia de su categoría.

#### Scenario: Ceros y unos, con sus sumas
- **WHEN** alguien mira la tabla disyuntiva del bloque 2
- **THEN** ve una columna por cada categoría del ejemplo
- **AND** cada celda es un cero o un uno
- **AND** se enuncia cuánto suma cada fila y cuánto suma cada columna

### Requirement: La métrica chi-cuadrado y su consecuencia
EL SISTEMA SHALL enunciar la distancia chi-cuadrado entre dos individuos, que en ella las
diferencias en categorías raras pesan más, y la fórmula cerrada de la distancia de una
categoría al centroide: n/n_j − 1.

#### Scenario: Compartir lo raro acerca más
- **WHEN** alguien lee la métrica del bloque 2
- **THEN** se enuncia que las diferencias en categorías poco frecuentes pesan más
- **AND** se muestra la fórmula n/n_j − 1 de la distancia de una categoría al centroide

### Requirement: El mapa factorial del ejemplo
EL SISTEMA SHALL dibujar el plano de los dos primeros ejes con las categorías y los
individuos del ejemplo, distinguidos por su marca, con las categorías distinguidas por
variable y con cada eje rotulado con su porcentaje de inercia.

#### Scenario: Categorías e individuos en el mismo plano
- **WHEN** alguien mira el mapa factorial del bloque 2
- **THEN** cada categoría y cada individuo del ejemplo están en el plano
- **AND** las categorías se distinguen de los individuos por su marca
- **AND** hay dónde aprender a qué variable corresponde cada categoría sin depender solo del color
- **AND** cada eje lleva escrito su porcentaje de inercia

#### Scenario: Las posiciones salen de los datos generados
- **WHEN** se comparan las posiciones dibujadas con las coordenadas publicadas del ejemplo
- **THEN** coinciden

### Requirement: Nada se calcula en el navegador
EL SISTEMA SHALL mostrar en el bloque 2 resultados ya calculados de antemano, sin
computarlos al abrir el bloque.

#### Scenario: Abrir el bloque no diagonaliza nada
- **WHEN** alguien abre el bloque 2
- **THEN** los resultados del ejemplo ya están calculados
- **AND** no se computa ninguno al abrirlo

### Requirement: Las fórmulas se ven escritas en la pared
EL SISTEMA SHALL mostrar las fórmulas del bloque de forma legible proyectadas, sin pedir
nada a un servidor externo para dibujarlas.

#### Scenario: Las fórmulas no dependen de la red
- **WHEN** alguien abre el bloque 2 sin conexión, con la página ya cargada
- **THEN** todas las fórmulas se ven

## ADDED Requirements

### Requirement: El MCA abre desde el análisis de correspondencias simples
EL SISTEMA SHALL abrir el bloque de MCA diciendo que es el análisis de correspondencias del
bloque anterior aplicado a la tabla indicadora de varias variables a la vez, y recordando
cuántas columnas de la tabla del salón quedaron fuera del análisis de la sesión 6 por no ser
números.

#### Scenario: El puente viene del CA, no de la entrada
- **WHEN** alguien abre el bloque de MCA de la sesión 7
- **THEN** se dice que es el análisis de correspondencias del bloque anterior sobre la tabla indicadora
- **AND** se dice cuántas columnas quedaron fuera del análisis de la sesión 6 por no ser números
- **AND** esa cifra sale del conjunto de datos y no está escrita a mano

## REMOVED Requirements

### Requirement: El bloque 1 responde la pregunta de la entrada
**Reason**: La pregunta «¿qué falta?» ya no la responde el bloque siguiente de la misma
sesión: cierra la sesión 6 y la responde la sesión 7 entera, que abre con las tablas de
contingencia. El MCA es su tercer bloque y abre desde el análisis de correspondencias
simples.
**Migration**: «El MCA abre desde el análisis de correspondencias simples», arriba, y «La
pregunta anuncia a dónde va la sesión» en `sesion-06-pca-cuantitativas`.
