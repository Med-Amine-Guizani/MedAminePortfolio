# Amine Guizani · Portfolio

A scroll-driven, motion-heavy portfolio for a Full-Stack AI Engineer. Vite + React + TypeScript, GSAP ScrollTrigger, Lenis, canvas 2D and Matter.js.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static output in dist/, served from /MedAminePortfolio/
npm run preview
```

## Where things live

| Path | What |
| --- | --- |
| `src/data/profile.ts` | Every claim on the site. Facts come from `Resume/my_experiences.md`, so edit here first. |
| `src/lib/motion.ts` | Motion tokens, Lenis + GSAP setup, velocity skew, scramble text. |
| `src/components/` | One file per chapter, plus visuals (`JourneyVisuals`, `ProductionVisuals`, `Globe`, `PortraitParticles`). |
| `scripts/` | `gen:globe` (land dots), `gen:images` (portrait variants), `gen-og.mjs` (share card), `shots` (screenshot QA). |

## Deploy

Push to `main` on the `MedAminePortfolio` GitHub repo with Pages set to **GitHub Actions**. `.github/workflows/deploy.yml` builds and publishes `dist/`.
