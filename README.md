# Fundamentos de Ciencia de Datos

Material del curso de la Universidad Nacional de Colombia, como aplicación React.
Ocho sesiones de tres horas; dos construidas hasta ahora.

El diseño, el contenido y las imágenes son los del curso original. Lo que cambia es
cómo se entrega: la página ya no carga de una vez, sino por pasos.

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
- las imágenes son archivos con `loading="lazy"` y dimensiones declaradas.

## Desarrollo

Requiere Node 20+ y pnpm (vía corepack). Todo vive dentro del proyecto: no hace falta
instalar nada de forma global.

```sh
corepack enable
pnpm install
pnpm dev        # servidor de desarrollo
pnpm build      # compila a dist/
pnpm preview    # sirve dist/ en local
```

## Despliegue en Hostinger

Hostinger compila el proyecto en su lado en cada push a `master`; no hay GitHub Actions
ni rama de build que mantener.

1. En hPanel: **Deploy Your Web App → Import Git repository → Connect with GitHub**.
2. Autorizar, elegir este repositorio y la rama `master`.
3. En la pantalla de *build settings*:
   - **Output directory**: `dist` (es el que viene prellenado)
   - **Build command**: cambiarlo por
     ```
     corepack enable && pnpm install --frozen-lockfile && pnpm build
     ```
     El comando prellenado es `npm run build`, que fallaría porque el proyecto usa pnpm.
4. **Deploy**. Desde ahí cada push a `master` despliega solo.

Las rutas van por hash (`#s1/bloque-1`), así que no hace falta ninguna regla de rewrite
en el servidor. `public/.htaccess` solo añade compresión y caché.

Si el builder de Hostinger no permitiera editar el comando o no expusiera corepack,
la salida es migrar a npm: `rm pnpm-lock.yaml && npm install`, quitar `packageManager`
de `package.json` y dejar el comando prellenado.

## Estructura

```
src/
  App.jsx                  ruta activa → índice o sesión
  router/useHashRoute.js   rutas por hash, iguales a las del curso original
  data/syllabus.js         las ocho sesiones del temario
  styles/                  base · cover · rail · panel · mobile
  svg/kit.js               helpers de dibujo compartidos por las figuras
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

Debe terminar con las dos sesiones en «no falta ni sobra ninguna palabra».
