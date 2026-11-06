# Island 2050: Project Plan

> Web Programming Final Project · Solo · Theme: UN Sustainable Development Goals (SDGs)
> Progress demo: **2026-11-27** (needs ≥ 50% done + page drafts) · Final deadline: **2026-12-18**

This is the master plan. Decisions, progress, and problems are tracked in [`project-log/`](project-log/).

---

## 1. Concept

You are the newly elected leader of **Penglai**, a fictional island inspired by Taiwan, in the year 2026.
Every term (2 years) you pass policies with a limited budget. Then the world responds: typhoons,
droughts, energy price spikes and protests. Your citizens react to what you did. Their faces are the
creator's own face, so the game feels personal. Elections happen every 4 years, and if your approval
falls too low you are voted out. In 2050 you get a **report card** showing how well the island did on
six SDGs, plus one of several endings.

**Core message:** sustainability is a set of *tradeoffs*. The economy, the environment and
people's happiness pull in different directions. Players feel this by making the choices themselves
instead of reading about it.

### Why a game instead of an info site
- Most sustainability sites are pages of facts. A simulation makes players *experience* cause and effect.
- It is a stronger showcase of programming: state management, a simulation engine, data-driven content.
- It is easy to present: the audience can watch a live playthrough.

### Why fictional instead of literally Taiwan
- We can tune the numbers so the game stays fun and balanced without pretending to be an accurate model of Taiwan.
- The **Learn** page connects every policy to *real* Taiwan and world data, so the game stays tied to reality.

---

## 2. SDGs covered

| SDG | Name | How the game measures it |
|---|---|---|
| 6 | Clean Water & Sanitation | Water reserves |
| 7 | Affordable & Clean Energy | Renewable share of energy |
| 8 | Decent Work & Economic Growth | Economy index |
| 11 | Sustainable Cities & Communities | Disaster resilience + air quality |
| 13 | Climate Action | Emissions (lower = better) + resilience |
| 14/15 | Life Below Water / On Land | Ecosystem health |

---

## 3. Tech stack

| Part | Choice | Why |
|---|---|---|
| Framework | **React + Vite** (JavaScript) | A game has a lot of changing state, which React handles well. Vite is fast and simple. |
| Routing | React Router | Real multi-page site (helps the "scale" score) |
| Styling | Plain CSS with CSS variables | Easy to read and explain, no framework magic |
| Animation | Framer Motion | Meters, cards, pop-ups, island features appearing |
| Charts | Recharts | Stats-over-time chart on the results page |
| Saving | localStorage (phase 1) → Supabase (phase 2) | Phase 2: global leaderboard + "what % of players chose X" |
| Hosting | Vercel or Netlify (free) | Live URL for the presentation |

The creator had not learned React before this project. React parts were built with AI help; the
code is heavily commented so it can be understood and explained.

---

## 4. Sitemap

```
/               Home: hero with animated island, pitch, how it works, SDGs at stake
/play/setup     Setup: name your island, choose difficulty, meet your advisor
/play           Game: the main dashboard (core of the project)
/play/results   2050 report card: ending, SDG scores, charts, decision timeline
/learn          Policy encyclopedia: each policy + real-world Taiwan/world context
/sdgs           The 6 SDGs in the game and how each is measured
/hall           Hall of Islands: past runs (local now, global leaderboard later)
/about          About the creator, motivation, sources, credits
```

---

## 5. Game design

### Turn structure
- 2026 → 2050, **1 turn = 2 years, 12 turns** (~8–10 min per playthrough, short enough to demo live).
- Each turn: **Plan** (pick up to 2 policies within budget) → **Event** (something happens, sometimes with a choice) → **Report** (stat changes + citizen reactions) → next turn.
- **Elections** every 4 years (2030, 2034, … 2046). Approval < 35% means you are voted out (an early ending).
- Climate pressure grows over time: events get more severe in later years.

### Stats (internal, 0–100)
Economy (GDP), Approval, Emissions (lower is better), Renewable %, Water reserves, Air quality,
Ecosystem health, Disaster resilience, plus **Budget** in $M.

### Policies
Each policy is a card with: up-front cost, upkeep per term (or income, e.g. a carbon tax), build time,
instant effects, effects when finished, ongoing effects per term, and requirements.

Demo set (9): Offshore Wind Farm · Rooftop Solar Subsidy · Phase Out Coal · Carbon Tax ·
MRT Expansion · Chip Fab Expansion · Wetland & Mangrove Restoration · Water Recycling Plants · Sea Wall

Final set (~15) adds candidates such as: EV subsidy, green building code, nuclear restart referendum,
fishing quotas, smart agriculture, affordable housing, reforestation, battery storage.

### Events
Demo set (8): Typhoon · Drought (fabs vs farms, based on Taiwan's 2021 drought) · Heatwave ·
Energy price spike · Youth climate march · Tech boom · Fish stock collapse · Quiet year

Final set (~12) adds candidates such as: earthquake, international climate summit, sea level warning,
factory relocation offer, air pollution crisis.

### Citizens (with the creator's face)
| Id | Persona | Cares about |
|---|---|---|
| ahhai | Ah-Hai, fisherman | Ecosystem |
| mei | Mei, university student | Climate, air |
| wei | Wei, factory worker | Jobs / economy |
| lin | Grandma Lin, rice farmer | Water, land |
| kai | Kai, chip engineer | Economy, tech |
| advisor | Chief Advisor (narrator) | — |

Each needs 3 photos: `happy`, `neutral`, `angry` → **18 photos total** (5 citizens + advisor).
Put them in `public/citizens/` named like `mei-happy.jpg`. Until then, illustrated placeholders are shown.

### Story
- **Chapter 1 – The Inauguration** (2026): the advisor introduces the island and the stakes.
- **Chapter 2 – The Turning Point** (2036): text changes based on how you are doing.
- **Epilogue** (2050): your ending.

### Endings
Green Haven · Balanced Future · Rich but Burning · Sinking Island · Struggling Island · Voted Out

### Engine architecture
- All content (policies, events, citizens, endings) lives in **data files** in `src/game/`.
- The simulation is plain JavaScript functions in `src/game/engine.js`, separate from React.
  React only *displays* the state.
- Adding content means adding data, not rewriting code. This makes the game easy to balance and expand.

---

## 6. Game screen wireframe

```
┌────────────────────────────────────────────────────────────────┐
│ ISLAND 2050    2032–2033 (Term 4/12)   💰 $340M   👍 62%   🗳  │
├──────────────────────────────────┬─────────────────────────────┤
│                                  │  SDG SCORES                 │
│        [ ISLAND MAP — SVG ]      │  7  Energy   ████████░░     │
│   turbines appear, smog fades,   │  13 Climate  █████░░░░░     │
│   city grows, reservoir shrinks  │  11 Cities   ██████░░░░     │
│                                  │  6  Water    ███████░░░     │
│                                  │  8  Economy  ████████░░     │
│                                  │  14 Ecosys.  ████░░░░░░     │
│                                  │  CITIZENS 😊😐😠😊😐        │
├──────────────────────────────────┴─────────────────────────────┤
│ POLICIES THIS TERM (pick up to 2 within budget)                │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐         │
│ │Offshore│ │Carbon  │ │ MRT    │ │ Fab    │ │Wetland │   …     │
│ │ Wind   │ │ Tax    │ │Expand  │ │Expand  │ │Restore │         │
│ │ $120M  │ │ +$25M  │ │ $100M  │ │ $60M   │ │ $30M   │         │
│ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘         │
│                                        [ END TERM → ]          │
└────────────────────────────────────────────────────────────────┘
  After END TERM: Event modal → Term report (stat changes + citizen faces) → next term
```

Wireframes for the other pages are drawn for the slides (see `project-log/`).

---

## 7. Timeline

| Week | Dates | Goal |
|---|---|---|
| 1 | Nov 5–11 | Setup, design system, routing, all pages as shells, Home finished, island SVG v1 |
| 2 | Nov 12–18 | Game engine, dashboard UI, 9 policies, 8 events, meters, citizen pop-ups (placeholders) |
| 3 | Nov 19–25 | Results page + charts, Setup page, story chapters, partial Learn page, **take citizen photos** |
| — | Nov 26–27 | Slides, rehearse, **submit by Nov 27 23:59** |
| 4 | Nov 28–Dec 4 | All ~15 policies & ~12 events, all endings, balancing |
| 5 | Dec 5–11 | Supabase leaderboard + global stats, SDG page polish, full Learn page, sound, (maybe Chinese) |
| 6 | Dec 12–18 | Playtesting, bug fixes, mobile layout, deploy, **due Dec 18** |

### Definition of "50%" for the Nov 27 demo
- The game is playable from start to finish (smaller content set).
- Finished: Home, Setup, Game, Results, Learn (partial), SDGs.
- Placeholder designs: Hall (local runs only, no global board yet), About.
- Slides show wireframes and the plan for everything not yet built.

---

## 8. Open questions / to decide later
- [ ] Chinese language toggle in the final version? (decide in week 5)
- [ ] Supabase vs Firebase for the global leaderboard
- [ ] Sound effects / music?
- [ ] Final policy & event list
