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
corepack enable   # pnpm
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
3. En **Change build and output settings**:

   | Campo | Valor |
   |---|---|
   | Build command | `pnpm run build` |
   | Package manager | `pnpm` |
   | **Output directory** | **`dist`** |

   El único que hay que tocar es el último: Hostinger lo trae en `build`, y Vite
   compila a `dist`. Si se queda en `build`, el despliegue no encuentra nada.

4. **Finish** y **Deploy**. Desde ahí cada push a `master` despliega solo.

### Por qué el proyecto está configurado así

Hostinger instala las dependencias con el gestor que se elija en esa pantalla. De ahí
dos decisiones que si no, parecen arbitrarias:

- **`package.json` no fija versión de pnpm.** Un `packageManager` clavado pelearía con
  la selección del panel: si Hostinger corre pnpm 11 y aquí dijera `pnpm@9`, intentaría
  descargarse el 9 en mitad del build.
- **El permiso de build de esbuild está declarado por triplicado.** esbuild necesita su
  postinstall para enlazar el binario de la plataforma; pnpm 10+ bloquea los scripts de
  instalación por defecto y pnpm 11 además falla la instalación entera si queda alguno
  sin declarar. La opción cambió de sitio y de nombre entre versiones, así que está en
  `pnpm-workspace.yaml` (`allowBuilds` para pnpm 11, `onlyBuiltDependencies` para
  pnpm 10) y en `package.json` (`pnpm.onlyBuiltDependencies`, para pnpm 9). Cada versión
  ignora en silencio los sitios que no le corresponden.

Si aun así el build fallara por algo de pnpm, la salida limpia es cambiar a npm: borrar
`pnpm-lock.yaml` y `pnpm-workspace.yaml`, correr `npm install`, quitar el bloque `pnpm`
de `package.json`, y elegir **npm** en el desplegable. npm no bloquea los scripts de
instalación, así que ninguno de estos ajustes hace falta.

Las rutas van por hash (`#s1/bloque-1`), así que no hace falta ninguna regla de rewrite
en el servidor. `public/.htaccess` solo añade compresión y caché.

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
