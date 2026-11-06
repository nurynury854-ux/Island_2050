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
- **Status:** Good enough for the demo. Once there are more policies than you can afford (final version), re-run the test. Also playtest with real people in week 6.

### C4: Only 9 policies means nothing left to buy late in the game
- **Problem:** By about 2040 a player has enacted every policy, so the last few terms are just "skip".
- **Plan:** Add ~6 more policies in week 4 (EV subsidy, battery storage, nuclear referendum, reforestation, green building code, fishing quotas) and maybe policies that can be upgraded.
- **Status:** Open.
