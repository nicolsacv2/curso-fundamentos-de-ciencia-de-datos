# sesion-06-imputacion Specification

## Purpose

Cubre el paso de la sesión 6 —su bloque 2— en que los huecos y los valores marcados como
atípicos se rellenan por muestreo aleatorio de la propia columna: qué hace el método, qué
conserva, qué rompe, y cómo la tabla recuerda qué celdas inventó.

## Requirements

### Requirement: Los huecos se rellenan por muestreo aleatorio
EL SISTEMA SHALL rellenar los valores que faltan tomando al azar valores observados de la
misma columna.

#### Scenario: El método se enuncia
- **WHEN** alguien llega al paso de imputación de la sesión 6
- **THEN** se enuncia que los valores que faltan se rellenan tomando al azar valores observados de la misma columna

### Requirement: La regla de la caja no se aplica a una escala ordinal
EL SISTEMA SHALL no usar el rango intercuartílico para marcar atípicos en una variable que
sea un orden y no una cantidad.

#### Scenario: Un rango no tiene atípicos por dispersión
- **WHEN** alguien recorre el paso de atípicos de la sesión 6
- **THEN** ninguna variable ordinal tiene valores marcados como atípicos por la regla de la caja

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

### Requirement: Se dice cuál era el umbral y qué se agrupó
EL SISTEMA SHALL mostrar a partir de qué frecuencia un nivel se considera poco frecuente, y
qué niveles se agruparon por serlo.

#### Scenario: El criterio y su efecto están a la vista
- **WHEN** alguien mira el agrupamiento de niveles poco frecuentes
- **THEN** ve a partir de qué frecuencia un nivel se agrupa
- **AND** ve qué niveles se agruparon

### Requirement: Agrupar es el equivalente de la caja para lo que no es cantidad
EL SISTEMA SHALL presentar el agrupamiento de niveles poco frecuentes como el tratamiento
que le corresponde a una variable que no es una cantidad, en lugar de la regla de la caja.

#### Scenario: Los dos tratamientos quedan emparejados
- **WHEN** alguien lee el tratamiento de las variables ordinales
- **THEN** se presenta como lo que hace la regla de la caja, para una variable que no es una cantidad

### Requirement: Una variable ordinal no entra al análisis de componentes principales
EL SISTEMA SHALL dejar fuera del análisis de componentes principales las variables que sean
un orden y no una cantidad.

#### Scenario: El orden no entra donde se suman varianzas
- **WHEN** alguien mira qué variables entran al análisis de componentes principales
- **THEN** ninguna variable ordinal está entre ellas

### Requirement: Los atípicos entran al mismo tratamiento
EL SISTEMA SHALL tratar los valores marcados como atípicos en el paso anterior igual que
los valores que faltan.

#### Scenario: El atípico se convierte en hueco y se rellena
- **WHEN** alguien recorre el paso de imputación
- **THEN** se muestra que los valores marcados como atípicos se convierten en huecos y se rellenan igual que ellos

### Requirement: Se dice por qué el atípico se trata como un hueco
EL SISTEMA SHALL enunciar el motivo por el que un valor marcado como atípico se sustituye
en vez de eliminarse la fila entera.

#### Scenario: La alternativa descartada se nombra
- **WHEN** alguien lee el paso de imputación
- **THEN** se enuncia por qué se sustituye el valor en vez de eliminar la fila entera

### Requirement: El método se ve aplicado a un caso concreto
EL SISTEMA SHALL mostrar una celda concreta de la tabla antes y después de imputarla, y de
qué valores observados salió el valor que la ocupa.

#### Scenario: Una celda se sigue de principio a fin
- **WHEN** alguien mira el paso de imputación
- **THEN** ve una celda antes y después de imputarla
- **AND** ve de qué valores observados salió el valor que la ocupa

### Requirement: La imputación conserva la forma de la distribución
EL SISTEMA SHALL enunciar que rellenar con valores tomados al azar de la propia columna
conserva la forma de su distribución.

#### Scenario: La propiedad se enuncia
- **WHEN** alguien lee el paso de imputación
- **THEN** se enuncia que este método conserva la forma de la distribución de la columna

### Requirement: Esa conservación se ve dibujada
EL SISTEMA SHALL mostrar la distribución de una columna antes y después de imputarla.

#### Scenario: Las dos distribuciones se comparan
- **WHEN** alguien mira el paso de imputación
- **THEN** ve la distribución de una columna antes de imputarla y después

### Requirement: Se contrasta con rellenar con la media
EL SISTEMA SHALL mostrar qué le pasa a esa misma distribución si en vez de muestrear se
rellena con la media de la columna.

#### Scenario: El contraste está dibujado
- **WHEN** alguien mira el paso de imputación
- **THEN** ve qué le pasa a la distribución si se rellena con la media en vez de muestrear

### Requirement: Rellenar con la media estrecha la dispersión
EL SISTEMA SHALL enunciar que rellenar con la media reduce la dispersión de la columna, y
mostrar con cuánto.

#### Scenario: El efecto se cuantifica
- **WHEN** alguien lee el contraste con el relleno por la media
- **THEN** se enuncia que reduce la dispersión de la columna
- **AND** se muestra con cuánto

### Requirement: La imputación no crea información
EL SISTEMA SHALL enunciar que imputar no recupera el dato que faltaba y que el valor
puesto es una invención plausible, no una medición.

#### Scenario: La advertencia está escrita
- **WHEN** alguien lee el paso de imputación
- **THEN** se enuncia que el valor puesto es una invención plausible y no una medición

### Requirement: Qué rompe el muestreo aleatorio
EL SISTEMA SHALL enunciar que este método no conserva la relación entre columnas.

#### Scenario: El precio del método se nombra
- **WHEN** alguien lee el paso de imputación
- **THEN** se enuncia que este método no conserva la relación entre columnas

### Requirement: Una columna puede quedar fuera en vez de imputarse
EL SISTEMA SHALL dejar fuera de la imputación toda columna en la que el número de valores
a inventar sea tan alto que el resultado dejaría de sostenerse.

#### Scenario: La columna no se imputa
- **WHEN** alguien recorre el paso de imputación de la sesión 6
- **THEN** la columna de horas de pantalla al día no se imputa

### Requirement: Descartarla se cuenta, no se omite
EL SISTEMA SHALL decir en pantalla qué columna quedó fuera de la imputación y por qué.

#### Scenario: El motivo está escrito
- **WHEN** alguien lee el paso de imputación
- **THEN** se dice qué columna quedó fuera
- **AND** se dice por qué

### Requirement: El motivo se da con sus cifras
EL SISTEMA SHALL mostrar, para la columna descartada, cuántos valores le faltaban, cuántos
quedaron marcados como atípicos y qué proporción del total suman entre los dos.

#### Scenario: La razón es verificable
- **WHEN** alguien lee por qué esa columna quedó fuera
- **THEN** ve cuántos valores le faltaban, cuántos quedaron marcados como atípicos y qué proporción del total suman

### Requirement: Descartar es un resultado del método
EL SISTEMA SHALL presentar el descarte de esa columna como una conclusión de los pasos
anteriores, y no como un fallo de la limpieza.

#### Scenario: La sesión no lo presenta como un tropiezo
- **WHEN** alguien lee el pasaje en que se descarta esa columna
- **THEN** se presenta como una conclusión de haber descrito la columna y dibujado su caja

### Requirement: La columna descartada sigue en la tabla
EL SISTEMA SHALL conservar esa columna en el conjunto de datos publicado, con sus huecos,
aunque no entre en la imputación.

#### Scenario: Otras sesiones la siguen usando
- **WHEN** se revisa el conjunto de datos publicado
- **THEN** la columna descartada sigue estando con sus huecos

### Requirement: Se ve cuántos valores se inventaron
EL SISTEMA SHALL indicar cuántos valores de cada columna quedaron imputados y qué
proporción del total representan.

#### Scenario: El recuento de imputados está a la vista
- **WHEN** alguien mira el resultado de la imputación
- **THEN** se indica cuántos valores de cada columna quedaron imputados y qué proporción del total representan

### Requirement: Los valores imputados se distinguen de los observados
EL SISTEMA SHALL señalar en la tabla ya imputada qué celdas llevan un valor inventado.

#### Scenario: La tabla dice qué se inventó
- **WHEN** alguien mira la tabla ya imputada
- **THEN** las celdas con un valor inventado están señaladas

### Requirement: El resultado es siempre el mismo
EL SISTEMA SHALL mostrar en clase un resultado de imputación fijo, que no cambia entre una
proyección y la siguiente.

#### Scenario: La clase ve lo mismo dos veces
- **WHEN** alguien abre la sesión 6 dos veces
- **THEN** los valores imputados son los mismos en las dos

### Requirement: Se dice que la repetibilidad es una decisión
EL SISTEMA SHALL enunciar que el resultado es repetible porque el azar está fijado, y que
sin fijarlo cada ejecución daría una tabla distinta.

#### Scenario: La semilla se explica sin código
- **WHEN** alguien lee el paso de imputación
- **THEN** se enuncia que el azar está fijado
- **AND** se enuncia que sin fijarlo cada ejecución daría una tabla distinta

### Requirement: La imputación no ocurre en el navegador
EL SISTEMA SHALL mostrar en clase valores imputados ya calculados de antemano, sin
generarlos en el momento de abrir la sesión.

#### Scenario: Nada se sortea durante la clase
- **WHEN** alguien abre la sesión 6
- **THEN** los valores imputados ya están calculados
- **AND** no se sortea ninguno al abrirla

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
