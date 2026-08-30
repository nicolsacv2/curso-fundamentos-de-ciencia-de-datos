import { C, SERIF, svg, txt, arrow, wrap } from '../../../svg/kit.js';
import { box } from './shared.js';

/* ═══════════ B3 · the original is never touched ═══════════
   The block's golden rule, and the only one in the session that is a habit rather
   than an idea: cleaning is not correcting the table, it is writing another one
   beside it and leaving a record of how you got from one to the other. */
export function versiones() {
  const W = 980, H = 340;
  let b = arrow('ar-s3-ver');

  const cajas = [
    [30, 'salon_v1_crudo', 'Las 23 respuestas tal como llegaron. No se corrige, no se ordena, no se borra una fila. Es la única prueba de qué se preguntó y qué contestaron.', C.reveal, 'INTOCABLE'],
    [660, 'salon_v2_limpio', 'La copia sobre la que se trabaja. Cada columna nueva se añade al lado de la vieja, nunca encima.', C.ask, 'AQUÍ SE TRABAJA']
  ];

  cajas.forEach(([x, nombre, texto, col, sello]) => {
    b += box(x, 54, 290, 210, col);
    b += txt(x + 20, 84, sello, { fs: 10.5, fill: col, ls: 1.6 });
    b += txt(x + 20, 116, nombre, { fs: 16, fill: C.ink });
    wrap(texto, 32).forEach((l, k) =>
      b += txt(x + 20, 148 + k * 19, l, { fs: 12, fill: C.ink2 }));
  });

  /* In between, what turns a copy into a method. */
  b += box(370, 96, 250, 126, C.ink3);
  b += txt(384, 124, 'LA BITÁCORA', { fs: 10.5, fill: C.ink3, ls: 1.6 });
  wrap('Una fila por decisión. Sin ella, la copia limpia es una tabla sin explicación.', 30)
    .forEach((l, k) => b += txt(384, 152 + k * 19, l, { fs: 12, fill: C.ink2 }));

  b += `<path d="M320,159 H364" fill="none" stroke="${C.ink2}" stroke-width="1.2"
    marker-end="url(#ar-s3-ver)"/>`;
  b += `<path d="M620,159 H654" fill="none" stroke="${C.ink2}" stroke-width="1.2"
    marker-end="url(#ar-s3-ver)"/>`;

  b += txt(30, H - 14,
    'Si sobrescribes el original, nadie puede volver a revisar tu decisión. Tú tampoco.',
    { fs: 18, ff: SERIF, fill: C.ink });

  return svg(W, H,
    'Dos archivos lado a lado: salon_v1_crudo intocable a la izquierda y ' +
    'salon_v2_limpio a la derecha, unidos por la bitácora que explica el paso de uno a otro',
    b);
}
