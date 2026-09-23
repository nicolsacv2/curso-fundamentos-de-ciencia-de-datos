/* Checks that no figure of sessions 6 and 7 is cropped by its own viewBox.
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
 * The formulas are set in a serif at about 0.5 em per glyph; a line drawn in it is
 * measured with the narrower advance, or every formula would seem to overrun.
 *
 * Which figures: every module in src/sessions/s06/figures/ and src/sessions/s07/figures/
 * except shared.js, and every function each one exports. The list is not written here on
 * purpose — a new figure enters the check by existing, and a module that is not there yet
 * is simply not checked. Every id has to carry its own session's prefix, ar-s6- or
 * ar-s7-: the two sessions are one route apart, and a marker id repeated across them
 * would make url(#…) resolve to the other session's figure.
 *
 * Formula text is also checked for OVERLAPS: two serif <text> elements of the same figure
 * whose estimated boxes intersect by more than HOLGURA_SOLAPE in both directions. A
 * subscript is its own <text>, so an index that lands on the next symbol — which is what
 * a fixed advance after «ij» did — fails here instead of on the wall. Only the serif
 * family is checked: the monospace labels of the maps are stacked by design. The box is
 * estimated with the same per-glyph advance the typesetter uses, from cap height to
 * descender, so that what the check sees is what row() laid out.
 *
 * No dependencies: it imports the figures and reads the SVG strings they return.
 *
 *     node scripts/check_figuras.mjs
 */
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { avance, SERIF } from '../src/sessions/s07/figures/shared.js';

const ANCHO_CAR = { mono: 0.6, serif: 0.5 };   // em per character, by family
const HOLGURA = 6;                              // px of slack before an overrun counts
const HOLGURA_SOLAPE = 3;                       // px two formula texts may share before it is a collision
const ES_SERIF = f => /serif/i.test(f) && !/mono/i.test(f);

/* The estimated box of a <text>: x by anchor, width by the typesetter's own advance for
   the serif family, height from cap height to descender. */
function caja(x, y, familia, fs, anclaje, texto) {
  const ancho = ES_SERIF(familia) ? avance(texto, fs, SERIF) : texto.length * ANCHO_CAR.mono * fs;
  const izquierda = anclaje === 'end' ? x - ancho : anclaje === 'middle' ? x - ancho / 2 : x;
  return { izquierda, derecha: izquierda + ancho, arriba: y - 0.72 * fs, abajo: y + 0.2 * fs, texto };
}

const aqui = dirname(fileURLToPath(import.meta.url));
const SESIONES = ['s06', 's07'];

let fallos = 0, figuras = 0;

for (const sesion of SESIONES) {
  const carpeta = join(aqui, '..', 'src', 'sessions', sesion, 'figures');
  const prefijo = `ar-${sesion.replace('0', '')}-`;
  const modulos = readdirSync(carpeta)
    .filter(f => f.endsWith('.js') && f !== 'shared.js')
    .sort();

  for (const archivo of modulos) {
    const F = await import(join(carpeta, archivo));
    const nombres = Object.keys(F).filter(k => typeof F[k] === 'function');
    console.log(`\n${sesion}/${archivo} · ${nombres.length} figuras`);

    for (const nombre of nombres) {
      const svg = F[nombre]();
      if (typeof svg !== 'string' || !/^<svg /.test(svg)) {
        /* Not every export is a figure: a threshold or a palette can live next to
           them. What is skipped is said, so nothing disappears in silence. */
        console.log(`  · ${nombre.padEnd(17)} no devuelve un SVG, se omite`);
        continue;
      }
      figuras++;
      const [, W, H] = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).map(Number);
      const problemas = [];

      /* 1 · anything drawn below the bottom edge */
      const ys = [...svg.matchAll(/\sy="(-?[\d.]+)"/g), ...svg.matchAll(/\scy="(-?[\d.]+)"/g),
        ...svg.matchAll(/[ML](?:-?[\d.]+),(-?[\d.]+)/g)].map(m => +m[1]);
      const maxY = Math.max(...ys);
      if (maxY > H - 2) problemas.push(`algo dibujado en y=${maxY.toFixed(0)}, fuera de H=${H}`);

      /* 2 · text whose composed width leaves the right edge */
      const formulas = [];
      for (const m of svg.matchAll(
        /<text x="([\d.-]+)" y="([\d.-]+)"[^>]*?font-family="([^"]*)"\s*font-size="([\d.]+)"[^>]*?text-anchor="(\w+)"[^>]*>([^<]*)<\/text>/g)) {
        const [, x, y, familia, fs, anclaje, texto] = m;
        const em = /serif/i.test(familia) && !/mono/i.test(familia) ? ANCHO_CAR.serif : ANCHO_CAR.mono;
        const ancho = texto.length * em * Number(fs);
        const izquierda = anclaje === 'end' ? Number(x) - ancho
          : anclaje === 'middle' ? Number(x) - ancho / 2
          : Number(x);
        const derecha = izquierda + ancho;
        if (ES_SERIF(familia) && texto.trim()) {
          formulas.push(caja(Number(x), Number(y), familia, Number(fs), anclaje, texto));
        }
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

      /* 3 · two formula texts on top of each other */
      for (let a = 0; a < formulas.length; a++) {
        for (let b2 = a + 1; b2 < formulas.length; b2++) {
          const p = formulas[a], q = formulas[b2];
          const dx = Math.min(p.derecha, q.derecha) - Math.max(p.izquierda, q.izquierda);
          const dy = Math.min(p.abajo, q.abajo) - Math.max(p.arriba, q.arriba);
          if (dx > HOLGURA_SOLAPE && dy > HOLGURA_SOLAPE) {
            problemas.push(`se solapan «${p.texto}» y «${q.texto}» (${dx.toFixed(0)}×${dy.toFixed(0)} px)`);
          }
        }
      }

      /* 4 · an id repeated across figures would make url(#…) resolve to another figure's
         marker; every id must carry ITS session's prefix. */
      for (const m of svg.matchAll(/\sid="([^"]+)"/g)) {
        if (!m[1].startsWith(prefijo)) problemas.push(`id «${m[1]}» sin el prefijo ${prefijo}`);
      }

      if (problemas.length) fallos += problemas.length;
      console.log(`  ${problemas.length ? '✗' : '✓'} ${nombre.padEnd(17)} ${W}×${H}`);
      problemas.forEach(p => console.log(`      ${p}`));
    }
  }
}

console.log(fallos
  ? `\n${fallos} recorte(s) o solape(s) en ${figuras} figuras.`
  : `\nNinguna de las ${figuras} figuras recorta ni solapa su contenido.`);
process.exit(fallos ? 1 : 0);
