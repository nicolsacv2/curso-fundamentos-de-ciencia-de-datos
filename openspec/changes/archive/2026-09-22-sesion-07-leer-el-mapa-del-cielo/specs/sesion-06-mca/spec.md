## ADDED Requirements

### Requirement: De las distancias al mapa en el MCA
EL SISTEMA SHALL explicar en el bloque del MCA, entre la métrica chi-cuadrado y el mapa
factorial, cómo se pasa de las distancias al mapa con los mismos tres pasos del análisis de
correspondencias simples: que cada persona es un punto de la tabla disyuntiva con su masa,
medido con la distancia chi-cuadrado; que los ejes son las direcciones que más inercia
conservan, como en el análisis de componentes principales de la sesión 6, ahora sobre esa
nube y con esa métrica, y que hay J − Q; y que las coordenadas son las proyecciones sobre
esos ejes, de modo que la distancia entre dos personas en el mapa aproxima su distancia
chi-cuadrado y con todos los ejes es exacta.

#### Scenario: Los tres pasos están escritos y en orden
- **WHEN** alguien lee el bloque del MCA entre la métrica y el mapa
- **THEN** ve los tres pasos —la nube, los ejes, las coordenadas— en ese orden
- **AND** se remite al análisis de correspondencias simples del bloque anterior como el mismo salto
- **AND** se enuncia que la distancia en el mapa aproxima la chi-cuadrado y es exacta con todos los ejes

#### Scenario: El salto se verifica sobre dos personas
- **WHEN** alguien lee la verificación del salto
- **THEN** ve dos personas del ejemplo con su distancia calculada desde la tabla disyuntiva, desde las coordenadas sobre todos los ejes, y desde las dos del mapa
- **AND** las dos primeras coinciden
- **AND** la tercera se acompaña del porcentaje de inercia que el plano retiene

#### Scenario: Las cifras del salto se generan y se comprueban
- **WHEN** la distancia desde la tabla disyuntiva no coincide con la distancia entre las coordenadas sobre todos los ejes
- **THEN** el proceso que genera el ejemplo falla y no publica
