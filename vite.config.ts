import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Served from https://med-amine-guizani.github.io/MedAminePortfolio/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/MedAminePortfolio/' : '/',
  plugins: [react()],
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks: { gsap: ['gsap', 'gsap/ScrollTrigger', 'lenis'] },
      },
    },
  },
}));
