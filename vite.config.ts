import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Preloads the fonts the hero paints with (serif headline + body sans), so the
 * largest paint doesn't wait for the stylesheet to discover them.
 */
function preloadHeroFonts(): Plugin {
  const wanted = [/instrument-serif-latin-400-normal.*\.woff2$/, /instrument-serif-latin-400-italic.*\.woff2$/, /manrope-latin-wght-normal.*\.woff2$/];
  return {
    name: 'preload-hero-fonts',
    apply: 'build',
    transformIndexHtml(html, ctx) {
      const files = Object.keys(ctx.bundle ?? {}).filter((f) => wanted.some((re) => re.test(f)));
      return {
        html,
        tags: files.map((f) => ({
          tag: 'link',
          attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `/MedAminePortfolio/${f}`, crossorigin: '' },
          injectTo: 'head' as const,
        })),
      };
    },
  };
}

// Served from https://med-amine-guizani.github.io/MedAminePortfolio/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/MedAminePortfolio/' : '/',
  plugins: [react(), preloadHeroFonts()],
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks: { gsap: ['gsap', 'gsap/ScrollTrigger', 'lenis'] },
      },
    },
  },
}));
