import { C } from '../../../svg/kit.js';

/* Mismos ayudantes que la sesión 2: una caja con filo de color a la izquierda y
   un codo para colgar hijos de un padre. Se repiten aquí en vez de importarse de
   s02 porque cada sesión es un chunk independiente y no debe arrastrar el de
   otra sesión para dibujar un rectángulo. */
export function box(x, y, w, h, col, o) {
  o = o || {};
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${o.fill || C.ground2}"
    stroke="${o.stroke || C.line}" stroke-width="${o.sw || 1}"/>`;
  if (col) s += `<rect x="${x}" y="${y}" width="3" height="${h}" fill="${col}"/>`;
  return s;
}

export function elbow(x1, y1, x2, y2, marker) {
  const ym = (y1 + y2) / 2;
  return `<path d="M${x1},${y1} V${ym} H${x2} V${y2}" fill="none" stroke="${C.ink2}"
    stroke-width="1.2" opacity=".8" marker-end="url(#${marker})"/>`;
}

/* Una celda de hoja de cálculo. `ghost` la deja vacía y sombreada: en esta
   sesión el hueco es el dato, así que tiene que verse. */
export function cell(x, y, w, h, text, o) {
  o = o || {};
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}"
    fill="${o.ghost ? 'rgba(220,75,62,.08)' : 'none'}"
    stroke="${C.lineSoft}" stroke-width="1"/>`;
  if (text) {
    s += `<text x="${x + 10}" y="${y + h / 2 + 4}" fill="${o.fill || C.ink2}"
      font-family="Menlo, Consolas, ui-monospace, monospace" font-size="${o.fs || 12}">${text}</text>`;
  }
  return s;
}
