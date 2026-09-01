/* The «¿cuál es el centro?» activity. The class builds a triangle by side–angle–side
   and from there everything happens ON the drawing, with two gestures:

   - DRAG from one point to another → the segment that joins them. Release the drag
     over another segment and it lands there (a new point on it); within ±15° of the
     true perpendicular it SNAPS to the exact foot and gets the ⊥ signal. From a
     midpoint, a drag released on empty canvas within the margin snaps to the exact
     perpendicular of the segment it bisects. Outside the margin, onto nothing, the
     stroke just cancels: every point in this activity lives on a segment.
   - HOVER near the middle of a segment (a side, or one drawn) → a ghost marker shows
     where its midpoint is, with a forgiving margin; a tap registers it.

   The SVG arrives drawn from the Actividades API (or the local mock): points carry
   invisible [data-point-id] hit circles, segments carry [data-seg] hit strokes, and
   the svg root carries its world→canvas transform. See docs/apis/render-api.md. */

import { useEffect, useRef, useState } from 'react';
import {
  registerPlayer, createTriangle, addPoint, midpoint, addSegment,
  deletePoint, deleteSegment, chooseCenter, undoLast, isMock, isNonProd, ENV
} from './api.js';

/* |cos| of the angle between stroke and base ≤ cos(75°) ⇒ within 15° of perpendicular. */
const ORTHO_TOL = Math.cos((75 * Math.PI) / 180);
const isOrtho = (u, v) => {
  const lu = Math.hypot(u.x, u.y), lv = Math.hypot(v.x, v.y);
  if (!lu || !lv) return false;
  return Math.abs((u.x * v.x + u.y * v.y) / (lu * lv)) <= ORTHO_TOL;
};
const r2 = n => Math.round(n * 100) / 100;
const SVG_NS = 'http://www.w3.org/2000/svg';
/* Everything one drag produces shares a gesture token, so Ctrl+Z undoes it whole. */
const gid = () => `g${Date.now().toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`;
/* Sides extend 30% past their vertices (dotted): a foot can land there. */
const EXT = 0.3;

export default function TriangleActivity() {
  const [name, setName] = useState('');
  const [player, setPlayer] = useState(null);
  const [form, setForm] = useState({ l1: '', ang: '', l2: '' });
  const [tri, setTri] = useState(null);
  const [points, setPoints] = useState([]);
  const [segments, setSegments] = useState([]);
  const [render, setRender] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  /* «Elegir el centro»: choosing arms the mode, pick holds the provisional bet, and
     sent closes the game — one center per player, and after Enviar the drawing turns
     read-only (only the lens keeps working). */
  const [choosing, setChoosing] = useState(false);
  const [pick, setPick] = useState(null);
  const [sent, setSent] = useState(false);
  /* A tapped point or segment, deletable with Supr/Backspace. */
  const [sel, setSel] = useState(null);
  /* The lens over the canvas: wheel zooms around the cursor, holding a click on the
     background pans, and the expand button resets. Pure CSS transform — the svg's own
     coordinates never change, so every gesture keeps working while zoomed. */
  const [viewT, setViewT] = useState({ s: 1, x: 0, y: 0 });
  const pan = useRef(null);
  const wrap = useRef(null);
  const pickEl = useRef(null);
  /* Gesture scratch space — imperative on purpose: the rubber band and the midpoint
     ghost redraw on every pointer move, and the svg they live in is replaced wholesale
     after each construction anyway. */
  const drag = useRef(null);   // { pid, x0, y0, moved, line }
  const ghost = useRef(null);  // { ref (data-seg), el }
  const orthoEl = useRef(null); // live ⊥ preview while a drag is perpendicular

  const run = async fn => {
    setBusy(true);
    setError('');
    try {
      await fn();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const enter = () => run(async () => {
    const { player: p } = await registerPlayer(name, 'triangle');
    setPlayer(p);
  });

  const create = () => run(async () => {
    const { triangle, points: ps, render: r } = await createTriangle(
      Number(form.l1), Number(form.ang), Number(form.l2), player.id
    );
    setTri(triangle);
    setPoints(ps);
    setSegments([]);
    setRender(r);
  });

  /* ── Coordinates ── */
  const svgEl = () => wrap.current?.querySelector('svg');
  const vbOf = e => {
    const svg = svgEl();
    if (!svg) return null;
    const r = svg.getBoundingClientRect();
    const scale = 980 / r.width;
    return { x: (e.clientX - r.left) * scale, y: (e.clientY - r.top) * scale };
  };
  const worldOf = vb => {
    const d = svgEl()?.dataset;
    if (!d || !vb) return null;
    const k = +d.k, ox = +d.ox, oy = +d.oy, rot = +d.rot;
    const vx = (vb.x - ox) / k, vy = (oy - vb.y) / k;
    return { x: vx * Math.cos(rot) - vy * Math.sin(rot), y: vx * Math.sin(rot) + vy * Math.cos(rot) };
  };

  const byId = pid => points.find(p => String(p.id) === pid);

  /* A [data-seg] reference back to its two endpoints (with labels when they exist). */
  const segEnds = ref => {
    if (ref.startsWith('side-')) {
      const i = Number(ref.slice(5)), j = (i + 1) % 3;
      const labs = ['A', 'B', 'C'], v = tri.vertices;
      return [
        { x: v[i][0], y: v[i][1], label: labs[i] },
        { x: v[j][0], y: v[j][1], label: labs[j] }
      ];
    }
    const s = segments.find(x => String(x.id) === ref);
    if (!s) return null;
    const lab = (x, y) => points.find(p => p.x === x && p.y === y)?.label;
    return [
      { x: s.from[0], y: s.from[1], label: lab(s.from[0], s.from[1]) },
      { x: s.to[0], y: s.to[1], label: lab(s.to[0], s.to[1]) }
    ];
  };

  /* World → canvas, the same transform the svg declares (for the live previews). */
  const screenOf = w => {
    const d = svgEl()?.dataset;
    if (!d) return null;
    const k = +d.k, ox = +d.ox, oy = +d.oy, rot = +d.rot;
    const vx = w.x * Math.cos(rot) + w.y * Math.sin(rot);
    const vy = -w.x * Math.sin(rot) + w.y * Math.cos(rot);
    return { x: ox + k * vx, y: oy - k * vy };
  };

  const apply = res => {
    if (res.points) setPoints(res.points);
    if (res.segments) setSegments(res.segments);
    /* A delete (or a FIFO eviction) can take the selected thing away in cascade:
       the selection must not keep pointing at a ghost. */
    setSel(s => {
      if (!s) return s;
      if (s.type === 'segment' && res.segments && !s.ref.startsWith('side-')
        && !res.segments.some(x => String(x.id) === s.ref)) return null;
      if (s.type === 'point' && res.points
        && !res.points.some(x => String(x.id) === s.ref)) return null;
      return s;
    });
    setRender(res.render);
  };

  /* Register the landing point, then the stroke to it — one gesture, so Ctrl+Z takes
     both. For a ⊥, `anchor` names the end that touches the base — 'p' when it leaves
     a midpoint, 'at' when it lands on the foot — where the render puts the signal. */
  const drawToNewPoint = (p, at, { ortho = false, bisector = false, anchor = 'p' } = {}) => run(async () => {
    const g = gid();
    const made = await addPoint(tri.id, r2(at.x), r2(at.y), null, player.id, g);
    setPoints(made.points);
    const landed = { x: r2(at.x), y: r2(at.y) };
    const [from, to] = anchor === 'at' ? [landed, p] : [p, landed];
    apply(await addSegment(tri.id, from, to, { ortho, bisector, gesture: g }, player.id));
  });

  /* Delete whatever is selected — shared by the Supr/Backspace keys and the trash
     button that lives, always visible, next to the lens controls. */
  const deleteSel = () => {
    if (busy || sent) return;
    if (!sel) {
      setError('No hay nada seleccionado: toca primero el punto o el segmento que quieres borrar.');
      return;
    }
    if (sel.type === 'segment' && sel.ref.startsWith('side-')) {
      setError('Los lados del triángulo no se borran: son el triángulo.');
      return;
    }
    run(async () => {
      apply(sel.type === 'point'
        ? await deletePoint(tri.id, sel.ref)
        : await deleteSegment(tri.id, sel.ref));
      setSel(null);
    });
  };

  /* Keyboard: Ctrl/Cmd+Z undoes the last construction; Supr/Backspace deletes the
     tapped selection. Only while the activity is on screen and nothing is typing. */
  useEffect(() => {
    if (!tri) return undefined;
    const onKey = e => {
      /* Skip only TYPING fields. The zoom slider is an <input type="range"> and it
         KEEPS focus after use (the canvas prevents default on pointerdown, so a tap
         never steals it back) — swallowing Supr/Backspace there was why a selected
         segment would not delete after zooming. */
      if ((e.target.tagName === 'INPUT' && e.target.type !== 'range') || sent) return;
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (!busy) run(async () => { apply(await undoLast(tri.id)); });
        return;
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteSel();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  /* Selection highlight, repainted on the fresh svg of every construction. */
  useEffect(() => {
    const w = wrap.current;
    if (!w) return;
    w.querySelectorAll('[data-point-id]').forEach(el => {
      const on = sel?.type === 'point' && sel.ref === el.getAttribute('data-point-id');
      el.setAttribute('stroke', on ? '#5BC8CE' : 'none');
      el.setAttribute('stroke-width', on ? String(2.5 / viewT.s) : '0');
    });
    w.querySelectorAll('[data-seg]').forEach(el => {
      const on = sel?.type === 'segment' && sel.ref === el.getAttribute('data-seg');
      el.setAttribute('stroke', on ? 'rgba(91,200,206,.3)' : 'transparent');
    });
  }, [render, sel, viewT.s]);

  /* ── The midpoint ghost ── */
  const hideGhost = () => {
    ghost.current?.el?.remove();
    ghost.current = null;
  };
  const showGhost = (seg, mx, my) => {
    const svg = svgEl();
    if (!svg) return;
    if (!ghost.current) {
      const el = document.createElementNS(SVG_NS, 'circle');
      el.setAttribute('r', String(8 / viewT.s));
      el.setAttribute('fill', 'rgba(220,75,62,.25)');
      el.setAttribute('stroke', '#DC4B3E');
      el.setAttribute('stroke-width', String(1.4 / viewT.s));
      el.setAttribute('stroke-dasharray', '3 3');
      el.setAttribute('pointer-events', 'none');
      svg.appendChild(el);
      ghost.current = { el };
    }
    ghost.current.ref = seg;
    ghost.current.el.setAttribute('cx', mx);
    ghost.current.el.setAttribute('cy', my);
  };

  const makeMidpoint = ref => {
    /* Midpoints exist only for the triangle's own sides. */
    if (!ref.startsWith('side-')) return;
    const ends = segEnds(ref);
    if (!ends) return;
    const mx = (ends[0].x + ends[1].x) / 2, my = (ends[0].y + ends[1].y) / 2;
    /* The same middle twice would just pile up a twin point. */
    if (points.some(p => Math.abs(p.x - mx) < 1e-6 && Math.abs(p.y - my) < 1e-6)) return;
    run(async () => { apply(await midpoint(tri.id, ends[0], ends[1], player.id, gid())); });
  };

  /* ── The only legal constructions: the ones that build a center ──
     medianas (vértice → punto medio del lado opuesto), mediatrices (⊥ desde un punto
     medio de lado) y alturas (vértice ⊥ a su lado opuesto). Nada más se traza. */
  const vertexIndex = p => (p?.kind === 'vertex' ? ['A', 'B', 'C'].indexOf(p.label) : -1);
  const sideOppositeTo = vi => ['side-1', 'side-2', 'side-0'][vi];
  const isMedian = (p, q) => {
    const v = [p, q].find(x => x.kind === 'vertex');
    const m = [p, q].find(x => x.kind === 'midpoint');
    if (!v || !m || !m.parent) return false;
    const ends = segEnds(sideOppositeTo(vertexIndex(v)));
    if (!ends) return false;
    const close = (a, b) => Math.abs(a.x - b.x) < 0.02 && Math.abs(a.y - b.y) < 0.02;
    const p1 = { x: m.parent.x1, y: m.parent.y1 }, p2 = { x: m.parent.x2, y: m.parent.y2 };
    return (close(p1, ends[0]) && close(p2, ends[1])) || (close(p1, ends[1]) && close(p2, ends[0]));
  };
  const isAltura = (p, ref) => {
    const vi = vertexIndex(p);
    return vi >= 0 && ref === sideOppositeTo(vi);
  };
  /* The bisector from a vertex: its exact direction and where it cuts the opposite
     side (J→K divided in the ratio of the adjacent sides). */
  const bisectorOf = p => {
    const vi = vertexIndex(p);
    if (vi < 0) return null;
    const v = tri.vertices;
    const V = v[vi], J = v[(vi + 1) % 3], K = v[(vi + 2) % 3];
    const dJ = Math.hypot(J[0] - V[0], J[1] - V[1]), dK = Math.hypot(K[0] - V[0], K[1] - V[1]);
    const u1 = { x: (J[0] - V[0]) / dJ, y: (J[1] - V[1]) / dJ };
    const u2 = { x: (K[0] - V[0]) / dK, y: (K[1] - V[1]) / dK };
    const bl = Math.hypot(u1.x + u2.x, u1.y + u2.y) || 1;
    return {
      dir: { x: (u1.x + u2.x) / bl, y: (u1.y + u2.y) / bl },
      cut: { x: (dK * J[0] + dJ * K[0]) / (dJ + dK), y: (dK * J[1] + dJ * K[1]) / (dJ + dK) }
    };
  };
  /* How far a stroke deviates from a target direction (radians; same-way only). */
  const deviation = (u, d) => {
    const lu = Math.hypot(u.x, u.y) || 1, ld = Math.hypot(d.x, d.y) || 1;
    return Math.acos(Math.max(-1, Math.min(1, (u.x * d.x + u.y * d.y) / (lu * ld))));
  };
  const MARGIN = (15 * Math.PI) / 180;

  /* A free stroke from a vertex can be the ALTURA or the BISECTRIZ — whichever
     direction it resembles more, both under the same ±15° margin. */
  const planVertexStroke = (p, at) => {
    const u = { x: at.x - p.x, y: at.y - p.y };
    const landA = alturaFromStroke(p, at);
    let devA = Infinity;
    if (landA) {
      const tgt = landA.vertexPt || landA.foot;
      devA = deviation(u, { x: tgt.x - p.x, y: tgt.y - p.y });
    }
    const bis = bisectorOf(p);
    let devB = Infinity;
    if (bis && Math.hypot(u.x, u.y) > 0.15 * Math.hypot(bis.cut.x - p.x, bis.cut.y - p.y)) {
      devB = deviation(u, bis.dir);
      if (devB > MARGIN) devB = Infinity;
    }
    if (devA === Infinity && devB === Infinity) return null;
    return devA <= devB ? { type: 'altura', land: landA } : { type: 'bis', bis };
  };

  /* Where the perpendicular from a vertex lands on its opposite side. Near a vertex
     (±8% del lado, incluso apenas pasado) it snaps to THE VERTEX — no twin point a
     hair away from a corner; farther out it may land on the dotted prolongation; and
     beyond that there is nothing to draw. */
  const VM = 0.08;
  const orthoLanding = p => {
    const vi = vertexIndex(p);
    if (vi < 0) return null;
    const ends = segEnds(sideOppositeTo(vi));
    if (!ends) return null;
    const [e1, e2] = ends;
    const v = { x: e2.x - e1.x, y: e2.y - e1.y };
    const len = Math.hypot(v.x, v.y) || 1;
    const tFoot = ((p.x - e1.x) * v.x + (p.y - e1.y) * v.y) / (len * len);
    const dist = Math.abs((p.x - e1.x) * v.y - (p.y - e1.y) * v.x) / len;
    const vertexPt = end => points.find(pt => pt.kind === 'vertex' && pt.label === end.label);
    if (Math.abs(tFoot) <= VM) return { vertexPt: vertexPt(e1), v, dist };
    if (Math.abs(tFoot - 1) <= VM) return { vertexPt: vertexPt(e2), v, dist };
    /* The foot lands wherever the line says — in an obtuse triangle that is well
       past the vertices, on the dotted line the drawing runs across the canvas. */
    return { foot: { x: e1.x + tFoot * v.x, y: e1.y + tFoot * v.y }, v, dist };
  };

  /* How far a ray from inside the triangle travels before crossing a side: the solid
     part of a mediatriz stops there — past the triangle it only makes sense dotted. */
  const exitDistance = (p, n) => {
    let best = Infinity;
    const v = tri.vertices;
    for (let i = 0; i < 3; i++) {
      const a = v[i], b2 = v[(i + 1) % 3];
      const ex = b2[0] - a[0], ey = b2[1] - a[1];
      const den = n.x * ey - n.y * ex;
      if (Math.abs(den) < 1e-9) continue;
      const wx = a[0] - p.x, wy = a[1] - p.y;
      const s = (wx * ey - wy * ex) / den;
      const tt = (wx * n.y - wy * n.x) / den;
      if (s > 0.02 && tt >= -0.001 && tt <= 1.001 && s < best) best = s;
    }
    return best;
  };

  /* The altura drawn long: a stroke from a vertex that crosses the opposite side
     within the ±15° margin counts, even released past it on empty canvas. */
  const alturaFromStroke = (p, at) => {
    const land = orthoLanding(p);
    if (!land) return null;
    const u = { x: at.x - p.x, y: at.y - p.y };
    if (!isOrtho(u, land.v)) return null;
    if (Math.hypot(u.x, u.y) < land.dist * 0.9) return null; /* too short: no cruzó */
    return land;
  };

  const buildAltura = (p, land) => {
    if (land.vertexPt) {
      /* The foot IS (practically) a vertex: connect to it, no new point. */
      return run(async () => {
        apply(await addSegment(tri.id, land.vertexPt, p, { ortho: true, gesture: gid() }, player.id));
      });
    }
    return drawToNewPoint(p, land.foot, { ortho: true, anchor: 'at' });
  };

  /* The point nearest a canvas position, within a forgiving radius: on a drop, a
     point always beats the segment it sits on. */
  const nearestPoint = (vb, excludePid) => {
    let best = null, bestD = 22;
    points.forEach(pt => {
      if (String(pt.id) === excludePid) return;
      const s = screenOf(pt);
      if (!s) return;
      const dd = Math.hypot(s.x - vb.x, s.y - vb.y);
      if (dd < bestD) {
        bestD = dd;
        best = pt;
      }
    });
    return best;
  };

  /* ── «Elegir el centro» ── */
  const removePick = () => {
    pickEl.current?.remove();
    pickEl.current = null;
  };
  const placePick = e => {
    const vb = vbOf(e), at = worldOf(vb);
    if (!vb || !at) return;
    removePick();
    const svg = svgEl();
    const el = document.createElementNS(SVG_NS, 'path');
    const g7 = 7 / viewT.s;
    el.setAttribute('d', `M${vb.x - g7},${vb.y - g7} L${vb.x + g7},${vb.y + g7} M${vb.x - g7},${vb.y + g7} L${vb.x + g7},${vb.y - g7}`);
    el.setAttribute('stroke', '#5BC8CE');
    el.setAttribute('stroke-width', String(2.4 / viewT.s));
    el.setAttribute('fill', 'none');
    el.setAttribute('pointer-events', 'none');
    svg.appendChild(el);
    pickEl.current = el;
    setPick({ x: r2(at.x), y: r2(at.y) });
  };
  const toggleChoosing = () => {
    if (choosing) removePick();
    setPick(null);
    setChoosing(c => !c);
    setSel(null);
    hideGhost();
  };
  const sendCenter = () => run(async () => {
    apply(await chooseCenter(tri.id, pick.x, pick.y, player.id, gid()));
    removePick();
    setPick(null);
    setChoosing(false);
    /* The drawing goes read-only: no selection ring may stay behind. */
    setSel(null);
    setSent(true);
  });

  /* Zoom lives ONLY in the slider, anchored at the canvas center. */
  const zoomTo = ns => {
    const el = wrap.current;
    const cx = el ? el.clientWidth / 2 : 0, cy = el ? el.clientHeight / 2 : 0;
    setViewT(t => {
      const f = ns / t.s;
      return { s: ns, x: cx - (cx - t.x) * f, y: cy - (cy - t.y) * f };
    });
  };

  /* Constant-size drawing: strokes, dots and labels keep their SCREEN size at any
     zoom — the lens magnifies the geometry, never the ink. Base values are cached on
     first sight (the svg is replaced on every construction, so caches reset too). */
  useEffect(() => {
    const svg = wrap.current?.querySelector('svg');
    if (!svg) return;
    const s = viewT.s;
    svg.querySelectorAll('[stroke-width]').forEach(el => {
      if (el.hasAttribute('data-point-id')) return;
      if (!el.dataset.bw) el.dataset.bw = el.getAttribute('stroke-width');
      el.setAttribute('stroke-width', String(+el.dataset.bw / s));
    });
    svg.querySelectorAll('circle[r]').forEach(el => {
      if (!el.dataset.br) el.dataset.br = el.getAttribute('r');
      el.setAttribute('r', String(+el.dataset.br / s));
    });
    svg.querySelectorAll('text').forEach(el => {
      if (!el.dataset.bf) el.dataset.bf = el.getAttribute('font-size') || '12';
      el.setAttribute('font-size', String(+el.dataset.bf / s));
    });
    /* Anchored labels (vertex names, center bets): their gap to the point they name
       stays constant on screen too — the offset shrinks as the zoom grows. */
    svg.querySelectorAll('text[data-ax]').forEach(el => {
      el.setAttribute('x', String(+el.dataset.ax + +el.dataset.ox / s));
      el.setAttribute('y', String(+el.dataset.ay + +el.dataset.oy / s));
    });
  }, [render, viewT.s]);

  /* ── Pointer gestures ── */
  const onPointerDown = e => {
    if (!tri || busy) return;
    const hitP = !choosing && !sent && e.target.closest('[data-point-id]');
    if (!hitP) {
      /* Anywhere off a point: hold and move to PAN (also while choosing a center —
         the bet is placed on release only if the pointer did not travel). The ghost
         survives the press: a still tap on it is how a midpoint gets registered. */
      if (e.target.closest('.lens')) return;
      e.preventDefault();
      pan.current = { x0: e.clientX, y0: e.clientY, tx0: viewT.x, ty0: viewT.y, moved: false };
      wrap.current.setPointerCapture(e.pointerId);
      return;
    }
    e.preventDefault();
    hideGhost();
    const svg = svgEl();
    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('x1', hitP.getAttribute('cx'));
    line.setAttribute('y1', hitP.getAttribute('cy'));
    line.setAttribute('x2', hitP.getAttribute('cx'));
    line.setAttribute('y2', hitP.getAttribute('cy'));
    line.setAttribute('stroke', '#5BC8CE');
    line.setAttribute('stroke-width', String(1.5 / viewT.s));
    line.setAttribute('stroke-dasharray', '5 4');
    line.setAttribute('opacity', '.8');
    line.setAttribute('pointer-events', 'none');
    svg.appendChild(line);
    drag.current = { pid: hitP.getAttribute('data-point-id'), x0: e.clientX, y0: e.clientY, moved: false, line };
    wrap.current.setPointerCapture(e.pointerId);
  };

  /* The live ⊥: while a drag is (or would snap) perpendicular, the same right-angle
     square and glyph the final drawing gets, at the anchor, following the stroke. */
  const previewOrtho = mark => {
    if (!mark) {
      orthoEl.current?.remove();
      orthoEl.current = null;
      return;
    }
    const svg = svgEl();
    if (!svg) return;
    if (!orthoEl.current) {
      const g = document.createElementNS(SVG_NS, 'g');
      g.setAttribute('pointer-events', 'none');
      svg.appendChild(g);
      orthoEl.current = g;
    }
    const s = viewT.s;
    if (mark.kind === 'bis') {
      /* Equal-angles preview: the same double arc-with-tick the final drawing gets. */
      const r = 16 / s;
      const arcTick = (a1, a2) => {
        let da = a2 - a1;
        while (da > Math.PI) da -= 2 * Math.PI;
        while (da < -Math.PI) da += 2 * Math.PI;
        const sweep = da > 0 ? 1 : 0, am = a1 + da / 2, V = mark.vs;
        return `<path d="M${V.x + r * Math.cos(a1)},${V.y + r * Math.sin(a1)} A${r},${r} 0 0 ${sweep} ${V.x + r * Math.cos(a2)},${V.y + r * Math.sin(a2)}" fill="none" stroke="#DC4B3E" stroke-width="${1.2 / s}"/>` +
          `<line x1="${V.x + (r - 4 / s) * Math.cos(am)}" y1="${V.y + (r - 4 / s) * Math.sin(am)}" x2="${V.x + (r + 4 / s) * Math.cos(am)}" y2="${V.y + (r + 4 / s) * Math.sin(am)}" stroke="#DC4B3E" stroke-width="${1.2 / s}"/>`;
      };
      orthoEl.current.innerHTML = arcTick(mark.a1, mark.aBis) + arcTick(mark.aBis, mark.a2);
      return;
    }
    const { at, other } = mark;
    const l = Math.hypot(other.x - at.x, other.y - at.y) || 1;
    const u = [(other.x - at.x) / l, (other.y - at.y) / l], w = [-u[1], u[0]], m = 11 / s;
    orthoEl.current.innerHTML =
      `<path d="M${at.x + m * u[0]},${at.y + m * u[1]} L${at.x + m * (u[0] + w[0])},${at.y + m * (u[1] + w[1])} L${at.x + m * w[0]},${at.y + m * w[1]}" fill="none" stroke="#DC4B3E" stroke-width="${1.4 / s}"/>` +
      `<text x="${at.x + (18 / s) * (u[0] + w[0])}" y="${at.y + (18 / s) * (u[1] + w[1]) + 4 / s}" fill="#DC4B3E" font-size="${14 / s}" font-family="Menlo, Consolas, ui-monospace, monospace">⊥</text>`;
  };

  const onPointerMove = e => {
    if (!tri) return;
    if (pan.current) {
      const dx = e.clientX - pan.current.x0, dy = e.clientY - pan.current.y0;
      /* A human click slides a few pixels — especially on a trackpad. Under 10px it
         is still a TAP (select, midpoint, bet); only past that it becomes a pan. */
      if (!pan.current.moved && Math.hypot(dx, dy) > 10) {
        pan.current.moved = true;
        hideGhost();
      }
      /* The next position is captured NOW: the state updater runs later, and by then
         a pointerup may already have nulled pan.current — reading the ref inside the
         updater was a crash that blanked the whole page mid-drag. */
      if (pan.current.moved) {
        const nx = pan.current.tx0 + dx, ny = pan.current.ty0 + dy;
        setViewT(t => ({ ...t, x: nx, y: ny }));
      }
      return;
    }
    if (choosing || sent) return;
    if (drag.current) {
      const vb = vbOf(e);
      if (!vb) return;
      if (Math.hypot(e.clientX - drag.current.x0, e.clientY - drag.current.y0) > 10) drag.current.moved = true;

      const p = byId(drag.current.pid);
      let end = vb, mark = null;
      const near = p && nearestPoint(vb, drag.current.pid);
      if (p && near) {
        /* A nearby point wins over whatever segment it sits on: the stroke previews
           the straight connection. */
        const ns = screenOf(near);
        if (ns) end = ns;
      } else if (p) {
        const under = document.elementFromPoint(e.clientX, e.clientY)?.closest?.('[data-seg]');
        const atW = worldOf(vb);
        const overOpposite = under && isAltura(p, under.getAttribute('data-seg'));
        const plan = !under && atW && vertexIndex(p) >= 0 ? planVertexStroke(p, atW) : null;
        if (overOpposite || plan?.type === 'altura') {
          /* An altura in the making — hovering the opposite side, or drawing long and
             crossing it within the margin: the stroke previews its landing (the exact
             foot, or the vertex it snaps to) with the ⊥ already showing. */
          const land = overOpposite ? orthoLanding(p) : plan.land;
          const target = land && (land.vertexPt || land.foot);
          if (target) {
            const fs = screenOf(target);
            const ps = screenOf(p);
            if (fs && ps) {
              end = fs;
              mark = { at: fs, other: ps };
            }
          }
        } else if (plan?.type === 'bis') {
          /* A bisectriz in the making: the stroke previews already snapped onto the
             exact direction, with the equal-angle arcs at the vertex. */
          const vi = vertexIndex(p);
          const v = tri.vertices;
          const vs = screenOf(p);
          const cs = screenOf(plan.bis.cut);
          const sOf = q => screenOf({ x: q[0], y: q[1] });
          const J = sOf(v[(vi + 1) % 3]), K = sOf(v[(vi + 2) % 3]);
          if (vs && cs && J && K) {
            end = cs;
            mark = {
              kind: 'bis',
              vs,
              a1: Math.atan2(J.y - vs.y, J.x - vs.x),
              a2: Math.atan2(K.y - vs.y, K.x - vs.x),
              aBis: Math.atan2(cs.y - vs.y, cs.x - vs.x)
            };
          }
        } else if (p.kind === 'midpoint' && p.parent) {
          /* Free stroke from a midpoint: inside the ±15° margin it previews already
             straightened onto the mediatriz, ⊥ at the midpoint. */
          const at = worldOf(vb);
          const v = { x: p.parent.x2 - p.parent.x1, y: p.parent.y2 - p.parent.y1 };
          const u = at && { x: at.x - p.x, y: at.y - p.y };
          if (u && isOrtho(u, v)) {
            const lv = Math.hypot(v.x, v.y) || 1;
            let n = { x: -v.y / lv, y: v.x / lv };
            if (n.x * u.x + n.y * u.y < 0) n = { x: -n.x, y: -n.y };
            const lu = Math.min(Math.hypot(u.x, u.y), exitDistance(p, n));
            const es = screenOf({ x: p.x + n.x * lu, y: p.y + n.y * lu });
            const ps = screenOf(p);
            if (es && ps) {
              end = es;
              mark = { at: ps, other: es };
            }
          }
        }
      }
      drag.current.line.setAttribute('x2', end.x);
      drag.current.line.setAttribute('y2', end.y);
      previewOrtho(mark);
      return;
    }
    /* No drag: offer the midpoint when the cursor is near the middle of one of the
       TRIANGLE'S SIDES — the only midpoints this construction hands out. Anchored to
       the side PROPER (its true vertices, never the dotted extension): a midpoint
       cannot exist outside the original triangle. Margin: a quarter of the side. */
    const el = document.elementFromPoint(e.clientX, e.clientY)?.closest?.('[data-seg]');
    if (!el || !el.getAttribute('data-seg').startsWith('side-')) return hideGhost();
    const ends = segEnds(el.getAttribute('data-seg'));
    const s1 = ends && screenOf(ends[0]), s2 = ends && screenOf(ends[1]);
    if (!s1 || !s2) return hideGhost();
    const mx = (s1.x + s2.x) / 2, my = (s1.y + s2.y) / 2;
    const vb = vbOf(e);
    const margin = Math.max(26, Math.hypot(s2.x - s1.x, s2.y - s1.y) * 0.25);
    if (vb && Math.hypot(vb.x - mx, vb.y - my) <= margin) showGhost(el.getAttribute('data-seg'), mx, my);
    else hideGhost();
  };

  const endDrag = () => {
    drag.current?.line?.remove();
    orthoEl.current?.remove();
    orthoEl.current = null;
    const d = drag.current;
    drag.current = null;
    return d;
  };

  const onPointerUp = e => {
    if (!tri || busy) {
      endDrag();
      pan.current = null;
      return;
    }

    /* A hold-and-move was a pan; a still click falls through as a tap. */
    if (pan.current) {
      const wasPan = pan.current.moved;
      pan.current = null;
      if (wasPan || sent) return;
      /* Choosing mode: the tap IS the bet — it can be re-placed until Enviar. */
      if (choosing) return placePick(e);
      if (ghost.current?.ref) {
        const ref = ghost.current.ref;
        hideGhost();
        makeMidpoint(ref);
        return;
      }
      const tapped = document.elementFromPoint(e.clientX, e.clientY)?.closest?.('[data-seg]');
      setSel(tapped ? { type: 'segment', ref: tapped.getAttribute('data-seg') } : null);
      return;
    }

    if (drag.current) {
      const d = endDrag();
      if (!d.moved) {
        /* A tap on a point: select it (Supr/Backspace deletes it). */
        setSel({ type: 'point', ref: d.pid });
        return;
      }
      const p = byId(d.pid);
      if (!p) return;
      const vb = vbOf(e);
      const under = document.elementFromPoint(e.clientX, e.clientY);
      /* A point near the release wins over the segment it sits on: connecting two
         points has priority over the perpendicular. */
      const near = vb && nearestPoint(vb, d.pid);
      const dropS = !near && under?.closest?.('[data-seg]');

      /* Point → point: only the MEDIANAS connect two points — a vertex with the
         midpoint of its opposite side. */
      if (near) {
        const q = near;
        if (q === p) return;
        /* Anything that is not a construcción hacia un centro simply does not draw. */
        if (!isMedian(p, q)) return;
        return run(async () => {
          apply(await addSegment(tri.id, p, q, { ortho: false, gesture: gid() }, player.id));
        });
      }

      const at = worldOf(vb);
      if (!at) return;

      /* Point → segment: ALWAYS the perpendicular — the stroke drops onto the exact
         foot on that segment (its dotted extension counts), the foot becomes a point,
         and the ⊥ signal marks it. */
      if (dropS) {
        const ref = dropS.getAttribute('data-seg');
        if (!isAltura(p, ref)) return;
        const land = orthoLanding(p);
        if (!land) return;
        return buildAltura(p, land);
      }

      /* Vertex → empty canvas: the stroke can be la ALTURA (≈⊥ al lado opuesto,
         aunque suelte más allá) o la BISECTRIZ (≈ la dirección que parte el ángulo
         en dos iguales, hasta su corte con el lado opuesto) — gana la más parecida. */
      if (vertexIndex(p) >= 0) {
        const plan = planVertexStroke(p, at);
        if (plan?.type === 'altura') return buildAltura(p, plan.land);
        if (plan?.type === 'bis') return drawToNewPoint(p, plan.bis.cut, { bisector: true, anchor: 'p' });
        return;
      }

      /* Midpoint → empty canvas: within the margin, the stroke straightens into the
         exact perpendicular of the segment it bisects, keeping the drawn length. No
         endpoint is registered — the mediatriz is a line, and the drawing prolongs
         it across the canvas anyway. Anything else released on nothing cancels. */
      if (p.kind === 'midpoint' && p.parent) {
        const v = { x: p.parent.x2 - p.parent.x1, y: p.parent.y2 - p.parent.y1 };
        const u = { x: at.x - p.x, y: at.y - p.y };
        if (isOrtho(u, v)) {
          const lv = Math.hypot(v.x, v.y) || 1;
          let n = { x: -v.y / lv, y: v.x / lv };
          if (n.x * u.x + n.y * u.y < 0) n = { x: -n.x, y: -n.y };
          /* The solid stroke goes at most to the triangle's own boundary; from there
             on, the drawing already runs the line dotted across the canvas. */
          const lu = Math.min(Math.hypot(u.x, u.y), exitDistance(p, n));
          const end = { x: r2(p.x + n.x * lu), y: r2(p.y + n.y * lu) };
          return run(async () => {
            apply(await addSegment(tri.id, p, end, { ortho: true, gesture: gid() }, player.id));
          });
        }
      }
      return;
    }

  };

  /* The pointer is captured during a drag or a pan, so leaving the frame must NOT
     cancel the gesture — a long stroke legitimately travels past the border. Only
     the hover ghost dies at the edge; a real cancellation arrives as pointercancel. */
  const onPointerLeave = () => {
    if (!drag.current && !pan.current) hideGhost();
  };

  const onPointerCancel = () => {
    endDrag();
    pan.current = null;
    hideGhost();
  };

  return (
    <div className="activity">
      {!player && (
        <form className="controls" onSubmit={e => { e.preventDefault(); if (name.trim()) enter(); }}>
          <label htmlFor="tri-name">Tu nombre</label>
          <input
            id="tri-name"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="quién traza queda registrado"
            maxLength={40}
          />
          <button type="submit" className="act" disabled={busy || !name.trim()}>Entrar</button>
        </form>
      )}

      {player && !tri && (
        <form className="controls" onSubmit={e => { e.preventDefault(); create(); }}>
          <label>Lado, ángulo, lado</label>
          <input className="num" inputMode="decimal" value={form.l1} aria-label="primer lado"
            onChange={e => setForm(f => ({ ...f, l1: e.target.value }))} placeholder="lado" />
          <input className="num" inputMode="decimal" value={form.ang} aria-label="ángulo entre los lados, en grados"
            onChange={e => setForm(f => ({ ...f, ang: e.target.value }))} placeholder="ángulo °" />
          <input className="num" inputMode="decimal" value={form.l2} aria-label="segundo lado"
            onChange={e => setForm(f => ({ ...f, l2: e.target.value }))} placeholder="lado" />
          <button type="submit" className="act" disabled={busy || !(form.l1 && form.ang && form.l2)}>
            Construir triángulo
          </button>
        </form>
      )}

      {tri && !choosing && (
        <p className="hint">Aquí solo se construyen los caminos a un centro. <b>Punto medio</b>:
          pasa por la mitad de un lado y toca la marca. <b>Mediana</b>: arrastra de un vértice
          al punto medio del lado opuesto. <b>Mediatriz</b>: desde un punto medio, arrastra al
          vacío a pulso — con menos de 15° se endereza sola. <b>Altura</b>: arrastra de un
          vértice a su lado opuesto — cae perpendicular, con su ⊥ visible desde el arrastre.{' '}
          <b>Bisectriz</b>: arrastra desde un vértice por la mitad de su ángulo — se ajusta
          sola y los dos arcos con marca te muestran que partió el ángulo en dos iguales.
          En el lienzo viven <b>máximo 3 trazos</b>: al dibujar el cuarto, el más viejo se va
          solo. Toca un punto o segmento y bórralo con <b>Supr</b> o con la papelera;{' '}
          <b>Ctrl/Cmd+Z</b> deshace.</p>
      )}
      {tri && choosing && (
        <p className="hint">Toca el lienzo donde creas que está <b>el centro</b> del triángulo.
          Puedes corregir tocando otra vez; cuando estés, dale <b>Enviar</b>.</p>
      )}

      {tri && sent && (
        <p className="hint">Tu centro quedó enviado — el lienzo ya solo se mira (y se navega
          con el zoom). En un momento lo comparamos con los de todo el salón.</p>
      )}

      {tri && (
        <div className="controls">
          <button type="button" className={choosing ? 'ghost' : 'act'} disabled={busy || sent} onClick={toggleChoosing}>
            {sent ? 'Centro enviado ✓' : choosing ? 'Cancelar' : 'Elegir el centro'}
          </button>
          {choosing && (
            <button type="button" className="act" disabled={busy || !pick} onClick={sendCenter}>
              Enviar
            </button>
          )}
        </div>
      )}

      {error && <p className="err" role="alert">{error}</p>}

      {render && (
        <div
          className={`canvas${sent ? ' done' : ''}${choosing ? ' choosing' : ''}`}
          ref={wrap}
          style={choosing ? { cursor: 'pointer' } : viewT.s > 1 && !sent ? { cursor: 'grab' } : undefined}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerLeave}
          onPointerCancel={onPointerCancel}
        >
          <div
            style={{ transform: `translate(${viewT.x}px, ${viewT.y}px) scale(${viewT.s})`, transformOrigin: '0 0' }}
            dangerouslySetInnerHTML={{ __html: render }}
          />
          <div className="lens">
            <button
              type="button"
              className="reset trash"
              disabled={busy || sent || !sel}
              title="Borrar lo seleccionado (Supr)"
              aria-label="Borrar lo seleccionado"
              onClick={deleteSel}
            >
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                <path d="M2.5 4.5h11M6.5 4.5V3h3v1.5M4.3 4.5l.7 9h6l.7-9M6.7 7v4.5M9.3 7v4.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            </button>
            <input
              type="range"
              min="1"
              max="8"
              step="0.1"
              value={viewT.s}
              onChange={e => zoomTo(Number(e.target.value))}
              aria-label="Zoom"
              title="Zoom"
            />
            <button
              type="button"
              className="reset"
              title="Restablecer la vista"
              aria-label="Restablecer la vista"
              onClick={() => setViewT({ s: 1, x: 0, y: 0 })}
            >
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                <path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {isNonProd() && (
        <p className="mode">Entorno {ENV}: este lienzo no es el de la clase real.</p>
      )}
      {isMock('triangle') && (
        <p className="mode">Modo local: sin conexión con la API de la clase, este lienzo solo existe en esta pantalla.</p>
      )}
    </div>
  );
}
