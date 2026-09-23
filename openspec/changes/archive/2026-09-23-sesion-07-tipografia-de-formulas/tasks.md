# Tareas — Sesión 7: subíndices, raíces, letras griegas, el plano compartido y los valores propios

Derivadas de `specs/` y de `design.md`. Cada tarea dice cómo se comprueba. Aquí no hay
`make test` ni linter: `pnpm build`, `check_figuras.mjs` y la lectura ampliada son todo lo
que hay.

## 1. El chequeo primero, para que atrape lo que hay

- [x] 1.1 Añadir a `scripts/check_figuras.mjs` la comprobación de solapes del diseño D4
      (cajas estimadas de los `<text>` serif, `HOLGURA_SOLAPE = 3`), reportando cada par
      que se pisa con los dos textos.
      **Hecho cuando:** corrido contra el código actual, reporta al menos el solape de
      «(O_ij −» del chi-cuadrado de la entrada y los de «g^sup_jk» y «λ^adj_k» del bloque 2,
      y ninguno en los rótulos monoespaciados.

## 2. El tipógrafo

- [x] 2.1 En `s07/figures/shared.js`, medir el avance tras un índice con `anchoIndice()` y
      usarlo en `row()` y `measure()` a la vez.
      **Hecho cuando:** los solapes de 1.1 desaparecen del reporte y `frac()` sigue
      centrando (medido: el numerador y el denominador de E_ij quedan centrados sobre la raya
      a ±1 px).
- [x] 2.2 Añadir la pieza `raiz` (fila y fracción) a `row()` y `measure()`: signo trazado a
      la altura del radicando, barra que lo cubre entero, cursor que avanza lo dibujado.
      **Hecho cuando:** una fórmula de prueba con `{ raiz: { top, bottom } }` dibuja el signo
      con la altura de la fracción y la barra desde su vértice hasta el final del
      denominador más ancho, y `check_figuras` no reporta nada en ella.
- [x] 2.3 Componer las piezas con caracteres griegos en `GRIEGA` cuando no traigan `ff`.
      **Hecho cuando:** en el navegador, `getComputedStyle` del `<text>` de «χ» del
      chi-cuadrado devuelve Georgia o Times, y ampliada se ve la ji con cola.

## 3. Las ocho raíces

- [x] 3.1 Migrar a la pieza `raiz` las raíces de `intro.js` (la V de Cramér, como raíz de
      fracción), `block1.js` (dos «1/√λ_k»), `block2.js` («√(r_i c_j)» de los residuos y dos
      «1/√λ_k») y `block3.js` (dos «√p_j»).
      **Hecho cuando:** `grep -n "√" src/sessions/s07/figures/*.js` solo devuelve líneas de
      ejemplo en monoespaciada y el `ANCHAS` de `shared.js`, y `check_figuras` pasa.

## 4. El plano compartido, explicado

- [x] 4.1 Publicar `CA.transicionInversa` en `scripts/ejemplo_lluvia.py` para la primera
      columna en el eje 1, con la misma forma que `transicion`, y regenerar `lluvia.js`.
      **Hecho cuando:** `dilatado` coincide con `coordPublicada` de esa columna a la tercera
      cifra, y dos ejecuciones dan el mismo archivo.
- [x] 4.2 Escribir en `Block1.jsx`, entre el título «Filas y columnas en el mismo plano» y el
      mapa, los cuatro párrafos del diseño D6 —dos nubes, los mismos ejes, la transición con
      la ida y la vuelta interpoladas, el precio— y retirar la frase equivalente que hoy está
      después del mapa.
      **Hecho cuando:** los tres pasos están en orden, las dos verificaciones citan cifras de
      `lluvia.js`, el precio está enunciado, y `grep -c "comparten el plano por las"
      src/sessions/s07/blocks/Block1.jsx` devuelve 1.
- [x] 4.3 Añadir a `fTransicionCA` la línea de ejemplo de la vuelta, bajo la de la ida.
      **Hecho cuando:** `check_figuras` pasa y ampliada se leen las dos líneas.

## 6. Los valores propios, explicados

- [x] 6.1 Publicar en `scripts/ejemplo_lluvia.py` `CA.residuos`, `CA.matriz`, `CA.traza` y
      `CA.autovaloresConTrivial`, con el aserto de que todos los valores propios suman la
      traza y φ², y regenerar `lluvia.js`.
      **Hecho cuando:** la traza coincide con `CHI2.phi2` a la cuarta cifra, los valores
      propios con trivial son tres y el último es cero, y dos ejecuciones dan el mismo
      archivo.
- [x] 6.2 Ampliar en `Block1.jsx` el párrafo «Los ejes.» con los tres pasos del diseño D7 y
      añadir la `NumTable` de residuos con su pie.
      **Hecho cuando:** la prosa cita la traza, los tres valores propios y el motivo del cero,
      todos interpolados, y la tabla muestra los nueve residuos con signo.
- [x] 6.3 Añadir a `fSalto` las secciones LOS RESIDUOS y LA MATRIZ Y SUS VALORES PROPIOS antes
      de LOS EJES, con la pieza `raiz` en la fórmula del residuo y las cifras del ejemplo.
      **Hecho cuando:** `check_figuras` pasa y ampliada se leen las cinco secciones en orden.

- [x] 6.4 Definir f_ik y g_jk donde se usan: una línea de definición al abrir la sección LAS
      COORDENADAS de `fSalto`, antes de la fórmula, y la letra nombrada en el párrafo «Las
      coordenadas.» de `Block1.jsx`.
      **Hecho cuando:** ampliada, la definición se lee antes de la fórmula; la prosa dice
      «f_ik» al definir la coordenada; `check_figuras` pasa.

## 5. Verificación

- [x] 5.1 `pnpm build`, `python3 scripts/ejemplo_lluvia.py` dos veces con `diff`, y
      `node scripts/check_figuras.mjs` sin recortes ni solapes en las 42
      figuras.
      **Hecho cuando:** los tres pasan.
- [x] 5.2 Mirar ampliadas en el navegador las figuras del diseño D5 —V de Cramér, chi-cuadrado
      celda por celda, transición del bloque 1, suplementaria y Benzécri del bloque 2,
      reescalado del bloque 3— y los cuatro bloques a 390 px; leer las secciones nuevas del
      bloque 1 —el plano compartido y los valores propios— contra `lluvia.js`.
      **Hecho cuando:** ningún índice pisa el símbolo siguiente, cada raíz cubre su
      radicando a su altura, la χ tiene cola, la ida y la vuelta de la transición coinciden
      con sus coordenadas publicadas, no hay scroll horizontal y **Ampliar** abre, se cierra
      y devuelve el foco. La respuesta trae la URL.
