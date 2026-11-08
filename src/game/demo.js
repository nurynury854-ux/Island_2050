// ─────────────────────────────────────────────────────────────
//  DEMO ISLAND for the presentation.
//
//  Plays the first few terms automatically (like the balance bots
//  in scripts/balance.mjs) so the live demo can start in 2034 with
//  projects already built, instead of an empty 2026 map.
//
//  Events are random, so while the demo is being built we swap
//  Math.random for a "seeded" random. The same seed always gives
//  the same events, so the demo island is identical every time.
// ─────────────────────────────────────────────────────────────

import * as E from './engine.js';
import { STAT_INFO } from './constants.js';

const DEMO_SEED = 2050;
export const DEMO_TURN = 4; // stop at the start of 2034–2035 (term 5 of 12)

// What the demo "player" passes in each of the first four terms. Kept small on purpose,
// so there is still money in 2034 to buy something live. Chip fab and nuclear are left
// out: they're the interesting tradeoffs to pick in front of the class.
const DEMO_PLAN = [['carbonTax', 'solar'], ['offshoreWind'], ['wetland'], ['mrt']];

// The finished 2050 demo is a separate game that buys in this order every term.
const DEMO_PRIORITY = [
  'carbonTax',
  'solar',
  'offshoreWind',
  'wetland',
  'mrt',
  'waterRecycling',
  'batteryStorage',
  'coalPhaseOut',
  'reforestation',
  'evSubsidy',
  'offshoreWind2',
  'greenBuilding',
  'smartIrrigation',
  'fishingQuota',
  'seaWall',
];

/** A small random number generator that always gives the same numbers for the same seed (mulberry32). */
function seededRandom(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The policies the demo player passes this term (as long as they are allowed). */
function pickPolicies(state, finished) {
  const wanted = finished ? DEMO_PRIORITY : DEMO_PLAN[state.turn] ?? DEMO_PRIORITY;
  const selected = [];
  for (const id of wanted) if (E.canEnact(state, id, selected).ok) selected.push(id);
  return selected;
}

/** Answers an event like a sensible player: avoid debt, protect approval when it is low. */
function sensibleChoice(state) {
  const scoreChoice = ({ effects }) => {
    let score = 0;
    for (const [key, value] of Object.entries(effects)) {
      if (key === 'budget') continue;
      score += STAT_INFO[key].goodWhenHigh ? value : -value;
    }
    score += (effects.approval ?? 0) * (state.stats.approval < 45 ? 3 : 0.5);
    const budgetAfter = state.budget + (state.pendingEvent.base.budget ?? 0) + (effects.budget ?? 0);
    score += budgetAfter < 0 ? -30 : (effects.budget ?? 0) * 0.05;
    return score;
  };
  const scores = state.pendingEvent.choices.map(scoreChoice);
  return scores.indexOf(Math.max(...scores));
}

/**
 * Builds the demo game.
 *   finished = false → stops in 2034, ready for the presenter to plan the next term
 *   finished = true  → plays all the way to 2050 (for showing the report card)
 */
export function createDemoGame({ finished = false } = {}) {
  const realRandom = Math.random;
  Math.random = seededRandom(DEMO_SEED);
  try {
    let s = E.createGame({ islandName: 'Penglai', difficulty: 'standard' });
    // A fixed start time gives the finished demo a fixed id, so it only appears once in the Hall.
    s = { ...s, startedAt: Date.UTC(2026, 10, 27) };

    while (s.phase !== 'ended') {
      if (s.phase === 'chapter') s = E.closeChapter(s);
      if (!finished && s.turn >= DEMO_TURN) break;
      s = E.enactPolicies(s, pickPolicies(s, finished));
      s = E.resolveEvent(s, sensibleChoice(s));
      s = E.nextTurn(s);
    }
    return s;
  } finally {
    Math.random = realRandom;
  }
}
