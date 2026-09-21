# sesion-06-bloques-pendientes Specification

## Purpose

Cubre los tres bloques y el cierre de la sesión 6 que en este cambio quedan rotulados pero
sin contenido: qué anuncian, qué no prometen, y cómo se comportan para que la sesión sea
navegable de punta a punta sin aparentar que está terminada.

## Requirements

### Requirement: Los cuatro bloques restantes existen y se abren
EL SISTEMA SHALL montar los bloques 1, 2, 3 y el cierre de la sesión 6, alcanzables desde
los rótulos de la sesión.

#### Scenario: Ninguno queda inalcanzable
- **WHEN** alguien activa el rótulo del bloque 1, del bloque 2, del bloque 3 o del cierre de la sesión 6
- **THEN** se abre ese bloque

### Requirement: Abrirlos no rompe nada
EL SISTEMA SHALL abrir cada uno de esos cuatro bloques sin error y sin dejar la sesión en
un estado del que no se pueda salir.

#### Scenario: Se entra y se sale
- **WHEN** alguien abre uno de esos cuatro bloques y después vuelve a la entrada
- **THEN** ninguno de los dos pasos produce un error
- **AND** la entrada se muestra íntegra

### Requirement: Cada bloque lleva el rótulo de su tema
EL SISTEMA SHALL rotular el bloque 1 con el análisis de correspondencias múltiples, el
bloque 2 con el análisis factorial de datos mixtos, y el bloque 3 con la segmentación.

#### Scenario: Los tres temas están nombrados
- **WHEN** alguien mira los rótulos de los bloques de la sesión 6
- **THEN** el bloque 1 nombra el análisis de correspondencias múltiples
- **AND** el bloque 2 nombra el análisis factorial de datos mixtos
- **AND** el bloque 3 nombra la segmentación

### Requirement: Cada bloque dice que está pendiente
EL SISTEMA SHALL mostrar dentro de cada uno de esos cuatro bloques un aviso de que su
contenido todavía no está escrito.

#### Scenario: El aviso está a la vista
- **WHEN** alguien abre uno de esos cuatro bloques
- **THEN** ve un aviso de que su contenido todavía no está escrito

### Requirement: El aviso se distingue del contenido del curso
EL SISTEMA SHALL presentar ese aviso de forma que no se confunda con material de clase.

#### Scenario: Nadie lo proyecta creyendo que es contenido
- **WHEN** alguien abre uno de esos cuatro bloques
- **THEN** el aviso se distingue visualmente del material de clase

### Requirement: Un bloque pendiente no enseña nada a medias
EL SISTEMA SHALL no mostrar en esos cuatro bloques figuras, datos ni afirmaciones sobre
sus temas.

#### Scenario: No hay contenido parcial
- **WHEN** alguien abre uno de esos cuatro bloques
- **THEN** no encuentra figuras, datos ni afirmaciones sobre su tema

### Requirement: El bloque 1 anuncia lo que responderá
EL SISTEMA SHALL indicar en el bloque 1 que es donde se responde la pregunta con la que
termina la entrada.

#### Scenario: El puente de la entrada llega a alguna parte
- **WHEN** alguien abre el bloque 1 de la sesión 6
- **THEN** se indica que es donde se responde la pregunta con la que termina la entrada

### Requirement: Los bloques pendientes no prometen fechas
EL SISTEMA SHALL no anunciar en esos cuatro bloques cuándo estará escrito su contenido.

#### Scenario: No hay compromiso de fecha
- **WHEN** alguien lee el aviso de uno de esos cuatro bloques
- **THEN** no se anuncia cuándo estará escrito su contenido

### Requirement: La entrada no aparenta que la sesión está completa
EL SISTEMA SHALL no afirmar en la entrada de la sesión 6 que los bloques siguientes ya
tratan sus temas.

#### Scenario: La entrada no miente sobre lo que viene
- **WHEN** alguien lee la entrada de la sesión 6
- **THEN** no se afirma que los bloques siguientes ya traten sus temas

### Requirement: El índice no anuncia lo que no hay
EL SISTEMA SHALL no prometer desde el índice del curso contenido de la sesión 6 que
todavía no está escrito.

#### Scenario: El índice se corresponde con lo que hay
- **WHEN** alguien mira la sesión 6 en el índice del curso
- **THEN** no se promete contenido que todavía no está escrito

### Requirement: Cada bloque pendiente sigue viajando solo
EL SISTEMA SHALL cargar el contenido de cada uno de esos cuatro bloques por separado, como
el de cualquier otro bloque del curso.

#### Scenario: El esquema de carga no se rompe por estar vacío
- **WHEN** alguien abre uno de esos cuatro bloques
- **THEN** solo se descarga el contenido de ese bloque
