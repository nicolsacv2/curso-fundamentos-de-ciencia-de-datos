# Revisión de las sesiones 3 y 4 contra el conjunto de 27 respuestas

Tarea 3.5. Cada afirmación que las dos sesiones hacen sobre la tabla del salón,
revisada una por una contra `src/data/salon.js` regenerado. **Cierta** = sigue siendo
verdad y no se tocó. **Interpolada** = era verdad, el número cambió, ahora sale del
dato. **Reescrita** = los datos nuevos la desmentían.

## Sesión 3

| # | Afirmación | Dónde | Estado |
|---|---|---|---|
| 1 | «seis municipios» (escrituras de Bogotá) | `Intro.jsx` | **Interpolada** — siguen siendo 6, pero ya no está escrito |
| 2 | «con una, dos, tres y cinco personas cada uno» | `Intro.jsx` | **Reescrita** — los tamaños son 1, 3, 4 y 6 |
| 3 | «hay una [ciudad], con trece» | `Intro.jsx` | **Interpolada** — 13 → 16 |
| 4 | «de las trece personas… siete escribieron Cundinamarca» | `Intro.jsx` | **Interpolada** — 13 → 16; los 7 siguen siendo 7 |
| 5 | «nadie puso el municipio equivocado» | `Intro.jsx` | **Cierta**, con reserva — ver *Fontibón* abajo |
| 6 | «Siete de los trece bogotanos pusieron Cundinamarca» | `Block1.jsx` | **Interpolada** — 13 → 16 |
| 7 | «Siete de 23 dejaron la columna E vacía» | `Block1.jsx` | **Interpolada** — 7 → 8, 23 → 27 |
| 8 | «960 minutos, dieciséis horas» | `Block1.jsx` | **Cierta** — la fila 16 no se movió |
| 9 | `A1`=1234, `A11`/`A15`=9999, `I5`=O− | `Block1.jsx` | **Ciertas** — las tres coordenadas apuntan a lo mismo |
| 10 | «Sumas las veinte que hay y divides por veinte» | `Block2.jsx` | **Interpolada** — 20 → 23 respondidas |
| 11 | «Divides por 23 en vez de por 20» | `Block2.jsx` | **Interpolada** — 23 → 27, 20 → 23 |
| 12 | Las cuatro medias de limpieza | `Block2.jsx` | **Interpoladas** ya desde antes; los cuatro valores cambian |
| 13 | «sobre 23 filas» | `Block2.jsx` | **Interpolada** — 23 → 27 |
| 14 | Fila 16: 960 min, 0 porciones, 5 en balanceada | `Block2.jsx` | **Cierta** — la fila 16 es la misma |
| 15 | «Las trece filas de Bogotá, señaladas» | `Block3.jsx` | **Interpolada** — y el `mark` se deriva, no se enumera |
| 16 | «siete de ellas dicen Cundinamarca» | `Block3.jsx` | **Cierta** — siguen siendo 7 |
| 17 | «Los siete que contestaron en horas» + el 960 | `Block3.jsx` | **Cierta** — siguen siendo 7, y el 960 sigue en la 16 |
| 18 | «Un imposible y siete huecos» (columna E) | `Block3.jsx` | **Interpolada** — 7 → 8 huecos; el imposible sigue siendo la fila 1 |
| 19 | «Siete de 23 es casi un tercio de la clase» | `Block3.jsx` | **Interpolada** — 8/27 = 30 %, sigue siendo casi un tercio |
| 20 | `D2` dos respuestas, `D3` vacía, `D12` categoría inventada | `Block3.jsx` | **Ciertas** — ninguna fila nueva añadió coma ni vacío en D |
| 21 | Filas 1, 7 y 16 en porciones/balanceada | `Block3.jsx` | **Ciertas** — (3,1), (0,2), (0,5) sin cambio |
| 22 | «A mano se puede con 23 filas» | `Block3.jsx` | **Interpolada** — 23 → 27 |
| 23 | «No rellenamos las siete vacías de E» | `Closing.jsx` | **Interpolada** — 7 → 8 |
| 24 | «Las 23 respuestas tal como llegaron» | `figures/block3.js` | **Interpolada** — 23 → 27 |
| 25 | «Las siete vacías de la columna E» | `figures/block1.js` | **Interpolada** — 7 → 8 |
| 26 | «13 de 23 personas» y «SEIS ESCRITURAS» | `figures/intro.js` | **Interpoladas** — y los seis conteos de la figura salen del dato |

## Sesión 4

| # | Afirmación | Dónde | Estado |
|---|---|---|---|
| 27 | La caja de medidas de la columna F | `Block1.jsx` | **Interpolada** — todos los valores cambian salvo mediana, moda y rango |
| 28 | «la moda es doble, 3 y 4, con 9 personas cada una» | `Block1.jsx` | **Reescrita** — la columna H dejó de ser bimodal: la moda es 3, con 11 |
| 29 | «el 5 de la fila 16 no es cinco veces el 1 de la fila 1» | `Block1.jsx` | **Cierta** — las dos filas son las mismas |
| 30 | «una sola fila lo mueve 42 minutos» | `Block2.jsx` | **Reescrita** — son 36,4; ahora se calcula |
| 31 | «Desviación estándar… casi a la mitad» | `Block2.jsx` | **Reescrita** — cae 42 %, no la mitad. Se enuncia como «cae más que el promedio» (42 % contra 23 %), que es lo que la frase quería decir |
| 32 | «Rango… era, literalmente, esa fila» | `Block2.jsx` | **Cierta** — 959 → 419 sin cambio |
| 33 | «Mediana… no se movió ni un minuto» | `Block2.jsx` | **Cierta** — 120 → 120. La demo de robustez sobrevive entera |
| 34 | «el RIC apenas se entera» | `Block2.jsx` | **Cierta** — se mueve menos que antes (10 % contra 20 %) |
| 35 | «960 y 420 no dejan rastro en la mediana» | `Closing.jsx` | **Cierta** — los dos valores siguen en la columna |
| 36 | «hacen falta más de veintitrés filas» | `Closing.jsx` | **Interpolada** — 23 → 27 |
| 37 | «LAS 20 RESPUESTAS, EN ORDEN» | `figures/block1.js` | **Interpolada** — 20 → 23 |
| 38 | «los veinte valores de la columna F» (×2) | `figures/block1.js` | **Interpoladas** — 20 → 23 |

## Lo que apareció, y cómo se resolvió

**Fontibón (fila 27).** La respuesta nueva escribió `Fontibon` como municipio y
`Bogota.DC` como departamento. Fontibón no es un municipio: es una localidad de Bogotá
desde 1954.

Es un defecto **de otra clase** que los que la sesión 3 cataloga. No es una escritura
distinta del mismo nombre —como «Bogotá D.C.» o «Bogotá␣»—, sino una parte de la ciudad
puesta donde iba la ciudad. Y por eso **ninguna regla lo encuentra**: recortar, quitar
tildes y bajar a minúsculas operan sobre la cadena, y aquí la cadena no se parece a
«Bogotá» en nada. Lo que hace falta para corregirlo no está en la tabla.

**Se corrige a mano**, con la corrección declarada en `CORRECCIONES` dentro de
`scripts/extract_salon.py`, junto a su motivo. La tabla cruda **sigue diciendo
`Fontibon`** — `salon_v1_crudo` es intocable, que es la regla de oro del bloque 3 de la
sesión 3 — y lo que cambia son los recuentos derivados: **Bogotá pasa de 16 a 17**.

Eso obligó a reescribir dos cosas más de la sesión 3, anotadas arriba como #2b y #5:

| # | Afirmación | Dónde | Estado |
|---|---|---|---|
| 2b | «seis municipios» | `Intro.jsx` | **Reescrita** — son siete valores distintos: seis escrituras y uno corregido |
| 5 | «nadie puso el municipio equivocado» | `Intro.jsx` | **Reescrita** — uno sí lo puso, y es el que ninguna regla arregla |
| 26b | «SEIS ESCRITURAS · UNA CIUDAD · NINGUNA CELDA MAL ESCRITA» | `figures/intro.js` | **Reescrita** — «6 escrituras · 1 corregida a mano · una ciudad» |

La figura dibuja el valor corregido en una fila aparte, punteada y en rojo, precisamente
para que no se lea como una séptima manera de escribir «Bogotá».
