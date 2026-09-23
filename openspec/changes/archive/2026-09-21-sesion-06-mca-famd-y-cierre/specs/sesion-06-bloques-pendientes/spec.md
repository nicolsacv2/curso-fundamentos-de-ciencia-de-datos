## REMOVED Requirements

### Requirement: Los cuatro bloques restantes existen y se abren
**Reason**: Ya no hay bloques pendientes en la sesión 6. Los bloques 1 y 2 y el cierre
tienen contenido y el bloque 3 desaparece.
**Migration**: La existencia y navegabilidad de los bloques la cubre `sesion-06-estructura`
(«Cuatro bloques rotulados», «Las rutas conservan el esquema del curso»).

### Requirement: Abrirlos no rompe nada
**Reason**: Los bloques ya no están vacíos; que se abran sin error lo cubre la estructura de
la sesión, como en las demás sesiones.
**Migration**: `sesion-06-estructura`, «Las rutas conservan el esquema del curso».

### Requirement: Cada bloque lleva el rótulo de su tema
**Reason**: El rótulo del bloque 3 —la segmentación— desaparece con el bloque. Los otros
dos rótulos siguen siendo MCA y FAMD, y el cierre pasa a rotular el FAMD del salón.
**Migration**: Los rótulos viven en los metadatos de la sesión; el contenido de cada bloque
lo cubren `sesion-06-mca`, `sesion-06-categorias-raras`, `sesion-06-famd` y
`sesion-06-famd-del-salon`.

### Requirement: Cada bloque dice que está pendiente
**Reason**: Ningún bloque está pendiente.
**Migration**: Ninguna. El aviso de «Bloque en preparación» deja de mostrarse en toda la
sesión.

### Requirement: El aviso se distingue del contenido del curso
**Reason**: El aviso deja de existir.
**Migration**: Ninguna.

### Requirement: Un bloque pendiente no enseña nada a medias
**Reason**: Los bloques enseñan su tema entero; lo que cada uno tiene que enseñar lo fijan
sus capacidades nuevas.
**Migration**: `sesion-06-mca`, `sesion-06-categorias-raras`, `sesion-06-famd`,
`sesion-06-famd-del-salon`.

### Requirement: El bloque 1 anuncia lo que responderá
**Reason**: El bloque 1 ya no anuncia que responderá: responde.
**Migration**: `sesion-06-mca`, «El bloque 1 responde la pregunta de la entrada».

### Requirement: Los bloques pendientes no prometen fechas
**Reason**: No hay bloques pendientes que puedan prometer fechas.
**Migration**: Ninguna.

### Requirement: La entrada no aparenta que la sesión está completa
**Reason**: La sesión está completa. La entrada puede afirmar que los bloques siguientes
responden su pregunta, porque lo hacen.
**Migration**: `sesion-06-pca-cuantitativas`, «La pregunta anuncia a dónde va la sesión»,
ya exige que la entrada diga que los bloques siguientes la responden.

### Requirement: El índice no anuncia lo que no hay
**Reason**: Todo lo que el índice anuncia de la sesión 6 existe.
**Migration**: `sesion-06-estructura`, «El índice refleja los cuatro bloques».

### Requirement: Cada bloque pendiente sigue viajando solo
**Reason**: No hay bloques pendientes; que cada bloque viaje solo lo exige ya la estructura
de la sesión para todos sus bloques.
**Migration**: `sesion-06-estructura`, «Abrir la sesión 6 no carga las otras».
