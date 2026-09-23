## Context

El curso es un React 18 + Vite 6 sin router ni gestor de estado, con rutas por hash y
exactamente cuatro dependencias de npm. Las sesiones 1 a 5 fijaron el patrón: `sNN/meta.js`
con los metadatos, cinco bloques cargados con un `import()` cada uno desde
`src/sessions/registry.js`, figuras que devuelven markup SVG desde `sNN/figures/*.js` con
los helpers de `src/svg/kit.js`, y los números pesados calculados fuera del navegador por
un script de `scripts/` que escribe un módulo de datos generado.

La sesión 6 mete tres cosas que ninguna anterior pidió:

1. **Un dataset compartido.** Hasta hoy cada sesión llevaba su copia —`s03/data/salon.js`
   con las filas crudas, `s04/data/salon.js` con estadísticos precomputados— y la
   duplicación estaba anotada como deliberada, para que los chunks de cada sesión fueran
   independientes. Ahora las sesiones 3, 4 y 6 leen del mismo sitio.
2. **Una dependencia de Python.** `feature-engine` para `RandomSampleImputer`. Los cuatro
   scripts que hay son de stdlib pura y eso está escrito en `AGENTS.md` como regla.
3. **Un dataset que cambia de tamaño.** El formulario tiene 27 respuestas; lo publicado
   son 23. Regenerar mueve cifras que ya se proyectaron en clase.

Ver `proposal.md` para el porqué y `specs/` para qué debe hacer el sistema.

Los datos con los que se diseña esto ya están medidos, y algunos números mandan sobre las
decisiones de abajo:

| columna | n | nulos | atípicos 1,5·RIC | atípicos 3·RIC |
|---|---|---|---|---|
| pantalla h/día | 19 | **8** | **7** (2, 3, 3, 8, 8, 9.6, 30) | 2 |
| minutos ayer | 23 | 4 | 1 (960) | 1 |
| viajes | 26 | 1 | 1 (15) | 0 |
| balanceada 1–5 | 27 | 0 | 2 (1, 1) | 0 |
| mascotas | 27 | 0 | 1 (7) | 0 |
| horas de estudio | 27 | 0 | 1 (21) | 1 |
| empleos · días AF · semanas AF · porciones · cafés | 27 | 0 | 0 | 0 |

Y en el texto, lo que gana cada tratamiento: departamento pasa de **12** categorías a 9 al
recortar, quitar tildes y bajar a minúsculas, y a **6** al quitar palabras vacías;
municipio, de **17** a 14 y a **11**. En las columnas de opción cerrada —área, sangre,
café, organización, música— los cuatro tratamientos no cambian nada.

## Goals / Non-Goals

**Goals:**

- Que ninguna cifra del salón que se lea en pantalla esté escrita a mano, en ninguna de
  las tres sesiones que usan la tabla. Regenerar el dataset tiene que arrastrarlas.
- Que la dependencia de Python entre en un solo script y no contamine los otros cuatro ni
  el despliegue.
- Que los resultados de la imputación sean reproducibles y verificables sin instalar
  `feature-engine`.
- Que compartir el dataset no meta la carga de la sesión 6 en el chunk de la 3 ni en el de
  la 4.
- Que el título y el objetivo de una sesión estén escritos en un único sitio.

**Non-Goals:**

- No se escribe el contenido de MCA, FAMD, segmentación ni el cierre. Este cambio los deja
  montados y rotulados; lo demás es de otros specs.
- No se toca `src/components/content/index.jsx`, del que dependen las cinco sesiones
  publicadas, salvo que una figura nueva no se pueda hacer sin ello.
- No se generaliza una capa de datos. `src/data/` es un directorio con dos módulos
  generados, no un modelo.
- No se corrige la tabla del salón «de verdad»: las decisiones de limpieza que la sesión 3
  dejó votadas siguen siendo las de la sesión 3.

## Decisions

### `src/data/` lleva dos módulos, no uno

`src/data/salon.js` son las respuestas crudas más los derivados que las sesiones 3 y 4 ya
mostraban. `src/data/salon_limpio.js` son los resultados de la cadena de la sesión 6:
estadísticos antes y después, los cortes de cada diagrama de caja, qué celdas se imputaron
y con qué valor, y el PCA de las cuantitativas.

La razón es de carga. Un solo módulo compartido haría que abrir el bloque 1 de la sesión 3
se bajara también el PCA y la tabla imputada de la sesión 6, que es la parte pesada. Con
dos, la sesión 3 y la 4 se bajan el primero y la 6 los dos.

**Alternativa descartada:** un único `salon.js` con todo dentro. Más simple de generar y
peor de servir; y el aislamiento entre sesiones es de las pocas cosas que este proyecto
tiene escritas como regla.

### Los derivados se generan, no se escriben

Hoy `s04/data/salon.js` tiene la media, la mediana, los cuartiles y la desviación
tecleados como constantes, y los bloques de la sesión 3 llevan «23», «siete de 23» y
«trece de veintitrés» escritos dentro del texto y dentro del markup de dos figuras. Eso es
lo que hace que cambiar el dataset sea peligroso.

El script pasa a emitir todos esos derivados —incluidos los recuentos que hoy son prosa— y
los bloques y las figuras los interpolan. Después de esto, regenerar el dataset arrastra
las cifras solo; lo que queda a mano es la redacción alrededor, que sí hay que releer.

**Alternativa descartada:** calcularlos en el navegador al montar el bloque. Son diez
líneas de JavaScript, pero pondría a depender de aritmética en vivo unas cifras que se
proyectan en la pared, y va contra el precedente que fijó la sesión 5.

### Dos scripts, y la dependencia solo en uno

- `scripts/extract_salon.py` — **stdlib, como está hoy.** Lee el `.xlsx` (un zip con XML
  dentro, que la stdlib abre), publica las columnas elegidas y calcula los derivados de
  las sesiones 3 y 4. Escribe `src/data/salon.js`.
- `scripts/clean_salon.py` — **el único que usa el entorno virtual.** Estandariza el
  texto, marca atípicos, imputa con `RandomSampleImputer`, corre el PCA y escribe
  `src/data/salon_limpio.js`.

Así la regla de `AGENTS.md` sobre scripts de stdlib pura sobrevive donde puede
sobrevivir, la extracción sigue funcionando en una máquina sin entorno virtual, y quien
solo quiera regenerar la tabla cruda no instala nada.

**Alternativa descartada:** un solo script con `feature-engine` que haga todo. Menos
archivos y una cadena más legible de arriba abajo, pero deja las sesiones 3 y 4 —que ya
están dadas— dependiendo de un entorno virtual que hoy no necesitan.

### El entorno virtual se declara, y no entra en el despliegue

`.venv/` ya está en `.gitignore` («Python virtualenvs (helper verification scripts)»). Se
añade `scripts/requirements.txt` con `feature-engine` fijado a una versión, y el README
dice cómo crear el entorno. Hostinger no lo ve: compila con `pnpm build`, que no toca
Python.

Esto **no** contradice la regla de no añadir dependencias de `AGENTS.md`: esa regla es
sobre las cuatro de npm, que el builder de Hostinger tiene que resolver y que ya tumbaron
el despliegue dos veces (`059b411`, `0166c5e`). Las de npm siguen siendo cuatro.

### La semilla se fija y queda escrita

`RandomSampleImputer` se construye con `random_state` fijo y `seed='general'`. Sin eso,
cada ejecución del script daría una tabla distinta y la clase del martes no vería lo mismo
que la del jueves. El número de la semilla queda en el script, no en pantalla: en pantalla
se dice que el azar está fijado y qué significa eso.

### `scripts/check_salon.py` verifica sin `feature-engine`

Es stdlib, como `check_pca.py`, y comprueba cuatro cosas: que los estadísticos publicados
salen de las filas publicadas; que cada valor imputado es un valor que de verdad aparece
en su columna —que es lo que define a este imputador, y se puede verificar sin repetir el
sorteo—; que los recuentos de imputados cuadran con los nulos más los atípicos marcados; y
que el PCA cumple sus propias identidades algebraicas, como ya hace `check_pca.py`.

**Alternativa descartada:** verificar reejecutando el script con la misma semilla. Repetiría
el mismo cálculo con el mismo código, así que no comprueba nada, y obligaría al verificador
a instalar la dependencia.

### Las letras de la sesión 3 no se mueven

Las diez columnas que la sesión 3 audita conservan sus letras A–J y su orden. Las columnas
nuevas se añaden detrás, de la K en adelante. Las actividades de la sesión 3 se responden
con una coordenada y hay coordenadas ya repartidas en clase: `F16` tiene que seguir siendo
la misma celda.

### Qué columnas se publican y cuáles no

Se mantiene el criterio que `extract_salon.py` ya tiene escrito: con una clase de este
tamaño, departamento + programa + año de nacimiento reidentifica a casi cualquiera, y el
sitio es público. **Siguen fuera** el peso, la estatura, el año de nacimiento, el grupo de
edad, la talla de camiseta, el nombre exacto del programa y la marca temporal.

**Entran** las categóricas de opción cerrada que el MCA y el FAMD van a necesitar —sector
económico, expectativa de uso de ciencia de datos, forma de tomar café, animal exótico,
herramienta de organización, género musical, nivel de uso de Python, R, JavaScript y
Julia— y las cuantitativas que faltaban: empleos, horas de estudio, días y semanas de
actividad física, cafés, mascotas y viajes.

### «Pantalla h/día» se queda fuera del análisis, y eso se cuenta

La columna tiene 8 nulos sobre 27 y la regla de 1,5·RIC le marca 7 atípicos de los 19
valores que quedan. Imputarla dejaría **más de la mitad de la columna inventada**, y el
plano factorial estaría dibujando en buena parte los sorteos del imputador. Así que no
entra: ni a la imputación ni al PCA de la entrada.

**Lo que no cambia:** la columna se sigue publicando en `src/data/salon.js` con sus huecos
intactos. Es la columna E de la sesión 3 y su lección entera sobre datos faltantes se apoya
en ella; sacarla del dataset dejaría a esa sesión sin material y rompería las coordenadas
de sus actividades.

Descartarla no es un hueco del temario, es el último eslabón de la cadena que la entrada
enseña: se estandariza, se describe, se dibujan las cajas, y a veces lo que sale de mirar
las cajas es que **una columna no se puede arreglar**. La entrada lo dice con los dos
números delante y sigue. Es, además, la misma columna que la sesión 3 hizo votar por
mezclar horas y minutos, así que la continuidad juega a favor: allí se discutió qué hacer
con ella y aquí se cobra la factura.

**Alternativa descartada:** imputarla igual y advertirlo. Mantiene la columna en el análisis
y da pie a hablar de incertidumbre, pero pone a la sesión a defender un plano factorial que
ella misma acaba de decir que no se sostiene.

**Alternativa descartada:** conservarla en el PCA usando solo sus 19 valores observados.
Obligaría a descartar ocho filas del análisis o a tratarlas aparte, que es un problema más
grande —y menos enseñable en esta sesión— que el que resuelve.

### El `.xlsx` no se versiona

El archivo de respuestas está hoy en `src/data/`, sin seguimiento de git. **Se deja así y
se añade a `.gitignore`**, junto a un `PROCEDENCIA.txt` como el de los CSV de Gapminder.

Es el mismo criterio que ya aplica el repositorio, llevado a su conclusión: publicar solo
diez de las 34 columnas no sirve de nada si las 34 quedan en el historial de git. El
archivo trae el peso, la estatura y el año de nacimiento de veintisiete personas
identificables por combinación, y el repositorio es público.

**Alternativa descartada:** versionarlo para que el dataset sea regenerable por cualquiera.
La regenerabilidad se resuelve como en la sesión 5: el archivo vive fuera del control de
versiones con su procedencia anotada al lado.

### Las figuras nuevas se dibujan con `src/svg/kit.js`

Los diagramas de caja, los histogramas del antes y el después y el plano factorial salen
de funciones en `s06/figures/*.js`, con los helpers que ya existen. Sin librería de
gráficos: es la misma decisión que tomó la sesión 5 para dibujar nubes en tres dimensiones.
Los `id` llevan prefijo `ar-s6-`, porque uno repetido haría que un `url(#…)` resolviera al
marcador de otra figura.

### Las 17 no numéricas no son una familia, son cuatro

Limpiar «las categóricas» como si fueran un bloque es lo que produce un MCA ilegible. Con
27 personas, el diagnóstico las reparte en cuatro formas, y cada una admite otra cosa:

| forma | cuáles | qué se le hace |
|---|---|---|
| **Sanas** — pocos niveles, repartidos | `depto` `sangre` `formaCafe` `organiza` `python` `erre` `js` `balanceada` | nada más que estandarizar |
| **Cola larga** — muchos niveles de una sola persona | `municipio` (11 niveles, 3 con ≥2) · `sector` (13/5) · `area` (8/4) · `musica` (7/5) | agrupar los raros, como ya se hace con `balanceada` |
| **Dominadas** — una respuesta se lleva casi todo | `espera` (24/27) · `exotico` (22/27) · `julia` (24/27) | se señalan y se conservan: no distinguen a nadie, y eso es el hallazgo |
| **Casi todo único** | `codigo` (26 niveles/27) · `libro` (20) | se marcan como no analizables, con su motivo |

Las dos últimas filas son las interesantes de enseñar. Una variable donde 24 de 27 personas
contestan lo mismo **no sirve para separar a nadie**, y eso no se ve en la tabla: se ve al
contar. Y `codigo` y `libro` no son categorías en absoluto —uno es un identificador y el
otro texto libre—, así que un nivel suyo describe exactamente a una persona. Descartarlas
es el mismo movimiento que con `pantalla`, por un motivo distinto, y tener **tres motivos
distintos de descarte** en la misma sesión es mejor lección que tener uno.

**Alternativa descartada:** pasarles el mismo agrupamiento a las dieciséis por igual. Es una
línea de código menos y deja `libro` colapsado casi entero en «raro», que es un resultado
correcto y una figura que no enseña nada: el problema de `libro` no es que tenga niveles
delgados, es que no es una variable categórica.

**Alternativa descartada:** estandarizar y nada más, dejando el agrupamiento para el bloque
del MCA. Mantiene la entrada corta, pero parte en dos la cadena que la entrada existe para
enseñar entera, y deja el bloque 1 empezando por tareas domésticas en vez de por su tema.

### El diagnóstico se calcula, no se mira a ojo

Por variable: número de niveles antes y después de limpiar, cuánta gente hay en el más
grande, cuántos niveles tienen una sola persona, cuántas respuestas faltan, y la forma que
le corresponde. El script lo emite y el bloque lo dibuja; ninguna de esas cifras se teclea,
por lo mismo que ninguna de las otras.

La forma se deriva con umbrales explícitos y escritos en el script, no con criterio: es una
clasificación que la clase tiene que poder recalcular, y un umbral sin escribir es una
opinión disfrazada de resultado.

### El temario declara lo que falta, no lo que ya hay

`src/data/syllabus.js` exporta hoy `SYLLABUS`, ocho tripletas `[n, título, objetivo]`, y
`Cover.jsx` hace `const t = m ? m.title : title`: en cuanto una sesión tiene su `meta.js`,
su título y su objetivo del temario dejan de leerse. Las cinco sesiones construidas
arrastran diez cadenas muertas, y la sesión 6 iba a sumar dos más.

El módulo pasa a exportar cuántas sesiones tiene el curso y solo las que aún no existen,
con lo que hay que anunciar de ellas. `Cover.jsx` recorre la numeración completa, toma los
metadatos de la sesión cuando los hay y lo anunciado cuando no. Construir una sesión pasa a
ser escribir su `meta.js` y **quitarla** de esa lista; corregir un título es tocar un solo
archivo, y que el temario contradiga a la sesión deja de ser posible.

`pad2` no se mueve: lo usan también `Session.jsx` y `Rail.jsx`.

**Alternativa descartada:** dejar el temario como está y limitarse a corregir la entrada 6.
Arregla el síntoma de hoy y deja el mecanismo que lo produjo, que es exactamente el que
obligó a este cambio a corregir dos promesas de la sesión 4.

### Los bloques pendientes se montan de verdad

Los cuatro bloques sin contenido son componentes reales con su `import()` en el registro,
no entradas ausentes. Cada uno monta un `<Panel>` con su rótulo y un aviso de pendiente.
Así la sesión se recorre entera, el esquema de carga no tiene un agujero, y llenarlos
después es cambiar el cuerpo de un componente que ya existe.

### El reparto de los 180 minutos

La entrada carga toda la cadena —estandarizar, describir, cajas, imputar, describir otra
vez, PCA— así que se lleva 45 minutos, más que ninguna otra entrada del curso. El resto
sigue el patrón de las sesiones anteriores, con los huecos entre bloques que son los
descansos:

| bloque | tema | franja | dura |
|---|---|---|---|
| Entrada | De la tabla sucia al primer plano | 0–60 | 60 |
| Bloque 1 | MCA | 68–98 | 30 |
| Bloque 2 | FAMD | 106–134 | 28 |
| Bloque 3 | Segmentación | 142–168 | 26 |
| Cierre | Cierre | 168–180 | 12 |

Los huecos —60–68, 98–106, 134–142— son los descansos. Suma: 60 + 8 + 30 + 8 + 28 + 8 +
26 + 12 = 180.

La entrada pasó de 45 a 60 al hacerse cargo de las 27 variables y no de diez. Es un tercio
de la sesión, más del doble que cualquier otra entrada del curso, y se sostiene porque lo
que hace no es introducir la sesión: es dejar la tabla en condiciones de ser analizada, que
es trabajo, no preámbulo.

Título propuesto: **«Todas las variables a la vez»**. Gancho: la tabla del salón lleva
tres sesiones con nosotros y todavía no la hemos analizado entera, porque casi todo lo que
dice no son números.

## Risks / Trade-offs

- **Las sesiones 3 y 4 ya se dieron con 23 filas y van a decir otra cosa.** → **Riesgo
  aceptado**, con la decisión tomada de seguir adelante. Es el riesgo principal y no se
  elimina, se acota: las tareas de esa migración van primero y separadas de la sesión 6,
  cada cifra pasa a salir del dataset, y `check_salon.py` más una lectura a mano de los
  cinco bloques de la 3 y los cinco de la 4 cierran la revisión. Queda anotado junto a cada
  texto reescrito que ya no es el que se proyectó.

- **La regla de 1,5·RIC marca 7 de los 19 valores observados de «pantalla h/día», más del
  tercio.** → Resuelto en *Decisions*: esa columna no entra al análisis. Lo que sí se
  conserva es la demostración de que el umbral es una decisión y no un hecho — la entrada
  muestra los dos cortes, 1,5 y 3, y cuántos puntos deja fuera cada uno.

- **Descartar una columna entera puede leerse como que la limpieza fracasó.** → Es el
  riesgo que deja la decisión anterior, y se cubre con la redacción: la entrada presenta
  descartarla como un resultado del método, no como un tropiezo, y lo dice con los dos
  números delante.

- **27 filas son pocas para MCA, FAMD y segmentación.** → No afecta a este cambio, que solo
  escribe la entrada, pero los specs siguientes se van a topar con ello. Queda anotado aquí
  para que no se descubra a mitad del bloque 1.

- **Compartir el dataset emite un chunk compartido donde antes había copias.** → Es la
  consecuencia buscada. Se comprueba en la salida de `pnpm build` que `salon.js` sale como
  chunk propio y que `salon_limpio.js` no entra en los chunks de las sesiones 3 y 4.

- **`feature-engine` arrastra pandas, numpy y scikit-learn al entorno virtual.** → No toca
  el despliegue ni las cuatro dependencias de npm. El coste real es que instalar el entorno
  tarda; por eso `extract_salon.py` y `check_salon.py` no lo necesitan.

## Migration Plan

1. Regenerar `src/data/salon.js` con las 27 respuestas y las columnas nuevas, con los
   derivados de las sesiones 3 y 4 dentro.
2. Apuntar las sesiones 3 y 4 al archivo compartido, borrar sus copias, y sustituir por
   interpolaciones todas las cifras escritas a mano, en los bloques y en las figuras.
3. Releer los cinco bloques de la 3 y los cinco de la 4 buscando afirmaciones que los datos
   nuevos desmientan, y reescribir las que haga falta dejando constancia.
4. Corregir las promesas sobre la sesión 6 en la sesión 4, y vaciar el temario de títulos y
   objetivos de sesiones ya construidas.
5. Montar la sesión 6: metadatos, registro, y los cuatro bloques pendientes.
6. Escribir la entrada de la sesión 6 sobre `src/data/salon_limpio.js`.

Los pasos 1 a 4 dejan el sitio coherente por sí solos: si el trabajo se interrumpe ahí, lo
publicado sigue siendo cierto. La vuelta atrás de los pasos 1 a 3 es revertir el commit;
no hay estado que migrar, porque no hay base de datos ni nada persistido.
