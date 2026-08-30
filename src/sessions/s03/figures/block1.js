import { C, SERIF, svg, txt, wrap } from '../../../svg/kit.js';
import { box, cell } from './shared.js';

/* ═══════════ B1 · the three flavours of a missing value ═══════════
   Three empty cells, identical in the sheet, with three causes that have nothing in
   common. The spreadsheet stores them the same way: the only one who can tell them
   apart is the person who knows how the question was asked. */
export function faltantes() {
  const W = 980, H = 400;
  let b = '';

  b += txt(30, 30, 'TRES CELDAS VACÍAS', { fs: 11, fill: C.ask, ls: 1.8 });

  const casos = [
    ['NO EXISTE', 'La placa del auto de quien no tiene auto. La celda no está incompleta: está bien vacía, y llenarla sería inventar.', C.ink3],
    ['NO SE PUDO MEDIR', 'Las siete vacías de la columna E. La pregunta mandaba a mirar el reporte del celular, y no todo el mundo fue a mirar.', C.ask],
    ['NO QUISO RESPONDER', 'La sesión 2 dijo «si una pregunta te incomoda, déjala en blanco». Quien la dejó no es una persona al azar.', C.reveal]
  ];

  const x0 = 30, ancho = 296, sep = 30;
  casos.forEach(([titulo, texto, col], i) => {
    const x = x0 + i * (ancho + sep);

    b += box(x, 52, ancho, 74, col);
    b += cell(x + 20, 68, ancho - 40, 42, '', { ghost: true });

    b += txt(x, 158, titulo, { fs: 12, fill: col, ls: 1.6 });
    b += `<path d="M${x},170 H${x + ancho}" fill="none" stroke="${C.lineSoft}" stroke-width="1"/>`;
    wrap(texto, 40).forEach((linea, k) =>
      b += txt(x, 196 + k * 20, linea, { fs: 12.5, fill: C.ink2 }));
  });

  b += `<path d="M30,${H - 62} H${W - 30}" fill="none" stroke="${C.line}" stroke-width="1"/>`;
  b += txt(30, H - 32,
    'La hoja de cálculo guarda las tres exactamente igual.',
    { fs: 19, ff: SERIF, fill: C.ink });
  b += txt(30, H - 10,
    'BORRAR LA FILA TRATA LAS TRES COMO SI FUERAN LA PRIMERA.',
    { fs: 11, fill: C.reveal, ls: 1.6 });

  return svg(W, H,
    'Tres celdas vacías idénticas con tres causas distintas: el valor no existe, ' +
    'no se pudo medir, o la persona no quiso responder. La hoja de cálculo las guarda igual',
    b);
}
