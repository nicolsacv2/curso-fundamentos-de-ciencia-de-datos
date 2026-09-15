## Purpose

Cubre el cierre de la sesión 5, que enseña el reverso de todo lo anterior: gráficos cuyos
números son correctos y cuyo dibujo impide leerlos, para que quien salga del salón
reconozca uno antes de producirlo.

## ADDED Requirements

### Requirement: Un gráfico tridimensional junto a su versión plana
EL SISTEMA SHALL mostrar en el cierre al menos un gráfico tridimensional junto a la
versión bidimensional del mismo dato.

#### Scenario: La comparación está a la vista
- **WHEN** alguien abre el cierre de la sesión 5
- **THEN** ve al menos un gráfico tridimensional junto a la versión bidimensional del mismo dato

### Requirement: Qué se pierde con la tercera dimensión
EL SISTEMA SHALL enunciar en el cierre qué se pierde al añadir la tercera dimensión de ese
ejemplo.

#### Scenario: La comparación termina en un diagnóstico
- **WHEN** alguien lee el par de gráficos tridimensional y plano
- **THEN** se enuncia qué se pierde al añadir la tercera dimensión

### Requirement: Un gráfico sin etiquetas en los ejes
EL SISTEMA SHALL mostrar en el cierre un gráfico sin etiquetas en sus ejes.

#### Scenario: El caso se ve dibujado
- **WHEN** alguien recorre el cierre de la sesión 5
- **THEN** ve un gráfico sin etiquetas en sus ejes

### Requirement: Un gráfico sin ejes dibujados
EL SISTEMA SHALL mostrar en el cierre un gráfico sin ejes dibujados.

#### Scenario: El caso se ve dibujado
- **WHEN** alguien recorre el cierre de la sesión 5
- **THEN** ve un gráfico sin ejes dibujados

### Requirement: Un gráfico sobrecargado
EL SISTEMA SHALL mostrar en el cierre un gráfico sobrecargado de información hasta impedir
su lectura.

#### Scenario: El caso se ve dibujado
- **WHEN** alguien recorre el cierre de la sesión 5
- **THEN** ve un gráfico sobrecargado de información hasta impedir su lectura

### Requirement: Cada gráfico basura dice qué impide entender
EL SISTEMA SHALL indicar, para cada gráfico basura del cierre, qué impide entender.

#### Scenario: Ningún ejemplo se queda sin diagnóstico
- **WHEN** alguien lee cualquiera de los gráficos basura del cierre
- **THEN** se indica qué impide entender ese gráfico

### Requirement: Ticket de salida
EL SISTEMA SHALL plantear en el cierre un ticket de salida, como en las sesiones 1 a 4.

#### Scenario: La sesión cierra como las anteriores
- **WHEN** alguien llega al final del cierre de la sesión 5
- **THEN** encuentra un ticket de salida con el mismo tratamiento que en las sesiones 1 a 4

### Requirement: Sin tarea para la sesión 6
EL SISTEMA SHALL no pedir en la sesión 5 ninguna tarea para la sesión 6.

#### Scenario: El cierre no encarga trabajo
- **WHEN** alguien recorre la sesión 5 entera
- **THEN** en ningún punto se le pide una tarea para la sesión 6
