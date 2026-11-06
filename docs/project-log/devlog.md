# Dev Log

Newest entry at the top.

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
