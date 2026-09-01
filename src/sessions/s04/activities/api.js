/* The one client the two session-4 activities talk to.

   The real backend is verquo, and each activity is its OWN deployment with its own
   database: the dice API and the triangle API are separate services and separate base
   URLs. Both arrive at build time:

     VITE_DEMERE_API=https://…  VITE_TRIANGLE_API=https://…  pnpm build

   One build per environment, each with its own backend baked in — otherwise a change to
   this file could never be tried in dev without also shipping it to the real class. The
   three builds share a domain and differ by path (`/`, `/dev/`, `/qa/`), which is what
   `base: './'` in vite.config.js is for. VITE_ENV names the environment so the activity
   can say so on screen.

   Same standard as the Plates (Commons → bucket): a projected class must survive the
   external service falling over. With no base URL, or the moment any request fails, the
   client degrades to a local mock with the same interface — dice from Math.random,
   geometry computed here, SVG assembled with the session's own drawing helpers. The
   activity keeps working; a small notice says the class marcador is no longer shared. */

import { C, MONO, svg, txt } from '../../../svg/kit.js';
import { die, dot, pline } from '../figures/shared.js';

const BASES = {
  demere: import.meta.env.VITE_DEMERE_API || null,
  triangle: import.meta.env.VITE_TRIANGLE_API || null
};

/* Which environment this bundle was built for. Baked in, not read from the URL: the
   build already knows, and a notice that depended on the link would go quiet the moment
   a student navigated away from it. */
export const ENV = import.meta.env.VITE_ENV || 'prod';

/* Whether the last answer for an activity came from the mock. The components read it to
   show the notice; it flips once and stays: retrying the network on every throw would
   hang the activity exactly when it is being projected. */
const degraded = { demere: !BASES.demere, triangle: !BASES.triangle };
export const isMock = activity =>
  activity ? degraded[activity] : degraded.demere || degraded.triangle;

/* The code from the link the instructor projected: …/?s=K3F9QA#s4/entrada. It lives in
   the SEARCH string, not inside the hash, because the router rewrites the hash on every
   navigation and would take the code with it. */
export function joinCode() {
  if (typeof location === 'undefined') return null; /* prerender, tests, tooling */
  return new URLSearchParams(location.search).get('s') || null;
}

/* True when the class is being driven by a non-production backend. The activities show
   it, because «esto no cuenta» is the single most useful thing to know at a glance when
   a rehearsal and the real class look identical on screen. */
export const isNonProd = () => ENV !== 'prod';

async function real(activity, path, { method = 'GET', body, playerId } = {}) {
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  /* Who is asking, for the server's per-player spacing. Never used to identify anyone:
     it is the id the server itself handed out. */
  if (playerId) headers['X-Player-Id'] = playerId;

  const res = await fetch(BASES[activity] + path, {
    method,
    headers: Object.keys(headers).length ? headers : undefined,
    body: body ? JSON.stringify(body) : undefined
  });
  if (res.status === 304) return null;
  if (!res.ok) {
    /* 4xx carries a message meant for the class («ese triángulo no cierra»); it is a
       real answer, not a reason to degrade. 5xx and network errors are. */
    if (res.status >= 400 && res.status < 500) {
      const data = await res.json().catch(() => null);
      throw Object.assign(new Error(data?.error?.message || `Error ${res.status}`), { userFacing: true });
    }
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json();
}

async function call(activity, path, opts, mockFn) {
  if (!degraded[activity]) {
    try {
      return await real(activity, path, opts);
    } catch (e) {
      if (e.userFacing) throw e;
      degraded[activity] = true;
    }
  }
  return mockFn();
}

/* ═══════════════════ Sharing the canvas ═══════════════════
   Every mutation moves a version counter on the server, and every screen in the room
   asks «anything new?» a couple of times a second. Without this a student's stroke would
   only ever appear on the screen that drew it — and the shared marcador, the whole point
   of both activities, would not exist. Unchanged state answers 304 and costs nothing.

   The poll names the class as well as the version, and that is what makes the reset
   work. A new class starts again at version 0, so a screen still holding version 12
   would otherwise be told «nothing new» for ever and never see the class that is
   actually running. When the name comes back different — a new class — or null — the
   activity stopped — the screen throws away what it had and starts over.

   In mock mode there is nothing shared to poll, so subscribing is a no-op. */
function poll(activity, path, onEvent, interval, extra) {
  if (degraded[activity]) return () => {};
  let version = -1;
  let code = null;
  let seen = false;
  let stopped = false;
  let timer;

  const tick = async () => {
    if (stopped) return;
    try {
      const q = [];
      if (version >= 0) q.push(`since=${version}`);
      if (code) q.push(`session=${encodeURIComponent(code)}`);
      /* Read fresh on every tick, not captured once: it carries what this screen is
         currently showing — its own last round — which changes as the student throws. */
      Object.entries(extra ? extra() : {}).forEach(([k, v]) => {
        if (v != null && v !== '') q.push(`${k}=${encodeURIComponent(v)}`);
      });
      const url = q.length ? `${path}${path.includes('?') ? '&' : '?'}${q.join('&')}` : path;
      const data = await real(activity, url);
      if (data && !stopped) {
        const next = data.session ? data.session.code : null;
        /* Not on the first answer: arriving to a running class is not a reset. */
        const reset = seen && next !== code;
        version = typeof data.version === 'number' ? data.version : -1;
        code = next;
        seen = true;
        onEvent(data, reset);
      }
    } catch (e) {
      if (!e.userFacing) degraded[activity] = true;
    }
    if (!stopped) timer = setTimeout(tick, interval);
  };

  timer = setTimeout(tick, 0);
  return () => {
    stopped = true;
    clearTimeout(timer);
  };
}

/* `round` is a function so the poll always sends the round the screen is showing right
   now. Without it the next tick, two seconds after a throw, would replace the student's
   dice with a board that has no round on it. */
export const subscribeSummary = (onEvent, { interval = 2000, round } = {}) =>
  poll('demere', '/v1/games/summary', onEvent, interval, () => ({
    round: round ? round() : null
  }));

export const subscribeTriangle = (triId, onEvent, { interval = 2000 } = {}) =>
  poll('triangle', `/v1/triangles/${triId}`, onEvent, interval);

/* ═══════════════════ Mock state ═══════════════════
   In-memory and per-browser: enough to run the whole class offline, minus the shared
   marcador. Shapes mirror the API's responses one to one. */
const mock = {
  players: [],
  rounds: { 'one-die-4': [], 'two-dice-24': [] },
  triangle: null,
  nextId: 1
};

const id = () => mock.nextId++;
const d6 = () => 1 + Math.floor(Math.random() * 6);

/* ═══════════════════ Players ═══════════════════ */
export function registerPlayer(name, activity = 'demere') {
  const code = joinCode();
  return call(activity, '/v1/players', { method: 'POST', body: { name, code } }, () => {
    const clean = name.trim();
    let p = mock.players.find(x => x.name.toLowerCase() === clean.toLowerCase());
    if (!p) {
      p = { id: id(), name: clean, chosen_game: null };
      mock.players.push(p);
    }
    return { player: p };
  });
}

export function chooseGame(playerId, game) {
  return call('demere', `/v1/players/${playerId}`, {
    method: 'PATCH', body: { chosen_game: game }, playerId
  }, () => {
    const p = mock.players.find(x => x.id === playerId);
    if (p) p.chosen_game = game;
    return { player: p };
  });
}

/* ═══════════════════ De Méré games ═══════════════════ */
function summary() {
  const per = {};
  for (const g of ['one-die-4', 'two-dice-24']) {
    const rs = mock.rounds[g];
    const wins = rs.filter(r => r.win).length;
    per[g] = {
      rounds: rs.length,
      wins,
      win_pct: rs.length ? Math.round((wins / rs.length) * 1000) / 10 : null
    };
  }
  /* A bet, not a tally: each round one coin is at stake and the loser hands it over.
     Zero-sum, so the balance is a net that goes negative — which is exactly what de
     Méré's bolsillo was measuring. (The per-round gain is configurable server-side
     via ?gain=; the mock plays 1.) */
  const rounds = mock.rounds['one-die-4'].concat(mock.rounds['two-dice-24']);
  const wins = rounds.filter(r => r.win).length;
  const losses = rounds.length - wins;
  return {
    games: per,
    coins: { chevalier: wins - losses, opponent: losses - wins },
    players: mock.players.length
  };
}

export function throwRound(game, playerId) {
  return call('demere', `/v1/games/${game}/rounds`, {
    method: 'POST', body: { player_id: playerId }, playerId
  }, () => {
    const p = mock.players.find(x => x.id === playerId);
    const rolls = game === 'one-die-4'
      ? Array.from({ length: 4 }, d6)
      : Array.from({ length: 24 }, () => [d6(), d6()]);
    const win = game === 'one-die-4'
      ? rolls.some(v => v === 6)
      : rolls.some(([x, y]) => x === 6 && y === 6);
    const round = { id: id(), game, player_id: playerId, player_name: p?.name || '', rolls, win };
    mock.rounds[game].push(round);
    const s = summary();
    return { round, summary: s, render: renderDice(game, round, s) };
  });
}

export function getGamesSummary() {
  return call('demere', '/v1/games/summary', {}, () => {
    const s = summary();
    return { summary: s, render: renderDice(null, null, s) };
  });
}

/* ═══════════════════ Triangle ═══════════════════
   Side–angle–side: the two sides meet at A with the given angle between them. */
export function createTriangle(side1, angle, side2, playerId) {
  return call('triangle', '/v1/triangles', {
    method: 'POST', body: { side1, angle, side2, player_id: playerId }, playerId
  }, () => {
    for (const l of [side1, side2]) {
      if (!(l > 0)) throw Object.assign(new Error('Los dos lados tienen que ser mayores que cero.'), { userFacing: true });
    }
    if (!(angle > 0 && angle < 180)) {
      throw Object.assign(new Error(
        `Un ángulo de ${angle}° no arma un triángulo: tiene que estar entre 0° y 180°, sin tocarlos.`
      ), { userFacing: true });
    }
    /* A at the origin, side1 along the x axis to B, side2 leaving A at the angle. */
    const rad = (angle * Math.PI) / 180;
    const cx = side2 * Math.cos(rad);
    const cy = side2 * Math.sin(rad);
    const t = {
      id: id(), side1, angle, side2,
      vertices: [[0, 0], [side1, 0], [cx, cy]],
      points: [],
      segments: [],
      centers: [],
      history: []
    };
    t.points = [
      { id: id(), label: 'A', x: 0, y: 0, kind: 'vertex' },
      { id: id(), label: 'B', x: side1, y: 0, kind: 'vertex' },
      { id: id(), label: 'C', x: cx, y: cy, kind: 'vertex' }
    ];
    mock.triangle = t;
    return { triangle: t, points: t.points, render: renderTriangle(t) };
  });
}

/* Actions carry a `gesture` token: everything one drag produced (a landing point AND
   its segment, say) shares it, and undo removes the whole gesture at once. */
function record(t, gesture, type, entId) {
  const g = gesture || `g${entId}`;
  const last = t.history[t.history.length - 1];
  if (last && last.gesture === g) last.items.push({ type, id: entId });
  else t.history.push({ gesture: g, items: [{ type, id: entId }] });
}

export function addPoint(triId, x, y, label, playerId, gesture) {
  return call('triangle', `/v1/triangles/${triId}/points`, {
    method: 'POST',
    body: { x, y, label, player_id: playerId, gesture },
    playerId
  }, () => {
    const t = mock.triangle;
    const point = { id: id(), label: label || `P${t.points.filter(p => p.kind !== 'vertex').length + 1}`, x, y, kind: 'point' };
    t.points.push(point);
    record(t, gesture, 'point', point.id);
    return { point, points: t.points, render: renderTriangle(t) };
  });
}

/* Undo: pops the last gesture and removes everything it created. Vertices are not
   gestures, so the triangle itself is never undone. */
export function undoLast(triId) {
  return call('triangle', `/v1/triangles/${triId}/undo`, { method: 'POST' }, () => {
    const t = mock.triangle;
    const last = t.history.pop();
    if (last) {
      last.items.forEach(({ type, id: entId }) => {
        if (type === 'point') t.points = t.points.filter(p => p.id !== entId);
        if (type === 'segment') t.segments = t.segments.filter(s => s.id !== entId);
        if (type === 'center') t.centers = t.centers.filter(c => c.id !== entId);
      });
    }
    return { points: t.points, segments: t.segments, centers: t.centers, render: renderTriangle(t) };
  });
}

/* The midpoint of a segment — in the UI, one tap on the segment. The answer carries
   `parent` (the segment's endpoints): it is what lets the frontend test, later, if a
   stroke leaving this midpoint is perpendicular to the segment it bisects. */
export function midpoint(triId, p, q, playerId, gesture) {
  /* POST, not the older GET: a request with a side effect is a trap in front of any
     cache or proxy. The server keeps the GET as an alias, but this is the real one. */
  return call('triangle', `/v1/triangles/${triId}/midpoints`, {
    method: 'POST',
    body: { x1: p.x, y1: p.y, x2: q.x, y2: q.y, player_id: playerId, gesture },
    playerId
  }, () => {
    const t = mock.triangle;
    /* Compact labels only when the parents have single-letter names — a midpoint of
       midpoints would otherwise be called M(M(AB)M(BC)). */
    const simple = l => l && l.length === 1;
    const point = {
      id: id(),
      label: simple(p.label) && simple(q.label)
        ? `M(${p.label}${q.label})`
        : `M${t.points.filter(x => x.kind === 'midpoint').length + 1}`,
      x: (p.x + q.x) / 2,
      y: (p.y + q.y) / 2,
      kind: 'midpoint',
      parent: { x1: p.x, y1: p.y, x2: q.x, y2: q.y }
    };
    t.points.push(point);
    record(t, gesture, 'point', point.id);
    return { point, points: t.points, render: renderTriangle(t) };
  });
}

/* A segment is always the straight stroke from → to. `ortho: true` marks the ones the
   gesture snapped to an exact perpendicular (the ⊥ signal in the drawing); by
   convention `from` is the end that touches the base segment — the midpoint, or the
   foot of the perpendicular — which is where the render puts the signal. */
export function addSegment(triId, p, q, { ortho = false, bisector = false, gesture } = {}, playerId) {
  return call('triangle', `/v1/triangles/${triId}/segments`, {
    method: 'POST',
    body: { from: [p.x, p.y], to: [q.x, q.y], ortho, bisector, player_id: playerId, gesture },
    playerId
  }, () => {
    const t = mock.triangle;
    const segment = { id: id(), from: [p.x, p.y], to: [q.x, q.y], ortho, bisector };
    t.segments.push(segment);
    /* Only the LAST THREE strokes live on the canvas: drawing a fourth evicts the
       oldest, first-in-first-out — and the eviction cascades like any delete, taking
       the evicted stroke's now-orphaned endpoints with it. */
    if (t.segments.length > 3) removeSegmentsCascade(t, [t.segments[0]]);
    record(t, gesture, 'segment', segment.id);
    /* points ships too: the eviction may have taken orphaned endpoints with it. */
    return { segment, segments: t.segments, points: t.points, render: renderTriangle(t) };
  });
}

/* Targeted deletes, for the select + Supr / trash gesture. The construction never
   dangles: a deleted segment takes with it every endpoint of its own — midpoints
   included, the original triangle's vertices never — that no other segment still
   uses; a deleted point takes every segment that touches it, and those segments'
   now-orphaned endpoints go too. */
const touchesPt = (s, pt) =>
  (s.from[0] === pt.x && s.from[1] === pt.y) || (s.to[0] === pt.x && s.to[1] === pt.y);

function removeSegmentsCascade(t, doomed) {
  const removed = t.segments.filter(s => doomed.includes(s));
  t.segments = t.segments.filter(s => !doomed.includes(s));
  const candidates = [];
  removed.forEach(s => {
    [s.from, s.to].forEach(([x, y]) => {
      const pt = t.points.find(p => p.x === x && p.y === y);
      if (pt && pt.kind !== 'vertex' && !candidates.includes(pt)) candidates.push(pt);
    });
  });
  candidates.forEach(pt => {
    if (!t.segments.some(s => touchesPt(s, pt))) t.points = t.points.filter(p => p !== pt);
  });
}

export function deletePoint(triId, pointId) {
  return call('triangle', `/v1/triangles/${triId}/points/${pointId}`, { method: 'DELETE' }, () => {
    const t = mock.triangle;
    const p = t.points.find(x => String(x.id) === String(pointId));
    if (!p) return { points: t.points, segments: t.segments, centers: t.centers, render: renderTriangle(t) };
    if (p.kind === 'vertex') {
      throw Object.assign(new Error('Los vértices del triángulo no se borran: para otro triángulo, constrúyelo de nuevo.'), { userFacing: true });
    }
    t.points = t.points.filter(x => x !== p);
    removeSegmentsCascade(t, t.segments.filter(s => touchesPt(s, p)));
    return { points: t.points, segments: t.segments, centers: t.centers, render: renderTriangle(t) };
  });
}

export function deleteSegment(triId, segId) {
  return call('triangle', `/v1/triangles/${triId}/segments/${segId}`, { method: 'DELETE' }, () => {
    const t = mock.triangle;
    removeSegmentsCascade(t, t.segments.filter(s => String(s.id) === String(segId)));
    return { points: t.points, segments: t.segments, centers: t.centers, render: renderTriangle(t) };
  });
}

/* Each player's answer to «¿cuál es el centro?» — one bet per player (upsert): the
   shared canvas shows everyone's crosses, ready to compare against the real three. */
export function chooseCenter(triId, x, y, playerId, gesture) {
  return call('triangle', `/v1/triangles/${triId}/center`, {
    method: 'POST',
    body: { x, y, player_id: playerId, gesture },
    playerId
  }, () => {
    const t = mock.triangle;
    const p = mock.players.find(pl => pl.id === playerId);
    const prev = t.centers.find(c => c.player_id === playerId);
    if (prev) {
      prev.x = x;
      prev.y = y;
    } else {
      const center = { id: id(), player_id: playerId, player_name: p?.name || '', x, y };
      t.centers.push(center);
      record(t, gesture, 'center', center.id);
    }
    return { centers: t.centers, render: renderTriangle(t) };
  });
}

/* ═══════════════════ Local rendering ═══════════════════
   The mock's drawings double as the reference implementation of the Render API's
   contract (docs/apis/render-api.md): same palette, same viewBox, same highlights. */

function renderDice(game, round, s) {
  const W = 980;
  let b = '';
  let y = 40;

  if (round) {
    const who = round.player_name ? `${round.player_name} · ` : '';
    b += txt(30, y, `${who}${round.win ? 'GANA CHEVALIER' : 'GANA EL OPONENTE'}`, {
      fs: 12, fill: round.win ? C.reveal : C.ink3, ls: 1.6, fw: 600
    });
    y += 22;
    if (round.game === 'one-die-4') {
      round.rolls.forEach((f, i) => { b += die(30 + i * 92, y, 72, f, f === 6); });
      y += 110;
    } else {
      /* A 6 × 4 grid: six pairs per row, four rows, each pair laid side by side. */
      round.rolls.forEach(([f1, f2], i) => {
        const col = i % 6, row = Math.floor(i / 6);
        const x = 30 + col * 155, yy = y + row * 70;
        const hot = f1 === 6 && f2 === 6;
        b += die(x, yy, 52, f1, hot);
        b += die(x + 56, yy, 52, f2, hot);
      });
      y += 4 * 70 + 12;
    }
  }

  /* The class marcador. */
  const g1 = s.games['one-die-4'], g2 = s.games['two-dice-24'];
  const line = (gy, name, g) => {
    let out = txt(30, gy, name, { fs: 11, fill: C.ask, ls: 1.4 });
    out += txt(360, gy, `${g.rounds} ${g.rounds === 1 ? 'ronda' : 'rondas'}`, { fs: 12.5, fill: C.ink2 });
    out += txt(520, gy, `${g.wins} ${g.wins === 1 ? 'ganada' : 'ganadas'}`, { fs: 12.5, fill: C.ink2 });
    out += txt(690, gy, g.win_pct === null ? '—' : `${g.win_pct}%`, { fs: 14, fill: C.ink, fw: 600 });
    return out;
  };
  b += `<line x1="30" y1="${y}" x2="950" y2="${y}" stroke="${C.line}" stroke-width="1"/>`;
  y += 30;
  b += line(y, 'JUEGO 1 · UN 6 EN 4 TIROS', g1);
  y += 30;
  b += line(y, 'JUEGO 2 · DOBLE 6 EN 24 TIROS', g2);
  y += 36;
  const signed = n => (n > 0 ? `+${n}` : `${n}`);
  b += txt(30, y, `MONEDAS — Chevalier: ${signed(s.coins.chevalier)} · Oponente: ${signed(s.coins.opponent)}`, {
    fs: 12.5, fill: C.reveal, ls: 1.2
  });
  y += 20;
  b += txt(30, y, 'cada ronda se apuesta una moneda: el que pierde, la entrega', {
    fs: 11, fill: C.ink3
  });
  y += 22;

  return svg(W, y, 'Última ronda de dados con los seises resaltados y marcador acumulado de los dos juegos', b);
}

function renderTriangle(t) {
  /* The view: the triangle's LONGEST side lies parallel to the x axis, the apex above
     it, the whole thing centered. The scale comes from that side, and the window does
     not go past the triangle's height plus a relative margin — a tall thin triangle
     never again floats in a sea of empty canvas. Everything drawn (and the click
     mapping in the frontend) goes through this one rotation. */
  const [v0, v1, v2] = t.vertices;
  const sidePairs = [[v0, v1], [v1, v2], [v2, v0]];
  const longest = sidePairs.reduce((best, s) =>
    Math.hypot(s[1][0] - s[0][0], s[1][1] - s[0][1]) >
    Math.hypot(best[1][0] - best[0][0], best[1][1] - best[0][1]) ? s : best);
  let rot = Math.atan2(longest[1][1] - longest[0][1], longest[1][0] - longest[0][0]);
  const view = ([x, y]) => ({
    x: x * Math.cos(rot) + y * Math.sin(rot),
    y: -x * Math.sin(rot) + y * Math.cos(rot)
  });
  /* Apex above the base: if rotating left it below, turn the whole view around. */
  const apex = t.vertices.find(v => v !== longest[0] && v !== longest[1]);
  if (view(apex).y < view(longest[0]).y) rot += Math.PI;

  /* The margins come from the triangle (relative to its longest side and height),
     but the window fits ALL the content: the triangle, every point and stroke, and
     the center bets — a ✕ thrown outside the triangle must stay on screen. */
  const tv = t.vertices.map(view);
  const tX0 = Math.min(...tv.map(p => p.x)), tX1 = Math.max(...tv.map(p => p.x));
  const tY0 = Math.min(...tv.map(p => p.y)), tY1 = Math.max(...tv.map(p => p.y));
  const L = tX1 - tX0, hgt = tY1 - tY0 || L * 0.2;

  /* The three centers this activity can construct, computed up front: baricentro,
     circuncentro y ortocentro. They go into the window's bounding box, so in an
     obtuse triangle — where two of them live OUTSIDE — the construction still has
     room to arrive on screen. */
  const [vA, vB, vC] = t.vertices;
  const G = [(vA[0] + vB[0] + vC[0]) / 3, (vA[1] + vB[1] + vC[1]) / 3];
  const Dq = 2 * (vA[0] * (vB[1] - vC[1]) + vB[0] * (vC[1] - vA[1]) + vC[0] * (vA[1] - vB[1])) || 1;
  const sq = v => v[0] * v[0] + v[1] * v[1];
  const O = [
    (sq(vA) * (vB[1] - vC[1]) + sq(vB) * (vC[1] - vA[1]) + sq(vC) * (vA[1] - vB[1])) / Dq,
    (sq(vA) * (vC[0] - vB[0]) + sq(vB) * (vA[0] - vC[0]) + sq(vC) * (vB[0] - vA[0])) / Dq
  ];
  /* Orthocenter, via the identity H = 3G − 2O. */
  const Ho = [3 * G[0] - 2 * O[0], 3 * G[1] - 2 * O[1]];

  const content = [
    ...tv,
    view(G), view(O), view(Ho),
    ...t.points.map(p => view([p.x, p.y])),
    ...t.segments.flatMap(s => [view(s.from), view(s.to)]),
    ...(t.centers || []).map(c => view([c.x, c.y]))
  ];
  const X0 = Math.min(...content.map(p => p.x)), X1 = Math.max(...content.map(p => p.x));
  const Y0 = Math.min(...content.map(p => p.y)), Y1 = Math.max(...content.map(p => p.y));
  const mX = L * 0.1, mY = hgt * 0.16;
  const vw = (X1 - X0) + 2 * mX, vh = (Y1 - Y0) + 2 * mY;

  const W = 980;
  let k = W / vw;
  let H = Math.round(k * vh) + 44; /* room for the footer line */
  if (H > 720) {
    k = 676 / vh;
    H = 720;
  }
  const ox = (W - k * vw) / 2 - k * (X0 - mX);
  const oy = (H - 44 - k * vh) / 2 + k * (Y1 + mY);
  /* One world point → one canvas point, rotation included. */
  const P = (x, y) => {
    const v = view([x, y]);
    return [ox + k * v.x, oy - k * v.y];
  };
  const sx = (x, y) => P(x, y)[0];
  const sy = (x, y) => P(x, y)[1];

  let b = '';
  const [A, B, Cv] = t.vertices;
  const EXT = 0.3;
  const sidesW = [[A, B], [B, Cv], [Cv, A]];

  /* A line through two canvas points, clipped to the canvas rectangle. */
  const clipToCanvas = (F, T) => {
    const dx = T[0] - F[0], dy = T[1] - F[1];
    const ts = [];
    if (dx) ts.push((0 - F[0]) / dx, (W - F[0]) / dx);
    if (dy) ts.push((0 - F[1]) / dy, (H - 44 - F[1]) / dy);
    const pts = ts
      .map(s => [F[0] + s * dx, F[1] + s * dy, s])
      .filter(([x, y]) => x >= -1 && x <= W + 1 && y >= -1 && y <= H - 43)
      .sort((a, b) => a[2] - b[2]);
    if (pts.length < 2) return null;
    return [pts[0], pts[pts.length - 1]];
  };

  /* Each side runs dotted from edge to edge of the canvas (its line, not just a
     stub): the foot of an obtuse altura can land far past the vertices, and it has
     to land on something visible. The solid stroke is the side proper. */
  sidesW.forEach(([p1, p2]) => {
    const F = P(p1[0], p1[1]), T = P(p2[0], p2[1]);
    const clip = clipToCanvas(F, T);
    if (clip) b += pline([[clip[0][0], clip[0][1]], [clip[1][0], clip[1][1]]], C.ink3, { sw: 1, dash: '2 5', op: 0.8 });
  });
  b += pline([P(A[0], A[1]), P(B[0], B[1]), P(Cv[0], Cv[1]), P(A[0], A[1])], C.ink2, { sw: 1.6 });

  t.segments.forEach(seg => {
    const F = P(seg.from[0], seg.from[1]), T = P(seg.to[0], seg.to[1]);
    if (seg.ortho) {
      /* An orthogonal runs dotted ALL the way across the canvas — a mediatriz is a
         line, and two of them must be able to meet however short the stroke was. */
      const clip = clipToCanvas(F, T);
      if (clip) b += pline([[clip[0][0], clip[0][1]], [clip[1][0], clip[1][1]]], C.ink3, { sw: 1, dash: '2 5', op: 0.8 });
    } else {
      /* Plain segments extend past their ends by a stretch, dotted like the sides. */
      const edx = T[0] - F[0], edy = T[1] - F[1];
      b += pline([[F[0] - edx * EXT, F[1] - edy * EXT], [F[0], F[1]]], C.ink3, { sw: 1, dash: '2 5', op: 0.8 });
      b += pline([[T[0], T[1]], [T[0] + edx * EXT, T[1] + edy * EXT]], C.ink3, { sw: 1, dash: '2 5', op: 0.8 });
    }
    b += pline([F, T], C.ask, { sw: 1.4, op: 0.9 });
    if (seg.bisector) {
      /* The equal-angles signal: one arc across each half-angle at the vertex end
         (`from`), same radius, each with its tick — the classic notation for «este
         trazo parte el ángulo en dos iguales». Directions come from the triangle's
         own vertices, so the arcs hug the real angle. */
      const vtx = t.vertices.find(vv => Math.abs(vv[0] - seg.from[0]) < 1e-6 && Math.abs(vv[1] - seg.from[1]) < 1e-6);
      if (vtx) {
        const others = t.vertices.filter(vv => vv !== vtx);
        const Vs = P(vtx[0], vtx[1]);
        const ang = q => Math.atan2(P(q[0], q[1])[1] - Vs[1], P(q[0], q[1])[0] - Vs[0]);
        const aBis = Math.atan2(T[1] - F[1], T[0] - F[0]);
        const arcTick = (a1, a2) => {
          let da = a2 - a1;
          while (da > Math.PI) da -= 2 * Math.PI;
          while (da < -Math.PI) da += 2 * Math.PI;
          const r = 16, sweep = da > 0 ? 1 : 0;
          const x1 = Vs[0] + r * Math.cos(a1), y1 = Vs[1] + r * Math.sin(a1);
          const x2 = Vs[0] + r * Math.cos(a2), y2 = Vs[1] + r * Math.sin(a2);
          const am = a1 + da / 2;
          let s2 = `<path d="M${x1},${y1} A${r},${r} 0 0 ${sweep} ${x2},${y2}" fill="none" stroke="${C.reveal}" stroke-width="1.2"/>`;
          s2 += `<line x1="${Vs[0] + (r - 4) * Math.cos(am)}" y1="${Vs[1] + (r - 4) * Math.sin(am)}" x2="${Vs[0] + (r + 4) * Math.cos(am)}" y2="${Vs[1] + (r + 4) * Math.sin(am)}" stroke="${C.reveal}" stroke-width="1.2"/>`;
          return s2;
        };
        b += arcTick(ang(others[0]), aBis) + arcTick(aBis, ang(others[1]));
      }
    }
    if (seg.ortho) {
      /* The ⊥ signal, at the end that touches the base (by convention, `from`): the
         classic right-angle square, drawn from the segment's own direction — valid
         because the snap made it exactly perpendicular. */
      const ux = T[0] - F[0], uy = T[1] - F[1];
      const l = Math.hypot(ux, uy) || 1;
      const u = [ux / l, uy / l], w = [-u[1], u[0]], m = 11;
      const [ax, ay] = F;
      b += `<path d="M${ax + m * u[0]},${ay + m * u[1]} L${ax + m * (u[0] + w[0])},${ay + m * (u[1] + w[1])} L${ax + m * w[0]},${ay + m * w[1]}" fill="none" stroke="${C.reveal}" stroke-width="1.4"/>`;
      b += txt(ax + 18 * (u[0] + w[0]), ay + 18 * (u[1] + w[1]) + 4, '⊥', { fs: 14, fill: C.reveal });
    }
  });

  /* Clickable segments: an invisible fat stroke over each triangle side — covering
     its dotted line across the whole canvas — and each student segment. */
  sidesW.forEach(([p1, p2], i) => {
    const F = P(p1[0], p1[1]), T = P(p2[0], p2[1]);
    const clip = clipToCanvas(F, T) || [F, T];
    b += `<line x1="${clip[0][0]}" y1="${clip[0][1]}" x2="${clip[1][0]}" y2="${clip[1][1]}" stroke="transparent" stroke-width="16" data-seg="side-${i}"/>`;
  });
  t.segments.forEach(seg => {
    const F = P(seg.from[0], seg.from[1]), T = P(seg.to[0], seg.to[1]);
    const edx = T[0] - F[0], edy = T[1] - F[1];
    b += `<line x1="${F[0] - edx * EXT}" y1="${F[1] - edy * EXT}" x2="${T[0] + edx * EXT}" y2="${T[1] + edy * EXT}" stroke="transparent" stroke-width="16" data-seg="${seg.id}"/>`;
  });

  t.points.forEach(p => {
    const col = p.kind === 'vertex' ? C.ink : p.kind === 'midpoint' ? C.reveal : C.ask;
    const [px, py] = P(p.x, p.y);
    b += dot(px, py, p.kind === 'vertex' ? 5 : 4.5, col);
    /* Labels carry their anchor: the frontend repositions them per zoom so the gap
       between a name and its point stays constant on screen, like the ink. */
    b += `<text x="${px + 9}" y="${py - 8}" data-ax="${px}" data-ay="${py}" data-ox="9" data-oy="-8" fill="${col}" font-family="${MONO}" font-size="12.5">${p.label}</text>`;
    /* The clickable target: a generous invisible circle over each point, drawn after
       the segment hit-lines so a point always wins the tap. The frontend selects by
       delegating clicks to [data-point-id] and paints the selection ring here. */
    b += `<circle cx="${px}" cy="${py}" r="16" fill="transparent" data-point-id="${p.id}"/>`;
  });

  /* The bets: where each player says the center is. Crosses, so they never get
     confused with the construction's points. */
  (t.centers || []).forEach(cn => {
    const [x, y] = P(cn.x, cn.y);
    b += `<path d="M${x - 6},${y - 6} L${x + 6},${y + 6} M${x - 6},${y + 6} L${x + 6},${y - 6}" stroke="${C.ask}" stroke-width="2" fill="none"/>`;
    if (cn.player_name) b += `<text x="${x + 10}" y="${y + 4}" data-ax="${x}" data-ay="${y}" data-ox="10" data-oy="4" fill="${C.ink3}" font-family="${MONO}" font-size="10">${cn.player_name}</text>`;
  });

  b += txt(30, H - 14, `LADO ${t.side1} · ÁNGULO ${t.angle}° · LADO ${t.side2}`, { fs: 10.5, fill: C.ink3, ls: 1.6 });

  /* The svg root carries the world→canvas transform — offsets, scale AND rotation —
     so the frontend can map a click back to world coordinates. */
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Triángulo construido con lado ${t.side1}, ángulo de ${t.angle} grados y lado ${t.side2}, con su lado más largo horizontal y los puntos, puntos medios y segmentos que la clase ha ido registrando" data-k="${k}" data-ox="${ox}" data-oy="${oy}" data-rot="${rot}">${b}</svg>`;
}
