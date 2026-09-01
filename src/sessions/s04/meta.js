/* Session 4. Built on the cleaned table session 3 produced (salon_v2_limpio) and on
   two live activities served by external APIs (see docs/apis/). */
export default {
  n: 4,
  title: 'Estadística sin miedo: describir la realidad',
  goal: 'Leer con criterio promedios, dispersión y distribuciones, y detectar cuándo un resumen esconde más de lo que muestra.',
  hook: 'Un apostador profesional se hizo rico con un juego de dados y se arruinó con otro casi idéntico. La diferencia era invisible sin datos.',
  blocks: [
    { id: 'entrada',  lab: 'Entrada',  rname: 'La apuesta del caballero', clock: '0–25' },
    { id: 'bloque-1', lab: 'Bloque 1', rname: 'El centro',                clock: '25–70' },
    { id: 'bloque-2', lab: 'Bloque 2', rname: 'La dispersión',            clock: '78–115' },
    { id: 'bloque-3', lab: 'Bloque 3', rname: 'La asociación',            clock: '122–166' },
    { id: 'cierre',   lab: 'Cierre',   rname: 'El resumen que esconde',   clock: '166–180' }
  ]
};
