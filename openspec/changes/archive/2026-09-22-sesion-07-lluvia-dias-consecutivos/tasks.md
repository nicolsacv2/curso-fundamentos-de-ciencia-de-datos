# Tareas — Sesión 7: la tabla de la lluvia se cuenta desde un año

Derivadas de `specs/` y de `design.md`. En orden de dependencia. El grupo 1 produce los
datos; los grupos 2 y 3 reescriben lo que se proyecta; el 4 documenta; el 5 verifica. Cada
tarea dice cómo se comprueba, y la comprobación se ejecuta o se mira. Aquí no hay `make test`
ni linter: `pnpm build`, `ejemplo_lluvia.py` regenerado con `diff`, `check_figuras.mjs` y la
lectura a 390 px son todo lo que hay.

---

## 1. El año, el recuento y el script

- [x] 1.1 En `scripts/ejemplo_lluvia.py`, sustituir la constante `DIAS` por `TRANSICION`
      (matriz estocástica 3 × 3 con la diagonal alta), `SEMILLA`, `ESTADO_INICIAL` y
      `DIAS_DEL_ANIO = 365`; simular el año con `random.Random(SEMILLA)` y contar los pares
      consecutivos en `N`. Actualizar el docstring: la tabla se cuenta, no se declara, y la
      regla no se publica.
      **Hecho cuando:** `grep -n "DIAS = \[" scripts/ejemplo_lluvia.py` no devuelve nada y el
      script imprime el año y la tabla contada.
- [x] 1.2 Añadir los asertos del diseño D1: 365 días, 364 pares, para cada estado
      `filas[k] − columnas[k] == [anio[0] == k] − [anio[-1] == k]`, diagonal máxima por fila,
      P(lluvia | lluvia) > P(lluvia) y P(sol | sol) > P(sol); conservar todos los de antes.
      Elegir la semilla que los cumpla y dejarla comentada.
      **Hecho cuando:** el script escribe con la semilla fijada, y con una semilla que rompa
      la historia falla sin escribir.
- [x] 1.3 Publicar `ANIO` y los campos nuevos de `TABLA` (`n = 364`, `unidad`, `dias`,
      `margenes` con `explicacion`) y renombrar en los comentarios del archivo generado y en
      `relato` «hoy/mañana» → «día observado/día siguiente».
      **Hecho cuando:** `python3 scripts/ejemplo_lluvia.py` dos veces deja `lluvia.js`
      idéntico según `diff`, `grep -in "mañana\|hoy" src/sessions/s07/data/lluvia.js` no
      devuelve nada, y `SIMPSON` no cambia respecto a la versión anterior (`git diff`).

## 2. La entrada

- [x] 2.1 Dibujar `anio()` en `src/sessions/s07/figures/intro.js`: 365 celdas en filas de 30,
      color por estado con los mismos tres colores de `perfilesFila`, primer y último día
      señalados y rotulados, leyenda, y debajo un par consecutivo ampliado con la flecha
      «día observado → día siguiente»; `id` con prefijo `ar-s7-`.
      **Hecho cuando:** `node scripts/check_figuras.mjs` la recoge y no reporta recortes, y
      contar sus celdas coloreadas da 365.
- [x] 2.2 Renombrar en `figures/intro.js` todos los títulos, rótulos de eje, rótulos de barra,
      textos de fórmula y `aria-label` que digan «hoy» o «mañana».
      **Hecho cuando:** `grep -in "mañana\|hoy" src/sessions/s07/figures/intro.js` no
      devuelve nada.
- [x] 2.3 En `Intro.jsx`, añadir antes de la tabla la figura del año y la prosa de la unidad
      (días → pares, con las dos cifras interpoladas), y después de la tabla la `NumTable` de
      márgenes desde `TABLA.margenes` con el párrafo que explica cada diferencia por el
      primer o el último día.
      **Hecho cuando:** las dos cifras y las diferencias salen de `lluvia.js`, y la
      explicación de cada estado coincide con `ANIO.primerDia` y `ANIO.ultimoDia`.
- [x] 2.4 Renombrar en `Intro.jsx` cabeceras, notación y prosa: `observado \ siguiente`,
      `P(siguiente | observado)`, `esperado \ siguiente`, el título «Si un día llueve,
      ¿llueve el día siguiente?», y las tarjetas de marginal contra condicional.
      **Hecho cuando:** `grep -in "mañana" src/sessions/s07/blocks/Intro.jsx` no devuelve nada
      y `grep -n "hoy" src/sessions/s07/blocks/Intro.jsx` devuelve solo «Hoy entran todas».

## 3. El bloque 1

- [x] 3.1 Renombrar en `figures/block1.js` los rótulos de punto (`observado: sol (n)`,
      `siguiente: sol (n)`), el título del mapa, las leyendas y los textos de fórmula.
      **Hecho cuando:** `grep -in "mañana\|hoy" src/sessions/s07/figures/block1.js` no
      devuelve nada y `check_figuras` pasa.
- [x] 3.2 Renombrar en `Block1.jsx` cabeceras, tipos de punto (`fila · observado`,
      `columna · siguiente`) y prosa.
      **Hecho cuando:** `grep -in "mañana\|hoy" src/sessions/s07/blocks/Block1.jsx` no
      devuelve nada.
- [x] 3.3 Releer la prosa del bloque 1 contra el `lluvia.js` regenerado y hacer
      condicionales las dos frases del diseño D5 («casi una línea» solo si el eje 1 supera la
      constante `CASI_LINEA = 90`; «los dos extremos del cielo» solo si hay un estado a cada
      lado), con la alternativa escrita.
      **Hecho cuando:** cada afirmación cualitativa del bloque se ha cotejado con
      `CA.porcentajes`, `CA.filas` y `CA.columnas`, y ninguna la contradice.

## 4. Documentación y specs

- [x] 4.1 Actualizar `README.md`: el ejemplo es un año simulado con semilla fija, contado en
      pares de días consecutivos; los rótulos «día observado / día siguiente».
      **Hecho cuando:** el párrafo de `ejemplo_lluvia.py` ya no dice «escrita como constante»
      ni «hoy» ni «mañana».
- [x] 4.2 Corregir los `Purpose` de `openspec/specs/sesion-07-tablas-de-contingencia/spec.md`
      y `openspec/specs/sesion-07-correspondencias-simples/spec.md`.
      **Hecho cuando:** ninguno de los dos dice «el cielo de hoy contra el cielo de mañana».

## 5. Verificación

- [x] 5.1 Ejecutar `pnpm build`, `python3 scripts/ejemplo_lluvia.py` dos veces con `diff`, y
      `node scripts/check_figuras.mjs`.
      **Hecho cuando:** los tres pasan.
- [x] 5.2 Recorrer la entrada y el bloque 1 de la sesión 7 con `pnpm preview` a ancho completo
      y a 390 px: ninguna figura provoca scroll horizontal, **Ampliar** abre, Esc cierra y el
      foco vuelve al botón; la suma de cada estado como observado y como siguiente difiere
      como máximo en uno y la tira del año lo explica.
      **Hecho cuando:** los dos bloques abren sin error de consola y las comprobaciones pasan.
- [x] 5.3 Comprobar que nada más en `src/` nombra la tabla como «hoy/mañana».
      **Hecho cuando:** `grep -rn "cielo de hoy\|cielo de mañana" src/ README.md` no devuelve
      nada.
- [x] 5.4 Desplegar en local y compartir la URL para la comprobación manual.
      **Hecho cuando:** `pnpm preview` sirve el build y la respuesta trae la dirección.
