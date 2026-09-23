# datos-del-salon Specification

## Purpose

Fija el conjunto de datos con el que trabaja el curso: las respuestas del formulario de la
sesión 2, publicadas en un único archivo fuera de las sesiones, con las columnas que se
pueden publicar sin reidentificar a nadie, y leído por las sesiones 3, 4 y 6 desde el
mismo sitio.

## Requirements

### Requirement: Un único conjunto compartido
EL SISTEMA SHALL publicar las respuestas del formulario de la sesión 2 en un solo
conjunto de datos, fuera del material de cualquier sesión concreta.

#### Scenario: El conjunto no pertenece a una sesión
- **WHEN** se busca de dónde salen las respuestas del formulario
- **THEN** hay un único conjunto de datos
- **AND** no vive dentro del material de ninguna sesión

### Requirement: Las sesiones 3, 4 y 6 leen del mismo sitio
EL SISTEMA SHALL hacer que las sesiones 3, 4, 6 y 7 tomen las respuestas del formulario de
ese conjunto compartido, y de ningún otro.

#### Scenario: Ninguna sesión conserva su copia
- **WHEN** se revisa de dónde toma cada sesión las respuestas del formulario
- **THEN** las sesiones 3, 4, 6 y 7 las toman del conjunto compartido
- **AND** no queda ninguna copia propia dentro de una sesión

### Requirement: El conjunto trae todas las respuestas del formulario
EL SISTEMA SHALL publicar todas las respuestas que el formulario haya recibido, sin
descartar ninguna.

#### Scenario: No se recorta el número de respuestas
- **WHEN** se compara el número de respuestas del conjunto con el del formulario de origen
- **THEN** coinciden

### Requirement: Los valores se copian tal como llegaron
EL SISTEMA SHALL copiar cada valor exactamente como lo entregó el formulario, sin corregir
espacios, tildes, mayúsculas ni unidades, salvo en las columnas que el conjunto declare
explícitamente como derivadas.

#### Scenario: Los defectos se conservan
- **WHEN** alguien compara un valor del conjunto con el del formulario
- **THEN** coinciden carácter por carácter
- **AND** los espacios sobrantes, las tildes faltantes y las unidades mezcladas siguen ahí

#### Scenario: Una columna derivada es la excepción declarada
- **WHEN** el valor de una columna no coincide con el del formulario
- **THEN** esa columna está declarada como derivada
- **AND** ninguna columna no declarada como derivada se aparta de lo que entregó el formulario

### Requirement: Una celda sin responder se distingue de un cero
EL SISTEMA SHALL representar una celda que nadie respondió de forma distinguible de una
que se respondió con cero.

#### Scenario: El hueco no se confunde con un valor
- **WHEN** se lee una celda que nadie respondió
- **THEN** se distingue de una celda respondida con cero

### Requirement: Hay correcciones que ninguna regla encuentra
EL SISTEMA SHALL permitir corregir a mano un valor cuya corrección no se pueda deducir del
propio valor.

#### Scenario: Una localidad escrita como municipio
- **WHEN** alguien responde con una localidad de una ciudad donde se pedía el municipio
- **THEN** ese valor se puede corregir a mano a la ciudad que le corresponde

### Requirement: Una corrección manual no toca la tabla cruda
EL SISTEMA SHALL conservar en el conjunto publicado el valor exactamente como se
respondió, aunque exista una corrección manual para él.

#### Scenario: El original sobrevive a su corrección
- **WHEN** alguien mira en el conjunto publicado una celda que tiene corrección manual
- **THEN** la celda sigue mostrando el valor tal como se respondió

### Requirement: Una corrección manual solo mueve lo derivado
EL SISTEMA SHALL aplicar las correcciones manuales a los recuentos y análisis que se
derivan de la tabla, y no a los valores publicados.

#### Scenario: El recuento cuenta la corrección
- **WHEN** se cuenta cuántas personas viven en una ciudad
- **THEN** el recuento incluye las filas corregidas a mano

### Requirement: Cada corrección manual lleva su motivo escrito
EL SISTEMA SHALL declarar, para cada corrección manual, qué valor sustituye, por cuál, y
por qué.

#### Scenario: La decisión es auditable
- **WHEN** alguien busca por qué una fila cuenta como una ciudad que no escribió
- **THEN** encuentra declarado el valor original, el valor corregido y el motivo

### Requirement: Las correcciones manuales se pueden enumerar
EL SISTEMA SHALL publicar la lista de las correcciones manuales aplicadas, para que el
material del curso pueda mostrarlas.

#### Scenario: La lista está disponible
- **WHEN** una sesión necesita decir qué se corrigió a mano
- **THEN** dispone de la lista de correcciones con su motivo

### Requirement: Una corrección manual no es una escritura más
EL SISTEMA SHALL distinguir un valor corregido a mano de las distintas escrituras de un
mismo nombre.

#### Scenario: Las dos clases de defecto no se mezclan
- **WHEN** alguien mira el recuento de las maneras de escribir un mismo nombre
- **THEN** los valores corregidos a mano no aparecen entre ellas
- **AND** aparecen aparte, señalados como corregidos

### Requirement: El material dice cuál es la diferencia
EL SISTEMA SHALL enunciar que una corrección manual hace falta porque lo que se necesita
para corregirla no está en la tabla.

#### Scenario: Se explica por qué no basta una regla
- **WHEN** alguien lee sobre un valor corregido a mano
- **THEN** se enuncia que ninguna regla de estandarización lo encuentra
- **AND** se enuncia que el conocimiento que hace falta no está en los datos

### Requirement: No se publica lo que reidentifica
EL SISTEMA SHALL excluir del conjunto las columnas que permitirían reconocer a una persona
concreta de la clase por el detalle de lo que dicen de ella, y publicar en su lugar, cuando
exista, una versión de esa información que el curso necesite analizar.

#### Scenario: Las columnas sensibles no están
- **WHEN** se revisan las columnas publicadas
- **THEN** no está la marca temporal del envío
- **AND** no está el nombre exacto del programa de pregrado
- **AND** no está el año de nacimiento, del que solo se publica la edad derivada
- **AND** no está el grupo de edad, que dice lo mismo que la edad con menos detalle

#### Scenario: No se publica dos veces la misma información
- **WHEN** el conjunto publica una columna derivada de otra del formulario
- **THEN** no publica además la columna de la que se derivó
- **AND** no publica otra columna que diga lo mismo con menos detalle

#### Scenario: La decisión de publicar una columna sensible queda registrada
- **WHEN** se publica una columna que antes se excluía por reidentificar
- **THEN** junto al conjunto queda escrito que se decidió publicarla
- **AND** queda escrito qué se aceptó a cambio

### Requirement: El motivo de cada exclusión queda escrito
EL SISTEMA SHALL dejar anotado, junto al conjunto, por qué se excluye cada columna que no
se publica.

#### Scenario: La decisión es auditable
- **WHEN** alguien abre el conjunto o lo que lo genera
- **THEN** encuentra escrito por qué no se publica cada columna excluida

### Requirement: El conjunto trae variables categóricas y cuantitativas
EL SISTEMA SHALL publicar a la vez columnas categóricas y columnas cuantitativas, en
número suficiente para que un análisis factorial de cada tipo tenga sentido.

#### Scenario: Hay de los dos tipos
- **WHEN** se revisan las columnas publicadas
- **THEN** hay al menos cuatro columnas categóricas
- **AND** hay al menos cuatro columnas cuantitativas

### Requirement: Cada columna declara su tipo
EL SISTEMA SHALL declarar para cada columna publicada si es categórica, ordinal o
cuantitativa.

#### Scenario: El tipo no hay que adivinarlo
- **WHEN** se lee la descripción de una columna del conjunto
- **THEN** dice si es categórica, ordinal o cuantitativa

#### Scenario: Un orden no se disfraza de cantidad ni de nombre
- **WHEN** una columna tiene niveles que se ordenan pero no se suman
- **THEN** se declara ordinal
- **AND** no se declara ni categórica ni cuantitativa

### Requirement: Cada columna se nombra por su variable
EL SISTEMA SHALL identificar cada columna publicada por el nombre de su variable, y no por
la letra que le corresponde en la hoja de cálculo de la que sale.

#### Scenario: La tabla nombra sus columnas
- **WHEN** alguien mira la tabla publicada
- **THEN** cada columna se identifica por el nombre de su variable
- **AND** ninguna se identifica por una letra de hoja de cálculo

### Requirement: La letra de la hoja de cálculo no aparece en ninguna parte
EL SISTEMA SHALL no mostrar en ninguna sesión la letra que una columna tiene en la hoja de
cálculo de origen.

#### Scenario: No queda rastro de la hoja de origen
- **WHEN** alguien recorre cualquier sesión que use la tabla del salón
- **THEN** no encuentra ninguna columna designada por una letra de hoja de cálculo

### Requirement: El texto también nombra por variable
EL SISTEMA SHALL referirse a una columna, en el texto que se lee en pantalla, por el nombre
de su variable.

#### Scenario: La prosa no dice «la columna E»
- **WHEN** alguien lee un texto que menciona una columna de la tabla del salón
- **THEN** la menciona por el nombre de su variable

### Requirement: Una celda se sigue pudiendo señalar
EL SISTEMA SHALL permitir señalar una celda concreta combinando el nombre de su variable
con el número de su fila.

#### Scenario: Una actividad se puede responder
- **WHEN** alguien tiene que señalar una celda de la tabla
- **THEN** puede hacerlo con el nombre de la variable y el número de la fila
- **AND** cada fila lleva su número a la vista

### Requirement: Las actividades que citaban coordenadas se reescriben
EL SISTEMA SHALL enunciar las actividades que señalaban celdas por coordenada de hoja de
cálculo con el nombre de la variable y el número de fila.

#### Scenario: Ninguna actividad pide una coordenada de hoja
- **WHEN** alguien lee una actividad que señala celdas de la tabla del salón
- **THEN** las señala por variable y número de fila

### Requirement: El conjunto se genera, no se escribe a mano
EL SISTEMA SHALL producir el conjunto a partir del archivo de respuestas del formulario
mediante un proceso repetible, y advertirlo en el propio archivo.

#### Scenario: El archivo avisa de que es generado
- **WHEN** alguien abre el conjunto
- **THEN** encuentra escrito que es generado y que no se edita a mano
- **AND** encuentra de qué archivo de respuestas sale

### Requirement: Volver a generarlo da lo mismo
EL SISTEMA SHALL producir el mismo conjunto cada vez que se genere a partir del mismo
archivo de respuestas.

#### Scenario: El proceso es determinista
- **WHEN** se genera el conjunto dos veces a partir del mismo archivo de respuestas
- **THEN** los dos resultados son idénticos

### Requirement: La tabla limpia se publica como hoja de cálculo
EL SISTEMA SHALL publicar la tabla resultante de la limpieza en un archivo de hoja de
cálculo, además de en el conjunto que la aplicación lee.

#### Scenario: Se puede abrir sin programar
- **WHEN** alguien quiere trabajar con la tabla limpia fuera de la aplicación
- **THEN** dispone de un archivo de hoja de cálculo con ella

### Requirement: Ese archivo conserva la tabla original
EL SISTEMA SHALL incluir en ese archivo, en una hoja aparte, las respuestas tal como
llegaron.

#### Scenario: El original viaja con la copia
- **WHEN** alguien abre el archivo de hoja de cálculo
- **THEN** encuentra una hoja con las respuestas tal como llegaron
- **AND** otra con la tabla después de la limpieza

### Requirement: La hoja original se declara intocable
EL SISTEMA SHALL advertir dentro del archivo que la hoja de las respuestas originales no
se corrige, no se ordena y no se le borra ninguna fila.

#### Scenario: La regla está escrita donde se puede romper
- **WHEN** alguien abre el archivo de hoja de cálculo
- **THEN** encuentra advertido que la hoja de las respuestas originales no se toca

### Requirement: El archivo lleva una bitácora
EL SISTEMA SHALL incluir en ese archivo una hoja de bitácora con las decisiones que llevan
de la tabla original a la limpia.

#### Scenario: La bitácora está
- **WHEN** alguien abre el archivo de hoja de cálculo
- **THEN** encuentra una hoja de bitácora

### Requirement: Cada decisión ocupa su propia fila
EL SISTEMA SHALL registrar en la bitácora una fila por cada decisión tomada sobre los
datos.

#### Scenario: Las decisiones no se resumen en un párrafo
- **WHEN** alguien lee la bitácora
- **THEN** cada decisión ocupa su propia fila

### Requirement: Qué dice cada fila de la bitácora
EL SISTEMA SHALL indicar, para cada decisión registrada, en qué paso se tomó, qué
operación fue, sobre qué variable, sobre qué filas, qué había antes, qué quedó después, a
cuántos valores afectó y por qué.

#### Scenario: Una decisión se puede reconstruir entera
- **WHEN** alguien lee una fila de la bitácora
- **THEN** puede decir en qué paso, sobre qué variable y sobre qué filas se actuó
- **AND** qué valor había antes y cuál quedó después
- **AND** a cuántos valores afectó
- **AND** por qué se tomó esa decisión

### Requirement: El motivo nunca falta
EL SISTEMA SHALL registrar un motivo para toda decisión de la bitácora, sin excepción.

#### Scenario: Ninguna fila se queda sin razón
- **WHEN** alguien recorre la bitácora entera
- **THEN** ninguna fila carece de motivo

### Requirement: La bitácora dice qué se puede deshacer
EL SISTEMA SHALL indicar, para cada decisión registrada, si se puede deshacer.

#### Scenario: Lo reversible se distingue de lo que no
- **WHEN** alguien lee una fila de la bitácora
- **THEN** sabe si esa decisión se puede deshacer

### Requirement: Lo que se decidió no hacer también se registra
EL SISTEMA SHALL registrar en la bitácora las decisiones de NO aplicar un tratamiento,
igual que las de aplicarlo.

#### Scenario: Una regla que no se aplicó deja rastro
- **WHEN** se decide no aplicar un tratamiento a una variable
- **THEN** esa decisión aparece en la bitácora con su motivo

### Requirement: La bitácora no se llena de filas sin efecto
EL SISTEMA SHALL evitar registrar como decisión un tratamiento que no cambió nada y que
tampoco se decidió omitir.

#### Scenario: El registro se puede leer entero
- **WHEN** alguien recorre la bitácora
- **THEN** no encuentra filas que digan únicamente que no ocurrió nada

### Requirement: El archivo declara cómo se genera
EL SISTEMA SHALL advertir dentro del archivo que es generado, con qué se genera y de
cuándo es.

#### Scenario: Nadie lo edita a mano por error
- **WHEN** alguien abre el archivo de hoja de cálculo
- **THEN** encuentra escrito que es generado, con qué, y de cuándo es

### Requirement: El archivo se puede regenerar sin instalar nada
EL SISTEMA SHALL permitir regenerar ese archivo sin necesidad de instalar dependencias.

#### Scenario: Se reconstruye con el intérprete del sistema
- **WHEN** alguien regenera el archivo de hoja de cálculo
- **THEN** no necesita instalar ninguna dependencia

### Requirement: Regenerar el archivo da el mismo archivo
EL SISTEMA SHALL producir un archivo de hoja de cálculo idéntico byte a byte cada vez que
se genere a partir de los mismos datos.

#### Scenario: Volver a generarlo no produce un cambio
- **WHEN** se genera el archivo de hoja de cálculo dos veces sobre los mismos datos
- **THEN** los dos resultados son idénticos byte a byte

#### Scenario: El contenido es lo único que lo cambia
- **WHEN** se genera el archivo en dos momentos distintos sin que los datos cambien
- **THEN** los dos resultados son idénticos

### Requirement: El archivo publicado no reidentifica
EL SISTEMA SHALL incluir en ese archivo únicamente las columnas que el conjunto publicado
ya publica.

#### Scenario: No entra por la puerta de atrás lo que se excluyó
- **WHEN** se comparan las columnas del archivo de hoja de cálculo con las del conjunto publicado
- **THEN** son las mismas

### Requirement: El origen y la fecha quedan declarados
EL SISTEMA SHALL declarar junto al conjunto de qué formulario proviene y a qué momento
corresponde la captura.

#### Scenario: La procedencia está escrita
- **WHEN** alguien abre el conjunto
- **THEN** encuentra de qué formulario proviene y a qué momento corresponde la captura

### Requirement: Una columna derivada declara de qué sale
EL SISTEMA SHALL dejar escrito, para cada columna derivada, de qué columna del formulario
procede y con qué regla se obtuvo.

#### Scenario: La derivación es auditable
- **WHEN** alguien abre el conjunto o lo que lo genera
- **THEN** encuentra, para cada columna derivada, de qué columna del formulario sale
- **AND** encuentra la regla con la que se obtuvo

### Requirement: Una derivación que depende del tiempo fija su referencia
SI el valor de una columna derivada depende de cuándo se calcule, ENTONCES EL SISTEMA SHALL
fijar y declarar el momento de referencia que se usó.

#### Scenario: El valor no cambia con el calendario
- **WHEN** se regenera el conjunto en una fecha distinta
- **THEN** la columna derivada da los mismos valores
- **AND** el momento de referencia que los produce está declarado junto al conjunto

### Requirement: El conjunto publica las columnas que el curso necesita analizar
EL SISTEMA SHALL publicar todas las columnas del formulario salvo las que se excluyan, y
dejar enumerado cuántas son unas y cuántas otras.

#### Scenario: El recuento cuadra
- **WHEN** se suman las columnas publicadas y las excluidas
- **THEN** el total es el número de columnas del formulario de origen

#### Scenario: Ninguna cifra de columnas se escribe a mano
- **WHEN** el material en pantalla dice cuántas columnas hay, de cada tipo o en total
- **THEN** esa cifra se obtiene del conjunto
- **AND** no está escrita literalmente en el texto

### Requirement: Una variable se escribe con el nombre que tiene
EL SISTEMA SHALL mostrar cada variable, allí donde una persona la lee, con el nombre con el
que esa cosa se escribe, aunque su clave interna sea distinta.

#### Scenario: El nombre proyectado no es una deformación de la clave
- **WHEN** alguien lee el nombre de una variable en el material del curso
- **THEN** lo ve escrito como se escribe esa cosa
- **AND** no ve una versión deformada para que la clave fuera un identificador válido

#### Scenario: La clave sigue sin parecerse a una letra de la hoja
- **WHEN** se revisan las claves de las columnas publicadas
- **THEN** ninguna coincide con una letra de columna de la hoja de cálculo de origen

### Requirement: El nombre de pantalla se declara una vez y se usa en todas partes
EL SISTEMA SHALL declarar ese nombre junto a la columna, y usarlo en todo lo que se entrega
o se proyecta, sin que cada figura o cada tabla decida el suyo.

#### Scenario: Pantalla y archivo dicen lo mismo
- **WHEN** se compara cómo se nombra una variable en el material y en la tabla que se entrega a la clase
- **THEN** coinciden

#### Scenario: Solo se declara donde hace falta
- **WHEN** la clave de una columna ya es el nombre de la cosa
- **THEN** esa columna no declara ningún nombre aparte
