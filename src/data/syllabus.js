/* The course's shape: how many sessions there are, and what to announce for the ones
   that do not exist yet.

   It used to carry a title and a goal for all eight. But Cover.jsx reads
   `m ? m.title : title`, so the moment a session got its meta.js those two strings
   stopped being read — five sessions' worth of dead text that nothing kept in step
   with the sessions themselves. Session 4 promised on screen that session 6 was about
   causality, and so did the entry here, for exactly that reason.

   Now a title lives in one place, always: in the session's own meta.js if it exists,
   and here if it does not. Building a session means writing its meta.js and deleting
   its entry below.

   Titles and goals are course content — they stay in Spanish. */

/* Nine, since session 6 was split in two: the cleaning chain stayed as session 6 and
   the analysis of what is not a number became session 7. Everything that counts
   sessions — the cover, the «Sesión NN de NN» eyebrow, the total hours — reads this. */
export const SESIONES = 9;
export const HORAS_POR_SESION = 3;

/* The number in words, for the cover's subtitle. Only the total the course can have. */
export const EN_LETRAS = { 8: 'Ocho', 9: 'Nueve', 10: 'Diez' };

/* n → [title, goal], only for the ones still unbuilt. */
export const PENDIENTES = {
  8: ['Cómo aprende una máquina', 'Desmitificar el aprendizaje automático y la IA: qué tipos hay, cómo se entrenan, cómo se evalúan y por qué fallan.'],
  9: ['Fundamentos de Inteligencia Artificial', 'Skills más populares, MCP, RAG, LangChain y SDD.']
};

export const pad2 = n => String(n).padStart(2, '0');
