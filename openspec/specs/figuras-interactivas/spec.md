# figuras-interactivas Specification

## Purpose

Fija cómo se comportan las figuras de la sesión 5 en pantalla: que quepan en el ancho del
teléfono, que «Ampliar» abra y devuelva el foco, que las tridimensionales se dejen girar, y
que la sesión no guarde nada en el navegador ni dependa de la red.

## Requirements

### Requirement: Ninguna figura desplaza la página
SI una figura de la sesión 5 no cabe en el ancho de la ventana, ENTONCES EL SISTEMA SHALL
ajustarla sin producir desplazamiento horizontal de la página.

#### Scenario: A 390 px no hay scroll lateral
- **WHEN** alguien abre la sesión 5 en una ventana de 390 px de ancho
- **THEN** las figuras se ajustan al ancho
- **AND** la página no se desplaza horizontalmente

### Requirement: «Ampliar» abre el diálogo
CUANDO el usuario active «Ampliar» en una figura de la sesión 5, EL SISTEMA SHALL abrir el
diálogo de ampliación.

#### Scenario: El botón abre la figura a tamaño real
- **WHEN** alguien activa «Ampliar» en una figura de la sesión 5
- **THEN** se abre el diálogo de ampliación con esa figura

### Requirement: Esc cierra el diálogo
CUANDO el usuario pulse Esc con ese diálogo abierto, EL SISTEMA SHALL cerrarlo.

#### Scenario: Esc cierra
- **WHEN** alguien pulsa Esc con el diálogo de ampliación abierto
- **THEN** el diálogo se cierra

### Requirement: El foco vuelve al control que abrió
CUANDO ese diálogo se cierre, EL SISTEMA SHALL devolver el foco al control que lo abrió.

#### Scenario: El foco no se pierde
- **WHEN** el diálogo de ampliación se cierra, por Esc o por el botón de cerrar
- **THEN** el foco vuelve al control «Ampliar» que lo abrió

### Requirement: Ninguna imagen alojada fuera del repositorio
EL SISTEMA SHALL no usar en la sesión 5 ninguna imagen alojada fuera del repositorio.

#### Scenario: Todo lo que se ve vive en el repositorio
- **WHEN** alguien recorre la sesión 5 entera
- **THEN** ninguna imagen se pide a un servidor externo

### Requirement: No se almacena nada en el navegador
EL SISTEMA SHALL no almacenar nada en el navegador durante la sesión 5.

#### Scenario: La sesión no deja rastro local
- **WHEN** alguien recorre la sesión 5 entera y la cierra
- **THEN** no queda nada almacenado en el navegador

### Requirement: La sesión se ve entera sin red
MIENTRAS no haya conexión a la red, EL SISTEMA SHALL mostrar todo el contenido de la
sesión 5.

#### Scenario: Sin conexión no falta nada
- **WHEN** alguien recorre la sesión 5 sin conexión a la red, con la página ya cargada
- **THEN** todo su contenido se muestra

### Requirement: Arrastrar rota la escena
CUANDO el usuario arrastre sobre una figura tridimensional de la sesión 5, EL SISTEMA
SHALL cambiar el ángulo desde el que se ve la escena.

#### Scenario: El arrastre gira la figura
- **WHEN** alguien arrastra sobre una figura tridimensional de la sesión 5
- **THEN** cambia el ángulo desde el que se ve la escena

### Requirement: El ángulo inicial ya muestra lo que importa
MIENTRAS nadie haya rotado una figura tridimensional, EL SISTEMA SHALL mostrarla en un
ángulo en el que el plano y las proyecciones ya son visibles.

#### Scenario: Se entiende sin tocarla
- **WHEN** alguien abre un bloque con una figura tridimensional y no la rota
- **THEN** la ve en un ángulo donde el plano y las proyecciones ya son visibles

### Requirement: El ángulo no se conserva al salir del bloque
CUANDO el usuario abandone el bloque, EL SISTEMA SHALL no conservar el ángulo al que se
dejó la figura.

#### Scenario: Volver al bloque devuelve el ángulo inicial
- **WHEN** alguien rota una figura tridimensional, sale del bloque y vuelve a entrar
- **THEN** la figura se muestra otra vez en su ángulo inicial

### Requirement: Sin puntero, la figura sigue viéndose
SI el puntero no está disponible, ENTONCES EL SISTEMA SHALL seguir mostrando la figura
tridimensional en su ángulo inicial.

#### Scenario: La figura no depende del ratón para existir
- **WHEN** alguien abre la sesión 5 donde no hay puntero disponible
- **THEN** la figura tridimensional se sigue mostrando en su ángulo inicial
