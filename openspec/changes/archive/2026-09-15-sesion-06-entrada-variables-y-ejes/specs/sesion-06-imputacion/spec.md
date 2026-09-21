## MODIFIED Requirements

### Requirement: Los niveles poco frecuentes se agrupan
EL SISTEMA SHALL agrupar en una sola categoría los niveles de una variable ordinal o
categórica que muy poca gente eligió, salvo los niveles extremos de una variable ordinal.

#### Scenario: Los niveles delgados se funden
- **WHEN** alguien recorre el tratamiento de las variables ordinales
- **THEN** los niveles que muy poca gente eligió aparecen agrupados en una sola categoría

#### Scenario: El extremo de un orden sobrevive al agrupamiento
- **WHEN** el nivel más alto o el más bajo de una variable ordinal cae por debajo del umbral
- **THEN** no se agrupa
- **AND** sigue apareciendo como nivel propio

#### Scenario: La excepción se explica donde se aplica
- **WHEN** alguien mira el agrupamiento de niveles de una variable ordinal
- **THEN** se enuncia que sus niveles extremos no se agrupan
- **AND** se enuncia por qué

### Requirement: Se dice por qué una escala ordinal queda fuera de esa regla
EL SISTEMA SHALL enunciar que los extremos de un orden acotado son respuestas válidas por
construcción y no anomalías, tanto si sus niveles son números como si son etiquetas.

#### Scenario: El motivo está escrito
- **WHEN** alguien lee por qué una variable ordinal no pasa por la regla de la caja
- **THEN** se enuncia que los extremos de un orden acotado son respuestas válidas y no anomalías

#### Scenario: El motivo no depende de que los niveles sean números
- **WHEN** una variable ordinal tiene por niveles etiquetas y no números
- **THEN** queda igualmente fuera de la regla de la caja
- **AND** el motivo que se da es el mismo

## ADDED Requirements

### Requirement: El tratamiento de lo ordinal se ve en más de una variable
EL SISTEMA SHALL aplicar y mostrar el tratamiento de las variables ordinales sobre todas
las que el conjunto declare ordinales, no sobre una sola.

#### Scenario: No queda ninguna ordinal sin tratar
- **WHEN** se comparan las variables ordinales del conjunto con las que aparecen en el paso de las ordinales
- **THEN** están todas

### Requirement: Un orden de etiquetas se reconoce como orden
EL SISTEMA SHALL enunciar que una variable cuyos niveles son etiquetas puede estar ordenada,
y que lo que la hace ordinal es que sus niveles se ordenen, no que se escriban con números.

#### Scenario: La distinción está escrita
- **WHEN** alguien lee el paso de las variables ordinales
- **THEN** se enuncia que lo que hace ordinal a una variable es que sus niveles se ordenen
- **AND** se enuncia que escribir los niveles con números no es lo que la hace ordinal

#### Scenario: Se distingue de una categórica
- **WHEN** alguien compara una variable ordinal de etiquetas con una categórica
- **THEN** se enuncia qué admite la ordinal que la categórica no admite

### Requirement: La tabla recuerda qué celdas se inventaron
EL SISTEMA SHALL marcar, antes de rellenarlas, las celdas que van a recibir un valor
inventado, y conservar esa marca en la tabla resultante.

#### Scenario: La marca sobrevive al relleno
- **WHEN** alguien mira la tabla ya imputada
- **THEN** puede distinguir cada celda inventada de una observada
- **AND** no necesita comparar con la tabla original para hacerlo

#### Scenario: La marca cubre las dos procedencias
- **WHEN** una celda se rellena porque nadie respondió
- **THEN** queda marcada
- **WHEN** una celda se rellena porque la regla de la caja descartó su valor
- **THEN** queda marcada igualmente

### Requirement: La marca viaja con el archivo que se entrega
EL SISTEMA SHALL incluir esas marcas en la tabla limpia que se publica para la clase, y no
solo en lo que se muestra en pantalla.

#### Scenario: El archivo entregado las trae
- **WHEN** alguien abre la tabla limpia publicada
- **THEN** encuentra, para cada variable que recibió valores inventados, cuáles fueron
- **AND** lo encuentra sin tener que leer el material de la sesión

### Requirement: Las marcas no entran al análisis de componentes principales
EL SISTEMA SHALL dejar las marcas de celda inventada fuera del análisis de componentes
principales.

#### Scenario: Una marca no es una cantidad
- **WHEN** alguien mira qué variables entran al análisis de componentes principales
- **THEN** ninguna marca de celda inventada está entre ellas

#### Scenario: El motivo está escrito
- **WHEN** alguien lee por qué las marcas no entran al análisis
- **THEN** se enuncia que no son cantidades

### Requirement: Un valor que la regla descartó no puede volver por la puerta del relleno
EL SISTEMA SHALL rellenar tomando valores únicamente de entre los que quedaron en pie tras
marcar los atípicos, de modo que un valor descartado por la regla no pueda acabar ocupando
otra celda.

#### Scenario: El atípico no se sortea
- **WHEN** se rellena una celda de una columna que tenía valores marcados como atípicos
- **THEN** el valor que entra no es ninguno de los que la regla marcó

#### Scenario: Lo descartado no está en la bolsa
- **WHEN** se examina de qué valores se puede sortear el relleno de una columna
- **THEN** ninguno de ellos es un valor que la regla haya marcado

### Requirement: Esa garantía se comprueba, no se confía
EL SISTEMA SHALL comprobar que ningún valor inventado es uno de los descartados, en vez de
dejar que dependa del orden en que ocurran los pasos.

#### Scenario: La comprobación distingue las dos bolsas
- **WHEN** se verifica la tabla imputada
- **THEN** se comprueba contra los valores que quedaron tras marcar los atípicos
- **AND** no contra todos los valores que la columna tenía al principio
