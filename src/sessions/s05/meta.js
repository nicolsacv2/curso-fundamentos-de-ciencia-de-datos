/* Session 5. Like sessions 3 and 4, it was written here and not ported from an
   original panels.html. Its examples do not come from the classroom table either:
   they are 183 countries from Gapminder, which is why sessions 2 and 4 have to stop
   promising that this one graphs the table (see specs/001-sesion-05-graficos-y-pca).

   The entry is longer than the usual 22 minutes because three formulas have to be
   chained in it — variance, covariance and correlation — before anything is drawn. */
export default {
  n: 5,
  title: 'Ver lo que no cabe en la hoja',
  goal: 'Elegir el gráfico que corresponde a cada dato y a cada pregunta, y leer un plano factorial para ver a la vez más variables de las que caben en dos ejes.',
  hook: 'Cuatro variables no caben en un papel de dos dimensiones; vamos a dibujarlas todas y a perder menos de lo que crees.',
  blocks: [
    { id: 'entrada',  lab: 'Entrada',  rname: 'Tres fórmulas encadenadas', clock: '0–35' },
    { id: 'bloque-1', lab: 'Bloque 1', rname: 'Cinco gráficos',            clock: '35–75' },
    { id: 'bloque-2', lab: 'Bloque 2', rname: 'La sombra de la nube',      clock: '83–120' },
    { id: 'bloque-3', lab: 'Bloque 3', rname: 'La tabla girada',           clock: '128–166' },
    { id: 'cierre',   lab: 'Cierre',   rname: 'Gráficos que estorban',     clock: '166–180' }
  ]
};
