## Why

La tabla con la que abre la sesión 7 cruza «el cielo de hoy» con «el cielo de mañana» a lo
largo de un año inventado, y sus cifras no cuadran con su propia historia. Si cada fila es un
día y cada columna es el día que le sigue, cada día del año aparece una vez como «hoy» y una
vez como «mañana» —salvo el primero, que nunca es «mañana», y el último, que nunca es
«hoy»—. Así que la suma de la fila «sol» y la de la columna «sol» no pueden diferir en más de
uno. Hoy difieren en quince: 170 días de sol como «hoy» contra 155 como «mañana»; nublado
135 contra 125; lluvia 60 contra 85. La tabla se declaró a mano celda por celda, y nadie
comprobó que existiera un año que la produjera. No existe.

Además, los rótulos «hoy» y «mañana» confunden: en una clase que se da un día concreto,
«hoy» se lee como la fecha de la clase, y «mañana» como el día después. Lo que la tabla cruza
es el **día observado** con **el día siguiente**, y así tiene que llamarse en todas partes:
en la tabla, en las fórmulas, en las figuras y en el bloque 1, que dibuja la misma tabla.

## What Changes

- **La tabla deja de declararse celda por celda y pasa a contarse desde un año.** El script
  genera una secuencia de 365 días inventados —un estado del cielo por día, sorteado con una
  regla de transición declarada y una semilla fija— y cuenta los **364 pares de días
  consecutivos**. La tabla sale del recuento, así que sus márgenes cuadran por construcción:
  para cada estado, la suma como día observado y la suma como día siguiente difieren como
  máximo en uno, y la diferencia es exactamente si el primer día del año tenía ese estado y si
  el último lo tenía. El script lo comprueba antes de publicar, junto con todo lo que ya
  comprobaba.
- **La entrada muestra el año y explica la unidad.** Antes de la tabla se ve el año entero
  como una tira de 365 días coloreados por estado, con el primer y el último día señalados, y
  se dice que la unidad de la tabla es el **par de días consecutivos**: 365 días dan 364 pares.
  Junto a la tabla, las dos sumas de cada estado —como observado y como siguiente— se ponen
  lado a lado con su diferencia, y se dice por qué difieren en uno o en cero.
- **«Hoy» y «mañana» se sustituyen por «día observado» y «día siguiente»** en toda la
  sesión 7: cabeceras de tabla, notación de probabilidad condicional, rótulos de eje y de punto
  en las figuras, prosa de la entrada y del bloque 1, descripciones accesibles de las figuras,
  comentarios del archivo generado y del script, y el README. La pregunta que da nombre al
  ejemplo pasa a ser «si un día llueve, ¿llueve el día siguiente?». Las palabras «hoy» y
  «mañana» dejan de nombrar la tabla en la sesión; «hoy» solo queda donde de verdad significa
  el día de la clase.
- **El bloque 1 hereda la tabla nueva y los nombres nuevos.** Su análisis de correspondencias
  se recalcula sobre el recuento; las afirmaciones de su prosa que dependen de las cifras —qué
  filas y columnas nombran el eje 1, cuánto retiene, qué par fila–columna está más lejos— ya
  se construyen desde los datos, y las que no, se releen contra el resultado.
- La paradoja de Simpson, los bloques 2 y 3 y el cierre no cambian: no nombran la tabla del
  ejemplo.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `sesion-07-tablas-de-contingencia`: la tabla se cuenta desde una secuencia de días
  inventados y no se declara celda por celda; la unidad es el par de días consecutivos; los
  márgenes de cada estado cuadran entre sí y se dice por qué; el año se muestra; los rótulos
  son «día observado» y «día siguiente»; la probabilidad condicional se lee sobre la celda
  «llovió el día observado y llueve el siguiente»; el proceso que genera las cifras comprueba
  la consistencia de los márgenes.
- `sesion-07-correspondencias-simples`: la distancia chi-cuadrado y la transición se verifican
  sobre estados del **día observado**, no «de hoy»; los rótulos del mapa nombran el día
  observado y el día siguiente.

## Impact

- **Scripts**: `scripts/ejemplo_lluvia.py` —la tabla declarada se sustituye por la regla de
  transición, la semilla y la simulación del año; recuento de pares; asertos nuevos; salida
  con el año y los dos márgenes—. Sigue siendo stdlib pura.
- **Datos**: `src/sessions/s07/data/lluvia.js` regenerado: `ANIO` nuevo, `TABLA` con n = 364
  y los datos del primer y último día, `PERFILES`, `ESPERADAS`, `CHI2` y `CA` con las cifras
  nuevas; `SIMPSON` idéntico.
- **Código que cambia**: `src/sessions/s07/blocks/Intro.jsx` y `Block1.jsx` (nombres, la
  sección del año y la unidad, la comparación de márgenes, relectura de la prosa);
  `src/sessions/s07/figures/intro.js` (nombres; figura nueva del año) y `figures/block1.js`
  (nombres).
- **Documentación**: `README.md` (la descripción del ejemplo); los `Purpose` de
  `sesion-07-tablas-de-contingencia` y `sesion-07-correspondencias-simples`, que dicen «el
  cielo de hoy contra el cielo de mañana».
- **Dependencias y arquitectura**: sin cambios. `check_figuras.mjs` recoge la figura nueva
  solo porque existe.
