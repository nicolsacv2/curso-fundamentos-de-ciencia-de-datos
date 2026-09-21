# sesion-06-limpieza Specification

## Purpose

Cubre la primera parte de la entrada de la sesión 6: dejar utilizable la tabla del salón
—estandarizar el texto, describirla con las medidas de la sesión 4, y encontrar los
atípicos con diagramas de caja— mostrando en cada paso qué se ganó y qué se movió.

## Requirements

### Requirement: La entrada parte de la tabla del salón
EL SISTEMA SHALL abrir la entrada de la sesión 6 con la tabla del salón tal como llegó del
formulario.

#### Scenario: La tabla cruda está a la vista
- **WHEN** alguien abre la entrada de la sesión 6
- **THEN** ve la tabla del salón con sus valores tal como llegaron

### Requirement: Se dice por qué se vuelve a esa tabla
EL SISTEMA SHALL enunciar en la entrada que se vuelve a la tabla del salón porque es
mayoritariamente no numérica, a diferencia del conjunto de la sesión 5.

#### Scenario: El cambio de material se justifica
- **WHEN** alguien lee la entrada de la sesión 6
- **THEN** se enuncia que se vuelve a la tabla del salón porque casi todo lo que contiene no son números

### Requirement: El texto se estandariza
EL SISTEMA SHALL mostrar una estandarización del texto de la tabla antes de describirla.

#### Scenario: El texto pasa por un paso propio
- **WHEN** alguien recorre la entrada de la sesión 6
- **THEN** la estandarización del texto aparece como un paso propio, antes de la descripción

### Requirement: Los cuatro tratamientos del texto se nombran
EL SISTEMA SHALL nombrar los cuatro tratamientos que se aplican al texto: recortar los
espacios sobrantes, quitar las tildes, pasar a minúsculas y eliminar las palabras vacías.

#### Scenario: Los cuatro aparecen
- **WHEN** alguien lee el paso de estandarización del texto
- **THEN** se nombran recortar los espacios sobrantes, quitar las tildes, pasar a minúsculas y eliminar las palabras vacías

### Requirement: Cada tratamiento se ve aplicado a un valor real
EL SISTEMA SHALL mostrar, para cada uno de esos cuatro tratamientos, un valor de la tabla
antes y después de aplicárselo.

#### Scenario: El efecto se ve, no se resume
- **WHEN** alguien recorre el paso de estandarización del texto
- **THEN** cada tratamiento muestra un valor real de la tabla antes y después

### Requirement: Estandarizar reduce las categorías
EL SISTEMA SHALL mostrar, para cada columna de texto del conjunto, cuántas categorías
distintas tenía antes de estandarizarla y cuántas le quedan después.

#### Scenario: El recuento se ve
- **WHEN** alguien mira el paso de estandarización del texto
- **THEN** ve, para cada columna de texto, su número de categorías distintas antes y después de estandarizarla

#### Scenario: Ninguna columna de texto falta en ese recuento
- **WHEN** se comparan las columnas que aparecen en el recuento con las columnas de texto del conjunto
- **THEN** están todas

### Requirement: Qué es una palabra vacía
EL SISTEMA SHALL explicar qué cuenta como palabra vacía y mostrar la lista que se usa.

#### Scenario: La lista está a la vista
- **WHEN** alguien lee el tratamiento de las palabras vacías
- **THEN** se explica qué cuenta como palabra vacía
- **AND** se muestra la lista que se aplicó

### Requirement: Quitar palabras vacías no se aplica a todo
EL SISTEMA SHALL indicar a qué columnas se les quitan las palabras vacías y a cuáles no.

#### Scenario: El alcance del tratamiento está escrito
- **WHEN** alguien lee el tratamiento de las palabras vacías
- **THEN** se indica a qué columnas se aplica y a cuáles no

### Requirement: Estandarizar el texto es una decisión con precio
EL SISTEMA SHALL enunciar qué se pierde al estandarizar el texto.

#### Scenario: El precio se nombra
- **WHEN** alguien termina de leer el paso de estandarización del texto
- **THEN** se enuncia qué se pierde al aplicarlo

### Requirement: La tabla que se muestra es la de las variables no numéricas
EL SISTEMA SHALL mostrar en la entrada la tabla con las variables que no son numéricas, y
no solo con las que una sesión anterior auditó.

#### Scenario: La tabla enseña de lo que va la sesión
- **WHEN** alguien mira la tabla con la que arranca la entrada de la sesión 6
- **THEN** ve en ella las variables que no son numéricas

### Requirement: Las variables no numéricas también se limpian
EL SISTEMA SHALL aplicar la limpieza a todas las variables que no son numéricas, y no solo
a las que entran en el análisis de componentes principales.

#### Scenario: Ninguna queda sin tratar
- **WHEN** alguien recorre la limpieza de la entrada
- **THEN** las variables que no son numéricas han pasado por ella

### Requirement: Cada variable no numérica se diagnostica
EL SISTEMA SHALL mostrar, para cada variable no numérica, cuántos niveles distintos tiene,
cuánta gente hay en el nivel más grande, cuántos niveles tienen una sola persona y cuántas
respuestas faltan.

#### Scenario: El diagnóstico está completo
- **WHEN** alguien mira el diagnóstico de una variable no numérica
- **THEN** ve cuántos niveles distintos tiene
- **AND** cuánta gente hay en el nivel más grande
- **AND** cuántos niveles tienen una sola persona
- **AND** cuántas respuestas faltan

### Requirement: El diagnóstico las reparte en formas
EL SISTEMA SHALL clasificar cada variable no numérica según la forma de su reparto de
niveles.

#### Scenario: Cada variable lleva su forma
- **WHEN** alguien mira el diagnóstico de las variables no numéricas
- **THEN** cada una aparece clasificada según la forma de su reparto

### Requirement: Cada forma admite un tratamiento distinto
EL SISTEMA SHALL indicar qué tratamiento le corresponde a cada forma.

#### Scenario: La clasificación sirve para algo
- **WHEN** alguien lee la clasificación por formas
- **THEN** cada forma indica qué tratamiento le corresponde

### Requirement: Los umbrales de la clasificación están escritos
EL SISTEMA SHALL mostrar a partir de qué cifras una variable se clasifica en una forma y no
en otra.

#### Scenario: La clasificación se puede recalcular
- **WHEN** alguien mira la clasificación por formas
- **THEN** ve a partir de qué cifras una variable cae en cada una

### Requirement: Los niveles poco frecuentes se agrupan también aquí
EL SISTEMA SHALL agrupar los niveles que muy poca gente eligió en las variables no
numéricas cuyo reparto tiene muchos niveles de una sola persona.

#### Scenario: La cola larga se recoge
- **WHEN** alguien mira una variable no numérica con muchos niveles de una sola persona
- **THEN** esos niveles aparecen agrupados

### Requirement: Se ve el efecto del agrupamiento
EL SISTEMA SHALL mostrar, para cada variable agrupada, cuántos niveles tenía antes y
cuántos quedan después.

#### Scenario: El antes y el después del agrupamiento
- **WHEN** alguien mira una variable no numérica agrupada
- **THEN** ve cuántos niveles tenía y cuántos le quedan

### Requirement: Una variable que casi nadie diferencia se señala
EL SISTEMA SHALL señalar las variables no numéricas en las que casi toda la clase respondió
lo mismo.

#### Scenario: La respuesta dominante se ve
- **WHEN** alguien mira el diagnóstico de las variables no numéricas
- **THEN** están señaladas aquellas en las que casi toda la clase respondió lo mismo

### Requirement: Se dice qué le pasa a una variable así
EL SISTEMA SHALL enunciar que una variable en la que casi todos responden lo mismo no sirve
para distinguir a unas personas de otras.

#### Scenario: El motivo está escrito
- **WHEN** alguien lee sobre una variable dominada por una sola respuesta
- **THEN** se enuncia que no sirve para distinguir a unas personas de otras

### Requirement: Una variable que no es una categoría se marca como tal
EL SISTEMA SHALL marcar como no analizables las variables no numéricas cuyos niveles son
casi todos distintos.

#### Scenario: El identificador y el texto libre quedan fuera
- **WHEN** alguien mira el diagnóstico de las variables no numéricas
- **THEN** las que tienen casi todos sus niveles distintos están marcadas como no analizables

### Requirement: Se dice por qué esas no son categorías
EL SISTEMA SHALL enunciar que un nivel que corresponde a una sola persona describe a esa
persona y no a un grupo.

#### Scenario: El motivo está escrito
- **WHEN** alguien lee por qué una variable quedó marcada como no analizable
- **THEN** se enuncia que un nivel de una sola persona describe a esa persona y no a un grupo

### Requirement: Los motivos de descarte se distinguen entre sí
EL SISTEMA SHALL distinguir las variables descartadas por la calidad de sus datos de las
descartadas por no ser una categoría.

#### Scenario: No se confunden dos problemas distintos
- **WHEN** alguien mira qué variables quedaron descartadas
- **THEN** las descartadas por la calidad de sus datos se distinguen de las descartadas por no ser una categoría

### Requirement: Limpiar lo no numérico no lo mete en el análisis
EL SISTEMA SHALL mantener fuera del análisis de componentes principales las variables no
numéricas, por muy limpias que hayan quedado.

#### Scenario: La limpieza no cambia quién entra
- **WHEN** alguien mira qué variables entran al análisis de componentes principales tras la limpieza
- **THEN** ninguna variable no numérica está entre ellas

### Requirement: La tabla se describe con las medidas de la sesión 4
EL SISTEMA SHALL describir las variables cuantitativas de la tabla con medidas de
localización y de dispersión, las mismas que la sesión 4 introdujo.

#### Scenario: La descripción usa lo ya visto
- **WHEN** alguien mira la descripción de la entrada de la sesión 6
- **THEN** se usan medidas de localización y de dispersión
- **AND** son las mismas que la sesión 4 introdujo

### Requirement: Se dice cuáles son esas medidas
EL SISTEMA SHALL mostrar, para cada variable cuantitativa descrita, su media, su mediana,
sus cuartiles, su rango intercuartílico y su desviación típica.

#### Scenario: La caja de medidas está completa
- **WHEN** alguien mira la descripción de una variable cuantitativa
- **THEN** ve su media, su mediana, sus cuartiles, su rango intercuartílico y su desviación típica

### Requirement: La descripción se hace dos veces
EL SISTEMA SHALL mostrar esas medidas dos veces: sobre la tabla sin limpiar y sobre la
tabla ya limpia.

#### Scenario: Hay un antes y un después
- **WHEN** alguien recorre la entrada de la sesión 6
- **THEN** ve las medidas sobre la tabla sin limpiar y sobre la tabla ya limpia

### Requirement: Las dos descripciones se comparan lado a lado
EL SISTEMA SHALL presentar las dos descripciones de forma que cada medida se pueda
comparar con su equivalente.

#### Scenario: Cada medida encuentra su pareja
- **WHEN** alguien mira la comparación entre las dos descripciones
- **THEN** cada medida del antes queda junto a la misma medida del después

### Requirement: Se señala qué medidas se movieron más
EL SISTEMA SHALL indicar cuáles de esas medidas cambiaron más entre el antes y el después.

#### Scenario: El cambio se señala
- **WHEN** alguien mira la comparación entre las dos descripciones
- **THEN** se indica cuáles medidas cambiaron más

### Requirement: La robustez de la sesión 4 se vuelve a ver
EL SISTEMA SHALL enunciar, a partir de esa comparación, qué medidas resistieron la
limpieza y cuáles no.

#### Scenario: La lección de la sesión 4 se confirma con datos nuevos
- **WHEN** alguien lee la comparación entre las dos descripciones
- **THEN** se enuncia qué medidas resistieron la limpieza y cuáles no

### Requirement: Los atípicos se buscan con diagramas de caja
EL SISTEMA SHALL dibujar un diagrama de caja por cada variable cuantitativa para localizar
sus valores atípicos.

#### Scenario: Cada variable cuantitativa tiene su caja
- **WHEN** alguien mira el paso de atípicos de la entrada
- **THEN** hay un diagrama de caja por cada variable cuantitativa

### Requirement: El diagrama de caja se explica antes de usarse
EL SISTEMA SHALL explicar qué representan la caja, la línea de dentro y los bigotes antes
de leer los atípicos en ellos.

#### Scenario: La figura se lee, no se supone
- **WHEN** alguien llega al primer diagrama de caja de la sesión 6
- **THEN** se explica qué representan la caja, la línea de dentro y los bigotes

### Requirement: La caja se liga a las medidas ya vistas
EL SISTEMA SHALL enunciar que la caja del diagrama está construida con los cuartiles y el
rango intercuartílico que la descripción acaba de mostrar.

#### Scenario: La figura y la tabla de medidas son lo mismo
- **WHEN** alguien lee la explicación del diagrama de caja
- **THEN** se enuncia que la caja se construye con los cuartiles y el rango intercuartílico ya mostrados

### Requirement: La regla que define un atípico está escrita
EL SISTEMA SHALL mostrar la regla exacta con la que un punto queda fuera de los bigotes.

#### Scenario: El criterio es explícito
- **WHEN** alguien mira el paso de atípicos
- **THEN** se muestra la regla exacta con la que un punto queda fuera de los bigotes

### Requirement: Los puntos atípicos se marcan
EL SISTEMA SHALL señalar en cada diagrama de caja los puntos que la regla deja fuera.

#### Scenario: Los atípicos se ven
- **WHEN** alguien mira un diagrama de caja de la entrada
- **THEN** los puntos que la regla deja fuera están señalados

### Requirement: Cada atípico se identifica en la tabla
EL SISTEMA SHALL indicar, para cada punto marcado como atípico, a qué fila y a qué columna
de la tabla corresponde.

#### Scenario: El punto se puede ir a buscar
- **WHEN** alguien mira un punto marcado como atípico
- **THEN** se indica a qué fila y a qué columna de la tabla corresponde

### Requirement: Un atípico no es un error
EL SISTEMA SHALL enunciar que un valor atípico puede ser un error de captura o un dato
verdadero, y que la regla no distingue entre los dos.

#### Scenario: Se advierte antes de tocar nada
- **WHEN** alguien lee el paso de atípicos
- **THEN** se enuncia que un atípico puede ser un error o un dato verdadero
- **AND** se enuncia que la regla no distingue entre los dos

### Requirement: El umbral es una decisión
EL SISTEMA SHALL enunciar que el umbral de la regla es una decisión, y mostrar cuántos
puntos quedarían fuera con otro umbral.

#### Scenario: La consecuencia del umbral se ve
- **WHEN** alguien lee el paso de atípicos
- **THEN** se enuncia que el umbral es una decisión
- **AND** se muestra cuántos puntos quedarían fuera con otro umbral

### Requirement: Qué se hace con los atípicos encontrados
EL SISTEMA SHALL indicar qué se hace en esta sesión con los valores que la regla marca
como atípicos.

#### Scenario: El destino del atípico está escrito
- **WHEN** alguien termina el paso de atípicos
- **THEN** se indica qué se hace con los valores marcados

### Requirement: Los huecos se cuentan antes de taparlos
EL SISTEMA SHALL mostrar cuántos valores faltan en cada columna antes de imputarlos.

#### Scenario: El recuento de huecos está a la vista
- **WHEN** alguien recorre la entrada de la sesión 6
- **THEN** se muestra cuántos valores faltan en cada columna

### Requirement: La limpieza se enuncia como una cadena de decisiones
EL SISTEMA SHALL presentar la limpieza de la entrada como una secuencia de pasos, cada uno
con lo que decide.

#### Scenario: La cadena se ve entera
- **WHEN** alguien recorre la entrada de la sesión 6
- **THEN** la limpieza aparece como una secuencia de pasos
- **AND** cada paso dice qué decide

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
