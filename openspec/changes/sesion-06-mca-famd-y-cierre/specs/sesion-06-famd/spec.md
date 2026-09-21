## Purpose

Cubre el bloque 2 de la sesión 6: cómo el análisis factorial de datos mixtos mezcla
variables numéricas y categóricas sin que ninguna domine por aritmética, verificado sobre
las mismas ocho personas del bloque 1, cómo se calculan sus indicadores, y los tres gráficos
con los que se lee y en qué orden.

## ADDED Requirements

### Requirement: El problema se enuncia antes del truco
EL SISTEMA SHALL enunciar que no se pueden mezclar variables crudas porque la de mayor
varianza numérica dominaría por aritmética, antes de presentar la solución.

#### Scenario: Primero el problema
- **WHEN** alguien abre el bloque 2
- **THEN** lo primero que lee es por qué no se pueden mezclar variables crudas

### Requirement: Los dos bloques re-escalados
EL SISTEMA SHALL mostrar cómo se construye la matriz mixta: las numéricas estandarizadas
como en el PCA, cada una con inercia 1; cada indicadora dividida por la raíz de su
proporción y centrada, con varianza 1 − p_j, de modo que cada variable categórica aporta
J_q − 1; y enunciar que después viene un PCA ordinario y que la inercia total es
p_num + Σ(J_q − 1).

#### Scenario: Las dos transformaciones y la inercia total
- **WHEN** alguien lee cómo se construye la matriz
- **THEN** ve la transformación de una numérica y la de una indicadora
- **AND** ve cuánta inercia aporta cada tipo de variable
- **AND** ve la fórmula de la inercia total

### Requirement: La propiedad de equilibrio
EL SISTEMA SHALL enunciar que el primer eje maximiza Σ r² sobre las numéricas más Σ η²
sobre las categóricas, que ambos indicadores viven en [0, 1] de modo que una variable de
cualquier tipo aporta como máximo 1 por eje, y que si todo es numérico el método es el PCA
y si todo es categórico es el MCA salvo una constante.

#### Scenario: El criterio y sus dos casos límite
- **WHEN** alguien lee la propiedad de equilibrio
- **THEN** ve el criterio que el primer eje maximiza
- **AND** se enuncia que ningún tipo de variable puede aportar más de 1 por eje
- **AND** se enuncian los dos casos límite

### Requirement: El ejemplo mixto
EL SISTEMA SHALL aplicar el método a las mismas ocho personas con dos categóricas —bebida y
horario— y dos numéricas —tazas al día y horas de sueño—, mostrar la tabla, la inercia
total, la varianza de cada columna transformada, los valores propios y el porcentaje de cada
eje.

#### Scenario: Cuatro variables, cuatro unidades de inercia
- **WHEN** alguien mira el ejemplo mixto
- **THEN** ve la tabla con las dos categóricas y las dos numéricas
- **AND** ve que la inercia total es la suma que la fórmula predice
- **AND** ve la varianza de cada columna transformada
- **AND** ve los valores propios y el porcentaje de cada eje

### Requirement: La verificación del teorema se muestra
EL SISTEMA SHALL mostrar, para el eje 1 del ejemplo, el r² de cada numérica y el η² de cada
categórica, y que su suma es el primer valor propio.

#### Scenario: Los cuatro sumandos y el valor propio
- **WHEN** alguien mira la verificación del teorema
- **THEN** ve los dos r² y los dos η²
- **AND** ve que suman el primer valor propio

### Requirement: La interpretación del ejemplo mixto
EL SISTEMA SHALL interpretar el eje 1 como un gradiente en el que las numéricas confirman y
refuerzan la estructura categórica, el eje 2 como esencialmente categórico con las cifras
que lo muestran, y enunciar que las numéricas gradúan a los individuos dentro de cada grupo
con un caso concreto.

#### Scenario: Las tres lecturas tienen cifra
- **WHEN** alguien lee la interpretación
- **THEN** la lectura del eje 2 cita el η² y los r² que la sostienen
- **AND** la graduación dentro de un grupo nombra a los individuos que la muestran

### Requirement: Cómo se calcula el porcentaje de un eje
EL SISTEMA SHALL mostrar que el porcentaje de un eje es su valor propio dividido por la
inercia total, con las cifras del ejemplo.

#### Scenario: La división está a la vista
- **WHEN** alguien lee cómo se calcula el porcentaje
- **THEN** ve el valor propio, la inercia total y el cociente

### Requirement: Cómo se calcula r²
EL SISTEMA SHALL mostrar que las puntuaciones de un eje son una variable más, que su
varianza es el valor propio, y calcular la correlación de Pearson entre el eje 1 y una
numérica del ejemplo paso a paso hasta su cuadrado, con su lectura.

#### Scenario: Pearson al cuadrado, paso a paso
- **WHEN** alguien lee cómo se calcula r²
- **THEN** ve las puntuaciones del eje 1
- **AND** ve que su varianza es el valor propio
- **AND** ve la covarianza, las dos desviaciones, la correlación y su cuadrado
- **AND** ve qué significa ese cuadrado en palabras

### Requirement: Cómo se calcula η²
EL SISTEMA SHALL mostrar la descomposición de la suma de cuadrados de las puntuaciones del
eje 1 en entre grupos y dentro de grupos para una categórica del ejemplo, el cociente que da
η², y qué significan η² = 1 y η² = 0.

#### Scenario: La descomposición ANOVA
- **WHEN** alguien lee cómo se calcula η²
- **THEN** ve la suma de cuadrados total, la de entre grupos y la de dentro
- **AND** ve que las dos partes suman el total
- **AND** ve el cociente que da η²
- **AND** ve qué significan los dos extremos

### Requirement: La suma de cuadrados dentro, en detalle
EL SISTEMA SHALL mostrar, grupo por grupo, la puntuación de cada individuo, su desvío
respecto a la media de su grupo y el cuadrado, con los subtotales y el total; decir qué
individuo aporta más y cuánto; y enunciar la identidad que une η², la contribución y la
relación baricéntrica como la misma cantidad vista desde tres ángulos.

#### Scenario: Las dos tablas y el individuo que más aporta
- **WHEN** alguien mira la suma de cuadrados dentro
- **THEN** ve una tabla por grupo con puntuación, desvío y cuadrado por individuo
- **AND** ve los subtotales y el total
- **AND** se dice qué individuo aporta más y qué fracción del total
- **AND** se muestra que η² sale también de los baricentros

### Requirement: Advertencias y alternativas
EL SISTEMA SHALL enunciar que una categórica de muchas categorías aporta más inercia total
aunque su influencia por eje siga acotada, que la patología de las categorías raras se
hereda intacta, enumerar las alternativas al método con lo que cada una pierde o gana, y
nombrar el software de referencia.

#### Scenario: Las advertencias y la lista
- **WHEN** alguien lee las advertencias
- **THEN** ve las dos advertencias
- **AND** ve las alternativas con su precio
- **AND** ve el software de referencia

### Requirement: El mapa de individuos con baricentros
EL SISTEMA SHALL dibujar cada persona del ejemplo en el plano de los dos primeros ejes y
cada categoría en el baricentro de su gente, enunciar que las numéricas no aparecen como
puntos aunque ordenaron a la gente, y rotular cada eje con su porcentaje.

#### Scenario: Personas y baricentros
- **WHEN** alguien mira el mapa de individuos del bloque 2
- **THEN** cada persona está en el plano con su número
- **AND** cada categoría está en el baricentro de sus personas, con marca distinta
- **AND** se enuncia que las numéricas no aparecen como puntos

### Requirement: El círculo de correlaciones
EL SISTEMA SHALL dibujar cada numérica como una flecha cuyas coordenadas son sus
correlaciones con los dos ejes, con las coordenadas rotuladas, y enunciar la gramática de
lectura: longitud, ángulo entre flechas, proyección sobre cada eje y dirección de
crecimiento.

#### Scenario: Dos flechas y cuatro reglas
- **WHEN** alguien mira el círculo de correlaciones del bloque 2
- **THEN** ve una flecha por numérica con sus dos correlaciones rotuladas
- **AND** ve las cuatro reglas de lectura

### Requirement: El cuadrado de relaciones
EL SISTEMA SHALL dibujar cada variable —numérica o categórica— como un punto cuyas
coordenadas son su vínculo con cada eje, r² o η² según el tipo, dentro del cuadrado
unitario, con los tipos distinguidos y explicados, y enunciar qué significan las esquinas y
el origen.

#### Scenario: Todas las variables como iguales
- **WHEN** alguien mira el cuadrado de relaciones del bloque 2
- **THEN** ve las cuatro variables como puntos dentro del cuadrado unitario
- **AND** hay dónde aprender qué tipo es cada punto sin depender solo del color
- **AND** se enuncia qué significan las esquinas y el origen

### Requirement: El orden de lectura de los tres gráficos
EL SISTEMA SHALL enunciar el orden de lectura —cuadrado de relaciones, círculo de
correlaciones, mapa de individuos con baricentros— con lo que cada uno responde, y qué
hacer en conjuntos grandes.

#### Scenario: Tres gráficos, un orden
- **WHEN** alguien lee el protocolo gráfico
- **THEN** ve los tres gráficos en ese orden con lo que responde cada uno
- **AND** ve qué hacer cuando hay muchos individuos y variables

### Requirement: El llamado de referencia se muestra sin ejecutarse
EL SISTEMA SHALL mostrar como texto el llamado de referencia del método en el software
nombrado, sin ejecutar nada.

#### Scenario: Código como texto
- **WHEN** alguien mira el llamado de referencia
- **THEN** lo ve como texto legible
- **AND** nada se ejecuta al mostrarlo

### Requirement: Las cifras del ejemplo mixto se generan y nada se calcula en el navegador
EL SISTEMA SHALL producir todas las cifras del ejemplo mixto con el mismo proceso repetible
que genera el ejemplo del bloque 1, comprobar antes de publicar que Σ r² + Σ η² es el valor
propio en cada eje y que las dos sumas de cuadrados suman el total, y mostrarlas ya
calculadas.

#### Scenario: La identidad se comprueba antes de publicar
- **WHEN** Σ r² + Σ η² no coincide con un valor propio, o la descomposición no suma el total
- **THEN** el proceso falla y no publica

#### Scenario: Abrir el bloque no calcula nada
- **WHEN** alguien abre el bloque 2
- **THEN** todas las cifras ya están calculadas

### Requirement: La síntesis
EL SISTEMA SHALL cerrar el bloque enunciando que el PCA y el MCA son el mismo algoritmo con
dos escalados distintos y que el FAMD los mezcla columna a columna.

#### Scenario: Una frase que junta los tres
- **WHEN** alguien llega al final del bloque 2
- **THEN** ve enunciado que los tres métodos son el mismo algoritmo con distintos escalados
