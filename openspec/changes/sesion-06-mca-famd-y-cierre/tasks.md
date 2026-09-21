# Tareas — Sesión 6: MCA, FAMD y el cierre sobre el salón

Derivadas de `specs/` y de `design.md`. En orden de dependencia: cada tarea supone hechas
las anteriores. Los grupos 1 a 3 producen datos y verificadores y no tocan lo que se
proyecta; el grupo 4 cambia la estructura; los grupos 5 a 7 escriben los bloques. Cada
grupo deja el sitio compilando, así que cualquiera es un punto seguro para parar.

Convención: cada tarea dice cómo se comprueba, y la comprobación se ejecuta o se mira,
nunca se supone. Aquí no hay `make test` ni linter: `pnpm build`, los tres verificadores
(`check_salon.py`, `ejemplo_mca_famd.py` regenerado con `diff`, `check_figuras.mjs`) y la
lectura a 390 px son todo lo que hay. Las cifras de la guía (`mca_famd_guia.md`) son el
oráculo de aceptación del ejemplo, no su fuente.

---

## 1. El ejemplo de ocho personas, generado

- [ ] 1.1 Escribir `scripts/ejemplo_mca_famd.py` (stdlib pura, docstring con qué hace y cómo
      se invoca) que importe `jacobi` de `scripts/extract_gapminder.py` y calcule el **MCA
      base** de las ocho personas: Z, masas, residuos, valores propios por SᵀS,
      coordenadas de categorías e individuos (estas por transición), contribuciones, cos²,
      Benzécri y los valores propios de Burt. Signos fijados por Café < 0 en el eje 1 y
      Mañana > 0 en el eje 2.
      **Hecho cuando:** imprime λ = (0,5690, 0,3333, 0,0976), Café en −0,924, Mañana en
      (−0,653, +0,707), individuo 1 en −0,986, Burt = (0,3238, 0,1111, 0,0095), y
      Benzécri del eje 1 = 0,125, todo a ±5e-4 de la guía.
- [ ] 1.2 Añadir el **montaje de la rara**: Endulzante {Azúcar 4, Nada 3, Stevia 1}, con la
      distancia al centroide de cada categoría por n/n_j − 1, la tabla del eje 2, la
      posición del individuo 7 en los dos montajes y la proporción de la inercia total que
      acapara Stevia.
      **Hecho cuando:** d²(Stevia) = 7, λ₂ = 0,449 (33,7 %), Stevia en −2,534 con
      contribución 59,6 % y cos² 0,917, individuo 7 de (0,41, 0,82) a (0,19, −1,70), eje 1
      diluido a 42,9 %, Stevia con 21,9 % de la inercia total.
- [ ] 1.3 Añadir las **suplementarias**: Nada y Stevia proyectadas sobre el MCA base por
      transición y, como comprobación, por la vía dual; y la tabla de los dos destinos.
      **Hecho cuando:** Stevia en (0,541, 1,414, −1,307) y Nada en (0,691, 0,471, 0,796)
      por las dos vías, con cos² de Stevia en el plano 0,33 como suplementaria y 0,92 como
      activa.
- [ ] 1.4 Añadir el **FAMD** de Bebida, Horario, tazas y sueño: varianzas por columna,
      valores propios por XᵀX/n, puntuaciones, r² y η² por eje, las dos tablas de SC_dentro
      con subtotales, la identidad por baricentros, las correlaciones del círculo, las
      coordenadas del cuadrado y los baricentros. Signos: tazas < 0 en el eje 1, individuo 7
      > 0 en el eje 2.
      **Hecho cuando:** inercia total 4, varianzas (1, 1, 0,5, 0,5, 0,5, 0,5),
      λ = (3,2883, 0,5703, 0,1414), r²(tazas) 0,9146, r²(sueño) 0,9538, η²(bebida) 0,7969,
      η²(horario) 0,6230, SC = 26,31 = 20,96 + 5,34, subtotales 2,3031 y 3,0400,
      tazas en (−0,956, −0,23) y sueño en (0,977, −0,09).
- [ ] 1.5 Poner los `assert` de autocomprobación del diseño D2 (inercia, transición para los
      ocho, Burt = λ², Σctr = 1, Σλ_FAMD = 4, Σr² + Ση² = λ_k, SC_entre + SC_dentro =
      SC_total, var(F₁) = λ₁, dual = transición) **antes** de escribir, y la comparación
      con la guía como último `assert`.
      **Hecho cuando:** alterar a mano un dato del ejemplo dentro del script hace que falle
      sin escribir nada, y con los datos correctos escribe.
- [ ] 1.6 Emitir `src/sessions/s06/data/ejemplo.js` con la cabecera «generated — do not
      edit by hand», los cuatro montajes bajo nombres claros (`MCA`, `MCA_RARA`, `SUPL`,
      `FAMD`), y el redondeo del diseño.
      **Hecho cuando:** dos ejecuciones seguidas dejan el archivo idéntico según `diff`, y
      `node -e "import('./src/sessions/s06/data/ejemplo.js')"` lo carga sin error.

## 2. El FAMD del salón en la cadena de limpieza

- [ ] 2.1 Añadir a `scripts/clean_salon.py` el paso 10, `famd()`, con la convención de pesos
      del diseño D3 (1/n, desviación poblacional, indicadoras z/√p − √p), sobre las columnas
      con destino `limpia`; publicar todos los ejes no nulos, las puntuaciones de las 27
      personas en todos ellos, r², η², baricentros con su n, contribuciones y cos² por
      categoría y por persona, porcentajes y acumulado.
      **Hecho cuando:** el script imprime Σλ = 12 + Σ(J_q − 1) con los J_q del archivo, y
      el porcentaje de los dos primeros ejes.
- [ ] 2.2 Añadir el segundo montaje `sinRaras`: las categorías con n_j = 1 (encontradas por
      frecuencia, no por nombre) fuera de X, su persona con el resto de sus columnas, y
      esas categorías proyectadas como suplementarias con su cos².
      **Hecho cuando:** el script imprime qué categorías quedaron como suplementarias
      —tienen que ser `5` de balanceada y `xl` de tallaCamiseta— y el porcentaje del eje 1
      en los dos montajes.
- [ ] 2.3 Añadir, solo al montaje activo, las **marcas** como suplementarias: por cada
      variable con `MARCAS[c].total > 0`, el baricentro de sus filas, su n y su cos².
      **Hecho cuando:** hay tantas suplementarias de marca como variables con celdas
      inventadas, y ninguna columna de marca aparece entre las activas.
- [ ] 2.4 Emitir `FAMD` en `src/data/salon_limpio.js` con su comentario de cabecera, y
      regenerar el archivo.
      **Hecho cuando:** `.venv/bin/python scripts/clean_salon.py` lo escribe, `PCA` y
      `MATRICES` no cambian ni en un dígito respecto a la versión anterior (`git diff`
      solo añade `FAMD`), y `salon_limpio.xlsx` regenerado con `export_xlsx.py` es
      idéntico byte a byte al versionado.

## 3. Los verificadores

- [ ] 3.1 Añadir `comprobar_famd` a `scripts/check_salon.py` con las cinco comprobaciones
      del diseño D4, corriendo sobre los dos montajes, sin importar nada fuera de stdlib.
      **Hecho cuando:** `python3 scripts/check_salon.py` pasa con el intérprete del sistema,
      y falla con código 1 si se altera a mano un valor propio, un r², un baricentro o una
      contribución del archivo.
- [ ] 3.2 Reescribir la lista de figuras de `scripts/check_figuras.mjs` para que importe
      `intro.js`, `block1.js`, `block2.js` y `closing.js` y recorra sus exportaciones.
      **Hecho cuando:** antes de que existan los módulos nuevos el script sigue pasando
      sobre `intro.js`, y al crearlos las figuras nuevas aparecen solas en su salida.

## 4. La estructura: cuatro bloques

- [ ] 4.1 Reescribir `src/sessions/s06/meta.js`: cuatro bloques —entrada 0–78, bloque 1
      «MCA» 86–122, bloque 2 «FAMD» 130–158, cierre «El salón entero» 158–180—, con el
      comentario de cabecera actualizado (por qué cuatro, por qué el cierre es largo).
      **Hecho cuando:** las franjas no se solapan, terminan en 180, la entrada sigue siendo
      la más larga del curso, y el índice muestra cuatro fichas para la sesión 6.
- [ ] 4.2 Quitar `bloque-3` de la sesión 6 en `src/sessions/registry.js` y borrar
      `src/sessions/s06/blocks/Block3.jsx`.
      **Hecho cuando:** `pnpm build` emite cuatro chunks para la sesión 6, `#s6/bloque-1`,
      `#s6/bloque-2` y `#s6/cierre` abren su bloque, y `#s6/bloque-3` abre la sesión en su
      entrada sin error en consola.
- [ ] 4.3 Corregir el `Purpose` de `openspec/specs/sesion-06-estructura/spec.md` («cinco
      bloques» → «cuatro»).
      **Hecho cuando:** el Purpose describe la sesión de cuatro bloques.

## 5. Bloque 1 · MCA y categorías raras

- [ ] 5.1 Copiar a `s06/figures/shared.js` los helpers de fórmulas de
      `s05/figures/intro.js` (`row`, `frac`, `measure`, `label`) y escribir en
      `s06/figures/block1.js` las figuras de fórmulas del diseño D5 para el bloque 1
      (indicadora y residuos; distancia chi-cuadrado y n/n_j − 1; transición; inercia y
      Benzécri; contribución y cos²; proyección suplementaria), con `id` prefijados
      `ar-s6-b1-`.
      **Hecho cuando:** `node scripts/check_figuras.mjs` no reporta recortes en ninguna, y
      cada fórmula se lee entera ampliada.
- [ ] 5.2 Dibujar en `block1.js` los tres mapas factoriales —base, con la rara activa, con
      suplementarias— con las coordenadas de `ejemplo.js`, círculos para individuos,
      cuadrados para categorías, círculos punteados para suplementarias, color por variable
      con `CATEGORICO`, leyenda dentro, la frecuencia de Stevia rotulada, y cada eje con su
      número y su porcentaje.
      **Hecho cuando:** ninguna coordenada está escrita en el módulo, el `check_figuras`
      pasa, y las tres figuras reproducen la composición de los SVG de la guía.
- [ ] 5.3 Escribir `Block1.jsx`, partes 1 y 2 de la guía en el orden del diseño D6: el
      puente desde «¿qué falta?» con la cifra interpolada; la tabla de las ocho personas
      con el patrón y las excepciones; la tabla disyuntiva con sus sumas; masas y residuos;
      los valores propios y sus dos identidades; la métrica y n/n_j − 1; transición
      verificada sobre el individuo 1; inercia y Benzécri con la advertencia de Greenacre;
      Burt; contribución y cos² con la tabla del eje 1 y el umbral 1/J; el mapa; la
      interpretación con las tres reglas y el filtro de cos².
      **Hecho cuando:** todos los elementos de `specs/sesion-06-mca` están, y
      `grep -n "0[.,]5690\|0[.,]924\|0[.,]7435\|0[.,]9856\|0[.,]3238" src/sessions/s06/blocks/Block1.jsx`
      no encuentra ninguna cifra tecleada.
- [ ] 5.4 Escribir en `Block1.jsx` las partes 3 y 4: el montaje de la rara con su portador,
      la distancia que explota, la tabla del eje fabricado, los efectos colaterales, el
      falso positivo clásico, el mapa con la rara activa, los cuatro remedios (con la
      referencia al agrupamiento en «raro» de la entrada), la fórmula suplementaria
      verificada por las dos vías, la tabla de los dos destinos, la asimetría conceptual y el
      mapa con suplementarias.
      **Hecho cuando:** todos los elementos de `specs/sesion-06-categorias-raras` están y
      el mismo `grep` ampliado a `2[.,]534\|59[.,]6\|0[.,]917\|0[.,]541\|1[.,]414` no
      encuentra nada tecleado.
- [ ] 5.5 Cerrar `Block1.jsx` con la parte 5: cuatro `Cards` —baricentro, inercia,
      contribución, cos²— cada una con su imagen y su cifra del ejemplo interpolada, y el
      protocolo de lectura en cuatro pasos numerados con la advertencia del principiante.
      **Hecho cuando:** los cuatro conceptos y los cuatro pasos están, y el bloque se
      recorre en el navegador sin error de consola.

## 6. Bloque 2 · FAMD

- [ ] 6.1 Escribir en `s06/figures/block2.js` las figuras de fórmulas del bloque 2 (los dos
      re-escalados y la inercia total; la propiedad de equilibrio; r²; η² con la
      descomposición), con `id` prefijados `ar-s6-b2-`.
      **Hecho cuando:** `check_figuras` pasa y cada fórmula se lee entera ampliada.
- [ ] 6.2 Dibujar en `block2.js` los tres gráficos del FAMD del ejemplo —mapa de individuos
      con baricentros, círculo de correlaciones con las coordenadas rotuladas, cuadrado de
      relaciones con numéricas y categóricas distinguidas y leyenda— desde `ejemplo.js`,
      con cada eje rotulado con su número y su porcentaje.
      **Hecho cuando:** ninguna coordenada está escrita en el módulo, `check_figuras` pasa,
      y los tres reproducen la composición de los SVG de la guía.
- [ ] 6.3 Escribir `Block2.jsx`, partes 6 y 7 en el orden del diseño D6: el problema antes
      del truco; los dos bloques re-escalados y la inercia total; la propiedad de equilibrio
      con sus casos límite; el ejemplo mixto con su tabla, varianzas, valores propios y
      porcentajes; la verificación del teorema; la interpretación con sus cifras; el
      porcentaje de un eje; r² paso a paso; η² por ANOVA; las dos tablas de SC_dentro con
      el individuo que más aporta y la identidad por baricentros; las advertencias, las
      alternativas y el software.
      **Hecho cuando:** todos los elementos de `specs/sesion-06-famd` hasta las
      advertencias están, y `grep -n "3[.,]2883\|0[.,]9146\|0[.,]7969\|26[.,]31\|20[.,]96\|5[.,]34" src/sessions/s06/blocks/Block2.jsx`
      no encuentra ninguna cifra tecleada.
- [ ] 6.4 Escribir en `Block2.jsx` la parte 8 y la síntesis: los tres gráficos con su
      gramática de lectura, el orden de lectura y qué hacer en conjuntos grandes, el
      llamado de referencia como texto en monoespaciada, y la `Idea` final de que los tres
      métodos son el mismo algoritmo con distintos escalados.
      **Hecho cuando:** los elementos restantes de la spec están y el bloque se recorre en
      el navegador sin error de consola.

## 7. Cierre · El salón entero

- [ ] 7.1 Dibujar en `s06/figures/closing.js`, desde `FAMD` de `salon_limpio.js` y con `id`
      prefijados `ar-s6-c-`: la inercia por eje con el acumulado del PCA como referencia
      sobre la misma escala 0–100; el cuadrado de relaciones de las 28 variables con
      `nombre()`, tipos distinguidos, leyenda y apilado de rótulos; el círculo de las 12
      numéricas; el mapa de las 27 personas con los baricentros, rotulados solo los que
      pasan el filtro y con el filtro escrito en la figura.
      **Hecho cuando:** `check_figuras` pasa, cada eje lleva su número y su porcentaje y
      nada más, y a 390 px ninguna provoca scroll horizontal.
- [ ] 7.2 Escribir `Closing.jsx` en el orden del diseño D7 hasta el filtro: qué entra (las
      columnas con destino `limpia`, contadas por tipo), qué no y con qué motivo de la
      entrada; categorías e inercia total por bloques con la advertencia de las variables
      de muchas categorías; inercia por eje contra el PCA, diciendo que los totales son
      distintos; los tres gráficos en el orden del protocolo; contribuciones y cos² con los
      dos umbrales y la lista de qué se interpreta y qué no.
      **Hecho cuando:** todas las cifras salen de `salon_limpio.js` (ninguna literal en el
      archivo salvo los umbrales, que están escritos como constantes con su motivo), y el
      nombre de cada dimensión se construye desde las variables que superan el umbral.
- [ ] 7.3 Escribir la auditoría de las categorías de una persona: cuáles son (desde el
      archivo), su n/n_j − 1, su contribución a los dos ejes, si alguna supera 1/J; y el
      segundo montaje con el porcentaje del eje 1, la posición y el cos² en los dos, remitido
      a la decisión del paso 3b.
      **Hecho cuando:** el juicio de la prosa se ha releído contra las contribuciones
      publicadas y el párrafo lleva un comentario con la exportación de la que depende.
- [ ] 7.4 Escribir la proyección de las marcas: una suplementaria por variable con celdas
      inventadas, con su n, posición y cos², que no deformaron los ejes, y la respuesta a si
      dejar en blanco va con algo.
      **Hecho cuando:** la respuesta se ha releído contra los cos² publicados y el párrafo
      lleva su comentario de dependencia.
- [ ] 7.5 Escribir el ticket de salida con la consigna de la spec y sus respuestas que
      sirven y que no, y «Lo que queda»: la limitación levantada y la sesión siguiente con
      el título y el objetivo que `PENDIENTES[7]` declara, interpolados y no tecleados.
      **Hecho cuando:** lo que el cierre dice de la sesión 7 coincide con
      `src/data/syllabus.js` porque se lee de ahí.

## 8. Retirar lo que sobra y documentar

- [ ] 8.1 Borrar `Pendiente` de `src/components/content/index.jsx`, sus reglas de
      `src/styles/panel.css` y su línea en el glosario de `src/styles/base.css`.
      **Hecho cuando:** `grep -rni "pendiente" src/components src/styles src/sessions`
      no devuelve nada, y `pnpm build` compila.
- [ ] 8.2 Actualizar `README.md`: el script nuevo entre los de stdlib pura, `sNN/data/` en
      la estructura, `check_figuras.mjs` en la verificación, y la sesión 6 sin bloques
      pendientes.
      **Hecho cuando:** el README describe los tres scripts de la sesión 6 y no menciona
      bloques pendientes ni segmentación.
- [ ] 8.3 Comprobar que la entrada sigue diciendo la verdad: «los tres bloques que vienen
      son la respuesta» pasa a «los bloques que vienen», y ninguna otra frase de la entrada
      cuenta bloques.
      **Hecho cuando:** `grep -n "tres bloques" src/sessions/s06/blocks/Intro.jsx` no
      devuelve nada.

## 9. Verificación final

- [ ] 9.1 Ejecutar la verificación completa: `pnpm build`, `python3 scripts/check_salon.py`,
      `python3 scripts/check_pca.py`, `python3 scripts/ejemplo_mca_famd.py` dos veces con
      `diff`, y `node scripts/check_figuras.mjs`.
      **Hecho cuando:** los cinco pasan y `pnpm build` muestra cuatro chunks para la sesión 6
      más el chunk compartido de `ejemplo.js`.
- [ ] 9.2 Recorrer los cuatro bloques de la sesión 6 con `pnpm preview` a ancho completo y
      a 390 px: ninguna figura provoca scroll horizontal, y en cada una **Ampliar** abre el
      diálogo, se cierra con Esc y devuelve el foco al botón.
      **Hecho cuando:** los cuatro bloques abren sin error de consola y las dos
      comprobaciones pasan en cada figura.
- [ ] 9.3 Recorrer el índice y las otras cinco sesiones: ocho filas, la sesión 6 con cuatro
      fichas, y ninguna pantalla promete segmentación ni un bloque en preparación.
      **Hecho cuando:** `grep -rni "segmentaci\|en preparación" src/` no devuelve nada.
- [ ] 9.4 Desplegar en local y compartir la URL para la comprobación manual.
      **Hecho cuando:** `pnpm preview` sirve el build y la respuesta trae la dirección.
