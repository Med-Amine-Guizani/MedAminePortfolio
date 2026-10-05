# Build Prompt v3: product films, Ben Salem Automation, named network

> Open Claude Code in `C:\Users\amine\OneDrive\Desktop\Portfolio` and say: **"Follow PORTFOLIO_PROMPT_V3.md"**.
> This builds on v2 ("The Path", commit `9a747ce`). Everything in `PORTFOLIO_PROMPT.md` still applies unless this file says otherwise, above all its **honesty rules** and the **blue-and-white, phone-first** brand.

---

## What Amine asked for (2026-10-05)

1. **Ben Salem Automation.** "BS Automation" was a mistake. The company is **Ben Salem Automation**. Rename it everywhere and add its logo.
2. **The derogation film plays on the site.** His product film for the Derogation Management Platform plays by itself when it comes into view. It starts downloading as soon as the visitor begins scrolling, so it's ready by the time they reach it. Quality must look good **on a phone**, where about 80% of visitors are.
3. **Names in the ENICarthage network graph:** Yassine, Rami, Mahdi, Ameni, Ghayth.
4. **Two new ad-style product films** in the same style as the derogation film: heavy, impressive motion design and **no hard cuts**:
   - **Capgemini Engineering:** the internship management app. No recording exists. Clone the source, get the app running on a mock-data workflow, capture it, and make the film.
   - **Cognira, Configuration Studio:** no source code. Work from his 5-minute screen recording: understand it, then cut an ad from that footage.
   Then put both films on their internship cards.
5. **Push to the remote** so the site deploys.

**Not doing:** making the IPEIN and ENICarthage logos bigger. Amine first asked for it, then said they're fine as they are. Don't touch them.

---

## How the work is split

Tasks 4a and 4b are long, unrelated and don't touch the repo, so they run **in parallel as two background subagents**. You are the **orchestrator**. You are also the only one who edits the portfolio repo.

```
you ──┬─ spawn Agent A (Capgemini film)  ───────────────┐
      ├─ spawn Agent B (Configuration Studio film) ──┐  │
      ├─ site work: §3 T1–T4 (logo, names, video     │  │
      │  component, derogation film live)            │  │
      ├─ review each film when its report arrives ◄──┴──┘   (fix requests via SendMessage)
      ├─ §3 T5: encode and place both films on the cards
      └─ §4 QA → commit → push → verify the live deploy
```

### Step 0: do this first, in this order
1. The Ben Salem Automation logo Amine supplied is `bs  automation logo.jpg` (note the **two spaces**) in the repo root, with an identical copy in `C:\Users\amine\Downloads\`. It's a 200×200 JPEG on white: a black gear with a `</>` code symbol and a small circuit node. Move it to `assets/ben-salem-automation-src.jpg` (`git mv` isn't needed; it's untracked). It is the only source. **Never redraw, trace or upscale it.**
2. Add `_work/` to `.gitignore`. Agent A clones into it.
3. Create `C:\Users\amine\Desktop\portfolio-videos\`. This is the video workspace root. It's on purpose **outside OneDrive**: renders produce tens of thousands of frames that must not sync.
4. Spawn both agents with the **Agent** tool: `subagent_type: "general-purpose"`, `run_in_background: true`, no worktree. Use this prompt, swapping in A or B:

   > You are **Video Agent A**. Read `C:\Users\amine\OneDrive\Desktop\Portfolio\PORTFOLIO_PROMPT_V3.md`: §1 (shared facts and rules), §5 (style bible) and §6 (Brief A). Do only Brief A. You can't ask Amine anything: when a choice is yours, decide, write it to `DECISIONS.md` in your workspace, and keep going. Stop early only on a real blocker, and report what you tried. Never fake footage or invent features. End with the report your brief describes.

   For Agent B, say **Video Agent B**, **§7 (Brief B)**.
5. Start §3 T1–T4 while they work. When your part is done and the agents are still running, end your turn with a short status for Amine. You'll be re-invoked when each agent finishes.

---

## §1. Shared facts and rules (orchestrator and both agents)

### Paths and inputs
| What | Where / facts |
| --- | --- |
| Portfolio repo | `C:\Users\amine\OneDrive\Desktop\Portfolio`: Vite + React 19 + TS + GSAP. `origin` = `https://github.com/Med-Amine-Guizani/MedAminePortfolio.git`, branch `main`. A push to `main` deploys through GitHub Actions to `https://med-amine-guizani.github.io/MedAminePortfolio/` |
| Derogation film (finished, Amine's own cut) | `C:\Users\amine\Downloads\derogation-ad-16x9.mp4`: 58 s, 1920×1080, 60 fps, H.264 ~9.8 Mbps, AAC stereo, 74 MB. **Use it as is; don't re-edit it.** It is the style reference for both new films. |
| Configuration Studio recording | `C:\Users\amine\Downloads\Configuration Studio Demo.mp4`: 5:19, 1920×1080, **30 fps, H.264 ~2.2 Mbps** (compressed screen recording), AAC |
| Capgemini app source | `https://github.com/Med-Amine-Guizani/InternShipManagement.git`, default branch **`amine`**. `Backend/`: Spring Boot 3.5, Java 21, PostgreSQL, Gmail via jakarta.mail (`EmailReaderService`), Google Calendar, OpenRouter LLM (`OpenRouterService`), WebSocket chat. `Frontend/`: Angular 18 with SSR. `application.properties` is **not** in the repo. |
| Clone location (Amine asked for it inside the portfolio folder) | `C:\Users\amine\OneDrive\Desktop\Portfolio\_work\InternShipManagement` (gitignored) |
| Video workspaces | `C:\Users\amine\Desktop\portfolio-videos\capgemini-ad\` (A), `...\cognira-ad\` (B), `...\web\` (orchestrator's web encodes) |
| How the derogation film was made | `C:\Users\amine\Desktop\fatma-company-project\prompt-video-tech-stack.md`, a technical playbook: UI-state capture, stateful mocks, Engine A (HTML + Playwright frame renderer) and Engine B (Revideo 0.11, used for the derogation film), music, mix, QA. **Read it before writing code.** Its reference projects under `C:\Users\mohamedamine.guizani\...` are on another machine and don't exist here. |
| Engine A, working code on this machine | `C:\Users\amine\Desktop\fatma-company-project\film\engine\` (`render.mjs`, `runtime.js`, `lib.js`, `director.py`, `assemble.py`, `qa.py`). Copy and adapt it into your workspace. **Never modify that project.** |
| ffmpeg | No system ffmpeg. Run `npm i ffmpeg-static` in your workspace. The copy at `...\fatma-company-project\film\node_modules\ffmpeg-static\ffmpeg.exe` is known to include libx264, libx265, libaom-av1, libvpx-vp9 and libvmaf. |
| Python with faster-whisper, librosa, numpy, edge-tts | `C:\Users\amine\Desktop\fatma-company-project\film\.venv\Scripts\python.exe`. Use it as an interpreter only. If you need more packages, make your own venv. |
| Chrome | `C:/Program Files/Google/Chrome/Application/chrome.exe` (`scripts/shots.mjs` uses it) |
| Installed | Node 24, npm 11, Python 3.14, git |
| **Not installed** | Java, Maven, Docker, PostgreSQL, `gh`, system ffmpeg. Install portable copies into a workspace only if truly needed. No admin installs. |

### Honesty and confidentiality (non-negotiable)
- The v2 honesty rules hold for every on-screen word in the films too. No invented metrics, user counts, outcomes, testimonials, clients or features. The only Cognira numbers are **60% faster delivery of client enhancement requests** and **20% fewer re-renders on large configuration trees**.
- A film may show **only features the real app has**: features in the Capgemini code, or features visible in the Configuration Studio recording. Don't mock a screen that doesn't exist.
- **All people and data are fictional** in the Capgemini mock. `Backend/src/main/resources/data.sql` seeds Amine's real e-mail and phone number: they must never appear in any frame. Don't use the network names (Yassine, Rami…) in the films either.
- **The Configuration Studio recording shows real retailer clients**: tenant logos and names such as Schnucks, Weis, Cub and Meijer, in the tenant picker and in the tenant rail on most screens. A public portfolio must not show them. Mask or replace them in **every** frame: neutral placeholder tiles ("Retailer A / B / C…") drawn in the UI's style, a crop, or a frosted blur. Do the same for any other client-identifying data you find.
- The recording also has **old burned-in caption boxes** from an earlier edit (black boxes with white text, for example "Increase the Comment's Column width to 500" around 2:30 and "Can you Add Profits Per unit column…" around 4:40). Avoid those frames or cover them cleanly.

---

## §2. Orchestrator: reviewing the films

When an agent reports:
- Read its `REPORT.md` and contact sheet, then pull full-size frames at its beat timestamps (`ffmpeg -ss <t> -frames:v 1`) and **look at them yourself**.
- **Phone check:** scale frames to 360 px wide (`scale=360:-1`) and read them. Is the story clear from the big type and the motion alone?
- **Style check:** put frames side by side with the derogation film. Same family?
- **Honesty and confidentiality:** check every on-screen string against its claimed source. Check that no retailer logo or name is visible anywhere in B, and that no real personal data appears in A.
- **Fixes:** use SendMessage to the same agent, which keeps its context. Allow at most two revision rounds, then ship the best version and list the remaining issues for Amine.
- If the code contradicts a claim in `src/data/profile.ts` (for example, Agent A finds no semantic search of past projects), don't change the claim silently. Tell Amine.

---

## §3. Site work (orchestrator only)

### T1. Ben Salem Automation
- `src/data/profile.ts`: set `company: 'Ben Salem Automation'`. Add `logos.bs` with the real intrinsic `width`/`height`. Remove the "no verified logo yet" comment. Note in the header comment that Amine corrected the name on 2026-10-05. Keep the internal id `bs`.
- Update the comment in `src/components/Internships.tsx` and the logos line in `README.md`. Leave the historical `PORTFOLIO_PROMPT.md` alone.
- Process the logo with sharp, which is already a devDependency, from `assets/ben-salem-automation-src.jpg` into `public/logos/ben-salem-automation.webp`:
  - Trim the white margin. The badge is white, so the white background can stay.
  - Keep its native resolution. 200 px covers the largest use: the trio's `logo-md` (about 36 px image height) and the card's `logo-sm` (about 26 px), even at 3× DPR.
  - Check that JPEG artefacts around the black edges don't show; a light quality pass is fine.
- It's a **mark without a wordmark**, so on its own the gear doesn't say who it is. Add a mark-plus-name variant to `LogoBadge`: the mark, then "Ben Salem Automation" set in the badge's name style. Use it wherever this logo appears. Check that the trio still fits at 360 px.

### T2. Names in the network (`src/components/School.tsx`)
- Label five nodes **Yassine, Rami, Mahdi, Ameni, Ghayth**, spelled exactly like that. Spread them around the graph, mostly on the inner and middle rings in different directions. Labels point outward: left-side labels anchor at the end, right-side ones at the start. Every other dot stays anonymous.
- Named nodes are a little larger and filled with brand blue. Each label fades in and rises a few px just after its node pops, inside the existing scrubbed timeline. With reduced motion they're simply visible.
- **Legible on a phone:** at a 360 px viewport the rendered text is at least 12 px. The viewBox is 400 wide, so check the real rendered size. Give labels a white halo (`paint-order: stroke`) so edges never cut through letters. No overlap between labels, the centre node or the SVG edge at 360, 390 and 430 px. Verify with screenshots.
- The SVG is `aria-hidden`, so also put the names in visually hidden text in the figure for screen readers. The visible caption stays as it is.

### T3. A reusable `AdVideo` component (`src/components/AdVideo.tsx` plus a small preload queue in `src/lib/`)
Behaviour:
- **Markup:** `<video muted playsInline loop preload="none">` inside a wrapper with `aspect-ratio: 16/9`, so nothing shifts when it loads. Rounded corners and shadow come from the existing tokens, and it needs to look right in both white and navy chapters. Give it an `aria-label` that names the film.
- **Source choice:** the first that `canPlayType` accepts: AV1 MP4, then H.264 MP4. Read the exact `codecs=` strings from the encoded files; don't guess.
- **Preload, as Amine asked:** on the visitor's **first scroll** (passive, once), warm the videos **one at a time in page order**: Capgemini, then Configuration Studio, then Derogation. If the visitor hasn't scrolled 4 s after load, start then. Warm with `fetch` into a Blob and object URL so it works on iOS Safari, which ignores `preload`. If a video comes into view before its blob is ready, abort that fetch and stream the network URL directly. Revoke object URLs on unmount.
- **Save-Data or a slow connection** (`navigator.connection.saveData`, or `effectiveType` is 2g or slow-2g): no warm-up. Show the poster and load the video only when it's near the viewport.
- **Posters:** a lightweight WebP. Set the `poster` attribute only when the video is within about 2 viewports, so posters don't compete with the hero on first load.
- **Play/pause:** play when at least 50% visible, pause when not, and resume where it stopped. Pause on `visibilitychange` to hidden. On a stacked internship card, a video plays **only while its card is the top card**: pause it as the next card slides over it. Hook into the existing ScrollTrigger timeline in `Internships.tsx`.
- **Autoplay refused** (iOS Low Power Mode, browser policy): catch the `play()` rejection and show a clear play button.
- **Sound:** a 44×44 px toggle in the corner ("Turn sound on" / "Turn sound off", `aria-pressed`), readable on any frame. Unmuting one film mutes the others. Tapping the video toggles play/pause with a brief state icon.
- **Reduced motion:** no autoplay. Show the poster and a play button.
- Must not break Lenis smooth scroll, GSAP pins or the path drawing (`data-path` and `data-path-hole` logic in `Path.tsx`).

### T4. The derogation film, live now
- Encode it as described in **Web encodes** below. Put it in `src/components/Avocarbon.tsx`, in the `.how` block **right after the platform kicker** ("The Derogation Management Platform · Live in production") and before the "How I work" title. It runs full width of `.wrap` on a phone.
- Add a short honest caption, for example: *"The platform in under a minute. I made this product film too."*
- Keep the film's data in `profile.ts`, which stays the single source of truth: `avocarbon.video = { slug, title, duration }`.

### T5. The internship cards (once A and B deliver)
- Add `video?: { slug; title; duration }` to the `Internship` type and set it for `capgemini` and `cognira`.
- **Capgemini card:** the film replaces the `ShipFlow` visual. Delete `ShipFlow` and its CSS if nothing else uses them.
- **Cognira card:** the film sits on top, with the two verified metrics (`Metrics`) kept in a compact row beneath it.
- Re-check the sticky stacking at 360×740, 390×844, 430×932 and 1440×900: cards are taller now. `topOf()` already handles cards taller than the screen; make sure nothing is cut off and the stack still feels good.

### Web encodes (all three films get the same treatment, in `...\portfolio-videos\web\`)
A 16:9 film on a phone is about 340–400 CSS px wide, which is about 1,000–1,200 device px at 3× DPR. **1280×720 is the right size.** Put the outputs in `public/videos/`, with slugs `derogation`, `capgemini` and `configuration-studio`:

| File | Settings |
| --- | --- |
| `<slug>.av1.mp4` | 1280×720, `libaom-av1 -crf 30–36 -b:v 0 -cpu-used 4 -row-mt 1 -tiles 2x1`, yuv420p, AAC 128 kbps, `-movflags +faststart` |
| `<slug>.h264.mp4` | 1280×720, `libx264 -profile:v high -preset slow -crf 21–25`, yuv420p, AAC 128 kbps, `-movflags +faststart` |
| `<slug>.webp` | Poster, 1280×720, ≤ 120 KB. Use a strong, meaningful frame, never a black or blank one. |

- **Quality gate:** VMAF (libvmaf) against the master scaled to 1280×720 must average **≥ 93**. Choose the highest CRF (smallest file) that passes.
- **Size budget per 60 s:** AV1 **≤ 8 MB**, H.264 **≤ 14 MB**. Keep 60 fps if it fits the budget at VMAF ≥ 93; otherwise use 30 fps. Use the same rule for all three films.
- Record the final settings, sizes and VMAF scores in `public/videos/README.md`.
- **Never commit a master or a frame folder.**

---

## §4. QA, commit, push

**QA** (look at the screenshots yourself, don't just generate them):
- `npm run build` passes (strict `tsc` plus `vite build`).
- `npm run preview`, then `node scripts/shots.mjs http://localhost:4174/MedAminePortfolio/ shots/<mode> <mode>` for `phone`, `phone360`, `phone430`, `desktop` and `reduced`.
- Scripted checks (puppeteer-core, already installed; add Playwright WebKit with iPhone emulation if it runs here):
  - Before any scroll, **zero video bytes** are requested.
  - After the first scroll, the warm-up fetches go out one at a time, in page order.
  - In view, a video plays (`currentTime` advances). Out of view, or on a covered card, it's paused.
  - The Save-Data path works: override `navigator.connection` in an init script.
  - The reduced-motion path works.
  - If Windows WebKit can't decode the codecs, test the logic paths and say so plainly.
- No layout shift from the video slots. The hero's largest paint is no slower than before (posters are deferred).
- The network names and the Ben Salem badge read cleanly at 360 px.

**Commit and push:**
- `git status`. Make sure nothing from `_work/`, `shots/`, masters or frames is staged. Commit the site changes, `public/videos/*` and this prompt file on `main`, then `git push origin main`.
- **Verify the deploy.** There's no `gh` CLI, so poll `https://api.github.com/repos/Med-Amine-Guizani/MedAminePortfolio/actions/runs?per_page=1` about every 60 s until it reaches `completed` / `success`, for at most 15 min. Then `curl -sI` the live page and every video URL: expect 200, `video/mp4` and the right length. Also run `curl -r 0-1023` to confirm range requests return 206.
- If the deploy fails, read the run's logs through the API, fix the problem, and push again.

**Final report to Amine:**
- What changed.
- The live URL.
- Both new film masters in `Downloads`.
- Video sizes and VMAF scores.
- What was masked in the Configuration Studio film, and why.
- Every decision he might want to revisit.

---

## §5. Style bible: the derogation film (both agents)

Study the film yourself before you design anything. Make a contact sheet at 1 frame/s. Pull full-res frames of the type, the cursor ring, the floating cards and the lockup. Transcribe it with faster-whisper to see whether it has a voice-over: **if it has none, don't add one.** What Amine's film does:

| Time (approx.) | Beat |
| --- | --- |
| 0–5 s | **Hook: the problem as chaos.** Deep royal-blue gradient stage. Envelopes, spreadsheet pages and red pill tags ("WHO APPROVED THIS?", "v3_FINAL_final.xlsx", "Re: Fwd: derogation?", "MISSING SIGNATURE", "OVERDUE", "LOST IN INBOX") drift in 3D depth with depth-of-field blur. A big white word, "Deviations", becomes "Deviations happen. / Chaos doesn't have to.", the second line in a lighter blue, with the words swapping through a mask and blur. |
| 5–10 s | **Reveal.** Product mark (white "D" tile), company name and product name. The app window flies in on a 3D perspective tilt with a soft shadow, settles flat, and the camera pushes into the form. |
| 10–30 s | **Walkthrough on crisp UI.** A stepper (Identification → Deviation → Risk & measure → Duration & actions → People concerned) fills with check marks. Values are typed in and autocomplete menus open. A cursor with an **orange ring and ripple** marks every click. The camera pulls back to show the page, then pushes into the next detail. |
| 30–45 s | **Workflow.** Approve and Refuse buttons, Approved and Pending chips, a versioned validated record. "My actions" task cards, with a "Nearing expiry · 7 days left" notification lifting out of the UI as a floating card. A dashboard with stacked bars per region, and KPI tiles that lift off the page. |
| 45–52 s | **Montage.** Several windows tilted in depth (dashboard, PDF export) with parallax. |
| 52–58 s | **Lockup.** Product icon, company name, "Derogation **Manager**" (accent word in the accent colour), "Every deviation, under control." The company logo sits in a thin ring, followed by a closing line. |

**Constants:**
- The company logo stays as a bug in a white pill, top-left, throughout.
- Blue and white everywhere, with one warm accent reserved for the cursor ring, primary buttons and one word in the headline.
- Soft bokeh shapes in the background. Real shadows under floating UI.
- An ease-out-heavy curve (the playbook's brand curve is `cubic-bezier(.16,.84,.24,1)`).
- Music-driven pacing.

### Rules for the new films
- **No hard cuts, ever.** Every change of shot is a continuous move:
  - a camera push or pull, or a whip pan with motion blur;
  - a window flying, tilting or flipping;
  - a scale-through into an element;
  - a mask or morph wipe, or a match on shape or colour.
  - Check it automatically: compute the mean absolute difference between consecutive frames on 160×90 greyscale thumbnails. Look at every spike above about 18 that isn't explained by motion, and list the results in the report.
- **Built for a phone screen.** The film plays about 1/5 of its size.
  - Headlines and kinetic type: ≥ 110 px font size in the 1080p frame. Secondary lines: ≥ 64 px.
  - Any UI detail meant to be read is pushed in until its text is ≥ 48 px tall in frame. Hold every line you want read for ≥ 1.2 s.
  - The story must make sense **with the sound off and the small text unreadable**: big type and motion carry it.
  - Keep key content inside the central 90%.
- **Crisp.** Never upscale a bitmap past 1:1 device pixels. Capture at high DPI so push-ins stay sharp.
- **Format.**
  - 40–60 s long, 1920×1080, **60 fps**.
  - Master in H.264 at CRF ≤ 16 with AAC 48 kHz, integrated loudness −14 LUFS and true peak ≤ −1 dBTP.
  - Music under the Mixkit Stock Music Free License (playbook §8), credited in `CREDITS.md`. Subtle synthesized whooshes and clicks are fine.
- **Branding.** Each film uses its own company's logo bug and lockup, in the same visual language. The stage stays deep blue so it sits well on the blue-and-white site. Take the accent from the product's own UI.
- **Engine.** Engine A (HTML + Playwright) is the default because it works on this machine without workarounds. Use Engine B (Revideo) only if you need what it gives you and you apply the playbook's Windows workarounds. Keep render workers ≤ 6 so the machine stays usable.

---

## §6. Brief A: the Capgemini Engineering internship app film

**Workspace:** `C:\Users\amine\Desktop\portfolio-videos\capgemini-ad\`. The app clone lives at `C:\Users\amine\OneDrive\Desktop\Portfolio\_work\InternShipManagement`. Touch nothing else in the portfolio repo.

1. **Clone:** `git clone -b amine https://github.com/Med-Amine-Guizani/InternShipManagement.git "C:\Users\amine\OneDrive\Desktop\Portfolio\_work\InternShipManagement"`. Record `git status`. **Never commit or push to that repo.** Keep any local tweak minimal and list it in `DECISIONS.md`.
2. **Understand the real flows** from the code, before anything else. Write `FLOW-NOTES.md`: each screen, what it does, which backend endpoints it calls, and the request/response shapes (from the DTOs and Angular services). Cover:
   - applications arriving by e-mail;
   - resume parsing;
   - LLM scoring of the fit;
   - interview scheduling;
   - acceptance;
   - intern onboarding (the welcome modal steps);
   - subject proposals with LLM review;
   - approved subjects, supervisors, meetings and meeting requests;
   - the journal;
   - the messenger;
   - suggestions;
   - archive.
   The portfolio claims "an LLM reads each application and scores the fit, and semantic search finds similar past projects". Report whether the code really does both.
3. **Run the frontend on a stateful mock; don't run the real backend.** Follow playbook §1 and §4:
   - Run the Angular dev server unchanged.
   - Answer every backend call from the mock with Playwright `page.route`, and the chat with `page.routeWebSocket`.
   - Block all other traffic except fonts.
   - If Node 24 is refused by Angular 18's CLI, use a portable Node 22 in the workspace.
   - Stand up the real Spring backend (portable JDK 21, plus PostgreSQL or H2) **only** if a key screen truly can't be mocked. Never connect it to Gmail, Google or OpenRouter.
4. **Mock data:** a believable, fully fictional cast.
   - About 10–14 applicants with varied names (not the network names, not real people), fictional e-mails on `example.com`-style domains, and fictional resumes.
   - LLM scores and rationales that read like real output of the app's own prompt.
   - Supervisors, subjects and meetings.
   - **Nothing from `data.sql`'s real personal data.** Document it in `FIXTURE-NOTES.md`.
5. **Capture UI states**, not screen video (playbook §1 and §4). One high-DPI screenshot per meaningful state, at a viewport around 1440×900 and `deviceScaleFactor: 3`, with `states.json` holding cursor targets and element boxes. Cover the journey of **one applicant, end to end**: arrives by e-mail → AI fit score → interview → accepted → onboarding → subject and supervisor → meetings and journal → archived. Add supporting beats only where they serve the story.
6. **Storyboard** (`STORYBOARD.md`, with beats and timings) in the derogation film's arc:
   - **Hook:** the internship chaos (CVs piling up in an inbox, spreadsheets, "Who's supervising this intern?"-style tags). Keep it generic; no invented numbers.
   - **Reveal**, then the **one-applicant journey**.
   - **Lockup:** the product name as the app's UI shows it (or "Internship Management Platform" if it has none), the Capgemini Engineering logo (`Portfolio\public\logos\capgemini.svg`) and a small "Internship project · 2025".
7. **Build, render, self-QA** (playbook §11):
   - stills you read yourself;
   - OCR for typos;
   - the hard-cut check;
   - a 360 px-wide phone-legibility pass;
   - loudness.
8. **Deliver:**
   - **master** → `C:\Users\amine\Downloads\capgemini-internship-ad-16x9.mp4` (and a copy in `out/`);
   - `out/contact-sheet.png` (1 frame/s);
   - `out/poster-candidates/` (3 full-res PNGs with timestamps);
   - `REPORT.md`: duration; beat list with timestamps; **every on-screen string with its source** (code file or `profile.ts`); the claim check from step 2; music credit; hard-cut check results; known issues.

   Your final message summarises `REPORT.md` and gives these paths.

---

## §7. Brief B: the Cognira Configuration Studio film

**Workspace:** `C:\Users\amine\Desktop\portfolio-videos\cognira-ad\`. There is no source code. The only input is `C:\Users\amine\Downloads\Configuration Studio Demo.mp4`. Touch nothing in the portfolio repo.

1. **Understand the footage** and write `FOOTAGE-LOG.md`:
   - Make contact sheets every 2 s and pull full-res frames where things change.
   - Transcribe the audio with faster-whisper: is there narration, or only music?
   - Log each feature shown, with timestamps.
   - Grade each segment: clean, or has burned captions, cursor jitter or loading states.
   - List every **confidentiality hit** (§1).
   - My quick pass suggests the recording shows the following. Verify each item yourself:
     - account creation / sign-in ("Multi-tenant config, one workspace");
     - the tenant context picker;
     - the configuration catalogue (Table Configurations, Advanced Search Metrics, Calendar, Charts, Client Config, Custom Headers, Feature Flags, Forecast Metrics, Fund Metrics, Group Buttons, Group Search, Hierarchies, Metadata, Offer Types, Promo Triggers, Slot Forecasts);
     - the Global Table Repository;
     - grid column configuration with a live preview grid;
     - change history and propagation to other tenants;
     - the **Configuration Agent**: a natural-language request becomes visible tool steps, then applied changes. Example: widen the Comment column to 500, or add a "Profit per unit" number column after the base-sale-unit column;
     - the Custom Header Repository;
     - the field/form editor with a date picker and display conditions;
     - a JSON view.
2. **Confidentiality pass, before any creative work:**
   - Build a mask track: per-segment rectangles, keyframed if the UI scrolls. It replaces every retailer logo and name with neutral placeholder tiles drawn in the UI's own style, or crops or frosts them.
   - Check that it holds on every frame: sample densely, then read the samples yourself.
   - Remove or cover the burned-in caption boxes.
3. **Quality ceiling.** The footage is a compressed 1080p30 recording.
   - Pick the sharpest frames (highest Laplacian variance) for holds and deep push-ins, and animate the camera over those stills.
   - Keep push-ins on moving footage to ≤ 1.4×.
   - Give the film life with 3D window tilts, parallax, speed ramps and floating cards lifted from the UI.
   - Never jump-cut inside the footage: bridge every gap with a camera move or a transition from §5.
   - You may re-set a typed agent request as crisp kinetic type **only with the exact words visible in the footage**.
4. **Storyboard** (`STORYBOARD.md`) in the derogation film's arc:
   - **Hook:** the problem, said generically. Every client wants its screens configured differently, and changes queue up as tickets. No invented specifics.
   - **Reveal:** Configuration Studio.
   - **Middle:**
     - the catalogue;
     - live grid configuration with preview;
     - the **AI agent making a change while the human stays in charge** (show the review and apply step);
     - change history and propagation across tenants (masked);
     - the form editor.
   - **Lockup:** "Configuration Studio" with the Cognira logo (`Portfolio\public\logos\cognira.svg`), plus at most the verified line "60% faster delivery of client enhancement requests" and a small "Final-year project · 2026".
5. **Build, render, self-QA** as in Brief A step 7. Add a dense confidentiality re-check on the **final render**.
6. **Deliver:**
   - **master** → `C:\Users\amine\Downloads\configuration-studio-ad-16x9.mp4` (and a copy in `out/`);
   - `out/contact-sheet.png`;
   - `out/poster-candidates/`;
   - `REPORT.md`: as in Brief A, plus the mask list (what was hidden, where and how) and which source timestamps each beat uses.

   Your final message summarises it and gives the paths.
