# material-publicado Specification

## Purpose

Mantiene coherente el material que ya se dio en clase: ninguna sesión publicada puede
prometer algo que una sesión posterior no cumple. Cubre las dos promesas que las sesiones
2 y 4 hacían sobre la 5, y la constancia de que corregir la 2 la separa del curso original.

## Requirements

### Requirement: La sesión 2 no promete que la tabla se grafique en la 5
EL SISTEMA SHALL no mostrar en la sesión 2 ninguna flecha que anuncie que la tabla del
salón se grafica en la sesión 5.

#### Scenario: La flecha ya no está
- **WHEN** alguien mira la figura de destinos de la sesión 2
- **THEN** no hay ninguna flecha que anuncie que la tabla del salón se grafica en la sesión 5

### Requirement: Los tres destinos ciertos se conservan
EL SISTEMA SHALL conservar en esa figura de la sesión 2 los tres destinos que siguen
siendo ciertos: se limpia en la 3, se describe en la 4 y se modela en la 7.

#### Scenario: La figura mantiene lo que sí se cumple
- **WHEN** alguien mira la figura de destinos de la sesión 2
- **THEN** siguen los tres destinos: se limpia en la 3, se describe en la 4 y se modela en la 7

### Requirement: La divergencia con el curso original queda anotada
EL SISTEMA SHALL dejar constancia, junto a la figura corregida de la sesión 2, de que su
texto ya no coincide con el del curso original y de por qué.

#### Scenario: La razón está junto a la figura
- **WHEN** alguien abre el código de la figura corregida de la sesión 2
- **THEN** encuentra anotado que su texto ya no coincide con el del curso original, y por qué

### Requirement: El cierre de la sesión 4 deja de prometer el dibujo
EL SISTEMA SHALL dejar de anunciar en el cierre de la sesión 4 que los resúmenes
calculados allí se vuelven dibujo en la sesión siguiente.

#### Scenario: La promesa desaparece
- **WHEN** alguien lee el cierre de la sesión 4
- **THEN** no se anuncia que los resúmenes calculados allí se vuelvan dibujo en la sesión siguiente

### Requirement: El cierre de la sesión 4 anuncia lo que la 5 sí trata
EL SISTEMA SHALL anunciar en el cierre de la sesión 4 el contenido que la sesión 5 sí
trata.

#### Scenario: El puente se rehace bien
- **WHEN** alguien lee el cierre de la sesión 4
- **THEN** se anuncia el contenido que la sesión 5 sí trata
