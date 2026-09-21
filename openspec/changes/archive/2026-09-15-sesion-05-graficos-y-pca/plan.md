# Plan 001 — Sesión 5: gráficos y reducción de dimensiones

Plan de implementación de `spec.md` (79 requisitos, aprobada). La spec dice **qué**;
esto dice **cómo**, y cada parte declara qué RF cubre. Nada aquí contradice
`docs/constitution.md`: donde una decisión roza un principio, se dice cuál y por qué no
lo rompe.

---

## 1. Estructura de módulos

### 1.1 Módulos nuevos

```
src/sessions/s05/
├── meta.js                 título, gancho, objetivo, bloques y franjas
├── data/
│   └── paises.js           GENERADO — indicadores, PCA y cargas precalculados
├── figures/                funciones puras: reciben datos, devuelven markup SVG
│   ├── shared.js           helpers locales de esta sesión (incluida la cámara 3D)
│   ├── intro.js            fórmulas y primer diagrama de dispersión
│   ├── block1.js           los cinco gráficos y sus construcciones
│   ├── block2.js           antes/después, varianza explicada, dimensionalidad
│   ├── block3.js           tabla, transpuesta, círculo y los tres ángulos
│   ├── closing.js          los cuatro gráficos basura
│   └── cloud3d.js          la nube rotable: markup en función del ángulo
├── views/
│   └── Cloud3D.jsx         el único componente con estado de la sesión
└── blocks/
    ├── Intro.jsx  Block1.jsx  Block2.jsx  Block3.jsx  Closing.jsx
```

```
scripts/
├── extract_gapminder.py    genera data/paises.js desde un CSV local
└── check_pca.py            recalcula el PCA y lo compara con lo generado
```

`figures/` no importa React y `views/` no dibuja: es el principio 3 tal cual. La cámara
3D —rotar un punto y proyectarlo— es aritmética, así que vive en `figures/shared.js`,
no en el `.jsx`.

### 1.2 Módulos que se modifican

| Archivo | Cambio | RF |
|---|---|---|
| `src/sessions/registry.js` | `import meta05`, entrada en `METAS`, cinco `import()` en `BLOCKS[5]` | RF-1, RF-2 |
| `src/sessions/s02/figures/block3.js` | quitar la caja «SESIÓN 5 · se grafica»; comentario explicando la divergencia | RF-64, RF-65, RF-66 |
| `src/sessions/s04/blocks/Closing.jsx` | reescribir la frase final de «Lo que queda» | RF-67, RF-68 |
| `src/styles/panel.css` | una regla `.rotor` (cursor y `touch-action`) | RF-76, caso límite 10 |

`src/data/syllabus.js` **no se toca**: su comentario dice que las entradas solo cubren
las sesiones aún no construidas, y `Cover.jsx` ya prefiere `meta.js` cuando existe. La
entrada 5 de `syllabus.js` queda muerta por diseño, igual que quedaron las de las
sesiones 1 a 4.

### 1.3 Un `import()` por bloque

`BLOCKS[5]` repite el patrón exacto de las cuatro sesiones anteriores: cinco flechas,
cinco chunks. `Cloud3D.jsx` lo importan estáticamente `Block1.jsx` y `Block2.jsx`, que
son chunks distintos: Vite lo emitirá como chunk compartido entre esos dos, y el bloque
3 y el cierre no lo descargan.

---

## 2. Datos: de dónde salen los números

### 2.1 `scripts/extract_gapminder.py` → `src/sessions/s05/data/paises.js`

Cuatro indicadores por país (RF-56), todos del mismo año (RF-57): PIB per cápita,
esperanza de vida, fertilidad y mortalidad infantil. El script lee un CSV de Gapminder
descargado a mano al lado del repositorio —igual que `extract_salon.py` lee el `.xlsx`
del formulario— y emite un módulo con cabecera «do not edit by hand».

Descarta los países a los que les falte cualquiera de las cuatro series, e imprime
cuántos entraron y cuántos se cayeron: sin ese recuento, un país ausente pasa por
inexistente.

El módulo generado exporta:

| Export | Contenido | RF |
|---|---|---|
| `ANIO` | el año único de los cuatro indicadores | RF-57, RF-58 |
| `VARS` | clave, nombre en pantalla, unidad y una línea de qué mide | RF-61 |
| `PAISES` | un registro por país con los cuatro valores | RF-56, RF-60 |
| `PCA3` | autovectores, autovalores y % de varianza de las **tres** variables de la nube | RF-26, RF-29, RF-59 |
| `PCA4` | lo mismo para las **cuatro**, más las cargas de cada variable | RF-26, RF-41, RF-42 |
| `FUENTE` | nombre del conjunto y su licencia, para el crédito | RF-63 |

### 2.2 Por qué dos PCA y no uno

La escena 3D dibuja tres indicadores (RF-59) y dentro de ella el plano de las dos
primeras componentes (RF-29). Ese plano tiene que ser el plano real *de esa nube*, o el
bloque 2 estaría enseñando una sombra y llamándola componente principal. El círculo del
bloque 3, en cambio, es de las cuatro variables (RF-41).

Lejos de ser un parche, es el puente narrativo entre los bloques: el bloque 2 termina
diciendo que con una cuarta variable ya no hay nube que dibujar —que es exactamente la
maldición de la dimensionalidad (RF-34)— y el bloque 3 arranca girando la tabla para
poder mirar las cuatro a la vez. Ambos PCA se rotulan en pantalla con su número de
variables para que nadie los confunda.

**Alternativa descartada:** un único PCA de cuatro variables, proyectando su plano sobre
las tres dimensiones visibles. Es correcto pero indefendible en clase: lo que se vería
no sería el plano, sino su sombra, y la figura del bloque 2 dejaría de demostrar lo que
afirma.

---

## 3. Secciones de cada bloque

### 3.1 Entrada — «Entender los datos visualmente» · 0–35 (RF-3 a RF-6)

| Sección | Contenido | RF |
|---|---|---|
| Gancho y encuadre | la frase de RF-4; qué conjunto se usa y de qué año | RF-4, RF-58, RF-63 |
| Los cuatro indicadores | qué mide cada uno, en `<Cards>` | RF-61 |
| Las tres fórmulas | varianza, covarianza y Pearson, dibujadas en una sola figura | RF-7, RF-8, RF-9 |
| La cadena | covarianza consigo misma = varianza; desviación típica = raíz de varianza; correlación = covarianza normalizada | RF-10, RF-11, RF-12 |
| Qué se gana al normalizar | sin unidades, y acotada entre −1 y +1 | RF-13, RF-14 |
| Dónde se lee | dispersión esperanza de vida ~ fertilidad, con su r | RF-15, RF-16 |

### 3.2 Bloque 1 — los cinco gráficos · 35–75 (RF-17 a RF-22)

Cada gráfico es una ficha con la misma estructura de cuatro casillas —dato que admite,
pregunta que responde, cómo se construye, ejemplo dibujado— para que la comparación
entre los cinco sea inmediata (RF-18, RF-19, RF-20, RF-21).

| Gráfico | Ejemplo con los datos de la sesión | Construcción que se enseña |
|---|---|---|
| Barras | esperanza de vida media por región | una barra por categoría, longitud = valor |
| Circular | reparto de países por región | ángulo proporcional al total; por qué falla al comparar |
| Caja | fertilidad por región | los cinco números de la sesión 4: mediana, cuartiles, bigotes |
| Histograma | PIB per cápita | **elegir el ancho del intervalo**, y el mismo dato con dos anchos |
| Dispersión | PIB ~ esperanza de vida | un punto por país; se retoma lo nombrado en la entrada |

El histograma es el que carga el caso límite 8: se muestran dos anchos del mismo dato
para que la elección se vea como decisión, no como receta.

Cierra la nube 3D (RF-22): los mismos países, tres ejes, y la invitación a girarla.

### 3.3 Bloque 2 — componentes principales y dimensionalidad · 83–120 (RF-23 a RF-35)

| Sección | Contenido | RF |
|---|---|---|
| La dirección que más estira | la nube y la primera componente | RF-23 |
| Cómo se encuentra | matriz de covarianza, autovector, autovalor — nombrados, no desarrollados | RF-24 |
| La misma nube, girada | antes y después de proyectar | RF-25 |
| Cuánto conserva | varianza explicada por componente | RF-26 |
| Qué es una componente | combinación de las originales, no una de ellas | RF-27 |
| La figura rotable | plano, proyección de puntos, vectores y sus proyecciones | RF-28 a RF-33 |
| La cuarta variable | ya no hay nube que dibujar: la maldición | RF-34, RF-35 |

### 3.4 Bloque 3 — círculo de variables · 128–166 (RF-36 a RF-47)

| Sección | Contenido | RF |
|---|---|---|
| La tabla y su transpuesta | 4 × N junto a N × 4, con el recorte del caso límite 12 | RF-36, RF-37 |
| Cada variable, un vector | la variable-registro como flecha | RF-38 |
| El ángulo | lo que separa dos de esos vectores es lo que el círculo dibuja | RF-39 |
| Dos vistas | individuos en el plano, variables en el círculo | RF-40 |
| El círculo | las cuatro cargas dibujadas | RF-41 |
| Coseno y correlación | y la remisión a la fórmula de la entrada | RF-42, RF-47 |
| Los tres ángulos | 0°, 90° y 180° con su correlación | RF-43, RF-44, RF-45 |
| Flechas cortas | longitud = calidad de representación (caso límite 5) | RF-46 |

### 3.5 Cierre — gráficos basura · 166–180 (RF-48 a RF-55)

Cuatro parejas «así no / así sí», todas con los datos de la sesión, más el ticket.

| Sección | Contenido | RF |
|---|---|---|
| 3D que sobra | el mismo dato en 3D y en 2D | RF-48, RF-49 |
| Ejes sin nombre | qué se pierde sin etiquetas | RF-50, RF-53 |
| Sin ejes | el gráfico que no se puede leer | RF-51, RF-53 |
| Sobrecargado | los 180 países rotulados a la vez | RF-52, RF-53 |
| Ticket de salida | y ninguna tarea para la sesión 6 | RF-54, RF-55 |

El 3D del cierre resuelve el caso límite 9 nombrando la diferencia: el del bloque 2 se
gira y por eso enseña de dónde sale una proyección; el del cierre es una foto fija de
algo que cabía en dos ejes.

---

## 4. Decisiones técnicas

### 4.1 La figura rotable reutiliza `<Diagram>`

`Cloud3D.jsx` guarda `{yaw, pitch}` en `useState`, envuelve un `<Diagram>` en un `div`
con los manejadores de puntero, y le pasa `fig={useCallback(() => cloud3d(datos,
{yaw, pitch, ...}), [yaw, pitch])}`. Al cambiar el ángulo cambia la identidad de `fig`,
el `useMemo` interno de `Diagram` se invalida y el markup se redibuja.

- Gratis: «Ampliar», Esc y el foco devuelto al botón (RF-70, RF-71, RF-72), porque son
  del `<Zoom>` que `Diagram` ya monta.
- Gratis: el ajuste al ancho sin scroll horizontal (RF-69), que es del CSS de `.diagram`.
- `components/content/index.jsx` no se toca, así que ninguna otra sesión se entera.

**Alternativa descartada:** un componente `<Rotatable>` en `components/content/`. Es el
sitio natural para un componente compartido, pero lo usaría una sola sesión y obligaría
a tocar el archivo del que dependen las cuatro anteriores. Se queda en `s05/views/`,
siguiendo el precedente de `s04/activities/`.

### 4.2 Las fórmulas se dibujan en SVG

Varianza, covarianza y Pearson (RF-7 a RF-9) salen de `figures/intro.js` como cualquier
otra figura: fracciones y sumatorios posicionados a mano, con `aria-label` describiendo
la fórmula en palabras.

**Alternativas descartadas:** KaTeX o MathJax violan el principio 1 —una quinta
dependencia, y de las que rompieron el despliegue dos veces—. MathML nativo no añade
dependencia, pero su tipografía cambia según el navegador, y aquí lo que importa es que
se lea igual en el proyector del salón que en el portátil de quien prepara la clase.
HTML con `<sup>`/`<sub>` no dibuja una fracción sin CSS nuevo.

### 4.3 El PCA se calcula fuera del navegador

`extract_gapminder.py` estandariza, calcula la matriz de covarianza y la diagonaliza con
el método de Jacobi (unas cuarenta líneas de stdlib, sin NumPy), y escribe autovectores,
autovalores, porcentajes y cargas en `data/paises.js`. El navegador solo dibuja.

- Respeta el «Fuera de alcance» de la spec: la rotación cambia el punto de vista, nunca
  los datos ni las componentes.
- Los números de RF-26 salen del conjunto real y son auditables (caso límite 11).
- El chunk del bloque 2 no carga álgebra que no necesita.

**Alternativa descartada:** calcular el PCA en el navegador al montar el bloque. Serían
unas líneas más de JavaScript, pero pondría a depender de aritmética en vivo una figura
que se proyecta en clase, y la spec ya lo dejó fuera de alcance.

### 4.4 La cámara 3D es aritmética, no una biblioteca

`figures/shared.js` expone `camera({yaw, pitch})`, que devuelve una función
`[x,y,z] → [px,py]`: dos rotaciones y una proyección ortográfica. Ordena los puntos por
profundidad antes de emitirlos, para que los de delante se dibujen encima.

**Alternativa descartada:** three.js. Es la respuesta obvia y es exactamente lo que el
principio 1 prohíbe: una quinta dependencia, medio megabyte, para dibujar 180 puntos y
un paralelogramo.

### 4.5 Rotación sin secuestrar el scroll

`.rotor` lleva `touch-action: pan-y`: el gesto vertical sigue haciendo scroll y el
horizontal gira la figura (caso límite 10). Se usan eventos de puntero, que cubren ratón
y táctil con un solo camino. Sin puntero no pasa nada: la figura se queda en su ángulo
inicial, que es el que ya enseña el plano y las proyecciones (RF-77, RF-79).

El ángulo vive en `useState` y muere con el desmontaje del bloque, que es lo que
`Session.jsx` hace al cambiar de pestaña: RF-78 se cumple sin escribir nada, y el
principio 5 se respeta porque no hay dónde guardarlo (RF-74).

### 4.6 Todo se dibuja aquí

Ninguna imagen externa (RF-73), así que la sesión entera funciona sin red (RF-75) y no
toca `src/assets/`. Cada `id` de `<defs>` lleva prefijo `s5-` para no colisionar con los
marcadores de las otras sesiones.

---

## 5. Estrategia de verificación

Este repositorio no tiene runner de tests ni linter: `pnpm build` es la única
comprobación automática que existe, y la constitución exige que ninguna verificación
pida red, Docker ni base de datos. La estrategia respeta eso y añade **un** script de
stdlib para lo único que un humano no puede comprobar a ojo: si los números son ciertos.

### 5.1 Automático

| Comprobación | Qué cubre |
|---|---|
| `pnpm build` | compila; el registry resuelve los cinco `import()` |
| `python3 scripts/check_pca.py` | recalcula el PCA desde el CSV y lo compara con `data/paises.js`; falla si algún autovalor, porcentaje o carga se desvía más de 0,01 (RF-26, RF-56, RF-57, RF-59) |
| `grep -rl "from 'react'" src/svg src/sessions/*/figures` | vacío: principio 3 |
| `grep -rn "localStorage\|document.cookie" src/` | vacío: principio 5, RF-74 |
| `package.json` | cuatro dependencias: principio 1 |
| `grep -c 'id="s5-' src/sessions/s05/figures/*.js` | ningún id sin prefijo de sesión |

### 5.2 Manual guionizado

Cada punto es un recorrido, no una impresión:

1. **Índice.** La sesión 5 aparece con su título, objetivo y las cinco franjas de
   minutos. → RF-1, RF-3, RF-5, RF-6
2. **Las cinco pestañas.** Se recorren en orden; cada una carga su chunk. → RF-2
3. **Contenido bloque a bloque**, lista en mano contra §3: cada RF de texto se localiza
   en pantalla. → RF-7 a RF-55, RF-58, RF-61, RF-63
4. **Rotación.** Arrastrar en el bloque 1 y en el bloque 2 gira la nube; el plano, las
   proyecciones y los vectores giran con ella. → RF-22, RF-28 a RF-33, RF-76
5. **Ángulo de reposo.** Recargar y no tocar nada: el plano y las proyecciones ya se
   ven. Cambiar de bloque y volver: el ángulo es de nuevo el inicial. → RF-77, RF-78
6. **A 390 px.** Las quince figuras, sin scroll horizontal; el gesto vertical hace
   scroll sobre la nube en vez de girarla. → RF-69, caso límite 10
7. **Ampliar.** En cada figura: abre, Esc cierra, el foco vuelve al botón. → RF-70,
   RF-71, RF-72
8. **Sin red.** DevTools en offline, recorrido completo: nada falta. → RF-73, RF-75
9. **Correcciones.** La figura de la sesión 2 ya no promete la 5 y conserva sus otros
   tres destinos; el cierre de la 4 anuncia lo que la 5 hace. → RF-64, RF-65, RF-67,
   RF-68
10. **El comentario de la divergencia** está junto a la figura corregida. → RF-66
11. **Sin tarea.** El cierre no pide nada para la sesión 6. → RF-55
12. **Tabla del salón ausente.** No aparece en ningún bloque de la sesión 5. → RF-62

### 5.3 Orden de trabajo

1. `extract_gapminder.py` y `check_pca.py`; fijar el año y ver cuántos países quedan.
2. `meta.js` y el registry: la sesión existe y abre vacía. → RF-1 a RF-6
3. `figures/shared.js` y `cloud3d.js` + `views/Cloud3D.jsx`: la pieza de riesgo, antes
   que ningún texto.
4. Los cinco bloques, en orden de sesión.
5. Las correcciones de las sesiones 2 y 4, al final y en su propio commit: tocan
   material ya publicado.

---

## 6. Trazabilidad

Cada requisito, dónde se implementa y dónde se comprueba.

| RF | Dónde | Verificación |
|---|---|---|
| RF-1 | `registry.js` (METAS) | 5.2.1 |
| RF-2 | `registry.js` (BLOCKS[5]), `meta.js` | 5.2.2 |
| RF-3, RF-5 | `meta.js` `title`, `goal` | 5.2.1 |
| RF-4 | `meta.js` `hook`, `blocks/Intro.jsx` | 5.2.3 |
| RF-6 | `meta.js` `blocks[].clock` | 5.2.1 |
| RF-7 a RF-9 | `figures/intro.js` | 5.2.3 |
| RF-10 a RF-14 | `blocks/Intro.jsx` | 5.2.3 |
| RF-15, RF-16 | `figures/intro.js`, `blocks/Intro.jsx` | 5.2.3 |
| RF-17 a RF-21 | `figures/block1.js`, `blocks/Block1.jsx` | 5.2.3 |
| RF-22 | `figures/cloud3d.js`, `views/Cloud3D.jsx` | 5.2.4 |
| RF-23 a RF-27 | `figures/block2.js`, `blocks/Block2.jsx` | 5.2.3 |
| RF-28 a RF-33 | `figures/cloud3d.js`, `views/Cloud3D.jsx` | 5.2.4 |
| RF-34, RF-35 | `blocks/Block2.jsx` | 5.2.3 |
| RF-36 a RF-47 | `figures/block3.js`, `blocks/Block3.jsx` | 5.2.3 |
| RF-48 a RF-54 | `figures/closing.js`, `blocks/Closing.jsx` | 5.2.3 |
| RF-55 | `blocks/Closing.jsx` (ausencia de `<Task>` de tarea) | 5.2.11 |
| RF-56, RF-57 | `extract_gapminder.py` → `data/paises.js` | `check_pca.py` |
| RF-58 | `data/paises.js` (`ANIO`), visible en cada bloque | 5.2.3 |
| RF-59 | `data/paises.js` (`PCA3`), `cloud3d.js` | `check_pca.py` |
| RF-60 | los cinco bloques importan `data/paises.js` | 5.2.3 |
| RF-61 | `data/paises.js` (`VARS`), `blocks/Intro.jsx` | 5.2.3 |
| RF-62 | ningún import de `s03`/`s04` en `s05` | 5.2.12 |
| RF-63 | `data/paises.js` (`FUENTE`), pie de cada figura | 5.2.3 |
| RF-64, RF-65 | `s02/figures/block3.js` | 5.2.9 |
| RF-66 | comentario en `s02/figures/block3.js` | 5.2.10 |
| RF-67, RF-68 | `s04/blocks/Closing.jsx` | 5.2.9 |
| RF-69 | CSS `.diagram` existente | 5.2.6 |
| RF-70 a RF-72 | `<Zoom>` dentro de `<Diagram>` | 5.2.7 |
| RF-73, RF-75 | ausencia de `<Plate>` en `s05` | 5.2.8 |
| RF-74 | sin almacenamiento; ángulo en `useState` | grep 5.1 |
| RF-76 | `views/Cloud3D.jsx`, `.rotor` | 5.2.4 |
| RF-77 | ángulo inicial en `cloud3d.js` | 5.2.5 |
| RF-78 | desmontaje del bloque en `Session.jsx` | 5.2.5 |
| RF-79 | `cloud3d.js` dibuja sin interacción | 5.2.5 |

---

## 7. Riesgos

1. **La legibilidad de la nube 3D en la pared.** 180 puntos girando pueden verse como
   ruido a tres metros. Mitigación: color por región y opacidad por profundidad; si aun
   así no se lee, reducir a una muestra de países y decirlo en pantalla.
2. **El recorte de la transpuesta** (caso límite 12) no está resuelto: se decide al
   dibujar el bloque 3, y la spec exige que siga leyéndose como la misma tabla girada.
3. **Quince figuras nuevas** es el bloque de trabajo más grande de las cinco sesiones.
   Si hay que recortar, el candidato es la segunda versión del histograma, no ninguna
   pieza del hilo PCA.
4. **La sesión 2 deja de coincidir con el curso original.** Está aceptado (RF-66): la
   divergencia queda anotada junto a la figura, que es el único sitio donde consta.
