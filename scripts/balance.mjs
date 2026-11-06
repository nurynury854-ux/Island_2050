// ─────────────────────────────────────────────────────────────
//  BALANCE TESTER: plays hundreds of games automatically with
//  different strategies and prints how they end.
//
//  Run:  npm run balance          (300 games per strategy)
//        npm run balance -- 1000  (more games = more accurate)
//
//  Use it after changing any numbers in src/game/ to check that
//  good play still wins, bad play still loses, and Hard is harder.
// ─────────────────────────────────────────────────────────────

import * as E from '../src/game/engine.js';
import { POLICIES } from '../src/game/policies.js';
import { computeSdgScores, overallScore } from '../src/game/sdgs.js';
import { DIFFICULTIES, STAT_INFO } from '../src/game/constants.js';

const GAMES = Number(process.argv[2]) || 300;

/** Picks policies in the given order, as long as they are allowed. */
function pickInOrder(state, ids) {
  const selected = [];
  for (const id of ids) if (E.canEnact(state, id, selected).ok) selected.push(id);
  return selected;
}

const CATEGORY_PRIORITY = { Energy: 0, Nature: 1, Water: 2, Cities: 3, Economy: 4 };
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

// Each strategy: (state) → list of policy ids to enact this term.
const STRATEGIES = {
  'do nothing': () => [],
  random: (s) => pickInOrder(s, shuffle(POLICIES.map((p) => p.id))),
  'green first': (s) =>
    pickInOrder(
      s,
      [...POLICIES].sort((a, b) => CATEGORY_PRIORITY[a.category] - CATEGORY_PRIORITY[b.category] || a.cost - b.cost).map((p) => p.id),
    ),
  'money first': (s) =>
    pickInOrder(
      s,
      [...POLICIES].sort((a, b) => a.upkeep - b.upkeep || (b.onComplete.gdp ?? 0) - (a.onComplete.gdp ?? 0)).map((p) => p.id),
    ),
  // Roughly how a thoughtful player plays: fix the weakest SDG first.
  'fix weakest': (s) => {
    const scores = computeSdgScores(s.stats);
    const need = (p) => Math.max(...p.sdgs.map((id) => 100 - scores[id]));
    return pickInOrder(s, [...POLICIES].sort((a, b) => need(b) - need(a)).map((p) => p.id));
  },
};

// How the bots answer events. "random" answers randomly; the others act like a sensible
// player: avoid going into debt, and care more about approval when it is getting low.
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

function playOne(difficulty, strategy, smart) {
  let s = E.createGame({ difficulty });
  let enacted = 0;
  let emptyLateTerms = 0; // terms in the last third where nothing could be bought
  while (s.phase !== 'ended') {
    if (s.phase === 'chapter') s = E.closeChapter(s);
    const picks = strategy(s);
    if (s.turn >= 8 && POLICIES.every((p) => !E.canEnact(s, p.id, []).ok)) emptyLateTerms++;
    enacted += picks.length;
    s = E.enactPolicies(s, picks);
    const choice = smart ? sensibleChoice(s) : Math.floor(Math.random() * s.pendingEvent.choices.length);
    s = E.resolveEvent(s, choice);
    s = E.nextTurn(s);
  }
  return { ending: s.ending, overall: overallScore(s.stats), budget: s.budget, enacted, emptyLateTerms };
}

const pct = (n) => `${Math.round((n / GAMES) * 100)}%`.padStart(4);
const ENDING_SHORT = {
  greenHaven: 'Green',
  balancedFuture: 'Balanced',
  richButBurning: 'Rich&Burn',
  sinkingIsland: 'Sinking',
  strugglingIsland: 'Struggling',
  votedOut: 'VotedOut',
};

console.log(`\nIsland 2050 balance test: ${GAMES} games per row\n`);
for (const difficulty of Object.keys(DIFFICULTIES)) {
  console.log(`── ${DIFFICULTIES[difficulty].label} ──`);
  console.log(
    'strategy'.padEnd(13) +
      'score'.padStart(6) +
      Object.values(ENDING_SHORT).map((e) => e.padStart(11)).join('') +
      '  policies  $left  emptyLate',
  );
  for (const [name, strategy] of Object.entries(STRATEGIES)) {
    const results = Array.from({ length: GAMES }, () => playOne(difficulty, strategy, name !== 'random'));
    const avg = (key) => results.reduce((sum, r) => sum + r[key], 0) / GAMES;
    const counts = Object.fromEntries(Object.keys(ENDING_SHORT).map((k) => [k, results.filter((r) => r.ending === k).length]));
    console.log(
      name.padEnd(13) +
        String(Math.round(avg('overall'))).padStart(6) +
        Object.keys(ENDING_SHORT).map((k) => pct(counts[k]).padStart(11)).join('') +
        String(avg('enacted').toFixed(1)).padStart(10) +
        String(Math.round(avg('budget'))).padStart(7) +
        String(avg('emptyLateTerms').toFixed(1)).padStart(11),
    );
  }
  console.log('');
}
