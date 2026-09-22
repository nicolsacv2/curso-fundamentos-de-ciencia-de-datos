# sesion-07-tablas-de-contingencia Specification

## Purpose

Cubre la entrada de la sesión 7: cómo se leen dos variables no numéricas a la vez con una
tabla de contingencia sobre un ejemplo propio y declarado como inventado —el cielo de hoy
contra el cielo de mañana: frecuencias conjuntas y marginales, probabilidad condicional,
independencia, chi-cuadrado y una medida de asociación—, y cómo la paradoja de Simpson que la
sesión 4 dejó plantada se resuelve con una tabla de tres entradas. La tabla del salón no
aparece aquí: entra a la sesión en el cierre.

## Requirements

### Requirement: La entrada recoge la pregunta con la que cerró la sesión 6
EL SISTEMA SHALL abrir la sesión 7 diciendo que responde la pregunta «¿qué falta?» con la que
cerró la sesión 6 —las columnas que no son números—, que el primer paso es aprender a leer
dos de esas variables juntas, y que se aprende sobre un ejemplo propio antes de volver a la
tabla del salón al final de la sesión.

#### Scenario: El puente llega
- **WHEN** alguien abre la entrada de la sesión 7
- **THEN** se dice que es la respuesta a «¿qué falta?»
- **AND** se dice que el primer paso es leer dos variables no numéricas juntas
- **AND** se dice que la tabla del salón vuelve al final de la sesión

### Requirement: Cada fila es una probabilidad condicional
EL SISTEMA SHALL mostrar los perfiles de fila y de columna de la tabla —cada recuento dividido
por su marginal— y enunciar que un perfil de fila es la probabilidad de cada estado de mañana
dado el estado de hoy, escribiendo la notación P(A | B) y leyéndola en palabras sobre la
celda que da nombre al ejemplo: llovió hoy y llueve mañana.

#### Scenario: Del recuento a la probabilidad condicional
- **WHEN** alguien lee los perfiles de la tabla
- **THEN** ve cada fila y cada columna convertida en proporciones que suman uno
- **AND** ve escrita la notación P(A | B) y su lectura en palabras sobre la celda de lluvia hoy y lluvia mañana
- **AND** la cifra de esa celda sale de la tabla generada y no está escrita a mano

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
de asociación en [0, 1] que se obtenga de él, diciendo que es una medida de cuánto se asocian
las dos variables y no una prueba de que se asocien.

#### Scenario: El estadístico, y qué celdas lo ponen
- **WHEN** alguien mira el chi-cuadrado de la tabla
- **THEN** ve la contribución de cada celda y la suma
- **AND** ve una medida de asociación entre cero y uno
- **AND** se enuncia que es una medida descriptiva y no una prueba

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
chi-cuadrado, la medida de asociación y las tres tablas de Simpson con un proceso repetible
que parta de constantes declaradas en un solo sitio, que comprueba antes de publicar que los
marginales cuadran, que las esperadas conservan los marginales, que llover hoy hace más
probable llover mañana —la historia que el ejemplo cuenta— y que la inversión de Simpson
ocurre, y que no necesita instalar nada.

#### Scenario: Regenerar da lo mismo
- **WHEN** se generan las cifras dos veces
- **THEN** los dos resultados son idénticos

#### Scenario: Una identidad rota detiene la publicación
- **WHEN** los marginales no cuadran, las esperadas no conservan los marginales, llover hoy no hace más probable llover mañana, o la inversión de Simpson no ocurre
- **THEN** el proceso falla y no publica

#### Scenario: No hace falta instalar nada
- **WHEN** alguien regenera las cifras
- **THEN** no necesita instalar ninguna dependencia ni tener ningún archivo de datos

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

### Requirement: La tabla de contingencia es un ejemplo propio y declarado
EL SISTEMA SHALL construir la tabla de contingencia de la entrada sobre un ejemplo propio —el
cielo de hoy contra el cielo de mañana, con tres estados: sol, nublado y lluvia— a lo largo de
un año de días inventados, decir en pantalla que los días son inventados, y mostrar la tabla
con las sumas por fila, por columna y el total.

#### Scenario: La tabla cruzada, con sus márgenes
- **WHEN** alguien mira la tabla de contingencia de la entrada
- **THEN** ve un recuento de días por cada combinación de estado de hoy y estado de mañana
- **AND** ve la suma de cada fila, la de cada columna y el total de días
- **AND** está escrito que los días son inventados

#### Scenario: El salón no aparece
- **WHEN** alguien recorre la entrada de la sesión 7
- **THEN** no ve ningún dato de la tabla del salón

### Requirement: Las tablas numéricas conservan su esquina fija
EL SISTEMA SHALL mantener fija la celda de esquina de la cabecera de cada tabla numérica de la
sesión 7 cuando la tabla se desplaza en horizontal, de modo que la primera columna de datos
no quede tapada por la cabecera de fila.

#### Scenario: Desplazar no tapa la primera columna
- **WHEN** alguien desplaza en horizontal una tabla numérica de la sesión 7
- **THEN** la celda de esquina de la cabecera se queda en su sitio
- **AND** la primera columna de datos sigue visible

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
