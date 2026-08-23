import { C } from '../../../svg/kit.js';

/* Box with a coloured rule on the left, like the ladder in session 1. */
export function box(x, y, w, h, col, o) {
  o = o || {};
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${o.fill || C.ground2}"
    stroke="${o.stroke || C.line}" stroke-width="${o.sw || 1}"/>`;
  if (col) s += `<rect x="${x}" y="${y}" width="3" height="${h}" fill="${col}"/>`;
  return s;
}

/* Vertical-horizontal-vertical elbow: from a parent node to an offset child. */
export function elbow(x1, y1, x2, y2, marker) {
  const ym = (y1 + y2) / 2;
  return `<path d="M${x1},${y1} V${ym} H${x2} V${y2}" fill="none" stroke="${C.ink2}"
    stroke-width="1.2" opacity=".8" marker-end="url(#${marker})"/>`;
}
