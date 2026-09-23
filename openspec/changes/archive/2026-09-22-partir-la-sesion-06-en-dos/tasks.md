# Tareas — Partir la sesión 6 en dos

Derivadas de `specs/` y de `design.md`. En orden de dependencia: los datos primero, el
total de sesiones después, luego el traslado a la sesión 7, sus dos bloques nuevos, la
partición de la sesión 6, y la documentación. Cada grupo deja el sitio compilando.

Convención: cada tarea dice cómo se comprueba. Aquí no hay `make test` ni linter:
`pnpm build`, los verificadores (`scripts/tablas_salon.py` y `scripts/ejemplo_mca_famd.py`
regenerados con `diff`, `scripts/check_figuras.mjs`, `scripts/check_salon.py` donde esté el
`.xlsx`) y la lectura a 390 px son todo lo que hay.

## 1. Las tablas del salón, generadas

- [x] 1.1 Escribir `scripts/tablas_salon.py` (stdlib pura, docstring con qué hace y cómo se
      invoca) que lea `src/data/salon_limpio.js` con `extract_salon.exportado`, tome las
      variables no numéricas con destino `limpia` y forma «sana», calcule para cada par la
      tabla cruzada, el χ² y la V de Cramér, y elija el par de V mayor.
      **Hecho cuando:** imprime la lista de pares con su V, ordenada, y el par elegido con
      sus niveles y su total igual a `FILAS`.
- [x] 1.2 Añadir para el par elegido los marginales, los perfiles de fila y de columna, las
      esperadas, la contribución de cada celda al χ², φ² y V, con los `assert` del diseño D4
      (marginales cuadran, esperadas conservan marginales, Σ contribuciones = χ²).
      **Hecho cuando:** alterar a mano un recuento dentro del script lo hace fallar sin
      escribir, y con los datos publicados escribe.
- [x] 1.3 Añadir el **CA** del par con el `jacobi` de `extract_gapminder.py`: masas, valores
      propios, porcentajes, coordenadas de filas y columnas en todos los ejes, contribuciones,
      cos², la verificación de transición sobre la primera fila y la distancia chi-cuadrado
      entre las dos primeras filas; signos por el máximo en valor absoluto.
      **Hecho cuando:** el script `assert`a Σλ = χ²/n, la transición para todas las filas y
      columnas, Σctr = 1 por eje, Σcos² = 1 por punto y K = min(r, c) − 1 ejes, y pasa.
- [x] 1.4 Añadir **Simpson** con las constantes del diseño D4 y el `assert` de la inversión:
      P(mejora | alta) mayor que P(mejora | baja) en cada grupo y menor en el total.
      **Hecho cuando:** cambiar una constante de modo que la inversión desaparezca hace
      fallar el script sin escribir.
- [x] 1.5 Emitir `src/sessions/s07/data/tablas.js` con la cabecera «generated — do not edit
      by hand» y las exportaciones `PAR`, `CANDIDATOS`, `TABLA`, `PERFILES`, `ESPERADAS`,
      `CHI2`, `CA` y `SIMPSON`, con el redondeo del diseño.
      **Hecho cuando:** dos ejecuciones seguidas dejan el archivo idéntico según `diff`, y
      `node -e "import('./src/sessions/s07/data/tablas.js')"` lo carga sin error.

## 2. Nueve sesiones, contadas en un solo sitio

- [x] 2.1 En `src/data/syllabus.js`, `SESIONES = 9` y `PENDIENTES` con las claves 8 («Cómo
      aprende una máquina») y 9 («Fundamentos de Inteligencia Artificial»); en `Cover.jsx`
      contar sesiones y horas desde `SESIONES` y escribir «Nueve» desde una tabla de letras;
      en `Session.jsx`, «de {pad2(SESIONES)}».
      **Hecho cuando:** `grep -rn "de 08\|<b>8</b>\|<b>24</b>\|Ocho sesiones" src/` no
      devuelve nada, y la portada dice nueve sesiones y veintisiete horas.
- [x] 2.2 En `src/sessions/s02/figures/block3.js`, el destino «SESIÓN 7 · se modela» pasa a
      «SESIÓN 8», con su `aria-label` y su comentario; en `src/sessions/s04/figures/block3.js`
      y `blocks/Block3.jsx`, la paradoja de Simpson vuelve a decir dónde se resuelve, ahora la
      sesión 7, y los comentarios explican por qué vuelve la cita.
      **Hecho cuando:** `grep -rn "SESIÓN 7\|sesión 7" src/sessions/s02 src/sessions/s04`
      devuelve solo la cita a Simpson en la sesión 4 y el destino de la sesión 2 dice 8.

## 3. La sesión 7: trasladar el MCA, el FAMD y el cierre

- [x] 3.1 `git mv` de `s06/blocks/Block1.jsx` → `s07/blocks/Block2.jsx`, `Block2.jsx` →
      `Block3.jsx`, `Closing.jsx` → `Closing.jsx`; `s06/figures/block1.js` →
      `s07/figures/block2.js`, `block2.js` → `block3.js`, `closing.js` → `closing.js`;
      `s06/data/ejemplo.js` → `s07/data/ejemplo.js`; copiar `s06/figures/shared.js` a
      `s07/figures/shared.js`; corregir los imports relativos y cambiar los prefijos de `id`
      a `ar-s7-b2-`, `ar-s7-b3-`, `ar-s7-c-`; `scripts/ejemplo_mca_famd.py` escribe en
      `s07/data/`.
      **Hecho cuando:** `python3 scripts/ejemplo_mca_famd.py` regenera el archivo en su sitio
      nuevo con `diff` vacío respecto al movido, y `grep -rn "ar-s6-" src/sessions/s07` no
      devuelve nada.
- [x] 3.2 Escribir `src/sessions/s07/meta.js` (título, gancho, objetivo y las cinco franjas
      del diseño D6) y añadir la sesión 7 a `src/sessions/registry.js` con un `import()` por
      bloque, dejando `Intro.jsx` y `Block1.jsx` como componentes mínimos hasta el grupo 4.
      **Hecho cuando:** `pnpm build` compila, el índice muestra nueve filas con la sesión 7
      construida y cinco fichas, y `#s7/bloque-2`, `#s7/bloque-3` y `#s7/cierre` abren el
      MCA, el FAMD y el salón entero.
- [x] 3.3 Reescribir los puentes: el MCA (`s07/blocks/Block2.jsx`) abre diciendo que es el
      análisis de correspondencias del bloque anterior sobre la tabla indicadora y cita las
      columnas que quedaron fuera en la sesión 6; sus «bloque 1» internos pasan a «bloque 2»;
      el FAMD (`Block3.jsx`) refiere al «bloque 2» donde decía «bloque 1»; el cierre dice «el
      PCA de la sesión 6», «la sesión 6» donde decía «la entrada», y «Lo que queda» lee
      `PENDIENTES[8]`.
      **Hecho cuando:** `grep -n "entrada\|¿qué falta?" src/sessions/s07/blocks/Block2.jsx
      src/sessions/s07/blocks/Closing.jsx` solo devuelve las frases que hablan de la sesión 6
      por su nombre, y lo que el cierre anuncia de la sesión 8 coincide con `syllabus.js`.

## 4. La sesión 7: la entrada y el bloque 1 nuevos

- [x] 4.1 Dibujar en `s07/figures/intro.js`, con `id` `ar-s7-in-` y desde `tablas.js`: la
      rejilla observado contra esperado con la contribución al χ² en color y signo y los
      marginales en los bordes; los perfiles de fila al 100 % con el perfil marginal como
      referencia; las seis barras de Simpson con sus recuentos; y las fórmulas de P(A | B),
      la esperada, el χ² por celda y V.
      **Hecho cuando:** `node scripts/check_figuras.mjs` (ya sobre las dos sesiones, tarea
      6.1) no reporta recortes y cada figura declara qué son sus recuentos.
- [x] 4.2 Escribir `s07/blocks/Intro.jsx` en el orden de la spec: el puente desde «¿qué
      falta?» con la cifra interpolada; el criterio del par y los candidatos; la tabla cruzada
      con marginales (`dtable`); los perfiles y P(A | B) leída sobre una celda; marginal contra
      condicional; la tabla esperada; el χ² celda por celda, φ² y V, con la advertencia de
      medida y no prueba; la paradoja de Simpson con sus tres tablas y su explicación; la
      `Idea` «¿asociado con qué, dentro de qué?».
      **Hecho cuando:** todos los requisitos de `specs/sesion-07-tablas-de-contingencia`
      están, `grep -nE "[0-9]+[.,][0-9]+" src/sessions/s07/blocks/Intro.jsx` no encuentra
      cifras tecleadas, y el bloque se recorre sin error de consola.
- [x] 4.3 Dibujar en `s07/figures/block1.js`, con `id` `ar-s7-b1-`: las fórmulas del CA
      (perfil y centroide; distancia chi-cuadrado; inercia = χ²/n; transición; contribución y
      cos²) y el mapa de filas y columnas con marcas distintas, rótulos apilados y cada eje con
      su número y su porcentaje.
      **Hecho cuando:** ninguna coordenada está escrita en el módulo y `check_figuras` pasa.
- [x] 4.4 Escribir `s07/blocks/Block1.jsx` en el orden de la spec: la misma tabla; perfiles,
      centroide y masas; la distancia chi-cuadrado entre dos filas; la inercia como χ²/n y el
      número de ejes; los valores propios; el mapa; la transición verificada sobre una fila; la
      tabla de contribuciones y cos² del eje 1 con el aporte promedio y el nombre del eje
      construido desde los puntos que lo superan; las reglas de lectura aplicadas a una celda;
      el puente al MCA.
      **Hecho cuando:** todos los requisitos de `specs/sesion-07-correspondencias-simples`
      están, no hay cifras tecleadas ni código ni nombres de lenguajes, y el bloque se recorre
      sin error de consola.

## 5. La sesión 6: la cadena en cinco bloques

- [x] 5.1 Reescribir `src/sessions/s06/meta.js`: título «De la tabla sucia al primer plano»,
      objetivo y gancho del diseño, y los cinco bloques con las franjas de D2; en
      `registry.js`, el `import()` de `bloque-3` de la sesión 6.
      **Hecho cuando:** las franjas no se solapan, terminan en 180, y el índice muestra cinco
      fichas para la sesión 6.
- [x] 5.2 Partir `s06/figures/intro.js` en `intro.js` (textoPasos, noNumericas), `block1.js`
      (cajas, descarte, niveles), `block2.js` (relleno) y `block3.js` (sedimento, plano,
      matrices), conservando los `id` `ar-s6-`.
      **Hecho cuando:** `check_figuras` reporta las mismas once figuras que antes, sin
      recortes, repartidas en cuatro módulos.
- [x] 5.3 Recortar `s06/blocks/Intro.jsx` a la entrada (Para empezar, Con qué vamos a
      trabajar, la tabla cruda, Paso 1, Paso 1b) y escribir `Block1.jsx` (Paso 2, 3, 3b, 4),
      `Block2.jsx` (Paso 5, las marcas, Paso 6, 6b) y `Block3.jsx` (Paso 6c, 7) moviendo el
      JSX tal cual, con las constantes de módulo junto a su único usuario.
      **Hecho cuando:** los cuatro bloques se recorren sin error de consola y
      `grep -c "<h3>" src/sessions/s06/blocks/*.jsx` suma los mismos encabezados que tenía la
      entrada.
- [x] 5.4 Escribir `s06/blocks/Closing.jsx`: la `Task` «¿Qué falta?» y la `Idea` que cerraban
      la entrada, un ticket de salida (nombrar una columna que quedó fuera y su motivo) con
      respuestas que sirven y que no, y «Lo que queda» con el título y el objetivo de la
      sesión 7 leídos de su `meta.js`.
      **Hecho cuando:** la pregunta dice que la responde la sesión siguiente y no «los
      bloques que vienen», y el título anunciado coincide con `s07/meta.js` porque se lee de
      ahí.

## 6. Verificadores, specs y documentación

- [x] 6.1 `scripts/check_figuras.mjs` recorre `s06/figures/` y `s07/figures/` y exige el
      prefijo `ar-s6-` o `ar-s7-` según la carpeta.
      **Hecho cuando:** pasa sobre las dos sesiones y falla si a una figura se le pone el
      prefijo de la otra sesión.
- [x] 6.2 Corregir los Purpose de los specs principales según el diseño D8
      (`sesion-06-limpieza`, `-imputacion`, `-pca-cuantitativas`, `-mca`,
      `-categorias-raras`, `-famd`, `-famd-del-salon`, `-figuras-rotuladas`).
      **Hecho cuando:** ningún Purpose dice «la entrada de la sesión 6» ni sitúa el MCA, el
      FAMD o el salón entero en la sesión 6, y `openspec validate --specs` pasa.
- [x] 6.3 Actualizar `README.md`: nueve sesiones y siete construidas, la sesión 7 en la
      estructura, `tablas_salon.py` entre los scripts sin dependencias, `ejemplo.js` en
      `s07/data/`, y `check_figuras.mjs` sobre las dos sesiones.
      **Hecho cuando:** `grep -n "Ocho\|ocho sesiones\|s06/data" README.md` no devuelve nada.

## 7. Verificación final

- [x] 7.1 Ejecutar la verificación completa: `pnpm build`, `scripts/tablas_salon.py` y
      `scripts/ejemplo_mca_famd.py` dos veces con `diff`, `node scripts/check_figuras.mjs`, y
      `scripts/check_salon.py` donde esté el `.xlsx` crudo.
      **Hecho cuando:** pasan, y `pnpm build` muestra cinco chunks por sesión para la 6 y la
      7 más los chunks compartidos de `ejemplo.js` y `tablas.js`.
- [x] 7.2 Recorrer los diez bloques de las sesiones 6 y 7 con `pnpm preview` a ancho completo
      y a 390 px: ninguna figura provoca scroll horizontal, y en cada una **Ampliar** abre el
      diálogo, se cierra con Esc y devuelve el foco al botón.
      **Hecho cuando:** los diez bloques abren sin error de consola y las dos comprobaciones
      pasan en cada figura.
- [x] 7.3 Recorrer el índice y las sesiones 2 y 4: nueve filas, la 6 y la 7 con cinco fichas,
      la 8 y la 9 pendientes con sus títulos, el destino de la sesión 2 en la 8 y la paradoja
      de la sesión 4 citando la 7.
      **Hecho cuando:** `grep -rn "de 08\|SESIÓN 7 ','se modela" src/` no devuelve nada.
- [x] 7.4 Desplegar en local y compartir la URL para la comprobación manual.
      **Hecho cuando:** `pnpm preview` sirve el build y la respuesta trae la dirección.
