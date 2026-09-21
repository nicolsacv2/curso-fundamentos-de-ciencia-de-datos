## Context

Ver `proposal.md` — Why. Lo que aquí importa del estado actual:

- La cadena entera es **una tubería de scripts**, no código de navegador:
  `extract_salon.py` (stdlib pura) lee el `.xlsx` y escribe `src/data/salon.js`;
  `clean_salon.py` (única con dependencia, `feature-engine` en `.venv/`) lo lee y escribe
  `src/data/salon_limpio.js`; `check_salon.py` y `check_pca.py` auditan; `export_xlsx.py`
  arma el archivo que se le entrega a la clase. La entrada solo **interpola** lo que esos
  archivos traen: no calcula nada al abrirse.
- Por eso casi ninguna cifra de la entrada está escrita a mano, y esa es la propiedad que
  hace este cambio viable. Añadir columnas mueve decenas de números en pantalla, y la
  mayoría se mueven solos.
- `extract_salon.py` lleva `assert` que **fijan** el estado actual: 27 filas,
  `len(COLUMNAS) + len(EXCLUIDAS) == 34`, tipos dentro de `{num, ord, cat}`. Son la red de
  seguridad del cambio, no un obstáculo: fallan en la terminal, no delante de la clase.
- La regla de oro de la sesión 3 —«la tabla se publica tal como llegó»— está escrita en
  `salon_v1_crudo` y en la spec `datos-del-salon`. Es lo que este cambio tiene que tocar
  con más cuidado, porque `edad` es el primer valor del conjunto que **no** viene del
  formulario.

## Goals / Non-Goals

**Goals**

- Que las cuatro columnas nuevas atraviesen la cadena entera por el camino que les
  corresponde **por su tipo declarado**, sin ningún caso especial escrito por nombre.
- Que después del cambio siga sin haber cifras de la entrada escritas a mano.
- Que el texto de la entrada que **interpreta** cifras —«el resultado es flojo», «más de la
  mitad no cabe»— se relea contra los números nuevos antes de darlo por bueno.
- Que rotular los ejes no sea maquillaje: donde el rótulo destape una figura mal
  construida, se arregla la figura.

**Non-Goals**

- No se rotulan las figuras de las sesiones 1 a 5 ni las de los bloques 1–3 de la 6. Solo
  la entrada de la sesión 6 (decidido con el titular del curso).
- No se rediseñan las figuras: se les añaden rótulos, con las dos excepciones que este
  diseño nombra (`textoPasos` gana una franja, `sedimento` corrige su escala).
- No se reabre qué hacer con `pantalla`. Sigue descartada, por los mismos motivos.
- No se toca el contenido de las sesiones 3 y 4.

## Decisions

### 1 · `edad` se deriva en `extract_salon.py`, no en la cadena de limpieza

La derivación es parte de **qué se publica**, no de cómo se limpia. Va en
`extract_salon.py`, junto a `COLUMNAS` y `EXCLUIDAS`, en una estructura declarativa
—`DERIVADAS`— paralela a la de `CORRECCIONES`, que ya resuelve el mismo problema: dejar
una transformación escrita con su motivo en vez de escondida en un cálculo.

*Alternativa descartada*: derivarla en `clean_salon.py`. La habría convertido en un
resultado de la limpieza, y no lo es: una persona tiene la misma edad antes y después de
estandarizar el texto.

### 2 · El año de referencia sale de `PROCEDENCIA.txt`, no de `datetime.now()`

`edad = 2026 − año`, con 2026 fijado como constante y anotado como el año de captura del
formulario. Un `datetime.now()` haría que el archivo generado cambiara solo por regenerarse
en enero, y la spec `datos-del-salon` exige que volver a generarlo dé lo mismo. Es la misma
razón por la que la semilla del imputador está clavada.

### 3 · Una columna derivada se declara, y el `.xlsx` de la clase también lo dice

`DERIVADAS` lleva, por columna: de qué columna del formulario sale, la regla, y el motivo
de derivarla en vez de publicar el original. Ese motivo baja a la bitácora de
`salon_limpio.xlsx`, que ya tiene una fila por decisión: derivar la edad **es** una
decisión de tratamiento y ahí es donde un alumno la va a buscar.

### 4 · Los extremos de una variable ordinal no se agrupan

El agrupador de niveles raros usa el 5 % de la clase (1,35 personas), así que `XL`, con una
sola, se fundiría en el saco «raro». No se agrupa: **el nivel más alto y el más bajo de una
variable ordinal quedan exentos**, aunque caigan bajo el umbral.

El motivo ya está escrito en el propio `clean_salon.py` para `balanceada` —fundir los
extremos opuestos de un rango es peor que dejarlos— y en la spec: los extremos de un orden
acotado son respuestas válidas por construcción, no rarezas. Agrupar `XL` diría que una
talla de camiseta grande es una anomalía, que es exactamente el error que la entrada pasa
sesenta minutos enseñando a no cometer.

La excepción **se explica en pantalla**, no se esconde: es del mismo tipo que el 1,5 de la
caja, un número elegido por alguien, y la entrada ya tiene el hábito de decirlo.

*Alternativas descartadas*: (a) agruparlo y usarlo de ejemplo del precio de la regla —el
golpe ya lo da `municipio`, y aquí contradiría lo que la misma entrada acaba de enunciar
sobre `balanceada`; (b) bajar el umbral para las ordinales —deja un número a dedo elegido
por el resultado que se quería, que es la crítica que la sesión hace del 1,5.

### 5 · `tallaCamiseta` necesita un orden declarado

Es ordinal, y `S · M · L · XL` no se ordena solo: alfabéticamente sale `L · M · S · XL`.
El orden de los niveles se declara junto a la columna. `balanceada` no lo necesitaba porque
sus niveles son números; esta es la primera que sí, y es la razón de fondo por la que entra
al curso.

### 6 · Las tres cuantitativas nuevas no llevan ningún caso especial

`edad`, `peso` y `estatura` entran a describir, a la caja, a la imputación y al PCA por ser
de tipo `num`. Ningún `if` por nombre. Si la caja marca un peso como atípico, se convierte
en hueco y se imputa, igual que el resto: es la cadena que la entrada enseña, aplicada sin
excepciones. **La entrada tendrá que decir en voz alta que ahí se le está inventando el
peso a una persona**, que es un caso mucho más incómodo que inventarle unos minutos de
celular, y por eso mismo enseña mejor.

### 7 · La franja de `textoPasos` se lee de `TEXTO`, que ya la tiene

`TEXTO` guarda por columna `crudo` y los cuatro `pasos`. La franja nueva es `crudo` contra
el último paso, una línea por columna. No hace falta calcular nada nuevo ni tocar
`clean_salon.py` para el cambio 2.

La figura queda en dos zonas: arriba, `municipio` recorrido paso a paso, como hoy; abajo,
las diecisiete líneas de resumen, con las que no se movieron visiblemente marcadas como
tales. El alto del `viewBox` crece en consecuencia —el archivo ya avisa en tres sitios de
que un `viewBox` corto recorta sin decir nada.

### 8 · Los rótulos de eje se resuelven con un helper, no repitiendo `txt()`

Ocho figuras que rotulan ejes con las mismas convenciones piden un helper en
`s06/figures/shared.js`, junto a `box`, `dot`, `bar` y `scale`. Uno solo, que coloque un
rótulo al final de un eje y reserve su alto, es lo que evita que cada figura invente su
propia posición y que la novena se olvide.

### 9 · `sedimento`: la acumulada pasa a un eje propio y rotulado

Hoy las barras se escalan a `[0, max(%)]` y la línea acumulada a `[0, 100]`. Se dibujan dos
escalas como si fueran una, y el comentario del código afirma lo contrario.

Se resuelve poniendo **las barras también en `[0, 100]`**, no dando a la acumulada un eje
derecho. Un porcentaje de varianza y un porcentaje acumulado de varianza son la misma
magnitud en la misma unidad; que hoy no compartan escala es un accidente de dibujo, no una
decisión. Un solo eje 0–100 % los hace comparables de verdad y la línea acumulada pasa a
verse por encima de las barras, que es lo que un gráfico de sedimentación quiere decir.

*Alternativa descartada*: un eje derecho 0–100 para la acumulada. Resuelve la mentira, pero
conserva dos escalas para dos cosas que se miden igual, y un eje doble es de los recursos
que la sesión 5 enseña a desconfiar.

*Efecto*: con las barras a 0–100 las primeras barras se ven más bajas que hoy. Es el
aspecto correcto, y hay que anticiparlo porque la figura ya se proyectó.

*Y el rótulo de la acumulada cuelga del punto al que se refiere.* Estaba anclado al centro
de CP2 y dibujado hacia la derecha, así que con doce componentes su texto cruzaba tres
columnas y se leía como si señalara el punto de CP3 — que está en otro porcentaje. Un rótulo
que nombra una cifra tiene que quedar pegado al punto que vale esa cifra, y con doce
componentes el sitio libre está a su izquierda, no a su derecha.

### 9b · El ancho del texto compuesto también recorta, y no se ve en las coordenadas

Una línea de prosa larga dentro de una figura se sale del `viewBox` por la derecha y SVG la
corta sin decir nada — el mismo fallo silencioso contra el que este archivo avisa tres veces
para el alto, pero por el otro lado.

No lo detecta mirar las coordenadas de los elementos, que es lo natural: el `<text>` empieza
dentro del marco y es su contenido el que se sale. Hay que estimar el ancho compuesto —en
monoespaciada, caracteres × ~0,6 em— y compararlo con el borde. La prosa larga se parte en
varias líneas, que es para lo que existe `wrap()` en `src/svg/kit.js`.

### 10 · El orden de trabajo es: datos primero, texto al final

Las cifras que la entrada interpreta —el porcentaje de las dos componentes, cuántos
atípicos, cuántas celdas imputadas— **no se pueden anticipar**: dependen de la tabla nueva.
Así que la tubería se regenera entera y se lee el resultado **antes** de reescribir una sola
frase de `Intro.jsx`. Escribir el texto primero obligaría a escribirlo dos veces, y la
segunda es la que se olvida.

### 11 · La marca de nulos se pone después de convertir el atípico en nulo

`AddMissingIndicator` va sobre `con_huecos`, la tabla en la que el atípico **ya** es `NaN`,
no sobre `crudo`. Así `<variable>_na` significa «esta celda es inventada», con independencia
de si el valor faltaba o si la regla de la caja lo descartó.

El motivo es que eso es lo que el análisis acabó viendo: a partir del paso 6 un hueco y un
atípico marcado son la misma cosa, y la marca tiene que decir la verdad sobre la tabla que
sale, no sobre una intermedia. Además coincide exactamente con `inventadas`, que es lo que
las tarjetas de la entrada ya muestran, así que la pantalla y el archivo dicen lo mismo.

*Alternativa descartada*: marcar solo quien no respondió, aplicándolo sobre `crudo`. Separa
no contestar —que puede ser informativo— de que una regla te descarte el valor, pero deja
sin marcar celdas que sí se inventaron, que es justo lo que la marca existe para evitar.

*Alternativa descartada*: dos indicadores, `_na` y `_out`. La distinción de tres bandas
—observado / no contestó / lo descartó la regla— es real y la entrada ya la enseña en las
tarjetas del paso 5, pero duplica las columnas del archivo entregado para una distinción
que a esa altura de la cadena ya no tiene efecto sobre nada.

### 12 · Las marcas se publican, pero no entran al PCA

No son cantidades, y el análisis opera sobre varianzas. Entran al generado y al `.xlsx`
que se le entrega a la clase; no entran a `PCA.variables`.

Que una marca de ausencia **sí** se pueda analizar —preguntarse si dejar cosas en blanco va
con algo— es una lección real, pero no es de este cambio: las marcas quedan disponibles
para el cierre de la sesión, que en este cambio **no se toca**.

*Implicación para el código*: el generado tiene que llevar las marcas en una estructura
propia, no mezcladas con las columnas de `TABLA`, para que nada que recorra las variables
cuantitativas se las encuentre por accidente.

### 13 · La tabla limpia se publica como tabla, no se recompone en el panel

Hoy sus datos están repartidos: las cuantitativas imputadas en `TABLA`, las no numéricas ya
estandarizadas y agrupadas dentro de `RAROS[c].valores`, y `codigo`, `libro` y `pantalla`
sin versión limpia en ningún sitio. Armarla en `Intro.jsx` significaría **calcular en el
navegador**, que es justo lo que toda la sesión evita.

Así que `clean_salon.py` gana una salida más: la tabla limpia completa, fila por fila, con
las 31 columnas, en el mismo orden de `COLS`. Las tres que la cadena no tocó van tal como
llegaron —las descartadas y las no analizables **no se imputan**—, y el generado declara,
por columna, en qué acabó: limpia, descartada o no analizable.

*Alternativa descartada*: derivarla en el panel a partir de `TABLA` y `RAROS`. Menos datos
generados, pero mete lógica de limpieza en un componente de React y deja tres columnas sin
resolver de todos modos.

### 14 · Las celdas inventadas se señalan con lo que `DataTable` ya sabe hacer

`DataTable` acepta `mark` con coordenadas `variable:fila` y le pone `.mk` a esa celda. Las
marcas del punto 4 del proposal se convierten en esa lista sin nada nuevo: el componente no
se toca.

Importa que no se toque porque **lo comparten las sesiones 3 y 4**, ya dadas en clase.

Para el destino de cada columna sí hace falta algo que el componente no tiene, porque `mark`
es por celda y esto es por columna. Se resuelve con una **prop opcional nueva** que marque
columnas: al ser opcional, quien no la pasa —las sesiones 3 y 4— no ve ningún cambio. Se
prefiere a colar el destino dentro del rótulo de la columna, que en la pared se lee como
parte del nombre de la variable.

### 15 · El ancho no es un problema nuevo: la tabla ya desplaza por dentro

`.dtable .frame` lleva `overflow:auto` con el encabezado y la columna de números fijos, y un
comentario del componente dice que ese desplazamiento **no se quita** a propósito: toda
actividad se responde señalando una celda, y señalar no sirve si has perdido de vista el
nombre de la columna. Con 31 columnas se desplaza el marco, no la página, que es lo que la
regla de los 390 px pide.

Lo que sí hay que comprobar es que **Ampliar** siga sirviendo de algo con 31 columnas: su
razón de ser es ver la tabla entera de un vistazo, y puede que a este ancho ya no quepa ni
ampliada. Si no cabe, el diálogo sigue siendo útil por el tamaño de letra, pero conviene
saberlo en vez de suponerlo.

### 16 · El subconjunto de cada matriz se calcula, y el criterio se proyecta

Ocho variables por matriz. Con el ancho de 980 px que usan las figuras de esta sesión, ocho
dan paneles de unos 115 px: se lee un punto, una caja y una barra. Doce darían 70 px, donde
solo se lee la textura.

Los dos criterios se calculan en `clean_salon.py` y se publican con la lista que producen,
para que la frase en pantalla y las variables dibujadas no puedan divergir:

- **Cualitativas**: las diagnosticadas **«sanas»** en el paso 1b —pocos niveles y
  repartidos—. Hoy son siete; con `tallaCamiseta` serán ocho. Es el primer uso real de ese
  diagnóstico, que hasta ahora se calcula, se dibuja y no decide nada. Y se justifica solo:
  una variable «casi todo único» daría veinte barras de altura uno, y una «dominada», un
  bloque.
- **Cuantitativas**: las ocho cuya **relación más fuerte con cualquier otra** sea mayor. Con
  los datos de hoy el orden es `diasAf`/`semanasAf` 0,64, `empleos`/`viajes` 0,44,
  `porciones`/`estudio` 0,43, `cafes`/`mascotas` 0,40, y `minutos` al fondo con 0,23. Cierra
  el argumento del paso 7: si ni siquiera esas ocho forman nube, ninguna lo hace.

*Alternativa descartada*: elegirlas a mano por criterio pedagógico. Es más flexible y da
mejores ejemplos, pero esta sesión se pasa una hora enseñando que una decisión que no está
escrita es la que no se puede auditar; elegir las variables del ejemplo a ojo sería hacer en
la figura lo que la sesión prohíbe en los datos.

*Alternativa descartada*: usar la matriz de correlaciones para elegir las cualitativas
también. No hay correlación entre categorías, y forzar una medida de asociación aquí
introduciría un concepto que la sesión no ha enseñado todavía.

### 17 · Las matrices se calculan en el script, como todo lo demás

Los binados de los histogramas, los cuartiles de cada caja por nivel y los recuentos de cada
barra salen de `clean_salon.py`, no del navegador. Es la misma regla que el resto de la
sesión, y aquí pesa más: son tres matrices de sesenta y cuatro paneles, y calcularlas al
abrir la página se notaría al proyectar.

Los tres helpers de dibujo —un panel de dispersión, uno de caja por nivel, uno de barras
agrupadas— van a `s06/figures/shared.js`, junto a `box`, `dot`, `bar` y `scale`, porque cada
uno se dibuja sesenta y cuatro veces.

### 18 · Los ejes de una matriz se rotulan en el borde, no en cada panel

La capacidad `sesion-06-figuras-rotuladas` pide que toda figura de la entrada diga qué mide
cada eje, y estas no son la excepción. Pero repetirlo en los sesenta y cuatro paneles los
llenaría de texto: el rótulo va en la fila de abajo y en la columna de la izquierda, una vez
por variable, que es como se lee una matriz.

La diagonal lleva su propio rótulo de unidad, porque ahí el eje vertical significa otra cosa
—personas, no la segunda variable— y es el sitio donde una matriz se malinterpreta.

### 19 · Las barras entre cualitativas se condicionan, y por eso pueden apilarse

Primero fueron agrupadas, con este argumento: apilar muestra el total, que no es la
pregunta. El argumento era correcto y **condicionar lo desactiva**. Cada barra se estira al
100 %, así que el total desaparece del alto y lo único que queda es el reparto — que es
exactamente la pregunta.

Sin condicionar no se podía comparar nada: los niveles van de 1 a 14 personas, y el reparto
de un grupo de dos sería una astilla al lado del de uno de once.

Pero normalizar tiene su propia trampa: **una barra hecha con una persona se ve tan firme
como una hecha con catorce.** Así que el ancho de cada barra es su n. Eso lo convierte en un
mosaico, y hace que las dos cosas —cuánta gente y cómo se reparte— se lean a la vez sin
añadir una cifra a sesenta y cuatro celdas.

*Alternativa descartada*: apiladas en crudo. Se ve el tamaño del grupo, pero es justo lo que
impide comparar repartos, que es para lo que existe la figura.

*Alternativa descartada*: atenuar las barras flacas, como las cajas huecas de la matriz de
al lado. Más barato y coherente, pero dice «poca gente» sin decir cuánta, y aquí el dato
existe y cabe.

### 20 · La paleta se validó, no se eligió a ojo

Hasta seis niveles hay que distinguir (`musica`), y con segmentos que se tocan la diferencia
tiene que aguantar también a quien no distingue todos los colores. Los seis tonos salen de
la paleta categórica de referencia en su versión para fondo oscuro, y se comprobaron contra
**nuestra** superficie (`--ground-2`, `#131D2B`), no contra la suya:

    #3987e5  #d95926  #199e70  #c98500  #d55181  #008300

Las seis comprobaciones pasan: banda de luminosidad (L 0,48–0,67), suelo de croma, separación
para daltonismo (peor par adyacente ΔE 8,4), suelo de visión normal (ΔE 19,3) y contraste
contra el fondo (≥ 3:1). Se validaron con el script, no razonando sobre ellas.

Dos consecuencias que el propio método impone:

- **Un hueco de 2 px entre segmentos apilados.** Es lo que evita que dos colores contiguos
  se lean como uno, y es codificación secundaria para el caso de daltonismo.
- **La diagonal es la leyenda.** El color no significa lo mismo en dos columnas distintas
  —cada variable tiene sus propios niveles—, así que una leyenda única sería mentira y una
  leyenda por columna serían cuarenta entradas. La celda diagonal de cada variable muestra
  sus niveles en ese mismo orden de colores, y ahí se aprende el mapeo.

### 21 · El nombre de pantalla es un tercer campo, y por qué no vale ninguno de los dos que ya hay

Una columna tiene ya dos textos: la **clave** (`erre`) y el **rótulo** corto (`usa R`).
Ninguno sirve para lo que hace falta.

- La clave no puede ser `R`. El `assert` de `extract_salon.py` lo impide, y con razón: la
  columna `R` de la hoja de cálculo es `balanceada`, así que una variable llamada `R` haría
  ambiguo precisamente lo que la regla protege. Además una clave es un identificador de
  JavaScript y de Python, y conviene que siga siéndolo sin comillas.
- El rótulo tampoco. Es la pregunta abreviada —«usa R»— y las figuras no muestran preguntas,
  muestran nombres de variable: el curso enseña a señalar una columna por su nombre, y
  cambiarlo por el rótulo desharía eso.

De ahí el tercero: el nombre con el que esa variable se escribe cuando la lee una persona.
Se declara junto a la columna, solo donde difiere de la clave, y **una función sola** lo
resuelve —«el nombre de esta variable»— para que ninguna figura decida por su cuenta.

*Consecuencia que hay que aceptar*: quien abra `salon_limpio.xlsx` vería `erre` en la
cabecera mientras la pantalla dice `R`. Por eso el nombre de pantalla se usa **también** en
ese archivo: la clave se queda dentro del código, que es el único sitio donde su forma
importa.

*Alternativa descartada*: que las figuras impriman el rótulo en vez de la clave. Arregla
«erre» sin añadir nada, pero cambia de golpe qué es lo que la clase lee en todas las figuras
de la sesión, y borra la distinción entre el nombre de una variable y la pregunta que la
originó — que es de las cosas que esta sesión enseña.

### 22 · La tabla de apertura deja de filtrarse, y no por eso pierde su argumento

Llevaba `pick` con las no numéricas, para que la primera imagen de la sesión fuera «casi
nada de esto son números». El efecto colateral era que tres columnas —edad, peso, estatura—
no aparecían hasta que la cadena ya estaba operando sobre ellas.

El filtro se quita. El requisito que lo motivaba pide que las no numéricas **estén** en esa
tabla, no que estén solas, así que mostrarlas todas lo sigue cumpliendo; y el argumento de
que son la mayoría no vivía nunca en el filtro, vive en el pie y en la figura del paso 1b,
que es donde se demuestra.

Lo que se gana es una simetría que antes no había: **la misma tabla abre y cierra la
cadena.** La de arriba cruda, la del paso 6b limpia, las mismas filas y las mismas columnas
en el mismo orden. Comparar las dos es lo que hace visible una hora de trabajo, y con una
filtrada y otra no, no se podían comparar.

*Alternativa descartada*: añadir solo las tres nuevas al `pick`. Arregla el caso concreto y
deja el criterio sin enunciar —¿por qué esas veintiuna?—, que es peor que cualquiera de las
dos opciones limpias.

### 23 · La bolsa de la que se sortea es la depurada, y eso hay que defenderlo

El imputador se ajusta sobre la tabla en la que el atípico YA es nulo, no sobre la original.
Si fuera al revés, el 960 minutos podría salir sorteado para rellenar el hueco de otra
persona: un valor que la regla acaba de declarar inservible reaparecería como si alguien lo
hubiera contestado, y en una columna distinta de la suya. Es el peor fallo posible de esta
cadena, porque no se nota mirando.

Hoy el orden es el correcto. Lo que no hay es nada que lo sostenga:

- La tabla original se construye, se copia y **no se vuelve a usar**. Queda un DataFrame con
  los atípicos dentro, a un nombre de variable de distancia del imputador. Se elimina: lo
  que no existe no se puede pasar por equivocación.
- El verificador compara cada valor inventado contra **todos** los observados, atípicos
  incluidos, así que un 960 imputado pasaría la comprobación. Tiene que comparar contra los
  que quedaron en pie.

La lección general, que vale para el resto del archivo: cuando la corrección depende del
orden de dos líneas, el orden no es garantía. O se hace imposible el orden malo, o se
comprueba el resultado.

### 24 · La entrada crece y hay que repartir los minutos otra vez

Tres matrices más, una tabla más y un paso más no caben en los sesenta minutos que la
entrada declara hoy. `meta.js` se reajusta, y las reglas que ya existen se mantienen: las
cinco franjas no se solapan, ninguna pasa del minuto 180, y la entrada sigue siendo la más
larga del curso. Los bloques 1 a 3 no tienen contenido todavía, así que ceder minutos ahora
es barato — pero el reparto hay que **decidirlo**, no dejar que lo herede el siguiente
cambio.

## Risks / Trade-offs

- **[Se revierte una decisión de privacidad en un sitio público.]** → Es una decisión
  explícita del titular del curso, no un descuido. La mitigación es documental y
  obligatoria: `extract_salon.py` y `PROCEDENCIA.txt` afirman hoy lo contrario y hay que
  reescribirlos en el mismo commit; si no, el repositorio queda diciendo que no publica lo
  que publica. Una tarea aparte lo cubre.
- **[El juicio «el resultado es flojo» puede quedar falso.]** `peso` y `estatura`
  correlacionan (r ≈ 0,56 sobre los 25 pares completos), y son el primer par de la tabla que
  se da la mano. Las dos primeras componentes probablemente suban del 47 % actual. →
  Ninguna de esas frases se toca hasta tener las cifras nuevas delante (decisión 10), y la
  spec de `sesion-06-pca-cuantitativas` exige que el texto no afirme nada que el porcentaje
  contradiga. Si el resultado deja de ser flojo, el argumento de la entrada **mejora**: la
  lección pasa a ser «cuando las variables se dan la mano, el método resume; cuando no, no»,
  con las dos mitades visibles en la misma tabla en vez de una sola.
- **[Imputar el peso de una persona.]** Con la tabla actual, la caja marca **una sola
  celda** en las tres cuantitativas nuevas: 95 kg en `peso`, contra un bigote superior de
  92,8. `edad` (bigotes [1,5 · 61,5]) y `estatura` (bigotes [139,5 · 191,5]) no tienen
  ninguno — los 57 años del mayor de la clase caben de sobra. A eso se suman los huecos: dos
  en `edad`, uno en `peso` y uno en `estatura`. → No se evita: es la cadena que la sesión
  enseña, y 95 kg no es un error de captura como podrían serlo los 960 minutos, lo que lo
  convierte en el segundo caso —y el más incómodo— del argumento que el paso 3 ya hace. Se
  dice en pantalla y se aprovecha. **Las cifras hay que releerlas tras regenerar**: rellenar
  el hueco de `peso` mueve los cuartiles y con ellos el bigote.
- **[La excepción de los extremos ordinales es una regla con asterisco.]** → Se explica en
  pantalla con el mismo trato que el 1,5 de la caja: un número o una regla que puso alguien.
  Una excepción explicada enseña; una escondida es deuda.
- **[La franja nueva de `textoPasos` y los rótulos hacen crecer las figuras a lo alto.]** El
  archivo tiene tres comentarios avisando de `viewBox` que recortan en silencio. → Cada
  figura tocada se revisa a 390 px, y esa revisión es una tarea propia, no un paso mental.
- **[Las marcas ensanchan el archivo entregado.]** Una columna `_na` por cada variable que
  recibiera valores inventados se suma a las 31 del archivo de la clase. → Van agrupadas al
  final y no intercaladas entre las variables, y la bitácora del `.xlsx` explica qué son.
  En pantalla no se muestran como columnas: la entrada ya las cuenta en las tarjetas.
- **[27 filas y 31 columnas, y ahora dos tablas así en la misma entrada.]** La de apertura
  y la limpia del final. → El marco desplaza por dentro (decisión 15), así que la página no
  se mueve; lo que hay que comprobar es que **Ampliar** siga aportando algo a ese ancho y
  que la entrada no se vuelva dos paredes de números seguidas. La de apertura ya usa `pick`
  para mostrar solo las no numéricas; la del final no puede recortar, porque su razón de ser
  es enseñarla completa.
- **[Las tres matrices son la mitad del trabajo de este cambio.]** Tres figuras nuevas de
  sesenta y cuatro paneles, con tres helpers y dos criterios calculados, pesan más que todo
  lo demás junto. → Van en el último grupo de tareas, después de los ejes —de los que además
  reutilizan el helper de rótulo—: si hay que partir el cambio en dos, se parte por ahí y lo
  anterior ya es desplegable por sí solo.
- **[Ocho variables por matriz dejan fuera a la mitad de la tabla.]** Y una de las excluidas
  por el criterio de correlación es `minutos`, que es la variable que la sesión 3 y la 4 han
  usado de ejemplo todo el curso. → Es la consecuencia honesta del criterio: `minutos` no se
  relaciona con nada, y eso es precisamente lo que la entrada quiere decir. Conviene nombrarlo
  en pantalla en vez de dejar que la clase note su ausencia.
- **[La matriz de cajas puede tener paneles casi vacíos.]** Un nivel con dos personas da una
  caja que no es una caja. → El criterio de las «sanas» lo mitiga —son las de niveles
  repartidos—, pero no lo elimina; hay que mirarlo con los datos delante y decir en pantalla
  qué significa una caja construida sobre dos respuestas.
- **[La tabla limpia puede leerse como «ya está, la tabla es verdad».]** Es el riesgo
  pedagógico de enseñar un resultado pulido justo antes del análisis. → Por eso las celdas
  inventadas van señaladas encima y el pie dice cuántas son: la tabla se presenta como lo que
  es, un objeto construido a base de decisiones, no como un dato recuperado.

## Migration Plan

No hay migración de datos ni estado: todo lo generado se reconstruye desde el `.xlsx`, que
no está en el repositorio. El despliegue es un merge a `master`.

El rollback es `git revert` del commit: los archivos generados están versionados, así que
volver atrás devuelve las cifras anteriores sin tener que regenerar nada ni tener el
`.xlsx` a mano.

Antes de mergear: `pnpm build` compila, la entrada se ve entera a 390 px sin scroll lateral,
y **Ampliar** abre, cierra con Esc y devuelve el foco. `master` es producción, sin paso
intermedio.
