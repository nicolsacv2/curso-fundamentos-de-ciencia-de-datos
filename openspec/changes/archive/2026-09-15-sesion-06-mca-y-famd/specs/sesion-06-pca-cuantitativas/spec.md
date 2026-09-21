## Purpose

Cubre el cierre de la entrada de la sesión 6: aplicar a la tabla del salón ya limpia el
mismo análisis de componentes principales que la sesión 5 enseñó, comprobar que solo
alcanza a las variables cuantitativas, y terminar con la pregunta «¿qué falta?» que abre
el resto de la sesión.

## ADDED Requirements

### Requirement: Se aplica el PCA de la sesión 5
EL SISTEMA SHALL aplicar a la tabla del salón ya limpia el mismo análisis de componentes
principales que la sesión 5 presentó.

#### Scenario: El método no es nuevo
- **WHEN** alguien llega al análisis de componentes principales de la entrada de la sesión 6
- **THEN** se enuncia que es el mismo método de la sesión 5

### Requirement: Solo entran las variables cuantitativas
EL SISTEMA SHALL indicar qué columnas de la tabla entran en el análisis y cuáles se
quedan fuera.

#### Scenario: Las dos listas están a la vista
- **WHEN** alguien mira el análisis de componentes principales de la entrada
- **THEN** se indica qué columnas entran en el análisis y cuáles se quedan fuera

### Requirement: Se dice por qué las categóricas no entran
EL SISTEMA SHALL enunciar que las columnas categóricas quedan fuera porque el análisis de
componentes principales opera sobre varianzas, y una categoría no tiene varianza.

#### Scenario: La exclusión se justifica
- **WHEN** alguien lee por qué unas columnas quedan fuera del análisis
- **THEN** se enuncia que el análisis opera sobre varianzas y que una categoría no tiene varianza

### Requirement: Una cuantitativa excluida se nombra aparte
EL SISTEMA SHALL distinguir, entre las columnas que quedan fuera del análisis, las que no
entran por ser categóricas de las que no entran por la calidad de sus datos.

#### Scenario: Las dos exclusiones no se confunden
- **WHEN** alguien mira qué columnas quedan fuera del análisis
- **THEN** las que no entran por ser categóricas se distinguen de las que no entran por la calidad de sus datos

### Requirement: Su motivo se repite aquí
EL SISTEMA SHALL indicar, junto al análisis, por qué la columna cuantitativa descartada no
entra en él.

#### Scenario: No hay que volver atrás para saberlo
- **WHEN** alguien mira el análisis de componentes principales de la entrada
- **THEN** se indica por qué la columna cuantitativa descartada no entra en él

### Requirement: Se ve cuánta tabla se está tirando
EL SISTEMA SHALL mostrar qué proporción de las columnas de la tabla queda fuera del
análisis.

#### Scenario: La proporción está escrita
- **WHEN** alguien mira el análisis de componentes principales de la entrada
- **THEN** se muestra qué proporción de las columnas de la tabla queda fuera

### Requirement: El análisis se hace sobre datos estandarizados
EL SISTEMA SHALL indicar si las variables se estandarizaron antes del análisis y por qué.

#### Scenario: La decisión está escrita
- **WHEN** alguien mira el análisis de componentes principales de la entrada
- **THEN** se indica si las variables se estandarizaron y por qué

### Requirement: Varianza explicada por componente
EL SISTEMA SHALL mostrar qué porcentaje de varianza explica cada componente del análisis.

#### Scenario: Cada componente lleva su porcentaje
- **WHEN** alguien mira el análisis de componentes principales de la entrada
- **THEN** cada componente indica qué porcentaje de varianza explica

### Requirement: El plano factorial con una persona por punto
EL SISTEMA SHALL dibujar el plano de las dos primeras componentes con un punto por cada
respuesta de la tabla.

#### Scenario: Cada fila está en el plano
- **WHEN** alguien mira el plano factorial de la entrada de la sesión 6
- **THEN** hay un punto por cada respuesta de la tabla

### Requirement: Las cargas de las dos primeras componentes
EL SISTEMA SHALL mostrar las cargas de cada una de esas dos componentes.

#### Scenario: Las cargas están a la vista
- **WHEN** alguien mira el plano factorial de la entrada de la sesión 6
- **THEN** se muestran las cargas de las dos primeras componentes

### Requirement: El plano se lee con lo aprendido en la sesión 5
EL SISTEMA SHALL indicar, para el plano factorial de la entrada, qué se puede leer en él y
qué no, con los mismos criterios de la sesión 5.

#### Scenario: La lectura no se improvisa
- **WHEN** alguien mira el plano factorial de la entrada de la sesión 6
- **THEN** se indica qué se puede leer en él y qué no

### Requirement: El resultado sobre la tabla del salón es pobre y se dice
EL SISTEMA SHALL indicar si las dos primeras componentes bastan para resumir esta tabla, y
compararlo con lo que ocurrió con el conjunto de la sesión 5.

#### Scenario: La comparación con la sesión 5 está escrita
- **WHEN** alguien mira el resultado del análisis de la entrada
- **THEN** se indica si las dos primeras componentes bastan para resumir esta tabla
- **AND** se compara con lo que ocurrió en la sesión 5

### Requirement: El PCA se calcula fuera del navegador
EL SISTEMA SHALL mostrar en clase resultados de análisis ya calculados de antemano, sin
computarlos al abrir la sesión.

#### Scenario: Nada se diagonaliza durante la clase
- **WHEN** alguien abre la entrada de la sesión 6
- **THEN** los resultados del análisis ya están calculados
- **AND** no se computa ninguno al abrirla

### Requirement: Las cifras del análisis son auditables
EL SISTEMA SHALL permitir recomprobar los resultados del análisis a partir de los datos
publicados, sin volver a la fuente original.

#### Scenario: Los números se pueden verificar
- **WHEN** alguien toma los datos publicados de la sesión 6
- **THEN** puede recomprobar con ellos los porcentajes de varianza explicada y las cargas

### Requirement: La entrada termina preguntando qué falta
EL SISTEMA SHALL cerrar la entrada de la sesión 6 con la pregunta «¿qué falta?».

#### Scenario: La pregunta está escrita tal cual
- **WHEN** alguien llega al final de la entrada de la sesión 6
- **THEN** encuentra la pregunta «¿qué falta?»

### Requirement: La pregunta se hace antes de responderla
EL SISTEMA SHALL dejar la pregunta planteada sin contestarla dentro de la entrada.

#### Scenario: La entrada no se responde a sí misma
- **WHEN** alguien termina la entrada de la sesión 6
- **THEN** la pregunta queda planteada
- **AND** la entrada no la contesta

### Requirement: La pregunta se apoya en lo que se acaba de ver
EL SISTEMA SHALL hacer que la pregunta remita explícitamente a las columnas que quedaron
fuera del análisis.

#### Scenario: La pregunta tiene de dónde agarrarse
- **WHEN** alguien lee la pregunta que cierra la entrada
- **THEN** remite a las columnas que quedaron fuera del análisis

### Requirement: La pregunta anuncia a dónde va la sesión
EL SISTEMA SHALL indicar junto a esa pregunta que los bloques siguientes la responden.

#### Scenario: El puente está tendido
- **WHEN** alguien lee la pregunta que cierra la entrada
- **THEN** se indica que los bloques siguientes la responden
