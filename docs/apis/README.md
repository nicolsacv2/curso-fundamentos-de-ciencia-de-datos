# APIs de actividades — arquitectura

Las dos actividades en vivo de la sesión 4 — los dados de Méré y el triángulo — se
apoyan en dos servicios que viven en su propio repositorio. Este documento es la
especificación con la que se arranca ese repositorio; el detalle endpoint por endpoint
está en [`actividades-api.md`](actividades-api.md) y [`render-api.md`](render-api.md),
y los mockups de pantalla en [`mockups.md`](mockups.md).

## Topología

El frontend habla con **un solo servicio**. Ese servicio guarda el estado en Supabase,
le pide el dibujo a la API de Render y devuelve las dos cosas juntas:

```
  Estudiantes (web del curso, sesión 4)          Instructor (curl / Postman)
      │                                               │
      │  POST /v1/players                             │  POST /v1/class-sessions
      │  POST /v1/games/{game}/rounds                 │  DELETE /v1/…  (resets)
      │  POST /v1/triangles/…                         │  con X-Activation-Key
      │  (sin key)                                    │
      ▼                                               ▼
  ┌─────────────────────────────────────────────────────────┐
  │                  API DE ACTIVIDADES                     │
  │   estado + reglas de juego + geometría + orquestación   │
  └──────────────┬──────────────────────────┬───────────────┘
                 │                          │
                 │ INSERT / SELECT          │ POST /v1/render/dice
                 ▼                          │ POST /v1/render/triangle
  ┌───────────────────────────┐             │ con X-Internal-Key
  │   SUPABASE (Postgres)     │             ▼
  │   class_sessions, players │   ┌───────────────────────┐
  │   dice_rounds, triangles, │   │    API DE RENDER      │
  │   triangle_points,        │   │  estado → SVG         │
  │   triangle_segments       │   │  (sin estado, sin DB) │
  └───────────────────────────┘   └───────────────────────┘
```

Toda respuesta de mutación incluye `render`: el SVG ya dibujado, que el frontend
inserta tal cual. El frontend **nunca** habla con Supabase ni con la API de Render.

## Activación por instructor

Las APIs arrancan dormidas. El flujo de una clase:

1. Antes de la sesión, el instructor activa una **clase**:
   `POST /v1/class-sessions` con el header `X-Activation-Key` (opcionalmente con un
   TTL). Mientras exista una clase activa, los estudiantes usan las actividades **sin
   ninguna key**.
2. Todo lo que la clase produce (jugadores, rondas, puntos, segmentos) queda colgado
   de esa clase en Supabase.
3. Cualquier escritura sin clase activa responde `409` con un mensaje proyectable
   («La actividad no está activa todavía»).
4. Al terminar — o al vencer el TTL — el instructor cierra:
   `DELETE /v1/class-sessions/current`. Los resets (`DELETE` de rondas, triángulos,
   puntos) también exigen `X-Activation-Key`: **ningún DELETE se llama desde el
   frontend**.

## Seguridad

| Credencial | Quién la tiene | Para qué |
|---|---|---|
| `X-Activation-Key` | Solo el instructor | Activar/cerrar la clase, resets |
| `X-Internal-Key` | API de Actividades ↔ API de Render | Que el render no sea un endpoint público |
| Service-role key de Supabase | Solo la API de Actividades (variable de entorno) | Lecturas y escrituras a Postgres |

- El frontend no carga ninguna key: cualquier key en un bundle de Vite es pública.
- CORS: la API de Actividades permite solo el origen del sitio del curso (y
  `localhost` en desarrollo). La API de Render no necesita CORS: nunca la llama un
  navegador.
- Rate limit sugerido: por IP, generoso (la clase entera puede salir por el NAT de la
  universidad con una sola IP).

## Contratos comunes

- Versionado por prefijo: `/v1/…`.
- JSON en cuerpo de peticiones y respuestas; `Content-Type: application/json`.
- Errores, siempre con esta forma y con `message` en español **proyectable en clase**:

  ```json
  { "error": { "code": "triangle_inequality", "message": "Un triángulo de lados 1, 2 y 9 no cierra: cada lado tiene que ser menor que la suma de los otros dos." } }
  ```

  | HTTP | Cuándo |
  |---|---|
  | 401 | Key inválida o ausente en una operación de instructor |
  | 404 | Recurso inexistente (triángulo, jugador) |
  | 409 | No hay clase activa |
  | 422 | Validación: lados imposibles, juego desconocido, nombre vacío |

- El frontend degrada a su mock local ante `5xx` o error de red; un `4xx` se muestra
  a la clase tal cual. Diseñar los mensajes de `422` sabiendo que se proyectan.

## Esquema en Supabase

```sql
create table class_sessions (
  id          uuid primary key default gen_random_uuid(),
  started_at  timestamptz not null default now(),
  expires_at  timestamptz,           -- null = sin TTL
  closed_at   timestamptz            -- null = sigue activa
);

create table players (
  id                uuid primary key default gen_random_uuid(),
  class_session_id  uuid not null references class_sessions(id),
  name              text not null,
  name_key          text not null,   -- lower(trim(name)), para el upsert
  chosen_game       text check (chosen_game in ('one-die-4','two-dice-24')),
  created_at        timestamptz not null default now(),
  unique (class_session_id, name_key)
);

-- Una ronda = UN registro: los 4 resultados o los 24 pares completos en `rolls`.
create table dice_rounds (
  id                uuid primary key default gen_random_uuid(),
  class_session_id  uuid not null references class_sessions(id),
  player_id         uuid not null references players(id),
  game              text not null check (game in ('one-die-4','two-dice-24')),
  rolls             jsonb not null,  -- [3,6,1,2]  o  [[4,2],[6,6],…]
  win               boolean not null,
  created_at        timestamptz not null default now()
);

-- Construcción por lado–ángulo–lado; los vértices los calcula el servidor.
create table triangles (
  id                uuid primary key default gen_random_uuid(),
  class_session_id  uuid not null references class_sessions(id),
  player_id         uuid references players(id),
  side1             numeric not null,
  angle_deg         numeric not null,
  side2             numeric not null,
  vertices          jsonb not null,  -- [[0,0],[side1,0],[cx,cy]]
  created_at        timestamptz not null default now()
);

create table triangle_points (
  id           uuid primary key default gen_random_uuid(),
  triangle_id  uuid not null references triangles(id) on delete cascade,
  player_id    uuid references players(id),
  label        text not null,       -- 'A', 'B', 'C', 'P1', 'M(AB)'…
  x            numeric not null,
  y            numeric not null,
  kind         text not null check (kind in ('vertex','point','midpoint')),
  parent       jsonb,               -- midpoints: {x1,y1,x2,y2} del segmento bisecado
  gesture      text,                -- lo que un mismo gesto creó comparte token (undo)
  created_at   timestamptz not null default now()
);

-- La apuesta de cada estudiante a «¿cuál es el centro?»; una por jugador, corregible.
create table center_choices (
  id           uuid primary key default gen_random_uuid(),
  triangle_id  uuid not null references triangles(id) on delete cascade,
  player_id    uuid not null references players(id),
  x            numeric not null,
  y            numeric not null,
  created_at   timestamptz not null default now(),
  unique (triangle_id, player_id)
);

create table triangle_segments (
  id           uuid primary key default gen_random_uuid(),
  triangle_id  uuid not null references triangles(id) on delete cascade,
  player_id    uuid references players(id),
  p_from       jsonb not null,      -- [x, y] — en los ⊥, el extremo que toca la base
  p_to         jsonb not null,
  ortho        boolean not null default false,  -- perpendicular exacta (señal ⊥)
  bisector     boolean not null default false,  -- bisectriz (arcos de ángulos iguales)
  gesture      text,
  created_at   timestamptz not null default now()
);
-- Undo (POST /v1/triangles/{id}/undo): borra los registros del `gesture` más
-- reciente entre points/segments/center_choices del triángulo.
```

RLS puede quedar deshabilitado en estas tablas: la única que entra es la API con la
service-role key, y las tablas no guardan nada sensible (nombres de pila y dados).

## Decisiones que el otro repositorio hereda

- **El servidor tira los dados.** El frontend nunca manda resultados: pide una ronda
  y recibe los dados ya tirados. Una sola fuente de verdad, imposible de falsear
  desde el navegador.
- **El servidor calcula la geometría; el frontend resuelve el gesto.** El triángulo
  se construye por lado–ángulo–lado y el servidor calcula sus vértices y los puntos
  medios. La interacción es sobre el dibujo (tocar puntos y segmentos), y la
  tolerancia de las perpendiculares a pulso (±15°, con ajuste a la exacta) la aplica
  el frontend: a la API siempre llega geometría exacta, con `ortho: true` cuando el
  trazo se ajustó. El render marca esos con la señal ⊥.
- **Una ronda = un registro.** Los 4 resultados o los 24 pares viajan y se guardan
  juntos, en una columna `jsonb`.
- **Rondas ilimitadas por jugador.** Más rondas = la frecuencia relativa converge,
  que es el punto pedagógico del bloque.
- **Las monedas son una apuesta, no un conteo.** Cada ronda se juega una ganancia
  (query param `gain`, default 1) y el que pierde la entrega: `coins` es un balance
  neto que puede ser negativo y, por ser un juego de suma cero, siempre suma cero
  entre los dos lados.
- **El render resalta los seises** (juego 1) **y los dobles seises** (juego 2) en el
  rojo `#DC4B3E` del curso: de un vistazo se ve si la ronda ganó.
- **Referencia viva:** `src/sessions/s04/activities/api.js` en este repositorio
  implementa el mock local con exactamente estos contratos y este dibujo. Ante una
  duda de forma de respuesta o de SVG, ese archivo es la referencia.

## Stack sugerido (no obligatorio)

Cualquier stack que hable JSON sirve. La sugerencia corta: **FastAPI** (o Express) en
Cloud Run/Railway para las dos APIs, `supabase-py`/`supabase-js` con la service-role
key para la de Actividades, y la de Render sin ninguna dependencia de datos — recibe
estado, devuelve un string SVG, y por eso mismo se testea con fixtures puras.
