# Tareas — Simpson en dos figuras

## 1. Las dos figuras

- [x] 1.1 En `src/sessions/s07/figures/intro.js`, sustituir `simpson()` por `simpsonTotal()` y
      `simpsonGrupos()` con un ayudante interno común (rejilla, pareja de barras con porcentaje
      encima y «X de Y» debajo, título de la pareja), ids con prefijo `ar-s7-in-`, misma escala
      y colores; la primera con el rótulo de la pregunta y la línea «la dosis baja mejora más»;
      la segunda con las dos parejas por grupo y la frase de la paradoja, todo interpolado de
      `SIMPSON`.
      **Hecho cuando:** `grep -n "export function simpson" src/sessions/s07/figures/intro.js`
      devuelve exactamente las dos funciones nuevas, `node scripts/check_figuras.mjs` las lista
      sin recortes, y ninguna cifra está escrita en el módulo.

- [x] 1.2 En `src/sessions/s07/figures/block1.js`, añadir la igualdad c_j = n_·j / n a la
      sección del perfil de `fPerfiles()` con su glosa y nombrar «c» en la línea de ejemplo;
      y en `fTransicionCA()` definir c_ji en la glosa de la transición y distinguirlo de c_j.
      **Hecho cuando:** las dos figuras muestran la definición, `node scripts/check_figuras.mjs`
      no reporta recortes y ninguna cifra está escrita en el módulo.

- [x] 1.3 En `src/sessions/s07/figures/shared.js` y `src/sessions/s06/figures/shared.js`,
      tabla de anchos por glifo para la serif y un ayudante `avance()` que usan `measure()` y
      `row()`; la mono conserva su avance fijo.
      **Hecho cuando:** en la figura de perfil del bloque 1 de la sesión 7 el subíndice de m_i
      empieza a la derecha de la m, `node scripts/check_figuras.mjs` no reporta recortes en las
      figuras de las dos sesiones, y `diff` entre las dos copias del tipógrafo no muestra
      diferencias en `measure()` ni en `row()`.

## 2. La sección, en el orden pregunta → paradoja

- [x] 2.1 En `src/sessions/s07/blocks/Intro.jsx`, reordenar la sección de Simpson: prosa de
      apertura → tabla total → `Diagram simpsonTotal` (pie con la pregunta) → prosa breve «ahora
      separen por edad» → par de tablas de grupo → `Diagram simpsonGrupos` → el par de prosa
      final sin cambios. Importar las dos figuras nuevas en lugar de `simpson`.
      **Hecho cuando:** `pnpm build` compila, en la entrada la tabla total y su figura aparecen
      antes que las de grupo, y `grep -nE "[0-9]+[.,][0-9]+" src/sessions/s07/blocks/Intro.jsx`
      no encuentra cifras tecleadas.

## 3. Verificación

- [x] 3.1 `pnpm build` y `node scripts/check_figuras.mjs`; recorrer la entrada de la sesión 7 en
      `pnpm preview` a ancho completo y a 390 px, las dos figuras de fórmulas del bloque 1 y las
      figuras de fórmulas de la sesión 6:
      sin error de consola, ninguna figura provoca scroll horizontal, **Ampliar** abre en cada
      una, Esc cierra y devuelve el foco.
      **Hecho cuando:** las comprobaciones pasan y la respuesta trae la URL del preview.
