## Why

El curso son ocho sesiones de tres horas y hay cinco construidas. La sesión 5 terminó
reduciendo cuatro indicadores de país a un plano factorial y dejó el método atado a una
condición que nunca se dijo en voz alta: **el PCA solo sabe leer números**. La tabla del
salón —la misma que la sesión 3 limpió y la sesión 4 describió— es en su mayoría texto:
departamento, área de pregrado, sector económico, grupo sanguíneo, género musical. Con la
sesión 5 en la mano, esa tabla todavía no se puede analizar entera.

La sesión 6 llena ese hueco. Vuelve a la tabla del salón, la deja utilizable —texto
estandarizado, atípicos detectados con cajas, nulos imputados—, le corre el PCA a lo poco
que es cuantitativo, y termina preguntando **«¿qué falta?»**. Lo que falta son las
variables categóricas, y esa es la puerta del MCA, del FAMD y de la segmentación.

## What Changes

- Se añade la **sesión 6** al curso con su estructura de cinco bloques, igual que las
  cinco anteriores: entrada, tres bloques y cierre, todos alcanzables desde el índice.
- **Solo la entrada lleva contenido en este cambio.** Recorre la cadena completa sobre la
  tabla del salón: estandarizar el texto (recorte de espacios, sin tildes, minúsculas,
  sin palabras vacías), describir con las medidas de localización y dispersión de la
  sesión 4, detectar atípicos con diagramas de caja, imputar nulos y atípicos con
  `RandomSampleImputer`, volver a describir para ver qué movió la limpieza, y correr el
  PCA de las variables cuantitativas.
- **La entrada limpia y explora las 17 variables que no son números**, no solo las que el
  PCA puede mirar. Se les aplican los cuatro tratamientos de texto, se agrupan los niveles
  que casi nadie eligió, y se diagnostica una por una: cuántos niveles tiene, cuánta gente
  hay en el más grande, cuántas respuestas faltan. Ese diagnóstico las reparte en **cuatro
  formas** —sanas, con cola larga de niveles de una persona, dominadas por una sola
  respuesta, y las que son casi todo valores únicos— y cada forma admite un tratamiento
  distinto. Lo único que **no** se hace con ellas es meterlas al PCA, que no puede leerlas.
- Esa exploración es lo que convierte «¿qué falta?» en una pregunta con material delante:
  al terminar la entrada la clase ha visto las 17 columnas que el análisis no miró, y sabe
  cuáles de ellas tienen algo que decir. Una columna —las horas de pantalla al día— acaba
  **descartada en vez de imputada**, porque entre huecos y atípicos habría que inventarle
  más de la mitad de los valores. Eso no es un hueco de la sesión: descartar es el último
  eslabón de la cadena que la entrada enseña.
- La entrada pasa de 45 a **60 minutos** y las franjas de los cinco bloques se reparten de
  nuevo dentro de las tres horas. Sigue siendo la entrada más larga del curso, y ahora por
  bastante: es que carga la cadena completa sobre las 27 variables, no sobre diez.
- La entrada **cierra con la pregunta «¿qué falta?»**, que es el gozne de la sesión: la
  respuesta —las variables categóricas quedaron fuera— es lo que abren los tres bloques
  siguientes.
- Los **bloques 1, 2 y 3 y el cierre quedan rotulados pero vacíos**: MCA, FAMD,
  segmentación y cierre. Se llenan en specs posteriores. Quedan montados y navegables,
  diciendo en pantalla que están pendientes, no rotos.
- La limpieza y el PCA **no se calculan en el navegador**: los produce un script de
  Python en un entorno virtual, con `feature-engine` y semilla fija, siguiendo el
  precedente de `scripts/extract_gapminder.py` + `scripts/check_pca.py`. El código no se
  proyecta en clase; la clase ve los resultados dibujados.
- **BREAKING (contenido ya publicado).** El conjunto de datos pasa a ser un único
  `src/data/salon.js`, fuera de `src/sessions/`, compartido por las sesiones 3, 4 y 6, y
  se regenera del formulario actual: **27 respuestas, no 23**. Las sesiones 3 y 4 dejan de
  tener su copia. Eso mueve números que ya se proyectaron en clase —las cuatro medias de
  la sesión 3, y en la 4 la media, la mediana, los cuartiles, la desviación y la demo del
  atípico de 960 minutos— y obliga a reescribir los textos y las figuras que dicen «23»,
  «siete de 23», «trece de veintitrés» o «las 20 respuestas».
- **BREAKING (promesas rotas).** La sesión 4 anuncia dos veces en pantalla que la sesión 6
  trata de causalidad y resuelve la paradoja de Simpson (`s04/blocks/Block3.jsx:48`,
  `s04/blocks/Closing.jsx:48`), y `src/data/syllabus.js` dice lo mismo. Este cambio
  corrige las tres, como el cambio de la sesión 5 corrigió las promesas de la 2 y la 4.
- El temario deja de guardar títulos. `src/data/syllabus.js` lleva hoy el título y el
  objetivo de las ocho sesiones, pero `Cover.jsx` los descarta en cuanto la sesión tiene
  su `meta.js`: los de las sesiones 1 a 5 son cadenas muertas que nadie lee, y nada impide
  que digan algo distinto de lo que la sesión dice. El temario pasa a declarar solo cuántas
  sesiones son y qué anunciar de las que todavía no existen; **un título vive en un único
  sitio, siempre**. Al construirse, la sesión 6 sale de esa lista.

Una advertencia, ya decidida y no pendiente: compartir el dataset y regenerarlo a 27
filas es el punto de mayor riesgo de este cambio. Toca dos sesiones ya dadas en clase, y
el daño no es de compilación —`pnpm build` seguirá pasando— sino de coherencia: una
figura que anota «13 de 23» sobre datos de 27. Por eso las tareas de esa parte van
primero y separadas, y el diseño fija de dónde sale cada cifra para que ninguna quede
escrita a mano.

## Capabilities

### New Capabilities

- `sesion-06-estructura`: la sesión existe en el índice, se divide en cinco bloques
  rotulados, y anuncia su título, su gancho, su objetivo y la franja de minutos de cada
  bloque.
- `datos-del-salon`: el conjunto compartido — qué columnas del formulario se publican y
  cuáles no, cuántas respuestas trae, de dónde sale, y que las sesiones 3, 4 y 6 leen
  todas del mismo archivo.
- `sesion-06-limpieza`: la primera parte de la entrada — estandarizar el texto, describir
  con las medidas de la sesión 4, encontrar los atípicos con diagramas de caja, y el
  antes y después de esas medidas.
- `sesion-06-imputacion`: la imputación de nulos y atípicos por muestreo aleatorio — qué
  hace, qué conserva, qué cuesta, y por qué el resultado es reproducible.
- `sesion-06-pca-cuantitativas`: el PCA de las variables cuantitativas de la tabla ya
  limpia, y la pregunta «¿qué falta?» con la que termina la entrada.
- `sesion-06-bloques-pendientes`: los tres bloques y el cierre que quedan rotulados sin
  contenido — qué anuncian, qué no prometen, y que son navegables.

### Modified Capabilities

- `material-publicado`: hoy cubre solo las promesas que las sesiones 2 y 4 hacían sobre
  la 5. Se le añaden las promesas que la sesión 4 y el temario hacen sobre la **6**, y la
  obligación de que ninguna cifra escrita en pantalla en las sesiones 3 y 4 contradiga el
  número de respuestas del conjunto compartido.

## Impact

- **Código nuevo**: `src/sessions/s06/` —`meta.js`, los cinco bloques, las figuras de la
  entrada— y su entrada en `src/sessions/registry.js`, con un `import()` por bloque.
- **Datos**: `src/data/salon.js` (crudo, compartido) y `src/data/salon_limpio.js` (los
  resultados de la entrada de la sesión 6, ahora también el diagnóstico y el agrupamiento
  de las 17 no numéricas). Desaparecen `src/sessions/s03/data/salon.js`
  y `src/sessions/s04/data/salon.js`.
- **Código ya publicado**: los cinco bloques y las dos figuras de la sesión 3 que
  interpolan o rotulan cifras del dataset; los bloques de la sesión 4 que interpolan sus
  estadísticos, más `Block3.jsx` y `Closing.jsx` por las promesas; `src/data/syllabus.js`,
  que se queda sin los títulos; y `src/components/Cover.jsx`, su único lector.
- **Scripts**: `scripts/extract_salon.py` pasa a escribir en `src/data/` y a publicar más
  columnas; se añade el script de limpieza con `feature-engine` y su verificador.
- **Dependencias**: **ninguna nueva en npm.** Siguen siendo cuatro, y el builder de
  Hostinger no ve nada distinto. Las de Python viven solo en `.venv/`, que ya está en
  `.gitignore` y no participa del despliegue.
- **Arquitectura**: se mantiene todo —rutas por hash, un `import()` por bloque, sin router
  ni gestor de estado, `base: './'`—. Lo único que cambia es que el dataset deja de estar
  duplicado por sesión, así que Vite emitirá un chunk compartido para él en vez de
  incluirlo en el de cada bloque. Es una consecuencia buscada de la decisión de
  compartirlo, no un cambio de esquema.
