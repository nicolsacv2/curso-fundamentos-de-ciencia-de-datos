## Purpose

Cubre el bloque 1 de la sesión 5: el catálogo de los cinco gráficos más comunes, cada uno
presentado por el tipo de dato que admite y por la pregunta que responde, para que elegir
gráfico deje de ser cuestión de gusto.

## ADDED Requirements

### Requirement: Los cinco gráficos del catálogo
EL SISTEMA SHALL explicar en el bloque 1 cinco gráficos: barras, circular, caja,
histograma y dispersión.

#### Scenario: El bloque 1 los cubre todos
- **WHEN** alguien recorre el bloque 1 de la sesión 5
- **THEN** encuentra explicados los gráficos de barras, circular, de caja, histograma y de dispersión

### Requirement: Cada gráfico declara qué dato admite
EL SISTEMA SHALL indicar, para cada uno de esos cinco gráficos, qué tipo de dato admite.

#### Scenario: El tipo de dato acompaña a cada gráfico
- **WHEN** alguien lee la ficha de cualquiera de los cinco gráficos
- **THEN** se indica qué tipo de dato admite ese gráfico

### Requirement: Cada gráfico declara qué pregunta responde
EL SISTEMA SHALL indicar, para cada uno de esos cinco gráficos, qué pregunta responde.

#### Scenario: La pregunta acompaña a cada gráfico
- **WHEN** alguien lee la ficha de cualquiera de los cinco gráficos
- **THEN** se indica qué pregunta responde ese gráfico

### Requirement: Cada gráfico declara cómo se construye
EL SISTEMA SHALL explicar, para cada uno de esos cinco gráficos, cómo se construye a
partir de los datos.

#### Scenario: La construcción acompaña a cada gráfico
- **WHEN** alguien lee la ficha de cualquiera de los cinco gráficos
- **THEN** se explica cómo se construye ese gráfico a partir de los datos

### Requirement: Cada gráfico se ve dibujado
EL SISTEMA SHALL mostrar al menos un ejemplo dibujado de cada uno de esos cinco gráficos.

#### Scenario: Ningún gráfico se queda en la descripción
- **WHEN** alguien recorre el bloque 1
- **THEN** cada uno de los cinco gráficos aparece dibujado al menos una vez

### Requirement: Nube tridimensional rotable en el bloque 1
EL SISTEMA SHALL mostrar en el bloque 1 una nube de puntos tridimensional que el usuario
puede rotar.

#### Scenario: La nube 3D se deja girar
- **WHEN** alguien arrastra sobre la nube tridimensional del bloque 1
- **THEN** la escena cambia de ángulo
