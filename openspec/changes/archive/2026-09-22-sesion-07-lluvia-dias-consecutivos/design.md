## Context

`scripts/ejemplo_lluvia.py` declara la tabla 3 × 3 como constante (`DIAS`), comprueba sus
identidades —márgenes, esperadas, χ², Σλ, transición, Σctr, Σcos², la historia, Simpson— y
escribe `src/sessions/s07/data/lluvia.js`. Ninguna comprobación mira si la tabla puede salir
de una secuencia de días: los márgenes por fila (170, 135, 60) y por columna (155, 125, 85)
son incompatibles con la historia de «un día y el siguiente», donde cada día aparece en las
dos sumas salvo el primero y el último.

La entrada (`Intro.jsx`, `figures/intro.js`) y el bloque 1 (`Block1.jsx`, `figures/block1.js`)
leen `lluvia.js` e interpolan todo; ningún número está tecleado. Los rótulos dicen «hoy» y
«mañana» en cabeceras, notación, títulos de figura, rótulos de punto y descripciones
accesibles. Los bloques 2 y 3 y el cierre no nombran la tabla. Ver `proposal.md`.

Restricciones (`AGENTS.md`): scripts sin dependencias, nada calculado en el navegador, ninguna
cifra a mano, figuras con los helpers de la sesión, cada `id` con prefijo `ar-s7-`.

## Goals / Non-Goals

**Goals:**

- Que la tabla sea el recuento de un año que existe, y que la clase lo vea.
- Que los márgenes cuadren por construcción y que el script lo compruebe.
- Renombrar «hoy/mañana» a «día observado/día siguiente» en toda la sesión 7.

**Non-Goals:**

- No se cambia la estructura de la entrada ni del bloque 1 más allá de la sección nueva del
  año y la comparación de márgenes.
- No se imita un clima real: la regla de transición es didáctica y se dice.
- No se tocan Simpson, los bloques 2 y 3, el cierre, las franjas ni `check_figuras.mjs`.
- No se rediseña el CA: cambia su entrada, no su cálculo.

## Decisions

### D1 · La tabla se cuenta desde un año simulado, no se declara

El script declara tres constantes y nada más sobre la tabla:

- `TRANSICION`: una matriz estocástica 3 × 3, «desde el estado del día observado, la
  probabilidad de cada estado al día siguiente», con la diagonal alta —el cielo se repite— y
  con lluvia → lluvia más probable que la lluvia media. Es la historia, escrita como regla.
- `SEMILLA`: un entero fijo para `random.Random`, con el motivo en un comentario (el mismo
  que la sesión 6 da para su imputación: sin ella cada ejecución daría otro año).
- `DIAS_DEL_ANIO = 365` y `ESTADO_INICIAL`.

Con eso simula la cadena día a día, obtiene `anio` (365 estados) y **cuenta** los 364 pares
consecutivos en `N`. Todo lo demás —márgenes, perfiles, esperadas, χ², CA— sale de `N` como
hasta ahora.

*Asertos nuevos*, antes de escribir: `len(anio) == 365`; `n == 364`; para cada estado k,
`filas[k] − columnas[k] == [anio[0] == k] − [anio[-1] == k]` (que implica |diferencia| ≤ 1);
la diagonal es el máximo de cada fila; P(lluvia | lluvia) > P(lluvia) y P(sol | sol) > P(sol).
Los asertos de siempre siguen. Si la semilla elegida no cumple la historia, el script falla y
la semilla se cambia una vez, a mano, hasta que cumpla; queda fijada y comentada.

*Alternativa considerada.* Retocar la tabla declarada hasta que las sumas cuadren (por
ejemplo una tabla simétrica, que tiene márgenes iguales por definición). Rechazada: la
consistencia seguiría siendo una coincidencia del ajuste manual y no una propiedad del
método, un cambio futuro de una celda la rompería sin aviso, y perdería lo que el año enseña:
de dónde sale una tabla de contingencia.

*Alternativa considerada.* Construir un año que reproduzca exactamente la tabla actual
corregida (camino euleriano sobre los pares). Rechazada por complejidad frente a lo que
aporta.

### D2 · Lo que se publica

`lluvia.js` gana `ANIO` —`{ dias: 365, pares: 364, estados: [...365 estados],
primerDia, ultimoDia, semilla }`— y `TABLA` pasa a `n = 364` con `unidad: 'pares de días
consecutivos'`, `dias: 365`, y `margenes: [{ estado, observado, siguiente, diferencia,
explicacion }]` donde `explicacion` es `'primer día' | 'último día' | 'ninguna'` para que la
prosa la interpole. `PERFILES`, `ESPERADAS`, `CHI2` y `CA` conservan su forma. `SIMPSON` no
cambia. El comentario de cabecera y los de `TABLA` y `PERFILES` dicen «día observado» y «día
siguiente». `relato` pasa a «un año inventado de 365 días: el cielo de cada día contra el del
día siguiente».

La regla `TRANSICION` **no** se publica ni se muestra: la entrada enseña a leer una tabla,
no a simular una; publicar las probabilidades con las que se sorteó el año sería dar la
respuesta antes de la pregunta. El comentario del script lo dice.

### D3 · Los nombres

«Día observado» y «día siguiente» en todo lo que se lee en la sesión 7. Formas cortas donde el
espacio manda: cabeceras `observado \ siguiente`, `P(siguiente | observado)`,
`esperado \ siguiente`; rótulos de punto en el mapa `observado: sol (170)` y
`siguiente: sol (170)`; en las tablas de contribuciones, `fila · observado` y
`columna · siguiente`. Títulos de figura: «EL DÍA OBSERVADO × EL DÍA SIGUIENTE». Rótulos de
eje: «día observado» / «día siguiente». La pregunta del título pasa a «Si un día llueve,
¿llueve el día siguiente?». Las variables de código (`filas`, `columnas`, `celdaLluvia`) no
cambian de nombre.

«Hoy» se conserva solo donde significa el día de la clase («Hoy entran todas», el gancho de
`meta.js`). La comprobación es un `grep -in "mañana"` sobre los cuatro archivos de la entrada
y el bloque 1, que no debe devolver nada, y un `grep -n "hoy"` que solo devuelve «Hoy entran
todas».

### D4 · La sección del año y la de los márgenes en la entrada

Entre el párrafo que presenta el ejemplo y la tabla entran dos piezas:

1. **Figura `anio()`** en `figures/intro.js`, `id` con prefijo `ar-s7-`: 365 celdas en
   filas de 30 (12 filas y una de 5), cada celda del color de su estado con los tres colores
   que `perfilesFila` ya usa para los estados, primer y último día con borde y rótulo, y a la
   derecha una leyenda. Debajo, un par de días consecutivos ampliado con la flecha «día
   observado → día siguiente» para mostrar la unidad. Pie: «365 días inventados → 364 pares».
2. **Prosa**: qué se cuenta (pares), cuántos hay, y la observación de que cada día entra dos
   veces salvo el primero y el último.

Después de la tabla, una `NumTable` pequeña con `cols = ['estado', 'como día observado',
'como día siguiente', 'diferencia']` desde `TABLA.margenes`, y un párrafo que interpola para
cada estado con diferencia distinta de cero cuál de los dos días la explica. Con eso la
pregunta del usuario —«¿no deberían ser al menos 169?»— queda respondida en pantalla, con la
regla y con el caso.

### D5 · El bloque 1 se relee, no se reescribe

Solo cambian los nombres y las cifras. Toda afirmación que ya se construye desde los datos
(`filasNombran`, `colsNombran`, `filaLejos`, `colLejos`, `extremoPos`, `extremoNeg`) se
arrastra sola. Dos frases dependen de un valor que la tabla nueva puede mover y se hacen
condicionales: «la tabla es casi una línea» solo se escribe si el eje 1 retiene más del 90 %
(constante con nombre en el bloque), y «los dos extremos del cielo» solo si `extremoPos` y
`extremoNeg` son un estado cada uno; si no, la frase alternativa nombra los estados que hay a
cada lado. La tarea exige leer `lluvia.js` regenerado antes de dar el bloque por hecho.

### D6 · Specs y documentación

Los `Purpose` de `sesion-07-tablas-de-contingencia` y `sesion-07-correspondencias-simples`
dicen «el cielo de hoy contra el cielo de mañana» y se corrigen en el spec principal durante la
implementación, como hizo el cambio anterior. El README describe el ejemplo como un año
simulado con semilla fija y contado en pares, y deja de decir que la tabla está «escrita
como constante en el script».

## Risks / Trade-offs

- **El año sorteado da una tabla fea (celdas de 3 dígitos irregulares, un eje 1 menos
  dominante que el 97,85 % actual).** → Es lo esperable de un recuento, y es mejor que una
  tabla redonda imposible. La prosa condicional de D5 absorbe el cambio de porcentaje; las
  cifras se interpolan.
- **Una semilla que cumpla la historia hay que buscarla.** → Se busca una vez, a mano; el
  aserto impide publicar si deja de cumplirse. Con una diagonal de 0,6–0,7 en `TRANSICION` y
  364 pares, la mayoría de las semillas cumplen.
- **La figura del año añade 365 rectángulos al SVG de la entrada.** → Son 365 elementos sin
  texto; `check_figuras.mjs` la recoge sola. A 390 px se mira a mano.
- **Publicar los 365 estados engorda `lluvia.js`.** → Unas 365 palabras cortas; el chunk de
  la entrada sigue siendo pequeño.
- **Renombrar deja algún «hoy» o «mañana» escondido en una descripción accesible.** → El
  `grep` de D3 cubre los cuatro archivos, incluidas las cadenas de `aria-label`.

## Migration Plan

- Mergear a `master` despliega. `lluvia.js` se regenera y se versiona con el cambio.
- Antes de mergear: `python3 scripts/ejemplo_lluvia.py` dos veces con `diff` vacío,
  `pnpm build`, `node scripts/check_figuras.mjs`, y la entrada y el bloque 1 de la sesión 7 a
  390 px.
- Vuelta atrás: revertir el commit.
