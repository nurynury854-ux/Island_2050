# Challenges & Difficulties

Problems hit during the project and how they were handled. Write them down even when unsolved;
"what was hard" makes a good presentation slide.

Format: **Problem**, **Why it was hard**, **What we did**, **Status**.

---

### C1: Not knowing React (2026-11-05)
- **Problem:** The best tool for a stateful game (React) wasn't taught in the course.
- **What we did:** Used AI assistance to build the React parts. Kept the game rules in plain JavaScript (`src/game/engine.js`), which I can read and explain. React components are commented. The README has a "how the code is organized" guide.
- **Status:** Ongoing. Learning as we go.

### C2: Making a fictional game feel connected to real SDG data (2026-11-05)
- **Problem:** Game numbers are invented for balance, but the project has to be meaningfully about the SDGs.
- **What we did:** Separated the two: the game uses tuned numbers, and the **Learn** page gives real-world context and sources for every policy. Every real fact is tracked in `sources.md`.
- **Status:** Facts still need final verification (see `sources.md`).

### C3: Game balance (2026-11-05)
- **Problem:** With many interacting stats, some strategies might be too strong or the game might be unwinnable.
- **What we did:** Wrote a script that plays the game automatically, 300 games for each of 4 strategies (do nothing, random, "green first", "money first") on each difficulty.
- **First result:** Too much money. Players ended with ~$1,600M unspent, everyone could buy every policy, and nearly every game ended "Balanced Future". The best ending, "Green Haven", was almost impossible (~0–2%) because water and nature drained too fast.
- **Fix:** Lowered tax income (60 + 1.2×GDP → 35 + 0.9×GDP), raised upkeep costs, slowed the water and ecosystem decline, and adjusted the Green Haven threshold.
- **Result after tuning (Standard difficulty):**

  | Strategy | Avg SDG score | Most common ending |
  |---|---|---|
  | Do nothing | 30 | Voted Out / Rich but Burning |
  | Random | 62 | Balanced Future (Green Haven ~19%) |
  | Green first | 65 | **Green Haven ~61%** |
  | Money first | 59 | Balanced Future |

  Hard difficulty gets voted out more often. Good: choices now matter.
- **Status:** Good enough for v0.1. See C5 for the second round of tuning after adding content.

### C4: Only 9 policies means nothing left to buy late in the game
- **Problem:** By about 2040 a player has enacted every policy, so the last few terms are just "skip".
- **Plan:** Add ~6 more policies in week 4 (EV subsidy, battery storage, nuclear referendum, reforestation, green building code, fishing quotas) and maybe policies that can be upgraded.
- **Fix (2026-11-06):** Added 8 policies (17 total), including two "upgrades" that need an earlier project first (Offshore Wind Phase 2, Battery Storage). After retuning (C5), a player can afford only about 11–14 of the 17, so there's always a choice left and the late game isn't empty.
- **Status:** ✅ Solved.

### C5: More content made the game too easy (2026-11-06)
- **Problem:** After adding 8 policies and 5 events, the balance test showed **Green Haven in 75–99% of games**, even for random play. More policies meant players could push every stat high. Also "money first" won most often, because the chip fab + carbon tax income paid for everything.
- **Second problem we found:** The test bots answered events *randomly*, including spending money they didn't have, so "voted out" looked much higher (up to 41%) than a real player would get. We gave the smarter bots a "sensible" way to answer events (avoid debt, care about approval when it's low) so the numbers are more realistic.
- **Fix:** Tax income 35 + 0.9×GDP → 40 + 0.6×GDP (the economy matters less for income), chip fab income $22M → $12M per term, carbon tax $20M → $12M, Green Haven now needs an average ≥ 70 with every SDG ≥ 45.
- **Result (`npm run balance`, 300 games each, Standard):**

  | Strategy | Avg score | Green Haven | Balanced | Voted out | Policies bought |
  |---|---|---|---|---|---|
  | Do nothing | 32 | 0% | 0% | 0% (Rich but Burning 88%) | 0 |
  | Random | 69 | 43% | 30% | 27% | 12.4 |
  | Green first | 76 | 75% | 19% | 7% | 11.4 |
  | Money first | 76 | 74% | 26% | 0% | 14.6 |
  | Fix weakest SDG | 72 | 49% | 48% | 3% | 11.3 |

  Relaxed: sensible play gets Green Haven 92–100%. Hard: only 18–26%, and 30–35% get voted out.
- **Interesting finding for the presentation:** "money first" does as well as "green first", because its first pick is the **carbon tax**, which then pays for the green projects. Funding the transition matters as much as the projects themselves.
- **Status:** Numbers are fine for now. The real "feel" (length, difficulty) will be judged by playing the finished game, and we'll re-tune then.
