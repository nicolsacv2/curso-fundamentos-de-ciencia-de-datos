/* The two de Méré games, exact probabilities. 1 − (5/6)⁴ and 1 − (35/36)²⁴.

   These do not come from the class table and no script generates them: they are
   arithmetic, true before anyone answered the form. That is why they stayed here
   when the rest of this file moved to the shared src/data/salon.js — a dataset
   module has no business publishing a constant nobody measured.

   Revealed at the END of the entrada block, after the class has produced its own
   frequencies. */
export const MERE = {
  gana4: 51.77,   // % — at least one six in 4 throws of one die
  gana24: 49.14   // % — at least one double six in 24 throws of two dice
};
