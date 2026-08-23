/* Drawing helpers, ported from shell.template.html. Each session's figures use them
   to assemble their SVG markup. */

/* ═══════════ Palette shared with the CSS ═══════════ */
export const C = {
  ink: '#E9EFF5', ink2: '#9EB0C3', ink3: '#6D8096',
  line: '#2A3A4E', lineSoft: '#1F2C3C',
  ask: '#5BC8CE', reveal: '#DC4B3E', ground2: '#131D2B'
};

export const MONO = 'Menlo, Consolas, ui-monospace, monospace';
export const SERIF = "'Iowan Old Style', Palatino, Georgia, serif";

export function svg(w, h, label, body) {
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">${body}</svg>`;
}

export function txt(x, y, s, o) {
  o = o || {};
  return `<text x="${x}" y="${y}" fill="${o.fill || C.ink2}" font-family="${o.ff || MONO}"
    font-size="${o.fs || 12}" font-weight="${o.fw || 400}" text-anchor="${o.ta || 'start'}"
    letter-spacing="${o.ls || 0}">${s}</text>`;
}

/* Every figure needs its own marker id: a repeated id would make url(#…) resolve to
   another figure's marker. Hence the session prefix on every id: ar-s2-types. */
export function arrow(id, color) {
  return `<defs><marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5"
    markerWidth="7" markerHeight="7" orient="auto-start-reverse">
    <path d="M0,0 L10,5 L0,10 z" fill="${color || C.ink2}"/></marker></defs>`;
}

/* Splits a string into lines of at most `max` characters without breaking words. */
export function wrap(s, max) {
  const out = [];
  let line = '';
  s.split(' ').forEach(p => {
    const attempt = line ? line + ' ' + p : p;
    if (attempt.length > max && line) { out.push(line); line = p; }
    else line = attempt;
  });
  if (line) out.push(line);
  return out;
}
