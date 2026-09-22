## ADDED Requirements

### Requirement: Los datos del salón entran solo en el cierre
EL SISTEMA SHALL no mostrar ningún dato de la tabla del salón —ni recuentos, ni nombres de
sus variables como datos, ni cifras derivadas de ella— en la entrada ni en los bloques 1, 2 y 3
de la sesión 7; la tabla del salón aparece únicamente en el cierre.

#### Scenario: Cuatro bloques sin salón
- **WHEN** alguien recorre la entrada y los bloques 1, 2 y 3 de la sesión 7
- **THEN** no encuentra ninguna cifra ni recuento que salga de la tabla del salón

#### Scenario: El cierre sí
- **WHEN** alguien abre el cierre de la sesión 7
- **THEN** encuentra el análisis de la tabla del salón

### Requirement: La sesión 7 no usa bloques de idea
EL SISTEMA SHALL presentar la sesión 7 sin ninguno de los bloques de «idea» —la frase de
cierre con la raya roja y el remate en rojo— en ninguno de sus cinco bloques.

#### Scenario: Ninguna idea en cinco bloques
- **WHEN** alguien recorre los cinco bloques de la sesión 7
- **THEN** no ve ningún bloque de idea
