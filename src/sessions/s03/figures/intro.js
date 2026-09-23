import { C, svg, txt, arrow } from '../../../svg/kit.js';
import { RECUENTOS } from '../../../data/salon.js';
import { box } from './shared.js';

/* ═══════════ Intro · the spellings of a single city ═══════════
   The funnel of the day: several different values in the municipality column, one
   single place. None of the spellings is misspelled.

   The last row is a different animal and is drawn differently: «Fontibon» is not a
   way of writing «Bogotá», it is a locality of Bogotá given as if it were a
   municipality. No amount of trimming, unaccenting or lowercasing finds that — it
   needs somebody who knows the city. It is corrected by hand in
   scripts/extract_salon.py, where the correction is declared with its reason, and
   the raw table still says «Fontibon».

   The spellings and their counts come from the dataset. They used to be typed in
   here, and that is how the figure went on saying «13 de 23» after the form had
   taken four more answers — the text the class was shown in 2026 is not this one. */
export function bogota() {
  const W = 980, H = 470;
  let b = arrow('ar-s3-bog', C.reveal);

  b += txt(30, 30, 'LO QUE DICE LA COLUMNA C', { fs: 11, fill: C.ask, ls: 1.8 });
  b += txt(650, 30, 'LO QUE HAY DE VERDAD', { fs: 11, fill: C.reveal, ls: 1.8 });

  /* A trailing space is invisible in a projected figure, so it is drawn. It is one
     of the six spellings and the whole point of the row. */
  const formas = RECUENTOS.bogotaFormas.map(([v, n]) => [v.replace(/ $/, '␣'), n]);

  /* The hand-corrected values come after the spellings, dashed, so the figure never
     suggests they are one more way of writing the same name. */
  const corregidos = RECUENTOS.bogotaCorregidos.map(([v, n]) => [v, n]);
  const filas = [...formas.map(f => [...f, false]), ...corregidos.map(c => [...c, true])];

  const y0 = 58, paso = 50;
  filas.forEach(([s, n, aMano], i) => {
    const y = y0 + i * paso;
    b += box(30, y, 320, 40, aMano ? C.reveal : C.ask,
      aMano ? { dash: '4 3', stroke: C.reveal } : undefined);
    b += txt(48, y + 25, s, { fs: 13.5, fill: aMano ? C.reveal : C.ink });
    b += txt(332, y + 25, String(n), { fs: 12, fill: C.ink3, ta: 'end' });
    b += `<path d="M350,${y + 20} H575" fill="none" stroke="${aMano ? C.reveal : C.line}"
      stroke-width="1" opacity=".75"${aMano ? ' stroke-dasharray="4 3"' : ''}/>`;
    if (aMano) {
      b += txt(48, y + 56, 'corregida a mano: es una localidad de Bogotá, no un municipio',
        { fs: 10.5, fill: C.reveal });
    }
  });

  /* The spine that folds them all into one. */
  const yPrim = y0 + 20, yUlt = y0 + (filas.length - 1) * paso + 20, yMed = (yPrim + yUlt) / 2;
  b += `<path d="M575,${yPrim} V${yUlt}" fill="none" stroke="${C.reveal}"
    stroke-width="1.4"/>`;
  b += `<path d="M575,${yMed} H640" fill="none" stroke="${C.reveal}"
    stroke-width="1.4" marker-end="url(#ar-s3-bog)"/>`;

  b += box(650, yMed - 42, 300, 84, C.reveal);
  b += txt(672, yMed - 12, 'Bogotá', { fs: 22, fill: C.ink });
  b += txt(672, yMed + 16, `${RECUENTOS.bogota} de ${RECUENTOS.filas} personas`,
    { fs: 12.5, fill: C.reveal });

  b += txt(30, H - 16,
    `${formas.length} ESCRITURAS · ${corregidos.length} CORREGIDA A MANO · UNA CIUDAD`,
    { fs: 11, fill: C.reveal, ls: 1.6 });

  return svg(W, H,
    `${formas.length} formas distintas de escribir Bogotá en la columna de municipio, ` +
    `con su número de apariciones, más ${corregidos.length} valor corregido a mano ` +
    `—«${corregidos.map(c => c[0]).join(', ')}», que es una localidad de Bogotá y no un ` +
    `municipio—, convergiendo en una sola ciudad: ` +
    `${RECUENTOS.bogota} de ${RECUENTOS.filas} personas`,
    b);
}
