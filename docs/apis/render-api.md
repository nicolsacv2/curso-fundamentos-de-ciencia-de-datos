# API de Render — especificación

Convierte estado en SVG. Sin base de datos, sin sesiones, sin memoria: recibe un JSON,
devuelve un dibujo. Solo la llama la API de Actividades (header `X-Internal-Key`);
ningún navegador la toca, así que no necesita CORS.

Implementación de referencia del dibujo: las funciones `renderDice` y
`renderTriangle` de `src/sessions/s04/activities/api.js` en el repositorio del curso
producen exactamente el SVG que este servicio debe producir. Portar ese código (≈100
líneas de aritmética y templates) es la mitad del trabajo de este servicio.

---

## `POST /v1/render/dice`

```json
// petición — round puede ser null (marcador solo, sin ronda destacada)
{
  "game": "one-die-4",
  "round": {
    "player_name": "Lucía",
    "game": "one-die-4",
    "rolls": [3, 6, 1, 2],
    "win": true
  },
  "summary": {
    "games": {
      "one-die-4":   { "rounds": 41, "wins": 22, "win_pct": 53.7 },
      "two-dice-24": { "rounds": 38, "wins": 18, "win_pct": 47.4 }
    },
    "coins": { "chevalier": 1, "opponent": -1 },
    "players": 19
  }
}

// 200
{ "render": "<svg viewBox=\"0 0 980 …\" role=\"img\" aria-label=\"…\">…</svg>" }
```

Qué dibuja, de arriba a abajo:

1. La línea de resultado: `LUCÍA · GANA CHEVALIER` (o `GANA EL OPONENTE`).
2. La ronda: 4 dados grandes en fila (juego 1) o los 24 pares en una **rejilla de
   6 × 4** — seis pares por fila, cuatro filas, cada par con sus dos dados lado a
   lado en horizontal — con los pips dibujados (juego 2).
3. **El resaltado — el requisito central**: en el juego 1, todo dado con un 6 va en
   rojo (`#DC4B3E`: relleno `rgba(220,75,62,.18)`, borde y pips destacados); en el
   juego 2, se resalta el **par completo** solo cuando es doble seis. Los demás dados
   quedan en la paleta neutra. De un vistazo se ve si la ronda ganó y por qué.
4. El marcador: una línea por juego (`rondas · ganadas · %`) y la línea de monedas en
   rojo, **con signo** porque es un balance de apuesta que puede ser negativo —
   `Chevalier: +1 · Oponente: -1` — seguida del pie en gris: «cada ronda se apuesta
   una moneda: el que pierde, la entrega».

## `POST /v1/render/triangle`

```json
// petición — el estado completo del lienzo
{
  "triangle": { "side1": 5, "angle": 60, "side2": 6, "vertices": [[0,0],[5,0],[3,5.196]] },
  "points": [
    { "id": "p1", "label": "A",     "x": 0,   "y": 0, "kind": "vertex" },
    { "id": "p4", "label": "M(AB)", "x": 2.5, "y": 0, "kind": "midpoint",
      "parent": { "x1": 0, "y1": 0, "x2": 5, "y2": 0 } },
    { "id": "p5", "label": "P1",    "x": 3,   "y": 1.5, "kind": "point" }
  ],
  "segments": [
    { "id": "s1", "from": [3, 5.196], "to": [2.5, 0],    "ortho": false },
    { "id": "s2", "from": [2.5, 0],   "to": [2.5, 2.51], "ortho": true }
  ]
}

// 200
{ "render": "<svg viewBox=\"0 0 980 640\" role=\"img\" aria-label=\"…\" data-k=\"…\" data-ox=\"…\" data-oy=\"…\" data-rot=\"…\">…</svg>" }
```

### El encuadre

- **El lado más largo del triángulo queda paralelo al eje x**, con el vértice opuesto
  hacia arriba: todo el estado (cartesiano) pasa por una rotación −θ, donde θ es el
  ángulo del lado más largo (más π si el vértice opuesto cayera debajo).
- **La escala sale de ese lado**, y la ventana visible es el bounding box de **todo
  el contenido**: el triángulo, **sus tres centros construibles calculados de
  antemano** — baricentro, circuncentro y ortocentro (`H = 3G − 2O`), que en un
  triángulo obtuso caen FUERA y aun así deben tener sitio en pantalla —, cada punto
  y segmento, y las apuestas de centro (✕). Todo más un margen relativo al triángulo
  (10 % del lado más largo a los costados, 16 % de la altura arriba y abajo). El
  conjunto queda **centrado**. Alto del canvas: el que pida la proporción, con tope
  en 720 (más 44px de pie); el eje y se voltea (SVG crece hacia abajo).

### Qué dibuja

- El triángulo (contorno en `#9EB0C3`). **Los lados y los segmentos ortogonales se
  prolongan punteados de lado a lado del lienzo** (`#6D8096`, la línea recortada al
  rectángulo del canvas): el pie de una altura obtusa cae bien pasados los vértices y
  tiene que aterrizar sobre algo visible, y dos mediatrices deben poder cruzarse
  aunque el trazo se quede corto. Los segmentos planos se prolongan un tramo (30 %
  por extremo). Las líneas punteadas de los lados forman parte de su trazo clicable.
- Los segmentos, todos en cian sólido, tal cual su `from → to`. Los que llegan con
  `ortho: true` llevan además **la señal de ortogonalidad en rojo**: el cuadrito de
  ángulo recto y el glifo `⊥`, en el extremo `from` (por convención, el que toca la
  base). El cuadrito se dibuja desde la dirección del propio segmento — válido porque
  el ajuste del gesto lo dejó exactamente perpendicular.
- Los segmentos con `bisector: true` llevan en su extremo `from` (el vértice) la
  **señal de ángulos iguales**: un arco por cada mitad del ángulo, mismo radio (16),
  cada uno con su marca perpendicular en el punto medio del arco — en rojo `#DC4B3E`.
- Los puntos con su etiqueta al lado: vértices en tinta clara (`#E9EFF5`), puntos en
  cian, puntos medios en rojo. Las etiquetas de puntos y de apuestas llevan su ancla
  en `data-ax/data-ay/data-ox/data-oy`: el frontend recoloca el texto por zoom para
  que la distancia nombre–punto sea constante en pantalla.
- Las apuestas de centro (`centers` en el body: `{player_name, x, y}`): una **✕ cian**
  con el nombre del jugador en gris pequeño al lado — cruces, para que nunca se
  confundan con los puntos de la construcción.
- Al pie, en mono pequeño: `LADO 5 · ÁNGULO 60° · LADO 6`.

### El contrato de interactividad (obligatorio)

El dibujo ES la interfaz, así que el SVG trae los ganchos que el frontend usa:

- Cada punto lleva encima un círculo invisible generoso:
  `<circle r="16" fill="transparent" data-point-id="{id}"/>`, dibujado DESPUÉS de las
  líneas clicables para que el punto siempre gane el toque. El frontend pinta ahí el
  anillo de selección.
- Cada lado del triángulo y cada segmento llevan un trazo invisible gordo:
  `<line stroke="transparent" stroke-width="16" data-seg="side-0|side-1|side-2|{segment_id}"/>`
  (lados en el orden AB, BC, CA).
- La raíz `<svg>` declara la transformación mundo→canvas completa: `data-k` (escala),
  `data-ox`/`data-oy` (offsets) y `data-rot` (la rotación θ). Inversa que aplica el
  frontend para mapear un clic (en coordenadas del viewBox) de vuelta al mundo:

  ```
  vx = (vbX − ox) / k        wx = vx·cos θ − vy·sin θ
  vy = (oy − vbY) / k        wy = vx·sin θ + vy·cos θ
  ```

---

## El contrato del SVG

Vale para los dos endpoints; el frontend inserta el string tal cual dentro de su
propio marco.

| Regla | Valor |
|---|---|
| Raíz | `<svg viewBox="0 0 980 {alto}" role="img" aria-label="{descripción en español}">` — sin `width`/`height` fijos: el CSS del curso lo escala |
| Fondo | Transparente (el marco del curso pone el suyo). Nada de `<rect>` de fondo |
| Alto | El que el contenido pida (dados: crece con el marcador; triángulo: 560) |
| Autocontenido | Sin `<script>`, sin `<image>` externas, sin CSS externo: solo shapes y `<text>` con atributos inline |
| Ids | Prefijados (`ar-dice-…`) si se usan `<defs>`/`<marker>`: el SVG convive con otros en la misma página |
| Peso | < 200 KB (el caso pesado son los 24 pares: ~50 nodos) |

### Paleta — los hex del curso

Los dos acentos tienen semántica fija en todo el curso: **cian = lo que hace el
grupo**, **rojo = el dato que se revela** (aquí: el seis, el doble seis, el punto
medio, la mediatriz, las monedas).

| Token | Hex | Uso aquí |
|---|---|---|
| `ink` | `#E9EFF5` | Texto principal, vértices |
| `ink2` | `#9EB0C3` | Texto secundario, contorno del triángulo, pips |
| `ink3` | `#6D8096` | Rótulos pequeños, pies |
| `line` | `#2A3A4E` | Bordes de dados neutros, reglas |
| `lineSoft` | `#1F2C3C` | Reglas suaves |
| `ground2` | `#131D2B` | Relleno de dados neutros |
| `ask` | `#5BC8CE` | Puntos y segmentos de estudiantes |
| `reveal` | `#DC4B3E` | Seises, dobles seises, mediatrices, monedas |

### Tipografías — con fallback, nunca solas

| Rol | Stack |
|---|---|
| Mono (rótulos, marcador) | `Menlo, Consolas, ui-monospace, monospace` |
| Serif (titulares dentro del SVG, si hacen falta) | `'Iowan Old Style', Palatino, Georgia, serif` |

El SVG se renderiza en la máquina del estudiante: no hay que incrustar fuentes, solo
usar estos stacks en `font-family`.

### `aria-label`

Descripción completa en español de lo que el dibujo muestra — es lo que lee el lector
de pantalla y el título del diálogo «Ampliar» del curso. Ejemplos del mock:

- `Última ronda de dados con los seises resaltados y marcador acumulado de los dos juegos`
- `Triángulo de lados 5, 6 y 7 con los puntos, puntos medios y segmentos que la clase ha ido registrando`
