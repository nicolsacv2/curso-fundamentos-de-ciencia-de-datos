## Why

La entrada de la sesión 6 termina en «¿qué falta?» y promete que «los tres bloques que
vienen son la respuesta». Hoy los tres bloques y el cierre están montados pero vacíos: cada
uno muestra un aviso de «Bloque en preparación». La sesión se puede navegar, pero no se
puede dar. Lo que hay que enseñar ya está escrito —`mca_famd_guia.md` trae la matemática
del MCA y del FAMD, un ejemplo numérico de ocho personas verificado paso a paso, la
patología de las categorías raras, las categorías suplementarias, los conceptos «en versión
humana» y los tres gráficos del FAMD— y solo falta pasarlo a la forma del curso: bloques,
figuras generadas, cifras que salen de un script y no de un párrafo.

Además, la sesión cierra hoy con un bloque de **segmentación** que nunca se escribió y que
no hace falta para responder la pregunta de la entrada. Con la guía en la mano, la respuesta
natural a «¿qué falta?» es aplicar el FAMD **a la propia tabla del salón que la entrada
acaba de limpiar**: la misma tabla, las mismas 27 personas, ahora con las 28 columnas que
llegaron limpias en vez de las 12 que el PCA pudo mirar.

## What Changes

- **El bloque 1 pasa a ser el MCA de la guía**, entero y en su orden: la tabla disyuntiva
  completa, el MCA como análisis de correspondencias de esa tabla, la métrica chi-cuadrado y
  su consecuencia (d² = n/n_j − 1), la descomposición en valores singulares, las fórmulas de
  transición y la lectura baricéntrica, la inercia total y la corrección de Benzécri, la
  matriz de Burt, y las herramientas de interpretación (contribución y coseno cuadrado).
  Todo sobre el **ejemplo de ocho personas** —Bebida, Horario, Azúcar— con su mapa factorial,
  sus contribuciones, su verificación de la fórmula de transición y su interpretación.
- **El bloque 1 incluye además la patología de las categorías raras y las categorías
  suplementarias**: el montaje de «Stevia» (una sola persona fabrica un eje entero), la
  fórmula cerrada de la distancia al centroide, los cuatro remedios, la fórmula de la
  proyección suplementaria, la tabla de «los dos destinos de Stevia» y la asimetría
  conceptual activo/suplementario. Cierra con «los conceptos en versión humana» —baricentro,
  inercia, contribución, cos²— y el **protocolo de lectura profesional en cuatro pasos**.
- **El bloque 2 pasa a ser el FAMD de la guía**: el problema de mezclar, el truco de los dos
  bloques re-escalados, la propiedad de equilibrio (Σ r² + Σ η² = λ), el ejemplo numérico con
  las mismas ocho personas más tazas/día y horas de sueño, cómo se calculan el porcentaje de
  un eje, r² y η² (con la descomposición ANOVA y la SC_dentro tabla por tabla), las
  advertencias y alternativas, y los tres gráficos del FAMD con su orden de lectura: cuadrado
  de relaciones → círculo de correlaciones → mapa de individuos con baricentros.
- **El cierre pasa a ser el FAMD sobre la tabla del salón ya limpia.** Es la respuesta a
  «¿qué falta?»: entran las 12 cuantitativas que el PCA miró **y** las 16 no numéricas que la
  entrada limpió y agrupó —28 columnas de 31—; se muestra cuánta inercia se llevan los dos
  primeros ejes comparado con el 41,94 % del PCA; se leen los tres gráficos en el orden del
  protocolo; se aplican las contribuciones y el cos² como filtro antes de interpretar; se
  comprueba en vivo si alguna categoría de una sola persona —las dos que el paso 3b decidió
  no agrupar— fabricó un eje, y qué pasa al proyectarlas como suplementarias; y se proyectan
  como suplementarias las **marcas de celda inventada** para responder la pregunta que la
  entrada dejó abierta: si dejar cosas en blanco va con algo. Termina con el ticket de salida
  y el puente a la sesión 7.
- **BREAKING (estructura).** Se **elimina el bloque de segmentación**: la sesión 6 pasa de
  cinco bloques a **cuatro** —entrada, bloque 1, bloque 2 y cierre—. Es la primera sesión del
  curso con cuatro bloques. La dirección `#s6/bloque-3`, si alguien la guardó, abre la
  sesión en su entrada en vez de fallar. Las franjas se reparten de nuevo: la entrada
  conserva sus 78 minutos; los otros 102 se reparten entre MCA, FAMD y el cierre, que es el
  más largo del curso porque carga el análisis final.
- **Ninguna cifra se escribe a mano.** Los números del ejemplo de ocho personas —valores
  propios, coordenadas, contribuciones, cos², la corrección de Benzécri, los valores propios
  de Burt, la proyección de Stevia, r², η², las sumas de cuadrados— los produce un script de
  stdlib pura que comprueba sus propias identidades antes de escribirlos, y los bloques los
  interpolan. El FAMD del salón lo calcula el mismo script de la cadena de limpieza, con los
  mismos datos imputados y la misma semilla, y lo verifica el mismo verificador sin
  dependencias que ya audita el PCA.
- **Las figuras se redibujan, no se pegan.** Los SVG de la guía están en paleta clara y
  con coordenadas tecleadas; las figuras del curso se dibujan con los helpers de
  `src/svg/kit.js`, en la paleta del sitio, con las coordenadas salidas de los datos
  generados, y con los rótulos de eje que la entrada ya exige de las suyas.
- El componente de «Bloque en preparación» se queda sin uso y se retira.

## Capabilities

### New Capabilities

- `sesion-06-mca`: el bloque 1 — la matemática del MCA sobre el ejemplo de ocho personas,
  del punto de partida (la tabla disyuntiva) a las herramientas de interpretación, con el
  mapa factorial, la verificación de la fórmula de transición, la corrección de Benzécri y
  la equivalencia con Burt; y los conceptos en versión humana con el protocolo de lectura.
- `sesion-06-categorias-raras`: la segunda mitad del bloque 1 — la patología de las
  categorías raras (Stevia), la distancia al centroide en fórmula cerrada, los remedios, y
  las categorías suplementarias con sus dos destinos.
- `sesion-06-famd`: el bloque 2 — el FAMD sobre las mismas ocho personas con dos numéricas
  añadidas: el truco de los dos bloques, la propiedad de equilibrio verificada, cómo se
  calculan los porcentajes, r² y η², las advertencias, y los tres gráficos con su orden de
  lectura.
- `sesion-06-famd-del-salon`: el cierre — el FAMD aplicado a la tabla del salón ya limpia,
  leído con el protocolo del bloque 1 y los tres gráficos del bloque 2, comparado con el
  PCA de la entrada, con las categorías de una persona y las marcas de celda inventada como
  suplementarias; y el ticket de salida con el puente a la sesión 7.

### Modified Capabilities

- `sesion-06-estructura`: la sesión pasa de cinco bloques rotulados a cuatro (entrada,
  bloque 1, bloque 2, cierre); los identificadores de ruta válidos dejan de incluir
  `bloque-3`, y una dirección antigua a ese bloque abre la sesión sin error.
- `sesion-06-bloques-pendientes`: se retiran **todos** sus requisitos. Ya no hay bloques
  pendientes en la sesión 6: los tres bloques restantes tienen contenido, el de segmentación
  desaparece, y el aviso de «en preparación» no se muestra en ninguna parte.
- `sesion-06-figuras-rotuladas`: lo que hoy se exige solo de las figuras de la entrada
  —que cada eje diga qué mide y que a 390 px nada recorte ni desplace— pasa a exigirse de
  todas las figuras de la sesión 6.

## Impact

- **Código nuevo**: `src/sessions/s06/blocks/Block1.jsx`, `Block2.jsx` y `Closing.jsx`
  reescritos con contenido; `src/sessions/s06/figures/block1.js`, `block2.js` y
  `closing.js`; `src/sessions/s06/data/ejemplo.js` (generado: el ejemplo de ocho personas
  con sus tres montajes de MCA y su FAMD).
- **Código que desaparece**: `src/sessions/s06/blocks/Block3.jsx`, su `import()` en
  `src/sessions/registry.js`, el componente `Pendiente` de
  `src/components/content/index.jsx` y sus reglas en `src/styles/panel.css`.
- **Metadatos**: `src/sessions/s06/meta.js` pasa a cuatro bloques con franjas nuevas.
- **Scripts**: nuevo `scripts/ejemplo_mca_famd.py` (stdlib pura, reutiliza el Jacobi de
  `scripts/extract_gapminder.py`); `scripts/clean_salon.py` añade el paso 10, el FAMD del
  salón, y lo publica en `src/data/salon_limpio.js`; `scripts/check_salon.py` añade la
  comprobación del FAMD contra sus identidades; `scripts/check_figuras.mjs` pasa a
  recorrer las figuras de los cuatro bloques.
- **Datos**: `src/data/salon_limpio.js` gana `FAMD` (dos montajes: todo activo, y las dos
  categorías de una persona como suplementarias; en los dos, las marcas de celda inventada
  proyectadas como suplementarias). `salon.js` y `salon_limpio.xlsx` no cambian: el FAMD
  no es una decisión sobre los datos y no entra en la bitácora.
- **Documentación**: `README.md` (scripts, estructura, verificación, «seis construidas» ya
  sin bloques pendientes).
- **Dependencias**: **ninguna nueva**, ni en npm ni en los scripts. El ejemplo de juguete se
  calcula con Jacobi en stdlib; el FAMD del salón con el `numpy` que `feature-engine` ya
  trae al entorno virtual; las fórmulas se dibujan como SVG, igual que las de la sesión 5,
  sin motor de fórmulas.
- **Arquitectura**: se mantiene todo —rutas por hash, un `import()` por bloque, sin router
  ni gestor de estado, `base: './'`—. La única novedad estructural es una sesión con cuatro
  bloques, que el carril y el índice ya soportan porque recorren `meta.blocks` sin asumir su
  longitud.
