## Purpose

Cubre el cierre de la sesión 6: el análisis factorial de datos mixtos aplicado a la tabla
del salón que la entrada dejó limpia, leído con el protocolo del bloque 1 y los tres
gráficos del bloque 2, comparado con el PCA de la entrada, con las categorías de una sola
persona y las marcas de celda inventada proyectadas como suplementarias; y el ticket de
salida con el puente a la sesión siguiente.

## ADDED Requirements

### Requirement: El cierre responde «¿qué falta?» con la tabla entera
EL SISTEMA SHALL abrir el cierre diciendo que se aplica el método del bloque 2 a la misma
tabla limpia de la entrada, con las mismas personas, y que entran todas las columnas que
llegaron limpias: las cuantitativas que el PCA miró y las no numéricas ya agrupadas.

#### Scenario: Las columnas que entran son las que llegaron limpias
- **WHEN** alguien abre el cierre de la sesión 6
- **THEN** se dice cuántas columnas entran y cuántas son de cada tipo
- **AND** esas columnas son exactamente las que la tabla limpia señala como llegadas hasta el final
- **AND** las cifras salen del conjunto de datos y no están escritas a mano

### Requirement: Lo que queda fuera se dice con su motivo
EL SISTEMA SHALL nombrar las columnas que no entran al análisis y repetir junto a cada una
el motivo que la entrada ya dio.

#### Scenario: Tres columnas, tres motivos ya vistos
- **WHEN** alguien mira qué columnas no entran
- **THEN** ve cada una con su motivo
- **AND** los motivos son los que la entrada dio para descartarlas o declararlas no analizables

### Requirement: Cuántas categorías y cuánta inercia
EL SISTEMA SHALL mostrar cuántas categorías tiene el análisis, la inercia total y cuánta
pone cada bloque de variables, y enunciar que una variable de muchas categorías pone más
inercia total aunque por eje siga acotada.

#### Scenario: La inercia se reparte por bloques
- **WHEN** alguien mira la inercia del análisis del salón
- **THEN** ve el número de categorías, la inercia total y la parte de cada bloque
- **AND** se enuncia la advertencia sobre las variables de muchas categorías

### Requirement: La inercia por eje, comparada con el PCA de la entrada
EL SISTEMA SHALL mostrar el porcentaje de inercia de cada eje, comparar lo que retienen los
dos primeros con lo que retenían las dos primeras componentes del PCA de la entrada, y
enunciar que los dos porcentajes no miden sobre el mismo total.

#### Scenario: Los dos porcentajes, y por qué no son comparables sin más
- **WHEN** alguien mira la inercia por eje del análisis del salón
- **THEN** ve el porcentaje de cada eje y el acumulado de los dos primeros
- **AND** ve al lado el de las dos primeras componentes del PCA de la entrada
- **AND** se enuncia que los totales de los dos análisis son distintos

### Requirement: El cuadrado de relaciones se lee primero
EL SISTEMA SHALL dibujar el cuadrado de relaciones del análisis del salón con todas las
variables que entraron —numéricas por r², categóricas por η²—, distinguiendo los dos tipos
sin depender solo del color, y nombrar las dimensiones a partir de él.

#### Scenario: Todas las variables del salón en el cuadrado
- **WHEN** alguien mira el cuadrado de relaciones del cierre
- **THEN** cada variable que entró es un punto rotulado dentro del cuadrado unitario
- **AND** hay dónde aprender qué tipo es cada punto
- **AND** el nombre que la prosa da a cada dimensión remite a las variables que el cuadrado pone cerca de su eje

### Requirement: El círculo de correlaciones del salón
EL SISTEMA SHALL dibujar el círculo de correlaciones con todas las numéricas que entraron,
con los mismos ejes que el cuadrado, rotulados con su porcentaje.

#### Scenario: Una flecha por cantidad
- **WHEN** alguien mira el círculo de correlaciones del cierre
- **THEN** ve una flecha por cada numérica que entró
- **AND** los ejes son los mismos del cuadrado y llevan su porcentaje

### Requirement: El mapa de individuos con baricentros del salón
EL SISTEMA SHALL dibujar cada persona en el plano de los dos primeros ejes y los baricentros
de las categorías, rotulando solo las categorías que pasan el filtro de lectura y dejando
las demás sin rótulo pero dibujadas.

#### Scenario: Una persona por punto, un rótulo por categoría que lo merece
- **WHEN** alguien mira el mapa de individuos del cierre
- **THEN** hay un punto por cada persona de la tabla
- **AND** cada baricentro de categoría está dibujado
- **AND** solo llevan rótulo los que pasan el filtro
- **AND** está escrito en la figura cuál es el filtro

### Requirement: El filtro se aplica antes de interpretar
EL SISTEMA SHALL mostrar la contribución y el cos² de cada categoría en los dos primeros
ejes, el aporte promedio como umbral de contribución y el umbral de cos², y decir qué
categorías se interpretan y cuáles no.

#### Scenario: El protocolo del bloque 1, aplicado
- **WHEN** alguien lee la interpretación del análisis del salón
- **THEN** ve las contribuciones y los cos² de las categorías en los dos ejes
- **AND** ve los dos umbrales escritos
- **AND** ve qué categorías pasaron el filtro y cuáles no

### Requirement: Los ejes no se bautizan en la figura
EL SISTEMA SHALL rotular los ejes de las figuras del cierre solo con su número y su
porcentaje, y dar el nombre interpretativo únicamente en la prosa, justificado por las
contribuciones.

#### Scenario: Eje 1 en la figura, «gradiente de…» en la prosa
- **WHEN** alguien mira un eje en una figura del cierre
- **THEN** lleva su número y su porcentaje y nada más
- **AND** si la prosa le da un nombre, cita las contribuciones que lo justifican

### Requirement: Las categorías de una sola persona se auditan
EL SISTEMA SHALL identificar en el análisis del salón las categorías con una sola persona,
mostrar su distancia al centroide con la fórmula del bloque 1 y su contribución a cada uno
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
dos análisis, y relacionarlo con la decisión de la entrada de no agruparlas.

#### Scenario: Los dos destinos, en el salón
- **WHEN** alguien mira la versión suplementaria
- **THEN** ve el porcentaje del eje 1 en los dos análisis
- **AND** ve la posición y el cos² de cada categoría de una persona en los dos
- **AND** se remite a la decisión de la entrada de no agrupar los extremos de un orden

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
y con la misma semilla que la entrada muestra, y mostrar en clase resultados ya calculados.

#### Scenario: La misma tabla que se vio en el paso 6b
- **WHEN** se compara la tabla que entra al análisis con la tabla limpia publicada
- **THEN** son la misma
- **AND** nada se calcula al abrir el cierre

### Requirement: Las cifras del análisis son auditables sin repetirlo
EL SISTEMA SHALL permitir recomprobar, a partir de la tabla limpia publicada y de los
resultados publicados, que los valores propios suman la inercia total, que en cada eje
Σ r² + Σ η² es el valor propio, que la varianza de las puntuaciones en cada eje es su valor
propio, que cada baricentro es la media de sus personas y que las contribuciones de cada
eje suman cien, sin instalar nada y sin volver a calcular el análisis.

#### Scenario: Las identidades se pueden verificar
- **WHEN** alguien toma la tabla limpia y los resultados publicados
- **THEN** puede recomprobar las cinco identidades con el intérprete del sistema
- **AND** una cifra alterada a mano hace fallar la comprobación

### Requirement: El juicio sobre el resultado concuerda con las cifras
EL SISTEMA SHALL sostener todo lo que la prosa del cierre afirme sobre el resultado —qué
dimensiones hay, qué las forma, si el plano resume bien o mal— sobre las cifras publicadas,
no sobre una afirmación escrita de antemano.

#### Scenario: Regenerar arrastra la prosa
- **WHEN** se regenera el análisis y cambia una cifra citada en el cierre
- **THEN** la cifra en pantalla cambia con él
- **AND** ninguna afirmación del cierre queda contradicha por las cifras publicadas

### Requirement: El ticket de salida
EL SISTEMA SHALL cerrar la sesión con un ticket de salida que pida a cada persona nombrar
una variable no numérica que hoy entró al análisis y qué le dijo —o qué no le dijo— el
cuadrado de relaciones sobre ella, con ejemplos de respuestas que sirven y de respuestas
que no.

#### Scenario: El ticket tiene consigna y ejemplos
- **WHEN** alguien llega al ticket de salida
- **THEN** ve la consigna
- **AND** ve respuestas que sirven y respuestas que no, con por qué

### Requirement: Lo que queda anuncia la sesión siguiente
EL SISTEMA SHALL terminar el cierre recogiendo qué se levantó hoy —la limitación con la que
abrió la sesión— y anunciar la sesión siguiente con el título y el objetivo que el temario
declara para ella, sin prometer nada más concreto.

#### Scenario: El puente coincide con el temario
- **WHEN** alguien lee lo que queda
- **THEN** se enuncia que la tabla del salón se analizó entera
- **AND** lo que se anuncia de la sesión siguiente coincide con lo que el temario declara de ella
