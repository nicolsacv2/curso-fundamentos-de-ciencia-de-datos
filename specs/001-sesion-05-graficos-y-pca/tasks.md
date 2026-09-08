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

- [x] **T3 · Jacobi y los dos PCA en el mismo script**
      RF-26, RF-59
      Estandarizar, matriz de covarianza, diagonalización por Jacobi. `PCA3` con los tres
      indicadores de la nube; `PCA4` con los cuatro, más las cargas de cada variable.
      **Hecho cuando:** `paises.js` exporta `PCA3` y `PCA4`, y en cada uno los
      porcentajes de varianza suman 100 ± 0,01.

      **Resultado.** Los dos suman 100,0000. `PCA3` (PIB, vida, fertilidad):
      75,7 % · 17,6 % · 6,7 %. `PCA4`: 77,2 % · 14,9 % · 5,3 % · 2,6 %. Se exportan
      además `ESTAD` (media, desviación, mínimo y máximo por indicador, para que las
      figuras estandaricen sin llevar una segunda copia de la tabla) y `CORR`.

      La nube lleva PIB, vida y fertilidad; la que queda fuera es mortalidad infantil,
      que es casi el espejo de la esperanza de vida (r = −0,87) y es la que el bloque 3
      recupera al transponer.

      Verificado dentro del script, no a ojo: Av = λv para cada autovector (error
      < 1e-9), autovalores ordenados y traza igual al número de variables.

- [x] **T4 · `scripts/check_pca.py`**
      RF-26, RF-56, RF-57, RF-59
      Recalcula desde el CSV y compara contra `paises.js`; tolerancia 0,01.
      **Hecho cuando:** sale con código 0 sobre los datos generados, y con código 1 si se
      edita a mano un autovalor de `paises.js`. Las dos ejecuciones, comprobadas.

      **Resultado.** Sale 0 con el archivo intacto y 1 con las siete ediciones probadas:
      autovalor, porcentaje, correlación, vector, media, desviación y el PIB de un país.

      Comprueba dos cosas por caminos distintos: recalcula desde los CSV y compara valor
      a valor, y verifica los números publicados en sus propios términos (Av = λv,
      vectores ortonormales, cargas = v·√λ). La primera mitad no detectaría un error en
      el álgebra, porque lo repetiría; la segunda sí.

      **Tres cosas que aparecieron al construirlo**, ninguna evidente antes:

      1. La tolerancia de 0,01 que pedía esta tarea dejaba pasar la edición más pequeña
         posible en un porcentaje (77,23 → 77,24 son exactamente 0,01). Están separadas:
         exacta contra el recálculo —ambos lados redondean igual, así que cualquier
         diferencia es una edición—, y holgada solo donde se comparan valores guardados
         con distinta precisión.
      2. **El orden de las filas mueve el cuarto decimal** de los autovectores: la coma
         flotante no es asociativa y Jacobi suma en el orden en que llegan los países.
         El extractor ordena alfabéticamente y el verificador tiene que hacer lo mismo.
      3. **El PCA se calcula sobre los valores redondeados que el archivo publica**, no
         sobre los del CSV. Así, quien recalcule desde `paises.js` obtiene exactamente
         los porcentajes proyectados; si saliera de números que el archivo no muestra,
         la tabla no se podría auditar contra sus propias componentes.

      Y un cuarto, del propio verificador: su mensaje decía «valores, ESTAD y CORR
      idénticos» cuando `CORR` no se comparaba. Editarla pasaba desapercibida. Corregido.

---

## Fase 1 · La sesión existe y se recorre

- [x] **T5 · `s05/meta.js`**
      RF-2, RF-3, RF-4, RF-5, RF-6
      Título, gancho y objetivo literales de la spec; cinco bloques con las franjas
      0–35, 35–75, 83–120, 128–166, 166–180.
      **Hecho cuando:** el archivo existe y sus cinco `clock` coinciden con RF-6.

      **Resultado.** Franjas verificadas contra RF-6. Los `rname`, que la spec no fija
      porque son rótulo interno del rail: «Tres fórmulas encadenadas», «Cinco gráficos»,
      «La sombra de la nube», «La tabla girada», «Gráficos que estorban».

- [x] **T6 · Los cinco bloques en blanco y el registry**
      RF-1, RF-2
      Cinco `.jsx` con solo `<Panel>`, el `eyebrow` y el `h2`; `meta05` en `METAS` y los
      cinco `import()` en `BLOCKS[5]`.
      **Hecho cuando:** el índice muestra la sesión 5 con su título, su objetivo y cinco
      chips; se recorren las cinco pestañas sin error de consola, y `pnpm build` emite
      cinco chunks nuevos.

      **Resultado.** 25 chunks en total (5 sesiones × 5 bloques); los cinco nuevos pesan
      0,28 kB. `syllabus.js` no se toca: `Cover.jsx` prefiere `meta.js` cuando existe, y
      su entrada 5 queda muerta como las de las sesiones 1 a 4.

---

## Fase 2 · La nube rotable (la pieza de riesgo)

- [x] **T7 · `s05/figures/shared.js`**
      RF-22
      Helpers locales de la sesión —caja, ejes, punto, trazo— y `camera({yaw, pitch})`,
      que devuelve `[x,y,z] → [px,py]`: dos rotaciones y proyección ortográfica.
      **Hecho cuando:** `grep -rl "from 'react'" src/sessions/s05/figures` sale vacío.

- [x] **T8 · `s05/figures/cloud3d.js`: la nube quieta**
      RF-22, RF-59, RF-77, RF-79
      Los tres indicadores estandarizados, un punto por país, ordenados por profundidad,
      con ejes rotulados. Ángulo inicial elegido para que se vea el volumen.
      **Hecho cuando:** la figura se ve en el bloque 1 sin interacción alguna, y los tres
      ejes llevan el nombre del indicador que representan.

      **Resultado.** 183 puntos, tres ejes rotulados, color por región y opacidad por
      profundidad. La escena es **isométrica**: los mismos píxeles por desviación típica
      en los tres ejes, porque el bloque 2 dibujará dentro el plano de las componentes y
      estirar un eje lo dejaría de ser. La caja sale alargada —el PIB llega a +6
      desviaciones y la esperanza de vida no pasa de +1,6—, y ese sesgo es el dato.

      Probados **1953 ángulos** (yaw × pitch, paso 0,1): la nube nunca se sale del
      lienzo, con 28,5 px del margen más estrecho.

- [x] **T9 · `s05/views/Cloud3D.jsx` y la regla `.rotor`**
      RF-22, RF-74, RF-76, RF-78
      Estado `{yaw, pitch}`, eventos de puntero, `<Diagram>` con `fig` en `useCallback`
      dependiente del ángulo. En `panel.css`, `.rotor { cursor: grab; touch-action: pan-y }`.
      **Hecho cuando:** arrastrar gira la nube; cambiar de bloque y volver la devuelve al
      ángulo inicial; `grep -rn "localStorage\|document.cookie" src/` sigue vacío.

      **Resultado, comprobado en Chrome sobre el servidor de desarrollo** (no deducido):
      arrastrar recoloca los 190 círculos; ir al bloque 2 y volver deja los `cx` en su
      valor inicial exacto. RF-78 sale gratis del desmontaje que ya hace `Session.jsx`,
      sin una línea que lo gestione. `cursor: grab` y `touch-action: pan-y`, aplicados.

      El `pitch` se limita a ±1,25 rad: pasado el polo la escena se da la vuelta y los
      rótulos se leen en espejo, que parece un fallo y no lo quiere nadie.

- [x] **T10 · El plano y la proyección de los puntos**
      RF-29, RF-30
      El plano de las dos primeras componentes de `PCA3`, dibujado dentro de la nube, y
      la caída de cada punto sobre él.
      **Hecho cuando:** al girar la figura hasta ver el plano de canto, las proyecciones
      quedan alineadas sobre él.

      **Resultado.** Verificado por barrido de ángulos, no a ojo: en yaw 0,72 / pitch
      −0,67 el plano se ve de canto y las 183 sombras caen en una recta con **0,061 px**
      de desviación máxima. Si el plano fuera otro, o la proyección estuviera mal
      centrada, no existiría ningún ángulo así.

      La trampa que había que evitar: la proyección se calcula sobre los z-scores, cuyo
      origen es la media, y solo después se pasa a coordenadas de dibujo. El centro de
      la nube no es el centro de la caja que la contiene, y confundirlos inclina el
      plano sin que nada parezca roto.

      Se dibuja la sombra de los 183 países pero solo una línea de caída de cada ocho:
      183 líneas convierten el plano en una estera gris y tapan lo que explican.

- [x] **T11 · Los vectores de variables y sus proyecciones**
      RF-31, RF-32
      Un vector por indicador desde el centro de la nube, y su sombra sobre el plano.
      **Hecho cuando:** los tres vectores salen del mismo origen y cada uno tiene su
      proyección dibujada sobre el plano.

      **Resultado.** Tres flechas y tres sombras, las seis desde el mismo origen —el
      centro de la nube—, cada una rotulada con su indicador. Comprobado además que en
      el ángulo de canto las sombras de los vectores caen en la **misma recta** que las
      de los países (0,061 px): se proyectan sobre el mismo plano, no sobre uno paralelo.

      Las flechas van a longitud fija: lo que se lee aquí es hacia dónde apunta cada
      variable y cuánto de ella sobrevive en el plano —la longitud de la sombra, no la
      de la flecha—, que es justo lo que el círculo del bloque 3 formaliza.

- [x] **T12 · Solidaridad al rotar, y la figura en pantalla pequeña**
      RF-33, RF-69, RF-70, RF-71, RF-72
      **Hecho cuando:** al girar, plano, proyecciones y vectores giran con la nube (nada
      queda fijo respecto a la pantalla); a 390 px no hay scroll horizontal; «Ampliar»
      abre, Esc cierra y el foco vuelve al botón.

      **Resultado.** Girando de (0,72 · 0,30) a (1,35 · −0,15), **ningún** elemento de la
      escena se queda quieto: puntos, sombras, sombras de vector, el polígono del plano y
      los topes de eje se mueven todos. Lo único fijo es la leyenda, que es de pantalla.

      «Ampliar» abre el diálogo, Esc lo cierra y el foco vuelve al botón — comprobado en
      Chrome: `document.activeElement` es el botón `.zoom`.

      **Límite de la comprobación:** Chrome en macOS no permite ventanas de menos de
      500 px, así que los 390 px exactos no se pudieron reproducir aquí. A 500 px no hay
      scroll horizontal, y lo que lo garantiza a cualquier ancho es
      `.diagram svg{width:100%;height:auto}`: el SVG escala por su `viewBox`, igual que
      en las cuatro sesiones anteriores. Los 390 px reales quedan para T33.

---

## Fase 3 · Entrada · 0–35

- [x] **T13 · `figures/intro.js`: las tres fórmulas**
      RF-7, RF-8, RF-9
      Varianza, covarianza y Pearson en una figura, con `aria-label` que las describe en
      palabras.
      **Hecho cuando:** las tres se leen completas a 390 px tras pulsar «Ampliar».

      **Resultado.** Varianza, covarianza y Pearson, con las dos flechas que las encadenan
      —la covarianza consigo misma es la varianza; dividida por las desviaciones típicas
      es la correlación—. Sin ellas la entrada son tres definiciones; con ellas, una.

      **El primer intento salió mal de una forma instructiva:** colocando cada glifo en
      una coordenada fija, las barras de la media cayeron sobre la `xᵢ` en vez de sobre
      la media. Se veía deliberado, que es la peor manera de estar equivocado en una
      pared. Ahora hay un compositor de doce líneas: una fila es una lista de piezas y el
      cursor avanza, así que una barra queda sobre su letra por construcción.

- [x] **T14 · `figures/intro.js`: la dispersión donde se lee la correlación**
      RF-15
      Esperanza de vida contra fertilidad, con su coeficiente rotulado.
      **Hecho cuando:** el valor de r rotulado coincide con el que emite `check_pca.py`
      para ese par.

      **Resultado.** r = −0,77 rotulado sobre la nube, y el número **sale de `CORR`** en
      el archivo generado, no del teclado: escribir −0,77 aquí funcionaría hasta el día
      en que cambien los datos, y entonces sería una cifra proyectada que ya no pertenece
      a los puntos que tiene debajo. Comprobado que coincide con `CORR[vida][fertilidad]`.

- [x] **T15 · `blocks/Intro.jsx`**
      RF-4, RF-10, RF-11, RF-12, RF-13, RF-14, RF-16, RF-58, RF-60, RF-61, RF-63
      Gancho, los cuatro indicadores con qué mide cada uno, la cadena varianza →
      covarianza → correlación, sin unidades y acotada, el nombre «diagrama de
      dispersión» sin construirlo, el año y el crédito de la fuente.
      **Hecho cuando:** los once requisitos se localizan uno a uno en la pantalla del
      bloque, lista en mano.

      **Resultado.** Los once localizados uno a uno. En pantalla: 4 tarjetas de indicador
      con qué mide cada uno, 2 figuras, el año 2015, los 183 países y la licencia
      CC BY 4.0; sin scroll horizontal.

      La desviación típica de la esperanza de vida se interpola desde `ESTAD`, así que el
      número que ilustra «la desviación típica es la raíz de la varianza» es el de los
      datos reales y no un ejemplo inventado.

---

## Fase 4 · Bloque 1 · 35–75

- [x] **T16 · `figures/block1.js`: barras y circular**
      RF-21
      **Hecho cuando:** ambas figuras usan datos de `paises.js`, sin números escritos a
      mano.

      **Resultado.** Barras: esperanza de vida media por región (África 63,5 · Asia 72,7 ·
      América 74,6 · Europa 78,2), contrastadas contra un cálculo independiente. Circular:
      reparto de los 183 países, suma 100,0 %. Las cuatro cifras del circular van al lado
      en cifras, que es la lección: cuatro ángulos no se ordenan a ojo, cuatro longitudes
      sí.

- [x] **T17 · `figures/block1.js`: caja e histograma con dos anchos**
      RF-20, RF-21
      El mismo PIB per cápita con dos anchos de intervalo, lado a lado: la elección se ve
      como decisión (caso límite 8).
      **Hecho cuando:** los dos histogramas tienen los mismos datos y distinta forma, y
      la caja rotula mediana, cuartiles y bigotes.

      **Resultado.** Cajas de fertilidad por región con medianas 4,55 · 2,40 · 2,15 · 1,55,
      verificadas aparte; atípicos en rojo y la anatomía rotulada una vez sobre la última
      caja. Cuantil interpolado, el mismo que usó la sesión 4: cambiar de método aquí
      movería una mediana que la clase ya escribió.

      Histograma: el mismo PIB con intervalos de 2 500 (54 barras) y de 20 000 (7). El
      pie lo dice sin rodeos: el ancho no viene con los datos, lo eliges tú.

      **Corregido después, con la sesión en pantalla:** la anatomía se anotaba sobre la
      última caja real, y Europa resultó ser justo el grupo cuyos cinco números caben en
      un hijo de diferencia — los cinco rótulos se apilaron en una línea y se salían del
      lienzo. Ahora es una **caja de referencia aparte, a su propia escala**. Una leyenda
      que solo funciona cuando los datos están repartidos no es una leyenda.

- [x] **T18 · `figures/block1.js`: la dispersión del bloque**
      RF-21
      **Hecho cuando:** la figura existe y retoma explícitamente la de la entrada.

      **Resultado.** PIB per cápita contra esperanza de vida, rotulada «el mismo gráfico
      de la entrada, con otras dos variables». Colombia va señalada con sus dos guías
      hasta los ejes y sus cifras leídas del archivo (12760 dólares · 75.8 años): así la
      construcción se ve entera, de la fila de la tabla al punto.

- [x] **T19 · `blocks/Block1.jsx`**
      RF-17, RF-18, RF-19, RF-20, RF-21, RF-22, RF-60
      Cinco fichas con la misma estructura —dato que admite, pregunta que responde, cómo
      se construye, ejemplo— y, al cierre, la nube 3D.
      **Hecho cuando:** las cinco fichas tienen las cuatro casillas rellenas, ninguna
      vacía, y la nube se gira desde este bloque.

      **Resultado.** Cinco fichas con la misma estructura —dato, pregunta, construcción,
      ejemplo—, seis figuras y la nube rotable al final. La repetición es deliberada:
      comparar cinco gráficos solo funciona si se describen igual.

      Dos construcciones adelantan el cierre sin nombrarlo: la base cero de las barras y
      el ancho del intervalo del histograma. Y el circular lleva su punto débil escrito
      en la propia ficha, que por eso muestra las cifras al lado.

---

## Fase 5 · Bloque 2 · 83–120

- [x] **T20 · `figures/block2.js`: la misma nube, antes y después**
      RF-25
      **Hecho cuando:** las dos mitades son reconociblemente la misma nube.

      **Resultado.** 184 puntos a cada lado —los 183 países más Colombia destacada—, los
      mismos colores de región y Colombia rotulada en las dos mitades. Eso último no es
      adorno: «la misma nube» es una afirmación que la figura tiene que sostener, o se
      lee como dos dibujos sin relación con una flecha en medio.

- [x] **T21 · `figures/block2.js`: la varianza explicada**
      RF-26
      **Hecho cuando:** los porcentajes dibujados son los de `PCA3` en `paises.js`, no
      valores escritos a mano.

      **Resultado.** 75,74 · 17,57 · 6,69 leídos de `PCA3`, con el acumulado bajo cada
      barra (75,7 → 93,3 → 100,0). El titular dice lo único que importa después de
      proyectar: las dos primeras conservan el 93,3 % y la tercera es lo que se pierde.

- [x] **T22 · `blocks/Block2.jsx`**
      RF-23, RF-24, RF-27, RF-28, RF-34, RF-35, RF-60
      La dirección que más estira; matriz de covarianza, autovector y autovalor
      nombrados sin desarrollar; la componente como combinación; la figura rotable
      completa; y el cierre: con una cuarta variable ya no hay nube que dibujar.
      **Hecho cuando:** los siete requisitos se localizan en pantalla, y el paso a la
      maldición de la dimensionalidad enlaza con la cuarta variable.

      **Resultado.** Los siete localizados. El enlace queda explícito: hasta aquí tres
      indicadores porque tres caben en una escena que se puede girar, y la cuarta —la
      mortalidad infantil— no tiene eje donde ir. De ahí la maldición, y de ahí que el PCA
      deje de ser un truco de dibujo: si dos componentes conservan el 93,3 % de lo que
      tenían tres variables, quizá conserven casi todo lo que tienen cuatro.

      **Dos arreglos vistos en pantalla, no en el markup:** los rótulos de los vectores
      caían dentro de la nube y se leían a través de 183 puntos —ahora van más allá de la
      punta y con su propio fondo—, y ejes y vectores nombraban lo mismo, así que la
      escena parecía tener dos objetos por variable. Con vectores, los rótulos de eje ya
      no se dibujan.

---

## Fase 6 · Bloque 3 · 128–166

- [x] **T23 · `figures/block3.js`: la tabla y su transpuesta**
      RF-36
      Recorte que quepa proyectado sin dejar de leerse como la misma tabla girada (caso
      límite 12).
      **Hecho cuando:** las dos se ven a la vez a 390 px sin scroll horizontal, y se
      reconoce que la segunda es la primera girada.

      **Resultado (caso límite 12 resuelto).** Las dos van recortadas a 6 países, y el
      recorte no es alfabético sino repartido por el recorrido del PIB: una muestra que
      fuera toda África enseñaría lo que no es. Lo que sobrevive al corte es que es la
      misma tabla — comprobado que los 24 valores de una mitad son el mismo multiconjunto
      que los 24 de la otra —, y una variable va teñida en ambas para que el ojo siga una
      columna convirtiéndose en fila.

- [x] **T24 · `figures/block3.js`: el círculo de variables**
      RF-41, RF-46

      **Aviso de T3.** Las cuatro flechas son largas (0,94 a 0,99), así que el plano
      representa bien las cuatro variables. Pero el coseno exagera: en vida–fertilidad
      da −0,96 cuando la correlación real es −0,77 (Δ 0,19). RF-42 dice «aproxima», y
      esa palabra hay que sostenerla en pantalla.
      Las cuatro cargas de `PCA4`, con el círculo unidad.
      **Hecho cuando:** las cuatro flechas salen de las cargas del archivo generado, y la
      diferencia de longitud entre ellas es visible.

      **Resultado.** 0,99 · 0,94 · 0,94 · 0,96, leídas de `PCA4` y todas dentro del
      círculo unidad. Las reglas de lectura van a la derecha, donde no pelean con el
      dibujo, y el pie dice que el plano representa bien a las cuatro — que es lo que hay
      que afirmar antes de que la figura siguiente se apoye en sus ángulos.

- [x] **T25 · `figures/block3.js`: los tres ángulos**
      RF-43, RF-44, RF-45

      **Aviso de T3: el ángulo recto no existe en estos datos.** Medidos sobre las cargas
      reales: fertilidad–mortalidad 3,4° (r = +0,85) sirve para RF-43, y vida–mortalidad
      166,6° (r = −0,87) sirve para RF-45, pero el par más cercano a 90° es PIB–vida a
      43,7°. Los cuatro indicadores miden desarrollo, así que ninguno es independiente de
      otro. RF-44 se dibuja como **caso ilustrativo** (acordado): un esquema de dos flechas a
      90°, separado del círculo real y rotulado como tal, para que nadie lo lea como si
      saliera de estos países. El círculo de T24 sigue mostrando lo que hay.
      **Hecho cuando:** las tres parejas están dibujadas con su ángulo y su correlación
      rotulada: cerca de +1, de 0 y de −1.

      **Resultado.** 3° con r = 0,84 (hijos y mortalidad), el recto **ilustrativo** con
      r ≈ 0, y 167° con r = −0,87 (vida y mortalidad). Los dos reales salen de las cargas;
      el recto lleva su propia caja diciendo que no sale de estos países y por qué: los
      cuatro indicadores miden desarrollo y ninguno es independiente de otro. Fingirlo con
      una pareja que no lo tiene habría sido más cómodo y menos cierto.

- [x] **T26 · `blocks/Block3.jsx`**
      RF-37, RF-38, RF-39, RF-40, RF-42, RF-47, RF-60
      Transponer convierte cada variable en registro; el registro es un vector; el ángulo
      entre vectores es el del círculo; individuos y variables son dos vistas; el coseno
      es la correlación, remitiendo a la fórmula de la entrada.
      **Hecho cuando:** la remisión a la entrada es explícita y nombra la fórmula, no
      solo la idea.

      **Resultado.** El bloque cita la fórmula entera —r = cov(x, y) / (sₓ · s_y)— y
      explica por qué dividir por las desviaciones típicas *es* normalizar los vectores,
      y por qué el producto de dos unitarios es el coseno. Ahí se cierra el círculo que
      abrió la entrada.

      Sostiene además la palabra «aproxima» con el número que la incomoda: vida y
      fertilidad dan coseno −0,96 en el dibujo y correlación real −0,77. El dibujo
      exagera, y para citar una cifra se va a la tabla.

      **Y un tercer solape encontrado en pantalla:** las dos flechas que están a 3° se
      pisaban los rótulos, en el círculo y en los tres ángulos. Ahora se separan en
      vertical con una guía punteada. Escribí un verificador de solapes para las trece
      figuras y encontró uno más que se me había pasado, entre rótulos de dos círculos
      distintos que se extendían hacia el mismo hueco.

---

## Fase 7 · Cierre · 166–180

- [x] **T27 · `figures/closing.js`: el 3D que sobra**
      RF-48
      El mismo dato en tres dimensiones y en dos.
      **Hecho cuando:** las dos versiones muestran el mismo dato y la de dos ejes se lee
      mejor.

- [x] **T28 · `figures/closing.js`: los otros tres gráficos basura**
      RF-50, RF-51, RF-52
      Sin etiquetas en los ejes; sin ejes; sobrecargado hasta impedir la lectura.
      **Hecho cuando:** los tres existen y cada uno falla por un motivo distinto.

- [x] **T29 · `blocks/Closing.jsx`**
      RF-49, RF-53, RF-54, RF-55
      Qué se pierde con la tercera dimensión; qué impide entender cada gráfico basura;
      ticket de salida; ninguna tarea para la sesión 6.
      **Hecho cuando:** cada uno de los cuatro gráficos basura lleva su frase de qué
      impide entender, y no hay ningún bloque de tarea en el panel.

      **Resultado.** Los cuatro con su frase, un solo `<Task>` —el ticket— y ninguna tarea.
      El cierre nombra el patrón que comparten: o le **quitan** al lector lo que necesita
      (etiquetas, ejes, la base en cero) o le **añaden** lo que no pidió (una dimensión,
      todos los nombres). Y ninguno se arregla con mejores datos.

      El caso límite 9 queda resuelto en el propio texto: el 3D del bloque 2 se gira y por
      eso enseña de dónde sale una proyección; el del cierre es una foto fija de algo que
      cabía en dos ejes, y lo que cuesta son exactamente los cuatro números.

---

## Fase 8 · El material ya publicado

- [x] **T30 · Quitar la caja de la sesión 2**
      RF-64, RF-65, RF-66
      Retirar «SESIÓN 5 · se grafica» de `s02/figures/block3.js`, conservar los otros
      tres destinos y dejar el comentario que explica la divergencia con el original.
      **Hecho cuando:** la figura muestra tres flechas; `check_content.py` reporta como
      faltantes solo las palabras de esa caja y ninguna otra.

      **Resultado.** Quedan los tres destinos ciertos (3 se limpia, 4 se describe, 7 se
      modela), centrados exactamente donde estaban los cuatro —centro vertical 183, el
      mismo de antes—, y el `aria-label` ya no nombra la sesión 5. El comentario de RF-66
      queda junto a la figura, diciendo que esta es la única divergencia esperada con el
      original y que cualquier otra que el verificador reporte es una regresión real.

      **La mitad del «hecho cuando» no se pudo comprobar.** `check_content.py` necesita el
      curso original en `../fundamentos_ciencia_de_datos/sesiones` y ese directorio no
      existe en esta máquina: el script muere con `FileNotFoundError` antes de comparar
      nada. No es que pase o falle, es que no puede ejecutarse. Queda pendiente de correr
      donde esté el original, y es lo primero que hay que mirar allí.

- [x] **T31 · Reescribir el cierre de la sesión 4**
      RF-67, RF-68
      Que no prometa graficar los números de esa sesión, y que anuncie lo que la 5 sí
      trata.
      **Hecho cuando:** la frase final de «Lo que queda» no promete la tabla del salón, y
      `check_content.py` no añade ninguna diferencia nueva (la sesión 4 no está en el
      original, así que no debería moverse).

      **Resultado.** Ya no dice «la sesión que viene los volvemos dibujo». Dice que se
      cambia de material y por qué —para aprender a elegir un gráfico hacen falta más de
      veintitrés filas—, y anuncia lo que la 5 sí hace. La deuda de Simpson con la
      sesión 6 se queda donde estaba. La sesión 4 no la compara `check_content.py`, que en
      esta máquina tampoco puede ejecutarse (ver T30).

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
