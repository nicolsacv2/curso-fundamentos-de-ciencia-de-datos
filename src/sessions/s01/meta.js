/* Ported from sesiones/01/meta.json. Metadata is tiny and the index needs it, so it
   ships in the main bundle; the content does not.
   Block ids match the public URL slugs (#s1/bloque-1) and stay in Spanish. */
export default {
  n: 1,
  title: 'El mundo corre sobre datos',
  goal: 'Qué es y qué no es la ciencia de datos, por qué ya tomamos decisiones con datos todos los días, y de dónde salió todo esto.',
  hook: '¿Cuántas decisiones tomó un algoritmo por ti hoy, antes del desayuno?',
  blocks: [
    { id: 'entrada',  lab: 'Entrada',  rname: 'Una sola palabra',  clock: '0–12' },
    { id: 'bloque-1', lab: 'Bloque 1', rname: 'Tu rastro de ayer', clock: '12–52' },
    { id: 'bloque-2', lab: 'Bloque 2', rname: 'El ciclo de vida',  clock: '60–98' },
    { id: 'bloque-3', lab: 'Bloque 3', rname: 'Cuatro historias',  clock: '106–152' },
    { id: 'cierre',   lab: 'Cierre',   rname: 'La curva',          clock: '160–180' }
  ]
};
