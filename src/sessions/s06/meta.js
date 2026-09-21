/* Session 6. The first one that goes back to the class table after session 5 left
   for Gapminder, and the reason it goes back is that the table is mostly not
   numbers: session 5's PCA cannot read a department or a blood type.

   The entrada is well over a third of the session — 78 minutes against the usual 22
   to 35 — because the whole cleaning chain has to run over ALL thirty-one variables
   before the first factorial plane: standardise the text, describe, draw the boxes,
   diagnose the eighteen that are not numbers, mark and impute, show the clean table,
   look at what goes with what, and only then reduce. That is not a preamble, it is
   the work. It ends on «¿qué falta?», and the three blocks after it answer that.

   It grew from 60 when the entrada gained the clean table and the three pair
   matrices. The eighteen minutes came out of blocks 1 to 3, which have no content
   yet — cheap to take now, and better decided here than inherited by whoever writes
   them.

   Blocks 1 to 3 and the closing are mounted and labelled but have no content yet;
   they are written in later changes. */
export default {
  n: 6,
  title: 'Todas las variables a la vez',
  goal: 'Dejar utilizable una tabla real —texto estandarizado, atípicos a la vista, huecos imputados— y extender el análisis factorial a las variables que no son números.',
  hook: 'La tabla del salón lleva tres sesiones con nosotros y todavía no la hemos analizado entera: casi todo lo que dice no son números.',
  blocks: [
    { id: 'entrada',  lab: 'Entrada',  rname: 'De la tabla sucia al primer plano', clock: '0–78' },
    { id: 'bloque-1', lab: 'Bloque 1', rname: 'MCA',                               clock: '86–112' },
    { id: 'bloque-2', lab: 'Bloque 2', rname: 'FAMD',                              clock: '120–146' },
    { id: 'bloque-3', lab: 'Bloque 3', rname: 'Segmentación',                      clock: '154–172' },
    { id: 'cierre',   lab: 'Cierre',   rname: 'Cierre',                            clock: '172–180' }
  ]
};
