## Context

La sesión 6 tiene hoy cuatro bloques: una entrada de 665 líneas que recorre la cadena de
limpieza y el PCA (78 minutos), el MCA (36), el FAMD (28) y el cierre con el FAMD del salón
(22). Todo lo que proyecta sale de `src/data/salon_limpio.js` y de
`src/sessions/s06/data/ejemplo.js`, generados; las figuras salen de `s06/figures/*.js` con
los helpers de `src/svg/kit.js` y `s06/figures/shared.js`; `scripts/check_figuras.mjs`
recorre las figuras de la sesión 6 y `scripts/check_salon.py` audita los datos.

El curso cuenta ocho sesiones en cuatro sitios: `SESIONES = 8` en `src/data/syllabus.js`,
«8 sesiones · 24 horas» y «Ocho sesiones…» en `Cover.jsx`, «Sesión NN de 08» tecleado en
`Session.jsx`, y la primera línea del README. La figura de destinos de la sesión 2 dice que
la tabla «se modela» en la sesión 7, y la figura de la paradoja de Simpson de la sesión 4
dejó de decir en qué sesión se resuelve.

Restricciones que mandan (`AGENTS.md`, `DEPLOY.md`): cuatro dependencias de npm, scripts
sin dependencias salvo `clean_salon.py`, un `import()` por bloque, rutas por hash, sin motor
de fórmulas, y ninguna cifra tecleada en lo que se proyecta.

Ver `proposal.md` para la motivación.

## Goals / Non-Goals

**Goals:**

- Que la sesión 6 sea la cadena de limpieza entera en cinco bloques, sin quitarle ni una
  frase, y que la sesión 7 sea el análisis de lo que no es número, del par de variables a la
  tabla entera.
- Que las tablas de contingencia y el CA se enseñen sobre la tabla del salón real, con las
  cifras generadas por un script sin dependencias que comprueba sus identidades.
- Que el total de sesiones viva en un solo sitio y todo lo demás lo lea.
- Mover el MCA, el FAMD y el cierre sin reescribirlos: solo sus puentes.

**Non-Goals:**

- No se reescribe la prosa de la cadena de limpieza: se corta por sus `<h3>` y se reparte.
- No se enseña la prueba de hipótesis del chi-cuadrado (p-valores, grados de libertad como
  criterio de decisión): con veintisiete personas el chi-cuadrado es una medida, y se dice.
- No se resuelven las otras deudas de la sesión 4 (el cumpleaños, el juego 2-1): no son
  tablas de contingencia.
- No se añade motor de fórmulas ni librería de análisis.
- No se conservan las direcciones antiguas `#s6/bloque-1` y `#s6/bloque-2` apuntando al MCA y
  al FAMD: el esquema de rutas es por hash y sin redirecciones, y la propuesta lo declara
  BREAKING.

## Decisions

### D1 · Nueve sesiones, y el total en un solo sitio

`SESIONES = 9` en `syllabus.js`, con `PENDIENTES` en las claves 8 y 9. `Cover.jsx` deja de
teclear «8», «24» y «Ocho»: cuenta `SESIONES`, calcula `SESIONES × 3` horas y escribe el
número en letras con una tabla de una línea. `Session.jsx` cambia «de 08» por
`pad2(SESIONES)`. Es lo que ya exige `material-publicado` para los títulos —un dato en un
solo sitio—, aplicado al total.

*Alternativa.* Dejar el «08» y el «24» tecleados y cambiarlos a mano: rechazada, es la
tercera vez que un número del curso se desactualiza por vivir en dos sitios.

### D2 · La sesión 6 se corta por sus propios encabezados

La entrada actual ya está partida en pasos con `<h3>`, así que el corte no inventa nada:

| Bloque | Contenido (los `<h3>` actuales) | Franja |
|---|---|---|
| entrada · «La tabla, y el texto» | Para empezar · Con qué vamos a trabajar · Paso 1 · Paso 1b | 0–32 |
| bloque 1 · «Los valores raros» | Paso 2 · Paso 3 · Paso 3b · Paso 4 | 32–70 |
| bloque 2 · «Rellenar, y acordarse» | Paso 5 · las marcas · Paso 6 · Paso 6b | 78–116 |
| bloque 3 · «Qué va con qué, y el PCA» | Paso 6c · Paso 7 | 124–164 |
| cierre · «¿Qué falta?» | la pregunta · ticket de salida · lo que queda | 164–180 |

Las constantes de módulo de `Intro.jsx` (`pct`, `d`, `r`) viajan con el bloque que las usa.
`s06/figures/intro.js` se parte igual, un módulo por bloque —`intro.js`, `block1.js`,
`block2.js`, `block3.js`— para conservar la convención de que cada bloque trae sus figuras
y que Vite no emita un módulo compartido de 780 líneas que cuatro bloques descargan entero.
Los `id` siguen con `ar-s6-`.

El cierre es nuevo y corto: la `Task` «¿Qué falta?» y la `Idea` que hoy cierran la entrada,
un ticket de salida —nombrar una columna que quedó fuera y su motivo— con respuestas que
sirven y que no, y «Lo que queda», que lee el título y el objetivo de la sesión 7 desde su
`meta.js` (importado desde `registry.js`, que ya trae todos los metas en el bundle
principal), de modo que el puente no se puede desactualizar.

Las franjas: la entrada vuelve a una duración normal; el bloque 3 es el más largo porque
carga las tres matrices y el PCA; hay dos pausas de ocho minutos como en las demás sesiones.

### D3 · La sesión 7 se monta moviendo, no copiando

`git mv` de `s06/blocks/Block1.jsx → s07/blocks/Block2.jsx`, `Block2.jsx → Block3.jsx`,
`Closing.jsx → Closing.jsx`, `s06/figures/block1.js → s07/figures/block2.js`,
`block2.js → block3.js`, `closing.js → closing.js`, `s06/data/ejemplo.js →
s07/data/ejemplo.js`; `s06/figures/shared.js` se copia a `s07/figures/shared.js` (cada
sesión es su propio chunk). Los prefijos de `id` pasan de `ar-s6-b1-`, `ar-s6-b2-`,
`ar-s6-c-` a `ar-s7-b2-`, `ar-s7-b3-`, `ar-s7-c-`. `scripts/ejemplo_mca_famd.py` escribe en
`s07/data/`.

Solo cambian los puentes. El MCA abre diciendo que es el CA del bloque anterior sobre la
tabla indicadora, y cita cuántas columnas quedaron fuera en la sesión 6 (la misma cifra
interpolada de `salon.js`). El cierre dice «el PCA de la sesión 6» donde decía «de la
entrada» y anuncia la sesión 8 leyendo `PENDIENTES[8]`. Las referencias internas «bloque 1»
y «bloque 2» pasan a «bloque 2» y «bloque 3».

### D4 · Las tablas del salón las produce un script sin dependencias

`scripts/tablas_salon.py` lee `src/data/salon_limpio.js` con `extract_salon.exportado`
—como hace `export_xlsx.py`— y escribe `src/sessions/s07/data/tablas.js`. No necesita el
`.xlsx` crudo ni el entorno virtual: la tabla limpia ya está publicada, y el CA de una tabla
de pocas filas se diagonaliza con el `jacobi()` de `extract_gapminder.py`, como el ejemplo.

*El par.* Candidatos: los pares de variables no numéricas con destino `limpia` que el
diagnóstico de la sesión 6 llamó «sanas» (`DIAGNOSTICO[c].forma === 'sana'`), sobre la
columna limpia (con sus niveles agrupados en «raro» incluidos, que es lo que la sesión 6
dejó). Para cada par se calcula el chi-cuadrado y la V de Cramér, √(χ²/(n·min(r−1, c−1))),
que vive en [0, 1]. Se elige la V mayor **entre los pares cuyas dos variables no tienen
ningún nivel de una sola persona y tienen a lo sumo cuatro niveles**, y se publican todos
los pares con su V, si pasaron los filtros y por qué no (`CANDIDATOS`), para que la entrada
pueda decir el criterio y no elegir a ojo. Sin el primer filtro gana tallaCamiseta × js
con λ₁ = 1: la persona que tiene a la vez «xl» y el «raro» de js fabrica sola la
asociación —la Stevia del bloque 2, antes de que el bloque 2 la enseñe—. Sin el segundo,
una tabla de 4 × 6 con veintisiete personas es una pared de unos y ceros. Con los dos
queda «usa Python × usa R». Filas: la variable con menos niveles; columnas: la otra.

*Lo que se publica.* `PAR` (variables, niveles en su orden de `ORDEN_NIVELES` si lo hay),
`TABLA` (recuentos, marginales, total), `PERFILES` (fila y columna, 3 decimales),
`ESPERADAS`, `CHI2` (por celda, total, φ² = χ²/n, V), `CA` (masas, valores propios,
porcentajes, coordenadas de filas y columnas en todos los ejes, contribuciones en porcentaje,
cos², la verificación de transición sobre la primera fila, la distancia chi-cuadrado entre
las dos primeras filas), y `SIMPSON`.

*Simpson.* Constantes declaradas en el script, con el relato de la sesión 4 —un
medicamento, dos grupos de edad, dosis alta o baja, mejora sí o no—: jóvenes con dosis alta
9 de 10 mejoran y con dosis baja 72 de 90; mayores con dosis alta 27 de 90 y con dosis baja
2 de 10. En cada grupo la dosis alta mejora más; en el total, 36 de 100 contra 74 de 100. El
script **asserta la inversión** —P(mejora | alta) > P(mejora | baja) en cada grupo y menor
en el total— y publica las tres tablas con sus condicionales; si alguien cambia las
constantes y la inversión desaparece, no escribe.

*Autocomprobación.* Marginales cuadran con el total y con `FILAS`; las esperadas conservan
los marginales; Σ contribuciones al χ² = χ²; Σλ = φ²; transición para todas las filas y
columnas; Σctr = 1 por eje; Σcos² = 1 por punto sobre todos los ejes; K = min(r, c) − 1
ejes no nulos. Signos por el máximo en valor absoluto. Redondeo: cuatro decimales en λ,
χ² y V; tres en perfiles y coordenadas; dos en porcentajes. Dos ejecuciones dan el mismo
archivo.

*Alternativa.* Calcularlo en `clean_salon.py` como paso 11: rechazada, exigiría el `.xlsx`
y el `.venv` para regenerar una tabla que sale de datos ya publicados.

### D5 · Las figuras de la sesión 7 nuevas, con prefijo `ar-s7-`

`s07/figures/shared.js` es copia de `s06/figures/shared.js` (fórmulas, `plano()`,
`cuadrado()`, `apilar()`, `pasaFiltro()`, `UMBRAL_COS2`). Módulos nuevos:

- `intro.js` (`ar-s7-in-`): la tabla observada contra la esperada dibujada como rejilla de
  celdas con la contribución al chi-cuadrado en color y signo (más de lo esperado, menos de lo
  esperado), con los marginales en los bordes; los perfiles de fila como barras al 100 % con
  el perfil marginal como referencia (la composición de `panelMosaico`); las tres tablas de
  Simpson como seis barras de P(mejora | dosis) —dos por grupo y dos del total— con el
  recuento de cada barra escrito, para que se vea que la mezcla pesa más un grupo que otro;
  y una figura de fórmulas: P(A | B), la esperada, el chi-cuadrado por celda y V.
- `block1.js` (`ar-s7-b1-`): fórmulas del CA (perfil y centroide; distancia chi-cuadrado;
  inercia = χ²/n; transición; contribución y cos²), y el mapa de filas y columnas: filas como
  círculos, columnas como cuadrados, rótulos con `nombre()` y apilados con `apilar()`, cada
  eje con su número y su porcentaje.

Las tablas numéricas (recuentos, perfiles, esperadas, contribuciones) van con el markup
`dtable` que los bloques ya usan, interpoladas.

`scripts/check_figuras.mjs` recorre `src/sessions/s06/figures/` y `src/sessions/s07/figures/`
y exige el prefijo `ar-s6-` o `ar-s7-` según la carpeta.

### D6 · Las franjas de la sesión 7

| Bloque | Franja |
|---|---|
| entrada · Probabilidad condicional y tablas de contingencia | 0–40 |
| bloque 1 · Análisis de correspondencias simples | 48–85 |
| bloque 2 · MCA | 93–128 |
| bloque 3 · FAMD | 128–155 |
| cierre · El salón entero | 155–180 |

El MCA baja de 36 a 35 minutos y el FAMD de 28 a 27; no se recorta material, se dice más
rápido porque el CA ya enseñó perfiles, distancia chi-cuadrado, inercia, transición,
contribución y cos². El cierre conserva sus 25.

### D7 · Las sesiones anteriores dicen el temario nuevo

La figura de destinos de la sesión 2 pasa a «SESIÓN 8 · se modela», y su comentario y su
`aria-label` con ella. En la sesión 4, la figura de la paradoja recupera la cita —«SESIÓN 7»
en su rótulo— y la prosa del bloque 3 vuelve a decir dónde se resuelve, ahora la sesión 7;
los comentarios que explicaban por qué se quitó la promesa se actualizan para explicar por
qué vuelve. El cierre de la sesión 4 no cambia: sigue anunciando la limpieza de la sesión 6,
que sigue siendo cierto.

### D8 · Los Purpose de los specs principales se corrigen al implementar

Un delta no cambia el Purpose de una capacidad existente, así que las tareas lo editan
directamente: `sesion-06-limpieza`, `sesion-06-imputacion` y `sesion-06-pca-cuantitativas`
dejan de decir «la entrada de la sesión 6»; `sesion-06-mca`, `sesion-06-categorias-raras`,
`sesion-06-famd` y `sesion-06-famd-del-salon` pasan a decir el bloque de la sesión 7 que
cubren; `sesion-06-figuras-rotuladas` cubre las dos sesiones. Los nombres de las capacidades
`sesion-06-*` que ahora viven en la sesión 7 se conservan: una capacidad no se renombra con
un delta, y el Purpose corregido dice dónde está el contenido.

## Risks / Trade-offs

- **La sesión 7 va justa de tiempo.** → Las franjas de D6 dan 40 + 37 + 35 + 27 + 25 = 164
  minutos de contenido y dos pausas. El CA adelanta la mitad del vocabulario del MCA, que por
  eso puede ir más rápido. Si sobra material se recorta en clase, no en el material.
- **El par elegido puede tener celdas esperadas muy pequeñas o un «raro» dominante.** → Se
  publican las esperadas y la entrada dice que con veintisiete personas el chi-cuadrado es una
  medida y no una prueba; el criterio se publica con los otros candidatos para que se pueda
  discutir.
- **Mover archivos rompe los enlaces repartidos a `#s6/bloque-1` y `#s6/bloque-2`.** → Es la
  decisión de la propuesta; ningún enlace deja de abrir algo. Se anuncia en el commit.
- **Cuatro bloques nuevos de la sesión 6 comparten constantes y figuras que hoy son un solo
  módulo.** → El corte es por `<h3>` y cada constante viaja con su único usuario;
  `check_figuras.mjs` atrapa figuras que dejen de exportarse, y `pnpm build` atrapa imports
  huérfanos.
- **El cierre de la sesión 6 y el «Lo que queda» de la 7 leen metadatos de otra sesión.** →
  `registry.js` ya importa todos los metas en el bundle principal; importar `meta07` desde el
  cierre de la 6 no arrastra ningún chunk de contenido.
- **`SESIONES × 3` horas asume sesiones de tres horas.** → Es lo que la portada afirma hoy;
  si algún día cambia, es una constante junto a `SESIONES`.

## Migration Plan

- Mergear a `master` despliega. No hay migración de datos: `salon.js`, `salon_limpio.js` y
  `salon_limpio.xlsx` no cambian; `ejemplo.js` cambia de carpeta y `tablas.js` es nuevo,
  los dos versionados.
- Antes de mergear: `pnpm build`, `scripts/tablas_salon.py` y `scripts/ejemplo_mca_famd.py`
  dos veces con `diff` vacío, `node scripts/check_figuras.mjs`, `scripts/check_salon.py`
  donde esté el `.xlsx` crudo, y la revisión a 390 px de los diez bloques de las sesiones 6
  y 7.
- Vuelta atrás: revertir el commit. La sesión 6 vuelve a cuatro bloques y el curso a ocho
  sesiones; ningún otro estado depende de este cambio.
