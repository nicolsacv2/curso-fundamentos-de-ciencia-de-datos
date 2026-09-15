## Purpose

Cubre el bloque 3 de la sesión 5: el círculo de correlaciones como la otra vista del mismo
análisis del bloque 2, construido paso a paso —centrar, transponer, normalizar— hasta
justificar por qué el coseno del ángulo entre dos flechas es la correlación que la entrada
definió con fórmula.

## ADDED Requirements

### Requirement: Transponer convierte cada variable en un registro
EL SISTEMA SHALL explicar que transponer la tabla convierte cada variable en un registro.

#### Scenario: Se explica el giro de la tabla
- **WHEN** alguien abre el bloque 3 de la sesión 5
- **THEN** se explica que transponer la tabla convierte cada variable en un registro

### Requirement: Cada variable transpuesta es un vector
EL SISTEMA SHALL explicar que cada variable, convertida en registro, se representa como
un vector.

#### Scenario: Se explica la representación
- **WHEN** alguien lee el bloque 3 tras la explicación de la transposición
- **THEN** se explica que cada variable convertida en registro se representa como un vector

### Requirement: El ángulo entre esos vectores es el que dibuja el círculo
EL SISTEMA SHALL enunciar que el ángulo entre dos de esos vectores es el que el círculo de
correlaciones dibuja.

#### Scenario: Se liga el vector con el dibujo
- **WHEN** alguien lee el bloque 3
- **THEN** se enuncia que el ángulo entre dos de esos vectores es el que el círculo de correlaciones dibuja

### Requirement: Plano factorial y círculo son dos vistas del mismo análisis
EL SISTEMA SHALL enunciar que el plano factorial de los individuos y el círculo de
correlaciones de las variables son dos vistas del mismo análisis.

#### Scenario: No son dos métodos distintos
- **WHEN** alguien lee el bloque 3
- **THEN** se enuncia que el plano factorial de los individuos y el círculo de correlaciones de las variables son dos vistas del mismo análisis

### Requirement: El círculo como flechas en el plano de los dos primeros componentes
EL SISTEMA SHALL explicar el círculo de correlaciones como la representación de cada
variable original mediante una flecha en el plano de los dos primeros componentes.

#### Scenario: Se define el dibujo
- **WHEN** alguien abre el bloque 3
- **THEN** se explica que el círculo representa cada variable original mediante una flecha en el plano de los dos primeros componentes

### Requirement: El coseno del ángulo aproxima la correlación
EL SISTEMA SHALL enunciar que el coseno del ángulo entre dos flechas del círculo de
correlaciones aproxima la correlación entre esas dos variables.

#### Scenario: Se enuncia la regla de lectura
- **WHEN** alguien lee el bloque 3
- **THEN** se enuncia que el coseno del ángulo entre dos flechas aproxima la correlación entre esas dos variables

### Requirement: El caso de ángulo próximo a 0°
EL SISTEMA SHALL mostrar dibujado el caso de dos flechas con ángulo próximo a 0° y su
correlación próxima a +1.

#### Scenario: El caso se ve, no se describe
- **WHEN** alguien recorre el bloque 3
- **THEN** ve dibujado el caso de dos flechas con ángulo próximo a 0° y su correlación próxima a +1

### Requirement: El caso de ángulo próximo a 90°
EL SISTEMA SHALL mostrar dibujado el caso de dos flechas con ángulo próximo a 90° y su
correlación próxima a 0.

#### Scenario: El caso se ve, no se describe
- **WHEN** alguien recorre el bloque 3
- **THEN** ve dibujado el caso de dos flechas con ángulo próximo a 90° y su correlación próxima a 0

### Requirement: El caso de ángulo próximo a 180°
EL SISTEMA SHALL mostrar dibujado el caso de dos flechas con ángulo próximo a 180° y su
correlación próxima a −1.

#### Scenario: El caso se ve, no se describe
- **WHEN** alguien recorre el bloque 3
- **THEN** ve dibujado el caso de dos flechas con ángulo próximo a 180° y su correlación próxima a −1

### Requirement: La longitud de la flecha es calidad de representación
EL SISTEMA SHALL explicar que la longitud de una flecha indica cuán bien representada
queda esa variable en el plano dibujado.

#### Scenario: Se explica qué mide el largo
- **WHEN** alguien lee el bloque 3
- **THEN** se explica que la longitud de una flecha indica cuán bien representada queda esa variable en el plano dibujado

### Requirement: La equivalencia remite a la fórmula de la entrada
EL SISTEMA SHALL remitir a la fórmula de correlación de la entrada al enunciar su
equivalencia con el ángulo.

#### Scenario: El bloque 3 se apoya en la entrada
- **WHEN** alguien lee en el bloque 3 la equivalencia entre ángulo y correlación
- **THEN** se remite a la fórmula de correlación que definió la entrada

### Requirement: El círculo se construye por pasos dibujados
EL SISTEMA SHALL mostrar en el bloque 3 la construcción del círculo de correlaciones como
una secuencia de pasos dibujados.

#### Scenario: La construcción se ve, no se resume
- **WHEN** alguien recorre el bloque 3
- **THEN** la construcción del círculo aparece como una secuencia de pasos dibujados

### Requirement: Cada paso de esa construcción lleva texto
EL SISTEMA SHALL describir con texto cada uno de los pasos de esa construcción.

#### Scenario: Ningún paso se queda mudo
- **WHEN** alguien recorre los pasos de construcción del círculo
- **THEN** cada paso lleva un texto que lo describe

### Requirement: El orden de la construcción
EL SISTEMA SHALL presentar esa construcción en el orden centrar, transponer y normalizar.

#### Scenario: Los tres pasos van en ese orden
- **WHEN** alguien recorre los pasos de construcción del círculo
- **THEN** aparecen en el orden centrar, transponer y normalizar

### Requirement: Centrar es restar la media
EL SISTEMA SHALL explicar que centrar una variable consiste en restarle su propia media.

#### Scenario: Se explica la operación
- **WHEN** alguien lee el paso de centrado del bloque 3
- **THEN** se explica que centrar una variable consiste en restarle su propia media

### Requirement: Igualar la escala es dividir por la desviación típica
EL SISTEMA SHALL explicar que la escala se iguala dividiendo cada variable por su propia
desviación típica.

#### Scenario: Se explica la operación
- **WHEN** alguien lee el paso de normalización del bloque 3
- **THEN** se explica que la escala se iguala dividiendo cada variable por su propia desviación típica

### Requirement: Un mismo país antes y después
EL SISTEMA SHALL mostrar los valores de un mismo país antes y después de centrarlos y
dividirlos.

#### Scenario: La transformación se ve sobre un caso
- **WHEN** alguien recorre los pasos de construcción del círculo
- **THEN** ve los valores de un mismo país antes y después de centrarlos y dividirlos

### Requirement: El origen del círculo es la media de cada variable
EL SISTEMA SHALL enunciar que, una vez centradas las variables, el origen del círculo de
correlaciones corresponde a la media de cada una.

#### Scenario: Se dice qué es el centro del dibujo
- **WHEN** alguien lee el bloque 3 tras el paso de centrado
- **THEN** se enuncia que el origen del círculo corresponde a la media de cada variable

### Requirement: La matriz que se diagonaliza es la de correlaciones
EL SISTEMA SHALL enunciar que la matriz que se diagonaliza después de ese paso es la de
correlaciones.

#### Scenario: Se nombra la matriz
- **WHEN** alguien lee el bloque 3 tras los pasos de centrado y normalización
- **THEN** se enuncia que la matriz que se diagonaliza es la de correlaciones

### Requirement: Qué pasaría sin centrar ni dividir
SI las variables no se centraran ni se dividieran por su desviación típica, ENTONCES EL
SISTEMA SHALL advertir que la de mayor escala decidiría por sí sola el resultado.

#### Scenario: Se advierte de la consecuencia
- **WHEN** alguien lee el bloque 3 en el punto donde se justifican centrado y normalización
- **THEN** se advierte que, sin ellos, la variable de mayor escala decidiría por sí sola el resultado

### Requirement: Las cargas son correlaciones y por eso ninguna flecha sale del círculo
EL SISTEMA SHALL enunciar que las cargas son correlaciones y que por eso ninguna flecha
sale del círculo de radio 1.

#### Scenario: Se justifica el borde del dibujo
- **WHEN** alguien lee el bloque 3
- **THEN** se enuncia que las cargas son correlaciones y que por eso ninguna flecha sale del círculo de radio 1

### Requirement: El centrado es el mismo que hizo el bloque 2
EL SISTEMA SHALL enunciar que el centrado de esa construcción es el mismo que hizo el
bloque 2 y no uno nuevo.

#### Scenario: No se duplica el paso
- **WHEN** alguien lee el paso de centrado del bloque 3
- **THEN** se enuncia que es el mismo centrado que hizo el bloque 2 y no uno nuevo

### Requirement: Al transponer, cada variable es un vector con un componente por país
EL SISTEMA SHALL explicar que, al transponer, cada variable pasa a ser un vector con un
componente por país.

#### Scenario: Se explica la forma del vector
- **WHEN** alguien lee el paso de transposición del bloque 3
- **THEN** se explica que cada variable pasa a ser un vector con un componente por país

### Requirement: Normalizar es llevar cada vector a longitud 1
EL SISTEMA SHALL explicar que normalizar es llevar cada uno de esos vectores a longitud 1.

#### Scenario: Se explica la operación
- **WHEN** alguien lee el paso de normalización del bloque 3
- **THEN** se explica que normalizar es llevar cada uno de esos vectores a longitud 1

### Requirement: El coseno entre vectores normalizados es exactamente la correlación
EL SISTEMA SHALL enunciar que el coseno del ángulo entre dos de esos vectores normalizados
es exactamente su correlación.

#### Scenario: Se distingue lo exacto de lo aproximado
- **WHEN** alguien lee el bloque 3 tras el paso de normalización
- **THEN** se enuncia que el coseno del ángulo entre dos vectores normalizados es exactamente su correlación

### Requirement: El radio 1 viene de la normalización
EL SISTEMA SHALL enunciar que el radio 1 del círculo es consecuencia de esa normalización.

#### Scenario: Se justifica el radio
- **WHEN** alguien lee el bloque 3 tras el paso de normalización
- **THEN** se enuncia que el radio 1 del círculo es consecuencia de esa normalización

### Requirement: La sombra de un vector sobre el plano es su carga
EL SISTEMA SHALL enunciar que la sombra de uno de esos vectores sobre el plano de las dos
primeras componentes es su carga.

#### Scenario: Se liga proyección y carga
- **WHEN** alguien lee el bloque 3
- **THEN** se enuncia que la sombra de uno de esos vectores sobre el plano de las dos primeras componentes es su carga

### Requirement: La aproximación nace de la proyección
EL SISTEMA SHALL enunciar que la aproximación entre el coseno y la correlación nace de esa
proyección y no del cálculo de la correlación.

#### Scenario: Se localiza de dónde viene el error
- **WHEN** alguien lee el bloque 3
- **THEN** se enuncia que la aproximación entre el coseno y la correlación nace de la proyección y no del cálculo de la correlación
