## MODIFIED Requirements

### Requirement: El problema se enuncia antes del truco
EL SISTEMA SHALL enunciar que no se pueden mezclar variables crudas porque la de mayor
varianza numérica dominaría por aritmética, antes de presentar la solución.

#### Scenario: Primero el problema
- **WHEN** alguien abre el bloque 3
- **THEN** lo primero que lee es por qué no se pueden mezclar variables crudas

### Requirement: El mapa de individuos con baricentros
EL SISTEMA SHALL dibujar cada persona del ejemplo en el plano de los dos primeros ejes y
cada categoría en el baricentro de su gente, enunciar que las numéricas no aparecen como
puntos aunque ordenaron a la gente, y rotular cada eje con su porcentaje.

#### Scenario: Personas y baricentros
- **WHEN** alguien mira el mapa de individuos del bloque 3
- **THEN** cada persona está en el plano con su número
- **AND** cada categoría está en el baricentro de sus personas, con marca distinta
- **AND** se enuncia que las numéricas no aparecen como puntos

### Requirement: El círculo de correlaciones
EL SISTEMA SHALL dibujar cada numérica como una flecha cuyas coordenadas son sus
correlaciones con los dos ejes, con las coordenadas rotuladas, y enunciar la gramática de
lectura: longitud, ángulo entre flechas, proyección sobre cada eje y dirección de
crecimiento.

#### Scenario: Dos flechas y cuatro reglas
- **WHEN** alguien mira el círculo de correlaciones del bloque 3
- **THEN** ve una flecha por numérica con sus dos correlaciones rotuladas
- **AND** ve las cuatro reglas de lectura

### Requirement: El cuadrado de relaciones
EL SISTEMA SHALL dibujar cada variable —numérica o categórica— como un punto cuyas
coordenadas son su vínculo con cada eje, r² o η² según el tipo, dentro del cuadrado
unitario, con los tipos distinguidos y explicados, y enunciar qué significan las esquinas y
el origen.

#### Scenario: Todas las variables como iguales
- **WHEN** alguien mira el cuadrado de relaciones del bloque 3
- **THEN** ve las cuatro variables como puntos dentro del cuadrado unitario
- **AND** hay dónde aprender qué tipo es cada punto sin depender solo del color
- **AND** se enuncia qué significan las esquinas y el origen

### Requirement: El bloque no depende de ningún lenguaje de programación
EL SISTEMA SHALL presentar el bloque 3 sin código y sin nombres de lenguajes de
programación ni de paquetes: lo que el método hace se dice en palabras, porque el público
del curso no es técnico y el material no debe depender de una herramienta concreta.

#### Scenario: Ni código ni lenguajes en pantalla
- **WHEN** alguien recorre el bloque 3 de principio a fin
- **THEN** no ve código
- **AND** no ve el nombre de ningún lenguaje de programación ni de ningún paquete
- **AND** la única aparición de la palabra «Python» en la sesión es el nombre de la variable
  del formulario que pregunta si se ha usado, que es un dato de la clase y no una referencia
  al lenguaje

### Requirement: Las cifras del ejemplo mixto se generan y nada se calcula en el navegador
EL SISTEMA SHALL producir todas las cifras del ejemplo mixto con el mismo proceso repetible
que genera el ejemplo del bloque 2, comprobar antes de publicar que Σ r² + Σ η² es el valor
propio en cada eje y que las dos sumas de cuadrados suman el total, y mostrarlas ya
calculadas.

#### Scenario: La identidad se comprueba antes de publicar
- **WHEN** Σ r² + Σ η² no coincide con un valor propio, o la descomposición no suma el total
- **THEN** el proceso falla y no publica

#### Scenario: Abrir el bloque no calcula nada
- **WHEN** alguien abre el bloque 3
- **THEN** todas las cifras ya están calculadas

### Requirement: La síntesis
EL SISTEMA SHALL cerrar el bloque enunciando que el PCA y el MCA son el mismo algoritmo con
dos escalados distintos y que el FAMD los mezcla columna a columna.

#### Scenario: Una frase que junta los tres
- **WHEN** alguien llega al final del bloque 3
- **THEN** ve enunciado que los tres métodos son el mismo algoritmo con distintos escalados
