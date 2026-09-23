/* Session 7. Split off session 6 in the change partir-la-sesion-06-en-dos: session 6
   kept the whole cleaning chain and the PCA, and this one took everything that reads
   what is not a number — from a pair of variables to the whole table.

   Five blocks, in the order the mathematics builds: the entrada crosses two non-numeric
   variables of the class table and reads the contingency table as conditional
   probabilities (and pays the debt session 4 left: the Simpson paradox, as a table of
   three variables); block 1 draws that same table with simple correspondence analysis;
   block 2 is the MCA, which is block 1's analysis on the indicator matrix of many
   variables at once; block 3 is the FAMD; and the closing runs it on the whole clean
   table of the class. The MCA and the FAMD are a few minutes shorter than they were in
   session 6 because block 1 already taught profiles, the chi-square distance, inertia,
   transition, contribution and cos². */
export default {
  n: 7,
  title: 'Todas las variables a la vez',
  goal: 'Leer dos variables que no son números juntas —una tabla de contingencia, la probabilidad condicional de cada fila, las correspondencias que la dibujan— y extender el análisis factorial a todas las variables, hasta analizar la tabla del salón entera.',
  hook: 'La sesión pasada dejó fuera del análisis todas las columnas que no son números: más de la mitad de la tabla. Hoy entran todas.',
  blocks: [
    { id: 'entrada',  lab: 'Entrada',  rname: 'Probabilidad condicional y tablas de contingencia', clock: '0–40' },
    { id: 'bloque-1', lab: 'Bloque 1', rname: 'Correspondencias simples',                            clock: '48–85' },
    { id: 'bloque-2', lab: 'Bloque 2', rname: 'MCA',                                                 clock: '93–128' },
    { id: 'bloque-3', lab: 'Bloque 3', rname: 'FAMD',                                                clock: '128–155' },
    { id: 'cierre',   lab: 'Cierre',   rname: 'El salón entero',                                     clock: '155–180' }
  ]
};
