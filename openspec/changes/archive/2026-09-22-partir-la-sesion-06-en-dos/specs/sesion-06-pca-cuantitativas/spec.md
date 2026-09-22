## MODIFIED Requirements

### Requirement: Se aplica el PCA de la sesión 5
EL SISTEMA SHALL aplicar a la tabla del salón ya limpia el mismo análisis de componentes
principales que la sesión 5 presentó.

#### Scenario: El método no es nuevo
- **WHEN** alguien llega al análisis de componentes principales de la sesión 6
- **THEN** se enuncia que es el mismo método de la sesión 5

### Requirement: Solo entran las variables cuantitativas
EL SISTEMA SHALL indicar qué columnas de la tabla entran en el análisis y cuáles se
quedan fuera.

#### Scenario: Las dos listas están a la vista
- **WHEN** alguien mira el análisis de componentes principales de la sesión 6
- **THEN** se indica qué columnas entran en el análisis y cuáles se quedan fuera

### Requirement: Su motivo se repite aquí
EL SISTEMA SHALL indicar, junto al análisis, por qué la columna cuantitativa descartada no
entra en él.

#### Scenario: No hay que volver atrás para saberlo
- **WHEN** alguien mira el análisis de componentes principales de la sesión 6
- **THEN** se indica por qué la columna cuantitativa descartada no entra en él

### Requirement: Se ve cuánta tabla se está tirando
EL SISTEMA SHALL mostrar qué proporción de las columnas de la tabla queda fuera del
análisis.

#### Scenario: La proporción está escrita
- **WHEN** alguien mira el análisis de componentes principales de la sesión 6
- **THEN** se muestra qué proporción de las columnas de la tabla queda fuera

### Requirement: El análisis se hace sobre datos estandarizados
EL SISTEMA SHALL indicar si las variables se estandarizaron antes del análisis y por qué.

#### Scenario: La decisión está escrita
- **WHEN** alguien mira el análisis de componentes principales de la sesión 6
- **THEN** se indica si las variables se estandarizaron y por qué

### Requirement: Varianza explicada por componente
EL SISTEMA SHALL mostrar qué porcentaje de varianza explica cada componente del análisis.

#### Scenario: Cada componente lleva su porcentaje
- **WHEN** alguien mira el análisis de componentes principales de la sesión 6
- **THEN** cada componente indica qué porcentaje de varianza explica

### Requirement: El plano factorial con una persona por punto
EL SISTEMA SHALL dibujar el plano de las dos primeras componentes con un punto por cada
respuesta de la tabla.

#### Scenario: Cada fila está en el plano
- **WHEN** alguien mira el plano factorial de la sesión 6
- **THEN** hay un punto por cada respuesta de la tabla

### Requirement: Las cargas de las dos primeras componentes
EL SISTEMA SHALL mostrar las cargas de cada una de esas dos componentes.

#### Scenario: Las cargas están a la vista
- **WHEN** alguien mira el plano factorial de la sesión 6
- **THEN** se muestran las cargas de las dos primeras componentes

### Requirement: El plano se lee con lo aprendido en la sesión 5
EL SISTEMA SHALL indicar, para el plano factorial de la sesión 6, qué se puede leer en él y
qué no, con los mismos criterios de la sesión 5.

#### Scenario: La lectura no se improvisa
- **WHEN** alguien mira el plano factorial de la sesión 6
- **THEN** se indica qué se puede leer en él y qué no

### Requirement: El resultado sobre la tabla del salón es pobre y se dice
EL SISTEMA SHALL indicar si las dos primeras componentes bastan para resumir esta tabla,
compararlo con lo que ocurrió con el conjunto de la sesión 5, y sostener ese juicio sobre
las cifras que el análisis haya dado, no sobre una afirmación escrita de antemano.

#### Scenario: La comparación con la sesión 5 está escrita
- **WHEN** alguien mira el resultado del análisis de la sesión 6
- **THEN** se indica si las dos primeras componentes bastan para resumir esta tabla
- **AND** se compara con lo que ocurrió en la sesión 5

#### Scenario: El juicio concuerda con las cifras
- **WHEN** se compara lo que el texto dice del resultado con el porcentaje que el análisis da
- **THEN** el texto no afirma nada que ese porcentaje contradiga
- **AND** el porcentaje que el texto cita sale del análisis y no está escrito a mano

### Requirement: El PCA se calcula fuera del navegador
EL SISTEMA SHALL mostrar en clase resultados de análisis ya calculados de antemano, sin
computarlos al abrir la sesión.

#### Scenario: Nada se diagonaliza durante la clase
- **WHEN** alguien abre la sesión 6
- **THEN** los resultados del análisis ya están calculados
- **AND** no se computa ninguno al abrirla

### Requirement: La entrada termina preguntando qué falta
EL SISTEMA SHALL cerrar la sesión 6 —en su cierre, después del análisis de componentes
principales— con la pregunta «¿qué falta?».

#### Scenario: La pregunta está escrita tal cual
- **WHEN** alguien llega al cierre de la sesión 6
- **THEN** encuentra la pregunta «¿qué falta?»

### Requirement: La pregunta se hace antes de responderla
EL SISTEMA SHALL dejar la pregunta planteada sin contestarla dentro de la sesión 6.

#### Scenario: La entrada no se responde a sí misma
- **WHEN** alguien termina la sesión 6
- **THEN** la pregunta queda planteada
- **AND** ningún bloque de la sesión 6 la contesta

### Requirement: La pregunta se apoya en lo que se acaba de ver
EL SISTEMA SHALL hacer que la pregunta remita explícitamente a las columnas que quedaron
fuera del análisis.

#### Scenario: La pregunta tiene de dónde agarrarse
- **WHEN** alguien lee la pregunta que cierra la sesión 6
- **THEN** remite a las columnas que quedaron fuera del análisis

### Requirement: La pregunta anuncia a dónde va la sesión
EL SISTEMA SHALL indicar junto a esa pregunta que la responde la sesión siguiente, con el
título y el objetivo que esa sesión declara, y sin prometer nada más concreto.

#### Scenario: El puente está tendido
- **WHEN** alguien lee la pregunta que cierra la sesión 6
- **THEN** se indica que la responde la sesión siguiente
- **AND** el título y el objetivo que se anuncian coinciden con los que esa sesión declara

### Requirement: Se dice qué hace que un análisis resuma bien o mal
EL SISTEMA SHALL enunciar que las dos primeras componentes resumen más cuanto más se
relacionen entre sí las variables que entran, y relacionar eso con el resultado obtenido.

#### Scenario: La explicación acompaña al resultado
- **WHEN** alguien lee por qué el resultado sale como sale
- **THEN** se enuncia que el resumen depende de cuánto se relacionen entre sí las variables que entran
- **AND** se relaciona con el resultado que la sesión 6 acaba de obtener

### Requirement: Antes del análisis se muestra qué relaciones hay entre las variables
EL SISTEMA SHALL mostrar, después de la tabla limpia y antes del análisis de componentes
principales, cómo se relacionan entre sí las variables de la tabla, por pares.

#### Scenario: La exploración precede al análisis
- **WHEN** alguien recorre la sesión 6
- **THEN** ve cómo se relacionan las variables por pares antes de que empiece el análisis de componentes principales

### Requirement: Las tres combinaciones de tipos tienen su propia mirada
EL SISTEMA SHALL mostrar una forma de mirar dos variables a la vez para cada combinación de
tipos: cantidad con cantidad, cantidad con categoría, y categoría con categoría.

#### Scenario: Ninguna combinación queda sin mirar
- **WHEN** alguien mira la exploración de relaciones de la sesión 6
- **THEN** encuentra cómo se miran dos cantidades entre sí
- **AND** encuentra cómo se mira una cantidad contra una categoría
- **AND** encuentra cómo se miran dos categorías entre sí

#### Scenario: Cada mirada corresponde a los tipos que compara
- **WHEN** alguien compara dos variables de tipos dados
- **THEN** la figura que se le ofrece es la que corresponde a esa combinación de tipos
- **AND** no se usa sobre una categoría una figura que exija una cantidad

### Requirement: La exploración sostiene lo que la entrada afirma después
EL SISTEMA SHALL hacer que lo que la sesión 6 afirme sobre si las variables se relacionan
entre sí, y sobre lo que el análisis no pudo mirar, se apoye en lo mostrado en esa
exploración.

#### Scenario: La afirmación remite a lo que se vio
- **WHEN** la sesión 6 afirma que las variables se relacionan poco entre sí
- **THEN** esa afirmación remite a la exploración que la clase acaba de ver

#### Scenario: La pregunta final tiene material delante
- **WHEN** la sesión 6 termina preguntando qué falta
- **THEN** la clase ya ha visto qué estructura tienen las variables que el análisis no pudo mirar
