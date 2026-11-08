# Dev Log

Newest entry at the top.

---

## 2026-11-08 · Session 3: Wireframes

**Done**
- **GitHub:** the project is pushed (`main` and `phase-2`). Vercel still needs to be connected.
- **Wireframes** for all 8 pages in `docs/wireframes/`: one HTML file (`index.html`) and 10 slide-ready PNGs (16:9) in `png/`.
  The set is a site map, Home, Setup, Game (dashboard + the turn loop step by step), Results, Learn, SDGs, Hall and About.
  Each has numbered notes. Coral dashed boxes mark what is still planned (global leaderboard, "% of players chose X",
  source links, About text). `render.sh` regenerates the PNGs after a change.
- Removed an outdated banner on the Learn page that still said EV subsidies, battery storage, nuclear and
  reforestation were "coming" (they were added in session 2).

**Next**
- Connect Vercel to the GitHub repo to get a live URL.
- Slides for Nov 27 (the wireframe PNGs go straight in).
- Me: verify ⚠️ facts in `sources.md`, write the About page.

---

## 2026-11-06 · Session 2: Phase 2, depth and polish

**Plan:** wrote the phase 2 plan (content, balance, tutorial, deploy, then demo deliverables). Decided: laptop/desktop only,
include nuclear with neutral framing, deploy with GitHub + Vercel, and judge the real feel on the finished product.

**Done**
- **Git:** project is now under version control (branch `phase-2`), one commit per step.
- **Content:** 9 → **17 policies** (battery storage, offshore wind phase 2, EV & e-scooter subsidy, nuclear referendum,
  reforestation, green building code, fishing quotas, smart irrigation) and 8 → **13 events** (earthquake, air pollution
  crisis, world climate summit, giant factory offer, sea level warning). Fishing quotas now prevent fish stock collapses.
- **Map:** drawings for every new policy (second wind farm, nuclear dome, batteries, young forest, green roofs, protected
  fishing zone with buoys, irrigation channels), plus **rice paddies** that turn brown in a drought.
- **Policy tray:** category filter tabs with counts; cards you can't afford are sorted to the end.
- **Balance:** `npm run balance` is now part of the project. The new content made the game too easy, so it was retuned (`challenges.md` C5).
- **Tutorial:** a 6-step spotlight tour on the first game, reopened from "How to play".
- **HUD:** shows the next election year.
- **Deploy prep:** `vercel.json` added.

**Tested:** full playthroughs in headless Chrome at 1280×720 and 1920×1080, with no errors, all 17 cards showing, and new events appearing.

**Next**
- Push to GitHub and connect Vercel (needs my GitHub repo URL).
- Wireframes for all pages → `docs/wireframes/`
- Slides for Nov 27.
- Me: verify ⚠️ facts in `sources.md`, write the About page.

---

## 2026-11-05 · Session 1: Idea, plan, and base website

**Planning**
- Brainstormed 4 ideas and picked **Island 2050** (see `decisions.md` D1).
- Decided: solo, fictional Taiwan-inspired island ("Penglai"), React + Vite, English only for now, my face for the citizens.
- Wrote the master plan (`docs/PLAN.md`) and set up this project log.

**Built (base version, v0.1)**
- Project setup: React + Vite + React Router + Framer Motion + Recharts.
- Design system: ocean/sand/leaf color palette, Fraunces + DM Sans fonts, buttons, cards, SDG chips.
- **Game engine** (`src/game/engine.js`): 12 terms (2026→2050), budget & taxes, upkeep, construction delays,
  weighted random events that get worse over time, natural "drift" (economy grows, water and nature decline),
  approval, elections every 4 years, 6 endings.
- **Content:** 9 policies, 8 events (some with 2–3 choices), 5 citizens + advisor, 2 story chapters, 6 endings.
- **Island map:** hand-coded SVG that reacts to the game: wind turbines spin, coal smoke, smog over the city,
  the reservoir shrinks, the forest thins, the city grows, MRT line, sea wall, wetlands, floods.
- **Pages (8 + 404):**
  - Home ✅ (hero with "2026 / 2050 if we act / 2050 if we don't" island animation)
  - Setup ✅ · Game ✅ · Results ✅ (report card, chart over time, decision timeline, share)
  - Learn ✅ partial (9 policies with real-world context; sources still to verify)
  - SDGs ✅ · Hall of Islands 🟡 (local results only) · About 🟡 (draft, needs my own words)
- Saves automatically to the browser; finished games appear in the Hall.

**Tested**
- An automated balance test played 300 games for each strategy and difficulty (see `challenges.md` C3).
- Played a full game in a real browser (headless Chrome) from start to results: no errors, no horizontal scrolling on mobile.

**Next**
- Play it myself and note what I like or dislike.
- Take the citizen photos (6 people × 3 expressions = 18 photos).
- Fill in the About page in my own words.
- Draw/screenshot wireframes for the slides.
- Week 2–3 goals in PLAN.md.
