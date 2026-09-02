# Fundamentos de Ciencia de Datos

Material del curso de la Universidad Nacional de Colombia, como aplicación React.
Ocho sesiones de tres horas; tres construidas hasta ahora.

El diseño, el contenido y las imágenes son los del curso original. Lo que cambia es
cómo se entrega: la página ya no carga de una vez, sino por pasos, y las láminas ya no
viven en el repositorio.

## Cómo se renderiza por pasos

El material original era un solo HTML de 1,93 MB con los diez paneles en el DOM y las
diez imágenes incrustadas como `data:` URI. Aquí cada pieza llega cuando hace falta:

| Acción | Qué se descarga | Paneles montados |
|---|---|---|
| Abrir el índice | solo el bundle base — ninguna sesión, ninguna imagen | 0 |
| Entrar a una sesión | solo el bloque de entrada de esa sesión | 1 |
| Cambiar de pestaña | solo el chunk de ese bloque (5–17 kB) | 1 |

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
el triángulo — respaldadas por dos servicios externos que viven en su propio
repositorio: una **API de Actividades** (estado en Supabase, activación por key del
instructor) y una **API de Render** (estado → SVG). La arquitectura completa, los
endpoints y los mockups están en [`docs/apis/`](docs/apis/README.md).

El frontend solo conoce una variable:

```sh
VITE_ACTIVITIES_API=https://…  pnpm build   # ver .env.example
```

Sin la variable — o en el momento en que una petición falle — el cliente
(`src/sessions/s04/activities/api.js`) degrada a un **mock local** con la misma
interfaz: dados con `Math.random`, geometría calculada en el navegador y el mismo SVG.
Es el estándar de las láminas (Commons → bucket) aplicado a las APIs: la clase
proyectada nunca se cae, solo pierde el marcador compartido y lo dice en un aviso.

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
  data/syllabus.js         las ocho sesiones del temario
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
```

El código y los nombres de archivo están en inglés; el contenido del curso, en español.

Las rutas públicas conservan los slugs originales: `#indice`, `#s1/entrada`,
`#s2/bloque-1`, `#s2/cierre`. Los enlaces ya repartidos siguen funcionando.

## Verificación

`scripts/check_content.py` compara palabra por palabra el texto visible del curso
original (`panels.html` + `figuras.js`) con el de los componentes React, para
comprobar que la traducción a JSX no perdió ni cambió nada. Necesita tener al lado
el proyecto original:

```sh
python3 -m venv .venv
.venv/bin/python scripts/check_content.py
```

Para las imágenes y las figuras, lo que hay que mirar en el navegador:

- las diez láminas se piden a `commons.wikimedia.org`;
- bloqueando ese dominio en DevTools → Network → *Block request domain* y recargando,
  las diez se vuelven a pedir a `storage.googleapis.com` y se ven igual;
- a 390 px de ancho ninguna figura provoca scroll horizontal ni desplaza la página, y
  **Ampliar** abre el diálogo, se cierra con Esc y devuelve el foco al botón.
