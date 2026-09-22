## Context

La entrada y el bloque 1 de la sesión 7 leen hoy `src/sessions/s07/data/tablas.js`, que
`scripts/tablas_salon.py` genera desde la tabla limpia del salón: el par «usa Python × usa R»
elegido por V de Cramér con dos filtros, sus perfiles, esperadas, χ², el CA, y la tabla de
Simpson como constantes. Los bloques 2 y 3 importan `salon.js` y `salon_limpio.js` para
tres frases de puente (cuántas columnas quedaron fuera, el agrupamiento en «raro», cuántas
variables habrá en el cierre). Hay ocho `<Idea>` en la sesión. Cada bloque de la sesión 7 lleva
su propia copia de un componente `Tabla` con el markup `dtable` de la entrada de la sesión 6,
y ninguna copia marca la celda de esquina con la clase `n` que `DataTable` usa para dejarla
fija; con la tabla desplazada, la cabecera de fila pegajosa tapa la primera columna.

Restricciones (`AGENTS.md`): scripts sin dependencias, ninguna cifra tecleada en lo que se
proyecta, un `import()` por bloque, sin motor de fórmulas. Ver `proposal.md` para el porqué.

## Goals / Non-Goals

**Goals:**

- Enseñar la probabilidad condicional y el CA sobre una sola tabla que se entiende sin
  explicar de dónde salió, y que aun así tenga sus cifras generadas y comprobadas.
- Que ningún dato del salón asome en la sesión 7 antes del cierre.
- Quitar las ideas y dejar la prosa; una sola tabla numérica compartida, con la esquina fija.

**Non-Goals:**

- No se cambia el cierre (el FAMD del salón) ni los ejemplos de ocho personas del MCA y el FAMD.
- No se tocan las franjas, el temario ni `check_figuras.mjs`.
- No se retira el componente `Idea`: las otras sesiones lo usan.
- No se busca que el año inventado imite un clima real: es una tabla didáctica, y se dice.

## Decisions

### D1 · Un año inventado, declarado en un solo sitio

`scripts/ejemplo_lluvia.py` (stdlib pura) declara la tabla como constante —el cielo de hoy en
filas, el de mañana en columnas, estados «sol · nublado · lluvia»— y escribe
`src/sessions/s07/data/lluvia.js`:

| hoy \ mañana | sol | nublado | lluvia | suma |
|---|---|---|---|---|
| sol | 110 | 40 | 20 | 170 |
| nublado | 35 | 60 | 40 | 135 |
| lluvia | 10 | 25 | 25 | 60 |
| suma | 155 | 125 | 85 | 365 |

Un año de 365 días, con la historia que el ejemplo quiere contar: llover hoy hace más
probable llover mañana (P(lluvia | lluvia) = 25/60 frente a P(lluvia) = 85/365), y el cielo
tiende a repetirse. El script publica `TABLA`, `PERFILES`, `ESPERADAS`, `CHI2` (por celda,
total, φ², V), `CA` (con la misma forma que hoy tiene el CA de `tablas.js`: filas y columnas con
`coord`, `ctr`, `cos2`, la verificación de transición sobre la primera fila y la distancia entre
las dos primeras) y `SIMPSON`, que se muda aquí tal cual desde `tablas_salon.py`. Un año es
inventado y la tabla lo dice en su pie y en la prosa.

*Autocomprobación.* Total = 365 y marginales cuadran; las esperadas conservan marginales;
Σ contribuciones = χ²; Σλ = φ²; transición en las dos direcciones para todas las filas y
columnas; Σctr = 1 por eje; Σcos² = 1 por punto; K = 2 ejes; **la historia**: P(lluvia | lluvia
hoy) > P(lluvia) y P(sol | sol hoy) > P(sol); y la inversión de Simpson. Si algo falla, no
escribe. Redondeo: cuatro decimales en λ, χ² y V; tres en perfiles y coordenadas; dos en
porcentajes y contribuciones. Dos ejecuciones dan el mismo archivo.

*Alternativa.* Conservar `tablas_salon.py` para el CA y usar la lluvia solo en la entrada:
rechazada por el usuario (A: una sola tabla) y porque el salón no debe aparecer antes del
cierre. `tablas_salon.py` y `tablas.js` se borran; no queda quién los lea.

### D2 · La entrada y el bloque 1 se reescriben sobre `lluvia.js`, no se adaptan

Las secciones y las figuras conservan su forma —rejilla observado contra esperado, perfiles al
100 % con el margen como referencia, seis barras de Simpson, fórmulas; y en el bloque 1 las
fórmulas del CA y el mapa— pero la prosa cambia de sujeto: días en vez de personas, estados
del cielo en vez de niveles de una encuesta. Desaparecen la sección «Qué dos variables, y por
qué esas» y la tabla de candidatos. La celda sobre la que se lee P(A | B) es la del nombre
del ejemplo —lluvia hoy, lluvia mañana— y se toma por su nombre de estado desde `lluvia.js`,
no por índice. Los estados son palabras cortas, así que `abrevia()` deja de hacer falta y se
retira de `s07/figures/shared.js`.

En el bloque 1 el plano retiene el 100 % (dos ejes de una 3 × 3), y la prosa lo dice: aquí
no se pierde nada al dibujar, lo cual es la excepción y no la regla.

### D3 · Un solo componente de tabla, con la esquina fija

El `Tabla` repetido en cinco bloques pasa a `src/components/content/index.jsx` como
`NumTable` —una tabla numérica con cabecera, filas con su nombre, una fila de pie opcional, y
`marca(i, j)` para señalar celdas—, con el mismo markup `dtable`. Su celda de esquina lleva
`className="n"`, la que `DataTable` ya usa, y con eso hereda de `panel.css` el `position:
sticky` en las dos direcciones sin una regla nueva. Los cinco bloques de la sesión 7 la
importan. Los bloques de la sesión 6 usan el markup `dtable` a mano y no cambian.

### D4 · El salón, solo en el cierre

`Intro.jsx` y `Block1.jsx` dejan de importar `salon.js`, `salon_limpio.js` y `tablas.js`.
`Block2.jsx` (MCA) abre sin la cuenta de columnas y sin citar el agrupamiento en «raro» —el
remedio «fusionar» se explica con el propio ejemplo: Stevia + Nada— y deja de importar
`RAROS`. `Block3.jsx` (FAMD) cambia «en el cierre habrá N» por «en el cierre habrá muchas
más» y deja de importar `salon_limpio.js`. La comprobación es un `grep` de imports de
`salon` en `s07/blocks` y `s07/figures`, que solo debe devolver `Closing.jsx` y `closing.js`.

### D5 · Las ideas se quitan, no se convierten

Los ocho `<Idea>` se borran con su texto. Donde una idea cerraba una sección, la prosa que la
precede ya lo dice; no se reescribe nada para compensar.

### D6 · Specs

Los Purpose de `sesion-07-tablas-de-contingencia` y `sesion-07-correspondencias-simples` dicen
«la propia tabla del salón»; se corrigen en el spec principal como parte de la implementación,
porque un delta no cambia un Purpose.

## Risks / Trade-offs

- **Un ejemplo inventado enseña con datos que nadie recogió.** → Se declara inventado en la
  tabla y en la prosa, y la entrada dice que la tabla real vuelve en el cierre. El curso ya
  hace lo mismo con las ocho personas del MCA.
- **Con 365 «días» el χ² parece una prueba.** → La prosa dice que es una medida de asociación
  y no una prueba, y que con datos inventados no hay nada que probar.
- **Quitar el criterio del par pierde la lección de la categoría de una persona.** → La
  enseña el bloque 2 con la Stevia, con más detalle del que la entrada podía dar.
- **Un componente compartido nuevo en `content/index.jsx`.** → Es vocabulario de contenido,
  como `DataTable`; no toca rutas, chunks ni dependencias.

## Migration Plan

- Mergear a `master` despliega. `lluvia.js` es nuevo y versionado; `tablas.js` y
  `tablas_salon.py` se borran del repositorio.
- Antes de mergear: `pnpm build`, `scripts/ejemplo_lluvia.py` dos veces con `diff` vacío,
  `node scripts/check_figuras.mjs`, y la revisión a 390 px de los cinco bloques de la sesión 7.
- Vuelta atrás: revertir el commit.
