## MODIFIED Requirements

### Requirement: El resultado sobre la tabla del salón es pobre y se dice
EL SISTEMA SHALL indicar si las dos primeras componentes bastan para resumir esta tabla,
compararlo con lo que ocurrió con el conjunto de la sesión 5, y sostener ese juicio sobre
las cifras que el análisis haya dado, no sobre una afirmación escrita de antemano.

#### Scenario: La comparación con la sesión 5 está escrita
- **WHEN** alguien mira el resultado del análisis de la entrada
- **THEN** se indica si las dos primeras componentes bastan para resumir esta tabla
- **AND** se compara con lo que ocurrió en la sesión 5

#### Scenario: El juicio concuerda con las cifras
- **WHEN** se compara lo que el texto dice del resultado con el porcentaje que el análisis da
- **THEN** el texto no afirma nada que ese porcentaje contradiga
- **AND** el porcentaje que el texto cita sale del análisis y no está escrito a mano

## ADDED Requirements

### Requirement: Se dice qué hace que un análisis resuma bien o mal
EL SISTEMA SHALL enunciar que las dos primeras componentes resumen más cuanto más se
relacionen entre sí las variables que entran, y relacionar eso con el resultado obtenido.

#### Scenario: La explicación acompaña al resultado
- **WHEN** alguien lee por qué el resultado sale como sale
- **THEN** se enuncia que el resumen depende de cuánto se relacionen entre sí las variables que entran
- **AND** se relaciona con el resultado que la entrada acaba de obtener

### Requirement: Un par de variables que sí se relacionan se señala
SI entre las variables que entran al análisis hay alguna pareja que se relacione con
fuerza, ENTONCES EL SISTEMA SHALL señalarla y decir qué le hace al resultado.

#### Scenario: El caso concreto está a la vista
- **WHEN** dos variables del análisis se relacionan con fuerza entre sí
- **THEN** se nombran
- **AND** se dice qué aporta esa relación al resultado del análisis

### Requirement: Antes del análisis se muestra qué relaciones hay entre las variables
EL SISTEMA SHALL mostrar, después de la tabla limpia y antes del análisis de componentes
principales, cómo se relacionan entre sí las variables de la tabla, por pares.

#### Scenario: La exploración precede al análisis
- **WHEN** alguien recorre la entrada
- **THEN** ve cómo se relacionan las variables por pares antes de que empiece el análisis de componentes principales

### Requirement: Las tres combinaciones de tipos tienen su propia mirada
EL SISTEMA SHALL mostrar una forma de mirar dos variables a la vez para cada combinación de
tipos: cantidad con cantidad, cantidad con categoría, y categoría con categoría.

#### Scenario: Ninguna combinación queda sin mirar
- **WHEN** alguien mira la exploración de relaciones de la entrada
- **THEN** encuentra cómo se miran dos cantidades entre sí
- **AND** encuentra cómo se mira una cantidad contra una categoría
- **AND** encuentra cómo se miran dos categorías entre sí

#### Scenario: Cada mirada corresponde a los tipos que compara
- **WHEN** alguien compara dos variables de tipos dados
- **THEN** la figura que se le ofrece es la que corresponde a esa combinación de tipos
- **AND** no se usa sobre una categoría una figura que exija una cantidad

### Requirement: Una variable se ve sola en la diagonal
SI una comparación enfrenta variables del mismo tipo, ENTONCES EL SISTEMA SHALL mostrar en
la diagonal cada variable consigo misma, con la figura que le corresponde a una variable
sola de ese tipo.

#### Scenario: La diagonal no queda vacía
- **WHEN** alguien mira una comparación de variables del mismo tipo
- **THEN** la diagonal muestra cada variable por separado
- **AND** la figura de la diagonal es la que corresponde al tipo de esa variable

### Requirement: No se muestran todas las variables, y se dice por qué
EL SISTEMA SHALL mostrar en cada comparación un subconjunto de variables que se pueda leer
en pantalla, y enunciar con qué criterio se eligió.

#### Scenario: El criterio está escrito
- **WHEN** alguien mira una comparación que no incluye todas las variables
- **THEN** se enuncia con qué criterio se eligieron las que aparecen

#### Scenario: El criterio se calcula, no se elige a dedo
- **WHEN** se comprueba qué variables aparecen en una comparación
- **THEN** son las que el criterio enunciado selecciona
- **AND** ninguna está puesta o quitada al margen de ese criterio

### Requirement: La exploración sostiene lo que la entrada afirma después
EL SISTEMA SHALL hacer que lo que la entrada afirme sobre si las variables se relacionan
entre sí, y sobre lo que el análisis no pudo mirar, se apoye en lo mostrado en esa
exploración.

#### Scenario: La afirmación remite a lo que se vio
- **WHEN** la entrada afirma que las variables se relacionan poco entre sí
- **THEN** esa afirmación remite a la exploración que la clase acaba de ver

#### Scenario: La pregunta final tiene material delante
- **WHEN** la entrada termina preguntando qué falta
- **THEN** la clase ya ha visto qué estructura tienen las variables que el análisis no pudo mirar

### Requirement: Dos categorías se comparan aunque sus grupos sean de tamaños distintos
EL SISTEMA SHALL mostrar la comparación entre dos variables categóricas de modo que el
reparto de un grupo se pueda comparar con el de otro aunque uno tenga muchas más personas
que el otro.

#### Scenario: El tamaño del grupo no impide leer su reparto
- **WHEN** alguien compara dos niveles de una variable con muy distinto número de personas
- **THEN** puede comparar cómo se reparte la otra variable dentro de cada uno

### Requirement: Se ve sobre cuánta gente está hecha cada comparación
EL SISTEMA SHALL mostrar, junto a cada reparto, cuánta gente lo sostiene, de modo que un
reparto calculado sobre una persona no se lea igual que uno calculado sobre catorce.

#### Scenario: Un grupo pequeño se distingue de uno grande
- **WHEN** alguien mira el reparto de un nivel que eligió muy poca gente
- **THEN** se distingue de uno que eligió mucha
- **AND** la distinción no depende de leer una cifra

### Requirement: La identidad de un nivel no se confía solo al color
EL SISTEMA SHALL permitir saber qué nivel es cada parte de una comparación sin depender de
distinguir colores entre sí.

#### Scenario: Hay dónde aprender qué es cada color
- **WHEN** alguien mira una comparación cuyas partes se distinguen por color
- **THEN** encuentra en la figura dónde se dice qué nivel es cada color

#### Scenario: Dos partes contiguas no se funden en una
- **WHEN** dos partes de distinto nivel quedan una junto a otra
- **THEN** se distinguen por algo más que el color
