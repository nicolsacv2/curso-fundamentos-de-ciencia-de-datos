# Tareas 001 — Sesión 5: gráficos y reducción de dimensiones

Derivadas de `spec.md` (79 RF) y `plan.md`. En orden de dependencia: cada tarea supone
hechas las anteriores. Ninguna debería pasar de media hora; si una se alarga, es que
escondía otra.

Convención: **Hecho cuando** es una comprobación que se ejecuta o se mira, nunca una
impresión. `pnpm build` tiene que seguir compilando al final de cada tarea, y no se
repite en cada línea.

---

## Fase 0 · Los datos, antes que nada

- [x] **T1 · Conseguir el CSV y fijar el año**
      RF-56, RF-57
      Descargar de Gapminder las cuatro series —PIB per cápita, esperanza de vida,
      fertilidad, mortalidad infantil— y dejarlas junto al repositorio, como el `.xlsx`
      del formulario de la sesión 3. Elegir el año con mejor cobertura simultánea.
      **Hecho cuando:** el año elegido tiene las cuatro series para más de 150 países, y
      ese número queda anotado para T2.

      **Resultado.** Los cinco CSV están en `../gapminder-data/`, con `PROCEDENCIA.txt`
      al lado (URLs, fecha y licencia CC BY 4.0). Salen del repositorio
      `open-numbers/ddf--gapminder--gapminder_world`, que es el que conserva los cuatro
      indicadores clásicos; `systema_globalis` y `fasttrack` no los tienen completos.
      Las cuatro series van de 1800 a 2015.

      **Año elegido: 2015**, con **183 países** que tienen los cuatro a la vez. La
      cobertura es plana desde 2005 —183 todos los años—, así que quedarse con el último
      no cuesta ni un país. Antes de 2005 hay 187, pero los cuatro de diferencia son
      Aruba, Hong Kong, Macao y Puerto Rico, que no son estados soberanos.

      Aviso para T2: el orden de las columnas **no** es el mismo en los cuatro CSV —en
      `child_mortality` el valor va primero—, así que el parser lee la cabecera, nunca
      posiciones.

- [x] **T2 · `scripts/extract_gapminder.py`: leer, filtrar y emitir**
      RF-56, RF-57, RF-58, RF-61, RF-63
      Stdlib pura, docstring con qué hace y cómo se invoca. Descarta los países a los
      que les falte cualquiera de las cuatro series. Emite `ANIO`, `VARS` (clave, nombre
      en pantalla, unidad, qué mide), `PAISES` y `FUENTE`.
      **Hecho cuando:** `python3 scripts/extract_gapminder.py` escribe
      `src/sessions/s05/data/paises.js` con la cabecera «do not edit by hand» e imprime
      cuántos países entraron y cuántos se descartaron.

      **Resultado.** 183 países × 4 indicadores, año 2015; 92 descartados por faltarles
      alguno de los cuatro. `paises.js` son 12 KB y exporta `ANIO`, `FUENTE`, `VARS`,
      `REGIONES`, `CAMPOS` y `PAISES`.

      Comprobado contra los CSV: Colombia sale `[12760, 75.8, 2.23, 15.9]`, y el cuarto
      valor viene del archivo cuyas columnas van en otro orden (`15.9,col,2015`) — leer
      por cabecera era la precaución correcta.

      Los nombres de país se proyectan en español (principio 6): el script traduce los
      118 que difieren y deja tal cual los 68 que se escriben igual en los dos idiomas,
      diciendo cuántos son en cada ejecución. Sin resolver: si alguna figura acaba
      rotulando países, hay que revisar esa lista antes.

- [ ] **T3 · Jacobi y los dos PCA en el mismo script**
      RF-26, RF-59
      Estandarizar, matriz de covarianza, diagonalización por Jacobi. `PCA3` con los tres
      indicadores de la nube; `PCA4` con los cuatro, más las cargas de cada variable.
      **Hecho cuando:** `paises.js` exporta `PCA3` y `PCA4`, y en cada uno los
      porcentajes de varianza suman 100 ± 0,01.

- [ ] **T4 · `scripts/check_pca.py`**
      RF-26, RF-56, RF-57, RF-59
      Recalcula desde el CSV y compara contra `paises.js`; tolerancia 0,01.
      **Hecho cuando:** sale con código 0 sobre los datos generados, y con código 1 si se
      edita a mano un autovalor de `paises.js`. Las dos ejecuciones, comprobadas.

---

## Fase 1 · La sesión existe y se recorre

- [ ] **T5 · `s05/meta.js`**
      RF-2, RF-3, RF-4, RF-5, RF-6
      Título, gancho y objetivo literales de la spec; cinco bloques con las franjas
      0–35, 35–75, 83–120, 128–166, 166–180.
      **Hecho cuando:** el archivo existe y sus cinco `clock` coinciden con RF-6.

- [ ] **T6 · Los cinco bloques en blanco y el registry**
      RF-1, RF-2
      Cinco `.jsx` con solo `<Panel>`, el `eyebrow` y el `h2`; `meta05` en `METAS` y los
      cinco `import()` en `BLOCKS[5]`.
      **Hecho cuando:** el índice muestra la sesión 5 con su título, su objetivo y cinco
      chips; se recorren las cinco pestañas sin error de consola, y `pnpm build` emite
      cinco chunks nuevos.

---

## Fase 2 · La nube rotable (la pieza de riesgo)

- [ ] **T7 · `s05/figures/shared.js`**
      RF-22
      Helpers locales de la sesión —caja, ejes, punto, trazo— y `camera({yaw, pitch})`,
      que devuelve `[x,y,z] → [px,py]`: dos rotaciones y proyección ortográfica.
      **Hecho cuando:** `grep -rl "from 'react'" src/sessions/s05/figures` sale vacío.

- [ ] **T8 · `s05/figures/cloud3d.js`: la nube quieta**
      RF-22, RF-59, RF-77, RF-79
      Los tres indicadores estandarizados, un punto por país, ordenados por profundidad,
      con ejes rotulados. Ángulo inicial elegido para que se vea el volumen.
      **Hecho cuando:** la figura se ve en el bloque 1 sin interacción alguna, y los tres
      ejes llevan el nombre del indicador que representan.

- [ ] **T9 · `s05/views/Cloud3D.jsx` y la regla `.rotor`**
      RF-22, RF-74, RF-76, RF-78
      Estado `{yaw, pitch}`, eventos de puntero, `<Diagram>` con `fig` en `useCallback`
      dependiente del ángulo. En `panel.css`, `.rotor { cursor: grab; touch-action: pan-y }`.
      **Hecho cuando:** arrastrar gira la nube; cambiar de bloque y volver la devuelve al
      ángulo inicial; `grep -rn "localStorage\|document.cookie" src/` sigue vacío.

- [ ] **T10 · El plano y la proyección de los puntos**
      RF-29, RF-30
      El plano de las dos primeras componentes de `PCA3`, dibujado dentro de la nube, y
      la caída de cada punto sobre él.
      **Hecho cuando:** al girar la figura hasta ver el plano de canto, las proyecciones
      quedan alineadas sobre él.

- [ ] **T11 · Los vectores de variables y sus proyecciones**
      RF-31, RF-32
      Un vector por indicador desde el centro de la nube, y su sombra sobre el plano.
      **Hecho cuando:** los tres vectores salen del mismo origen y cada uno tiene su
      proyección dibujada sobre el plano.

- [ ] **T12 · Solidaridad al rotar, y la figura en pantalla pequeña**
      RF-33, RF-69, RF-70, RF-71, RF-72
      **Hecho cuando:** al girar, plano, proyecciones y vectores giran con la nube (nada
      queda fijo respecto a la pantalla); a 390 px no hay scroll horizontal; «Ampliar»
      abre, Esc cierra y el foco vuelve al botón.

---

## Fase 3 · Entrada · 0–35

- [ ] **T13 · `figures/intro.js`: las tres fórmulas**
      RF-7, RF-8, RF-9
      Varianza, covarianza y Pearson en una figura, con `aria-label` que las describe en
      palabras.
      **Hecho cuando:** las tres se leen completas a 390 px tras pulsar «Ampliar».

- [ ] **T14 · `figures/intro.js`: la dispersión donde se lee la correlación**
      RF-15
      Esperanza de vida contra fertilidad, con su coeficiente rotulado.
      **Hecho cuando:** el valor de r rotulado coincide con el que emite `check_pca.py`
      para ese par.

- [ ] **T15 · `blocks/Intro.jsx`**
      RF-4, RF-10, RF-11, RF-12, RF-13, RF-14, RF-16, RF-58, RF-60, RF-61, RF-63
      Gancho, los cuatro indicadores con qué mide cada uno, la cadena varianza →
      covarianza → correlación, sin unidades y acotada, el nombre «diagrama de
      dispersión» sin construirlo, el año y el crédito de la fuente.
      **Hecho cuando:** los once requisitos se localizan uno a uno en la pantalla del
      bloque, lista en mano.

---

## Fase 4 · Bloque 1 · 35–75

- [ ] **T16 · `figures/block1.js`: barras y circular**
      RF-21
      **Hecho cuando:** ambas figuras usan datos de `paises.js`, sin números escritos a
      mano.

- [ ] **T17 · `figures/block1.js`: caja e histograma con dos anchos**
      RF-20, RF-21
      El mismo PIB per cápita con dos anchos de intervalo, lado a lado: la elección se ve
      como decisión (caso límite 8).
      **Hecho cuando:** los dos histogramas tienen los mismos datos y distinta forma, y
      la caja rotula mediana, cuartiles y bigotes.

- [ ] **T18 · `figures/block1.js`: la dispersión del bloque**
      RF-21
      **Hecho cuando:** la figura existe y retoma explícitamente la de la entrada.

- [ ] **T19 · `blocks/Block1.jsx`**
      RF-17, RF-18, RF-19, RF-20, RF-21, RF-22, RF-60
      Cinco fichas con la misma estructura —dato que admite, pregunta que responde, cómo
      se construye, ejemplo— y, al cierre, la nube 3D.
      **Hecho cuando:** las cinco fichas tienen las cuatro casillas rellenas, ninguna
      vacía, y la nube se gira desde este bloque.

---

## Fase 5 · Bloque 2 · 83–120

- [ ] **T20 · `figures/block2.js`: la misma nube, antes y después**
      RF-25
      **Hecho cuando:** las dos mitades son reconociblemente la misma nube.

- [ ] **T21 · `figures/block2.js`: la varianza explicada**
      RF-26
      **Hecho cuando:** los porcentajes dibujados son los de `PCA3` en `paises.js`, no
      valores escritos a mano.

- [ ] **T22 · `blocks/Block2.jsx`**
      RF-23, RF-24, RF-27, RF-28, RF-34, RF-35, RF-60
      La dirección que más estira; matriz de covarianza, autovector y autovalor
      nombrados sin desarrollar; la componente como combinación; la figura rotable
      completa; y el cierre: con una cuarta variable ya no hay nube que dibujar.
      **Hecho cuando:** los siete requisitos se localizan en pantalla, y el paso a la
      maldición de la dimensionalidad enlaza con la cuarta variable.

---

## Fase 6 · Bloque 3 · 128–166

- [ ] **T23 · `figures/block3.js`: la tabla y su transpuesta**
      RF-36
      Recorte que quepa proyectado sin dejar de leerse como la misma tabla girada (caso
      límite 12).
      **Hecho cuando:** las dos se ven a la vez a 390 px sin scroll horizontal, y se
      reconoce que la segunda es la primera girada.

- [ ] **T24 · `figures/block3.js`: el círculo de variables**
      RF-41, RF-46
      Las cuatro cargas de `PCA4`, con el círculo unidad.
      **Hecho cuando:** las cuatro flechas salen de las cargas del archivo generado, y la
      diferencia de longitud entre ellas es visible.

- [ ] **T25 · `figures/block3.js`: los tres ángulos**
      RF-43, RF-44, RF-45
      **Hecho cuando:** las tres parejas están dibujadas con su ángulo y su correlación
      rotulada: cerca de +1, de 0 y de −1.

- [ ] **T26 · `blocks/Block3.jsx`**
      RF-37, RF-38, RF-39, RF-40, RF-42, RF-47, RF-60
      Transponer convierte cada variable en registro; el registro es un vector; el ángulo
      entre vectores es el del círculo; individuos y variables son dos vistas; el coseno
      es la correlación, remitiendo a la fórmula de la entrada.
      **Hecho cuando:** la remisión a la entrada es explícita y nombra la fórmula, no
      solo la idea.

---

## Fase 7 · Cierre · 166–180

- [ ] **T27 · `figures/closing.js`: el 3D que sobra**
      RF-48
      El mismo dato en tres dimensiones y en dos.
      **Hecho cuando:** las dos versiones muestran el mismo dato y la de dos ejes se lee
      mejor.

- [ ] **T28 · `figures/closing.js`: los otros tres gráficos basura**
      RF-50, RF-51, RF-52
      Sin etiquetas en los ejes; sin ejes; sobrecargado hasta impedir la lectura.
      **Hecho cuando:** los tres existen y cada uno falla por un motivo distinto.

- [ ] **T29 · `blocks/Closing.jsx`**
      RF-49, RF-53, RF-54, RF-55
      Qué se pierde con la tercera dimensión; qué impide entender cada gráfico basura;
      ticket de salida; ninguna tarea para la sesión 6.
      **Hecho cuando:** cada uno de los cuatro gráficos basura lleva su frase de qué
      impide entender, y no hay ningún bloque de tarea en el panel.

---

## Fase 8 · El material ya publicado

- [ ] **T30 · Quitar la caja de la sesión 2**
      RF-64, RF-65, RF-66
      Retirar «SESIÓN 5 · se grafica» de `s02/figures/block3.js`, conservar los otros
      tres destinos y dejar el comentario que explica la divergencia con el original.
      **Hecho cuando:** la figura muestra tres flechas; `check_content.py` reporta como
      faltantes solo las palabras de esa caja y ninguna otra.

- [ ] **T31 · Reescribir el cierre de la sesión 4**
      RF-67, RF-68
      Que no prometa graficar los números de esa sesión, y que anuncie lo que la 5 sí
      trata.
      **Hecho cuando:** la frase final de «Lo que queda» no promete la tabla del salón, y
      `check_content.py` no añade ninguna diferencia nueva (la sesión 4 no está en el
      original, así que no debería moverse).

---

## Fase 9 · Cierre de la implementación

- [ ] **T32 · Recorrido de la constitución**
      RF-62, RF-73, RF-74, RF-75
      **Hecho cuando:** `package.json` sigue con cuatro dependencias;
      `grep -rl "from 'react'" src/svg src/sessions/*/figures` vacío;
      `grep -rn "localStorage\|document.cookie" src/` vacío; ningún import de `s03` o
      `s04` dentro de `s05`; ningún `<Plate>` en la sesión 5;
      `grep -c 'id="s5-'` confirma que todos los ids llevan prefijo de sesión.

- [ ] **T33 · Recorrido manual completo**
      RF-69, RF-70, RF-71, RF-72, RF-75, RF-77, RF-78
      **Hecho cuando:** a 390 px ninguna de las quince figuras provoca scroll horizontal
      y el gesto vertical hace scroll sobre la nube; en todas, «Ampliar» abre, Esc cierra
      y el foco vuelve al botón; con DevTools en offline se recorre la sesión entera sin
      que falte nada.

---

## Lo que estas tareas no resuelven

Tres decisiones quedan para el momento de dibujar, y están en «Casos límite» de la spec:
el recorte de la transpuesta (T23), la legibilidad de 180 puntos girando en una pared
(T8) y la frase que separa el 3D que aporta del que estorba (T27). Si alguna se atasca,
la spec manda: se cambia allí primero.
