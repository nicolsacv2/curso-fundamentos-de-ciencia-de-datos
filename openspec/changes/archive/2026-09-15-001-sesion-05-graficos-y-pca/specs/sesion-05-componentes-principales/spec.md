## Purpose

Cubre el bloque 2 de la sesión 5: el análisis de componentes principales presentado
geométricamente —la nube vista desde su mejor ángulo— con las fórmulas nombradas pero sin
desarrollar, y con la decisión entre analizar covarianzas o correlaciones hecha explícita.

## ADDED Requirements

### Requirement: El PCA como búsqueda de direcciones
EL SISTEMA SHALL presentar el análisis de componentes principales como la búsqueda de las
direcciones en las que la nube de puntos más se estira.

#### Scenario: La presentación es geométrica
- **WHEN** alguien abre el bloque 2 de la sesión 5
- **THEN** el PCA se presenta como la búsqueda de las direcciones en las que la nube más se estira

### Requirement: El vocabulario se nombra sin desarrollarse
EL SISTEMA SHALL nombrar la matriz de covarianza, el autovector y el autovalor sin
desarrollar su cálculo.

#### Scenario: Los tres términos aparecen
- **WHEN** alguien recorre el bloque 2
- **THEN** se nombran la matriz de covarianza, el autovector y el autovalor
- **AND** no se desarrolla el cálculo de ninguno de los tres

### Requirement: La nube antes y después de proyectarse
EL SISTEMA SHALL mostrar una misma nube de puntos antes y después de proyectarse sobre
sus componentes principales.

#### Scenario: Las dos vistas de la misma nube
- **WHEN** alguien recorre el bloque 2
- **THEN** ve la misma nube antes de proyectarse y después de proyectarse sobre sus componentes principales

### Requirement: Varianza explicada por componente
EL SISTEMA SHALL indicar el porcentaje de varianza explicada de cada componente del
ejemplo que use.

#### Scenario: Cada componente lleva su porcentaje
- **WHEN** alguien mira el ejemplo del bloque 2
- **THEN** cada componente indica qué porcentaje de varianza explica

### Requirement: Un componente es una combinación, no una variable
EL SISTEMA SHALL enunciar que un componente principal es una combinación de las variables
originales, no una de ellas.

#### Scenario: Se descarta la lectura ingenua
- **WHEN** alguien lee el bloque 2
- **THEN** se enuncia que un componente principal es una combinación de las variables originales y no una de ellas

### Requirement: La nube del bloque 1 vuelve en el bloque 2
EL SISTEMA SHALL mostrar en el bloque 2 la misma nube tridimensional del bloque 1,
rotable igual que allí.

#### Scenario: La misma nube, el mismo gesto
- **WHEN** alguien llega a la nube tridimensional del bloque 2
- **THEN** es la misma nube que vio en el bloque 1
- **AND** se rota igual que allí

### Requirement: El plano de las dos primeras componentes
EL SISTEMA SHALL dibujar dentro de esa nube el plano de las dos primeras componentes.

#### Scenario: El plano se ve dentro de la nube
- **WHEN** alguien mira la nube tridimensional del bloque 2
- **THEN** el plano de las dos primeras componentes está dibujado dentro de ella

### Requirement: La proyección de cada punto
EL SISTEMA SHALL mostrar la proyección de cada punto de la nube sobre ese plano.

#### Scenario: Cada punto deja su sombra
- **WHEN** alguien mira la nube tridimensional del bloque 2
- **THEN** cada punto de la nube muestra su proyección sobre el plano

### Requirement: Un vector por variable original
EL SISTEMA SHALL dibujar dentro de esa nube un vector por cada variable original.

#### Scenario: Las variables aparecen como vectores
- **WHEN** alguien mira la nube tridimensional del bloque 2
- **THEN** hay un vector dibujado por cada variable original

### Requirement: La proyección de cada vector
EL SISTEMA SHALL mostrar la proyección de cada uno de esos vectores sobre el plano de las
dos primeras componentes.

#### Scenario: Cada vector deja su sombra
- **WHEN** alguien mira la nube tridimensional del bloque 2
- **THEN** cada vector de variable muestra su proyección sobre el plano de las dos primeras componentes

### Requirement: La escena gira solidaria
MIENTRAS el usuario rote esa figura, EL SISTEMA SHALL mantener el plano, las proyecciones
y los vectores solidarios con la nube.

#### Scenario: Rotar no desarma la escena
- **WHEN** alguien rota la figura tridimensional del bloque 2
- **THEN** el plano, las proyecciones y los vectores giran con la nube y siguen encajando con ella

### Requirement: La maldición de la dimensionalidad
EL SISTEMA SHALL enunciar en el bloque 2 la maldición de la dimensionalidad.

#### Scenario: Se enuncia el problema
- **WHEN** alguien recorre el bloque 2
- **THEN** se enuncia la maldición de la dimensionalidad

### Requirement: El PCA como respuesta a esa maldición
EL SISTEMA SHALL presentar en el bloque 2 el análisis de componentes principales como una
respuesta a la maldición de la dimensionalidad.

#### Scenario: Problema y respuesta quedan ligados
- **WHEN** alguien lee el bloque 2 tras el enunciado de la maldición de la dimensionalidad
- **THEN** el PCA se presenta como una respuesta a ese problema

### Requirement: Las componentes se rotulan sin nombrarse
EL SISTEMA SHALL rotular las dos primeras componentes del plano factorial como CP 1 y
CP 2, sin darles nombre.

#### Scenario: Los ejes llevan rótulo neutro
- **WHEN** alguien mira el plano factorial del bloque 2
- **THEN** los ejes se rotulan CP 1 y CP 2
- **AND** no se les da ningún nombre interpretativo

### Requirement: Las cargas de las dos primeras componentes
EL SISTEMA SHALL mostrar las cargas de cada una de esas dos componentes.

#### Scenario: Las cargas están a la vista
- **WHEN** alguien mira el plano factorial del bloque 2
- **THEN** se muestran las cargas de CP 1 y de CP 2

### Requirement: Los países de cada extremo
EL SISTEMA SHALL mostrar qué países quedan en cada extremo de cada una de esas dos
componentes.

#### Scenario: Los extremos se nombran
- **WHEN** alguien mira el plano factorial del bloque 2
- **THEN** se muestra qué países quedan en cada extremo de CP 1 y de CP 2

### Requirement: Nombrar una componente es interpretar
EL SISTEMA SHALL advertir que ponerle nombre a una componente sería una interpretación y
no un resultado del cálculo.

#### Scenario: Se advierte antes de que alguien lo haga
- **WHEN** alguien lee el bloque 2 junto a las cargas y los extremos
- **THEN** se advierte que ponerle nombre a una componente sería una interpretación y no un resultado del cálculo

### Requirement: El plano factorial se construye por pasos dibujados
EL SISTEMA SHALL mostrar en el bloque 2 la construcción del plano factorial como una
secuencia de pasos dibujados.

#### Scenario: La construcción se ve, no se resume
- **WHEN** alguien recorre el bloque 2
- **THEN** la construcción del plano factorial aparece como una secuencia de pasos dibujados

### Requirement: Cada paso de esa construcción lleva texto
EL SISTEMA SHALL describir con texto cada uno de los pasos de esa construcción.

#### Scenario: Ningún paso se queda mudo
- **WHEN** alguien recorre los pasos de construcción del plano factorial
- **THEN** cada paso lleva un texto que lo describe

### Requirement: La nube en sus unidades originales
EL SISTEMA SHALL mostrar la nube en sus unidades originales antes de estandarizarla.

#### Scenario: Se parte de los datos como vienen
- **WHEN** alguien recorre los pasos de construcción del plano factorial
- **THEN** ve la nube en sus unidades originales antes de cualquier estandarización

### Requirement: El punto medio como paso propio
EL SISTEMA SHALL mostrar el punto medio de la nube como un paso propio de la construcción.

#### Scenario: Centrar tiene su propio paso
- **WHEN** alguien recorre los pasos de construcción del plano factorial
- **THEN** el punto medio de la nube aparece como un paso propio

### Requirement: Centrar forma parte de la definición
EL SISTEMA SHALL enunciar que centrar forma parte de la definición del análisis de
componentes principales.

#### Scenario: Se distingue lo obligatorio
- **WHEN** alguien lee el paso de centrado
- **THEN** se enuncia que centrar forma parte de la definición del PCA

### Requirement: Estandarizar es una decisión
EL SISTEMA SHALL enunciar que estandarizar es una decisión y no un requisito del método.

#### Scenario: Se distingue lo opcional
- **WHEN** alguien lee el paso de estandarización
- **THEN** se enuncia que estandarizar es una decisión y no un requisito del método

### Requirement: Qué primera componente sale sin estandarizar
EL SISTEMA SHALL mostrar qué primera componente resulta cuando no se estandariza.

#### Scenario: La consecuencia se ve dibujada
- **WHEN** alguien lee el paso de estandarización
- **THEN** se muestra qué primera componente resulta cuando no se estandariza

### Requirement: Dos matrices posibles
EL SISTEMA SHALL explicar que el análisis puede hacerse sobre la matriz de covarianzas o
sobre la de correlaciones.

#### Scenario: Se plantea la alternativa
- **WHEN** alguien recorre el bloque 2
- **THEN** se explica que el análisis puede hacerse sobre la matriz de covarianzas o sobre la de correlaciones

### Requirement: El análisis sobre covarianzas parte de datos centrados
EL SISTEMA SHALL enunciar que el análisis sobre covarianzas parte de datos solo centrados.

#### Scenario: Se dice de qué datos parte
- **WHEN** alguien lee la comparación entre las dos matrices
- **THEN** se enuncia que el análisis sobre covarianzas parte de datos solo centrados

### Requirement: El análisis sobre correlaciones parte de datos divididos
EL SISTEMA SHALL enunciar que el análisis sobre correlaciones parte de datos además
divididos por su desviación típica.

#### Scenario: Se dice de qué datos parte
- **WHEN** alguien lee la comparación entre las dos matrices
- **THEN** se enuncia que el análisis sobre correlaciones parte de datos además divididos por su desviación típica

### Requirement: Sobre covarianzas pesa más la variable de mayor varianza
EL SISTEMA SHALL enunciar que en el análisis sobre covarianzas pesa más la variable de
mayor varianza absoluta.

#### Scenario: Se nombra la consecuencia
- **WHEN** alguien lee la comparación entre las dos matrices
- **THEN** se enuncia que en el análisis sobre covarianzas pesa más la variable de mayor varianza absoluta

### Requirement: Sobre correlaciones el resultado no depende de las unidades
EL SISTEMA SHALL enunciar que el análisis sobre correlaciones no cambia si se cambian las
unidades de una variable.

#### Scenario: Se nombra la invariancia
- **WHEN** alguien lee la comparación entre las dos matrices
- **THEN** se enuncia que el análisis sobre correlaciones no cambia si se cambian las unidades de una variable

### Requirement: Qué le pasa a las covarianzas al cambiar una unidad
EL SISTEMA SHALL mostrar qué le ocurre al análisis sobre covarianzas cuando se cambia la
unidad de una variable.

#### Scenario: El contraste se ve
- **WHEN** alguien lee la comparación entre las dos matrices
- **THEN** se muestra qué le ocurre al análisis sobre covarianzas cuando se cambia la unidad de una variable

### Requirement: La suma de autovalores sobre correlaciones
EL SISTEMA SHALL enunciar que la suma de los autovalores del análisis sobre correlaciones
es el número de variables.

#### Scenario: Se enuncia la suma
- **WHEN** alguien lee la comparación entre las dos matrices
- **THEN** se enuncia que la suma de los autovalores del análisis sobre correlaciones es el número de variables

### Requirement: Cuándo conviene cada análisis
EL SISTEMA SHALL indicar en qué caso conviene cada uno de los dos análisis.

#### Scenario: La comparación termina en un criterio
- **WHEN** alguien termina de leer la comparación entre las dos matrices
- **THEN** se indica en qué caso conviene cada uno de los dos análisis

### Requirement: Varianza explicada del análisis de cuatro variables
EL SISTEMA SHALL mostrar la varianza explicada por cada componente del análisis de las
cuatro variables.

#### Scenario: Cada componente del análisis real lleva su cifra
- **WHEN** alguien mira el análisis de las cuatro variables en el bloque 2
- **THEN** se muestra la varianza explicada por cada uno de sus componentes

### Requirement: El plano factorial con un punto por país
EL SISTEMA SHALL mostrar el plano factorial de las cuatro variables con un punto por país.

#### Scenario: Los países están en el plano
- **WHEN** alguien mira el plano factorial de las cuatro variables
- **THEN** hay un punto por país

### Requirement: Cuánta varianza se pierde al bajar a dos ejes
EL SISTEMA SHALL indicar cuánta varianza se pierde al pasar de cuatro variables a ese
plano.

#### Scenario: El precio de la reducción está escrito
- **WHEN** alguien mira el plano factorial de las cuatro variables
- **THEN** se indica cuánta varianza se pierde al pasar de cuatro variables a ese plano
