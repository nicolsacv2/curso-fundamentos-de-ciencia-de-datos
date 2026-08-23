import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/* base:'./' — sirve igual desde la raíz del dominio o desde un subdirectorio.
   Los nombres de chunk se fijan a mano para poder reconocer en la pestaña Network
   qué sesión y qué bloque bajó cada vez: s01-bloque-1-<hash>.js */
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
