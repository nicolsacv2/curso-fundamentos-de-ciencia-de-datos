## Context

La sesión 6 tiene hoy una entrada de 665 líneas que recorre la cadena de limpieza entera y
termina en «¿qué falta?», y cuatro bloques de diez líneas que muestran `<Pendiente>`. La
entrada ya fija las costumbres que los bloques nuevos heredan: nada se calcula en el
navegador, ninguna cifra se escribe a mano (todo se interpola desde `src/data/salon.js` y
`src/data/salon_limpio.js`), las figuras salen de funciones en `s06/figures/*.js` con los
helpers de `src/svg/kit.js` y `s06/figures/shared.js`, cada eje lleva rótulo, y
`scripts/check_salon.py` y `scripts/check_figuras.mjs` auditan lo publicado sin instalar
nada.

El material a pasar es `mca_famd_guia.md`: ocho partes, cuatro SVG en paleta clara con
coordenadas tecleadas, fórmulas en LaTeX, y un ejemplo de ocho personas cuyos números están
verificados a mano (valores propios, transición, Burt, Benzécri, la proyección de Stevia,
r², η², las sumas de cuadrados). Esa guía es la **fuente del contenido**; no es la fuente de
las cifras, que aquí tienen que salir de un proceso repetible.

Restricciones que mandan (ver `AGENTS.md` y `DEPLOY.md`): cuatro dependencias de npm y
ninguna más, scripts sin dependencias salvo `clean_salon.py`, un `import()` por
bloque, rutas por hash, sin motor de fórmulas.

Ver `proposal.md` para la motivación.

## Goals / Non-Goals

**Goals:**

- Pasar la guía entera a los bloques 1 y 2 sin recortar partes, en la forma del curso —
  salvo el software y el llamado en código de la parte 8.4, que no pasan (ver D6).
- Cerrar la sesión con el FAMD sobre la tabla limpia real, leído con el protocolo que los
  bloques acaban de enseñar, y que la prosa siga a las cifras y no al revés.
- Que todo número proyectado sea regenerable y verificable con el intérprete del sistema.
- Dejar la sesión 6 con cuatro bloques sin tocar nada del carril, el índice ni el router.

**Non-Goals:**

- No se enseña segmentación ni clustering: el bloque se elimina, no se pospone.
- No se añade motor de fórmulas (KaTeX, MathJax) ni librería de MCA (`prince`,
  `FactoMineR`): el ejemplo se calcula en stdlib y el salón con el `numpy` que ya está.
- No se cambia la cadena de limpieza ni la bitácora: el FAMD lee la tabla imputada y no
  toma ninguna decisión sobre los datos.
- No se rehace la entrada; solo se comprueba que su puente sigue siendo cierto.
- No se generaliza «cuatro bloques» a otras sesiones ni se parametriza nada para ello.

## Decisions

### D1 · Cuatro bloques, y el cierre es el FAMD del salón

La sesión queda: **entrada** (0–78, intacta), **bloque 1 · MCA** (86–122), **bloque 2 ·
FAMD** (130–158), **cierre · El salón entero** (158–180). El bloque 1 es el más largo de
los tres porque carga las partes 1 a 5 de la guía; el cierre es el más largo del curso
(22 minutos) porque carga el análisis final más el ticket de salida.

*Alternativas.* (a) Conservar cinco bloques poniendo el FAMD del salón como bloque 3 y
dejar un cierre corto: rechazada, el usuario pidió eliminar el bloque, y un cierre de ocho
minutos después del análisis final sería relleno. (b) Poner el FAMD del salón al final del
bloque 2: rechazada, el bloque 2 pasaría de 50 minutos y «cierra con el FAMD sobre el
salón» pide que sea lo último. Los cierres del curso ya cargan contenido (el de la sesión 5
son dos figuras y una actividad), así que un cierre analítico no rompe el patrón.

`Rail.jsx`, `Cover.jsx` y `App.jsx` recorren `meta.blocks` sin asumir su longitud, y
`App.jsx` resuelve un slug desconocido con `Math.max(0, findIndex(...))`, así que
`#s6/bloque-3` abre la entrada sin código nuevo. Se cubre con un escenario, no con código.

### D2 · Las cifras del ejemplo salen de un script de stdlib pura

`scripts/ejemplo_mca_famd.py`, sin dependencias, escribe `src/sessions/s06/data/ejemplo.js`
con los cuatro montajes de la guía:

- **MCA base**: 8 × 3 binarias (Bebida, Horario, Azúcar). Z, masas, S, valores propios,
  coordenadas de categorías e individuos, contribuciones, cos², Benzécri, Burt.
- **MCA con la rara activa**: la tercera variable pasa a Endulzante {Azúcar 4, Nada 3,
  Stevia 1}. Mismas salidas, más la distancia al centroide de cada categoría por la fórmula
  cerrada y la posición del individuo 7 en los dos montajes.
- **Suplementarias**: Nada y Stevia proyectadas sobre el MCA base por la fórmula de
  transición y, como comprobación, por la vía dual.
- **FAMD**: Bebida, Horario, tazas (4,5,3,4,1,0,2,1), sueño (6,5.5,6.5,7,8,8.5,7,7.5).
  Valores propios, porcentajes, puntuaciones, r² y η² por eje, las dos tablas de SC_dentro
  con subtotales, correlaciones para el círculo, coordenadas del cuadrado, baricentros.

*Cómo se diagonaliza sin numpy.* Reutiliza `jacobi()` de `scripts/extract_gapminder.py`
(importado con el mismo `sys.path` que `clean_salon.py` usa para `extract_salon`; el módulo
tiene guarda de `__main__`). En el MCA se diagonaliza SᵀS (J × J, simétrica) en vez de hacer
la SVD de S: da los mismos λ y las mismas coordenadas de categorías, y las de individuos
salen por la fórmula de transición, que es además lo que el bloque enseña. En el FAMD se
diagonaliza XᵀX/n (6 × 6). Los valores propios por debajo de 1e-9 se descartan: son los
triviales del centrado.

*Signos.* Un autovector tiene signo arbitrario y la prosa dice «los cafeteros a la
izquierda». En vez de fijar por el máximo en valor absoluto, como hace el PCA del salón, aquí
se fija **por una categoría nombrada**: Café negativo en el eje 1, Mañana positivo en el
eje 2; en el FAMD, tazas negativo en el eje 1 e individuo 7 positivo en el eje 2. Así el
mapa que se dibuja es el de la guía y la prosa no depende de una suerte.

*Autocomprobación.* Antes de escribir, el script `assert`a: Σλ = (J − Q)/Q; la fórmula de
transición para los ocho individuos; λ_Burt = λ²; Σctr = 1 por eje; Σλ_FAMD = 4;
Σr² + Ση² = λ_k para cada eje; SC_entre + SC_dentro = SC_total; var(F₁) = λ₁; suplementaria
por transición = suplementaria por vía dual. Si algo no cuadra, no publica. Además compara
contra las cifras de la guía con tolerancia 5e-4 y falla si se alejan: la guía es el
oráculo de aceptación de este script, no su fuente.

*Alternativa.* Calcularlo dentro de `clean_salon.py` con numpy: rechazada. El ejemplo no
depende del salón, no debería exigir el entorno virtual, y el precedente
(`extract_gapminder.py` → `check_pca.py`) ya está sentado.

### D3 · El FAMD del salón es el paso 10 de `clean_salon.py`

Se calcula con el `numpy` que `feature-engine` ya trae, sobre `imputado` (las 12
cuantitativas) y `columna_limpia` (las 16 no numéricas ya agrupadas), es decir sobre
exactamente las columnas con `DESTINO === 'limpia'`. Se publica en `salon_limpio.js` como
`FAMD`.

*Convención de pesos.* Individuos con peso 1/n, numéricas centradas y divididas por su
desviación **poblacional**, indicadoras z_j/√p_j − √p_j con p_j = n_j/n. Con eso cada
numérica tiene varianza 1, cada indicadora 1 − p_j, y la inercia total es
p_num + Σ_q Σ_{j∈q}(1 − p_j), que con todas las categorías activas es p_num + Σ(J_q − 1).
Se diagonaliza XᵀX/n; F = X·v; var_n(F_k) = λ_k. Se publican **todos** los ejes no nulos
(26, con n = 27) y las puntuaciones de las 27 personas en todos ellos, para que el cos²
sea verificable.

*Indicadores.* r²(F_k, x) para numéricas; η² por descomposición de SC para categóricas;
baricentro ḡ_jk = media de F_k sobre las personas con la categoría j (sin dilatar, como
las coordenadas cualitativas de FactoMineR); contribución de una categoría a un eje
= p_j·ḡ_jk²/λ_k², de modo que las contribuciones de todas las categorías y todas las
numéricas (r²/λ_k) suman 1 por eje; cos² = coordenada² / suma de coordenadas² sobre todos
los ejes, tanto para categorías como para personas. Esa definición del cos² es la que se
puede verificar sin fórmula cerrada, y coincide con la clásica cuando se conservan todos los
ejes.

*Dos montajes.* `FAMD.activo`: todo activo, incluidas las dos categorías de una sola
persona que el paso 3b decidió no agrupar (`5` de balanceada y `xl` de tallaCamiseta; el
script las encuentra por n_j = 1, no por nombre). `FAMD.sinRaras`: esas columnas se quitan
de X al estilo del MCA específico —la persona conserva el resto de sus columnas— y se
proyectan como suplementarias: su coordenada es la de su única persona. El verificador usa la
fórmula general de la inercia, que es la única que cuadra en los dos montajes.

*Marcas como suplementarias.* Solo en `FAMD.activo`: por cada variable con celdas
inventadas (`MARCAS[c].total > 0`) se publica el baricentro de las filas de
`MARCAS[c].filas`, su n y su cos². No entran en X: es lo que «no deformaron los ejes»
significa, y lo que la spec de imputación exige de las marcas.

*Signos.* Por el máximo en valor absoluto, como el PCA del salón: aquí no hay categoría
que la prosa espere a un lado concreto, y la prosa del cierre se escribe sin «izquierda» ni
«derecha».

*Redondeo.* Cuatro decimales en λ, r², η² y contribuciones; tres en coordenadas; dos en
porcentajes. Igual que el PCA.

### D4 · La verificación del salón entra en `check_salon.py`

Nueva función `comprobar_famd`, stdlib pura, que a partir de `LIMPIA` y `FAMD`:

1. recompone p_num + Σ(1 − p_j) sobre las categorías activas y comprueba que Σλ lo iguala;
2. recalcula r² y η² desde `LIMPIA` y las puntuaciones publicadas, los compara con los
   publicados, y comprueba Σr² + Ση² = λ_k eje por eje;
3. comprueba var_n(F_k) = λ_k y cov(F_k, F_l) = 0;
4. comprueba que cada baricentro publicado es la media de las puntuaciones de sus personas,
   incluidas las suplementarias y las marcas;
5. comprueba que las contribuciones suman 100 por eje y que los porcentajes salen de los
   valores propios.

Corre sobre los dos montajes. Como el PCA, no repite el cálculo: comprueba identidades.

### D5 · Figuras redibujadas, no pegadas

Tres módulos nuevos, `s06/figures/block1.js`, `block2.js` y `closing.js`, con prefijos de
`id` `ar-s6-b1-`, `ar-s6-b2-` y `ar-s6-c-`. Toman coordenadas de `ejemplo.js` o de
`salon_limpio.js` y las escalan con `scale()` de `shared.js`; ningún punto se coloca a
mano. Los SVG de la guía sirven de referencia de composición y de nada más.

- **Mapas factoriales** (bloque 1 ×3, bloque 2 ×1, cierre ×1): la composición de `plano()`
  de la entrada. Individuos como círculos, categorías como cuadrados, suplementarias como
  círculos punteados; leyenda dentro de la figura. En el ejemplo, color por variable con
  `CATEGORICO` de `shared.js` (tres variables, seis tonos). En el salón hay 16 variables
  categóricas, así que **no** se colorea por variable: cada baricentro que pasa el filtro se
  rotula «variable: nivel» y los demás se dibujan sin rótulo y atenuados; el filtro está
  escrito en la figura.
- **Círculo de correlaciones**: la mitad derecha de `plano()`, sola.
- **Cuadrado de relaciones**: cuadrado unitario, numéricas y categóricas con marca distinta
  y leyenda; en el salón, 28 puntos rotulados con `nombre()` y anticolisión mínima (los
  rótulos se apilan cuando dos puntos caen a menos de 12 px).
- **Inercia por eje del salón**: la composición de `sedimento()`, con el acumulado de las
  dos primeras componentes del PCA dibujado como referencia sobre la misma escala 0–100 y
  rotulado como tal.
- **Fórmulas**: como en `s05/figures/intro.js` —`row()`, `frac()`, `SERIF`—, copiando esos
  helpers a `s06/figures/shared.js` (cada sesión es su propio chunk y no importa de otra).
  Una figura por grupo de fórmulas: matriz indicadora y residuos; distancia chi-cuadrado y
  n/n_j − 1; transición; inercia y Benzécri; contribución y cos²; proyección suplementaria;
  los dos re-escalados del FAMD y la propiedad de equilibrio; r² y η².
- **Tablas numéricas** (Z, coordenadas, contribuciones, los dos destinos, SC_dentro): con el
  markup `dtable` que la entrada ya usa para las medidas, interpoladas.

`scripts/check_figuras.mjs` deja de tener la lista de figuras escrita: importa los cuatro
módulos y recorre `Object.keys` de cada uno, así que una figura nueva entra sola al chequeo.

### D6 · El bloque 1 sigue el orden de la guía

Partes 1 → 5 en su orden, con dos ajustes de puesta en escena: abre con el puente desde
«¿qué falta?» (la cifra de columnas no numéricas interpolada), y la tabla del ejemplo se
enseña antes que la matriz indicadora, porque en la pared una tabla de personas se entiende
y una de ceros y unos hay que explicarla. Cada fórmula va seguida de su cifra en el ejemplo.
Parte 5 —los conceptos en versión humana y el protocolo— cierra el bloque como una `Idea` y
cuatro `Cards`, porque el cierre las vuelve a usar tal cual.

El bloque 2 sigue las partes 6 → 8 y la síntesis final. La parte 7 (cómo se calculan r², η²
y los porcentajes) se coloca **entre** la interpretación del ejemplo y los gráficos, como en
la guía: primero se ve el resultado, después se entiende de dónde salió, y con eso se leen
los gráficos.

La parte 8.4 de la guía —el software de referencia y el llamado en R— **no pasa al bloque**.
El público del curso no es técnico y el material no debe depender de un lenguaje de
programación ni de un paquete: en su lugar se dice, en palabras, que el método viene
implementado en los programas estadísticos habituales. La única aparición de «Python» en
la sesión es la variable del formulario que pregunta si se ha usado, que es un dato de la
clase y se conserva como tal.

### D7 · El cierre aplica el protocolo, no lo repite

Orden: qué entra y qué no (con los tres motivos de la entrada) → inercia total por bloques →
inercia por eje contra el PCA → **cuadrado de relaciones** → **círculo** → **mapa con
baricentros** → filtro (contribuciones, cos²) → auditoría de las categorías de una persona y
su versión suplementaria → marcas como suplementarias → ticket de salida → lo que queda.

Toda cifra citada en la prosa es una interpolación. Las afirmaciones cualitativas —«el eje 1
lo forman…», «ninguna categoría de una persona lo fabricó», «dejar en blanco no va con
nada»— se escriben **después** de correr el script y mirar las cifras, y se redactan
condicionadas a ellas donde se pueda (por ejemplo, el nombre de una dimensión se construye
listando las variables cuyo r² o η² supera el umbral, no tecleando un nombre). Donde no se
pueda, la tarea de redacción exige releer la cifra y anotar junto al párrafo de qué
exportación depende.

La comparación con el PCA dice explícitamente que 41,94 % y el porcentaje del FAMD miden
sobre totales distintos (12 frente a p_num + Σ(J_q − 1)), y que lo comparable es qué
variables entraron, no el porcentaje.

### D8 · `Pendiente` se retira

El componente `Pendiente` de `content/index.jsx` y sus reglas en `panel.css` (y la línea del
glosario de `base.css`) se borran: no queda ningún bloque que los use, y el repositorio ya
borró antes texto muerto por la misma razón (los títulos del temario).

### D9 · Documentación

`README.md`: el script nuevo en la lista de stdlib pura, `sNN/data/` en la estructura,
`check_figuras.mjs` en la verificación, y «seis construidas» sin la salvedad de bloques
pendientes. `AGENTS.md` no cambia: el script nuevo cumple la regla que ya está escrita. El
`Purpose` de `openspec/specs/sesion-06-estructura/spec.md` dice «cinco bloques» y se corrige
en la misma tarea que el resto de la estructura.

## Risks / Trade-offs

- **El FAMD del salón sale tan flojo como el PCA (dos ejes con poca inercia).** → Es
  probable, con 28 variables poco relacionadas, y no es un problema del cambio: la spec
  exige que el juicio siga a las cifras. El mensaje del cierre no es «ahora resume mejor»
  sino «ahora entró todo, y esto es cuánta estructura hay, leído con el protocolo». La
  comparación con el PCA se redacta sobre qué entró, no sobre el porcentaje.
- **Una categoría de una persona sí fabrica un eje.** → Es el mejor de los casos para la
  clase: la Stevia en vivo. El segundo montaje ya está previsto; la prosa se escribe para
  los dos resultados y la tarea lo comprueba.
- **La prosa del cierre se desactualiza al regenerar.** → Las cifras se interpolan; las
  afirmaciones cualitativas se construyen desde listas filtradas por umbral siempre que se
  pueda, y las que no, llevan comentario con la exportación de la que dependen. Es el mismo
  compromiso que la entrada ya asume.
- **Jacobi sobre SᵀS pierde precisión respecto a una SVD.** → Matrices de 6 × 6 y 7 × 7
  con entradas de orden 1: la tolerancia 5e-4 contra la guía sobra. `check_pca.py` ya
  documenta el efecto de Jacobi en el cuarto decimal y cómo se tolera.
- **Publicar 27 × 26 puntuaciones por montaje engorda `salon_limpio.js`.** → ~1 400 números
  a tres decimales, unos 10 KB; el archivo es un chunk compartido que ya pesa mucho más por
  las matrices. El verificador los necesita.
- **Anticolisión de rótulos en el cuadrado de relaciones con 28 puntos.** → Regla simple de
  apilado; `check_figuras.mjs` atrapa lo que se salga del marco; a 390 px se mira a mano.
- **El cierre de 22 minutos es largo.** → El filtro reduce lo que se lee; las tres figuras
  se leen en el orden del protocolo y no se comentan una por una. Si sobra tiempo se recorta
  en clase, no en el material.
- **Signos fijados por categoría nombrada en el ejemplo.** → Si alguien cambia los datos del
  ejemplo y esa categoría desaparece, el script falla con un mensaje claro en vez de
  publicar un mapa espejado.

## Migration Plan

- Mergear a `master` despliega (Hostinger). No hay migración de datos: `salon.js` y
  `salon_limpio.xlsx` no cambian; `salon_limpio.js` se regenera y se versiona con el cambio,
  igual que `ejemplo.js`.
- Antes de mergear: `pnpm build`, los verificadores `scripts/check_salon.py` y
  `scripts/ejemplo_mca_famd.py` (este dos veces, `diff` vacío),
  `node scripts/check_figuras.mjs`, y la revisión a 390 px de los cuatro bloques.
- Vuelta atrás: revertir el commit. La sesión vuelve a cinco bloques con avisos de
  pendiente; ningún otro estado depende de este cambio.
