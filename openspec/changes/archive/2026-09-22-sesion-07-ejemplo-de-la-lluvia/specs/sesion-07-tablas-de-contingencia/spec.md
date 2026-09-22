## ADDED Requirements

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

## MODIFIED Requirements

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

## REMOVED Requirements

### Requirement: La tabla de contingencia se construye sobre dos variables del salón
**Reason**: La tabla del salón entra a la sesión 7 solo en el cierre. La entrada enseña la
probabilidad condicional sobre un ejemplo propio que no hay que justificar antes de usarlo.
**Migration**: «La tabla de contingencia es un ejemplo propio y declarado».

### Requirement: El par de variables se elige por un criterio escrito
**Reason**: Sin par del salón no hay par que elegir ni criterio que publicar. La lección que
el criterio dejaba —que una categoría de una persona fabrica una asociación— la enseña el
bloque 2 con la Stevia.
**Migration**: Ninguna.
