# Desplegar el curso

El sitio lo publica **Hostinger**, que compila el proyecto en su lado en cada push a
`master`. No hay GitHub Actions, ni rama de build, ni nada que subir a mano.

```
push a master ──▶ Hostinger clona ──▶ pnpm install ──▶ pnpm run build ──▶ sirve dist/
                                                                              │
                                                              https://nicolasacevedocruz.com
```

Dicho de otro modo: **mergear a `master` es desplegar a producción.** No hay paso
intermedio, ni confirmación, ni entorno de ensayo delante. Lo que entra en `master` está
en el aire en cuanto Hostinger termina de compilar.

---

## 1 · Alta en hPanel (una sola vez, ya hecha)

1. **Deploy Your Web App → Import Git repository → Connect with GitHub**.
2. Autorizar, elegir este repositorio y la rama `master`.
3. En **Change build and output settings**:

   | Campo | Valor |
   |---|---|
   | Build command | `pnpm run build` |
   | Package manager | `pnpm` |
   | **Output directory** | **`dist`** |

   El único que hay que tocar es el último: Hostinger lo trae en `build`, y Vite compila
   a `dist`. Si se queda en `build`, el despliegue no encuentra nada.

4. **Finish** y **Deploy**.

## 2 · Por qué el proyecto está configurado así

Hostinger instala las dependencias con el gestor que se elija en esa pantalla, con la
versión que a su builder le toque. De ahí tres decisiones que sin este contexto parecen
arbitrarias — y dos de ellas están escritas con la sangre de un despliegue roto
(`059b411`, `0166c5e`).

**`package.json` no fija versión de pnpm.** Un `packageManager` clavado pelearía con la
selección del panel: si Hostinger corre pnpm 11 y aquí dijera `pnpm@9`, corepack
intentaría descargarse el 9 en mitad del build y fallaría.

**`.npmrc` tiene `manage-package-manager-versions=false`.** pnpm escribe ese
`packageManager` en `package.json` él solito al correr, clavando la versión que le tocó.
Ya rompió el build del host una vez. Apagado, el campo no vuelve.

**El permiso de build de esbuild está declarado por triplicado.** esbuild necesita su
postinstall para enlazar el binario de su plataforma; pnpm 10+ bloquea los scripts de
instalación por defecto y pnpm 11 además falla la instalación entera si queda alguno sin
declarar. La opción cambió de sitio y de nombre entre versiones y cada una ignora en
silencio las que no le tocan, así que está en los tres:

| pnpm | Dónde |
|---|---|
| 11 | `pnpm-workspace.yaml` → `allowBuilds` |
| 10 | `pnpm-workspace.yaml` → `onlyBuiltDependencies` |
| 9 | `package.json` → `pnpm.onlyBuiltDependencies` |

Si aun así el build fallara por algo de pnpm, la salida limpia es cambiar a npm: borrar
`pnpm-lock.yaml` y `pnpm-workspace.yaml`, correr `npm install`, quitar el bloque `pnpm`
de `package.json`, y elegir **npm** en el desplegable. npm no bloquea los scripts de
instalación, así que ninguno de estos ajustes hace falta.

## 3 · La configuración que viaja en el repositorio

**`.env.production` está versionado a propósito**, y no es un descuido. Lo lee Vite en
`vite build`, así que sus valores acaban dentro del bundle — que es público — y las APIs
de las actividades son de acceso abierto por diseño: nada que un alumno pueda hacer con
ellas requiere credencial. Ponerlo aquí en vez de en el panel del host hace el build
reproducible: quien clone el repositorio obtiene exactamente el mismo sitio, y el panel
de Hostinger no es una fuente de verdad escondida.

Lleva las URL de las dos APIs de [verquo](https://github.com/nicolsacv2/verquo) y el
nombre del entorno:

```sh
VITE_ENV=prod
VITE_DEMERE_API=https://…      # de `make urls ENV=prod` en verquo
VITE_TRIANGLE_API=https://…
```

Sin esas variables el curso corre en **modo local**: funciona igual, con dados de
`Math.random` y geometría en el navegador, pero el marcador no se comparte entre
pantallas y la actividad lo avisa.

**No hace falta ninguna regla de rewrite en el servidor.** Las rutas van por hash
(`#s1/bloque-1`), así que el servidor solo entrega `index.html` y los assets.
`public/.htaccess` únicamente añade compresión y caché — un año para lo que lleva hash en
el nombre, cero para `index.html`, o el navegador se quedaría con una versión vieja tras
cada despliegue.

`vite.config.js` usa `base: './'`, así que el sitio funciona igual servido desde la raíz
del dominio o desde un subdirectorio.

## 4 · Entornos: lo que hay y lo que no

**Hoy existe un solo entorno publicado: producción.** Conviene decirlo porque varias
piezas del proyecto están escritas como si hubiera tres, y no las hay.

| Entorno | Dónde debería estar | Estado |
|---|---|---|
| **prod** | `https://nicolasacevedocruz.com` — Hostinger, desde `master` | **vivo** |
| dev | `https://nicolsacv2.github.io/curso-fundamentos-de-ciencia-de-datos/dev/` | **404** |
| qa | `https://nicolsacv2.github.io/curso-fundamentos-de-ciencia-de-datos/qa/` | **404** |

Las URL de dev y qa salen de `Pulumi.dev.yaml` y `Pulumi.qa.yaml` en verquo
(`joinBaseUrl`), que es lo que las APIs meten en el link que se proyecta en clase. Son
GitHub Pages, no Hostinger — pero **Pages no está activado en este repositorio** (su raíz
también responde 404), no hay workflow en `.github/`, `dist/` está en `.gitignore` y no
existe rama de build. No hay, hoy, ningún mecanismo que publique esas dos rutas.

Es decir: si una API de dev genera un link para la clase, ese link lleva a un 404.

Lo que haría falta para que dev y qa existieran de verdad, si algún día se quieren:

1. Activar GitHub Pages en este repositorio.
2. Un workflow que, en cada push a `develop`, compile dos veces con distintas variables
   y publique `dev/` y `qa/` como subdirectorios del sitio de Pages:

   ```sh
   VITE_ENV=dev VITE_DEMERE_API=… VITE_TRIANGLE_API=… pnpm build && cp -R dist publish/dev
   VITE_ENV=qa  VITE_DEMERE_API=… VITE_TRIANGLE_API=… pnpm build && cp -R dist publish/qa
   ```

   `base: './'` ya está puesto justamente para que eso funcione desde un subdirectorio.
3. Que `corsOrigins` en los `Pulumi.<entorno>.yaml` de verquo incluya
   `https://nicolsacv2.github.io` — ya lo incluye.

`VITE_ENV` no elige backend, eso ya va horneado: sirve para que la actividad avise en
pantalla («Entorno dev: esta ronda no cuenta para la clase real»). Un ensayo y la clase
real se ven idénticos, y esa línea es lo único que los distingue de un vistazo.

## 5 · Su otra mitad: las APIs

Las dos actividades en vivo de la sesión 4 hablan con dos servicios de Cloud Run que
viven en **[verquo](https://github.com/nicolsacv2/verquo)**, con su propio `DEPLOY.md`.
Dos cosas tienen que cuadrar entre los dos repositorios, y ninguna falla de forma
evidente:

- **Las URL.** `.env.production` aquí tiene que llevar lo que imprime `make urls
  ENV=prod` allá. Si no coinciden, el curso cae al mock y solo lo dice en una línea
  pequeña.
- **Los orígenes CORS.** `corsOrigins` en el `Pulumi.<entorno>.yaml` de cada actividad
  tiene que incluir el dominio desde el que se sirve el curso —solo el dominio, sin la
  ruta—. Si no, el navegador bloquea cada petición y la clase entera cae al mock sin
  decir por qué.

Producción hoy: `https://nicolasacevedocruz.com,https://www.nicolasacevedocruz.com`.

## 6 · Después de desplegar

Hostinger no avisa de un build roto más que en su propio panel, así que la comprobación
es a mano:

```sh
curl -sI https://nicolasacevedocruz.com | head -1        # 200
```

Y en el navegador, lo que un build verde no garantiza:

- el índice carga y una sesión entra sin errores en consola;
- las diez láminas se piden a `commons.wikimedia.org` (y con ese dominio bloqueado en
  DevTools → Network, se vuelven a pedir a `storage.googleapis.com` y se ven igual);
- en la sesión 4, abrir la actividad en **dos navegadores**: si el marcador se comparte,
  las APIs y el CORS están bien. Si aparece «Modo local», no lo están;
- a 390 px de ancho ninguna figura provoca scroll horizontal.

## 7 · Si hay que volver atrás

No hay botón de rollback: el despliegue es «lo que haya en `master`». Se revierte
revirtiendo.

```sh
git revert <sha>        # o git revert <sha-viejo>..HEAD para varios
git push origin master  # Hostinger recompila solo
```

Tarda lo que tarde el build, que son minutos, no segundos. Si lo que se rompió es una
clase que está ocurriendo **ahora**, el camino rápido no es este: las actividades
degradan solas a su mock local, así que cerrar la clase desde verquo (`make close`) hace
menos daño que esperar un build.
