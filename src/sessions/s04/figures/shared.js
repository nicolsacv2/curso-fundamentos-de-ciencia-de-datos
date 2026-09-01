import { C, MONO } from '../../../svg/kit.js';

/* Session-local helpers, repeated instead of imported from s03 because each session is
   its own chunk and must not drag in another session's to draw a rectangle. This
   session plots, so alongside the usual box there are axes, dots and paths. */
export function box(x, y, w, h, col, o) {
  o = o || {};
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${o.fill || C.ground2}"
    stroke="${o.stroke || C.line}" stroke-width="${o.sw || 1}"/>`;
  if (col) s += `<rect x="${x}" y="${y}" width="3" height="${h}" fill="${col}"/>`;
  return s;
}

/* An L of axes: origin at (x, y), width to the right, height upward. */
export function axes(x, y, w, h) {
  return `<path d="M${x},${y - h} V${y} H${x + w}" fill="none" stroke="${C.line}"
    stroke-width="1.2"/>`;
}

export function dot(cx, cy, r, fill, o) {
  o = o || {};
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"
    opacity="${o.op || 1}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 1.2}"` : ''}/>`;
}

/* A path through [x, y] pairs. */
export function pline(pts, color, o) {
  o = o || {};
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ');
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${o.sw || 1.6}"
    opacity="${o.op || 1}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`;
}

/* A die face: rounded square with its pips. `hot` paints it red — in this session a
   red die is the datum being revealed: the six, or the double six. */
export function die(x, y, size, face, hot) {
  const col = hot ? C.reveal : C.line;
  const pip = hot ? C.ink : C.ink2;
  let s = `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${size * 0.16}"
    fill="${hot ? 'rgba(220,75,62,.18)' : C.ground2}" stroke="${col}" stroke-width="1.4"/>`;
  const c = size / 2, q = size / 4, t = (3 * size) / 4, r = Math.max(2, size * 0.08);
  const at = {
    1: [[c, c]],
    2: [[q, q], [t, t]],
    3: [[q, q], [c, c], [t, t]],
    4: [[q, q], [t, q], [q, t], [t, t]],
    5: [[q, q], [t, q], [c, c], [q, t], [t, t]],
    6: [[q, q], [t, q], [q, c], [t, c], [q, t], [t, t]]
  }[face] || [];
  at.forEach(([px, py]) => {
    s += `<circle cx="${x + px}" cy="${y + py}" r="${r}" fill="${pip}"/>`;
  });
  return s;
}

/* Deterministic pseudo-random: the scatters must draw the same cloud on every render
   and in both themes of the zoom dialog. A tiny LCG is enough. */
export function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export { MONO };
