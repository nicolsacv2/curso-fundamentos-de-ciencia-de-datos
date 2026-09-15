# sesion-05-datos-gapminder Specification

## Purpose

Fija de qué datos sale todo lo que la sesión 5 dibuja: cuatro indicadores por país de
Gapminder, referidos a un mismo año, acreditados en pantalla y compartidos por la entrada
y los tres bloques. Es la decisión que rompe la continuidad con la tabla del salón.

## Requirements

### Requirement: Cuatro indicadores de Gapminder
EL SISTEMA SHALL usar como material de la sesión 5 cuatro indicadores por país tomados de
Gapminder: PIB per cápita, esperanza de vida, fertilidad y mortalidad infantil.

#### Scenario: El material es ese y no otro
- **WHEN** alguien recorre cualquier ejemplo de la sesión 5
- **THEN** los datos son PIB per cápita, esperanza de vida, fertilidad y mortalidad infantil por país, tomados de Gapminder

### Requirement: Un mismo año para los cuatro
EL SISTEMA SHALL usar esos cuatro indicadores referidos todos a un mismo año.

#### Scenario: No se mezclan años
- **WHEN** alguien mira los cuatro indicadores de la sesión 5
- **THEN** los cuatro corresponden al mismo año

### Requirement: El año está en pantalla
EL SISTEMA SHALL indicar en pantalla a qué año corresponden los datos.

#### Scenario: El año se puede leer
- **WHEN** alguien mira los ejemplos de la sesión 5
- **THEN** se indica en pantalla a qué año corresponden los datos

### Requirement: La nube 3D usa tres de los cuatro
EL SISTEMA SHALL dibujar la nube tridimensional con tres de esos cuatro indicadores.

#### Scenario: Tres ejes, tres indicadores
- **WHEN** alguien mira la nube tridimensional de la sesión 5
- **THEN** sus tres ejes son tres de esos cuatro indicadores

### Requirement: El mismo conjunto en toda la sesión
EL SISTEMA SHALL usar ese mismo conjunto en la entrada y en los tres bloques.

#### Scenario: No se cambia de material a mitad de sesión
- **WHEN** alguien recorre la entrada y los tres bloques de la sesión 5
- **THEN** todos usan el mismo conjunto de datos

### Requirement: Qué mide cada indicador, antes de graficarlo
EL SISTEMA SHALL describir qué mide cada indicador antes de graficarlo.

#### Scenario: Nadie ve un eje que no entiende
- **WHEN** alguien encuentra un indicador por primera vez en la sesión 5
- **THEN** se describe qué mide antes de que aparezca graficado

### Requirement: La tabla del salón no es el material de la sesión 5
EL SISTEMA SHALL no usar la tabla del salón como material de la sesión 5.

#### Scenario: El dataset del curso no aparece
- **WHEN** alguien recorre la sesión 5 entera
- **THEN** ningún ejemplo usa la tabla del salón

### Requirement: Cada ejemplo acredita su fuente
EL SISTEMA SHALL acreditar junto a cada ejemplo el nombre del conjunto de datos del que
sale.

#### Scenario: La fuente acompaña al dibujo
- **WHEN** alguien mira cualquier ejemplo de la sesión 5
- **THEN** junto a él se acredita el nombre del conjunto de datos del que sale
