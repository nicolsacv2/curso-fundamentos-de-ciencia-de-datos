## Purpose

Fija el armazón de la sesión 5: que exista en el índice del curso, que se divida en los
mismos cinco bloques que las cuatro sesiones anteriores, y que anuncie en pantalla su
título, su gancho, su objetivo y la franja de minutos de cada bloque.

## ADDED Requirements

### Requirement: La sesión 5 está en el índice
EL SISTEMA SHALL ofrecer la sesión 5 en el índice del curso junto a las cuatro
existentes.

#### Scenario: El índice lista las cinco sesiones
- **WHEN** alguien abre el índice del curso
- **THEN** la sesión 5 aparece junto a las sesiones 1 a 4, con el mismo tratamiento que ellas

### Requirement: Cinco bloques con las etiquetas del curso
EL SISTEMA SHALL dividir la sesión 5 en cinco bloques rotulados Entrada, Bloque 1,
Bloque 2, Bloque 3 y Cierre, con las mismas etiquetas que las sesiones 1 a 4.

#### Scenario: La barra de bloques repite el esquema conocido
- **WHEN** alguien abre la sesión 5
- **THEN** la barra ofrece cinco bloques rotulados Entrada, Bloque 1, Bloque 2, Bloque 3 y Cierre
- **AND** los rótulos son los mismos que usan las sesiones 1 a 4

### Requirement: Título de la sesión
EL SISTEMA SHALL mostrar como título de la sesión 5 «Entender los datos visualmente».

#### Scenario: El título se lee al abrir la sesión
- **WHEN** alguien abre la sesión 5
- **THEN** el título que se lee es «Entender los datos visualmente»

### Requirement: Gancho de apertura
EL SISTEMA SHALL abrir la sesión 5 con el gancho «Cuatro variables no caben en un papel
de dos dimensiones; vamos a dibujarlas todas y a perder menos de lo que crees».

#### Scenario: El gancho abre la sesión
- **WHEN** alguien abre la sesión 5
- **THEN** se lee ese gancho antes de cualquier contenido del primer bloque

### Requirement: Objetivo de la sesión
EL SISTEMA SHALL mostrar como objetivo de la sesión 5 «elegir el gráfico que corresponde
a cada dato y a cada pregunta, y leer un plano factorial y un círculo de correlaciones
para ver a la vez más variables de las que caben en dos ejes».

#### Scenario: El objetivo acompaña al título
- **WHEN** alguien abre la sesión 5
- **THEN** ese objetivo se lee junto al título de la sesión

### Requirement: Franja de minutos por bloque
EL SISTEMA SHALL anunciar junto a cada bloque su franja de minutos: 0–35 la entrada,
35–75 el bloque 1, 83–120 el bloque 2, 128–166 el bloque 3 y 166–180 el cierre.

#### Scenario: Cada bloque anuncia su reloj
- **WHEN** alguien mira la barra de bloques de la sesión 5
- **THEN** cada bloque muestra su franja: 0–35, 35–75, 83–120, 128–166 y 166–180 respectivamente
