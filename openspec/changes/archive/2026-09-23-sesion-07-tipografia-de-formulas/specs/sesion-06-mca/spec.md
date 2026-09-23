## MODIFIED Requirements

### Requirement: Las fórmulas se ven escritas en la pared
EL SISTEMA SHALL mostrar las fórmulas del bloque de forma legible proyectadas, sin pedir
nada a un servidor externo para dibujarlas; compuestas de modo que ningún subíndice ni
superíndice se monte sobre el símbolo que le sigue, que toda raíz cuadrada lleve su barra
encima de todo el radicando y a su altura, y que cada letra griega se lea como la letra
que es.

#### Scenario: Las fórmulas no dependen de la red
- **WHEN** alguien abre el bloque 2 sin conexión, con la página ya cargada
- **THEN** todas las fórmulas se ven

#### Scenario: Un índice no pisa lo que sigue
- **WHEN** una fórmula del bloque 2 lleva un subíndice o un superíndice de más de una letra
- **THEN** el símbolo que sigue empieza después del índice, sin tocarlo

#### Scenario: La raíz cubre su radicando
- **WHEN** una fórmula del bloque 2 lleva una raíz cuadrada
- **THEN** la barra de la raíz cubre todo el radicando
- **AND** el signo de la raíz tiene la altura del radicando

#### Scenario: Las letras griegas se distinguen
- **WHEN** una fórmula del bloque 2 escribe una letra griega
- **THEN** se lee como esa letra y no como una latina parecida
