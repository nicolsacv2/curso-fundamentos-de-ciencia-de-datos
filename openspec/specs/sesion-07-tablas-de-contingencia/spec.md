# sesion-07-tablas-de-contingencia Specification

## Purpose

Cubre la entrada de la sesión 7: cómo se leen dos variables no numéricas a la vez con una
tabla de contingencia sobre un ejemplo propio y declarado como inventado —el cielo del día
observado contra el del día siguiente, contado en pares de días consecutivos de un año
simulado: el año, la unidad, frecuencias conjuntas y marginales que cuadran entre sí,
probabilidad condicional, independencia, chi-cuadrado y una medida de asociación—, y cómo la
paradoja de Simpson que la sesión 4 dejó plantada se resuelve con una tabla de tres entradas.
La tabla del salón no aparece aquí: entra a la sesión en el cierre.

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
por su marginal— y enunciar que un perfil de fila es la probabilidad de cada estado del día
siguiente dado el estado del día observado, escribiendo la notación P(A | B) y leyéndola en
palabras sobre la celda que da nombre al ejemplo: llovió el día observado y llueve el día
siguiente.

#### Scenario: Del recuento a la probabilidad condicional
- **WHEN** alguien lee los perfiles de la tabla
- **THEN** ve cada fila y cada columna convertida en proporciones que suman uno
- **AND** ve escrita la notación P(A | B) y su lectura en palabras sobre la celda de lluvia el día observado y lluvia el día siguiente
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

### Requirement: Las fórmulas de la entrada se componen sin solapes
EL SISTEMA SHALL dibujar las fórmulas de la entrada de modo que ningún subíndice ni
superíndice se monte sobre el símbolo que le sigue, que toda raíz cuadrada lleve su barra
encima de todo el radicando y a su altura, y que cada letra griega se lea como la letra
que es.

#### Scenario: Un índice no pisa lo que sigue
- **WHEN** una fórmula de la entrada lleva un subíndice o un superíndice de más de una letra
- **THEN** el símbolo que sigue empieza después del índice, sin tocarlo

#### Scenario: La raíz de la V de Cramér cubre su radicando
- **WHEN** alguien mira la fórmula de la V de Cramér
- **THEN** la barra de la raíz cubre la fracción entera
- **AND** el signo de la raíz tiene la altura de la fracción

#### Scenario: La ji es una ji
- **WHEN** una fórmula de la entrada escribe χ
- **THEN** se lee como la letra griega y no como una equis

#### Scenario: Un solape no llega a la pared
- **WHEN** dos textos de una fórmula de la sesión 7 se pisan
- **THEN** la comprobación de figuras del repositorio lo reporta y falla
