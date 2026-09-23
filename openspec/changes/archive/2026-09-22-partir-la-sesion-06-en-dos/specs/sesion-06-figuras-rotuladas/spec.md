## MODIFIED Requirements

### Requirement: Cada eje dice qué mide
EL SISTEMA SHALL rotular, en cada figura de las sesiones 6 y 7 que tenga ejes —en la
entrada, en los bloques y en el cierre de cada una—, qué magnitud representa cada uno.

#### Scenario: Ningún eje queda mudo
- **WHEN** alguien mira una figura de cualquier bloque de las sesiones 6 o 7 que tiene ejes
- **THEN** cada eje lleva escrito qué magnitud representa

#### Scenario: Un eje factorial dice su número y su porcentaje
- **WHEN** una figura de las sesiones 6 o 7 dibuja un eje de un análisis factorial
- **THEN** ese eje lleva escrito su número y el porcentaje de inercia que retiene

#### Scenario: Una figura sin ejes declara su unidad de todos modos
- **WHEN** una figura de las sesiones 6 o 7 no tiene ejes pero muestra recuentos o magnitudes
- **THEN** lleva escrito de qué son esos recuentos o esas magnitudes

### Requirement: Los rótulos no rompen la figura en una pantalla estrecha
EL SISTEMA SHALL mantener las figuras de todos los bloques de las sesiones 6 y 7 dentro del
ancho de la ventana y sin recortar sus rótulos.

#### Scenario: A 390 px se ve entera y rotulada
- **WHEN** alguien abre cualquier bloque de las sesiones 6 o 7 en una ventana de 390 px de ancho
- **THEN** las figuras se ajustan al ancho
- **AND** la página no se desplaza horizontalmente
- **AND** ningún rótulo de eje queda cortado

#### Scenario: Ampliar funciona en cada bloque
- **WHEN** alguien activa «Ampliar» en una figura de cualquier bloque de las sesiones 6 o 7
- **THEN** se abre el diálogo de ampliación
- **AND** Esc lo cierra
- **AND** el foco vuelve al botón que lo abrió
