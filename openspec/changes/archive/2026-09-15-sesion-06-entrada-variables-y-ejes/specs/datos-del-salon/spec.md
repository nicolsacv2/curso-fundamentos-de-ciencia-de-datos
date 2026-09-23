## MODIFIED Requirements

### Requirement: Los valores se copian tal como llegaron
EL SISTEMA SHALL copiar cada valor exactamente como lo entregó el formulario, sin corregir
espacios, tildes, mayúsculas ni unidades, salvo en las columnas que el conjunto declare
explícitamente como derivadas.

#### Scenario: Los defectos se conservan
- **WHEN** alguien compara un valor del conjunto con el del formulario
- **THEN** coinciden carácter por carácter
- **AND** los espacios sobrantes, las tildes faltantes y las unidades mezcladas siguen ahí

#### Scenario: Una columna derivada es la excepción declarada
- **WHEN** el valor de una columna no coincide con el del formulario
- **THEN** esa columna está declarada como derivada
- **AND** ninguna columna no declarada como derivada se aparta de lo que entregó el formulario

### Requirement: No se publica lo que reidentifica
EL SISTEMA SHALL excluir del conjunto las columnas que permitirían reconocer a una persona
concreta de la clase por el detalle de lo que dicen de ella, y publicar en su lugar, cuando
exista, una versión de esa información que el curso necesite analizar.

#### Scenario: Las columnas sensibles no están
- **WHEN** se revisan las columnas publicadas
- **THEN** no está la marca temporal del envío
- **AND** no está el nombre exacto del programa de pregrado
- **AND** no está el año de nacimiento, del que solo se publica la edad derivada
- **AND** no está el grupo de edad, que dice lo mismo que la edad con menos detalle

#### Scenario: No se publica dos veces la misma información
- **WHEN** el conjunto publica una columna derivada de otra del formulario
- **THEN** no publica además la columna de la que se derivó
- **AND** no publica otra columna que diga lo mismo con menos detalle

#### Scenario: La decisión de publicar una columna sensible queda registrada
- **WHEN** se publica una columna que antes se excluía por reidentificar
- **THEN** junto al conjunto queda escrito que se decidió publicarla
- **AND** queda escrito qué se aceptó a cambio

### Requirement: Cada columna declara su tipo
EL SISTEMA SHALL declarar para cada columna publicada si es categórica, ordinal o
cuantitativa.

#### Scenario: El tipo no hay que adivinarlo
- **WHEN** se lee la descripción de una columna del conjunto
- **THEN** dice si es categórica, ordinal o cuantitativa

#### Scenario: Un orden no se disfraza de cantidad ni de nombre
- **WHEN** una columna tiene niveles que se ordenan pero no se suman
- **THEN** se declara ordinal
- **AND** no se declara ni categórica ni cuantitativa

## ADDED Requirements

### Requirement: Una columna derivada declara de qué sale
EL SISTEMA SHALL dejar escrito, para cada columna derivada, de qué columna del formulario
procede y con qué regla se obtuvo.

#### Scenario: La derivación es auditable
- **WHEN** alguien abre el conjunto o lo que lo genera
- **THEN** encuentra, para cada columna derivada, de qué columna del formulario sale
- **AND** encuentra la regla con la que se obtuvo

### Requirement: Una derivación que depende del tiempo fija su referencia
SI el valor de una columna derivada depende de cuándo se calcule, ENTONCES EL SISTEMA SHALL
fijar y declarar el momento de referencia que se usó.

#### Scenario: El valor no cambia con el calendario
- **WHEN** se regenera el conjunto en una fecha distinta
- **THEN** la columna derivada da los mismos valores
- **AND** el momento de referencia que los produce está declarado junto al conjunto

### Requirement: El conjunto publica las columnas que el curso necesita analizar
EL SISTEMA SHALL publicar todas las columnas del formulario salvo las que se excluyan, y
dejar enumerado cuántas son unas y cuántas otras.

#### Scenario: El recuento cuadra
- **WHEN** se suman las columnas publicadas y las excluidas
- **THEN** el total es el número de columnas del formulario de origen

#### Scenario: Ninguna cifra de columnas se escribe a mano
- **WHEN** el material en pantalla dice cuántas columnas hay, de cada tipo o en total
- **THEN** esa cifra se obtiene del conjunto
- **AND** no está escrita literalmente en el texto

### Requirement: Una variable se escribe con el nombre que tiene
EL SISTEMA SHALL mostrar cada variable, allí donde una persona la lee, con el nombre con el
que esa cosa se escribe, aunque su clave interna sea distinta.

#### Scenario: El nombre proyectado no es una deformación de la clave
- **WHEN** alguien lee el nombre de una variable en el material del curso
- **THEN** lo ve escrito como se escribe esa cosa
- **AND** no ve una versión deformada para que la clave fuera un identificador válido

#### Scenario: La clave sigue sin parecerse a una letra de la hoja
- **WHEN** se revisan las claves de las columnas publicadas
- **THEN** ninguna coincide con una letra de columna de la hoja de cálculo de origen

### Requirement: El nombre de pantalla se declara una vez y se usa en todas partes
EL SISTEMA SHALL declarar ese nombre junto a la columna, y usarlo en todo lo que se entrega
o se proyecta, sin que cada figura o cada tabla decida el suyo.

#### Scenario: Pantalla y archivo dicen lo mismo
- **WHEN** se compara cómo se nombra una variable en el material y en la tabla que se entrega a la clase
- **THEN** coinciden

#### Scenario: Solo se declara donde hace falta
- **WHEN** la clave de una columna ya es el nombre de la cosa
- **THEN** esa columna no declara ningún nombre aparte
