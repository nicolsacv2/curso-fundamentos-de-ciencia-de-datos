## Why

La entrada de la sesión 6 es la sesión: sesenta minutos que recorren la cadena de
limpieza entera antes del primer plano factorial. Seis cosas la dejan a medias.

La primera es que el formulario tiene **34 columnas y la entrada analiza 27**. Las siete
que faltan se excluyeron por reidentificación, con el motivo escrito columna por columna
en `scripts/extract_salon.py`. Cuatro de esas siete —el año de nacimiento, el peso, la
estatura y la talla de camiseta— son justo las que le faltan a la entrada para enseñar lo
que quiere enseñar: son las únicas variables del formulario que **se dan la mano entre
sí**, y el único caso limpio de una escala ordinal con etiquetas en vez de números.

La segunda es que el paso de estandarización del texto **dibuja `municipio` y se calla el
resto**. La clase sale creyendo que los cuatro tratamientos se aplicaron a una columna. Se
aplicaron a las dieciséis de texto, y `salon_limpio.js` ya guarda el recuento de las
dieciséis: el dato está calculado y nadie lo enseña.

La tercera es que **las figuras no rotulan sus ejes**. En la franja de las variables no
numéricas, el eje horizontal son las 27 personas y eso no está escrito en ninguna parte;
en el gráfico de sedimentación, las barras y la línea acumulada se dibujan en **dos
escalas distintas** presentadas como si fueran una. Un curso que dedica una sesión entera
a que ninguna cifra quede sin justificar no puede proyectar gráficos que no dicen qué
miden.

La cuarta es que **la tabla imputada olvida lo que inventó**. La cadena rellena huecos y
atípicos con valores sorteados, y a partir de ahí, dentro de la columna, un valor inventado
es indistinguible de uno medido. La entrada lo dice en una tarjeta —qué filas y cuántas—,
pero el dato no viaja con la tabla: el archivo que se le entrega a la clase sale sin esa
memoria, y es justo lo que un curso que insiste en que imputar no recupera nada tendría que
conservar.

La quinta es que **la tabla limpia nunca se ve**. La entrada abre mostrando la tabla sucia,
recorre seis pasos que la transforman, y pasa directamente al PCA sin enseñar el resultado.
La clase ve el antes y ve el análisis, pero no ve la cosa que se pasó una hora
construyendo. Peor: los datos ni siquiera existen juntos —las cuantitativas imputadas están
en un sitio, las no numéricas ya agrupadas en otro, y tres columnas no tienen versión limpia
en ninguno—, así que nadie ha mirado nunca la tabla entera.

Y la sexta es que **la entrada afirma que las variables no se dan la mano sin haberlo
enseñado**. Todo el cierre del paso 7 se sostiene en que «cuántos cafés te tomas no tiene
por qué ir con cuántos viajes hiciste», pero eso se dice, no se ve: la clase tiene que
creerlo. Y lo mismo con lo que viene después — «¿qué falta?» pide mirar las columnas que el
PCA no pudo leer, sin haber mostrado nunca si esas columnas tienen algo dentro.

## What Changes

### 1 · Cuatro variables más, y el año de nacimiento convertido en edad

- El conjunto pasa a publicar **31 de las 34 columnas** del formulario, no 27. Entran:
  - **`edad`** (cuantitativa), **derivada** del año de nacimiento: `edad = 2026 − año`,
    donde 2026 es el año de captura declarado en `src/data/PROCEDENCIA.txt`. El año
    **no se publica crudo**; lo que se publica es la edad.
  - **`peso`** (cuantitativa, kilogramos) y **`estatura`** (cuantitativa, centímetros),
    tal como llegaron.
  - **`tallaCamiseta`** (**ordinal**, S · M · L · XL), tal como llegó.
- Las exclusiones bajan de siete a **tres**: la marca temporal, el grupo de edad
  —redundante ahora que se publica la edad— y el nombre exacto del programa de pregrado.
- El reparto que la entrada anuncia pasa de «27 columnas, 10 cantidades y 17 nombres y
  órdenes» a **«31 columnas, 13 cantidades y 18 nombres y órdenes»**. Ninguna de esas
  cifras está escrita a mano: todas se interpolan de `COLS`, `CUANTITATIVAS`, `ORDINALES`
  y `CATEGORICAS`, así que se mueven solas.
- La tabla con la que abre la entrada pasa a mostrar **todas las columnas publicadas**, no solo las
  que no son números. Hasta ahora la clase veía el peso, la edad y la estatura por primera
  vez cuando ya se les estaba dibujando una caja; presentar una variable a mitad de la
  cadena es presentarla mal. Además empareja esa tabla con la tabla limpia del paso 6b: la
  misma tabla, al principio y al final, que es lo que deja ver qué movió la hora entre las
  dos.
- Las cuatro nuevas entran en **toda** la cadena, no solo en la tabla: el diagnóstico de
  formas del paso 1b, la descripción del paso 2, las cajas del paso 3, la imputación del
  paso 5, la comparación del paso 6 y el PCA del paso 7 —según a cada una le corresponda
  por su tipo.
- **BREAKING (decisión de privacidad revertida).** `datos-del-salon` exige hoy, con un
  escenario explícito, que el peso, la estatura, el año de nacimiento, el grupo de edad y
  la talla de camiseta **no** estén entre las columnas publicadas. Este cambio revierte esa
  decisión para cuatro de ellas, con el sitio público y veintisiete personas en la tabla.
  Es una decisión del titular del curso, tomada a sabiendas, y queda registrada como tal en
  `extract_salon.py` y en `PROCEDENCIA.txt` —que hoy afirman lo contrario y pasarían a
  mentir si no se reescriben.

### 2 · La estandarización del texto se ve aplicada a todas las columnas de texto

- El paso 1 dice explícitamente que los cuatro tratamientos corren sobre **todas** las
  columnas de texto, no solo sobre `municipio`.
- La figura `textoPasos` gana una franja de resumen: **una línea por columna de texto** con
  su «de N categorías a M», leída de `TEXTO` —que ya la trae calculada para las dieciséis—,
  con `municipio` destacado como el caso que se camina paso a paso. Con el cambio 1 son
  **diecisiete** líneas.
- Las columnas en las que la estandarización **no cambió nada** se ven como tales. Que un
  tratamiento corra y no mueva nada también es un resultado, y hoy no se muestra.

### 3 · Todas las figuras de la entrada rotulan sus ejes

- Las ocho figuras de `src/sessions/s06/figures/intro.js` dicen qué mide cada eje y en qué
  unidad. Hoy solo `plano` lo hace.
- **BREAKING (corrección de una figura publicada).** En `sedimento`, las barras se escalan
  a `[0, max(%)]` y la línea acumulada a `[0, 100]`: son dos escalas distintas, y el
  comentario del código afirma que comparten eje. Rotular el eje destapa la contradicción,
  así que se arregla aquí. La figura cambiará de aspecto respecto de lo que ya se proyectó.

### 4 · Los nulos quedan marcados antes de taparse

- Antes de imputar, la cadena **marca** qué celdas van a rellenarse: una columna binaria
  por variable que tuviera celdas a rellenar, con el nombre de la variable y el sufijo
  `_na`.
- El indicador se pone **después** de convertir el atípico en nulo, así que marca **toda
  celda inventada**, venga de que nadie respondió o de que la regla de la caja descartó el
  valor. Es lo mismo que el análisis acabó viendo, y coincide con las celdas que la tabla
  de la entrada ya señala.
- Los indicadores **no entran al análisis de componentes principales**: no son cantidades.
  Se publican, se ven, y quedan disponibles para lo que venga después.
- Lo que esto gana: hoy, una vez imputada la tabla, un valor inventado y uno medido son
  indistinguibles dentro de la columna. Con el indicador, la tabla **se acuerda** de cuáles
  inventó, y esa memoria viaja con el archivo que se le entrega a la clase en vez de vivir
  solo en una tarjeta de la pantalla.

### 5 · La tabla limpia se ve entera, justo antes del PCA

- Entre el paso 6 (describir otra vez) y el paso 7 (el PCA) se muestra **la tabla completa
  ya limpia**: las 27 filas y las 31 columnas publicadas, con el texto estandarizado, los
  niveles poco frecuentes agrupados y los huecos rellenos.
- Entran **las 31**, incluidas las que la cadena dejó por el camino: `pantalla`
  (descartada), `codigo` y `libro` (declaradas no analizables). Aparecen **señaladas como
  tales y sin imputar**, para que la tabla sea también el resumen de lo que la entrada
  decidió: qué sobrevivió, qué se fundió en «raro» y qué quedó fuera.
- **Las celdas inventadas se señalan**, usando las marcas del punto 4. La clase ve la tabla
  limpia y, encima, exactamente qué partes de ella no las dijo nadie — justo antes de que el
  PCA la use como si todo fuera real.
- Esto obliga a **publicar la tabla limpia como tabla**: hoy sus datos viven repartidos
  entre las cuantitativas imputadas y los valores agrupados de cada no numérica, y tres
  columnas no tienen versión limpia en ninguna parte.

### 6 · Tres matrices que enseñan qué relaciones hay, antes de analizarlas

Entre la tabla limpia y el PCA, la entrada muestra las tres formas de mirar dos variables a
la vez, una por cada combinación de tipos:

- **Matriz de dispersión** entre cuantitativas, con el **histograma de cada variable en la
  diagonal**. Es la que el PCA sí sabe leer, y la que enseña por qué sale flojo: se ve que
  casi ninguna pareja forma nube.
- **Matriz de cajas** de cada cuantitativa contra cada cualitativa: un diagrama de caja por
  nivel, que es cómo se mira si una categoría separa una cantidad.
- **Matriz de mosaico** entre cualitativas: barras **apiladas al 100 %**, una por cada
  nivel de la variable de la fila, cuyos segmentos son el **reparto condicional** de la
  variable de la columna dentro de ese nivel. El **ancho** de cada barra es cuánta gente
  hay en ese nivel, así que un grupo de una persona se ve fino y uno de catorce, grueso.
  En la diagonal, la variable sola.

- **Cada matriz muestra ocho variables, no todas**, porque una matriz completa daría paneles
  de unos 70 px en los que se ve la textura pero no se lee nada. El criterio va escrito en
  pantalla y no es de gusto:
  - Las **cualitativas** son las que el paso 1b diagnosticó **«sanas»** —pocos niveles y
    repartidos—. Es el primer uso real de ese diagnóstico, que hoy se calcula y no sirve
    para nada más: una variable «casi todo único» daría veinte barras de altura uno, y una
    «dominada», un solo bloque.
  - Las **cuantitativas** son las ocho cuya relación más fuerte con cualquier otra es mayor.
    Así el argumento queda cerrado: si ni siquiera esas ocho forman nube, ninguna lo hace.
- Con esto, **«¿qué falta?» deja de ser una afirmación y pasa a ser una imagen**: dos de las
  tres matrices muestran estructura que el método de la sesión 5 no puede tocar, y son las
  que abren los bloques 1 y 2.
- La entrada crece, así que **las franjas de minutos de los cinco bloques se reparten de
  nuevo** dentro de las tres horas.

### 7 · Una variable se proyecta con el nombre que tiene

- Las figuras imprimen la **clave** de cada variable, no su rótulo largo, y eso es
  deliberado: el curso enseña a referirse a una columna por el nombre de su variable. El
  efecto colateral es que en la pared se lee **«erre»**, que parece una errata.
- La clave no puede ser `R`: `extract_salon.py` prohíbe con un `assert` que una columna se
  llame como una letra de hoja de cálculo, y **la columna `R` de la hoja es `balanceada`**.
  Una variable llamada `R` sería exactamente la ambigüedad que esa regla evita.
- Así que cada columna puede declarar un **nombre de pantalla**, separado de su clave y de
  su rótulo largo, y se usa en todo lo que la clase lee: figuras, tablas y el `.xlsx` que se
  le entrega. `erre` se proyecta como **R**; `js`, como **JavaScript**; `python` y `julia`,
  con su mayúscula.
- Solo lo declara la columna que lo necesita. Donde la clave ya es el nombre de la cosa
  —`municipio`, `sangre`, `viajes`— no hay nada que declarar y no se declara nada.

## Capabilities

### New Capabilities

- `sesion-06-figuras-rotuladas`: qué tiene que decir cada figura de la entrada de la
  sesión 6 sobre sus propios ejes —qué magnitud, en qué unidad, con qué escala— y la
  prohibición de dibujar dos escalas distintas como si fueran una.

### Modified Capabilities

- `datos-del-salon`: qué columnas se publican y cuáles no, y cómo se llama cada una en
  pantalla cuando su clave no es el nombre de la cosa. Se revierte la exclusión del
  peso, la estatura, el año de nacimiento y la talla de camiseta; se admite por primera vez
  una columna **derivada** —la edad— dentro de un conjunto cuya regla actual es que todo
  valor se copia tal cual; y el tipo declarado de una columna deja de ser binario
  (categórica / cuantitativa) para admitir **ordinal**, que el código ya usa y la spec no
  reconoce.
- `sesion-06-limpieza`: la estandarización del texto se muestra aplicada a todas las
  columnas de texto, con su recuento antes y después, y no solo a una. Y la cadena deja de
  terminar sin enseñar su resultado: la tabla limpia se muestra entera antes del análisis,
  con el destino de cada columna y las celdas inventadas señalados.
- `sesion-06-imputacion`: deja de haber **una** variable ordinal y pasa a haber dos, así
  que lo que hoy se enuncia sobre «la escala del 1 al 5» se enuncia sobre la clase de las
  ordinales —incluida una cuyos niveles son etiquetas y no números. Y los extremos de un
  orden pasan a estar exentos del agrupamiento de niveles poco frecuentes. Además, la
  tabla imputada pasa a **conservar la marca** de qué celdas se inventaron, en vez de
  perderla al rellenar.
- `sesion-06-pca-cuantitativas`: entran tres variables cuantitativas más, y con ellas el
  primer par de la tabla que sí correlaciona. Lo que la entrada afirma sobre por qué el
  resultado es pobre queda sujeto a las cifras nuevas. Y ese juicio deja de apoyarse solo en
  prosa: antes del análisis se muestra qué relaciones hay entre las variables, de los tres
  tipos, de modo que «no se dan la mano» y «¿qué falta?» se vean en vez de afirmarse.

## Impact

- **Datos y scripts**: `scripts/extract_salon.py` (las cuatro columnas, la derivación de
  la edad, los `assert` que hoy exigen 27 columnas y 7 exclusiones), `scripts/clean_salon.py`
  (la cadena sobre tres cuantitativas y una ordinal más, la exención de los extremos
  ordinales y la marcación de nulos), `scripts/check_salon.py` y
  `scripts/export_xlsx.py`, y los generados `src/data/salon.js`, `src/data/salon_limpio.js`
  —que pasa a publicar además la tabla limpia completa, fila por fila— y
  `src/data/salon_limpio.xlsx`.
- **Documentación**: `src/data/PROCEDENCIA.txt`, que hoy enumera las columnas excluidas y
  el motivo, y quedaría desactualizado.
- **Contenido**: `src/sessions/s06/blocks/Intro.jsx`, las ocho figuras de
  `src/sessions/s06/figures/intro.js` más las tres matrices nuevas, y `src/sessions/s06/meta.js`
  por el reparto de minutos.
- **No afecta a las sesiones 3 y 4.** Leen del mismo conjunto, pero a través de `COLS_S03`
  —sus diez columnas— y de los resúmenes de `minutos`, `porciones` y `balanceada`. Se
  verificó que ninguna interpola el recuento de columnas del conjunto. Añadir columnas no
  mueve ninguna cifra ya proyectada en esas dos sesiones.
- **Dependencias**: ninguna nueva, ni en npm ni en Python. Siguen siendo cuatro paquetes de
  npm y `feature-engine` en `.venv/`, que no participa del despliegue. La marcación de
  nulos usa `AddMissingIndicator`, que ya viene en la versión fijada —`feature-engine==1.9.4`—,
  así que no mueve `scripts/requirements.txt`.
- **Arquitectura**: sin cambios. Rutas por hash, un `import()` por bloque, `base: './'`.
- **Riesgo**: las cifras publicadas de la entrada —porcentajes del PCA, recuentos de
  atípicos, celdas imputadas— **se van a mover todas**, porque la tabla que entra a la
  cadena es otra. `pnpm build` seguirá pasando: el daño posible es de coherencia, no de
  compilación, y por eso el diseño exige que ninguna cifra quede escrita a mano.
