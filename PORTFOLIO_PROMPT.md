# Build Prompt v2: Amine Guizani's Portfolio, "The Path"

> Open Claude Code in `C:\Users\amine\OneDrive\Desktop\Portfolio` and say: **"Follow PORTFOLIO_PROMPT.md"**.
> v1 (dark, ember, terminal-styled) is in git history at commit `aea16ec`. This prompt replaces it.

---

## What changed from v1, and why

Amine liked v1's craft but not its feel. It reads like "a matrix world": terminal boot logs, mono JSON traces, an agent console, a dark hacker mood. The new version must feel **human, warm and cinematic**, like a well-made brand film about a person, not a code demo.

| v1 (remove) | v2 (build) |
| --- | --- |
| Dark near-black + ember orange | **Blue and white**, Amine's personal brand colours (LinkedIn) |
| Terminal preloader, trace lines, mono "machine voice", JSON payloads | Human, editorial typography; plain-language storytelling |
| "Ask my agent" console | Removed (already deleted in code) |
| Particle portrait | His real photo, beautifully treated |
| Tech demos per job (RAG viz, patch diff, physics toolbelt) | **What he learned at each step**, told visually |
| Desktop-first horizontal pinned scroll | **Phone-first**. About 80% of visitors arrive from a phone (LinkedIn) |
| Auveillese freelance card | Removed. Amine doesn't want it shown. |

Keep from v1: the Vite + React + TypeScript project, GSAP + ScrollTrigger, the GitHub Pages deploy workflow and `base: '/MedAminePortfolio/'`, the build/QA scripts in `scripts/`, the staged chapter mounting in `App.tsx`, the honesty rules, and the share card / SEO setup (regenerate the OG image in the new colours). Reuse the canvas `Globe` only if it can be recoloured and kept light on phones.

---

## Your role

Act as a creative director, a senior motion designer and a senior front-end engineer working as one. The bar is an Awwwards-level personal site **that is at its best on a phone**. A recruiter who taps the link from LinkedIn on their phone should scroll to the end, feel something, and want to message Amine.

---

## Sources of truth

| What | Where |
| --- | --- |
| Verified experience bank | `C:\Users\amine\OneDrive\Desktop\Resume\my_experiences.md` |
| Current site content | `src/data/profile.ts` (update it, it stays the single source for every claim) |
| Portrait | `public/portrait-480.webp`, `portrait-864.webp` (+ `.avif`); original at `assets/portrait-src.png` |
| New facts from Amine (2026-10-04) | The chapter notes below. These come from Amine directly and are verified. |

### Honesty rules (unchanged, non-negotiable)
- Never invent metrics, user counts, plant names or locations, clients, technologies or outcomes.
- The only numbers are:
  - the national engineering entrance exam rank, **100th out of 800**;
  - Cognira's **60% faster delivery of client enhancement requests** and **20% fewer re-renders**;
  - the derogation platform's **4 roles** and **2-level approval workflow**.
- The baccalaureate honour is **"Mention Très Bien"** (in English: *with highest honours*). Show it as an honour, not as a number or grade average.
- The AVOCarbon intelligence agent is **in development**. Never call it deployed.
- Do not claim "Machine Learning" as a personal skill, or LangChain, MCP, vector databases, reranking, multi-provider LLM routing or eval frameworks.
- Do not reproduce AVOCarbon's internal specification, customer names or internal business rules.
- Don't mention Auveillese anywhere on the site.

---

## Brand: blue and white

Amine brands himself in **blue and white**: his LinkedIn, and the logos of the companies he has joined. Use **only blue, its shades, and white** (plus neutral greys for body text). No orange, no green. Use a single success tint only if a status badge truly needs it; prefer a blue "Live" badge.

Starting palette (refine it, check contrast, and ask Amine for his exact LinkedIn hex if he has one):

| Token | Hex | Use |
| --- | --- | --- |
| `--white` | `#FFFFFF` | Main background |
| `--ice` | `#F3F7FF` | Alternate light sections, cards |
| `--mist` | `#DCE7FB` | Borders, soft fills |
| `--sky` | `#7FB2FF` | Highlights on navy, glows |
| `--blue` | `#2563EB` | Primary brand blue: links, accents, the path |
| `--royal` | `#1D3FBF` | Pressed states, deep accents |
| `--navy` | `#0A1A3F` | Immersive "night" chapters, headings on white |
| `--ink` | `#0E1730` | Body text on white |
| `--slate` | `#5B6785` | Secondary text (must pass 4.5:1 on white) |

Rhythm: mostly **white and airy**, with a few **deep-navy immersive chapters** (Prepa nights, the AVOCarbon climax, the ending) where the background colour itself animates from white to navy and back as you scroll. That contrast is a big part of the "wow".

**Typography: human, not code.**
- One expressive display face for headlines (a modern serif such as *Instrument Serif* or *Fraunces*, or a warm grotesk), and a clean, very readable sans for body (for example *Inter Tight*, *Manrope* or *Geist*).
- **No monospace as a voice.** Optionally, a serif italic for the emotional words in a headline ("*real* users").
- Big, confident headlines that still fit a 360px-wide screen without breaking words.
- Self-host or async-load fonts with metric-matched fallbacks (v1 has the technique in `src/styles/tokens.css`) to avoid layout shift.

---

## Company and school logos

Show the real logo at every step. The logos are the milestones of the story.

| Step | Organisation | File to create |
| --- | --- | --- |
| Baccalaureate | Tunisian national baccalaureate (no logo; use a typographic "Bac" seal in blue instead) | none |
| Prepa | IPEIN, Institut Préparatoire aux Études d'Ingénieurs de Nabeul | `public/logos/ipein.svg` |
| Engineering school | ENICarthage, École Nationale d'Ingénieurs de Carthage | `public/logos/enicarthage.svg` |
| Internship 1 | BS Automation | `public/logos/bs-automation.svg` |
| Internship 2 | Capgemini Engineering | `public/logos/capgemini.svg` |
| Internship 3 (PFE) | Cognira | `public/logos/cognira.svg` |
| Job | AVOCarbon Group | `public/logos/avocarbon.svg` |

- **Sourcing:** use the official logo from the organisation's own website, press kit, or Wikimedia Commons. Prefer SVG, otherwise a transparent PNG at 2× size. Save the files locally; never hotlink.
- **If you can't find a clean official file, stop and ask Amine** to drop it in `public/logos/` under the name above. Don't redraw a logo or approximate it with text in a lookalike font.
- **Treatment:** never distort, recolour inside the mark, or crop a logo. To fit the blue-and-white brand, show each logo on a white rounded "badge" (keeping its original colours), or as a single-colour white/navy version only where the organisation publishes one.
- Each logo is a motion moment (see "The path" below). Give every logo an `alt` with the organisation's name.

**Optional photos:** ask Amine whether he has photos from prepa, ENICarthage, his teams (Cognira, AVOCarbon) or a plant visit. Real photos of people make the "I learned from great people" chapters land. The design must still work beautifully without them.

---

## The story: chapter by chapter

Write in **first person**, warm and plain, with short sentences that read well on a phone. Each step answers one question: **what did I get out of it?** The copy below is a starting draft built from Amine's own words. Polish it and keep its meaning. Each chapter has: the logo + dates, a one-line headline, 2–4 short "what I took from it" lines, and at most one proof point.

### 0 · Hero
- His photo, treated in blue: a duotone, or a circular reveal from a blue disc.
- Name: **Amine Guizani**. Eyebrow: **Full-Stack & AI Engineer · AVOCarbon Group**.
- Headline options (pick one or write a better one):
  - "I build software people actually use, and AI helps me ship it faster."
  - "From problem sets to production."
  - "Every step taught me something. Here's the path."
- Small line: "ENICarthage, Class of 2026. Today my work runs in AVOCarbon's plants around the world."
- Two buttons: **Get in touch** (scrolls to contact) and **LinkedIn**.
- A gentle cue to scroll (and on phones, to swipe up).

### 1 · Where it started: Baccalaureate, then Prepa at IPEIN (2021–2023)
- **Baccalaureate in Technical Sciences** (*Sciences Techniques*), **with highest honours** (*Mention Très Bien*). This is the first milestone on the path, shown as a blue seal or stamp: "Bac · Technical Sciences · Mention Très Bien".
  - The bac year is presumably 2021, since prepa started in September 2021. Confirm with Amine before printing a year.
- Then prepa. Headline: *"Two years of learning how to think."*
- What I took from it: **problem solving**. Maths and physics every day taught me to break a hard problem down, model it, and not let go until it's solved. I still work that way.
- The payoff: **ranked 100th out of 800** in the national engineering entrance exam (*concours national d'entrée aux écoles d'ingénieurs*), which opened the door to ENICarthage.
- Motion idea: hand-drawn equations and pencil sketches stroke themselves onto the page. Then a ranking counter rolls and settles on **100 / 800**, and everything resolves into one clean blue line: the path that runs through the rest of the site.

### 2 · ENICarthage (2023–2026): the fundamentals, and the people
- Headline: *"The fundamentals, and the people."*
- What I took from it:
  - Computer-science fundamentals from the ground up: algorithms, systems, databases, networks, software architecture.
  - The people. Through networking I met many interesting people, classmates and professors, and learned a lot from them.
  - Graduated **July 2026**, national engineering degree in Software Engineering.
- Motion idea: dots appear one by one and connect into a growing network of people as you scroll (abstract dots only, no fake faces or names). It ends on a graduation moment: a seal or diploma stamp in blue.

### 3 · BS Automation, internship (Jul–Aug 2024): my first client
- Headline: *"My first client, and my first robots."*
- What I took from it:
  - **Dealing with clients**: working with a German client to clarify what they really needed and agree on acceptance criteria.
  - **Robotics**: C++ and Angular for a platform that makes collaborative robots easier to set up in factories.
  - **The startup environment**: a small team, real ownership, moving fast.
  - **Scrum in practice**: daily meetings, sprint planning, delivering in increments.
- Motion idea: a clean line-drawn robot arm moves through its setup steps while a sprint loop (circle) completes around it.

### 4 · Capgemini Engineering, internship (Jun–Aug 2025): shipping end to end
- Headline: *"My first project, end to end."*
- What I took from it:
  - **Owning a project from start to finish**: a platform that automates the whole internship lifecycle, from applications arriving by email to archiving the finished project, built and shipped.
  - **The first time I used AI to make the experience better**: an LLM reads each application and scores the fit, and semantic search finds similar past projects. It wasn't AI for show; it saved HR real effort.
- Proof (optional): Spring Boot, Angular, LLM scoring, semantic search.
- Motion idea: a single application card travels through the whole flow (inbox → AI score → interview → onboarding → archive) and lands as "shipped".

### 5 · Cognira, final-year project (Feb–Jun 2026): inside a product company
- Headline: *"Learning how a real product company works."*
- What I took from it:
  - **How a SaaS company like Cognira builds, ships and supports a product** (PromoAI, for retailers).
  - **Going deep on JavaScript and TypeScript.**
  - **A team I learned a lot from**: very competent, genuinely kind people.
  - **Learning to work with AI**: tools like Claude Code became part of how I build.
- Proof: big animated counters, **60%** faster delivery of client enhancement requests and **20%** fewer re-renders. One line on what he built: Configuration Studio, a low-code configuration platform with a conversational assistant (RAG + tool calling) that keeps the human in charge.
- Mention Claude Code by name in text only. Don't use Anthropic's logo or brand marks.

### 6 · AVOCarbon Group (August 2026 → now): the real thing (the climax)
- The background deepens to **navy**. Slow everything down. One line: *"August 2026. My first job."* Then: **Full-Stack & AI Engineer at AVOCarbon Group.**
- A world view (a recoloured globe or a dotted map) with blue arcs leaving Tunisia toward points around the world. Arcs and points stay **unlabelled and illustrative**. Add a small caption saying so, unless Amine provides the plant countries.
- Headline: *"Software in production, used across AVOCarbon's plants worldwide."*
- **The Derogation Management Platform, told as a loop** (this is the heart of the site; animate it as a continuous cycle):
  1. **Listen**: I talked with the people who handle derogations to get the features right and understand the derogation flows and their pain points.
  2. **Build with AI**: I used AI to ship the solution fast.
  3. **Deploy**: deployed efficiently into production, used across plants.
  4. **Watch and fix**: I keep monitoring how people use it. When something goes wrong I usually see it in the logs and fix it before anyone has to report it.
  - Facts under the loop: 4 roles · 2-level approval workflow · configurable notifications · per-plant responsibility matrices · Python, FastAPI, SQLAlchemy, Alembic, React.
  - Motion idea for step 4: a quiet log line flags an issue → a fix ships → the user's screen just keeps working. The user never even notices.
  - Amine called them "clients". Use "the people who use it" or "users and stakeholders", unless he confirms another word.
- **Building next** (small, secondary): a LangGraph agent that turns weekly operational data into a memo for each role, with access control. Badge: **In development**.

### 7 · Also built (compact)
- WatchWise (MERN, Recombee recommendations): [live demo](https://watch-wise-pink.vercel.app/) · [GitHub](https://github.com/Med-Amine-Guizani/WatchWise).
- Smart City Shield (academic, Spring Cloud microservices).
- On phones: a horizontal swipe row of two cards.

### 8 · Toolbox (compact)
- Grouped chips: AI · Languages · Front end · Back end · Data · Ops, from `profile.ts`. A smooth marquee or staggered reveal, **not** a physics playground (dragging conflicts with scrolling on phones).

### 9 · Ending: let's talk
- Back to light: a soft blue gradient sky. Headline: *"Let's build what's next."*
- A huge tappable email (with a copy button), plus LinkedIn and GitHub, and the phone number as a `tel:` link.
- Languages as a quiet line: Arabic (native), English (advanced, TOEIC 915/990), French (upper-intermediate), German (A2).
- Footer: © 2026 Mohamed Amine Guizani · Tunis, Tunisia.

---

## Motion design: immersive, smooth, human

**Concept: "The Path".** One continuous blue line runs through the whole story like a road. It's born in the prepa sketches, draws itself as you scroll, and passes through each chapter. At every milestone the organisation's **logo arrives on the path**: it scales up into the centre, holds, then docks into the chapter's header. The path ends at the contact section.

**Signature moments (build these at showcase level):**
1. **Hero reveal**: a blue disc expands to reveal the photo, the name rises line by line, and a soft blue "aurora" gradient drifts slowly behind (CSS transforms only, cheap on phones).
2. **Logo milestones**: each logo has a scrubbed scale/position move from the path into the chapter header (FLIP-style).
3. **Background day/night**: background colour scrubs from white to navy for the immersive chapters and back again.
4. **Lessons that land**: each "what I took from it" line reveals word by word, with a blue highlighter sweep under the key phrase.
5. **Stacked chapter cards on phones**: each internship card sticks to the top and gently scales back and dims as the next card slides over it. This is the main mobile pattern, and it feels great under a thumb.
6. **Counters**: the entrance-exam rank (100 / 800), then 60% and 20% at Cognira, all count up big with a soft overshoot.
7. **The AVOCarbon loop**: the four steps orbit a centre point as a living cycle, with the "watch and fix" step pulsing.
8. **Ending**: the path draws its last stretch and opens into the contact section.

**Motion system:**
- Tokens: ease-out-expo `cubic-bezier(0.16, 1, 0.3, 1)`, a gentle spring for taps, and durations of 150 / 300 / 800 / 1400ms. Define them once (see `src/lib/motion.ts`).
- Animate **only `transform` and `opacity`** (and background colour on the few section wrappers). No layout properties, no `filter: blur` on large areas on phones.
- Every chapter gets an entrance, a hold and an exit. Write a one-line choreography note per chapter before coding it.
- Micro-interactions: buttons compress slightly on tap and spring back, and links get an animated underline.
- `prefers-reduced-motion`: no scrubbing, pinning or parallax; simple fades only. The story must still read perfectly.

---

## Phone-first engineering (about 80% of traffic)

Design and build at **390×844 first**, then scale up to tablet and desktop.

- **Test widths:** 360, 390, 430 (phones), 768 (tablet), 1440 (desktop). Use `scripts/shots.mjs` (it has `mobile`, `desktop` and `reduced` modes; add 360 and 430 phone modes) and look at every screenshot.
- **Scroll:** use native touch scrolling on phones. Keep Lenis on desktop only (`syncTouch: false`). Set `ScrollTrigger.config({ ignoreMobileResize: true })` and use `svh`/`dvh` units so the iOS address bar doesn't cause jumps.
- **No horizontal pinned sections on phones.** Use vertical sticky/stacked patterns. A swipe row is fine for small secondary content.
- **Nothing depends on hover.** No custom cursor on touch devices. Tap targets are at least 44×44px, and primary actions sit within thumb reach.
- **Type:** body text at least 16px on phones. Headlines must never overflow 360px. Respect safe areas (`env(safe-area-inset-*)`).
- **Performance budget:** smooth 60fps on a mid-range Android (test with 6× CPU throttling in DevTools). Lazy-load anything below the fold. Use AVIF/WebP images with explicit width/height. No layout shift. Keep JS lean, and don't add a heavy WebGL scene unless it degrades gracefully.
- **Targets:** Lighthouse mobile performance **≥ 85**, accessibility **100**, CLS < 0.05, LCP < 2.5s. Report the real numbers you get, even if they miss.
- **No long preloader.** At most a sub-second name/logo intro, and none on repeat visits.

---

## Process

1. Read the sources above and `src/` to see what can be reused (`motion.ts`, staged mounting, scripts, workflow).
2. Briefly propose the palette, the font pairing, 3 hero headlines, and the choreography note for each chapter. Then build; make strong choices without waiting.
3. Source the logos first. List any you couldn't find and ask Amine for them.
4. Update `src/data/profile.ts` with the new story content (lessons per step, AVOCarbon loop). Remove Auveillese and all v1-only content: preloader log, trace rules, retrieval interlude, particle portrait, physics toolbelt, agent remnants.
5. Build chapter by chapter, **phone first**. Screenshot at 390px after each chapter.
6. Finish with a pass on phone, desktop, reduced motion, accessibility and Lighthouse.
7. Regenerate `public/og.png` in the new blue-and-white style (`scripts/gen-og.mjs`).
8. Before deploying, confirm the repo's **Settings → Pages → Source is "GitHub Actions"**, not "Deploy from a branch". Otherwise GitHub serves the raw source files and the site hangs.
9. Commit and push to `main`. The GitHub Action deploys to https://med-amine-guizani.github.io/MedAminePortfolio/. Verify the live page loads the built bundle.
10. Report what was built, the Lighthouse numbers, and any facts or assets you still need from Amine.

**The test:** a recruiter opens the link on their phone from LinkedIn, scrolls to the end without noticing the time, and thinks: *"He learns fast, he listens to users, he ships real things with AI, and he's someone I'd like to work with."*
