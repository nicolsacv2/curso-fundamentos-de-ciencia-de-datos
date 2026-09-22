## Purpose

Cubre la entrada de la sesión 7: cómo se leen dos variables no numéricas a la vez con una
tabla de contingencia de la propia tabla del salón —frecuencias conjuntas y marginales,
probabilidad condicional, independencia, chi-cuadrado y una medida de asociación—, y cómo la
paradoja de Simpson que la sesión 4 dejó plantada se resuelve con una tabla de tres entradas.

## ADDED Requirements

### Requirement: La entrada recoge la pregunta con la que cerró la sesión 6
EL SISTEMA SHALL abrir la sesión 7 diciendo que responde la pregunta «¿qué falta?» con la que
cerró la sesión 6, nombrando cuántas columnas de la tabla quedaron fuera del análisis por no
ser números, y que el primer paso es aprender a leer dos de esas columnas juntas.

#### Scenario: El puente llega
- **WHEN** alguien abre la entrada de la sesión 7
- **THEN** se dice que es la respuesta a «¿qué falta?»
- **AND** se dice cuántas columnas quedaron fuera por no ser números
- **AND** esa cifra sale del conjunto de datos y no está escrita a mano

### Requirement: La tabla de contingencia se construye sobre dos variables del salón
EL SISTEMA SHALL mostrar la tabla cruzada de dos variables no numéricas de la tabla limpia del
salón —una fila por nivel de una, una columna por nivel de la otra, el recuento de personas
en cada celda— con las sumas por fila, por columna y el total.

#### Scenario: La tabla cruzada, con sus márgenes
- **WHEN** alguien mira la tabla de contingencia de la entrada
- **THEN** ve un recuento por cada combinación de niveles de las dos variables
- **AND** ve la suma de cada fila, la de cada columna y el total
- **AND** el total es el número de personas de la tabla limpia

### Requirement: El par de variables se elige por un criterio escrito
EL SISTEMA SHALL elegir las dos variables de la tabla cruzada con un criterio calculado y
publicado —la asociación más fuerte entre los pares de variables no numéricas que la sesión 6
dejó utilizables, sin ningún nivel de una sola persona y con pocos niveles cada una—, decir
cuál es ese criterio, qué otros pares se consideraron y por qué quedaron fuera los que
quedaron fuera.

#### Scenario: El par no se eligió a ojo
- **WHEN** alguien lee por qué se cruzan esas dos variables
- **THEN** ve el criterio escrito, con sus dos filtros
- **AND** ve la medida de asociación de todos los pares considerados, y cuáles pasaron los filtros
- **AND** el par elegido es el de mayor asociación entre los que pasaron

#### Scenario: Un par que domina una sola persona no se elige
- **WHEN** un par tiene mayor asociación que el elegido pero una de sus variables tiene un nivel de una sola persona
- **THEN** aparece entre los considerados con su medida y con el motivo por el que no se eligió

### Requirement: Cada fila es una probabilidad condicional
EL SISTEMA SHALL mostrar los perfiles de fila y de columna de la tabla —cada recuento dividido
por su marginal— y enunciar que un perfil de fila es la probabilidad de cada nivel de una
variable dado un nivel de la otra, escribiendo la notación P(A | B) y leyéndola en palabras
sobre una celda concreta de la tabla del salón.

#### Scenario: Del recuento a la probabilidad condicional
- **WHEN** alguien lee los perfiles de la tabla
- **THEN** ve cada fila y cada columna convertida en proporciones que suman uno
- **AND** ve escrita la notación P(A | B) y su lectura en palabras sobre una celda del salón
- **AND** la cifra de esa celda sale de la tabla y no está escrita a mano

### Requirement: La probabilidad marginal y la condicional se distinguen
EL SISTEMA SHALL mostrar lado a lado, para un mismo nivel, su probabilidad marginal y su
probabilidad condicionada a un nivel de la otra variable, y enunciar que la diferencia entre
las dos es lo que significa que las variables estén asociadas.

#### Scenario: Marginal contra condicional
- **WHEN** alguien lee la comparación
- **THEN** ve la probabilidad marginal de un nivel y la condicional al lado
- **AND** se enuncia que si fueran iguales para todos los niveles, las variables serían independientes

### Requirement: La independencia se muestra como una tabla que no existe
EL SISTEMA SHALL mostrar la tabla de frecuencias esperadas bajo independencia —el producto de
los marginales dividido por el total— junto a la observada, y enunciar que la distancia entre
las dos es lo que se va a medir.

#### Scenario: La tabla esperada, celda a celda
- **WHEN** alguien mira la tabla esperada
- **THEN** ve, para cada celda, la frecuencia que tendría si las dos variables fueran independientes
- **AND** las esperadas tienen los mismos marginales que las observadas

### Requirement: El chi-cuadrado se reparte celda por celda
EL SISTEMA SHALL mostrar la contribución de cada celda al estadístico chi-cuadrado —la
diferencia entre observado y esperado, al cuadrado, sobre el esperado—, su suma, y una medida
de asociación en [0, 1] que se obtenga de él, diciendo que con las personas de esta clase es
una medida y no una prueba.

#### Scenario: El estadístico, y qué celdas lo ponen
- **WHEN** alguien mira el chi-cuadrado de la tabla
- **THEN** ve la contribución de cada celda y la suma
- **AND** ve una medida de asociación entre cero y uno
- **AND** se enuncia que con tan pocas personas es una medida descriptiva y no una prueba

### Requirement: La paradoja de Simpson se resuelve con una tabla de tres entradas
EL SISTEMA SHALL retomar la paradoja de Simpson que la sesión 4 dejó plantada —un medicamento,
dos grupos de edad— como una tabla de contingencia de tres variables, mostrar la tabla de cada
grupo y la tabla total, y enunciar que la asociación entre dosis y mejoría tiene un sentido
dentro de cada grupo y el sentido contrario en el total.

#### Scenario: Las tres tablas y la inversión
- **WHEN** alguien llega a la paradoja de Simpson
- **THEN** ve la tabla de cada grupo de edad y la tabla de los dos juntos
- **AND** ve la probabilidad condicional de mejorar dada la dosis en cada una de las tres
- **AND** en las dos tablas de grupo la dosis alta mejora más, y en la total mejora menos

### Requirement: La paradoja se explica con probabilidad condicional
EL SISTEMA SHALL explicar la inversión con las probabilidades condicionales de la tabla: que el
grupo de edad se asocia a la vez con la dosis y con la mejoría, y que juntar los grupos mezcla
esa tercera variable con las dos que se miran; y enunciar que la pregunta correcta es
«¿asociado con qué, dentro de qué?», la que la sesión 4 dejó abierta.

#### Scenario: La tercera variable tiene nombre
- **WHEN** alguien lee la explicación de la paradoja
- **THEN** se dice que el grupo de edad se asocia con la dosis y con la mejoría a la vez
- **AND** se enuncia que juntar los grupos mezcla esa variable con las otras dos
- **AND** se retoma la pregunta «¿asociado con qué, dentro de qué?»

### Requirement: Las cifras de las tablas se generan, no se escriben a mano
EL SISTEMA SHALL producir la tabla cruzada, sus marginales, los perfiles, las esperadas, el
chi-cuadrado, la medida de asociación, la lista de pares candidatos y las tres tablas de
Simpson con un proceso repetible que lea la tabla limpia publicada, que comprueba antes de
publicar que los marginales cuadran, que las esperadas conservan los marginales y que la
inversión de Simpson ocurre, y que no necesita instalar nada.

#### Scenario: Regenerar da lo mismo
- **WHEN** se generan las cifras dos veces
- **THEN** los dos resultados son idénticos

#### Scenario: Una identidad rota detiene la publicación
- **WHEN** los marginales no cuadran, las esperadas no conservan los marginales o la inversión no ocurre
- **THEN** el proceso falla y no publica

#### Scenario: No hace falta instalar nada
- **WHEN** alguien regenera las cifras
- **THEN** no necesita instalar ninguna dependencia ni tener el archivo crudo del formulario

### Requirement: Nada se calcula en el navegador
EL SISTEMA SHALL mostrar en la entrada resultados ya calculados de antemano, sin computarlos al
abrir el bloque.

#### Scenario: Abrir la entrada no cuenta nada
- **WHEN** alguien abre la entrada de la sesión 7
- **THEN** todas las cifras ya están calculadas

### Requirement: La entrada no depende de ningún lenguaje de programación
EL SISTEMA SHALL presentar la entrada sin código y sin nombres de lenguajes de programación ni
de paquetes.

#### Scenario: Ni código ni lenguajes en pantalla
- **WHEN** alguien recorre la entrada de la sesión 7
- **THEN** no ve código ni el nombre de ningún lenguaje de programación o paquete
