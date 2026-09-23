# sesion-06-categorias-raras Specification

## Purpose

Cubre la segunda mitad del bloque 2 de la sesión 7: qué le hace al MCA una categoría que
casi nadie eligió, por qué eso es una consecuencia exacta de la métrica y no un accidente,
qué remedios existen, y cómo una categoría suplementaria se proyecta sobre unos ejes ya
cerrados sin deformarlos. La capacidad conserva su nombre de cuando este contenido estaba en
la sesión 6.

## Requirements

### Requirement: El montaje se deriva del mismo ejemplo
EL SISTEMA SHALL construir la patología sobre las mismas ocho personas, cambiando la
tercera variable a un endulzante de tres categorías donde una la eligió una sola persona,
y decir quién es esa persona, cuántas categorías y cuántos ejes tiene ahora el análisis.

#### Scenario: La categoría rara tiene nombre y portador
- **WHEN** alguien llega a la patología de las categorías raras
- **THEN** ve la nueva variable con sus tres categorías y la frecuencia de cada una
- **AND** se dice qué individuo es el único portador de la rara
- **AND** se dicen la inercia total y el número de ejes del nuevo análisis

### Requirement: La distancia explota con exactitud
EL SISTEMA SHALL mostrar, con la fórmula n/n_j − 1, la distancia al centroide de la
categoría rara frente a la de las demás, y enunciar que no depende de los datos: cualquier
categoría rara se dispara y la distancia diverge cuando su frecuencia tiende a cero.

#### Scenario: Siete contra menos de uno con tres
- **WHEN** alguien lee la distancia de la categoría rara
- **THEN** ve su distancia al cuadrado calculada con la fórmula
- **AND** ve dentro de qué radio queda todo lo demás
- **AND** se enuncia que es consecuencia de la métrica y no de estos datos

### Requirement: Una sola persona fabricó un eje entero
EL SISTEMA SHALL mostrar, para el eje que la categoría rara domina, la coordenada, la
contribución y el cos² de cada categoría, decir qué porcentaje de la inercia se lleva ese
eje, y enunciar que detrás hay un solo individuo entre ocho.

#### Scenario: La tabla del eje fabricado
- **WHEN** alguien mira el eje que domina la categoría rara
- **THEN** ve su coordenada, su contribución y su cos² junto a los de las demás categorías
- **AND** ve el porcentaje de inercia de ese eje
- **AND** se enuncia que ese eje lo sostiene un solo individuo

### Requirement: Los efectos colaterales se muestran con cifras
EL SISTEMA SHALL mostrar a dónde se mueve el individuo portador respecto al análisis sin la
categoría rara, cuánto se diluye el porcentaje del eje 1, y qué proporción de la inercia
total acapara la categoría rara.

#### Scenario: El antes y el después del individuo 7
- **WHEN** alguien lee los efectos colaterales
- **THEN** ve la posición del portador en los dos análisis
- **AND** ve el porcentaje del eje 1 en los dos análisis
- **AND** ve qué proporción de la inercia total acapara la categoría rara

### Requirement: El falso positivo clásico
EL SISTEMA SHALL enunciar que en la periferia de un mapa conviven categorías discriminantes
y categorías raras, y que solo las contribuciones, los cos² y las frecuencias marginales las
distinguen; el mapa solo, nunca.

#### Scenario: La advertencia está escrita
- **WHEN** alguien lee la patología
- **THEN** se enuncia que la periferia mezcla discriminantes y raras
- **AND** se enuncia con qué tres cosas se distinguen

### Requirement: El mapa con la categoría rara activa
EL SISTEMA SHALL dibujar el plano del análisis con la categoría rara activa, con su
frecuencia rotulada junto a ella, con el resto del mapa visiblemente concentrado, y con
cada eje rotulado con su porcentaje.

#### Scenario: La rara está lejos y dice cuántos la tienen
- **WHEN** alguien mira el mapa con la categoría rara activa
- **THEN** la categoría rara aparece lejos del resto
- **AND** lleva rotulada su frecuencia
- **AND** cada eje lleva escrito su porcentaje

### Requirement: Los cuatro remedios
EL SISTEMA SHALL enumerar los cuatro remedios estándar —fusionar con una categoría afín,
ventilar por debajo de un umbral, proyectar como suplementaria, y el MCA específico— y
relacionar el primero con el agrupamiento en «raro» que la sesión 6 ya aplicó.

#### Scenario: Cuatro remedios, y uno ya usado
- **WHEN** alguien lee los remedios
- **THEN** ve los cuatro
- **AND** se dice que fusionar es lo que la sesión 6 hizo al agrupar los niveles de una persona

### Requirement: La fórmula de la proyección suplementaria
EL SISTEMA SHALL mostrar la fórmula con la que una categoría que no participó del análisis
recibe coordenadas —el baricentro de sus individuos dilatado por 1/√λ—, verificarla sobre
las dos categorías finas del ejemplo, y enunciar que la vía dual da lo mismo.

#### Scenario: Stevia y Nada, proyectadas
- **WHEN** alguien lee la proyección suplementaria
- **THEN** ve la fórmula
- **AND** ve las coordenadas de las dos categorías finas obtenidas con ella
- **AND** se enuncia que calcularlas por la vía dual da el mismo resultado

### Requirement: Los dos destinos de la categoría rara
EL SISTEMA SHALL comparar, lado a lado, la categoría rara como activa y como
suplementaria: su posición, su efecto sobre los ejes, el porcentaje del eje 1, el destino
del individuo portador y su cos² en el plano; y enunciar por qué el cos² alto de la versión
activa es circular y el bajo de la suplementaria es el diagnóstico honesto.

#### Scenario: La tabla de los dos destinos
- **WHEN** alguien mira los dos destinos de la categoría rara
- **THEN** ve las cinco comparaciones lado a lado
- **AND** se enuncia que como activa el análisis giró para enfocarla
- **AND** se enuncia que como suplementaria su cos² dice dónde está de verdad

### Requirement: La asimetría conceptual
EL SISTEMA SHALL enunciar que los elementos activos definen la métrica y la geometría, que
los suplementarios solo reciben coordenadas sobre una geometría cerrada, y enumerar los
usos canónicos de los suplementarios.

#### Scenario: Activo y suplementario no son lo mismo
- **WHEN** alguien lee la asimetría conceptual
- **THEN** se enuncia qué definen los activos y qué reciben los suplementarios
- **AND** se enumeran los usos canónicos de los suplementarios

### Requirement: El mapa con suplementarias
EL SISTEMA SHALL dibujar el plano del análisis base con las dos categorías finas
proyectadas como suplementarias, distinguidas por una marca distinta de la de las activas,
y decir en la figura que se dibujan pero no deformaron los ejes.

#### Scenario: Las suplementarias se distinguen
- **WHEN** alguien mira el mapa con suplementarias
- **THEN** las suplementarias tienen una marca distinta de la de las activas
- **AND** hay dónde aprender qué significa esa marca
- **AND** está escrito que no deformaron los ejes

### Requirement: Las cifras de los tres montajes salen del mismo proceso
EL SISTEMA SHALL producir las cifras del análisis base, del análisis con la categoría rara
activa y de la proyección suplementaria con el mismo proceso repetible que genera el
ejemplo, y no escribir ninguna a mano.

#### Scenario: Ningún número de la comparación está tecleado
- **WHEN** se comparan las cifras de los tres montajes en pantalla con las publicadas por el proceso
- **THEN** coinciden todas
