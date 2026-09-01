/* The numbers session 4 works on, precomputed from the cleaned table that session 3
   produced (salon_v2_limpio: Bogotá unified, the seven empty E cells left empty, row 16
   kept). They are constants here — the blocks interpolate them instead of computing in
   JSX — following the MEDIAS pattern of s03/data/salon.js. The values are duplicated
   rather than imported across sessions so this session's chunks stay independent.

   Computed with the interpolation quantile (the spreadsheet default); sample standard
   deviation (n−1). */

/* Column F — minutos de celular ayer. 20 answers; three cells stayed empty. */
export const MINUTOS = {
  n: 20,
  valores: [1, 1, 2, 4, 5, 8, 16, 45, 60, 120, 120, 120, 120, 120, 180, 210, 240, 300, 420, 960],
  media: 152.6,
  mediana: 120,
  moda: 120,
  modaVeces: 5,
  min: 1,
  max: 960,
  rango: 959,
  q1: 7.3,
  q3: 187.5,
  iqr: 180.3,
  desviacion: 221.8,
  cv: 1.45,
  desvMediana: 108
};

/* Column F again, with row 16 (960 minutes) set aside. The pair MINUTOS / MINUTOS_SIN
   is the robustness demo: the mean moves 42 minutes, the median does not move at all. */
export const MINUTOS_SIN = {
  n: 19,
  media: 110.1,
  mediana: 120,
  moda: 120,
  rango: 419,
  q1: 6.5,
  q3: 150,
  iqr: 143.5,
  desviacion: 117.4,
  cv: 1.07,
  desvMediana: 104
};

/* Column H — «alimentación balanceada, 1–5». Ordinal: this is the column the class
   voted about in session 3 («¿se puede promediar una escala del 1 al 5?»). */
export const BALANCEADA = {
  n: 23,
  media: 3.3,
  mediana: 3,
  modas: [3, 4],
  modaVeces: 9,
  q1: 3,
  q3: 4,
  iqr: 1
};

/* Column G — porciones de fruta y verdura. Small honest counts, good for quartiles. */
export const PORCIONES = {
  n: 23,
  valores: [0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4],
  media: 2.1,
  mediana: 2,
  moda: 2,
  q1: 1,
  q3: 3,
  iqr: 2,
  desviacion: 1.2,
  cv: 0.55
};

/* The two de Méré games, exact probabilities. 1 − (5/6)⁴ and 1 − (35/36)²⁴.
   Revealed at the END of the entrada block, after the class has produced frequencies. */
export const MERE = {
  gana4: 51.77,   // % — at least one six in 4 throws of one die
  gana24: 49.14   // % — at least one double six in 24 throws of two dice
};
