# material-publicado Specification

## Purpose

Mantiene coherente el material que ya se dio en clase: ninguna sesión publicada puede
prometer algo que una sesión posterior no cumple. Cubre las dos promesas que las sesiones
2 y 4 hacían sobre la 5, y la constancia de que corregir la 2 la separa del curso original.

## Requirements

### Requirement: La sesión 2 no promete que la tabla se grafique en la 5
EL SISTEMA SHALL no mostrar en la sesión 2 ninguna flecha que anuncie que la tabla del
salón se grafica en la sesión 5.

#### Scenario: La flecha ya no está
- **WHEN** alguien mira la figura de destinos de la sesión 2
- **THEN** no hay ninguna flecha que anuncie que la tabla del salón se grafica en la sesión 5

### Requirement: Los tres destinos ciertos se conservan
EL SISTEMA SHALL conservar en esa figura de la sesión 2 los tres destinos que siguen
siendo ciertos: se limpia en la 3, se describe en la 4 y se modela en la 8.

#### Scenario: La figura mantiene lo que sí se cumple
- **WHEN** alguien mira la figura de destinos de la sesión 2
- **THEN** siguen los tres destinos: se limpia en la 3, se describe en la 4 y se modela en la 8

### Requirement: La divergencia con el curso original queda anotada
EL SISTEMA SHALL dejar constancia, junto a la figura corregida de la sesión 2, de que su
texto ya no coincide con el del curso original y de por qué.

#### Scenario: La razón está junto a la figura
- **WHEN** alguien abre el código de la figura corregida de la sesión 2
- **THEN** encuentra anotado que su texto ya no coincide con el del curso original, y por qué

### Requirement: El cierre de la sesión 4 deja de prometer el dibujo
EL SISTEMA SHALL dejar de anunciar en el cierre de la sesión 4 que los resúmenes
calculados allí se vuelven dibujo en la sesión siguiente.

#### Scenario: La promesa desaparece
- **WHEN** alguien lee el cierre de la sesión 4
- **THEN** no se anuncia que los resúmenes calculados allí se vuelvan dibujo en la sesión siguiente

### Requirement: El cierre de la sesión 4 anuncia lo que la 5 sí trata
EL SISTEMA SHALL anunciar en el cierre de la sesión 4 el contenido que la sesión 5 sí
trata.

#### Scenario: El puente se rehace bien
- **WHEN** alguien lee el cierre de la sesión 4
- **THEN** se anuncia el contenido que la sesión 5 sí trata

### Requirement: La sesión 4 deja de prometer causalidad en la sesión 6
EL SISTEMA SHALL dejar de anunciar en la sesión 4 que la sesión 6 trata de causalidad o
resuelve la paradoja de Simpson.

#### Scenario: Las dos promesas desaparecen
- **WHEN** alguien recorre la sesión 4
- **THEN** no se anuncia que la sesión 6 trate de causalidad
- **AND** no se anuncia que la sesión 6 resuelva la paradoja de Simpson

#### Scenario: La promesa que sí se cumple se anuncia
- **WHEN** alguien recorre la sesión 4
- **THEN** se anuncia que la paradoja de Simpson se resuelve en la sesión 7

### Requirement: La paradoja de Simpson sigue planteada
EL SISTEMA SHALL conservar en la sesión 4 el planteamiento de la paradoja de Simpson y la
incomodidad que produce, y decir en qué sesión se resuelve: la 7.

#### Scenario: Se quita la promesa, no el contenido
- **WHEN** alguien recorre la sesión 4
- **THEN** la paradoja de Simpson sigue planteada con su figura
- **AND** sigue enunciada la advertencia de que una asociación puede invertirse al agrupar

#### Scenario: La cita es la que se cumple
- **WHEN** alguien lee dónde se resuelve la paradoja
- **THEN** la sesión que se anuncia es la 7
- **AND** la sesión 7 la resuelve

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
EL SISTEMA SHALL listar en el índice del curso las nueve sesiones, construidas y
pendientes, en orden, y declarar en la portada y en la cabecera de cada sesión el total de
nueve sin que ese número esté escrito en más de un sitio.

#### Scenario: No falta ninguna fila
- **WHEN** alguien abre el índice del curso
- **THEN** ve las nueve sesiones en orden
- **AND** las que todavía no están construidas se distinguen de las que sí

#### Scenario: El total vive en un solo sitio
- **WHEN** se busca dónde está escrito cuántas sesiones tiene el curso
- **THEN** se encuentra en un único lugar
- **AND** la portada, la cabecera «Sesión NN de NN» y las horas totales salen de ahí

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
