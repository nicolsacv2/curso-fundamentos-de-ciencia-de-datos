# Mockups de las actividades

Cómo se ven las dos actividades dentro de la sesión 4, y qué llamada produce cada
cambio de pantalla. Los estilos reales están en `src/styles/panel.css` (bloque
`.activity`); estos wireframes fijan la estructura y el flujo.

---

## Actividad 1 · Los dados de Méré (bloque «Entrada»)

### Paso 1 — nombre

```
┌─ .activity ────────────────────────────────────────────────────┐
│  TU NOMBRE   [ como quieras aparecer en el marcador ]  [ENTRAR]│
└────────────────────────────────────────────────────────────────┘
                    │
                    └──▶ POST /v1/players { "name": "Lucía" }
```

### Paso 2 — elegir el juego (la apuesta)

```
┌─ .activity ────────────────────────────────────────────────────┐
│  Lucía, apuesta una moneda: ¿con cuál juego te la jugarías?    │
│                                                                │
│  ┌─ JUEGO 1 ──────────────────┐  ┌─ JUEGO 2 ─────────────────┐ │
│  │ Un dado, 4 tiros.          │  │ Dos dados, 24 tiros.      │ │
│  │ Ganas si sale al menos     │  │ Ganas si sale al menos    │ │
│  │ un 6.                      │  │ un doble 6.               │ │
│  └────────────────────────────┘  └───────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
                    │
                    └──▶ PATCH /v1/players/{id} { "chosen_game": "one-die-4" }
```

### Paso 3 — lanzar (repetible sin límite)

```
┌─ .activity ────────────────────────────────────────────────────┐
│  Lucía apuesta con el juego 1. Un dado, 4 tiros…               │
│  [ LANZAR ]                                                    │
│                                                                │
│  ┌─ .canvas (SVG de la API de Render) ────────────────────────┐│
│  │  LUCÍA · GANA CHEVALIER                                    ││
│  │                                                            ││
│  │   ┌───┐   ╔═══╗   ┌───┐   ┌───┐                            ││
│  │   │ 3 │   ║ 6 ║◀──╢rojo   │ 1 │   │ 2 │                    ││
│  │   └───┘   ╚═══╝   └───┘   └───┘                            ││
│  │  ──────────────────────────────────────────────────        ││
│  │  JUEGO 1 · UN 6 EN 4 TIROS       41 rondas  22 ganadas 53.7%│
│  │  JUEGO 2 · DOBLE 6 EN 24 TIROS   38 rondas  18 ganadas 47.4%│
│  │  MONEDAS — Chevalier: +1 · Oponente: -1          (en rojo) ││
│  │  cada ronda se apuesta una moneda: el que pierde, la entrega││
│  └────────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────┘
                    │
                    └──▶ POST /v1/games/one-die-4/rounds { "player_id": "…" }
```

En el juego 2 la zona de dados es una **rejilla de 6 × 4**: seis pares por fila,
cuatro filas, cada par con sus dos dados lado a lado; solo el par `[6,6]` completo se
resalta:

```
│  ⚀⚄   ⚃⚁   ╔⚅⚅╗  ⚂⚀   ⚄⚂   ⚁⚁   │
│  ⚃⚅   ⚀⚂   ╚rojo╝ ⚂⚃   ⚄⚀   ⚁⚄   │
│  ⚃⚂   ⚀⚁   ⚅⚂   ⚁⚀   ⚄⚄   ⚂⚁   │
│  ⚀⚅   ⚃⚀   ⚁⚂   ⚄⚁   ⚂⚄   ⚅⚁   │
```

---

## Actividad 2 · ¿Cuál es el centro? (bloque 1)

### Paso 1 — nombre → `POST /v1/players` (igual que arriba)

### Paso 2 — construir el triángulo (lado, ángulo, lado)

```
┌─ .activity ────────────────────────────────────────────────────┐
│  LADO, ÁNGULO, LADO   [ lado ] [ ángulo ° ] [ lado ]           │
│                                     [CONSTRUIR TRIÁNGULO]     │
└────────────────────────────────────────────────────────────────┘
                    │
                    └──▶ POST /v1/triangles { "side1":5, "angle":60, "side2":6, "player_id":"…" }
                         (422 proyectable si un lado ≤ 0 o el ángulo no está en (0°,180°))
```

### Paso 3 — construir SOBRE el dibujo (sin botones de construcción)

El lienzo es la interfaz: se **arrastra** entre puntos y se **tocan** los segmentos.
No existen puntos sueltos: todo punto vive sobre un segmento.

```
┌─ .activity ────────────────────────────────────────────────────┐
│  Arrastra de un punto a otro para unirlos. Pasa por la mitad   │
│  de un segmento y toca la marca para su punto medio. Las       │
│  perpendiculares se trazan a pulso: a menos de 15° se ajustan  │
│  solas y quedan marcadas con ⊥.                                │
│                                                                │
│  [ ELEGIR EL CENTRO ]        (→ al armar el modo: [ ENVIAR ])  │
│                                                                │
│  ┌─ .canvas (SVG de la API de Render) ────────────────────────┐│
│  │                    B  ← lado más largo SIEMPRE horizontal, ││
│  │                   ╱ ╲    triángulo centrado                ││
│  │           M(BC) ●  ⊙ ● M(AB) ← ⊙ marca fantasma del punto  ││
│  │                ╱  ✕Lucía ╲       medio al pasar el cursor  ││
│  │               ╱ cruce ┊∟⊥ ┘← señal de ortogonalidad (rojo) ││
│  │              C────●────────A   ✕ = apuestas de centro      ││
│  │                 M(CA)              con nombre              ││
│  │  LADO 5 · ÁNGULO 60° · LADO 6                              ││
│  └────────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────┘

  gesto                                    │ llamadas
  ─────────────────────────────────────────┼──────────────────────────────
  hover cerca de la mitad de UN LADO       │ (marca fantasma, solo frontend)
    + toque en la marca                    │ GET …/midpoint?x1&y1&x2&y2&player_id&gesture
    (solo los 3 lados reparten p. medios)  │
  arrastre punto → punto                   │ POST …/segments {from,to,ortho:false,gesture}
    (un punto cercano al soltar GANA sobre │
     el segmento en que está sentado; si   │ (si ya comparten segmento: se rechaza,
     ya comparten segmento: se rechaza)    │  sin llamada)
  arrastre punto → sobre un segmento       │ POST …/points (el pie exacto de la ⊥)
    SIEMPRE perpendicular, señal ⊥ en vivo │ POST …/segments {from:pie, to:punto, ortho:true}
    (la prolongación punteada cuenta; pie  │  — ambas con el MISMO gesture
     más allá de ella: se rechaza)         │
  arrastre punto medio → vacío ≈⊥ (±15°)   │ POST …/segments {from:M, to:…, ortho:true}
    → mediatriz exacta, SIN punto extremo; │ (una sola llamada: no se registra punto)
      el dibujo la prolonga de lado a lado │
  arrastre vértice ≈ bisectriz (±15°)      │ POST …/points (el corte en el lado opuesto)
    → se ajusta y marca el ángulo partido  │ POST …/segments {from:vértice, to:corte,
      en dos iguales (doble arco con marca)│   bisector:true} — mismo gesture
  arrastre a vacío sin ajuste posible      │ (se cancela: nada que registrar)
  toque en punto o segmento + Supr/Back    │ DELETE …/points/{id} · DELETE …/segments/{id}
    (borrar un punto arrastra sus segmentos)│
  Ctrl/Cmd+Z                               │ POST …/undo  (borra el último gesture completo)
  Elegir el centro + toque + Enviar        │ POST …/center {x, y, player_id, gesture}
```

La secuencia pedagógica del bloque: (1) tocar la mitad de cada lado → los tres puntos
medios, (2) arrastrar de cada vértice al punto medio opuesto → las medianas se cruzan
en el baricentro, (3) desde cada punto medio, arrastrar la perpendicular a pulso →
las mediatrices (con su ⊥) se cruzan en el circuncentro, que **no** es el mismo
punto, y (4) cada estudiante apuesta su centro con **Elegir el centro → Enviar**: el
lienzo compartido llena de ✕ la zona entre los dos, y esa nube es la discusión.

---

## Secuencia de una interacción (patrón orquestador)

```
Estudiante          Frontend                API Actividades         Supabase      API Render
    │  clic LANZAR      │                          │                   │              │
    │──────────────────▶│  POST /games/…/rounds    │                   │              │
    │                   │─────────────────────────▶│  ¿clase activa?   │              │
    │                   │                          │──────────────────▶│              │
    │                   │                          │  tira los dados   │              │
    │                   │                          │  INSERT ronda     │              │
    │                   │                          │──────────────────▶│              │
    │                   │                          │  POST /render/dice (X-Internal-Key)
    │                   │                          │─────────────────────────────────▶│
    │                   │                          │◀─────────────────────────────────│
    │                   │◀─────────────────────────│  { round, summary, render }      │
    │   SVG en pantalla │  201                     │                   │              │
    │◀──────────────────│                          │                   │              │
```

Si cualquier flecha del lado derecho falla (red caída, 5xx), el frontend resuelve la
misma llamada contra su mock local y muestra el aviso «Modo local». La clase no se
detiene.
