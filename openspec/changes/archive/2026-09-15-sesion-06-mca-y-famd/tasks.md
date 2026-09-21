# Tareas — Sesión 6: MCA y FAMD

Derivadas de `specs/` y de `design.md`. En orden de dependencia: cada tarea supone hechas
las anteriores. Los grupos 1 a 5 dejan el sitio coherente por sí solos, así que son el
punto seguro para parar si hay que parar.

Convención: cada tarea dice cómo se comprueba, y la comprobación se ejecuta o se mira,
nunca se supone. `pnpm build` tiene que seguir compilando al final de cada grupo y no se
repite en cada línea. Aquí no hay `make test` ni linter: `pnpm build`, los dos scripts de
verificación y la lectura a 390 px son todo lo que hay.

---

## 1. El entorno y la procedencia de los datos

- [x] 1.1 Añadir el `.xlsx` de respuestas a `.gitignore` y escribir `src/data/PROCEDENCIA.txt`
      con de qué formulario sale, de qué fecha es la captura y cuántas respuestas trae.
      **Hecho cuando:** `git check-ignore -v` sobre el `.xlsx` lo da por ignorado y
      `git status` sigue limpio con el archivo presente.
- [x] 1.2 Crear `.venv` y `scripts/requirements.txt` con `feature-engine` fijado a una
      versión exacta, y documentar en `README.md` cómo se crea el entorno y para qué es.
      **Hecho cuando:** desde cero, crear el entorno e instalar desde ese archivo termina
      sin error, y `python -c "import feature_engine; print(feature_engine.__version__)"`
      imprime la versión fijada.
- [x] 1.3 Dejar anotado en `AGENTS.md` que `scripts/clean_salon.py` es el único script con
      dependencias y por qué eso no afecta al despliegue.
      **Hecho cuando:** la regla de stdlib pura del archivo dice cuál es su excepción.

## 2. `src/data/salon.js`: el conjunto compartido

- [x] 2.1 Elegir las columnas publicadas y dejar escrito, para cada una de las excluidas,
      por qué no se publica. Conservar A–J con las letras y el orden de la sesión 3 y
      añadir las nuevas detrás.
      **Hecho cuando:** la lista cubre las 34 columnas del formulario, cada exclusión tiene
      motivo, y no están el peso, la estatura, el año de nacimiento, el grupo de edad, la
      talla ni el nombre exacto del programa.
- [x] 2.2 Reapuntar `scripts/extract_salon.py` al `.xlsx` de `src/data/` y a la salida
      `src/data/salon.js`, con las columnas de 2.1 y el tipo —categórica o cuantitativa—
      declarado en cada una.
      **Hecho cuando:** `python3 scripts/extract_salon.py` escribe el archivo con la
      cabecera «do not edit by hand» e imprime cuántas respuestas y cuántas columnas
      publicó; el archivo trae al menos cuatro columnas de cada tipo.
- [x] 2.3 Añadir al script el cálculo de los derivados que hoy están tecleados en
      `s03/data/salon.js` y `s04/data/salon.js` —las cuatro medias, y la media, mediana,
      moda, cuartiles, rango, RIC, desviación y CV de cada columna que la sesión 4 muestra—
      y emitirlos junto a las filas.
      **Hecho cuando:** ninguno de los dos archivos antiguos contiene un número que el
      generado no produzca.
- [x] 2.4 Añadir los recuentos que hoy son prosa: cuántas respuestas hay, cuántas celdas
      vacías por columna, y los recuentos que las sesiones 3 y 4 rotulan dentro de sus
      figuras.
      **Hecho cuando:** cada cifra que el grupo 3 va a sustituir tiene ya su exportación
      correspondiente en el archivo generado.
- [x] 2.5 Comprobar que volver a generar da byte por byte lo mismo.
      **Hecho cuando:** dos ejecuciones seguidas dejan el archivo idéntico según `diff`.

## 3. Migrar las sesiones 3 y 4 al conjunto compartido

- [x] 3.1 Apuntar los cinco bloques de la sesión 3 a `src/data/salon.js` y borrar
      `src/sessions/s03/data/salon.js`.
      **Hecho cuando:** no queda ninguna referencia al archivo borrado y la sesión 3 se
      recorre entera en el navegador sin error.
- [x] 3.2 Apuntar los bloques de la sesión 4 a `src/data/salon.js` y borrar
      `src/sessions/s04/data/salon.js`.
      **Hecho cuando:** igual que 3.1, para la sesión 4.
- [x] 3.3 Sustituir por interpolaciones las cifras escritas a mano en los bloques de la
      sesión 3 —«Siete de 23», «por 23 en vez de por 20», «sobre 23 filas», «A mano se
      puede con 23 filas»— y en los de la 4.
      **Hecho cuando:** `grep -rn "\b23\b\|veintitr" src/sessions/s03 src/sessions/s04`
      no devuelve ninguna cifra sobre la tabla del salón escrita como literal.
- [x] 3.4 Sustituir las cifras rotuladas dentro de las figuras de la sesión 3
      (`figures/intro.js` con «13 de 23 personas» y «trece de veintitrés», `figures/block3.js`
      con «Las 23 respuestas») y de la 4 (`figures/block1.js` con «LAS 20 RESPUESTAS»).
      **Hecho cuando:** ese mismo `grep` sobre los dos directorios de figuras no devuelve
      ninguna, y las cuatro figuras se ven bien al ampliarlas.
- [x] 3.5 Releer los cinco bloques de la sesión 3 y los cinco de la 4 buscando afirmaciones
      que los datos nuevos desmientan —qué columna tiene más huecos, cuál es el atípico,
      qué municipio se repite más, si el 960 sigue siendo el máximo— y reescribir las que
      hagan falta.
      **Hecho cuando:** existe una lista de las afirmaciones revisadas, cada una marcada
      como cierta o reescrita, y ninguna queda sin revisar.
- [x] 3.6 Anotar junto a cada texto y cada figura reescritos que su contenido ya no es el
      que se proyectó en clase, y por qué.
      **Hecho cuando:** cada punto reescrito en 3.3, 3.4 y 3.5 lleva su comentario.
- [x] 3.7 Comprobar el reparto en chunks.
      **Hecho cuando:** la salida de `pnpm build` muestra `salon.js` como chunk propio, y
      abrir un bloque de la sesión 3 en el navegador no descarga los chunks de la 4 ni los
      de la 6.

## 4. El temario deja de guardar títulos

- [x] 4.1 Reescribir `src/data/syllabus.js` para que declare cuántas sesiones tiene el
      curso y solo el título y el objetivo de las que aún no existen. `pad2` se queda donde
      está.
      **Hecho cuando:** el archivo no contiene el título ni el objetivo de ninguna sesión
      con `meta.js`, y `grep -rn "pad2" src/` sigue encontrando sus tres usos.
- [x] 4.2 Adaptar `src/components/Cover.jsx` para que recorra la numeración completa y tome
      los metadatos de la sesión cuando existan.
      **Hecho cuando:** el índice muestra las ocho filas en orden, las construidas con su
      título y sus fichas de bloque y las pendientes con su «En preparación».
- [x] 4.3 Comprobar que el índice no cambió de aspecto.
      **Hecho cuando:** comparadas con antes del cambio, las ocho filas muestran el mismo
      título y el mismo objetivo que mostraban.

## 5. Las promesas sobre la sesión 6

- [x] 5.1 Corregir `src/sessions/s04/blocks/Block3.jsx` para que deje de decir que la
      paradoja de Simpson se resuelve en la sesión 6, conservando la figura, el
      planteamiento y la advertencia.
      **Hecho cuando:** el bloque ya no nombra la sesión 6 y sigue planteando la paradoja
      con su figura.
- [x] 5.2 Corregir `src/sessions/s04/blocks/Closing.jsx` para que deje de anunciar
      causalidad en la sesión 6 y anuncie lo que la 6 sí trata.
      **Hecho cuando:** el cierre no promete causalidad y sí anuncia el contenido real de
      la sesión 6.
- [x] 5.3 Barrer las cinco sesiones publicadas en busca de cualquier otra promesa sobre la
      sesión 6.
      **Hecho cuando:** `grep -rn "sesión 6\|sesion 6" src/` no devuelve ninguna promesa
      que la sesión 6 no vaya a cumplir.

## 6. `scripts/clean_salon.py`: la cadena de la entrada

- [x] 6.1 Escribir el paso de estandarización del texto —recorte, tildes, minúsculas y
      palabras vacías—, con la lista de palabras vacías explícita en el script y el alcance
      de cada tratamiento declarado por columna.
      **Hecho cuando:** el script imprime, por columna de texto, cuántas categorías
      distintas hay tras cada uno de los cuatro tratamientos, y reproduce los números del
      diseño: departamento 12 → 9 → 6 y municipio 17 → 14 → 11.
- [x] 6.2 Calcular las medidas de localización y dispersión de cada columna cuantitativa
      antes de limpiar.
      **Hecho cuando:** cada columna sale con media, mediana, moda, cuartiles, RIC y
      desviación típica, y las de las columnas que la sesión 4 ya mostraba coinciden con
      las que el grupo 2 generó.
- [x] 6.3 Marcar los atípicos con la regla del diagrama de caja, guardando para cada
      columna los cortes de la caja, los extremos de los bigotes y qué celdas quedan fuera,
      con los dos umbrales.
      **Hecho cuando:** el script reproduce la tabla de atípicos del diseño: 7 fuera con
      1,5·RIC en «pantalla h/día» y 2 con 3·RIC, 1 en «minutos ayer» (960), y cero en
      empleos, días y semanas de actividad física, porciones y cafés.
- [x] 6.4 Excluir «pantalla h/día» de la imputación y del PCA, dejando en el script la razón
      escrita —8 nulos más 7 atípicos sobre 27 dejarían más de la mitad inventada— y
      emitiendo esas tres cifras para que el bloque las interpole. La columna **se sigue
      publicando** en `src/data/salon.js` con sus huecos: es la columna E de la sesión 3.
      **Hecho cuando:** `salon_limpio.js` no trae valores imputados de esa columna, sí trae
      sus cifras de descarte, y `src/data/salon.js` la conserva intacta.
- [x] 6.5 Imputar nulos y atípicos de las columnas restantes con `RandomSampleImputer`, con
      `random_state` fijo y `seed='general'`, guardando qué celda se imputó, con qué valor y
      de qué columna salió.
      **Hecho cuando:** dos ejecuciones seguidas producen exactamente los mismos valores
      imputados.
- [x] 6.6 Recalcular las mismas medidas de 6.2 sobre la tabla ya imputada, y calcular
      también el resultado de rellenar con la media, para el contraste del bloque.
      **Hecho cuando:** el archivo trae las tres versiones —sin limpiar, imputada por
      muestreo, imputada por la media— con la desviación típica de cada una.
- [x] 6.7 Calcular el PCA de las variables cuantitativas de la tabla imputada, con la
      decisión de estandarizar tomada y escrita: autovalores, porcentajes, cargas y las
      coordenadas de cada fila en el plano.
      **Hecho cuando:** los porcentajes suman cien y el archivo dice cuántas columnas
      entraron y cuántas quedaron fuera.
- [x] 6.8 Emitir `src/data/salon_limpio.js` con todo lo anterior y la cabecera «do not edit
      by hand».
      **Hecho cuando:** `python scripts/clean_salon.py` lo escribe e imprime un resumen con
      los recuentos de imputados por columna.

## 7. `scripts/check_salon.py`: la verificación

- [x] 7.1 Escribir el verificador en stdlib pura, sin importar `feature-engine`.
      **Hecho cuando:** `python3 scripts/check_salon.py` corre con el intérprete del
      sistema, fuera del entorno virtual.
- [x] 7.2 Comprobar que los estadísticos publicados salen de las filas publicadas, y que
      cada valor imputado es un valor que de verdad aparece en su columna.
      **Hecho cuando:** el verificador falla si se edita a mano un estadístico o un valor
      imputado, y sale con código distinto de cero.
- [x] 7.3 Comprobar que los recuentos de imputados cuadran con los nulos más los atípicos
      marcados, y que el PCA cumple sus identidades algebraicas como en `check_pca.py`.
      **Hecho cuando:** las dos comprobaciones pasan sobre el archivo generado y fallan
      sobre un archivo con una cifra alterada.

## 8. Montar la sesión 6

- [x] 8.1 Escribir `src/sessions/s06/meta.js` con el título, el gancho, el objetivo y los
      cinco bloques con sus franjas del diseño.
      **Hecho cuando:** las franjas no se solapan, terminan en 180, y la de la entrada es
      más larga que las de las entradas de las sesiones 1 a 5.
- [x] 8.2 Registrar la sesión 6 en `src/sessions/registry.js` con un `import()` por bloque.
      **Hecho cuando:** `pnpm build` emite un chunk por cada uno de los cinco bloques.
- [x] 8.3 Montar los cuatro bloques pendientes —MCA, FAMD, segmentación y cierre— cada uno
      con su `<Panel>`, su rótulo y un aviso de pendiente que se distinga del material de
      clase y no anuncie fechas. El bloque 1 dice que es donde se responde la pregunta de
      la entrada.
      **Hecho cuando:** los cuatro se abren sin error, no traen figuras ni datos de sus
      temas, y se puede volver a la entrada desde cualquiera.
- [x] 8.4 Comprobar la sesión desde el índice.
      **Hecho cuando:** la sesión 6 aparece no atenuada, se abre, y la dirección de cada
      uno de sus cinco bloques abre ese bloque y no otro.

## 9. La entrada de la sesión 6

- [x] 9.1 Escribir el arranque: la tabla del salón cruda y por qué se vuelve a ella en vez
      de seguir con los países de la sesión 5.
      **Hecho cuando:** el bloque muestra la tabla y enuncia el motivo del cambio de
      material.
- [x] 9.2 Escribir el paso de estandarización del texto, con los cuatro tratamientos
      nombrados, cada uno visto sobre un valor real, el recuento de categorías antes y
      después, la lista de palabras vacías, a qué columnas se aplica y qué se pierde.
      **Hecho cuando:** los seis elementos están y los recuentos salen de
      `salon_limpio.js`, no escritos a mano.
- [x] 9.3 Escribir la descripción de antes con las medidas de la sesión 4, y su figura.
      **Hecho cuando:** cada variable cuantitativa muestra media, mediana, cuartiles, RIC y
      desviación típica, todas interpoladas.
- [x] 9.4 Dibujar los diagramas de caja en `s06/figures/`, uno por variable cuantitativa,
      con los helpers de `src/svg/kit.js` y los `id` prefijados `ar-s6-`.
      **Hecho cuando:** hay una caja por variable, los atípicos están marcados, y ningún
      `id` se repite con el de otra figura del curso.
- [x] 9.5 Escribir el texto del paso de atípicos: qué son la caja, la línea y los bigotes;
      que se construyen con los cuartiles ya mostrados; la regla exacta; a qué fila y
      columna corresponde cada punto marcado; que un atípico puede ser un error o un dato
      verdadero; que el umbral es una decisión, con cuántos puntos deja fuera cada uno de
      los dos; y qué se hace con ellos.
      **Hecho cuando:** los siete elementos están y las cifras salen del archivo generado.
- [x] 9.6 Escribir el recuento de huecos por columna antes de imputar.
      **Hecho cuando:** el bloque muestra cuántos valores faltan en cada columna,
      interpolados.
- [x] 9.7 Escribir el paso de imputación: el método, que los atípicos entran al mismo
      tratamiento y por qué no se borra la fila, una celda seguida de principio a fin, y
      que el valor puesto es una invención plausible y no una medición.
      **Hecho cuando:** los cuatro elementos están.
- [x] 9.8 Escribir el descarte de «pantalla h/día»: qué columna queda fuera, por qué, con
      las tres cifras interpoladas, y redactado como conclusión de haber descrito la columna
      y dibujado su caja — no como un fallo de la limpieza.
      **Hecho cuando:** el pasaje nombra la columna, da las tres cifras desde
      `salon_limpio.js`, y alguien que lo lea en voz alta no lo entiende como un tropiezo.
- [x] 9.9 Dibujar el antes y el después de una distribución, más el contraste con rellenar
      por la media, y escribir que el muestreo conserva la forma, que la media estrecha la
      dispersión y con cuánto, y que el método no conserva la relación entre columnas.
      **Hecho cuando:** las tres distribuciones están dibujadas y las tres afirmaciones
      escritas con su cifra.
- [x] 9.10 Mostrar la tabla imputada con las celdas inventadas señaladas, el recuento y la
      proporción por columna, y decir que el azar está fijado y qué significa.
      **Hecho cuando:** las celdas imputadas se distinguen a simple vista y abrir el bloque
      dos veces da los mismos valores.
- [x] 9.11 Escribir la descripción de después y la comparación lado a lado con la de 9.3,
      señalando qué medidas se movieron más y cuáles resistieron.
      **Hecho cuando:** cada medida del antes queda junto a la misma del después, y las que
      más se movieron están señaladas.
- [x] 9.12 Escribir el PCA de las cuantitativas: qué columnas entran y cuáles no,
      distinguiendo las que no entran por categóricas de «pantalla h/día», que no entra por
      la calidad de sus datos y repite aquí su motivo; por qué las categóricas no pueden
      entrar; qué proporción de la tabla queda fuera; si se estandarizó y por qué; la
      varianza explicada de cada componente, y las cargas.
      **Hecho cuando:** los siete elementos están, interpolados desde `salon_limpio.js`, y
      las dos clases de exclusión se leen por separado.
- [x] 9.13 Dibujar el plano factorial con un punto por respuesta, y escribir qué se puede
      leer en él y qué no, y si las dos primeras componentes bastan comparado con lo que
      pasó en la sesión 5.
      **Hecho cuando:** hay un punto por fila y las dos afirmaciones están escritas.
- [x] 9.14 Cerrar con la pregunta «¿qué falta?», remitiendo a las columnas que quedaron
      fuera y diciendo que los bloques siguientes la responden, sin contestarla.
      **Hecho cuando:** la pregunta está escrita tal cual, remite a esas columnas, y la
      entrada no la contesta.

## 12. Las 17 variables que no son números

Añadido después de implementar los grupos 1 a 11. Nada de aquí está hecho.

- [x] 12.1 Añadir a `scripts/clean_salon.py` el diagnóstico de cada variable no numérica:
      niveles antes y después de limpiar, tamaño del nivel mayor, cuántos niveles tienen una
      sola persona, y cuántas respuestas faltan.
      **Hecho cuando:** `salon_limpio.js` trae las 17 con esas cinco cifras, y las de
      `municipio` reproducen las del diseño: 17 → 11 niveles, mayor de 6, 3 con ≥2 personas.
- [x] 12.2 Clasificar cada variable en una de las cuatro formas con umbrales escritos en el
      script como constantes, no incrustados en un `if`.
      **Hecho cuando:** la clasificación reproduce la tabla del diseño —8 sanas, 4 con cola
      larga, 3 dominadas, 2 casi todo único— y los umbrales se leen en un solo sitio.
- [x] 12.3 Extender el `RareLabelEncoder` a las de cola larga (`municipio`, `sector`,
      `area`, `musica`), con el mismo `tol` que ya usa la ordinal, guardando para cada una
      los niveles antes, los frecuentes y los agrupados.
      **Hecho cuando:** las cuatro salen agrupadas, las ocho sanas intactas, y `codigo` y
      `libro` sin tocar.
- [x] 12.4 Marcar `codigo` y `libro` como no analizables, con su motivo, en la misma
      estructura que ya usa `pantalla` pero con un motivo distinto del suyo.
      **Hecho cuando:** el archivo distingue los descartes por calidad del dato de los
      descartes por no ser una categoría, y cada uno lleva su texto.
- [x] 12.5 Comprobar que nada de esto toca el PCA.
      **Hecho cuando:** `PCA.variables` sigue siendo las mismas 9, y `check_salon.py` pasa.
- [x] 12.6 Regenerar `salon_limpio.js` y `salon_limpio.xlsx`, y registrar en la bitácora las
      decisiones nuevas —agrupamientos y descartes— con su motivo.
      **Hecho cuando:** la bitácora suma las filas nuevas, ninguna sin motivo, y las dos
      regeneraciones siguen siendo deterministas.
- [x] 12.7 Dibujar la figura del diagnóstico de las 17 en `s06/figures/`, con los `id`
      prefijados `ar-s6-` y los helpers de `src/svg/kit.js`.
      **Hecho cuando:** las 17 aparecen con su forma, ningún texto se sale del `viewBox`, y
      a 390 px no hay scroll horizontal.
- [x] 12.8 Cambiar la tabla de «Con qué vamos a trabajar» para que muestre las 17 variables
      no numéricas en vez de las diez de la sesión 3, y ajustar su pie.
      **Hecho cuando:** la tabla muestra 17 columnas y el pie dice cuáles son y por qué.
- [x] 12.9 Escribir la subsección: qué hace la limpieza en cada forma, qué se agrupó y con
      qué efecto, cuáles no distinguen a nadie y por qué, cuáles no son categorías y por
      qué, y que ninguna entra al PCA por muy limpia que quede.
      **Hecho cuando:** los cinco elementos están, todas las cifras interpoladas desde
      `salon_limpio.js`, y los tres motivos de descarte se leen por separado.
- [x] 12.10 Reajustar las franjas en `s06/meta.js` al reparto del diseño (0–60, 68–98,
      106–134, 142–168, 168–180).
      **Hecho cuando:** no se solapan, terminan en 180, y la entrada sigue siendo la más
      larga del curso.
- [x] 12.11 Volver a pasar la verificación completa.
      **Hecho cuando:** `pnpm build`, `check_pca.py` y `check_salon.py` pasan; los 30
      bloques abren sin error de consola; y a 390 px ninguna figura provoca scroll.

## 11. La hoja de cálculo y su bitácora

- [x] 11.1 Escribir `scripts/export_xlsx.py` en stdlib pura, que lee los dos módulos
      generados y emite `src/data/salon_limpio.xlsx` con las hojas `crudo`, `limpio` y
      `bitacora`.
      **Hecho cuando:** `python3 scripts/export_xlsx.py` lo escribe con el intérprete del
      sistema, fuera del entorno virtual, e imprime cuántas decisiones registró.
- [x] 11.2 Registrar en la bitácora una fila por decisión, con paso, operación, variable,
      filas, antes, después, cuántas y por qué, y si se puede deshacer. Incluir las
      decisiones de NO aplicar un tratamiento y omitir las que no cambiaron nada.
      **Hecho cuando:** ninguna fila carece de motivo y ninguna dice solo que no pasó nada.
- [x] 11.3 Comprobar que el archivo es un `.xlsx` válido y que sus dos tablas difieren
      exactamente donde la bitácora dice.
      **Hecho cuando:** las ocho partes XML están bien formadas, las tres hojas se leen de
      vuelta, y la fila 27 dice `Fontibon` en `crudo` y `Bogotá` en `limpio`.
- [x] 11.4 Fijar las marcas de tiempo del zip y quitar la fecha de la cabecera, para que
      los bytes dependan solo del contenido.
      **Hecho cuando:** dos ejecuciones seguidas dejan el archivo con el mismo `shasum`.
- [x] 11.5 Versionar el generado sin versionar el crudo.
      **Hecho cuando:** `git add -n` acepta `salon_limpio.xlsx` y rechaza por ignorado el
      `.xlsx` de respuestas del formulario.

## 10. Cierre

- [x] 10.1 Ejecutar la verificación completa.
      **Hecho cuando:** `pnpm build` compila, `python3 scripts/check_pca.py` y
      `python3 scripts/check_salon.py` pasan los dos.
- [x] 10.2 Revisar la sesión 6 y las sesiones 3 y 4 a 390 px de ancho.
      **Hecho cuando:** ninguna figura provoca scroll horizontal, y en cada una **Ampliar**
      abre el diálogo, se cierra con Esc y devuelve el foco al botón.
- [x] 10.3 Recorrer el sitio entero con `pnpm preview`: las ocho filas del índice, las seis
      sesiones construidas y los cuatro bloques pendientes.
      **Hecho cuando:** nada da error en consola y ninguna pantalla promete algo que no se
      cumple.
- [x] 10.4 Actualizar `README.md`: de dónde sale ahora la tabla del salón, qué hace cada
      uno de los tres scripts, y qué es el entorno virtual.
      **Hecho cuando:** el README describe el estado nuevo y no menciona los dos archivos
      de datos borrados.
