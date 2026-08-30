import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/* base:'./' — serves the same from the domain root or from a subdirectory.
   Chunk names are pinned by hand so the Network tab shows which session and which
   block came down each time: s01-bloque-1-<hash>.js */
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/[name]-[hash].js'
      }
    }
  }
});
