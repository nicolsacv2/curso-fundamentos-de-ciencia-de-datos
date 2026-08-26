import meta01 from './s01/meta.js';
import meta02 from './s02/meta.js';
import meta03 from './s03/meta.js';

/* Metadata for the built sessions. It is a few bytes and the index needs it to draw
   the block chips, so it ships in the main bundle. The content — the heavy part —
   does not: every block is fetched on its own. */
export const METAS = [meta01, meta02, meta03];

/* One import() per block. Vite emits an independent chunk for each, so opening
   session 1 never downloads session 2, and opening block 1 never downloads block 3. */
export const BLOCKS = {
  1: {
    'entrada':  () => import('./s01/blocks/Intro.jsx'),
    'bloque-1': () => import('./s01/blocks/Block1.jsx'),
    'bloque-2': () => import('./s01/blocks/Block2.jsx'),
    'bloque-3': () => import('./s01/blocks/Block3.jsx'),
    'cierre':   () => import('./s01/blocks/Closing.jsx')
  },
  2: {
    'entrada':  () => import('./s02/blocks/Intro.jsx'),
    'bloque-1': () => import('./s02/blocks/Block1.jsx'),
    'bloque-2': () => import('./s02/blocks/Block2.jsx'),
    'bloque-3': () => import('./s02/blocks/Block3.jsx'),
    'cierre':   () => import('./s02/blocks/Closing.jsx')
  },
  3: {
    'entrada':  () => import('./s03/blocks/Intro.jsx'),
    'bloque-1': () => import('./s03/blocks/Block1.jsx'),
    'bloque-2': () => import('./s03/blocks/Block2.jsx'),
    'bloque-3': () => import('./s03/blocks/Block3.jsx'),
    'cierre':   () => import('./s03/blocks/Closing.jsx')
  }
};

export const findMeta = n => METAS.find(s => s.n === n) || null;
