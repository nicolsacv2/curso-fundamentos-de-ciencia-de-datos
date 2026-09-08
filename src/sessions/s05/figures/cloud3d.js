import { C, SERIF, svg, txt, arrow } from '../../../svg/kit.js';
import { camera, dot, farFirst, pline, z, MONO } from './shared.js';
import { PAISES, ESTAD, VARS, PCA3, CAMPOS, ANIO } from '../data/paises.js';

/* The point cloud the class turns with the mouse: 183 countries on three axes.

   The scene is isometric — the same pixels per standard deviation on all three axes —
   because block 2 draws the plane of the first two components inside it. Stretch one
   axis to make the box tidier and the plane stops being the plane that most stretches
   the cloud, which is the only thing it is there to show.

   The box comes out long: GDP reaches six standard deviations above its mean while
   life expectancy never passes 1.6. That skew is the data, not a drawing accident. */

const W = 860, H = 560;
/* Pixels per standard deviation. Sized so the cloud still fits when turned to its
   worst angle: the box is 7 units along GDP, and a rotation can point that diagonal
   at either edge of the canvas. */
const UNIT = 47;
const CX = W / 2 + 60, CY = H / 2;

/* The angle nobody has to choose: the cloud arrives already turned enough to read as a
   volume, and — from block 2 on — with the plane and the projections in view (RF-77). */
export const INITIAL = { yaw: 0.72, pitch: 0.30 };

const COLS = Object.fromEntries(CAMPOS.map((c, i) => [c, i]));
const KEYS = PCA3.vars;
const LABEL = Object.fromEntries(VARS.map(([k, name]) => [k, name]));

/* Region tints. They are a help, never the message: every figure has to survive a
   projector that flattens two of these into the same colour. */
const REGION = {
  africa: '#E0A458', americas: '#5BC8CE', asia: '#7FB069', europe: '#9EB0C3',
};

/* Each country as [x, y, zz] in standard deviations, centred on the middle of the
   box so that turning it does not swing the cloud off the canvas. */
function points() {
  const raw = PAISES.map(p => ({
    at: KEYS.map(k => z(p[COLS[k]], ESTAD[k])),
    region: p[COLS.region],
  }));
  const mid = KEYS.map((_, i) => {
    const vs = raw.map(r => r.at[i]);
    return (Math.min(...vs) + Math.max(...vs)) / 2;
  });
  return { raw: raw.map(r => ({ ...r, at: r.at.map((v, i) => v - mid[i]) })), mid };
}

const project = (cam, at) => {
  const [x, y, depth] = cam(at);
  return { x: CX + x * UNIT, y: CY - y * UNIT, depth };
};

/* The three axes, drawn from the low corner of the box so the orientation can be read
   even when the cloud hides the origin. */
function axes3d(cam, mid, span) {
  const low = KEYS.map((_, i) => -span[i] / 2 - 0.35);
  let s = '';
  KEYS.forEach((k, i) => {
    const to = low.slice();
    to[i] = span[i] / 2 + 0.35;
    const a = project(cam, low), b = project(cam, to);
    s += pline([[a.x, a.y], [b.x, b.y]], C.line, { sw: 1.2 });
    s += `<circle cx="${b.x.toFixed(1)}" cy="${b.y.toFixed(1)}" r="3" fill="${C.line}"/>`;
    s += txt(b.x, b.y - 9, LABEL[k], {
      fs: 12, fill: C.ink3, ta: 'middle', ff: MONO,
    });
  });
  return s;
}

export default function cloud3d(o) {
  o = o || {};
  const cam = camera(o.yaw ?? INITIAL.yaw, o.pitch ?? INITIAL.pitch);
  const { raw, mid } = points();
  const span = KEYS.map((_, i) => {
    const vs = raw.map(r => r.at[i]);
    return Math.max(...vs) - Math.min(...vs);
  });

  const drawn = farFirst(raw.map(r => ({ ...project(cam, r.at), region: r.region })));
  const near = Math.max(...drawn.map(d => d.depth));
  const far = Math.min(...drawn.map(d => d.depth));

  let b = arrow('ar-s5-cloud', C.ink3);
  b += `<rect x="0" y="0" width="${W}" height="${H}" fill="${C.ground2}" opacity=".35"/>`;
  b += axes3d(cam, mid, span);

  /* Far points dimmer and slightly smaller: without it the cloud reads as a flat
     spray and turning it tells you nothing. */
  drawn.forEach(d => {
    const t = (d.depth - far) / (near - far || 1);
    b += dot(d.x, d.y, 3 + t * 1.6, REGION[d.region] || C.ink2, { op: 0.35 + t * 0.5 });
  });

  b += txt(28, 34, `${PAISES.length} países · ${ANIO}`, { fs: 12, fill: C.ink3, ls: 1.4 });
  b += txt(28, 56, 'Arrastra para girarla', { fs: 13, ff: SERIF, fill: C.ink2 });

  Object.entries(REGION).forEach(([key, col], i) => {
    const name = { africa: 'África', americas: 'América', asia: 'Asia', europe: 'Europa' }[key];
    const x = 28, y = 86 + i * 20;
    b += `<circle cx="${x + 5}" cy="${y - 4}" r="4.5" fill="${col}"/>`;
    b += txt(x + 18, y, name, { fs: 11.5, fill: C.ink3 });
  });

  return svg(W, H, `Nube de ${PAISES.length} países en tres ejes: `
    + KEYS.map(k => LABEL[k]).join(', ') + `, en ${ANIO}`, b);
}
