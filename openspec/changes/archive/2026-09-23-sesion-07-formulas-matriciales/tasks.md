# Tareas — Sesión 7: las coordenadas en forma matricial

Derivadas de `specs/` y de `design.md`. Cada tarea dice cómo se comprueba. Aquí no hay
`make test` ni linter: `pnpm build`, los dos scripts regenerados con `diff`,
`check_figuras.mjs` y la lectura ampliada son todo lo que hay.

## 1. Lo que publican los scripts

- [x] 1.1 En `scripts/ejemplo_lluvia.py`, calcular U = S V Σ⁻¹ en `ca_de()`, `assert`ar la
      reconstrucción S = U Σ Vᵀ, F = D_r^{−1/2} U Σ, G = D_c^{−1/2} V Σ y σ_k² = λ_k, y
      publicar `CA.svd` y `CA.matricial` (primera fila y primera columna, eje 1); publicar
      también `CA.deduccion` con el aserto Σ_i m_i f_ik² = λ_k para todo k.
      **Hecho cuando:** `CA.matricial.fila.producto` coincide con `coordPublicada` de esa
      fila a la tercera cifra, ídem la columna; `CA.deduccion.suma` es igual a `lambda` y
      `sumaF2` a `d2Perfil` a la cuarta cifra; y dos ejecuciones dan el mismo archivo.
- [x] 1.2 Lo mismo en `scripts/ejemplo_mca_famd.py` para el MCA base: `MCA.svd` y
      `MCA.matricial` (persona 1 y la primera categoría, eje 1), con `D_r^{−1/2} = √n`.
      **Hecho cuando:** las 31 comparaciones con la guía siguen dentro de tolerancia, y
      `git diff src/sessions/s07/data/ejemplo.js` solo añade las claves nuevas.

## 2. Los bloques

- [x] 2.1 Escribir en `figures/block1.js` la figura `fMatricial()` con las cuatro secciones del
      diseño D1 y sus ejemplos interpolados desde `CA.svd` y `CA.matricial`, y en `Block1.jsx`
      la sección «En una sola línea: las matrices» con sus tres párrafos, después de la figura
      del salto.
      **Hecho cuando:** cada símbolo está definido donde aparece, σ² = λ está escrito, las
      dos verificaciones coinciden con las coordenadas publicadas, y `check_figuras` pasa.
- [x] 2.2 Escribir en `figures/block2.js` la figura `fMatricial()` con tres secciones y lo que
      cambia en la tabla disyuntiva, y en `Block2.jsx` la prosa al final de la sección de los
      valores propios, remitiendo al bloque 1 para la transición en matrices; y al final de
      su sección de contribución y cos², la frase que remite al bloque 1 para la deducción.
      **Hecho cuando:** P, D_r y D_c están escritos, las dos verificaciones coinciden con las
      coordenadas publicadas, la frase de remisión está, y `check_figuras` pasa.
- [x] 2.3 Escribir en `figures/block1.js` la figura `fDeduccion()` con las dos secciones del
      diseño D4 y sus ejemplos desde `CA.deduccion`, y en `Block1.jsx` los dos párrafos entre
      la definición y la tabla de contribuciones.
      **Hecho cuando:** las dos deducciones están en orden, remiten a las fórmulas
      matriciales, enuncian las dos identidades como consecuencia, citan las dos sumas
      iguales a λ_1 y a d², y `check_figuras` pasa.

## 3. Verificación

- [x] 3.1 `pnpm build`, los dos scripts dos veces con `diff`, y `node scripts/check_figuras.mjs`.
      **Hecho cuando:** los cuatro pasan.
- [x] 3.2 Mirar ampliadas las tres figuras nuevas y los bloques 1 y 2 a 390 px: sin solapes en
      «−1/2», sin scroll horizontal, **Ampliar** abre, Esc cierra y el foco vuelve al botón.
      **Hecho cuando:** las comprobaciones pasan y la respuesta trae la URL.
