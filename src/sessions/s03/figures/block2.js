import { C, SERIF, svg, txt, wrap } from '../../../svg/kit.js';

/* ═══════════ B2 · la bitácora de limpieza ═══════════
   Cuatro columnas y una fila resuelta como modelo. La cuarta es la que casi nadie
   escribe y la única que convierte la bitácora en algo más que una lista de
   tareas: obliga a nombrar la conclusión que se estaba comprando. */
export function bitacora() {
  const W = 980, H = 330;
  const x0 = 30, cols = [200, 200, 240, 280], y0 = 62, alto = 168;

  let b = '';
  b += txt(30, 30, 'CUATRO COLUMNAS · UNA FILA POR DECISIÓN', { fs: 11, fill: C.ask, ls: 1.8 });

  const cabeceras = ['QUÉ ENCONTRÉ', 'QUÉ HICE', 'POR QUÉ', 'QUÉ CAMBIARÍA AL REVÉS'];
  const contenido = [
    'La columna C escribe Bogotá de seis maneras.',
    'Copié la columna a una nueva y unifiqué todo a «Bogotá D.C.».',
    'Las seis se refieren al mismo lugar, y así se pueden contar juntas.',
    'Contando las escrituras tal cual, Bogotá dejaría de ser la ciudad de la mitad del salón y pasarían a ser seis grupos de una o cinco personas.'
  ];

  let x = x0;
  cabeceras.forEach((h, i) => {
    const col = i === 3 ? C.reveal : C.ask;
    b += `<rect x="${x}" y="${y0}" width="${cols[i]}" height="34"
      fill="${C.ground2}" stroke="${C.line}" stroke-width="1"/>`;
    b += `<rect x="${x}" y="${y0}" width="${cols[i]}" height="2" fill="${col}"/>`;
    wrap(h, 22).forEach((l, k) =>
      b += txt(x + 12, y0 + 22 + k * 13, l, { fs: 10.5, fill: col, ls: 1.4 }));

    b += `<rect x="${x}" y="${y0 + 34}" width="${cols[i]}" height="${alto}"
      fill="none" stroke="${C.lineSoft}" stroke-width="1"/>`;
    wrap(contenido[i], 26).forEach((l, k) =>
      b += txt(x + 12, y0 + 60 + k * 19, l,
        { fs: 12, fill: i === 3 ? C.ink : C.ink2 }));

    x += cols[i];
  });

  b += txt(30, H - 12,
    'La cuarta columna es la que nadie escribe, y la única que convierte una tarea en una decisión.',
    { fs: 17, ff: SERIF, fill: C.ink });

  return svg(W, H,
    'La bitácora de limpieza: cuatro columnas —qué encontré, qué hice, por qué y qué ' +
    'cambiaría al revés— con la decisión sobre la columna de municipio resuelta como ejemplo',
    b);
}
