# AGENTS.md — curso-fundamentos-de-ciencia-de-datos

## Proyecto
Curso de Fundamentos de Ciencia de datos para estudiantes de Ciencias sociales y económicas.
El proyecto está hosteado en Hostinger como una Web app. El build y el despliegue se realiza de forma
automática una vez se actualiza la rama `master`.

## Comandos
- Requisitos: Node 20+ y pnpm vía corepack (`corepack enable`). Nada global.
- Instalar: `pnpm install`
- Levantar: `pnpm dev` (:5173) · compilar: `pnpm build` (a `dist/`) · servir el build
  ya compilado: `pnpm preview` (:4173)
- No hay linter ni runner de tests configurado: `pnpm build` es la única comprobación
  automática que existe en el repositorio.
- Comparar el texto con el del curso original: `python3 scripts/check_content.py`
  (stdlib, sin dependencias; necesita el proyecto original al lado — ver README)
- Copias de respaldo de las láminas: `python3 scripts/mirror_assets.py` las baja de
  Commons a `.assets-cache/`; `sh scripts/upload_assets.sh` las sube al bucket
- Datos del salón de la sesión 3, desde el .xlsx del formulario:
  `python3 scripts/extract_salon.py [ruta.xlsx]` → `src/sessions/s03/data/salon.js`
- Despliegue: no hay comando. Hostinger compila en cada push a `master`, así que
  **mergear a `master` es desplegar a producción**, sin paso intermedio (ver `DEPLOY.md`)
- APIs de las actividades de la sesión 4: `VITE_DEMERE_API` y `VITE_TRIANGLE_API` van
  horneadas en el build (`.env.production`, versionado a propósito). Sin ellas el curso
  corre en modo local (mock): funciona igual, pero el marcador no se comparte.

## Estilo
- Frontend: React 18 + Vite 6 en la raíz del repositorio, ESM, JavaScript — no
  TypeScript. Sin router ni gestor de estado: las rutas van por hash
  (`src/router/useHashRoute.js`) y el estado vive en los componentes.
- Scripts de apoyo: Python 3 y `sh`, **solo stdlib, sin dependencias**. Cada uno abre
  con un docstring que dice qué hace y cómo se invoca; los `.sh`, con `#!/bin/sh` y
  `set -eu`.
- Sangría de 2 espacios, comillas simples, punto y coma. Comentarios en bloque
  `/* … */`, también los de una sola línea.
- Identificadores, nombres de archivo, comentarios y docstrings en inglés; el contenido
  del curso y lo que se lee en pantalla, en español (se proyecta en la pared). El
  README, DEPLOY y `docs/` también van en español.
- Los comentarios explican el *porqué* de una decisión no obvia —y, cuando la hay, la
  historia que la justifica—, no lo que el código ya dice. Sigue el tono de los que ya
  están.
- Las figuras devuelven markup SVG desde `sNN/figures/*.js` con los helpers de
  `src/svg/kit.js`. Cada `id` lleva prefijo de sesión (`ar-s2-types`): uno repetido
  haría que `url(#…)` resolviera al marcador de otra figura.
- Un `import()` por bloque en `src/sessions/registry.js`: es lo que hace que Vite emita
  un chunk independiente por bloque. Un import estático de un bloque rompe eso.
- Mensajes de commit en inglés, en imperativo y describiendo el efecto para la clase
  (mira `git log`).

## Reglas
- `docs/constitution.md` manda sobre este archivo: seis principios innegociables, con la
  comprobación de cada uno al lado. Léelo antes que nada. Si un cambio choca con uno,
  no lo hagas: se cambia primero la constitución, y eso se pide.
- Antes de tocar el código, lee además `README.md` (cómo se renderiza por pasos, de dónde
  salen las láminas) y `DEPLOY.md` (por qué el proyecto está configurado como está: cada
  ajuste raro de pnpm tiene detrás un despliegue roto). Para la sesión 4, `docs/apis/`.
- `docs/apis/` tiene una deriva conocida y anotada en la constitución: describe un
  servicio único y endpoints `/v1/class-sessions`, cuando en realidad son dos servicios
  y `/v1/sessions/*`. Hasta que se reconcilie, manda `src/sessions/s04/activities/api.js`
  — y ningún cambio nuevo puede ampliar esa distancia.
- `specs/` está vacío. Si algún día se llena, pasa a ser lectura obligatoria; mientras
  tanto, no lo cites como si dijera algo.
- No modifiques `docs/apis/` ni `specs/` salvo petición explícita: describen el contrato
  con verquo, que es otro repositorio.
- No añadas dependencias sin acordarlo antes. Hoy son cuatro —`react`, `react-dom`,
  `vite`, `@vitejs/plugin-react`— y los scripts de `scripts/` son de stdlib pura a
  propósito. Cada una es una pieza más que el builder de Hostinger tiene que resolver con
  la versión de pnpm que le toque, y eso ya tumbó el despliegue dos veces (`059b411`,
  `0166c5e`).
- No cambies la arquitectura sin acordarlo antes: rutas por hash, un `import()` por
  bloque, sin router ni gestor de estado, y `base: './'` para que el sitio sirva igual
  desde la raíz del dominio que desde un subdirectorio.

## Al terminar cualquier tarea
- Ejecuta `pnpm build` y confirma en tu respuesta que compila. Aquí no hay `make test`
  ni `make lint`: no inventes comandos que este repositorio no tiene.
- Si tocaste el texto visible de una sesión, ejecuta además
  `python3 scripts/check_content.py`. Necesita el proyecto original al lado; si no está,
  dilo en vez de saltártelo en silencio.
- Si tocaste figuras o CSS, comprueba a 390 px de ancho: ninguna figura debe provocar
  scroll horizontal, y **Ampliar** tiene que abrir el diálogo, cerrarse con Esc y
  devolver el foco al botón.
- Si tocaste `src/assets/`, `src/styles/panel.css` o `scripts/mirror_assets.py`: la
  escalera de anchos vive solo en `src/assets/sources.js` y el script la lee de ahí.
  Verifica que las láminas se piden a `commons.wikimedia.org` y que, bloqueando ese
  dominio en DevTools → Network, se vuelven a pedir a `storage.googleapis.com` y se ven
  igual.
- Si tocaste `src/sessions/s04/activities/`, abre la actividad en dos navegadores: el
  marcador tiene que compartirse. Si aparece «Modo local», el cliente cayó al mock —
  revisa las URL de `.env.production` y los orígenes CORS en verquo.
