import { C, svg, txt, arrow } from '../../../svg/kit.js';
import { box } from './shared.js';

/* ═══════════ Intro · the six spellings of a single city ═══════════
   The funnel of the day: six different values in the municipality column, thirteen
   people, one single place. Not one cell is misspelled. */
export function bogota() {
  const W = 980, H = 420;
  let b = arrow('ar-s3-bog', C.reveal);

  b += txt(30, 30, 'LO QUE DICE LA COLUMNA C', { fs: 11, fill: C.ask, ls: 1.8 });
  b += txt(650, 30, 'LO QUE HAY DE VERDAD', { fs: 11, fill: C.reveal, ls: 1.8 });

  const formas = [
    ['Bogotá', 5], ['Bogotá D.C.', 3], ['Bogotá D.C', 2],
    ['Bogota D.C.', 1], ['Bogotá DC', 1], ['Bogotá␣', 1]
  ];

  const y0 = 58, paso = 50;
  formas.forEach(([s, n], i) => {
    const y = y0 + i * paso;
    b += box(30, y, 320, 40, C.ask);
    b += txt(48, y + 25, s, { fs: 13.5, fill: C.ink });
    b += txt(332, y + 25, String(n), { fs: 12, fill: C.ink3, ta: 'end' });
    b += `<path d="M350,${y + 20} H575" fill="none" stroke="${C.line}"
      stroke-width="1" opacity=".75"/>`;
  });

  /* The spine that folds the six into one. */
  const yPrim = y0 + 20, yUlt = y0 + 5 * paso + 20, yMed = (yPrim + yUlt) / 2;
  b += `<path d="M575,${yPrim} V${yUlt}" fill="none" stroke="${C.reveal}"
    stroke-width="1.4"/>`;
  b += `<path d="M575,${yMed} H640" fill="none" stroke="${C.reveal}"
    stroke-width="1.4" marker-end="url(#ar-s3-bog)"/>`;

  b += box(650, yMed - 42, 300, 84, C.reveal);
  b += txt(672, yMed - 12, 'Bogotá', { fs: 22, fill: C.ink });
  b += txt(672, yMed + 16, '13 de 23 personas', { fs: 12.5, fill: C.reveal });

  b += txt(30, H - 16,
    'SEIS ESCRITURAS · UNA CIUDAD · NINGUNA CELDA MAL ESCRITA',
    { fs: 11, fill: C.reveal, ls: 1.6 });

  return svg(W, H,
    'Seis formas distintas de escribir Bogotá en la columna de municipio, con su ' +
    'número de apariciones, convergiendo en una sola ciudad: trece de veintitrés personas',
    b);
}
