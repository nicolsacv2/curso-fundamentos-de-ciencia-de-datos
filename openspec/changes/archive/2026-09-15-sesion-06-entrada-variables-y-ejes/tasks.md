## 1. Publicar las cuatro columnas

- [x] 1.1 En `scripts/extract_salon.py`, mover `S` (peso, `num`), `T` (estatura, `num`) y
      `U` (tallaCamiseta, `ord`) de `EXCLUIDAS` a `COLUMNAS`, con su rótulo corto en
      español. Verificar: el script corre y su resumen imprime 30 columnas y 4 exclusiones.
- [x] 1.2 Añadir `DERIVADAS` con `edad`: de qué columna sale (`C`), la regla
      (`2026 − año`), el año de referencia como constante con el motivo de fijarlo, y por
      qué se deriva en vez de publicar el año. Quitar `C` de `EXCLUIDAS` y `D` (grupo de
      edad) también, pero **sin publicar ninguna de las dos**: `D` pasa a `EXCLUIDAS` con
      el motivo nuevo («dice lo mismo que la edad con menos detalle»). Verificar: `COLS`
      trae `edad` y no trae ni el año ni el grupo de edad.
- [x] 1.3 Declarar el orden de los niveles de `tallaCamiseta` (`S · M · L · XL`) junto a la
      columna. Verificar: el orden declarado no es el alfabético y el generado lo conserva.
- [x] 1.4 Actualizar los `assert` del script: 31 columnas publicadas, 3 excluidas,
      `publicadas + excluidas + derivadas_de == 34`, y uno nuevo que exija que toda columna
      no declarada en `DERIVADAS` coincida carácter por carácter con el `.xlsx`. Verificar:
      el script falla si se toca a mano cualquiera de esas cifras.
- [x] 1.5 Regenerar `src/data/salon.js` y comprobar que `CUANTITATIVAS` trae 13,
      `ORDINALES` 2 y `CATEGORICAS` 16.
- [x] 1.6 Reescribir el docstring de `extract_salon.py` y `src/data/PROCEDENCIA.txt`: hoy
      afirman que el peso, la estatura, el año de nacimiento y la talla **no** se publican.
      Dejar escrito que se decidió publicarlas y qué se aceptó a cambio. Verificar: ninguna
      de las dos afirma nada que el generado contradiga.

## 2. La cadena de limpieza sobre la tabla nueva

- [x] 2.1 En `scripts/clean_salon.py`, eximir del agrupamiento de niveles raros el nivel
      más alto y el más bajo de una variable ordinal, con el motivo en comentario.
      Verificar: `XL` sigue siendo nivel propio en `RAROS.tallaCamiseta` pese a tener una
      sola persona.
- [x] 2.2 Añadir la marcación de nulos con `AddMissingIndicator`, aplicada sobre la tabla
      en la que el atípico **ya** es nulo, de modo que marque toda celda inventada. Dejar
      las marcas en una estructura propia del generado, no mezcladas con las columnas de
      `TABLA`. Verificar: para cada variable, las filas marcadas coinciden exactamente con
      `inventadas`, y `feature-engine` sigue en la versión fijada sin tocar
      `scripts/requirements.txt`.
- [x] 2.3 Comprobar que ninguna marca entra a `PCA.variables`. Verificar: el recuento de
      variables del análisis no cambia por haber añadido las marcas.
- [x] 2.4 Regenerar `src/data/salon_limpio.js` y comprobar que las tres cuantitativas
      nuevas pasaron por describir, caja e imputación, y que `tallaCamiseta` pasó por el
      camino ordinal —sin caja y fuera del PCA— sin ningún caso especial por nombre.
- [x] 2.5 Publicar la tabla limpia completa desde `scripts/clean_salon.py`: 27 filas × 31
      columnas en el orden de `COLS`, con el texto estandarizado y los niveles agrupados,
      las cuantitativas imputadas, y `pantalla`, `codigo` y `libro` **tal como llegaron, sin
      imputar**. Declarar por columna en qué acabó: limpia, descartada o no analizable.
      Verificar: la tabla tiene tantas filas como el conjunto y tantas columnas como `COLS`,
      y las tres no tratadas conservan sus celdas vacías.
- [x] 2.6 Correr `scripts/check_salon.py` y `scripts/check_pca.py` y dejar anotadas las
      cifras nuevas que la entrada interpreta: porcentaje de las dos primeras componentes,
      atípicos por variable a 1,5 y a 3, y celdas imputadas por columna.
- [x] 2.7 Regenerar `src/data/salon_limpio.xlsx` con `scripts/export_xlsx.py`, con la
      derivación de la edad, la exención de los extremos ordinales y la marcación de nulos
      como filas propias de la bitácora, y con las columnas de marca agrupadas al final en
      vez de intercaladas. Verificar: cada una lleva su motivo y volver a generar el archivo da el
      mismo archivo.

- [x] 2.8 Eliminar de `scripts/clean_salon.py` la tabla original que se construye, se copia
      y no se vuelve a usar. Mientras exista, un DataFrame con los atípicos dentro está a un
      nombre de distancia del imputador. Verificar: el script corre, los tres archivos salen
      idénticos, y no queda ninguna tabla con atípicos viva en ese ámbito.
- [x] 2.9 Corregir en `scripts/check_salon.py` la comprobación de los valores imputados:
      compara contra todos los observados —atípicos incluidos—, así que un atípico sorteado
      la pasaría. Tiene que comparar contra los que quedaron tras marcar. Verificar: la
      comprobación falla si se ajusta el imputador sobre la tabla sin depurar.

## 3. La entrada, contra las cifras nuevas

- [x] 3.1 Releer `src/sessions/s06/blocks/Intro.jsx` de arriba abajo contra lo anotado en
      2.3 y corregir toda frase que las cifras nuevas dejen falsa — en particular «el
      resultado es flojo», «más de la mitad no cabe en este dibujo» y la comparación con el
      92 % de la sesión 5. Verificar: ninguna afirmación del panel contradice el dato que
      interpola a su lado.
- [x] 3.2 Comprobar que ninguna cifra de columnas quedó escrita a mano: los recuentos salen
      de `COLS`, `CUANTITATIVAS`, `ORDINALES` y `CATEGORICAS`. Verificar: buscar números
      literales en el panel no encuentra ninguno que el conjunto ya tenga.
- [x] 3.3 Añadir al paso 5 el párrafo del peso: la caja marca **una sola celda** —95 kg,
      contra un bigote que llega a 92,8— y la cadena la borra y la reemplaza por un sorteo.
      Enlazarlo con lo que el paso 3 ya dice (la regla mide distancia, no verdad), porque
      95 kg no es un error de captura como podrían serlo los 960 minutos: es el segundo caso
      del mismo argumento y el que más incomoda. Verificar: el párrafo cita la cifra desde
      los datos, no escrita a mano.
- [x] 3.4 Añadir al paso 3b el tratamiento de `tallaCamiseta` como segunda ordinal —niveles
      que son etiquetas y no números— y la exención de los extremos, explicada con el mismo
      trato que el 1,5 de la caja: una regla que puso alguien.
- [x] 3.5 Si las dos primeras componentes suben, reescribir el cierre del paso 7: la
      lección pasa a ser que el método resume cuando las variables se dan la mano, con
      `peso` y `estatura` como el par que sí y el resto como el que no.
- [x] 3.6 Revisar la `DataTable` de la entrada con 31 columnas: ajustar `pick` y `wrap` si
      hace falta, sin recortar el conjunto.
- [x] 3.7 Decir en el paso 5 que la tabla conserva la marca de qué celdas se inventaron, que
      esa marca viaja con el archivo que se entrega, y que no entra al análisis porque no es
      una cantidad.
- [x] 3.8 Añadir a `DataTable` (`src/components/content/index.jsx`) una prop **opcional**
      para señalar columnas por su destino. Verificar: las sesiones 3 y 4, que no la pasan,
      renderizan exactamente igual que antes.
- [x] 3.9 Insertar en `Intro.jsx`, entre el paso 6 y el paso 7, la tabla limpia completa: las
      31 columnas, las descartadas y no analizables señaladas por su destino, y las celdas
      inventadas marcadas vía `mark` con las coordenadas `variable:fila` que salen de las
      marcas de nulo. Verificar: las celdas señaladas coinciden una a una con esas marcas.
- [x] 3.10 Escribir el párrafo y el pie que acompañan a esa tabla: qué se está viendo, cuántas
      celdas se inventaron, y que lo que viene después la va a usar como si todo fuera real.
      Verificar: la cifra sale de los datos, no escrita a mano.

- [x] 3.11 (añadida durante la ejecución, a petición) Rellenar también las columnas no
      numéricas con `RandomSampleImputer` y marcarlas con `AddMissingIndicator`, sobre la
      columna ya agrupada y con el hueco restituido a nulo. Verificar: solo se rellenan
      huecos —no hay regla de la caja ahí—, cada valor sorteado es un nivel que la columna
      tiene, y no queda ningún hueco fuera de las columnas descartadas.

- [x] 3.12 Quitar el `pick` de la tabla con la que abre la entrada para que muestre las
      columnas publicadas enteras, y reescribir su pie: el argumento de que la mayoría no son
      números se enuncia sobre la tabla completa, no se consigue escondiendo el resto.
      Verificar: `edad`, `peso` y `estatura` se ven ahí, y la tabla de apertura y la del
      paso 6b llevan las mismas columnas en el mismo orden.

## 4. El texto se ve aplicado a todas las columnas

- [x] 4.1 En `src/sessions/s06/figures/intro.js`, añadir a `textoPasos` la franja de
      resumen: una línea por columna de texto, leída de `TEXTO`, con su «de N categorías a
      M», `municipio` destacado y las que no se movieron marcadas como tales. Verificar:
      aparecen las 17 y ninguna falta.
- [x] 4.2 Ampliar el `viewBox` de `textoPasos` para que la franja quepa entera. Verificar:
      la última línea se ve completa, no recortada.
- [x] 4.3 Añadir al paso 1 de `Intro.jsx` la frase que dice que los cuatro tratamientos
      corren sobre todas las columnas de texto, no solo sobre `municipio`.

## 5. Los ejes

- [x] 5.1 Añadir a `src/sessions/s06/figures/shared.js` el helper de rótulo de eje —rótulo
      al final del eje, con su unidad y su alto reservado— con el prefijo `ar-s6-` en
      cualquier id que use. Verificar: una figura lo usa y el rótulo no pisa el dibujo.
- [x] 5.2 `sedimento`: poner las barras en la misma escala `[0, 100]` que la acumulada,
      rotular el eje («% de varianza») y la base («componente»), y corregir el comentario
      del código que hoy afirma que comparten eje. Verificar: barras y línea se leen contra
      la misma escala rotulada.
- [x] 5.3 `noNumericas`: rotular el eje horizontal como las personas que respondieron, con
      su total.
- [x] 5.4 `cajas`: rotular la unidad de cada fila y dejar escrito que las filas no
      comparten escala.
- [x] 5.5 `niveles`: rotular el alto (personas) y la base (los niveles de la escala).
- [x] 5.6 `relleno`: rotular el eje x (minutos) y el eje y (personas por tramo).
- [x] 5.7 `descarte`: dejar escrito que son 27 celdas, una por persona, en el orden de la
      tabla.
- [x] 5.8 `textoPasos`: dejar escrito que lo que se cuenta son categorías distintas, no
      filas.
- [x] 5.9 `plano`: rotular los ejes del círculo de correlaciones de la derecha, que hoy no
      los lleva —los del plano de la izquierda ya están.
- [x] 5.10 Ampliar el `viewBox` de cada figura tocada para que su rótulo nuevo quepa.
      Verificar figura por figura que nada queda cortado.

- [x] 5.11 `sedimento`, dos defectos de lo que quedó en 5.2. (a) El rótulo «dos componentes»
      se ancla al centro de CP2 pero se dibuja hacia la derecha, así que su texto cruza tres
      columnas y parece colgar del punto de CP3, que vale otro porcentaje: llevarlo a la
      izquierda del punto de CP2 y anclarlo al final del texto. (b) La última línea de prosa
      mide unos 1167 px dentro de un `viewBox` de 980 y está cortada: partirla con `wrap()`.
      Verificar: el rótulo toca el segundo punto y ninguna línea llega al borde.
- [x] 5.12 Añadir a la comprobación de recortes la anchura del texto compuesto, no solo las
      coordenadas de los elementos: en monoespaciada, caracteres × ~0,6 em contra el borde
      del `viewBox`. Verificar: pasada sobre las once figuras, no queda ningún texto cortado.

## 6. Las tres matrices

- [x] 6.1 En `clean_salon.py`, calcular y publicar los dos criterios de selección con la
      lista que producen: las cualitativas diagnosticadas «sanas» en el paso 1b, y las ocho
      cuantitativas de relación más fuerte con cualquier otra. Verificar: las listas salen
      del cálculo y el texto en pantalla las interpola, de modo que no puedan divergir.
- [x] 6.2 Publicar desde el script los datos de los tres paneles: binados de histograma por
      cuantitativa, cuartiles de caja por nivel de cada par cuantitativa × cualitativa, y
      recuentos por par de niveles de cada par cualitativa × cualitativa. Verificar: nada se
      calcula al abrir la página.
- [x] 6.3 Añadir a `s06/figures/shared.js` los tres helpers de panel —dispersión, caja por
      nivel, mosaico condicional— con el prefijo `ar-s6-` en cualquier id. Verificar: cada uno
      se dibuja aislado antes de montarlo sesenta y cuatro veces.
- [x] 6.4 Matriz de dispersión entre las ocho cuantitativas, con el histograma de cada una
      en la diagonal. Rótulos de variable en el borde inferior e izquierdo, y rótulo de
      unidad propio en la diagonal, donde el eje vertical significa personas y no la segunda
      variable.
- [x] 6.5 Matriz de cajas de cada cuantitativa contra cada cualitativa: una caja por nivel.
      Sin diagonal, porque enfrenta dos conjuntos distintos de variables. Verificar con los
      datos delante si algún nivel deja una caja construida sobre dos o tres respuestas, y
      decir en pantalla qué significa eso.
- [x] 6.6 Matriz de **mosaico** entre las ocho cualitativas: barras apiladas al 100 % —el
      reparto condicional de la columna dentro de cada nivel de la fila—, con el ancho de
      cada barra proporcional a cuánta gente hay en ese nivel, y un hueco de 2 px entre
      segmentos. En la diagonal, la variable sola, que hace de leyenda. Paleta de seis tonos
      ya validada contra `#131D2B` (ver diseño, decisión 20). Verificar: cada barra suma el
      100 % de su nivel, un nivel de una persona se ve fino y uno de catorce grueso, y la
      diagonal usa los mismos colores en el mismo orden que las celdas de su columna.
      (Estaba hecha como barras agrupadas; se rehace.)
- [x] 6.10 Ajustar `panelBarras` en `s06/figures/shared.js` y el pie de la figura, que hoy
      dicen «agrupadas, no apiladas». Verificar: ni el código ni la pantalla siguen
      afirmando lo contrario de lo que se dibuja.
- [x] 6.7 Insertar las tres en `Intro.jsx` entre la tabla limpia y el paso del PCA, con el
      texto que enuncia el criterio de selección de cada una y qué se está mirando en cada
      combinación de tipos.
- [x] 6.8 Reescribir el cierre del paso del PCA y el «¿qué falta?» para que remitan a lo que
      la clase acaba de ver, en vez de afirmarlo. Nombrar que `minutos` quedó fuera del
      subconjunto por no relacionarse con nada, que es justo lo que la entrada sostiene.
- [x] 6.9 Repartir de nuevo las franjas de minutos de los cinco bloques en
      `src/sessions/s06/meta.js`. Verificar: no se solapan, ninguna pasa del minuto 180, y la
      entrada sigue siendo la franja más larga del curso.

- [x] 6.11 Declarar en `scripts/extract_salon.py` el nombre de pantalla de las columnas cuya
      clave no es el nombre de la cosa —`erre`→R, `js`→JavaScript, `python`→Python,
      `julia`→Julia— y emitirlo al generado. Verificar: las demás columnas no declaran nada,
      y el `assert` que prohíbe una clave con forma de letra de hoja sigue en pie y pasando.
- [x] 6.12 Resolver el nombre con **una sola** función compartida y usarla en las figuras, en
      las tablas y en `scripts/export_xlsx.py`. Verificar: buscar `erre` en lo que se ve no
      lo encuentra en ningún sitio, y la cabecera del `.xlsx` entregado dice lo mismo que la
      pantalla.

## 7. Comprobación final

- [x] 7.1 `pnpm build` compila.
- [x] 7.2 Comprobado a 390 px de verdad. La ventana no se deja estrechar, así que se cargó
      la entrada en un `iframe` de 390 px, que tiene su propio viewport: `innerWidth` da 390
      y la media query `max-width: 400px` se activa. Resultado: la página **no desplaza
      horizontalmente**, las 11 figuras caben (332 px, escala 0,34) y los únicos cuatro
      elementos más anchos que el viewport son tablas dentro de un marco con `overflow:auto`.
      Las tres matrices quedan a 31 px por panel y sus rótulos a 3,2 px —ilegibles en línea—,
      pero **Ampliar las rescata**: en el diálogo el SVG se dibuja a 980 px, los rótulos
      recuperan sus 9,5 px y el cuerpo desplaza para recorrerla. Es el mismo mecanismo que el
      componente ya documenta para la tabla del salón.
      La entrada de la sesión 6 se ve entera a 390 px de ancho: ninguna figura produce
      scroll horizontal y ningún rótulo de eje queda cortado. Las tres matrices son el caso
      difícil: comprobar que a ese ancho siguen diciendo algo y no se vuelven una mancha.
- [x] 7.3 En cada figura tocada y en las dos tablas, **Ampliar** abre el diálogo, Esc lo
      cierra y el foco vuelve al botón. Comprobar además si **Ampliar** sigue aportando algo
      sobre la tabla limpia a 31 columnas, y dejarlo anotado si no.
- [x] 7.4 Comprobar que la entrada no queda con dos paredes de números seguidas: la tabla de
      apertura y la limpia del final tienen que leerse como las dos puntas de la cadena, no
      como la misma tabla dos veces.
- [x] 7.5 Regenerar los tres archivos de datos por segunda vez y comprobar que salen
      idénticos: la semilla y el año de referencia siguen fijos.
- [x] 7.6 Desplegar en localhost con `pnpm preview` y compartir la URL para revisión
      manual de la entrada completa.
