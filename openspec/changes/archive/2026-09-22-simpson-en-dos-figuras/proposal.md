## Why

La paradoja de Simpson se cuenta hoy en una sola figura de seis barras: los dos grupos de
edad y el total, lado a lado. Así la respuesta está en la pared antes que la pregunta: quien
mira ve a la vez las dos parejas que suben y la pareja que baja, y no llega a hacerse la
pregunta ingenua —«¿qué dosis es mejor?»— con la que la paradoja muerde. La figura enseña
el resultado, no la sorpresa.

## What Changes

- **La figura de seis barras se parte en dos.** La primera muestra solo el total —dos barras,
  dosis alta y dosis baja, con cuántas personas mejoraron de cuántas— y plantea la pregunta
  que se hace quien mira una tabla de dos variables: «¿qué dosis es mejor?». Leída sola,
  la respuesta es la dosis baja. La segunda muestra las mismas personas separadas por grupo
  de edad —cuatro barras, dos por grupo— y en cada grupo la dosis alta mejora más: esa es la
  paradoja, y aparece cuando se ha creído la primera figura.
- **La entrada cuenta la paradoja en ese orden**: primero la tabla total y su figura, con la
  pregunta; después las dos tablas de grupo y su figura, con la inversión; y al final la
  explicación con la tercera variable. Hoy las tablas van al revés —los grupos primero, el
  total después— y las tres antes de la única figura.
- Las dos figuras comparten escala, colores y el rótulo de cuántas personas hay debajo de
  cada barra, para que se comparen a ojo. Ninguna cifra se teclea: siguen saliendo de
  `SIMPSON` en `lluvia.js`.
- **Las fórmulas del bloque 1 definen cada símbolo que usan.** En la figura de perfil y
  distancia aparece c_j en un denominador sin haber sido presentado: es el perfil promedio,
  el margen de columna sobre n, y pasa a tener su igualdad junto a r_ij y m_i. En la figura
  de transición aparece c_ji dentro de una suma, también sin presentar: es el perfil de
  columna, n_ij / n_·j, y la glosa lo define. Son la misma letra con distinto subíndice,
  como en la notación habitual del análisis de correspondencias; se explica en la figura.
- **Los índices de las fórmulas quedan pegados a su letra.** El tipógrafo de fórmulas avanza
  hoy medio em por carácter, sea la letra que sea, y una letra ancha como la m queda debajo
  de su propio subíndice: «m_i» se lee con la i encima de la m. Pasa a avanzar por glifo,
  con una tabla de anchos estimados para las letras anchas y las estrechas, en la medición
  y en el dibujo a la vez, para que las fracciones y los índices sigan cayendo donde se
  calcula. Se corrige en las sesiones 6 y 7, que comparten la misma copia del tipógrafo y
  que `check_figuras.mjs` recorre; la copia de la sesión 5 no se toca.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `sesion-07-tablas-de-contingencia`: la paradoja de Simpson se presenta en dos figuras y en
  el orden pregunta → paradoja: el total primero, los grupos después.
- `sesion-07-correspondencias-simples`: las fórmulas de la distancia chi-cuadrado y de la
  transición definen c_j y c_ji donde los usan.
- `sesion-06-figuras-rotuladas`: los índices de una fórmula no pisan la letra que acompañan.

## Impact

- **Código que cambia**: `src/sessions/s07/figures/intro.js` (la función `simpson()` se
  reemplaza por dos, `simpsonTotal()` y `simpsonGrupos()`), `src/sessions/s07/blocks/Intro.jsx`
  (la sección de Simpson se reordena y muestra las dos figuras),
  `src/sessions/s07/figures/block1.js` (las fórmulas definen c_j y c_ji),
  `src/sessions/s07/figures/shared.js` y `src/sessions/s06/figures/shared.js` (el tipógrafo
  avanza por glifo).
- **Sin cambios** en datos, scripts, dependencias, rutas ni `check_figuras.mjs`, que recoge
  las figuras nuevas por existir.
