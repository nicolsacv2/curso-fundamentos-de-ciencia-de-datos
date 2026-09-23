## ADDED Requirements

### Requirement: El año se ve antes que la tabla
EL SISTEMA SHALL mostrar, antes de la tabla de contingencia, el año inventado entero como una
secuencia de días coloreados por estado del cielo, con el primer y el último día señalados y
con una leyenda que diga qué estado es cada color.

#### Scenario: La tira del año
- **WHEN** alguien llega al ejemplo de la entrada
- **THEN** ve los días del año uno por uno, cada uno con su estado
- **AND** el primer y el último día están señalados
- **AND** hay dónde aprender qué estado es cada color

### Requirement: La unidad de la tabla es el par de días consecutivos
EL SISTEMA SHALL enunciar que cada celda de la tabla cuenta pares de días consecutivos —el día
observado y el día siguiente—, que un año de N días da N − 1 pares, y mostrar las dos cifras.

#### Scenario: De los días a los pares
- **WHEN** alguien lee cómo se construye la tabla
- **THEN** se enuncia que lo que se cuenta son pares de días consecutivos
- **AND** ve cuántos días tiene el año y cuántos pares da
- **AND** el total de la tabla es el número de pares, no el de días

### Requirement: Los márgenes de cada estado cuadran entre sí
EL SISTEMA SHALL mostrar, para cada estado del cielo, su suma como día observado y su suma
como día siguiente lado a lado, y enunciar que difieren como máximo en uno porque cada día es
observado una vez y siguiente una vez salvo el primero y el último del año.

#### Scenario: Las dos sumas de cada estado
- **WHEN** alguien mira los márgenes de la tabla
- **THEN** ve, para cada estado, la suma por fila y la suma por columna una junto a otra
- **AND** ninguna pareja difiere en más de uno
- **AND** se enuncia por qué

#### Scenario: La diferencia se explica con el primer y el último día
- **WHEN** las dos sumas de un estado difieren
- **THEN** se dice que es porque el primer día del año tiene ese estado, o porque lo tiene el último
- **AND** eso coincide con lo que la tira del año muestra

### Requirement: Los rótulos nombran el día observado y el día siguiente
EL SISTEMA SHALL nombrar las dos variables de la tabla como «día observado» y «día siguiente»
en todas las cabeceras, fórmulas, figuras y prosa de la entrada, y no como «hoy» y «mañana».

#### Scenario: Ni hoy ni mañana nombran la tabla
- **WHEN** alguien recorre la entrada de la sesión 7
- **THEN** las filas de la tabla se llaman día observado y las columnas día siguiente
- **AND** la notación de la probabilidad condicional se escribe con esos dos nombres
- **AND** ninguna cabecera, figura ni frase llama «hoy» o «mañana» a las variables de la tabla

## MODIFIED Requirements

### Requirement: Cada fila es una probabilidad condicional
EL SISTEMA SHALL mostrar los perfiles de fila y de columna de la tabla —cada recuento dividido
por su marginal— y enunciar que un perfil de fila es la probabilidad de cada estado del día
siguiente dado el estado del día observado, escribiendo la notación P(A | B) y leyéndola en
palabras sobre la celda que da nombre al ejemplo: llovió el día observado y llueve el día
siguiente.

#### Scenario: Del recuento a la probabilidad condicional
- **WHEN** alguien lee los perfiles de la tabla
- **THEN** ve cada fila y cada columna convertida en proporciones que suman uno
- **AND** ve escrita la notación P(A | B) y su lectura en palabras sobre la celda de lluvia el día observado y lluvia el día siguiente
- **AND** la cifra de esa celda sale de la tabla generada y no está escrita a mano

### Requirement: La tabla de contingencia es un ejemplo propio y declarado
EL SISTEMA SHALL construir la tabla de contingencia de la entrada contando, sobre un año de días
inventados, los pares de días consecutivos según el estado del cielo del día observado y el
del día siguiente —tres estados: sol, nublado y lluvia—, decir en pantalla que los días son
inventados, y mostrar la tabla con las sumas por fila, por columna y el total de pares.

#### Scenario: La tabla cruzada, con sus márgenes
- **WHEN** alguien mira la tabla de contingencia de la entrada
- **THEN** ve un recuento de pares por cada combinación de estado del día observado y estado del día siguiente
- **AND** ve la suma de cada fila, la de cada columna y el total de pares
- **AND** está escrito que los días son inventados

#### Scenario: La tabla es el recuento del año que se mostró
- **WHEN** se cuentan los pares de días consecutivos de la tira del año
- **THEN** salen exactamente las celdas de la tabla

#### Scenario: El salón no aparece
- **WHEN** alguien recorre la entrada de la sesión 7
- **THEN** no ve ningún dato de la tabla del salón

### Requirement: Las cifras de las tablas se generan, no se escriben a mano
EL SISTEMA SHALL producir el año, la tabla cruzada, sus marginales, los perfiles, las esperadas,
el chi-cuadrado, la medida de asociación y las tres tablas de Simpson con un proceso repetible
que parta de constantes declaradas en un solo sitio —la regla con la que se sortea el cielo de
cada día, la semilla y el número de días—, que cuente la tabla desde el año en vez de
declararla, que comprueba antes de publicar que el total es el número de pares, que para cada
estado las dos sumas difieren como máximo en uno y exactamente en lo que el primer y el último
día explican, que las esperadas conservan los marginales, que llover el día observado hace más
probable llover el siguiente —la historia que el ejemplo cuenta— y que la inversión de Simpson
ocurre, y que no necesita instalar nada.

#### Scenario: Regenerar da lo mismo
- **WHEN** se generan las cifras dos veces
- **THEN** los dos resultados son idénticos

#### Scenario: Una identidad rota detiene la publicación
- **WHEN** el total no es el número de pares, las dos sumas de un estado difieren en más de uno o en algo que el primer y el último día no explican, las esperadas no conservan los marginales, llover el día observado no hace más probable llover el siguiente, o la inversión de Simpson no ocurre
- **THEN** el proceso falla y no publica

#### Scenario: La tabla no se puede declarar a mano
- **WHEN** alguien busca en el proceso dónde están escritas las celdas de la tabla
- **THEN** no las encuentra: solo encuentra la regla, la semilla y el número de días

#### Scenario: No hace falta instalar nada
- **WHEN** alguien regenera las cifras
- **THEN** no necesita instalar ninguna dependencia ni tener ningún archivo de datos
