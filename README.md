# Amine Guizani · Portfolio, "The Path"

A phone-first, scroll-driven story in blue and white: from the baccalaureate and prepa to software in production at AVOCarbon. Vite + React + TypeScript, GSAP ScrollTrigger, Lenis (desktop only) and a canvas "path" that draws itself through the page.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static output in dist/, served from /MedAminePortfolio/
npm run preview    # builds, then serves dist/ like GitHub Pages at http://localhost:4174/MedAminePortfolio/
```

On Windows PowerShell, use `npm.cmd` if scripts are blocked by the execution policy.

## Where things live

| Path | What |
| --- | --- |
| `src/data/profile.ts` | Every claim and line of copy. Facts come from `Resume/my_experiences.md` plus what Amine confirmed; edit here first. |
| `src/components/Hero.tsx` | The opening frame. CSS-only intro, ships in the entry bundle. |
| `src/Story.tsx` | Lazily loaded chunk that mounts the chapters in order, then the path and the floating "Let's talk" pill. |
| `src/components/Path.tsx` | The blue line: anchors are `data-path` elements, holes are `data-path-hole` elements and pinned scenes. |
| `src/components/*` | One file per chapter (`Origins`, `School`, `Internships`, `Avocarbon`, `Ending`) plus shared `ui.tsx`. |
| `src/lib/motion.ts` | GSAP/ScrollTrigger/Lenis setup and motion tokens. |
| `public/logos/` | Official logos. Ben Salem Automation's is a mark without a name, built by `gen:images` from `assets/ben-salem-automation-src.jpg`. |
| `public/videos/` | Product films (AV1 + H.264 at 720p, WebP posters). Encode settings and VMAF scores are in its `README.md`. |
| `scripts/` | `gen:images` (portrait variants, Ben Salem mark), `gen-og.mjs` (share card), `gen:globe` (land dots), `shots.mjs` + `montage.mjs` (screenshot QA), `serve-dist.mjs`. |

## Deploy

Push to `main`. With **Settings → Pages → Source = GitHub Actions**, `.github/workflows/deploy.yml` builds and publishes `dist/`.
