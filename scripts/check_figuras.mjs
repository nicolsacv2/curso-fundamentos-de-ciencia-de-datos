/* Checks that no figure of session 6's entrada is cropped by its own viewBox.
 *
 * Two kinds of cropping, and the second is the one that gets missed: an element
 * drawn past the bottom edge, and a line of text whose composed width leaves the frame
 * — to the right if it is anchored at its start, to the left if it is anchored at its
 * end or centred. Looking at coordinates only finds
 * the first — every <text> begins inside the box; it is its content that leaves.
 *
 * Text width is estimated, not measured: there is no layout engine here. The figures
 * are drawn in monospace, where one character is about 0.6 em, so the estimate is
 * close enough to catch a line that overruns by a word and to leave alone one that
 * ends near the edge. HOLGURA is the slack that keeps it from crying over the second.
 *
 * No dependencies: it imports the figures and reads the SVG strings they return.
 *
 *     node scripts/check_figuras.mjs
 */
import * as F from '../src/sessions/s06/figures/intro.js';

const ANCHO_CAR = 0.6;    // em per character in the monospace the figures use
const HOLGURA = 6;        // px of slack before an overrun counts as one

const FIGURAS = ['textoPasos', 'cajas', 'descarte', 'niveles', 'relleno', 'sedimento',
  'plano', 'noNumericas', 'matrizDispersion', 'matrizCajas', 'matrizBarras'];

let fallos = 0;

for (const nombre of FIGURAS) {
  const svg = F[nombre]();
  const [, W, H] = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).map(Number);
  const problemas = [];

  /* 1 · anything drawn below the bottom edge */
  const ys = [...svg.matchAll(/\sy="(-?[\d.]+)"/g), ...svg.matchAll(/\scy="(-?[\d.]+)"/g),
    ...svg.matchAll(/[ML](?:-?[\d.]+),(-?[\d.]+)/g)].map(m => +m[1]);
  const maxY = Math.max(...ys);
  if (maxY > H - 2) problemas.push(`algo dibujado en y=${maxY.toFixed(0)}, fuera de H=${H}`);

  /* 2 · text whose composed width leaves the right edge */
  for (const m of svg.matchAll(
    /<text x="([\d.-]+)"[^>]*?font-size="([\d.]+)"[^>]*?text-anchor="(\w+)"[^>]*>([^<]*)<\/text>/g)) {
    const [, x, fs, anclaje, texto] = m;
    const ancho = texto.length * ANCHO_CAR * Number(fs);
    const izquierda = anclaje === 'end' ? Number(x) - ancho
      : anclaje === 'middle' ? Number(x) - ancho / 2
      : Number(x);
    const derecha = izquierda + ancho;
    if (derecha > W + HOLGURA) {
      problemas.push(`texto llega a x≈${derecha.toFixed(0)} (W=${W}): «${texto.slice(0, 44)}…»`);
    }
    /* The left edge too. A label anchored by its end, or centred, runs the other way —
       and the first version of this check only looked right, so it passed a label that
       started at x = -16. */
    if (izquierda < -HOLGURA) {
      problemas.push(`texto empieza en x≈${izquierda.toFixed(0)}, fuera por la izquierda: «${texto.slice(0, 40)}…»`);
    }
  }

  if (problemas.length) fallos += problemas.length;
  console.log(`${problemas.length ? '✗' : '✓'} ${nombre.padEnd(17)} ${W}×${H}`);
  problemas.forEach(p => console.log(`    ${p}`));
}

console.log(fallos ? `\n${fallos} recorte(s).` : '\nNinguna figura recorta su contenido.');
process.exit(fallos ? 1 : 0);
