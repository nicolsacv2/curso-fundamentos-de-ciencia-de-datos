## Context

Las fórmulas de la sesión 7 se dibujan en SVG con un tipógrafo mínimo en
`src/sessions/s07/figures/shared.js`: `avance()` estima el ancho de un texto por glifo,
`measure()` suma piezas, `row()` las coloca de izquierda a derecha con barra, superíndice o
subíndice, y `frac()` centra numerador y denominador sobre una raya. Cada módulo de figuras
lleva su copia de `linea()` y `seccion()`, que componen con esas piezas. Hoy:

- `row()` y `measure()` avanzan `0.32 × cuerpo` tras cualquier índice, sea «i» o «adj».
- No hay pieza de raíz: «√» es un carácter dentro del texto (`'√λ'`, `'√('`, `'√p'`) o una
  pieza suelta a 26 px delante de una fracción (la V de Cramér).
- La familia es `SERIF = "'Iowan Old Style', Palatino, Georgia, serif"` de `src/svg/kit.js`.
  Comprobado en el navegador: la χ de Iowan Old Style se dibuja como una equis sin cola.
- `scripts/check_figuras.mjs` estima anchos de texto y solo mira si salen del marco.

La sesión 6 tiene su propia copia del tipógrafo (`s06/figures/shared.js`); este cambio no la
toca (ver proposal · Impact). Ver `proposal.md` para el porqué.

## Goals / Non-Goals

**Goals:** que las 92 piezas con índice, las 8 raíces y las letras griegas de la sesión 7 se
compongan bien de una vez, desde el tipógrafo, y que el chequeo automático atrape la
próxima regresión.

**Non-Goals:** no se añade motor de fórmulas; no se rehace la composición de las figuras ni
sus textos; no se toca la sesión 6; no se unifican las cuatro copias de `linea()`.

## Decisions

### D1 · El avance tras un índice se mide, no se supone

En `row()` y `measure()`, tras una pieza con `sup` o `sub`, el cursor avanza
`max(avance(sup, 0.62·cuerpo), avance(sub, 0.62·cuerpo)) + 0.06·cuerpo`. Los dos
cambian en el mismo sitio con una función `anchoIndice(p, size)` para que lo medido y lo
dibujado no se separen: `frac()` centra con `measure()` y `linea()` coloca la siguiente
pieza con `measure()`; si solo cambiara `row()`, la fracción quedaría descentrada.

*Añadido en la implementación:* el chequeo de solapes no atrapaba el «(O_ij» de la
captura porque el ancho de la O estaba estimado en medio cuadratín y mide cuatro
quintos, así que el índice caía sobre la propia O y no sobre el signo siguiente. La tabla
de anchos por glifo se sustituyó por una **medida en el navegador** (canvas
`measureText`, Iowan Old Style a 20 px, dividido por 20; las griegas medidas en la
familia con que se dibujan), y `check_figuras.mjs` usa esa misma `avance()` para estimar
las cajas, de modo que ve lo que el tipógrafo compuso. La fórmula de Benzécri, que
colocaba sus fracciones con desplazamientos literales (`X + 96`, `X + 132`…), pasó a
componerse desde un cursor con `measure()`, porque con el ancho verdadero de «adj» el
«=» cayó sobre el paréntesis.

*Efecto colateral aceptado:* todas las fórmulas se ensanchan unos píxeles donde había
índices largos. Las que ya rozaban el marco las atrapa `check_figuras`, y se ajustan una a
una (un `gap` menor o un `X` de arranque más a la izquierda).

### D2 · La raíz es una pieza con radicando

`row()` acepta `{ raiz: [...piezas] }` y `{ raiz: { top, bottom } }`:

- Se mide el radicando (`measure` de la fila, o la fracción como `max(top, bottom) + 26`
  de ancho y `~44 px` de alto).
- El signo se **traza**, no se escribe: un `<path>` con el gancho corto, la diagonal hasta
  la base y la subida hasta la altura del radicando (`alto = cuerpo × 1.1` para una fila,
  la altura de la fracción para una fracción), con `stroke` del color de la pieza y grosor
  1.4. Trazarlo es lo que permite que mida lo que mide el radicando; un glifo «√» no se
  puede estirar sin deformar el resto.
- La barra (vínculo) sale del vértice superior del signo y cubre el radicando entero, con
  2 px de aire por encima de lo más alto que tenga (un superíndice cuenta).
- El radicando se dibuja con `row()` o `frac()` a continuación, y el cursor avanza signo +
  radicando + aire. `measure()` calcula lo mismo.

Las ocho raíces migran: `[{ t: '√λ', sub: 'k' }]` pasa a `[{ raiz: [{ t: 'λ', sub: 'k' }] }]`
(cuatro veces, dos en el bloque 1 y dos en el bloque 2), `'√('…')'` de los residuos a
`{ raiz: [r_i, c_j] }`, `'√p'` del reescalado a `{ raiz: [p_j] }` (dos veces), y la V de
Cramér a `{ raiz: { top: [χ²], bottom: [n · min(…)] } }` en vez de una pieza «√» suelta
más una fracción aparte.

*Alternativa:* dejar «√» como carácter y solo añadir una barra. Rechazada porque el signo
seguiría sin escalar con una fracción, que es el caso más visible.

### D3 · Letras griegas en una familia que las dibuja

`row()` detecta si el texto de una pieza tiene algún carácter en U+0370–U+03FF y, si no
lleva `ff` explícito, lo compone con `GRIEGA = "Georgia, 'Times New Roman', serif"`. Georgia
y Times dibujan la χ con cola y la λ, η y Σ como se esperan. Solo cambia la familia de esa
pieza; las piezas latinas siguen en `SERIF`. `avance()` no cambia: ambas familias están cerca
del medio cuadratín por glifo.

*Alternativa:* cambiar `SERIF` entero a Georgia. Rechazada: cambiaría la cara de todas las
fórmulas del curso por una letra.

### D4 · `check_figuras.mjs` atrapa solapes

Nueva comprobación por figura: para cada `<text>` de familia serif (las fórmulas), se estima
su caja —`x` según el anclaje, ancho por `ANCHO_CAR.serif × fs × longitud`, alto `fs`
desde `y − fs` a `y`— y se reporta cualquier par de cajas que se intersequen en más de
`HOLGURA_SOLAPE = 3 px` en las dos direcciones. Se limita a la familia serif para no
disparar con los rótulos monoespaciados que se apilan a propósito. Un índice, al ser un
`<text>` propio, cuenta: si vuelve a caer sobre el signo siguiente, falla.

*Riesgo:* la estimación por glifo es tosca y puede dar falsos positivos con pares
legítimamente pegados (una fracción cuyo numerador es ancho). Se calibra con la holgura
sobre las 42 figuras actuales: la tarea exige cero falsos positivos tras el arreglo y al
menos un positivo verdadero antes de él (se corre el chequeo nuevo contra el código viejo
para verificar que atrapa los solapes de la captura).

### D5 · Verificación visual

Después de `check_figuras`, se miran ampliadas —en el navegador, con zoom— la V de Cramér
de la entrada, el chi-cuadrado celda por celda, la transición del bloque 1, la
suplementaria y Benzécri del bloque 2 (índices «sup» y «adj») y el reescalado del bloque 3.

### D6 · Por qué caben en el mismo plano, dicho antes del mapa

En `Block1.jsx`, entre el título «Filas y columnas en el mismo plano» y el `Diagram` del
mapa, una `Prose` de tres párrafos con negrita al frente —**Dos nubes.**, **Los mismos
ejes.**, **La transición.**— y un cuarto, **El precio.** El párrafo de la transición absorbe la
frase que hoy está después del mapa («Las filas y las columnas comparten el plano por las
fórmulas de transición…») y su verificación sobre «observado sol», y añade la vuelta:
«siguiente sol» como promedio de las filas pesado por el perfil de columna, dilatado, contra
su coordenada publicada. Así la verificación va en las dos direcciones, que es lo que
justifica superponer las dos nubes.

`ejemplo_lluvia.py` publica `CA.transicionInversa` con la misma forma que `transicion`
—`columna`, `eje`, `sumandos` (perfil de columna × coordenada de fila), `promedioPonderado`,
`raizLambda`, `dilatado`, `coordPublicada`— para la primera columna en el eje 1. El aserto ya
existe en `ca_de()` (la transición inversa para todas las columnas); solo falta publicar un
caso. `fTransicionCA` en `figures/block1.js` gana en su primera sección la línea de ejemplo
de la vuelta, debajo de la de la ida.

«Los mismos valores propios» no necesita cifra nueva: `ca_de()` diagonaliza SᵀS, y la prosa
dice que diagonalizar SSᵀ da los mismos λ —es lo que el script del ejemplo de ocho personas
ya comprueba en `suplementarias()`— y remite a los valores publicados.

### D7 · De dónde salen los valores propios, en el paso de los ejes

En `Block1.jsx`, el párrafo **Los ejes.** de «De las distancias al mapa» se amplía con el
cómo, en tres frases, y entre la `Prose` y la figura del salto entra una `NumTable` 3 × 3
con los residuos estandarizados del ejemplo (`CA.residuos`), signo incluido, cuyo pie dice
que sus cuadrados suman χ²/n (`CA.traza`). La prosa cita la diagonal de `CA.matriz` y su
traza, y los valores propios con el trivial (`CA.autovaloresConTrivial`), diciendo que el
cero es el del centrado y que por eso hay un eje menos que columnas.

`fSalto` en `figures/block1.js` pasa de tres a cinco secciones, en este orden: LA NUBE ·
LOS RESIDUOS (s_ij = (p_ij − r_i c_j)/√(r_i c_j), con la pieza `raiz`; ejemplo: la celda de
lluvia–lluvia) · LA MATRIZ Y SUS VALORES PROPIOS (SᵀS con traza = Σ s² = χ²/n; «se
diagonaliza como la matriz de correlaciones del PCA de la sesión 6»; ejemplo: la diagonal,
la traza y los tres valores propios) · LOS EJES (como hoy) · LAS COORDENADAS (como hoy). La
altura de la figura sigue a `seccion()`, así que crece sola.

`ejemplo_lluvia.py` publica en `CA`: `residuos` (I × J, tres decimales), `matriz` (J × J,
cuatro decimales), `traza` (cuatro), y `autovaloresConTrivial` (los K útiles más los ceros
que `ca_de()` descarta, cuatro decimales), y `assert`a que Σ de todos los valores propios
coincide con la traza y con φ² — la identidad que ya existe, ahora también contra la traza.
No se publican los vectores propios: la prosa dice que de ellos salen las coordenadas, y las
coordenadas ya están.

*Alternativa:* explicar la diagonalización con las rotaciones de Jacobi que el script usa.
Rechazada: es cómo lo calcula una máquina, no qué es; la clase ya tiene «la dirección que
más estira la nube» de la sesión 6, y es a eso a lo que se remite.

El bloque 2 no cambia: su «de los residuos se hace exactamente lo que la sesión pasada hizo
con las correlaciones» pasa a tener detrás el bloque 1, que ahora lo enseña.

### D8 · La notación del salto se define donde se usa

La sección LAS COORDENADAS de la figura del salto usaba f_ik sin decir qué era. Abre ahora
con la definición en su propia línea, antes de la fórmula —`f_ik = coordenada de la fila i
en el eje k · g_jk = la de la columna j`—, y el párrafo **Las coordenadas.** de la prosa
nombra la letra al definirla («esa es su f_ik»), para que figura y texto usen la misma. Es
la letra que la sección de la transición ya usa, así que nada más cambia.

## Risks / Trade-offs

- **Ensanchar los índices desplaza fracciones colocadas con desplazamientos a mano
  (`+ 40`, `+ 120`, `X + 430`).** → Esos desplazamientos siguen a `measure()`; los pocos que
  son literales se revisan en la lectura visual de D5 y `check_figuras` avisa si algo sale
  del marco.
- **La raíz trazada no casa con la tipografía del resto.** → Grosor y color iguales a los de
  la raya de fracción; en la pared una raíz de trazo fino junto a una serif es la norma en
  cualquier libro.
- **Georgia no está en el proyector.** → La pila cae a Times New Roman y después a `serif`;
  las tres dibujan la ji con cola.
- **La explicación del plano compartido suena a la sección de transición del bloque 2.** →
  Es a propósito: el bloque 2 dice «esto es lo que permite dibujar a las dos en el mismo
  plano» y el bloque 1 es donde se enseña por qué; la prosa del bloque 1 termina remitiendo
  al bloque 2, que lo reutiliza sobre la tabla indicadora.
- **Cinco secciones en la figura del salto la hacen larga.** → Sigue siendo una figura por
  paso y se lee ampliada; `check_figuras` avisa si algo se sale del marco.
- **El chequeo de solapes da falsos positivos en otras sesiones.** → Solo corre sobre las
  sesiones que ya recorre (6 y 7) y con la familia serif; se calibra en la tarea.

## Migration Plan

`pnpm build`, `node scripts/check_figuras.mjs`, revisión visual ampliada de las figuras de
D5 y los cuatro bloques a 390 px. Vuelta atrás: revertir el commit.
