import { C, SERIF, svg, txt, arrow } from '../../../svg/kit.js';
import { camera, dot, farFirst, pline, poly, z, MONO } from './shared.js';
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

/* The two components, labelled and nothing else.

   They are deliberately not given names. The algebra produces directions, not meanings,
   and a component called "nivel de vida" is very quickly treated as a variable somebody
   measured. What the block shows instead is what weighs in each one — its loadings — and
   who ends up at either end, which is data rather than reading. */
export const COMPONENTES = [
  { eje: 'CP 1' },
  { eje: 'CP 2' },
];

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
  return {
    raw: raw.map(r => ({ ...r, z: r.at, at: r.at.map((v, i) => v - mid[i]) })),
    mid,
  };
}


const dotp = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);

/* Where a country lands on the plane of the first two components.

   The projection is computed on the z scores, whose origin is the mean, and only then
   moved into drawing coordinates: the plane passes through the centre of the cloud,
   which is not the centre of the box that contains it. Getting that wrong tilts the
   plane by the difference and nothing looks obviously broken — it just stops being
   the plane the eigenvectors describe. */
function onPlane(zpt, mid) {
  const [e1, e2] = PCA3.vectores;
  const s1 = dotp(zpt, e1), s2 = dotp(zpt, e2);
  return e1.map((_, i) => e1[i] * s1 + e2[i] * s2 - mid[i]);
}

/* The plane itself, as the parallelogram the two components span, big enough to hold
   every country's shadow. */
function planeCorners(raw, mid) {
  const [e1, e2] = PCA3.vectores;
  const s1 = raw.map(r => dotp(r.z, e1)), s2 = raw.map(r => dotp(r.z, e2));
  const a = Math.max(...s1.map(Math.abs)) * 1.06;
  const b = Math.max(...s2.map(Math.abs)) * 1.12;
  return [[a, b], [-a, b], [-a, -b], [a, -b]]
    .map(([u, v]) => e1.map((_, i) => e1[i] * u + e2[i] * v - mid[i]));
}

const project = (cam, at) => {
  const [x, y, depth] = cam(at);
  return { x: CX + x * UNIT, y: CY - y * UNIT, depth };
};

/* The three axes, drawn from the low corner of the box so the orientation can be read
   even when the cloud hides the origin. */
function axes3d(cam, mid, span, named) {
  const low = KEYS.map((_, i) => -span[i] / 2 - 0.35);
  let s = '';
  KEYS.forEach((k, i) => {
    const to = low.slice();
    to[i] = span[i] / 2 + 0.35;
    const a = project(cam, low), b = project(cam, to);
    s += pline([[a.x, a.y], [b.x, b.y]], C.line, { sw: 1.2 });
    s += `<circle cx="${b.x.toFixed(1)}" cy="${b.y.toFixed(1)}" r="3" fill="${C.line}"/>`;
    if (named) {
      s += txt(b.x, b.y - 9, LABEL[k], { fs: 12, fill: C.ink3, ta: 'middle', ff: MONO });
    }
  });
  return s;
}


/* Every label of the scene goes through here.

   They are drawn last and pushed apart when they collide, because their positions come
   from a rotation the reader controls: any fixed offset is right at one angle and wrong
   at the next. Each one carries its own ground — underneath there are 183 dots. */
function drawLabels(labels) {
  const placed = [];
  let s = '';
  labels.slice().sort((a, b) => a.y - b.y).forEach(lab => {
    let y = lab.y;
    placed.forEach(o => {
      if (Math.abs(y - o.y) < 21 && Math.abs(lab.x - o.x) < (lab.w + o.w) / 2) y = o.y + 21;
    });
    placed.push({ ...lab, y });
    s += `<rect x="${(lab.x - lab.w / 2).toFixed(1)}" y="${(y - 10).toFixed(1)}"
      width="${lab.w.toFixed(1)}" height="19" rx="3" fill="${C.ground2}" opacity=".88"
      ${lab.borde ? `stroke="${lab.color}" stroke-width=".8"` : ''}/>`;
    s += txt(lab.x, y + 4, lab.t, { fs: lab.fs || 11, fill: lab.color, ta: 'middle' });
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

  let b = arrow('ar-s5-cloud', C.ink3) + arrow('ar-s5-vec', C.reveal);
  const labels = [];
  b += `<rect x="0" y="0" width="${W}" height="${H}" fill="${C.ground2}" opacity=".35"/>`;
  b += axes3d(cam, mid, span, !o.vectors);

  if (o.plane) {
    const corners = planeCorners(raw, mid).map(c => project(cam, c)).map(p => [p.x, p.y]);
    b += poly(corners, C.ask, { op: 0.12, stroke: C.ask, sw: 1.2 });

    /* The two axes of the plane, named. Without this the plane is a pane of glass; with
       it, it is a pair of directions the class can argue about. */
    const [e1, e2] = PCA3.vectores;
    const centre = project(cam, KEYS.map((_, i) => -mid[i]));
    [[e1, COMPONENTES[0], 2.6], [e2, COMPONENTES[1], 1.9]].forEach(([e, comp, len]) => {
      const tip = project(cam, e.map((v, i) => v * len - mid[i]));
      b += pline([[centre.x, centre.y], [tip.x, tip.y]], C.ask, { sw: 1.4, op: 0.9 });
      const out = project(cam, e.map((v, i) => v * (len + 0.5) - mid[i]));
      const rotulo = comp.eje;
      labels.push({ x: out.x, y: out.y, t: rotulo, color: C.ask, borde: true,
                    w: rotulo.length * 6.2 + 14 });
    });
  }

  if (o.projections) {
    const shadows = raw.map(r => ({ ...project(cam, onPlane(r.z, mid)), region: r.region }));
    /* Every country's shadow, but only one line in eight. A hundred and eighty-three
       droplines turn the plane into a grey mat and hide the very thing they explain. */
    b += '<g class="proj">';
    shadows.forEach((sh, i) => {
      if (i % 8 === 0) {
        const from = project(cam, raw[i].at);
        b += pline([[from.x, from.y], [sh.x, sh.y]], C.ink3, { sw: 0.8, op: 0.5, dash: '2 3' });
      }
      b += dot(sh.x, sh.y, 1.8, C.ask, { op: 0.55 });
    });
    b += '</g>';
  }

  /* Far points dimmer and slightly smaller: without it the cloud reads as a flat
     spray and turning it tells you nothing. */
  drawn.forEach(d => {
    const t = (d.depth - far) / (near - far || 1);
    b += dot(d.x, d.y, 3 + t * 1.6, REGION[d.region] || C.ink2, { op: 0.35 + t * 0.5 });
  });

  if (o.vectors) {
    /* One arrow per original variable: the direction that variable grows in, from the
       centre of the cloud. Drawn at a fixed length because what matters here is where
       each one points and how much of it survives on the plane — the length of the
       shadow, not of the arrow. */
    const origin = project(cam, KEYS.map((_, i) => -mid[i]));
    b += '<g class="vec">';
    KEYS.forEach((k, i) => {
      const dir = KEYS.map((_, j) => (j === i ? 2.1 : 0));
      const tip = project(cam, dir.map((v, j) => v - mid[j]));
      const shadow = project(cam, onPlane(dir, mid));
      b += pline([[origin.x, origin.y], [shadow.x, shadow.y]], C.reveal,
                 { sw: 1.1, op: 0.45, dash: '3 3' });
      b += dot(shadow.x, shadow.y, 2.6, C.reveal, { op: 0.6 });
      b += `<path d="M${origin.x.toFixed(1)},${origin.y.toFixed(1)}
        L${tip.x.toFixed(1)},${tip.y.toFixed(1)}" stroke="${C.reveal}" stroke-width="1.8"
        fill="none" marker-end="url(#ar-s5-vec)"/>`;
      /* The label goes past the arrowhead, not on it: at the tip it fell inside the
         cloud and had 183 dots reading through it. */
      const out = project(cam, dir.map((v, j) => v * 1.34 - mid[j]));
      labels.push({ x: out.x, y: out.y, t: LABEL[k], color: C.reveal, fs: 11.5,
                    w: LABEL[k].length * 6.6 + 14 });
    });
    b += '</g>';
  }

  b += drawLabels(labels);

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
