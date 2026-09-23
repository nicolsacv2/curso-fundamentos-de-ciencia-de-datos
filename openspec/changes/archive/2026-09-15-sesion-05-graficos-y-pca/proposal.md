## Why

El curso son ocho sesiones de tres horas y hay cuatro construidas. La sesión 4 cierra con
una caja de resúmenes numéricos —centro, dispersión, asociación— y con el precio de cada
uno; falta la sesión que los vuelve dibujo: qué gráfico admite cada tipo de dato, cómo se
lee, y qué hacer cuando las variables son más de las que caben en un plano. Ese hueco es
el que llena la sesión 5, con el análisis de componentes principales como respuesta a la
última pregunta.

## What Changes

- Se añade la **sesión 5** completa al curso: entrada, tres bloques y cierre, con la misma
  estructura y las mismas etiquetas que las sesiones 1 a 4.
- La entrada encadena tres fórmulas —varianza, covarianza y correlación— antes de dibujar
  nada, porque el círculo de correlaciones del bloque 3 se apoya en la última.
- El bloque 1 cataloga cinco gráficos por tipo de dato y por pregunta; el bloque 2 presenta
  el PCA como la búsqueda de las direcciones en las que la nube se estira; el bloque 3 lee
  el círculo de correlaciones; el cierre enseña el reverso, gráficos que estorban.
- El material de los ejemplos **no es la tabla del salón**, sino cuatro indicadores por
  país de Gapminder. Es una decisión deliberada: con veintitrés filas no se aprende a
  elegir un gráfico.
- **BREAKING (contenido ya publicado).** Esa decisión rompe dos promesas que las sesiones
  2 y 4 hacen en pantalla —ambas anuncian que la tabla del salón se grafica en la 5—, así
  que este cambio incluye corregirlas. La figura de la sesión 2 deja de coincidir con la
  del curso original, y eso queda anotado junto a ella.
- Las figuras tridimensionales son rotables, y el comportamiento en pantalla —ajuste al
  ancho, diálogo de ampliación, foco, ausencia de almacenamiento— se fija como contrato,
  no como detalle de implementación.

## Capabilities

### New Capabilities

- `sesion-05-estructura`: la sesión existe en el índice, se divide en cinco bloques
  rotulados y anuncia su título, su gancho, su objetivo y la franja de minutos de cada
  bloque.
- `sesion-05-correlacion`: las tres fórmulas de la entrada y lo que se enuncia sobre
  ellas —unidades, cota, relación entre covarianza, varianza y desviación típica—.
- `sesion-05-catalogo-de-graficos`: los cinco gráficos del bloque 1, cada uno con su tipo
  de dato, su pregunta, su construcción y su ejemplo dibujado.
- `sesion-05-componentes-principales`: el PCA del bloque 2 — la nube rotable con su plano
  y sus proyecciones, las cargas, la varianza explicada, y la decisión entre analizar
  covarianzas o correlaciones.
- `sesion-05-circulo-de-correlaciones`: el círculo del bloque 3 — transponer, centrar y
  normalizar, el coseno del ángulo como correlación, y la longitud de la flecha como
  calidad de representación.
- `sesion-05-graficos-que-estorban`: los cuatro gráficos del cierre, qué impide entender
  cada uno, y el ticket de salida.
- `sesion-05-datos-gapminder`: el conjunto de los ejemplos — cuatro indicadores, un solo
  año, acreditado en pantalla y compartido por la entrada y los tres bloques.
- `material-publicado`: lo que las sesiones 2 y 4 dejan de prometer, y la constancia de
  que el texto de la 2 ya no coincide con el del curso original.
- `figuras-interactivas`: cómo se comportan las figuras en pantalla — ajuste al ancho,
  «Ampliar», Esc, devolución del foco, rotación, y qué no se guarda.

### Modified Capabilities

Ninguna: `openspec/specs/` está vacío (`openspec list --specs` → «No specs found»), así
que las nueve capacidades anteriores se crean de cero.

## Impact

- **Código nuevo**: `src/sessions/s05/` entero —`meta.js`, los cinco bloques, sus figuras,
  sus datos— y su entrada en `src/sessions/registry.js`, con un `import()` por bloque.
- **Código ya publicado**: `src/sessions/s02/figures/block3.js` (la flecha retirada) y
  `src/sessions/s04/blocks/Closing.jsx` (lo que deja de prometer).
- **Datos**: `src/sessions/s05/data/paises.js`, generado desde el CSV de Gapminder por
  `scripts/extract_gapminder.py` y verificado por `scripts/check_pca.py`.
- **Dependencias**: ninguna nueva. Las figuras 3D se dibujan con los helpers de
  `src/svg/kit.js`, no con una librería de gráficos.
- **Sin impacto** en despliegue, rutas ni arquitectura: la sesión 5 usa el mismo esquema
  de rutas por hash y el mismo `base: './'` que las cuatro anteriores.
