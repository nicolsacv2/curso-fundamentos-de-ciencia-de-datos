import { C, MONO } from '../../../svg/kit.js';

/* Session-local helpers, repeated instead of imported from s04 because each session is
   its own chunk and must not drag in another's to draw a rectangle. This session plots
   in three dimensions, so next to the usual box and axes there is a camera. */

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
  return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r}" fill="${fill}"
    opacity="${o.op || 1}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 1.2}"` : ''}/>`;
}

/* A path through [x, y] pairs. */
export function pline(pts, color, o) {
  o = o || {};
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${o.sw || 1.6}"
    opacity="${o.op || 1}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}${o.cap ? ` stroke-linecap="${o.cap}"` : ''}/>`;
}

/* A filled polygon through [x, y] pairs — the plane of the components, mostly. */
export function poly(pts, fill, o) {
  o = o || {};
  const d = pts.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  return `<polygon points="${d}" fill="${fill}" opacity="${o.op || 1}"
    ${o.stroke ? `stroke="${o.stroke}" stroke-width="${o.sw || 1}"` : ''}/>`;
}

export function bar(x, y, w, h, fill, o) {
  o = o || {};
  return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}"
    height="${Math.max(0, h).toFixed(1)}" fill="${fill}" opacity="${o.op || 1}"
    ${o.stroke ? `stroke="${o.stroke}" stroke-width="1"` : ''}/>`;
}

/* Maps a value from a data range to a pixel range. Returns a function because every
   figure needs the same mapping for its dots, its ticks and its labels, and computing
   it twice is how an axis stops agreeing with what it is labelling. */
export function scale([d0, d1], [r0, r1]) {
  const span = d1 - d0 || 1;
  return v => r0 + ((v - d0) / span) * (r1 - r0);
}

/* A value in standard deviations from its mean, using the statistics the extractor
   published. The cloud is drawn in these units: in dollars and children a single axis
   would be a thousand times longer than the other two. */
export function z(value, stat) {
  return (value - stat.media) / stat.desv;
}

/* ── The camera ──────────────────────────────────────────────
   Two rotations and an orthographic projection, which is all a rotatable point cloud
   needs. The obvious answer is three.js, and it is exactly the fifth dependency
   principle 1 refuses: half a megabyte to draw 183 points and a parallelogram.

   Returns [x, y, depth] in camera space. Depth is not for perspective — there is
   none — but for ordering: what is behind has to be drawn first and dimmer, or the
   cloud reads as a flat spray of dots. */
export function camera(yaw, pitch) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  const cp = Math.cos(pitch), sp = Math.sin(pitch);
  return ([x, y, zz]) => {
    const x1 = cy * x + sy * zz;
    const z1 = cy * zz - sy * x;
    return [x1, cp * y - sp * z1, sp * y + cp * z1];
  };
}

/* Sorts what the camera returned so the far things are emitted first. SVG has no
   z-buffer: the painter's order is the only depth there is. */
export function farFirst(items) {
  return items.slice().sort((a, b) => a.depth - b.depth);
}

export { MONO };
