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
- Despliegue: no hay comando. Hostinger compila en cada push a `master`, así que
  **mergear a `master` es desplegar a producción**, sin paso intermedio (ver `DEPLOY.md`)

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
- Las figuras devuelven markup SVG desde `sNN/figures/*.js` con los helpers de
  `src/svg/kit.js`. Cada `id` lleva prefijo de sesión (`ar-s2-types`): uno repetido
  haría que `url(#…)` resolviera al marcador de otra figura.
- Un `import()` por bloque en `src/sessions/registry.js`: es lo que hace que Vite emita
  un chunk independiente por bloque. Un import estático de un bloque rompe eso.
- Mensajes de commit en inglés, en imperativo y describiendo el efecto para la clase
  (mira `git log`).

## Reglas
- `openspec/config.yaml` manda sobre este archivo.
- Antes de tocar el código, lee además `README.md` (cómo se renderiza por pasos, de dónde
  salen las láminas) y `DEPLOY.md` (por qué el proyecto está configurado como está: cada
  ajuste raro de pnpm tiene detrás un despliegue roto). Para la sesión 4, `docs/apis/`.
- No añadas dependencias sin acordarlo antes. Hoy son cuatro —`react`, `react-dom`,
  `vite`, `@vitejs/plugin-react`— y los scripts de `scripts/` son de stdlib pura a
  propósito. Cada una es una pieza más que el builder de Hostinger tiene que resolver con
  la versión de pnpm que le toque, y eso ya tumbó el despliegue dos veces (`059b411`,
  `0166c5e`).
- No cambies la arquitectura sin acordarlo antes: rutas por hash, un `import()` por
  bloque, sin router ni gestor de estado, y `base: './'` para que el sitio sirva igual
  desde la raíz del dominio que desde un subdirectorio.
- Nunca ejecutes el spec sin autorización explícita. Para ejecutar el spec es necesario declarar
  de forma explícita el comando /opsx:apply.

## Al terminar de ejcutar cualquier spec
- Ejecuta `pnpm build` y confirma en tu respuesta que compila. Aquí no hay `make test`
  ni `make lint`: no inventes comandos que este repositorio no tiene.
- Si tocaste figuras o CSS, comprueba a 390 px de ancho: ninguna figura debe provocar
  scroll horizontal, y **Ampliar** tiene que abrir el diálogo, cerrarse con Esc y
  devolver el foco al botón.
- Si tocaste `src/assets/`, `src/styles/panel.css` o `scripts/mirror_assets.py`: la
  escalera de anchos vive solo en `src/assets/sources.js` y el script la lee de ahí.
  Verifica que las láminas se piden a `commons.wikimedia.org` y que, bloqueando ese
  dominio en DevTools → Network, se vuelven a pedir a `storage.googleapis.com` y se ven
  igual.
- Despliega en localhost y comparte la url para comprobar manualmente.
