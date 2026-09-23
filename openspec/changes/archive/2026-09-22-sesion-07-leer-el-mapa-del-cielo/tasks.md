# Tareas — Sesión 7: leer el mapa del cielo, y el salto de las distancias al mapa

Derivadas de `specs/` y de `design.md`. Cada tarea dice cómo se comprueba. Aquí no hay
`make test` ni linter: `pnpm build`, los dos scripts regenerados con `diff`,
`check_figuras.mjs` y la lectura a 390 px son todo lo que hay.

## 1. Lo que publican los scripts

- [x] 1.1 En `scripts/ejemplo_lluvia.py`, calcular la distancia chi-cuadrado entre cada par de
      filas y entre cada par de columnas desde los perfiles y la distancia euclídea entre sus
      coordenadas principales sobre los K ejes, `assert`ar que coinciden, y publicar
      `CA.distancias` con `{ a, b, d2, d, dCoord }` por par, ordenadas de menor a mayor, y
      `CA.salto` para el par de filas más lejano.
      **Hecho cuando:** `lluvia.js` trae tres pares de filas y tres de columnas,
      `distancias.filas` contiene el par de `CA.distancia` con el mismo `d2`, `salto.dPerfiles`
      es igual a `salto.dCoord`, y dos ejecuciones dan el mismo archivo.
- [x] 1.2 En `scripts/ejemplo_mca_famd.py`, calcular para la pareja de individuos más lejana
      su distancia por Z (n/Q · Σ (z_ij − z_i′j)²/n_j), por las coordenadas sobre los K ejes y
      por las dos del mapa; `assert`ar las dos primeras iguales y la tercera no mayor; publicar
      `MCA.salto`. El oráculo de la guía no cambia.
      **Hecho cuando:** el script escribe, `MCA.salto.dZ` es igual a `dTodosLosEjes`,
      `dMapa` es menor o igual, `retenido` es `MCA.acumulado[1]`, y ninguna otra cifra de
      `ejemplo.js` cambia (`git diff` solo añade `salto`).

## 2. El bloque 1

- [x] 2.1 Reescribir en `Block1.jsx` la lista «Cómo se lee el mapa» con cuatro reglas —fila
      cerca de columna, filas cercanas, columnas cercanas, fila–columna por dirección— cada
      una remitiendo a su caso.
      **Hecho cuando:** las cuatro reglas están y cada una nombra el caso al que remite.
- [x] 2.2 Reescribir «Aplicado al cielo» como una lista de cinco casos del diseño D2 —las
      tres parejas homónimas con su celda; el par de filas más cercano y el más lejano con
      distancia y perfiles; el par de columnas más cercano; una fila junto a la columna de
      otro estado, por dirección, con su celda; el punto más cercano al centro con su perfil
      frente al margen—, todos elegidos desde `CA.distancias`, `CA.filas`, `CA.columnas`,
      `TABLA`, `ESPERADAS` y `PERFILES`, con las ramas alternativas escritas.
      **Hecho cuando:** `grep -n "cerca del centro son" src/sessions/s07/blocks/Block1.jsx`
      no devuelve nada, ningún estado ni cifra está escrito a mano en la sección, y en
      pantalla los cinco casos citan cifras que coinciden con la tabla de la entrada.
- [x] 2.3 Escribir la sección «De las distancias al mapa» entre la distancia chi-cuadrado y
      el mapa, con los tres párrafos del diseño D5 y la figura `fSalto()` en
      `figures/block1.js` (tres secciones: la nube, los ejes, las coordenadas; el ejemplo
      interpolado desde `CA.salto`; `id` con prefijo `ar-s7-b1-`).
      **Hecho cuando:** la sección remite al PCA de la sesión 6, enuncia la aproximación y
      la igualdad con todos los ejes, cita el par con sus dos distancias iguales y dice por
      qué son iguales, y `check_figuras` pasa.
- [x] 2.4 Comprobar las ramas: con el año actual, la prosa dice que las tres parejas
      comparten lado y cita «nublado» como fila más cercana al centro; leer el código de las
      ramas alternativas y confirmar que compilan y que ninguna afirma algo que dependa de un
      estado nombrado.
      **Hecho cuando:** `pnpm build` compila y la sección se ha leído entera contra
      `lluvia.js`.

## 3. El bloque 2

- [x] 3.1 Escribir en `Block2.jsx` la sección «Parte 1 · De las distancias al mapa» entre la
      métrica chi-cuadrado y las fórmulas de transición, con los tres párrafos paralelos a los
      del bloque 1, la verificación sobre las dos personas de `MCA.salto` —por Z, por todos los
      ejes, por los dos del mapa con el porcentaje retenido— y la frase que remite al bloque 1.
      **Hecho cuando:** los tres pasos están en el mismo orden y con los mismos rótulos que
      en el bloque 1, las tres distancias se interpolan, y el bloque compila.
- [x] 3.2 Escribir `fSalto()` en `figures/block2.js` con las mismas tres secciones que la del
      bloque 1 y el ejemplo de `MCA.salto`; `id` con prefijo `ar-s7-b2-`.
      **Hecho cuando:** `check_figuras` pasa y la figura se lee entera ampliada.

## 4. El mapa

- [x] 4.1 En `figures/block1.js`, añadir a `rotulos` por cada estado la tercera línea con la
      celda de su pareja homónima («N pares · esperados E») y la línea de leyenda que dice qué
      es.
      **Hecho cuando:** `node scripts/check_figuras.mjs` pasa, y ampliada la figura muestra
      tres líneas bajo cada pareja sin tapar ningún punto.

## 5. Verificación

- [x] 5.1 `pnpm build`, `python3 scripts/ejemplo_lluvia.py` y
      `python3 scripts/ejemplo_mca_famd.py` dos veces cada uno con `diff`, y
      `node scripts/check_figuras.mjs`.
      **Hecho cuando:** los cuatro pasan.
- [x] 5.2 Recorrer los bloques 1 y 2 con `pnpm preview` a ancho completo y a 390 px: sin
      errores de consola, sin scroll horizontal, **Ampliar** abre, Esc cierra y el foco
      vuelve al botón.
      **Hecho cuando:** las comprobaciones pasan y la respuesta trae la URL.
