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
 * No dependencies: it imports the figures and reads the SVG strings they return.
 *
 *     node scripts/check_figuras.mjs
 */
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ANCHO_CAR = { mono: 0.6, serif: 0.5 };   // em per character, by family
const HOLGURA = 6;                              // px of slack before an overrun counts

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
      for (const m of svg.matchAll(
        /<text x="([\d.-]+)"[^>]*?font-family="([^"]*)"\s*font-size="([\d.]+)"[^>]*?text-anchor="(\w+)"[^>]*>([^<]*)<\/text>/g)) {
        const [, x, familia, fs, anclaje, texto] = m;
        const em = /serif/i.test(familia) && !/mono/i.test(familia) ? ANCHO_CAR.serif : ANCHO_CAR.mono;
        const ancho = texto.length * em * Number(fs);
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

      /* 3 · an id repeated across figures would make url(#…) resolve to another figure's
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
  ? `\n${fallos} recorte(s) en ${figuras} figuras.`
  : `\nNinguna de las ${figuras} figuras recorta su contenido.`);
process.exit(fallos ? 1 : 0);
