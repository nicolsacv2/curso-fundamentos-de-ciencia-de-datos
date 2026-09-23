## ADDED Requirements

### Requirement: Las fórmulas del FAMD se componen sin solapes
EL SISTEMA SHALL dibujar las fórmulas del bloque del análisis factorial de datos mixtos de
modo que ningún subíndice ni superíndice se monte sobre el símbolo que le sigue, que toda
raíz cuadrada lleve su barra encima de todo el radicando y a su altura, y que cada letra
griega se lea como la letra que es.

#### Scenario: Un índice no pisa lo que sigue
- **WHEN** una fórmula del bloque lleva un subíndice o un superíndice de más de una letra
- **THEN** el símbolo que sigue empieza después del índice, sin tocarlo

#### Scenario: La raíz del reescalado cubre su radicando
- **WHEN** alguien mira la fórmula del reescalado de una indicadora
- **THEN** cada raíz cubre con su barra todo su radicando

#### Scenario: Las letras griegas se distinguen
- **WHEN** una fórmula del bloque escribe una letra griega
- **THEN** se lee como esa letra y no como una latina parecida
