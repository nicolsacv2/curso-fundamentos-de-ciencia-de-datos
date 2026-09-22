# Fundamentos de Ciencia de Datos

Material del curso de la Universidad Nacional de Colombia, como aplicación React.
Nueve sesiones de tres horas; siete construidas hasta ahora.

El diseño, el contenido y las imágenes son los del curso original. Lo que cambia es
cómo se entrega: la página ya no carga de una vez, sino por pasos, y las láminas ya no
viven en el repositorio.

## Cómo se renderiza por pasos

Tres mecanismos, en `src/sessions/registry.js` y `src/components/Session.jsx`:

- un `import()` por bloque, así que Vite emite un chunk independiente para cada uno;
- solo el bloque activo se monta en el DOM, en vez de ocultar los otros con `hidden`;
- las imágenes se piden a su fuente, con `loading="lazy"`, `srcset` y proporción
  declarada, así que un teléfono no se baja la versión de escritorio.

## De dónde salen las imágenes

Las diez láminas de las sesiones 1 y 2 no están en el repositorio. Todas venían de
Wikimedia Commons, así que se piden ahí, a su fuente:

```
https://commons.wikimedia.org/wiki/Special:FilePath/<archivo>?width=<n>
```

[`Special:FilePath`][filepath] es el endpoint estable: sigue los renombramientos y
redimensiona en el servidor, que es de donde sale el `srcset` sin procesar ni una imagen
aquí.

Commons, sin embargo, [**desaconseja**][hotlink] el enlace directo: cualquiera puede
renombrar, vandalizar o borrar un archivo, y eso en una clase proyectada no es
aceptable. Por eso cada `<Plate>` pide primero a Commons y, si esa carga falla, un
`onError` la vuelve a pedir a un bucket de Google Cloud Storage que guarda las mismas
copias.

[filepath]: https://commons.wikimedia.org/wiki/Special:FilePath
[hotlink]: https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia/technical

`src/assets/manifest.json` es la única fuente de verdad: nombre exacto en Commons,
dimensiones del original, autor y licencia. `src/assets/sources.js` deriva de ahí las
URL de los dos orígenes, y también la de la página de archivo a la que enlaza el crédito
bajo cada lámina — que es lo que piden las licencias CC de las que están cubiertas.

Un detalle que cuesta descubrir: **`?width=` no devuelve el ancho que se le pide.**
Commons lo redondea hacia arriba a uno de sus tamaños fijos —250, 330, 500, 960, 1280,
1920—, así que pedir 620, 840 y 920 devuelve tres veces el mismo archivo de 960 px. La
escalera de `sources.js` usa esos anchos reales; si no, el `srcset` anunciaría tamaños
que no existen. `scripts/mirror_assets.py` mide el ancho real de cada archivo que baja
y falla si no coincide con el que pidió.

### Rellenar el bucket

Las copias van a `gs://nicolasacevedocruz/cursos/fundamentos-de-ciencia-de-datos/assets`:

```sh
python3 scripts/mirror_assets.py     # baja de Commons a .assets-cache/
sh scripts/upload_assets.sh          # sube al bucket
```

Los objetos tienen que ser legibles por cualquiera, o el `<img>` no los carga. Si
`curl -sI` sobre uno no devuelve 200, falta darle lectura pública al bucket una vez:

```sh
gcloud storage buckets add-iam-policy-binding gs://nicolasacevedocruz \
  --member=allUsers --role=roles/storage.objectViewer
```

No hace falta configurar CORS: son `<img>` sin atributo `crossorigin`.

La URL base es una constante en `src/assets/sources.js` y se puede sobreescribir con
`VITE_ASSET_BUCKET` en tiempo de build. Los objetos suben con caché de un año e
`immutable`, lo que se sostiene porque el nombre es `<clave>-<ancho>.<ext>` y sus bytes
salen de un archivo fijo de Commons: una lámina distinta tendría otra clave, y por tanto
otro nombre. Lo único que esa caché no sobrevive es sobreescribir un nombre existente.

## Figuras en pantallas pequeñas

Las figuras se dibujan sobre lienzos de 980 px con etiquetas de 11 o 12 px. Encogidas a
un teléfono de 390 px, ese texto queda por debajo de 5 px: la figura entra, pero deja de
leerse. Antes se resolvía con `min-width:520px` y scroll horizontal, que daba las dos
cosas malas a la vez —había que arrastrar, y aun así no se leía—.

Ahora el SVG se ajusta al ancho y cada figura lleva un botón **Ampliar** que la abre a
tamaño natural en un `<dialog>`, con arrastre y pinza. La vista de conjunto se ve
entera; el detalle se lee ampliando.

Las tablas de la sesión 3 sí conservan su scroll: sus cabeceras y su columna de número
van pegadas porque cada actividad se responde con una coordenada, y una coordenada no
sirve si perdiste de vista su letra. También pueden ampliarse.

## Las actividades en vivo de la sesión 4

La sesión 4 trae dos actividades que toda la clase juega a la vez — los dados de Méré y
el triángulo — respaldadas por [verquo](https://github.com/nicolsacv2/verquo), que las
sirve como **dos servicios independientes**: cada actividad es su propio despliegue, con
su propia base de datos y su propia URL. El frontend no habla con ninguna otra cosa.

De ahí que sean dos variables, horneadas en el build, más una tercera que solo nombra el
entorno para el aviso en pantalla:

```sh
VITE_DEMERE_API=https://…  VITE_TRIANGLE_API=https://…  VITE_ENV=prod  pnpm build
```

Las URL salen de `make urls ENV=<entorno>` en verquo, y en producción viven versionadas
en `.env.production` — ver [`.env.example`](.env.example) y [DEPLOY.md](DEPLOY.md).

Toda respuesta trae el SVG ya dibujado en su campo `render`, que el componente inserta
tal cual, y cada pantalla pregunta un par de veces por segundo si hay algo nuevo: eso es
lo que hace que el marcador sea de toda la clase y no de cada portátil.

Sin las variables — o en el momento en que una petición falle — el cliente
(`src/sessions/s04/activities/api.js`) degrada a un **mock local** con la misma
interfaz: dados con `Math.random`, geometría calculada en el navegador y el mismo SVG,
armado con los helpers de dibujo de la propia sesión. Es el estándar de las láminas
(Commons → bucket) aplicado a las APIs: la clase proyectada nunca se cae, solo pierde el
marcador compartido y lo dice en un aviso.

Los endpoints, el esquema de datos y los mockups de pantalla están en
[`docs/apis/`](docs/apis/README.md). Es la especificación con la que se arrancó verquo,
así que se lee como el contrato, no como el inventario: el despliegue acabó partido en
dos servicios en vez de uno, y los endpoints de clase quedaron en `/v1/sessions/*` y no
en `/v1/class-sessions`. Ante la duda, manda `api.js`.

## Desarrollo

Requiere Node 20+ y pnpm (vía corepack). Todo vive dentro del proyecto: no hace falta
instalar nada de forma global.

```sh
corepack enable   # pnpm
pnpm install
pnpm dev        # servidor de desarrollo
pnpm build      # compila a dist/
pnpm preview    # sirve dist/ en local
```

### El entorno de Python

Los scripts de `scripts/` generan los datos que las sesiones muestran. Seis de ellos
son de **stdlib pura** y no necesitan nada instalado: `extract_salon.py`,
`extract_gapminder.py`, `ejemplo_mca_famd.py`, `ejemplo_lluvia.py`, `check_pca.py` y
`check_salon.py`. Eso es deliberado — regenerar la tabla o auditar las cifras que se
proyectan no puede depender de instalar nada—.

`ejemplo_mca_famd.py` escribe `src/sessions/s07/data/ejemplo.js`: el ejemplo de ocho
personas sobre el que los bloques 2 y 3 de la sesión 7 enseñan el MCA y el FAMD, en sus
cuatro montajes. Diagonaliza con el mismo Jacobi de `extract_gapminder.py`, comprueba
sus identidades —la fórmula de transición, Σλ, Burt, Σr² + Ση² = λ— antes de escribir,
y compara contra las cifras de `mca_famd_guia.md`, que son su oráculo y no su fuente.

`ejemplo_lluvia.py` escribe `src/sessions/s07/data/lluvia.js`: el ejemplo con el que abre la
sesión 7 y sobre el que el bloque 1 enseña el análisis de correspondencias simples. Es una
tabla de contingencia **inventada y declarada como tal** —el cielo de hoy contra el cielo de
mañana, tres estados, un año de días—, escrita como constante en el script: no lee ningún
dato ni ningún archivo. Publica los perfiles, las esperadas, el chi-cuadrado celda por celda
y el análisis de correspondencias, y antes de escribir comprueba sus identidades y la propia
historia del ejemplo —que llover hoy hace más probable llover mañana—. Trae también, como
constantes con la inversión comprobada, la tabla de la paradoja de Simpson que la sesión 4
dejó plantada. Los datos del salón entran a la sesión 7 solo en el cierre.

La excepción es `clean_salon.py`, la cadena de limpieza de la sesión 6, que imputa con
`RandomSampleImputer` de [feature-engine][fe] y, como paso 10, calcula el FAMD de la
tabla limpia con el `numpy` que esa librería trae. Solo para ese:

```sh
python3 -m venv .venv
.venv/bin/pip install -r scripts/requirements.txt
.venv/bin/python scripts/clean_salon.py
```

[fe]: https://feature-engine.trainindata.com/

`.venv/` no se versiona y **no participa del despliegue**: Hostinger compila con
`pnpm build`, que no toca Python. Las dependencias de npm siguen siendo cuatro.

## Despliegue

Lo publica **Hostinger**, que compila el proyecto en su lado en cada push a `master`: no
hay GitHub Actions ni rama de build que mantener. Mergear a `master` es desplegar a
producción, sin paso intermedio.

El alta en hPanel, por qué la configuración de pnpm está declarada por triplicado, qué
entornos existen de verdad y cómo volver atrás: **[DEPLOY.md](DEPLOY.md)**.

## Estructura

```
src/
  App.jsx                  ruta activa → índice o sesión
  router/useHashRoute.js   rutas por hash, iguales a las del curso original
  data/
    syllabus.js            cuántas sesiones hay y qué anunciar de las que aún no existen
    salon.js               la tabla del salón, generada — la leen las sesiones 3, 4 y 6
    salon_limpio.js        la cadena de limpieza de la sesión 6 y el FAMD de la 7, generados
  styles/                  base · cover · rail · panel · mobile
  svg/kit.js               helpers de dibujo compartidos por las figuras
  assets/
    manifest.json          las diez láminas: archivo en Commons, tamaño, licencia
    sources.js             URL de cada lámina en Commons y en el bucket
  components/
    Cover.jsx  Session.jsx  Rail.jsx
    content/               vocabulario visual: Task, Idea, Diagram, Plate, Cards…
  sessions/
    registry.js            metadatos + un import() por bloque
    sNN/
      meta.js              título, objetivo y bloques de la sesión
      blocks/*.jsx         un componente por bloque
      figures/*.js         funciones que devuelven el markup SVG de sus figuras
      data/*.js            datos generados que solo esa sesión lee (s05: países; s07: el ejemplo y las tablas)
```

El código y los nombres de archivo están en inglés; el contenido del curso, en español.

Las rutas públicas conservan los slugs originales: `#indice`, `#s1/entrada`,
`#s2/bloque-1`, `#s2/cierre`. Los enlaces ya repartidos siguen funcionando.

## La tabla del salón

Las sesiones 3, 4 y 6 trabajan sobre las mismas respuestas del formulario de la sesión 2.
Durante un tiempo cada una llevaba su copia, y las copias se separaron en cuanto el
formulario recibió cuatro respuestas más: la 3 seguía diciendo «trece de veintitrés»
sobre unos datos que ya eran veintisiete. Ahora hay **un solo archivo**, en `src/data/`,
fuera de las sesiones, y **ninguna cifra derivada se escribe a mano**: los recuentos, las
medias y los cuartiles los emite el script y los bloques los interpolan, así que
regenerar el archivo arrastra lo que se ve en pantalla.

El `.xlsx` de origen **no se versiona**. Trae las 34 columnas del formulario —peso,
estatura, año de nacimiento— de veintisiete personas que se reidentifican por
combinación, y este repositorio es público. Vive en `src/data/`, ignorado por git, con su
`PROCEDENCIA.txt` al lado; se publican 27 de esas columnas y cada exclusión lleva su
motivo escrito en `scripts/extract_salon.py`.

Una columna se nombra siempre **por su variable** —`minutos`, `pantalla`—, nunca por la
letra que tenía en la hoja de cálculo: una letra dice en qué archivo estaba el valor, que
es lo único suyo que no enseña nada.

```sh
python3 scripts/extract_salon.py          # .xlsx  → src/data/salon.js
.venv/bin/python scripts/clean_salon.py   # ídem   → src/data/salon_limpio.js
python3 scripts/export_xlsx.py            # los dos → src/data/salon_limpio.xlsx
python3 scripts/check_salon.py            # audita, sin feature-engine
```

`salon_limpio.js` lleva también el **FAMD de la tabla limpia** — el cierre de la sesión 7
—, en dos montajes: todo activo, y las categorías de una sola persona proyectadas como
suplementarias. Las marcas de celda inventada se proyectan como suplementarias también.
No es una decisión sobre los datos, así que no entra en la bitácora.

### La bitácora

`src/data/salon_limpio.xlsx` es la copia que se abre en una hoja de cálculo, y trae tres
hojas: **`crudo`** con las respuestas como llegaron, **`limpio`** con la tabla después de
la cadena de la sesión 6, y **`bitacora`** con una fila por cada decisión que lleva de la
primera a la segunda — qué se hizo, a qué variable, a qué filas, qué había antes, qué
quedó después, a cuántos valores afectó, por qué, y si se puede deshacer.

Esa tercera hoja es el motivo del archivo. La regla de oro de la sesión 3 es que limpiar
no es corregir una tabla, sino **escribir otra al lado y dejar constancia de cómo se pasó
de una a otra**; una constancia que solo viva dentro de un script de Python no es una
constancia que la clase pueda leer. También se registran las decisiones de **no** hacer
algo —no aplicarle la regla de la caja a una escala ordinal, no quitarle las palabras
vacías a una opción cerrada—, porque son decisiones igual.

Este `.xlsx` sí se versiona: lleva las mismas 27 columnas que `salon.js`, así que es
exactamente igual de publicable. El del formulario, con las 34, no.

## Verificación

`pnpm build` es la única comprobación automática del frontend. Para los datos hay dos
verificadores, los dos de stdlib pura y los dos pensados para ir delante de un commit:

```sh
python3 scripts/check_pca.py      # el PCA de la sesión 5 contra el CSV y contra su álgebra
python3 scripts/check_salon.py    # la tabla del salón, la imputación, el PCA de la 6 y el FAMD de la 7
```

`check_salon.py` no importa `feature-engine` a propósito: un verificador que necesita la
misma librería que lo que verifica no comprueba gran cosa. En vez de repetir el sorteo
del imputador, comprueba lo que lo define — que todo valor imputado sea un valor que ya
estaba en esa columna — y que los recuentos y el álgebra del PCA cuadren. Del FAMD
comprueba sus identidades a partir de la tabla limpia y las puntuaciones publicadas: que
los valores propios sumen la inercia, que Σr² + Ση² sea el valor propio en cada eje, que
cada baricentro sea la media de sus personas y que las contribuciones sumen cien.

Para las figuras de las sesiones 6 y 7 hay un tercer chequeo, y para los datos generados
de la sesión 7, los propios scripts:

```sh
node scripts/check_figuras.mjs        # ninguna figura de las sesiones 6 y 7 recorta su contenido
python3 scripts/ejemplo_mca_famd.py   # regenera el ejemplo; dos corridas dan el mismo archivo
python3 scripts/ejemplo_lluvia.py     # regenera el ejemplo de la lluvia de la 7; ídem
```

Para las imágenes y las figuras, lo que hay que mirar en el navegador:

- las diez láminas se piden a `commons.wikimedia.org`;
- bloqueando ese dominio en DevTools → Network → *Block request domain* y recargando,
  las diez se vuelven a pedir a `storage.googleapis.com` y se ven igual;
- a 390 px de ancho ninguna figura provoca scroll horizontal ni desplaza la página, y
  **Ampliar** abre el diálogo, se cierra con Esc y devuelve el foco al botón.
