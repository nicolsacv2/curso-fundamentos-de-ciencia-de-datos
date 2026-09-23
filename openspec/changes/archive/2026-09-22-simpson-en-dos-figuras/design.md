## Context

`simpson()` en `src/sessions/s07/figures/intro.js` dibuja seis barras en tres grupos con una
sola escala: jóvenes, mayores y «los dos grupos juntos», con la proporción que mejora encima
de cada barra y «X de Y» debajo. En `Intro.jsx` la sección va: prosa → par de tablas de grupo
→ tabla total → figura → par de prosa con la explicación. Las cifras vienen de `SIMPSON` en
`lluvia.js`, con `pMejora`, `mejora`, `total`, `personas` y `pAlta` ya calculados y la
inversión ya comprobada por el script.

## Goals / Non-Goals

**Goals:**

- Que la paradoja se lea como sorpresa: primero la pregunta ingenua sobre el total, después
  la respuesta por grupo.
- Dos figuras que se comparen a ojo: misma escala, mismos colores, mismos rótulos.

**Non-Goals:**

- No se tocan los datos ni el script; no cambian las cifras.
- No se cambia la explicación final («¿asociado con qué, dentro de qué?») ni las tablas.

## Decisions

### D1 · Dos funciones, un mismo trazado

`simpson()` se sustituye por `simpsonTotal()` y `simpsonGrupos()`, las dos exportadas desde
`intro.js` con ids `ar-s7-in-`. Comparten un ayudante interno que dibuja la rejilla de 0 a
100, las barras de una pareja de dosis con su porcentaje encima y su «X de Y» debajo, y el
título de la pareja. Así la escala, el ancho de barra y los colores son los mismos por
construcción, no por copia.

- `simpsonTotal()`: una pareja —dosis alta y dosis baja del total— centrada, con el título
  «los dos grupos juntos · N personas» y el rótulo «¿QUÉ DOSIS ES MEJOR?». Debajo, una línea
  que dice lo que la figura parece decir: que la dosis baja mejora más, con los dos
  porcentajes interpolados.
- `simpsonGrupos()`: dos parejas —una por grupo— con «grupo · N personas» encima de cada una,
  el rótulo «LAS MISMAS PERSONAS, SEPARADAS POR EDAD», y debajo la frase de la paradoja: en
  cada grupo la dosis alta mejora más, y por qué el total dice lo contrario (quién recibió
  qué). La frase se arma con las cifras de `SIMPSON`, como hoy.

Colores: las barras del total en `C.reveal` y las de los grupos en `C.ask`, como ahora; la
dosis baja va con menor opacidad, también como ahora. `H` se calcula igual en las dos para
que las barras midan lo mismo en pantalla.

*Alternativa.* Una sola función con un parámetro (`simpson('total')`): rechazada porque
`Diagram` recibe la función por referencia y `check_figuras.mjs` recorre las exportaciones
sin argumentos; dos exportaciones entran en la comprobación por existir.

### D2 · El orden de la sección

`Intro.jsx`, sección «La deuda de la sesión 4»: prosa de apertura → tabla total (con la fila
de dosis baja señalada como la que «gana») → `Diagram simpsonTotal` con la pregunta en el pie →
una `Prose` corta que dice «ahora separen por edad» → par de tablas de grupo → `Diagram
simpsonGrupos` → el par de prosa con «Por qué se da la vuelta» y «La pregunta correcta», que
no cambia.

### D3 · Cada símbolo, definido donde se usa

En `fPerfiles()`, la primera sección («El perfil de una fila») pasa de dos igualdades a tres:
r_ij = n_ij / n_i·, m_i = n_i· / n y **c_j = n_·j / n**, con la glosa ampliada: «…y c_j es el
perfil promedio: la columna sobre el total, el centroide». La línea de ejemplo, que ya
imprime el centroide, lo nombra: «c = (0,425, …)». Así, cuando la sección siguiente divide por
c_j, el símbolo ya está en la pared una sección más arriba, y la glosa de la distancia lo
repite en palabras («el centroide de esa columna, c_j»).

En `fTransicionCA()`, la glosa de «De las columnas a la fila» define el símbolo de la vuelta:
«c_ji es el perfil de columna, n_ij / n_·j: la columna j repartida entre las filas, como r_ij
es la fila repartida entre las columnas; no es el c_j de la distancia, que es una sola cifra
por columna». La línea de ejemplo no cambia.

*Por qué no se renombra.* Usar c para columnas y r para filas es la notación habitual del
análisis de correspondencias y la de la guía; cambiar una letra aquí desconectaría la pared de
cualquier libro. La colisión se resuelve diciendo que existe.

*Marco.* La línea de tres igualdades es más ancha que la de dos; `check_figuras.mjs` mide el
ancho compuesto y falla si sale de los 980 px, y a 390 px la figura escala entera.

### D4 · El tipógrafo avanza por glifo

`measure()` y `row()` en `s07/figures/shared.js` y en `s06/figures/shared.js` usan hoy un
avance fijo por carácter (`ADV.serif = 0.5` em). Pasan a sumar el avance de cada glifo desde
una tabla `ANCHO` para la serif: anchas —m, w, M, W y el radical √— a 0,85 em; estrechas —i, j, l, t, f, r,
′, ·, paréntesis, coma, punto, 1— a 0,33; el resto a 0,5. Un ayudante `avance(texto, fs, ff)`
hace la suma y lo usan las dos funciones, así que el subíndice, que se coloca en
`cur + w + 1`, cae tras el borde real de la letra, y las fracciones que las figuras colocan
midiendo el texto anterior siguen alineadas con lo dibujado. La mono conserva su 0,6 fijo:
es monoespaciada.

*Alternativa.* Medir con el navegador (`getComputedTextLength`): rechazada porque las figuras
se generan como cadenas sin DOM y `check_figuras.mjs` las evalúa en Node. La estimación no
tiene que ser exacta; tiene que ser consistente entre medir y dibujar, que es lo que hoy
falla solo en las letras que se apartan del medio em.

*Alcance.* Sesiones 6 y 7, las dos copias que recorre `check_figuras.mjs`. La copia de la
sesión 5 (`s05/figures/intro.js`) se deja como está, por decisión del usuario.

## Risks / Trade-offs

- **La figura del total, sola, puede leerse como una afirmación falsa** («la dosis baja es
  mejor»). → Su pie y su rótulo lo formulan como pregunta, y la figura siguiente está en la
  misma pantalla; la prosa entre las dos dice explícitamente que la primera engaña.
- **Cambiar el avance mueve todas las fórmulas de las dos sesiones unos píxeles.** →
  `check_figuras.mjs` mide el ancho compuesto de cada línea con la misma estimación y falla
  si algo sale del marco; las fórmulas se revisan a ojo en el preview.
- **Dos figuras ocupan más pared.** → Cada una es más baja que la de seis barras; el total
  de alto crece poco.

## Migration Plan

- Sin migración: cambian tres archivos de la sesión 7 y el tipógrafo compartido de las
  sesiones 6 y 7. Antes de mergear: `pnpm build`,
  `node scripts/check_figuras.mjs`, revisión a 390 px y de «Ampliar» en la entrada.
- Vuelta atrás: revertir el commit.
