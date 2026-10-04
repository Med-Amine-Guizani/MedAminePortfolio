# Build Prompt: Mohamed Amine Guizani's Portfolio

> Paste this whole file into Claude Code, opened in `C:\Users\amine\OneDrive\Desktop\Portfolio`.

---

## Your role

You are a team of three people working as one:
1. **An award-level creative director.** You think in story, rhythm and emotion. You care about the kind of site that wins Awwwards Site of the Day.
2. **A senior motion designer.** You choreograph every transition the way a film editor cuts a trailer.
3. **A senior front-end engineer.** You ship that vision at 60fps on a mid-range phone, accessibly, with no jank.

Build a portfolio website for **Mohamed Amine Guizani**, positioning him as a **Full-Stack AI Engineer**. The site must feel like an experience, not a résumé. A recruiter or engineering lead who lands on it should keep scrolling to the very last pixel and leave with goosebumps.

Do not settle for a template look. If a section looks like something on a "top 10 portfolio templates" list, redo it.

---

## Sources of truth (read these first)

| What | Where |
| --- | --- |
| Full verified experience bank | `C:\Users\amine\OneDrive\Desktop\Resume\my_experiences.md` |
| AI-focused résumé (best framing reference) | `C:\Users\amine\OneDrive\Desktop\Resume\Applications\LOOYAS_AI_Engineer\Amine_Guizani_AI_Engineer_LOOYAS.tex` |
| General English résumé | `C:\Users\amine\OneDrive\Desktop\Resume\Resume_Template\English_Resume\Amine_Guizani_Cv.tex` |
| Portrait photo | `C:\Users\amine\Downloads\MyResumePicture.png` (864×864 PNG, already cropped to a circle with transparent corners, light grey studio background, light-blue shirt) |

Copy the photo into the project (`public/` or `src/assets/`) and generate optimized WebP/AVIF versions. Never hotlink the Downloads path.

### Honesty rules (non-negotiable)

These rules come from `my_experiences.md`. Every claim on the site must trace back to that file or to this prompt.
- **Never invent** metrics, clients, plant names or locations, user counts, technologies, or outcomes. If a number would make a section stronger but none exists, use language or visuals instead. Never fake a number.
- The **only verified metrics** are **60% faster delivery of client enhancement requests** and **20% fewer re-renders**, both at Cognira. Use them big and proudly.
- Do **not** claim "Machine Learning" as a personal skill. Do not claim LangChain, MCP, vector databases, reranking, multi-provider LLM routing, or eval/observability frameworks.
- Do not reproduce AVOCarbon's internal specification, customer names, or internal business rules.

---

## The person: content to use

**Name:** Mohamed Amine Guizani (display it as "Amine Guizani" in the hero; use the full name in the meta, footer and structured data)
**Title:** Full-Stack AI Engineer
**Location:** Tunis, Tunisia. Open to relocation (needs visa sponsorship; do not state work authorization anywhere).
**Contact:** amineguizani33@gmail.com · (+216) 95 954 110 · [LinkedIn](https://www.linkedin.com/in/mohamed-amine-guizani/) · [GitHub](https://github.com/Med-Amine-Guizani)
**Languages:** Arabic (native), English (advanced, TOEIC 915/990), French (upper-intermediate), German (A2)

### Headline facts the site MUST communicate
1. **He is currently employed as a Full-Stack & AI Engineer at AVOCarbon Group** (since August 2026). AVOCarbon is an international industrial manufacturer with plants around the world.
2. **His work at AVOCarbon is already in production**, delivering real value and supporting people across AVOCarbon's plants worldwide. Make this the emotional climax of the site.
   - **Derogation Management Platform: in production.** A request and approval platform with 4 roles, a two-level approval workflow, configurable notifications, and responsibility matrices configurable per plant. Stack: Python, FastAPI, SQLAlchemy, Alembic, React.
   - **Role-Based Intelligence Agent: in active development.** An AI agent built in Python + LangGraph. It correlates weekly operational data from several internal applications and databases, then reasons about what changed, what is stagnating, what is blocked, and what risk or opportunity is emerging. It produces a role-specific newsletter or memo for each role, with role-based access control so each reader sees only what they are authorized to see. **Label it "In development". Never call it deployed and never attach a metric to it.**
3. **He graduated from ENICarthage** (National School of Engineering of Carthage) with a national engineering degree in Software Engineering in **July 2026**. Write "Class of 2026" or "Graduated July 2026". Avoid "2 months ago", which goes stale.

### The journey (the narrative spine)
| When | Where | The story beat |
| --- | --- | --- |
| 2021–2023 | **IPEIN**, Nabeul Preparatory Engineering Institute (Physics & Technology) | The foundation: rigor, maths, physics |
| Jul–Aug 2024 | **BS Automation**, intern | C++ and Angular low-code workflows that make collaborative-robot setup simpler for factories; worked with a German client; Scrum |
| Jun–Aug 2025 | **Capgemini Engineering**, intern | An end-to-end HR internship-lifecycle platform: Spring Boot + Spring Security (JWT, RBAC), Angular, an email intake pipeline, a Kanban board, **LLM-based resume analysis and scoring with structured JSON output**, and **semantic vector search** to detect duplicate projects |
| Feb–Jun 2026 | **Cognira**, final-year project (PFE), Atlanta-based AI retail startup, Tunis R&D | Built **Configuration Studio** for PromoAI: replaced GitOps file editing with a 4-click UI, giving **60% faster client enhancement delivery** and **20% fewer re-renders** (React + Redux Toolkit), plus a propagation engine with deviation detection. Integrated a **conversational AI agent (RAG + tool calling)** into NestJS that operates on live configuration JSON through structured tool calls and patch synchronization with the UI, with Redis sessions and a human kept in the loop |
| Jun–Jul 2026 | **Auveillese**, freelance (Portugal, remote) | NestJS + React for hotel platforms, from reservations to energy monitoring |
| Jul 2026 | **ENICarthage**, graduation | Software Engineering degree |
| Aug 2026 → now | **AVOCarbon Group**, Full-Stack & AI Engineer | Production software used across plants worldwide, plus an AI agent in development |

### Side projects
- **WatchWise**: MERN movie platform with JWT, TMDB caching, and a customized Recombee recommendation engine. [GitHub](https://github.com/Med-Amine-Guizani/WatchWise) · [Live demo](https://watch-wise-pink.vercel.app/)
- **Smart City Shield** (academic): Java/Spring Cloud microservices talking REST, GraphQL, SOAP and gRPC, with API Gateway, Service Discovery, and Docker.

### Stack (only these)
- **AI:** LangGraph, agent orchestration, RAG, tool calling, conversational agents, LLM document analysis/scoring, semantic vector search
- **Languages:** Python, TypeScript, JavaScript, Java, C, C++
- **Frontend:** React, Redux Toolkit, Angular
- **Backend:** FastAPI, NestJS, Node.js, Express, Spring Boot, Spring Security
- **Data:** PostgreSQL, SQLAlchemy, Alembic, Oracle PL/SQL, MySQL, MongoDB, Redis
- **Ops:** Docker, Docker Compose, Kubernetes, CI/CD, GitHub Actions, Linux

---

## Creative concept: "Signal → Production"

The whole site is a single scroll-driven film about **turning raw signal into running systems**, which is exactly what a full-stack AI engineer does. The visitor's scroll is the agent's execution: each chapter is a **node in a graph** (a quiet nod to LangGraph), connected by a glowing **edge line** that draws itself as you scroll and travels the full length of the page.

**Mood:** dark, cinematic, precise. Think of a mission-control room at night: deep near-black background (not pure #000), one electric accent color (for example, an ion-cyan or a "carbon-ember" orange that nods to AVOCarbon; pick one and commit), warm off-white text, and a mono font for "machine voice" labels.
**Typography:** one oversized, characterful display face (for example, a variable grotesk from Google Fonts that can animate its weight axis) plus a clean text face and a mono. Headlines are huge, sometimes bigger than the viewport, and set with confidence.

### Chapter by chapter

**00 · Boot (preloader, ≤ 2.5s, skippable)**
A terminal-like counter streams fake-but-tasteful agent log lines (`> loading context… > resolving graph… > ready`) while a percentage counts up. On "ready", the screen splits or irises open into the hero. Never let it block content for long; first-time visitors only (remember this in sessionStorage).

**01 · Hero: "I build software that thinks, and ships."** (write a better line if you can)
- The portrait **assembles from particles or ASCII glyphs** that converge into the photo, reacting subtly to the cursor (a WebGL shader or canvas). On mobile, use a lighter version of the effect.
- The name animates in letter by letter with a masked rise. The title "Full-Stack AI Engineer" cycles through a scramble/decode text effect.
- A small live status pill reads: **"● Currently: Full-Stack & AI Engineer @ AVOCarbon"**.
- A scroll cue invites the visitor down. The graph edge starts here.

**02 · Origin: "Built on physics."**
IPEIN → ENICarthage. A short, poetic beat. Equations or circuit lines morph into code. Ends on a **graduation moment**: "ENICarthage · Software Engineering · Class of 2026", with a cap-toss particle burst or a stamp/seal animation.

**03 · The Journey: pinned horizontal scroll**
The section pins and the internships slide horizontally like film frames: BS Automation → Capgemini → Cognira → Auveillese. Each card has its own micro-visual:
- *BS Automation:* a wireframe robot arm articulating.
- *Capgemini:* resumes flying into a Kanban board, then scored by an LLM to JSON.
- *Cognira:* a config tree collapsing into "4 clicks", with **60%** and **20%** counting up in huge type.
- *Auveillese:* a hotel energy graph pulsing.

**04 · The Climax: AVOCarbon, "Now in production. Around the world."**
This is the goosebumps moment. Slow everything down here.
- The screen goes nearly black and silent. One line types out: *"August 2026. First job. Real users."*
- A **3D globe** (or a stylised dotted world map) fades in. **Arcs of light launch from Tunisia** and connect to points around the world, representing AVOCarbon's plants. **Do not label specific plant cities or countries unless Amine provides them; keep the points abstract and unlabeled.**
- Headline: **"Software in production, supporting people across AVOCarbon's plants worldwide."**
- Two project panels follow:
  - **Derogation Management Platform**, with a **PRODUCTION** badge glowing green. Animate the approval workflow: a request travels through 4 roles and 2 approval levels while notification pings fire.
  - **Role-Based Intelligence Agent**, with an **IN DEVELOPMENT** badge (amber, pulsing). Animate a LangGraph-style node graph: data sources flow in, then reason, then fan out into different memos for different roles, with some content visibly redacted/blurred per role to show RBAC.

**05 · Lab: side projects**
WatchWise and Smart City Shield as tilt/hover cards with a magnetic cursor, video-like previews (CSS/canvas loops are fine), and real links.

**06 · Stack: "The toolbelt"**
Not a boring logo grid. Ideas: a physics playground where skill chips fall and can be thrown around (Matter.js), or an orbiting constellation grouped by layer (AI / Front / Back / Data / Ops). Pick the one that runs smoothest.

**07 · Finale: "Let's build what's next."**
The graph edge that has run through the whole page finally reaches its **terminal node** and explodes into light, then resolves into a huge email link with a magnetic hover and copy-to-clipboard. Add LinkedIn, GitHub, and a "Download CV" button. Languages go here as a quiet line. Close with a footer sign-off.

---

## The "this guy really knows AI" layer

Saying "AI engineer" is not enough. The site itself must **show** AI fluency, so a visitor thinks *"wow, this dude knows how to use AI."* Weave these through the experience:

1. **"Ask my agent" console (the centerpiece).** Add a floating command bar (⌘K / Ctrl+K, plus a visible button) that opens an agent console. The visitor asks things like *"What has Amine shipped to production?"* or *"Show me his RAG work"*. The console then **visibly executes like a real agent**:
   - It streams a plan, then fires **tool calls** shown as cards, for example `search_experience({"query":"production"})`, `get_project("derogation-platform")`, `check_access(role="visitor")`.
   - It returns a streamed answer **and drives the page**: it scrolls to the right section, highlights the relevant card, and draws the graph edge to it.
   - It shows a small trace panel (node graph lighting up step by step, token stream, timings).
   - **Implementation:** by default, build it as a **deterministic, client-side agent** over a structured `profile.json` (intent matching + keyword/embedding-free retrieval). Label it subtly: "runs locally on this page". Optionally add a real-LLM mode through a serverless proxy (for example a Cloudflare Worker holding the API key, grounded only on `profile.json`, with rate limiting). **Never put an API key in the client, and ask Amine before setting up any external service.**
2. **Live agent traces as visual language.** Section transitions use agent-trace aesthetics: JSON tool-call payloads that type themselves out, then collapse into the UI they describe. In the Cognira section, the configuration JSON literally gets patched live (a diff animation) to show "agent operates on live state via structured tool calls + patch sync."
3. **RAG made visible.** In the Capgemini/Cognira beats, animate retrieval: a query vector flies into a field of document points, the nearest neighbors light up, and they flow into a response. Keep it explanatory and beautiful, not a gimmick.
4. **RBAC memo demo.** In the AVOCarbon agent panel, let the visitor **toggle the viewer role** (e.g. "Plant Manager", "Sales", "Executive", all generic and invented-as-example, clearly illustrative). The same memo re-renders with different sections revealed or redacted, with a smooth morph between states.
5. **Human-in-the-loop moment.** One interaction where the "agent" proposes a change and the visitor clicks **Approve**. This echoes his philosophy of keeping humans at the center.
6. **Built-with-AI colophon.** In the footer, add an honest, confident line about how the site was built (AI-assisted, engineered and directed by Amine). This frames him as someone who wields AI tools expertly.

Everything shown in these demos must be **illustrative of his real work** and use only facts from `my_experiences.md`. Demo data such as example memos and roles must be clearly generic and must never look like real AVOCarbon data.

---

## Motion design system (a first-class requirement)

**Motion level: HEAVY.** This is a motion-design showcase as much as a portfolio. Every scroll pixel should move something meaningful, every hover should respond, and every transition should feel crafted. It must still be **butter-smooth**: heavy in craft, never heavy in jank. If an effect drops frames on a mid-range laptop, simplify it until it doesn't.

Motion is the soul of this site. Treat it as a designed system, not sprinkled effects.

**Tokens:** define these once and use them everywhere:
- Easings: `--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)`, `--ease-in-out-quint: cubic-bezier(0.83, 0, 0.17, 1)`, plus a soft spring for UI.
- Durations: `micro 150ms` · `ui 300ms` · `reveal 800ms` · `cinematic 1400ms`.
- Stagger: 40–80ms for letters and items.

**Principles:**
1. **Choreograph, don't decorate.** Each section has an entrance, a "hold" moment, and an exit that hands off to the next. Write a one-line choreography note per section before coding it.
2. **Scroll is the timeline.** Use GSAP ScrollTrigger with `scrub` for narrative sequences and Lenis for buttery smooth scroll. Use pinning for the Journey and Climax sections.
3. **Contrast in tempo.** Fast, punchy energy in the Journey; slow, breathing reverence in the Climax. Silence and empty space are motion tools too.
4. **Signature interactions:** a custom cursor that morphs over links/cards (with a label such as "view", "open", "copy"), magnetic buttons, masked text reveals, scramble/decode text, number count-ups, SVG path draw (the graph edge), image reveal with clip-path, and subtle parallax depth layers.
5. **Page-level continuity:** the single graph-edge line is the visual thread. It must never feel broken between sections.
6. **Micro-interactions everywhere:** hover states, focus rings that animate, a scroll-progress indicator styled as graph-traversal progress (`node 04/07`).
7. **Signature set-pieces (heavy-motion moments).** Build each of these at showcase level:
   - **Hero:** particle portrait with cursor-reactive displacement, plus kinetic typography whose variable font weight responds to scroll velocity.
   - **Section transitions:** WebGL or clip-path wipes, where the outgoing section shatters into glyphs that rebuild the next one.
   - **Journey:** horizontal pinned scroll with velocity-based skew and parallax depth inside each card.
   - **Climax:** a cinematic slow-down, a globe with arc launches synchronized to the typing text, and a camera dolly into the project panels.
   - **Finale:** the terminal-node light explosion resolving into the contact CTA.
   - Add page-wide **scroll-velocity reactivity**: subtle skew and blur on fast scroll that settles with an elastic return.
8. **Smoothness budget:** keep one `requestAnimationFrame` loop (GSAP ticker driving Lenis + R3F). Never animate layout properties. Use `will-change` sparingly. Pause offscreen WebGL. Test on throttled CPU (4×) in DevTools.
9. **Respect `prefers-reduced-motion`:** swap scrub/pin/parallax for simple fades, disable WebGL particles (show the static photo), and turn off smooth scroll. The story must still read perfectly.

---

## Tech stack

- **Vite + React + TypeScript** (static build, deployable to GitHub Pages)
- **GSAP + ScrollTrigger** (free, including all plugins), **Lenis** for smooth scroll
- **Three.js / React Three Fiber + drei** for the hero particles and the globe. Lazy-load these, and fall back to canvas/SVG on low-power devices.
- **Framer Motion** only for small component-level UI transitions, if useful
- Styling: CSS modules or Tailwind, with design tokens as CSS variables
- **Deploy target:** his existing portfolio URL `https://med-amine-guizani.github.io/MedAminePortfolio/` (set the Vite `base` accordingly), with a GitHub Actions deploy workflow. Ask before pushing or deploying anything.

---

## Quality bar

- **Performance:** Lighthouse ≥ 90 on mobile for performance, accessibility, best practices and SEO. Code-split the 3D. Hero visible quickly (LCP < 2.5s). Keep all animation transform/opacity-only, and target 60fps.
- **Responsive:** design mobile intentionally. On phones, the horizontal journey becomes a vertical stacked sequence, and the globe becomes a lighter 2D dotted map.
- **Accessibility:** semantic HTML, real text (never text baked into canvas only), keyboard navigable, visible focus, alt text, sufficient contrast, preloader skippable.
- **SEO / sharing:** title, meta description, Open Graph image (generate a striking 1200×630 card), favicon, and JSON-LD `Person` schema.
- **Polish:** no layout shift, no flash of unstyled content, a custom 404, and a tasteful console Easter egg for engineers who open DevTools (for example, an ASCII signature plus "hire me" email).

---

## Process

1. Read the source files listed above.
2. Propose, briefly: the final accent color, the font pairing, the hero headline (3 options), and the choreography note for each chapter. Then build. Don't wait for approval on taste calls; make strong choices.
3. Build section by section. After each major section, run the dev server and check it in a browser at desktop and phone widths.
4. Finish with a performance + reduced-motion + accessibility pass.
5. Report back: what was built, how to run it, how to deploy, and **any place where you needed a fact you didn't have** (for example, plant locations, user counts, or a CV PDF to link). Ask for those facts. Don't invent them.

**The test:** a hiring manager should finish the site thinking, *"This person ships real AI into production, and has taste. I need to talk to him."*
