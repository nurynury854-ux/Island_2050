# Decision Log

Newest at the bottom. Format: **what** was decided, **alternatives** considered, **why**.

---

### D1: Project type: interactive simulation game (2026-11-05)
- **Decided:** Build "Island 2050", a turn-based island management sim with a storyline.
- **Alternatives:** (a) "The Commons", a live multiplayer overfishing game (SDG 14); (b) "Born Elsewhere", a branching life story based on where you're born (SDG 1/4/5/10); (c) "Thread", a scroll-driven story of a T-shirt's life (SDG 12); (d) a regular info site or carbon calculator.
- **Why:** It combines a game and a story (the two directions I was most interested in). It's uncommon compared to typical info sites (creativity). Content can grow easily (scale). It covers several SDGs at once, and it's the safest option to have half-finished by the Nov 27 demo. Multiplayer was considered too risky to debug alone in 3 weeks.

### D2: Fictional island inspired by Taiwan (2026-11-05)
- **Decided:** The island is fictional ("Penglai", from 蓬萊, an old poetic name associated with Taiwan). The **Learn** page links each policy to real Taiwan and world facts.
- **Alternatives:** Literally simulate Taiwan.
- **Why:** A fictional island lets us tune numbers so the game is fun and balanced without claiming to be an accurate model of a real country. The Taiwan inspiration keeps it relatable for the class.

### D3: Tech stack: React + Vite (2026-11-05)
- **Decided:** React (JavaScript) + Vite + React Router + Framer Motion + Recharts. Plain CSS.
- **Alternatives:** Plain HTML/CSS/JS (what was taught in class); Vue.
- **Why:** A game has a lot of changing state (stats, budget, turn, modals), and React keeps the screen in sync with it automatically. I hadn't learned React, so these parts are built with AI assistance and are heavily commented. Plain CSS was kept so the styling stays easy to understand and change.

### D4: Solo project (2026-11-05)
- **Decided:** Work alone.
- **Effect on plan:** Scope is controlled. Multiplayer was dropped, and a global leaderboard was moved to phase 2.

### D5: 1 turn = 2 years, 12 turns (2026-11-05)
- **Alternatives:** 1 turn = 1 year (24 turns).
- **Why:** 24 turns would take too long to play, especially in a 5–10 minute presentation. 12 turns gives a full playthrough in about 8–10 minutes. It's one constant in the code, so it can be changed.

### D6: Citizens use my own face (2026-11-05)
- **Decided:** The 5 citizen personas and the narrator advisor will use photos of me in different outfits and expressions (happy / neutral / angry).
- **Why:** It makes the game personal and memorable, and it's a fun moment in the presentation. Illustrated placeholders are used until the photos are taken.

### D7: Language: English only for now (2026-11-05)
- **Decided:** English for the demo. A Chinese toggle may be added in the final version (decide in week 5).
- **Why:** Bilingual support doubles the text work. Better to finish the content first.

### D8: Content lives in data files, logic in a separate engine (2026-11-05)
- **Decided:** Policies, events, citizens and endings are JavaScript data files in `src/game/`. The simulation rules are plain functions in `src/game/engine.js`, separate from React.
- **Why:** New policies and events can be added without touching the game logic, which makes balancing easy. It also makes the code easier to explain: "the engine is the rules, React is the screen".

### D9: Max 2 policies per term (2026-11-05)
- **Why:** Without a limit, a rich player could buy everything at once and there'd be no real choice. The limit represents "political capital": a government can only pass so many big laws per term.

### D10: Elections every 4 years can end the game early (2026-11-05)
- **Decided:** If approval is under 35% at an election (2030, 2034, … 2046), you're voted out.
- **Why:** Without this, a player could ignore people completely and only chase SDG numbers. The real lesson is that sustainable policy needs public support.

### D11: Island map drawn in SVG code, not images (2026-11-05)
- **Decided:** The island is drawn with SVG shapes in `IslandMap.jsx` instead of image files.
- **Why:** It can change smoothly with every stat (smog, reservoir size, number of buildings), so players *see* the consequences of their choices. It also shows more programming than pasting in pictures.

### D12: Include nuclear power, with neutral framing (2026-11-06)
- **Decided:** Add a "Nuclear Restart Referendum" policy. Its Learn entry presents the pros (steady, low-carbon power) and cons (earthquake risk, waste, cost) equally, and citizens disagree with each other (Kai for, Grandma Lin against).
- **Alternatives:** Leave it out, or replace it with geothermal.
- **Why:** It's one of the most real and debated energy tradeoffs in Taiwan. The game doesn't pick a side. Nuclear helps climate (SDG 13) but doesn't count as *renewable* (SDG 7), which is a real nuance.

### D13: Laptops and desktops only (2026-11-06)
- **Decided:** Optimize for laptop and desktop screens (1280×720 up to 1920×1080). No mobile menu or phone-specific work.
- **Why:** The game is a dashboard with many panels, the presentation is on a computer, and the time is better spent on content.

### D14: First-game tutorial (2026-11-06)
- **Decided:** A 6-step "spotlight" tour of the game screen that appears the first time someone plays and can be reopened with "How to play".
- **Why:** New players (and the class watching the demo) shouldn't have to work out what budget, approval and SDG scores mean by themselves.

### D15: Real playtesting only on the finished product (2026-11-06)
- **Decided:** Keep balancing with the automated script while building. The creator judges length and difficulty by playing the finished version, and then we adjust.

### D16: The presentation lives inside the website (2026-11-08)
- **Decided:** The Nov 27 slides are a page of the site (`/present`), not Canva or PowerPoint. The submission is a link to it.
- **Alternatives:** Canva / Google Slides; a slides library like reveal.js.
- **Why:** Slides can use the real components (the animated island, SDG data, live counts of policies and events), the live demo is one click away, and everything shares one design. A small custom deck (`src/pages/Present.jsx`) was preferred over a library: the slides are data (`src/presentation/slides.jsx`), like the rest of the content, and there's nothing extra to explain.
- **Demo:** a button loads a prepared "demo island" in 2034 (`src/game/demo.js`) so the live demo starts mid-game instead of on an empty 2026 map. It is built the same way every time.
