## ADDED Requirements

### Requirement: Los índices de una fórmula no pisan su letra
EL SISTEMA SHALL colocar cada subíndice y superíndice de las fórmulas dibujadas en las figuras
de las sesiones 6 y 7 a la derecha del borde de la letra que acompaña, sea esa letra ancha o
estrecha, y colocar la fracción o el símbolo que sigue después del índice, sin encimarse.

#### Scenario: Un subíndice tras una letra ancha
- **WHEN** una fórmula lleva un subíndice o superíndice tras una letra ancha como la m
- **THEN** el índice empieza después del borde derecho de la letra
- **AND** la fracción o el símbolo siguiente no se le encima

#### Scenario: Las fracciones siguen alineadas
- **WHEN** una fórmula coloca una fracción midiendo el texto que la precede
- **THEN** la fracción cae después de ese texto, con el mismo avance por glifo con que se dibujó
