## ADDED Requirements

### Requirement: La sesión 4 deja de prometer causalidad en la sesión 6
EL SISTEMA SHALL dejar de anunciar en la sesión 4 que la sesión 6 trata de causalidad o
resuelve la paradoja de Simpson.

#### Scenario: Las dos promesas desaparecen
- **WHEN** alguien recorre la sesión 4
- **THEN** no se anuncia que la sesión 6 trate de causalidad
- **AND** no se anuncia que la sesión 6 resuelva la paradoja de Simpson

### Requirement: La paradoja de Simpson sigue planteada
EL SISTEMA SHALL conservar en la sesión 4 el planteamiento de la paradoja de Simpson y la
incomodidad que produce, aunque deje de decir en qué sesión se resuelve.

#### Scenario: Se quita la promesa, no el contenido
- **WHEN** alguien recorre la sesión 4
- **THEN** la paradoja de Simpson sigue planteada con su figura
- **AND** sigue enunciada la advertencia de que una asociación puede invertirse al agrupar

### Requirement: La sesión 4 anuncia lo que la 6 sí trata
EL SISTEMA SHALL anunciar en el cierre de la sesión 4 el contenido que la sesión 6 sí
trata.

#### Scenario: El puente se rehace bien
- **WHEN** alguien lee el cierre de la sesión 4
- **THEN** se anuncia el contenido que la sesión 6 sí trata

### Requirement: El temario dice de qué es la sesión 6
EL SISTEMA SHALL describir la sesión 6 en el temario del curso con el contenido que esa
sesión trata de verdad.

#### Scenario: El temario y la sesión coinciden
- **WHEN** alguien compara lo que el temario dice de la sesión 6 con lo que la sesión 6 anuncia
- **THEN** coinciden

### Requirement: Un título vive en un solo sitio
EL SISTEMA SHALL declarar el título y el objetivo de cada sesión construida en un único
lugar, de forma que no exista una segunda copia que pueda decir otra cosa.

#### Scenario: No hay dos títulos para la misma sesión
- **WHEN** se busca dónde está escrito el título o el objetivo de una sesión construida
- **THEN** se encuentra en un único lugar

### Requirement: El temario no guarda lo que ya está construido
EL SISTEMA SHALL no conservar en el temario del curso el título ni el objetivo de una
sesión que ya está construida.

#### Scenario: El temario se vacía al construir una sesión
- **WHEN** se revisa el temario del curso
- **THEN** no contiene el título ni el objetivo de ninguna sesión ya construida

### Requirement: El temario sí anuncia las sesiones que faltan
EL SISTEMA SHALL declarar en el temario el título y el objetivo de cada sesión que
todavía no está construida.

#### Scenario: Las sesiones pendientes tienen qué mostrar
- **WHEN** alguien mira en el índice una sesión que todavía no está construida
- **THEN** ve su título y su objetivo

### Requirement: El índice sigue mostrando las ocho sesiones
EL SISTEMA SHALL listar en el índice del curso las ocho sesiones, construidas y
pendientes, en orden.

#### Scenario: No falta ninguna fila
- **WHEN** alguien abre el índice del curso
- **THEN** ve las ocho sesiones en orden
- **AND** las que todavía no están construidas se distinguen de las que sí

### Requirement: Construir una sesión no la borra del índice
EL SISTEMA SHALL seguir mostrando en el índice una sesión después de que se construya, con
el título y el objetivo que ella misma declara.

#### Scenario: La sesión recién construida sigue en su sitio
- **WHEN** una sesión pasa de pendiente a construida
- **THEN** sigue apareciendo en el índice en su posición
- **AND** muestra el título y el objetivo que ella declara

### Requirement: Ninguna cifra en pantalla contradice el conjunto de datos
EL SISTEMA SHALL hacer que toda cifra escrita en pantalla sobre el número de respuestas,
de valores o de personas de la tabla del salón coincida con el conjunto de datos
publicado.

#### Scenario: Los recuentos cuadran
- **WHEN** alguien compara una cifra escrita en pantalla sobre la tabla del salón con el conjunto de datos publicado
- **THEN** coinciden

### Requirement: Eso vale también para el texto dentro de las figuras
EL SISTEMA SHALL aplicar esa correspondencia a las cifras rotuladas dentro de las figuras,
no solo a las de los párrafos.

#### Scenario: Las figuras también cuadran
- **WHEN** alguien lee una cifra rotulada dentro de una figura sobre la tabla del salón
- **THEN** coincide con el conjunto de datos publicado

### Requirement: Los números derivados no se escriben a mano
EL SISTEMA SHALL tomar de la fuente de datos toda cifra que se derive de la tabla del
salón, en vez de tenerla escrita en el texto que la muestra.

#### Scenario: Regenerar el conjunto arrastra las cifras
- **WHEN** se regenera el conjunto de datos del salón
- **THEN** las cifras derivadas que se muestran en pantalla cambian con él

### Requirement: Las conclusiones de las sesiones 3 y 4 se revisan contra los datos nuevos
EL SISTEMA SHALL conservar en las sesiones 3 y 4 únicamente las afirmaciones que sigan
siendo ciertas con el conjunto de datos publicado.

#### Scenario: Ninguna afirmación queda desmentida por sus propios datos
- **WHEN** alguien lee una afirmación de las sesiones 3 o 4 sobre la tabla del salón
- **THEN** esa afirmación es cierta con el conjunto de datos publicado

### Requirement: Los cambios forzados por los datos nuevos quedan anotados
EL SISTEMA SHALL dejar constancia, junto a cada texto o figura que se reescriba por el
cambio de conjunto de datos, de que su contenido ya no es el que se proyectó en clase y de
por qué.

#### Scenario: La divergencia con lo ya dado en clase está escrita
- **WHEN** alguien abre el código de un texto o una figura reescritos por el cambio de conjunto de datos
- **THEN** encuentra anotado que su contenido ya no es el que se proyectó en clase, y por qué
