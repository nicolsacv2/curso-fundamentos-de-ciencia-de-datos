## Context

El curso es un React 18 + Vite 6 sin router ni gestor de estado, con rutas por hash y
exactamente cuatro dependencias. Las sesiones 1 a 4 fijaron el patrón: `sNN/meta.js` con
los metadatos, cinco bloques cargados con un `import()` cada uno desde
`src/sessions/registry.js`, y figuras que devuelven markup SVG desde `sNN/figures/*.js`
con los helpers de `src/svg/kit.js`.

La sesión 5 es la primera que necesita algo que ninguna anterior pidió: **una figura que
el usuario puede girar**, y **álgebra lineal** detrás de los números que dibuja. Todo el
diseño gira alrededor de conseguir las dos cosas sin añadir una quinta dependencia —cada
una es una pieza más que el builder de Hostinger tiene que resolver, y eso ya tumbó el
despliegue dos veces— y sin tocar el archivo del que dependen las cuatro sesiones ya
publicadas.

Ver `proposal.md` para el porqué y `specs/` para qué debe hacer el sistema.

## Goals / Non-Goals

**Goals:**

- Que la figura rotable herede gratis «Ampliar», Esc, la devolución del foco y el ajuste
  al ancho, en vez de reimplementarlos.
- Que los números del PCA sean auditables y no se calculen en el navegador durante la
  clase.
- Que el aislamiento entre sesiones se mantenga: abrir la 5 no debe cargar nada de las
  otras cuatro, y añadirla no debe cambiar cómo se comportan.

**Non-Goals:**

- No se generaliza nada: no se crea un componente rotable compartido ni un motor 3D. Lo
  que use una sola sesión se queda en esa sesión.
- No se toca `src/components/content/index.jsx`, del que dependen las cuatro sesiones ya
  publicadas.
- La rotación cambia el punto de vista, nunca los datos ni las componentes.

## Decisions

### La figura rotable envuelve `<Diagram>` en lugar de sustituirlo

`s05/views/Cloud3D.jsx` guarda `{yaw, pitch}` en `useState`, envuelve un `<Diagram>` en un
`div` con los manejadores de puntero y le pasa un `fig` memoizado sobre el ángulo. Al
cambiar el ángulo cambia la identidad de `fig`, el `useMemo` interno de `Diagram` se
invalida y el markup se redibuja.

Así, «Ampliar», Esc y el foco devuelto salen del `<Zoom>` que `Diagram` ya monta, y el
ajuste al ancho sale del CSS de `.diagram` que ya existe.

**Alternativa descartada:** un `<Rotatable>` en `components/content/`. Es el sitio natural
de un componente compartido, pero lo usaría una sola sesión y obligaría a tocar el archivo
del que dependen las cuatro anteriores. Se queda en `s05/views/`, siguiendo el precedente
de `s04/activities/`.

### El PCA se calcula fuera del navegador

`scripts/extract_gapminder.py` estandariza, calcula la matriz de covarianza y la
diagonaliza por el método de Jacobi —unas cuarenta líneas de stdlib, sin NumPy— y escribe
autovectores, autovalores, porcentajes y cargas en `s05/data/paises.js`. El navegador solo
dibuja. `scripts/check_pca.py` recalcula desde el CSV y falla si algo se desvía más de
0,01.

**Alternativa descartada:** calcular el PCA al montar el bloque. Serían unas líneas más de
JavaScript, pero pondría a depender de aritmética en vivo una figura que se proyecta en
clase.

### Dos PCA, no uno

La escena 3D dibuja tres indicadores y, dentro de ella, el plano de las dos primeras
componentes; ese plano tiene que ser el plano real *de esa nube*. El círculo del bloque 3,
en cambio, es de las cuatro variables. Los dos se rotulan en pantalla con su número de
variables.

No es un parche sino el puente narrativo: el bloque 2 termina diciendo que con una cuarta
variable ya no hay nube que dibujar —que es la maldición de la dimensionalidad— y el
bloque 3 arranca girando la tabla para mirar las cuatro a la vez.

**Alternativa descartada:** un único PCA de cuatro variables proyectando su plano sobre las
tres dimensiones visibles. Es correcto pero indefendible en clase: lo que se vería no sería
el plano sino su sombra, y la figura dejaría de demostrar lo que afirma.

### La cámara 3D es aritmética

`s05/figures/shared.js` expone `camera({yaw, pitch})`, que devuelve `[x,y,z] → [px,py]`:
dos rotaciones y una proyección ortográfica, con los puntos ordenados por profundidad para
que los de delante se dibujen encima.

**Alternativa descartada:** three.js. Es la respuesta obvia y es justo lo que la regla de
dependencias prohíbe: medio megabyte para dibujar 180 puntos y un paralelogramo.

### Las fórmulas se dibujan en SVG

Varianza, covarianza y Pearson salen de `figures/intro.js` como cualquier otra figura:
fracciones y sumatorios posicionados a mano, con `aria-label` describiendo la fórmula en
palabras.

**Alternativas descartadas:** KaTeX y MathJax son una quinta dependencia. MathML nativo no
añade ninguna, pero su tipografía cambia según el navegador, y aquí importa que se lea
igual en el proyector del salón que en el portátil de quien prepara la clase. HTML con
`<sup>`/`<sub>` no dibuja una fracción sin CSS nuevo.

### El ángulo no se guarda en ningún sitio

Vive en `useState` y muere con el desmontaje del bloque, que es lo que `Session.jsx` ya
hace al cambiar de pestaña. Así, «el ángulo no se conserva al salir del bloque» se cumple
sin escribir código, y «no se almacena nada en el navegador» se respeta porque no hay dónde
guardarlo.

`.rotor` lleva `touch-action: pan-y`: el gesto vertical sigue haciendo scroll y el
horizontal gira la figura. Se usan eventos de puntero, que cubren ratón y táctil por un
solo camino.

## Risks / Trade-offs

- **La nube 3D puede verse como ruido en la pared.** 180 puntos girando a tres metros →
  color por región y opacidad por profundidad; si aun así no se lee, reducir a una muestra
  de países y decirlo en pantalla.
- **El recorte de la tabla transpuesta no está resuelto** → se decide al dibujar el bloque
  3, con la condición de que siga leyéndose como la misma tabla girada.
- **Quince figuras nuevas es el bloque de trabajo más grande de las cinco sesiones** → si
  hay que recortar, el candidato es la segunda versión del histograma, nunca una pieza del
  hilo PCA.
- **La sesión 2 deja de coincidir con el curso original** → aceptado y anotado junto a la
  figura, que es el único sitio donde consta.

## Migration Plan

Las correcciones de las sesiones 2 y 4 van al final y en su propio commit, porque tocan
material ya publicado. El resto se construye en este orden: primero los datos
(`extract_gapminder.py` y `check_pca.py`), luego `meta.js` y el registry —la sesión existe
y abre vacía—, después la pieza de riesgo (`shared.js`, `cloud3d.js` y `Cloud3D.jsx`) antes
que ningún texto, y por último los cinco bloques en orden de sesión.

No hay estado persistido ni esquema que migrar. La vuelta atrás es revertir los commits:
la sesión 5 es aditiva salvo por esas dos correcciones, que se revierten por separado.
