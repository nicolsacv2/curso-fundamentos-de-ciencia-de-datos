# Constitución

1. **Stack mínimo.** React + Vite y nada más: cuatro dependencias. Un router, un gestor
   de estado, TypeScript o una quinta dependencia exigen acuerdo previo y escrito.
2. **La spec manda.** `docs/apis/` es el contrato con verquo: si el código se aparta, el
   mismo cambio corrige el código o actualiza la spec. La diferencia nunca queda tácita.
3. **Dibujo sin React.** `figures/`, `svg/kit.js` y `activities/api.js` son funciones
   puras que devuelven markup o datos; los `.jsx` componen, no dibujan.
4. **Verde antes de `master`.** Todo cambio compila con `pnpm build`; si toca texto de
   una sesión, pasa `check_content.py`. Ninguna verificación exige red, Docker ni base
   de datos.
5. **El navegador no guarda nada.** Sin `localStorage` ni cookies: el estado compartido
   vive en las APIs. Los datos del salón se derivan del formulario, no se capturan a
   mano: `s03/data/salon.js` lo genera `scripts/extract_salon.py`.
6. **Inglés dentro, español fuera.** Identificadores, comentarios y commits en inglés;
   todo lo que se proyecta en la pared, en español.

## Cómo se comprueba cada uno

| # | Comprobación |
|---|---|
| 1 | `dependencies` + `devDependencies` en `package.json` suman cuatro entradas |
| 2 | Las rutas que llama `api.js` frente a las documentadas en `docs/apis/` |
| 3 | `grep -rl "from 'react'" src/svg src/sessions/*/figures` sale vacío |
| 4 | `pnpm build` compila; `python3 scripts/check_content.py` pasa |
| 5 | `grep -rn "localStorage\|document.cookie" src/` sale vacío; `s03/data/salon.js` abre con «do not edit by hand» |
| 6 | `git log`, y los mensajes al usuario en `api.js` |

## Deuda conocida

**El principio 2 nace incumplido, y se adopta a sabiendas.** `docs/apis/` es la
especificación con la que se arrancó verquo, y el despliegue se apartó de ella en dos
puntos:

- describe **un solo servicio** con el estado en Supabase; en realidad son **dos**, uno
  por actividad, cada uno con su propio despliegue y su propia base de datos —de ahí
  `VITE_DEMERE_API` y `VITE_TRIANGLE_API`—;
- los endpoints de clase están documentados como `/v1/class-sessions`, pero el cliente
  llama `/v1/sessions/play`, `/v1/sessions/finish` y `/v1/sessions/current`.

Mientras eso no se reconcilie, la autoridad sobre lo que las APIs hacen de verdad es
`src/sessions/s04/activities/api.js`, no la spec. Reconciliar `docs/apis/` con el código
es trabajo pendiente, y hasta entonces el principio 2 rige para todo lo demás: ningún
cambio nuevo tiene permiso para ampliar esta distancia.
