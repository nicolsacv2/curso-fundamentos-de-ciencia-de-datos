# API de Actividades — especificación

El único servicio que el frontend conoce. Guarda todo en Supabase (ver el esquema en
[`README.md`](README.md)), le pide el SVG a la API de Render y responde
`{ …estado, render }`. Convenciones comunes (errores, CORS, keys): en el README.

Cliente de referencia: `src/sessions/s04/activities/api.js` (las formas de respuesta
de este documento y las de su mock son las mismas, a propósito).

---

## Clase (instructor)

### `POST /v1/class-sessions` 🔑

Activa la clase. Header `X-Activation-Key` obligatorio.

```json
// petición (opcional)
{ "ttl_minutes": 240 }

// 201
{ "class_session": { "id": "…", "started_at": "2026-09-07T13:00:00Z", "expires_at": "2026-09-07T17:00:00Z" } }
```

Si ya hay una clase activa responde `200` con la existente (idempotente: reactivar no
duplica).

```sh
curl -X POST https://API/v1/class-sessions \
  -H "X-Activation-Key: $KEY" -H "Content-Type: application/json" \
  -d '{"ttl_minutes": 240}'
```

### `GET /v1/class-sessions/current`

Sin key. `200 { "class_session": {…} }` o `200 { "class_session": null }`. Le sirve
al frontend para distinguir «no hay clase» de «no hay red».

### `DELETE /v1/class-sessions/current` 🔑

Cierra la clase (`closed_at = now()`). Los datos quedan en Supabase; solo se apaga la
puerta de entrada.

---

## Jugadores

En **ambas** actividades el estudiante escribe su nombre antes de tocar nada; todas
las mutaciones llevan su `player_id`.

### `POST /v1/players`

```json
// petición
{ "name": "Lucía" }

// 201 (o 200 si ya existía: upsert por nombre normalizado dentro de la clase activa)
{ "player": { "id": "…", "name": "Lucía", "chosen_game": null } }
```

- Normalización: `lower(trim(name))` → `name_key`; «Lucía» y « lucía » son la misma
  persona. Repetir nombre **recupera** el jugador, no falla: en clase la gente
  recarga la página.
- `422` si el nombre queda vacío tras el trim.

### `PATCH /v1/players/{player_id}`

La elección de juego de la actividad de Méré («elige con cuál apostarías»).

```json
// petición
{ "chosen_game": "one-die-4" }

// 200
{ "player": { "id": "…", "name": "Lucía", "chosen_game": "one-die-4" } }
```

La elección se puede cambiar (el summary agrupa por la elección vigente al momento de
cada ronda si se quiere hilar fino; para la clase basta la vigente).

### `GET /v1/players`

`200 { "players": [ … ] }` — el listado de la clase activa, por si el instructor
quiere proyectar quién ya entró.

---

## Los juegos de Méré

`{game}` ∈ `one-die-4` (un dado, 4 tiros, gana un 6) · `two-dice-24` (dos dados, 24
tiros, gana un doble 6).

### `POST /v1/games/{game}/rounds`

**El servidor tira los dados.** Una ronda = un registro en `dice_rounds`, con los 4
resultados o los 24 pares completos en `rolls`. Un jugador puede lanzar tantas rondas
como quiera.

```json
// petición
{ "player_id": "…" }

// 201
{
  "round": {
    "id": "…",
    "game": "one-die-4",
    "player_id": "…",
    "player_name": "Lucía",
    "rolls": [3, 6, 1, 2],          // juego 2: [[4,2],[6,6],…] — 24 pares
    "win": true
  },
  "summary": {
    "games": {
      "one-die-4":   { "rounds": 41, "wins": 22, "win_pct": 53.7 },
      "two-dice-24": { "rounds": 38, "wins": 18, "win_pct": 47.4 }
    },
    "coins": { "chevalier": 1, "opponent": -1 },
    "players": 19
  },
  "render": "<svg viewBox=\"0 0 980 …\" …>…</svg>"
}
```

- `win`: juego 1, algún valor `=== 6`; juego 2, algún par `[6,6]`.
- `render`: la ronda recién lanzada con los seises (o dobles seises) resaltados, más
  el marcador acumulado de la clase. Lo produce la API de Render
  (`POST /v1/render/dice`); esta API solo lo reenvía.
- `coins` es un **balance de apuesta, no un conteo**: cada ronda se apuesta una
  moneda y **el que pierde la entrega**. Chevalier queda en `wins − losses` y el
  oponente en el espejo exacto (`losses − wins`); los balances **pueden ser
  negativos** y siempre suman cero (juego de suma cero). Se acumula sobre los dos
  juegos.
- `409` sin clase activa; `422` si `{game}` no existe o falta `player_id`.

### `GET /v1/games/summary`

El marcador de toda la clase, con su SVG (sin ronda destacada). Un único query param
opcional, `gain` (default `1`): la ganancia por ronda. Es un **juego de suma cero** —
lo que gana el uno es exactamente lo que entrega el otro — así que un solo número
basta:

```
coins.chevalier = (wins − losses) × gain
coins.opponent  = −coins.chevalier
```

La sesión 6 puede subir `gain` para que el mismo marcador hable en montos mayores.

```json
// 200 — mismo shape de summary que arriba
{ "summary": { … }, "render": "<svg …>…</svg>" }
```

### `GET /v1/games/{game}/rounds`

`200 { "rounds": [ … ] }` en orden de llegada — la tabla cruda, por si el instructor
quiere proyectarla o exportarla.

### `DELETE /v1/games/rounds` 🔑

Borra todas las rondas de la clase activa (los dos juegos). Solo instructor; el
frontend no tiene ningún botón que llame esto.

---

## El triángulo

La interacción del frontend es **sobre el dibujo** (ver `mockups.md`):

- **Arrastrar** de un punto a otro los une con un segmento. Al soltar, un punto
  cercano **tiene prioridad** sobre el segmento en el que está sentado: conectar dos
  puntos gana sobre la perpendicular. Se rechaza si los dos ya viven sobre el mismo
  segmento (no hay nada nuevo que trazar).
- La **altura** se traza de dos maneras: soltando el arrastre sobre el lado opuesto,
  o dibujando el trazo largo — si cruza ese lado a menos de 15° de la perpendicular,
  también cuenta. El pie se registra como punto (el cruce, caiga donde caiga sobre la
  línea del lado: en un triángulo obtuso es más allá de los vértices) y el segmento
  llega con `ortho: true` (señal ⊥, visible también en vivo durante el arrastre —
  solo frontend). Si el pie cae a menos del **8 % del lado** de un vértice — incluso
  apenas pasado —, se **ajusta al vértice**: el segmento conecta con él y no nace un
  punto gemelo pegado a la esquina.
- Pasar el cursor cerca de la **mitad de un lado del triángulo** muestra una marca
  fantasma y tocarla registra el punto medio. **Solo los tres lados** reparten
  puntos medios — los segmentos construidos no — y siempre es el punto medio exacto
  del lado propio: **nunca nace un punto medio fuera del triángulo inicial** (las
  prolongaciones punteadas no reparten puntos medios).
- La **bisectriz** (el camino al incentro): un arrastre desde un vértice a **menos de
  15° de la dirección que parte su ángulo en dos iguales** se ajusta a la bisectriz
  exacta, hasta su corte con el lado opuesto (que se registra como punto). El
  segmento llega con `bisector: true` y el render lo señala con **dos arcos con
  marca en el vértice** — la notación de ángulos iguales —, visibles también en vivo
  durante el arrastre. Si el trazo libre desde un vértice se parece a la vez a la
  altura y a la bisectriz, gana la dirección más cercana.
- Desde un punto medio, un arrastre al vacío a **menos de 15° de la perpendicular**
  del segmento que biseca se ajusta a la mediatriz exacta (`ortho: true`). **No se
  registra ningún punto en el extremo**, y el trazo sólido llega **como máximo hasta
  el borde del triángulo** (el frontend recorta el `to` en la primera intersección
  con un lado); de ahí en adelante la línea sigue punteada de lado a lado del lienzo.
- El lienzo tiene **zoom solo por el slider** de la esquina superior derecha (junto
  al botón de **restablecer** con forma de expandir, siempre visibles en el marco) y
  **paneo** con clic sostenido sobre el fondo — con zoom, el cursor es la mano. El
  grosor de los trazos, el tamaño de los puntos y las etiquetas son **constantes en
  pantalla** a cualquier zoom (la lupa agranda la geometría, no la tinta). Todo del
  lado del frontend, la API no se entera.
- **Tocar** un punto o un segmento lo selecciona; **Supr/Backspace** lo borra
  (`DELETE` puntuales abajo). Borrar un punto arrastra los segmentos que lo tocan;
  los vértices y los lados no se borran.
- **Ctrl/Cmd+Z** deshace la última construcción (ver `POST …/undo`).
- Al final, cada estudiante **elige dónde cree que está el centro y lo envía**.

Todos los puntos viven sobre segmentos: no hay puntos sueltos en el vacío. **El gesto
y su tolerancia los resuelve el frontend**; a esta API siempre llega geometría
exacta. El servidor calcula vértices y puntos medios, y guarda todo.

**El token `gesture`**: toda mutación lleva un campo `gesture` (string opaco generado
por el cliente). Lo que un mismo gesto produce — el pie de una perpendicular Y su
segmento — comparte token, y el undo remueve el gesto completo.

### `POST /v1/triangles`

Construcción por **lado–ángulo–lado**: los dos lados salen del vértice `A` con el
ángulo dado entre ellos.

```json
// petición
{ "side1": 5, "angle": 60, "side2": 6, "player_id": "…" }

// 201
{
  "triangle": { "id": "…", "side1": 5, "angle": 60, "side2": 6, "vertices": [[0,0],[5,0],[3,5.196]] },
  "points": [
    { "id": "…", "label": "A", "x": 0, "y": 0,     "kind": "vertex" },
    { "id": "…", "label": "B", "x": 5, "y": 0,     "kind": "vertex" },
    { "id": "…", "label": "C", "x": 3, "y": 5.196, "kind": "vertex" }
  ],
  "render": "<svg …>…</svg>"
}
```

- Validación (`422` con mensaje proyectable): cada lado > 0; `0 < angle < 180`.
- Vértices: `A=(0,0)`, `B=(side1,0)`, `C=(side2·cos θ, side2·sin θ)` con θ en
  radianes desde `angle`.
- Los tres vértices nacen como puntos (`kind: "vertex"`), listos para tocarse.
- Crear un triángulo nuevo empieza un lienzo nuevo (el vigente por clase es el último
  creado; los anteriores quedan en la tabla).

### `GET /v1/triangles/{id}`

`200 { "triangle": …, "points": […], "segments": […], "render": "<svg …>" }` — el
estado completo del lienzo, para reconectarse a mitad de actividad.

### `POST /v1/triangles/{id}/points`

Un punto suelto: en la UI, un toque sobre lienzo vacío sin nada seleccionado.

```json
// petición — label opcional (default: P1, P2, …)
{ "x": 3.5, "y": 1.2, "label": null, "player_id": "…" }

// 201
{ "point": { "id": "…", "label": "P1", "x": 3.5, "y": 1.2, "kind": "point" },
  "points": [ …todos, vértices incluidos… ],
  "render": "<svg …>…</svg>" }
```

### `GET /v1/triangles/{id}/midpoint`

Calcula **y registra** el punto medio del segmento entre dos coordenadas — en la UI,
un toque sobre un lado del triángulo o sobre un segmento trazado. Query params:
`x1, y1, x2, y2, player_id`.

```json
// 200
{ "point": {
    "id": "…", "label": "M(AB)", "x": 2.5, "y": 0, "kind": "midpoint",
    "parent": { "x1": 0, "y1": 0, "x2": 5, "y2": 0 }
  },
  "points": [ … ],
  "render": "<svg …>…</svg>" }
```

- `parent` son los extremos del segmento bisecado. Es obligatorio en la respuesta: es
  lo que le permite al frontend comprobar, después, si un trazo que sale de este
  punto medio es perpendicular al segmento que biseca.
- (Es un GET con efecto a propósito de la petición original de diseño; si en el otro
  repositorio prefieren la ortodoxia REST, `POST /v1/triangles/{id}/midpoints` con el
  mismo contrato — el cliente del curso se cambia en una línea.)

### `POST /v1/triangles/{id}/segments`

Siempre el trazo recto `from → to`. `ortho: true` marca los que el gesto ajustó a una
perpendicular exacta; **por convención `from` es el extremo que toca la base** — el
punto medio, o el pie de la perpendicular — que es donde el render pone la señal ⊥.

```json
// petición
{ "from": [2.5, 0], "to": [2.5, 2.51], "ortho": true, "bisector": false, "player_id": "…" }

// 201
{ "segment": { "id": "…", "from": [2.5, 0], "to": [2.5, 2.51], "ortho": true, "bisector": false },
  "segments": [ … ],
  "render": "<svg …>…</svg>" }
```

`bisector: true` marca las bisectrices (por convención, `from` es el vértice cuyo
ángulo parten: ahí van los arcos de ángulos iguales del render).

**Tope de 3 trazos (regla del servidor)**: en el lienzo viven como máximo los
**últimos tres** segmentos construidos. Al registrar el cuarto, el más viejo se
desaloja (FIFO) — la respuesta trae `segments` ya depurado. En la UI, además, un
segmento o punto seleccionado se borra con **Supr/Backspace** o con el botón de
papelera, siempre visible junto al slider del zoom (habilitado solo con selección).

### `POST /v1/triangles/{id}/center`

La respuesta de cada estudiante a «¿cuál es el centro?»: el botón **Elegir el
centro** arma el modo, el toque marca la apuesta y **Enviar** la manda. **Una apuesta
por jugador**: tras Enviar, el frontend deshabilita el botón («Centro enviado ✓») y
la construcción sobre el gráfico — el lienzo queda de solo lectura salvo la lupa. El
API mantiene el upsert (por si un instructor necesita corregir), pero la UI no lo
expone. El lienzo compartido muestra todas las apuestas como ✕ con el nombre al
lado, listas para compararse contra los centros construidos.

```json
// petición
{ "x": 2.7, "y": 1.9, "player_id": "…" }

// 201 (o 200 si es una corrección)
{ "centers": [ { "id": "…", "player_id": "…", "player_name": "Lucía", "x": 2.7, "y": 1.9 } ],
  "render": "<svg …>…</svg>" }
```

### `POST /v1/triangles/{id}/undo`

Deshace el **último gesto**: borra todos los registros (puntos, segmentos, apuestas
de centro) que comparten el `gesture` más reciente. Los vértices no son gestos: el
triángulo nunca se deshace. Responde el estado completo:

```json
// 200
{ "points": [ … ], "segments": [ … ], "centers": [ … ], "render": "<svg …>…</svg>" }
```

En el frontend está atado a **Ctrl/Cmd+Z**. Sin key: cualquier estudiante puede
deshacer lo último que se construyó (es un lienzo compartido de salón, no un editor
multiusuario con permisos).

### `DELETE /v1/triangles/{id}/points/{point_id}` · `DELETE /v1/triangles/{id}/segments/{segment_id}`

Borrado puntual, atado al gesto seleccionar + **Supr/Backspace** o al botón de
papelera. Sin key (mismo razonamiento que el undo). La construcción nunca queda
colgando — la cascada va en ambos sentidos:

- Borrar un **segmento** arrastra sus extremos — puntos medios incluidos — salvo los
  **vértices del triángulo original** (que nunca se borran) y salvo los extremos que
  otro segmento todavía use.
- Borrar un **punto** (no original) arrastra todo segmento que lo toque en un
  extremo, y los extremos de esos segmentos que queden huérfanos caen también. Los
  vértices originales responden `422` con mensaje proyectable.
- El **desalojo FIFO** del tope de 3 trazos aplica la misma cascada: el trazo más
  viejo se lleva sus extremos huérfanos.
- Todos responden el estado completo: `{ points, segments, centers, render }` (el
  `POST /segments` también incluye `points`, porque el desalojo puede tocarlos).

### `DELETE /v1/triangles` 🔑 · `DELETE /v1/triangles/{id}/points` 🔑 · `DELETE /v1/triangles/{id}/segments` 🔑

Resets de instructor: todos los triángulos de la clase, o los puntos/segmentos de un
lienzo (los vértices se conservan). Nunca desde el frontend.

---

## Orquestación con la API de Render

En cada mutación (y en `GET …/summary` y `GET /v1/triangles/{id}`), esta API arma el
estado y llama a la de Render con `X-Internal-Key`:

```
POST {RENDER_API}/v1/render/dice      { game, round, summary }
POST {RENDER_API}/v1/render/triangle  { triangle, points, segments }
```

y copia el `render` recibido en su propia respuesta. Si la API de Render falla, esta
API responde `502`: para el frontend eso es un `5xx` como cualquier otro y degrada
completo a su mock local (estado y dibujo juntos), que es su comportamiento ya
implementado. No inventar un estado intermedio «dato sin dibujo».
