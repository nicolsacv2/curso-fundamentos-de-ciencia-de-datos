/* Session 6. The first one that goes back to the class table after session 5 left
   for Gapminder, and the reason it goes back is that the table is mostly not
   numbers: session 5's PCA cannot read a department or a blood type.

   It used to be one 78-minute entrada carrying the whole cleaning chain, followed by
   the MCA, the FAMD and the analysis of the whole table. The change
   partir-la-sesion-06-en-dos split it: the chain IS this session now, cut along its own
   steps into the course's five blocks — the table as it arrived and the text; the
   measures, the boxes, the two ordinal scales and the column that gets dropped; the
   filling, the invented-cell markers, the second description and the clean table; what
   goes with what and the PCA; and a closing that asks «¿qué falta?» and hands the
   question to session 7, which took the factorial blocks with it. Nothing of the
   chain was cut; it is said at a normal pace instead of a sprint. */
export default {
  n: 6,
  title: 'De la tabla sucia al primer plano',
  goal: 'Dejar utilizable una tabla real —texto estandarizado, atípicos a la vista, huecos imputados— y ver hasta dónde llega con ella el análisis de la sesión 5.',
  hook: 'La tabla del salón lleva tres sesiones con nosotros y todavía no la hemos analizado entera: casi todo lo que dice no son números.',
  blocks: [
    { id: 'entrada',  lab: 'Entrada',  rname: 'La tabla, y el texto',        clock: '0–32' },
    { id: 'bloque-1', lab: 'Bloque 1', rname: 'Los valores raros',           clock: '32–70' },
    { id: 'bloque-2', lab: 'Bloque 2', rname: 'Rellenar, y acordarse',       clock: '78–116' },
    { id: 'bloque-3', lab: 'Bloque 3', rname: 'Qué va con qué, y el PCA',    clock: '124–164' },
    { id: 'cierre',   lab: 'Cierre',   rname: '¿Qué falta?',                 clock: '164–180' }
  ]
};
