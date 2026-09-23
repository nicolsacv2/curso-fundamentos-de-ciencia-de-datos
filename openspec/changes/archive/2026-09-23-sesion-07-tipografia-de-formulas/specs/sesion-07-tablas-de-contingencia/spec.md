## ADDED Requirements

### Requirement: Las fórmulas de la entrada se componen sin solapes
EL SISTEMA SHALL dibujar las fórmulas de la entrada de modo que ningún subíndice ni
superíndice se monte sobre el símbolo que le sigue, que toda raíz cuadrada lleve su barra
encima de todo el radicando y a su altura, y que cada letra griega se lea como la letra
que es.

#### Scenario: Un índice no pisa lo que sigue
- **WHEN** una fórmula de la entrada lleva un subíndice o un superíndice de más de una letra
- **THEN** el símbolo que sigue empieza después del índice, sin tocarlo

#### Scenario: La raíz de la V de Cramér cubre su radicando
- **WHEN** alguien mira la fórmula de la V de Cramér
- **THEN** la barra de la raíz cubre la fracción entera
- **AND** el signo de la raíz tiene la altura de la fracción

#### Scenario: La ji es una ji
- **WHEN** una fórmula de la entrada escribe χ
- **THEN** se lee como la letra griega y no como una equis

#### Scenario: Un solape no llega a la pared
- **WHEN** dos textos de una fórmula de la sesión 7 se pisan
- **THEN** la comprobación de figuras del repositorio lo reporta y falla
