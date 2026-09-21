## Purpose

Cubre la primera mitad del bloque 1 de la sesión 6: la matemática del análisis de
correspondencias múltiples enseñada sobre un ejemplo de ocho personas —de la tabla
disyuntiva completa a las herramientas de interpretación—, con todas sus cifras generadas y
verificadas, y los conceptos «en versión humana» con el protocolo de lectura en cuatro pasos.

## ADDED Requirements

### Requirement: El bloque 1 responde la pregunta de la entrada
EL SISTEMA SHALL abrir el bloque 1 diciendo que responde la pregunta «¿qué falta?» con la
que termina la entrada, y nombrando cuántas columnas de la tabla quedaron fuera del análisis
por no ser números.

#### Scenario: El puente llega
- **WHEN** alguien abre el bloque 1 de la sesión 6
- **THEN** se dice que es la respuesta a «¿qué falta?»
- **AND** se dice cuántas columnas quedaron fuera por no ser números
- **AND** esa cifra sale del conjunto de datos y no está escrita a mano

### Requirement: El ejemplo se presenta antes que la fórmula
EL SISTEMA SHALL introducir el método con un ejemplo de ocho personas y tres variables
categóricas binarias —bebida, horario y azúcar—, mostrar su tabla, enunciar el patrón
sembrado y decir quiénes son las excepciones.

#### Scenario: La tabla de las ocho personas está a la vista
- **WHEN** alguien llega al ejemplo del bloque 1
- **THEN** ve una tabla con ocho filas y tres variables categóricas
- **AND** se enuncia el patrón sembrado entre las tres variables
- **AND** se dice qué individuos son las excepciones a ese patrón

### Requirement: La tabla disyuntiva completa se muestra
EL SISTEMA SHALL mostrar la matriz indicadora del ejemplo —una columna por categoría, un
uno donde la persona tiene la categoría y un cero donde no— y enunciar que cada fila suma el
número de variables y cada columna suma la frecuencia de su categoría.

#### Scenario: Ceros y unos, con sus sumas
- **WHEN** alguien mira la tabla disyuntiva del bloque 1
- **THEN** ve una columna por cada categoría del ejemplo
- **AND** cada celda es un cero o un uno
- **AND** se enuncia cuánto suma cada fila y cuánto suma cada columna

### Requirement: El MCA se presenta como el análisis de correspondencias de esa tabla
EL SISTEMA SHALL enunciar que el método analiza la tabla disyuntiva con masas de fila
iguales, masas de columna proporcionales a la frecuencia de cada categoría, y residuos
estandarizados que son el estadístico chi-cuadrado repartido celda por celda.

#### Scenario: Las tres piezas están enunciadas
- **WHEN** alguien lee cómo se construye el análisis
- **THEN** se enuncian las masas de fila y las de columna con sus valores en el ejemplo
- **AND** se enuncia que los residuos estandarizados son el chi-cuadrado repartido celda por celda

### Requirement: Los valores propios del ejemplo y sus dos identidades
EL SISTEMA SHALL mostrar los valores propios del ejemplo, enunciar que suman la inercia
total (J − Q)/Q, y que hay exactamente J − Q ejes no triviales.

#### Scenario: Los tres valores propios cuadran
- **WHEN** alguien mira los valores propios del ejemplo
- **THEN** ve exactamente J − Q valores
- **AND** se muestra que su suma es (J − Q)/Q
- **AND** las cifras salen del proceso que genera el ejemplo y no están escritas a mano

### Requirement: La métrica chi-cuadrado y su consecuencia
EL SISTEMA SHALL enunciar la distancia chi-cuadrado entre dos individuos, que en ella las
diferencias en categorías raras pesan más, y la fórmula cerrada de la distancia de una
categoría al centroide: n/n_j − 1.

#### Scenario: Compartir lo raro acerca más
- **WHEN** alguien lee la métrica del bloque 1
- **THEN** se enuncia que las diferencias en categorías poco frecuentes pesan más
- **AND** se muestra la fórmula n/n_j − 1 de la distancia de una categoría al centroide

### Requirement: Las fórmulas de transición y la lectura baricéntrica
EL SISTEMA SHALL mostrar las dos fórmulas de transición, enunciar que salvo la dilatación
por 1/√λ un individuo está en el baricentro de sus categorías y una categoría en el
baricentro de sus individuos, y verificarlo sobre un individuo del ejemplo con sus cifras.

#### Scenario: La fórmula se verifica sobre el individuo 1
- **WHEN** alguien lee las fórmulas de transición
- **THEN** ve el baricentro de las categorías del individuo 1 en el eje 1
- **AND** ve ese baricentro dilatado por 1/√λ₁
- **AND** el resultado coincide con la coordenada publicada del individuo 1

### Requirement: La inercia total y la corrección de Benzécri
EL SISTEMA SHALL enunciar que la inercia total depende solo de J y Q, que por eso los
porcentajes crudos son pesimistas, mostrar la corrección de Benzécri —que re-escala solo
los valores propios que superan 1/Q— aplicada al ejemplo, y advertir que con datos tan
pequeños la corrección exagera.

#### Scenario: El porcentaje crudo y el ajustado
- **WHEN** alguien lee la corrección de Benzécri
- **THEN** ve el umbral 1/Q del ejemplo y qué valores propios lo superan
- **AND** ve el porcentaje crudo y el ajustado del eje 1
- **AND** se advierte que con datos pequeños la corrección exagera

### Requirement: La matriz de Burt
EL SISTEMA SHALL enunciar que analizar la matriz de Burt da las mismas coordenadas
estandarizadas de categorías con los valores propios al cuadrado, y mostrarlo con los del
ejemplo.

#### Scenario: Los valores propios de Burt son los cuadrados
- **WHEN** alguien mira la verificación con Burt
- **THEN** ve los valores propios de Burt del ejemplo
- **AND** se muestra que cada uno es el cuadrado del correspondiente de la tabla disyuntiva

### Requirement: Contribución y coseno cuadrado
EL SISTEMA SHALL definir la contribución de una categoría a un eje y su coseno cuadrado,
mostrar las dos para las categorías del ejemplo en el eje 1, enunciar el aporte promedio
1/J como umbral, y nombrar el eje 1 solo con las categorías que lo superan.

#### Scenario: El eje 1 se llama «bebida»
- **WHEN** alguien mira la tabla de contribuciones del ejemplo
- **THEN** ve la contribución y el cos² de cada categoría en el eje 1
- **AND** ve el aporte promedio 1/J
- **AND** el eje se nombra únicamente con las categorías que superan ese promedio

### Requirement: El mapa factorial del ejemplo
EL SISTEMA SHALL dibujar el plano de los dos primeros ejes con las categorías y los
individuos del ejemplo, distinguidos por su marca, con las categorías distinguidas por
variable y con cada eje rotulado con su porcentaje de inercia.

#### Scenario: Categorías e individuos en el mismo plano
- **WHEN** alguien mira el mapa factorial del bloque 1
- **THEN** cada categoría y cada individuo del ejemplo están en el plano
- **AND** las categorías se distinguen de los individuos por su marca
- **AND** hay dónde aprender a qué variable corresponde cada categoría sin depender solo del color
- **AND** cada eje lleva escrito su porcentaje de inercia

#### Scenario: Las posiciones salen de los datos generados
- **WHEN** se comparan las posiciones dibujadas con las coordenadas publicadas del ejemplo
- **THEN** coinciden

### Requirement: La interpretación del ejemplo
EL SISTEMA SHALL interpretar el eje 1 como un gradiente y el eje 2 como las excepciones al
patrón, enunciar las tres reglas de proximidad —entre categorías de variables distintas,
entre categorías de la misma variable, entre individuo y categoría— y el filtro de calidad
que deja sin interpretar un punto con cos² bajo en el plano.

#### Scenario: Las tres reglas y el filtro están escritos
- **WHEN** alguien lee la interpretación del mapa
- **THEN** ve las tres reglas de proximidad
- **AND** ve el umbral de cos² por debajo del cual un punto no se interpreta

### Requirement: Los conceptos en versión humana
EL SISTEMA SHALL explicar baricentro, inercia, contribución y coseno cuadrado con una imagen
cotidiana cada uno, y atar cada imagen a una cifra concreta del ejemplo.

#### Scenario: Cada concepto tiene imagen y cifra
- **WHEN** alguien lee los conceptos en versión humana
- **THEN** cada uno de los cuatro tiene una imagen cotidiana
- **AND** cada uno remite a una cifra del ejemplo

### Requirement: El protocolo de lectura en cuatro pasos
EL SISTEMA SHALL enunciar el orden de lectura profesional —inercia por eje, contribuciones,
cos², y solo al final posiciones y baricentros— y advertir que el error de principiante es
saltar directo al último paso.

#### Scenario: El orden está escrito y numerado
- **WHEN** alguien lee el protocolo de lectura
- **THEN** ve los cuatro pasos en ese orden
- **AND** ve la advertencia sobre saltar al cuarto

### Requirement: Las cifras del ejemplo se generan, no se escriben a mano
EL SISTEMA SHALL producir todas las cifras del ejemplo —valores propios, coordenadas,
contribuciones, cosenos, corrección, Burt— con un proceso repetible que comprueba sus
propias identidades antes de publicarlas, y que se puede ejecutar sin instalar nada.

#### Scenario: Regenerar da lo mismo
- **WHEN** se generan las cifras del ejemplo dos veces
- **THEN** los dos resultados son idénticos

#### Scenario: Una identidad rota detiene la publicación
- **WHEN** la fórmula de transición, la suma de la inercia o la relación con Burt no cuadran
- **THEN** el proceso falla y no publica

#### Scenario: No hace falta instalar nada
- **WHEN** alguien regenera las cifras del ejemplo
- **THEN** no necesita instalar ninguna dependencia

### Requirement: Nada se calcula en el navegador
EL SISTEMA SHALL mostrar en el bloque 1 resultados ya calculados de antemano, sin
computarlos al abrir el bloque.

#### Scenario: Abrir el bloque no diagonaliza nada
- **WHEN** alguien abre el bloque 1
- **THEN** los resultados del ejemplo ya están calculados
- **AND** no se computa ninguno al abrirlo

### Requirement: Las fórmulas se ven escritas en la pared
EL SISTEMA SHALL mostrar las fórmulas del bloque de forma legible proyectadas, sin pedir
nada a un servidor externo para dibujarlas.

#### Scenario: Las fórmulas no dependen de la red
- **WHEN** alguien abre el bloque 1 sin conexión, con la página ya cargada
- **THEN** todas las fórmulas se ven
