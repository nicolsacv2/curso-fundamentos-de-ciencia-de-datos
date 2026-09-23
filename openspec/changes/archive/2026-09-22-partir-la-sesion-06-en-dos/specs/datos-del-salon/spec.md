## MODIFIED Requirements

### Requirement: Las sesiones 3, 4 y 6 leen del mismo sitio
EL SISTEMA SHALL hacer que las sesiones 3, 4, 6 y 7 tomen las respuestas del formulario de
ese conjunto compartido, y de ningún otro.

#### Scenario: Ninguna sesión conserva su copia
- **WHEN** se revisa de dónde toma cada sesión las respuestas del formulario
- **THEN** las sesiones 3, 4, 6 y 7 las toman del conjunto compartido
- **AND** no queda ninguna copia propia dentro de una sesión
