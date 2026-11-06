// ─────────────────────────────────────────────────────────────
//  THE GAME ENGINE: the rules of the simulation.
//
//  This file is plain JavaScript with no React. Every function takes
//  the current game state and returns a NEW state (it never
//  changes the old one). React then shows whatever state we give it.
//
//  One term (turn) goes like this:
//    1. planning  → player picks up to 2 policies → enactPolicies()
//    2. event     → something happens, player chooses → resolveEvent()
//                   (this also runs the end-of-term simulation)
//    3. report    → player reads what changed → nextTurn()
// ─────────────────────────────────────────────────────────────

import {
  DIFFICULTIES,
  START_STATS,
  TOTAL_TURNS,
  MAX_POLICIES_PER_TURN,
  VOTE_OUT_THRESHOLD,
  TURNING_POINT_TURN,
  DEFAULT_ISLAND_NAME,
  yearOfTurn,
  termLabel,
  isElectionTurn,
} from './constants.js';
import { POLICIES, POLICY_BY_ID } from './policies.js';
import { EVENTS } from './events.js';
import { computeSdgScores, overallScore } from './sdgs.js';

const SAVE_VERSION = 1;
const clamp = (n) => Math.max(0, Math.min(100, n));

// ── Helpers ──────────────────────────────────────────────────

/** Adds a set of effects (e.g. { gdp: 5, budget: -30 }) to stats and budget. */
function applyEffects(stats, budget, effects = {}) {
  const next = { ...stats };
  let nextBudget = budget;
  for (const [key, value] of Object.entries(effects)) {
    if (key === 'budget') nextBudget += value;
    else if (key in next) next[key] = clamp(next[key] + value);
  }
  return { stats: next, budget: nextBudget };
}

function snapshot(state, turn) {
  return {
    turn,
    year: yearOfTurn(turn),
    stats: { ...state.stats },
    budget: Math.round(state.budget),
    sdg: computeSdgScores(state.stats),
    overall: overallScore(state.stats),
  };
}

/** Events get more severe as the years go on (climate change), and with difficulty. */
export function severity(state) {
  return DIFFICULTIES[state.difficulty].eventSeverity * (1 + state.turn * 0.05);
}

/** Money earned per term from taxes, before upkeep. */
function grossIncome(state) {
  return Math.round((40 + state.stats.gdp * 0.6) * DIFFICULTIES[state.difficulty].incomeMult);
}

function totalUpkeep(state) {
  return Object.entries(state.policies)
    .filter(([, p]) => p.done)
    .reduce((sum, [id]) => sum + POLICY_BY_ID[id].upkeep, 0);
}

/** Expected budget change next term (shown in the top bar). */
export function projectedIncome(state) {
  return grossIncome(state) - totalUpkeep(state);
}

// ── Creating a game ──────────────────────────────────────────

export function createGame({ islandName, difficulty = 'standard' } = {}) {
  const state = {
    version: SAVE_VERSION,
    islandName: islandName?.trim() || DEFAULT_ISLAND_NAME,
    difficulty,
    turn: 0,
    phase: 'chapter',
    chapter: 'inauguration',
    budget: DIFFICULTIES[difficulty].startBudget,
    stats: { ...START_STATS },
    policies: {}, // { [policyId]: { enactedTurn, completeTurn, done } }
    turnStart: null,
    enactedThisTurn: [],
    pendingEvent: null,
    report: null,
    history: [],
    timeline: [],
    lastEventId: null,
    ending: null,
    startedAt: Date.now(),
    endedAt: null,
  };
  state.history.push(snapshot(state, 0));
  return state;
}

export function isValidSave(state) {
  return state && state.version === SAVE_VERSION && typeof state.turn === 'number';
}

/** Closes the story chapter screen and starts planning. */
export function closeChapter(state) {
  return { ...state, phase: 'planning', chapter: null };
}

// ── Step 1: planning ─────────────────────────────────────────

/** Can this policy be picked right now? Returns { ok, reason }. */
export function canEnact(state, policyId, alreadySelected = []) {
  const policy = POLICY_BY_ID[policyId];
  if (state.policies[policyId]) return { ok: false, reason: 'Already enacted' };
  if (policy.requires && !policy.requires.check(state.stats, state))
    return { ok: false, reason: policy.requires.reason };

  const selectedCost = alreadySelected
    .filter((id) => id !== policyId)
    .reduce((sum, id) => sum + POLICY_BY_ID[id].cost, 0);
  if (!alreadySelected.includes(policyId)) {
    if (alreadySelected.length >= MAX_POLICIES_PER_TURN)
      return { ok: false, reason: `Max ${MAX_POLICIES_PER_TURN} policies per term` };
    if (selectedCost + policy.cost > state.budget) return { ok: false, reason: 'Not enough budget' };
  }
  return { ok: true };
}

/** Pays for the chosen policies, then draws this term's event. */
export function enactPolicies(state, policyIds) {
  let { stats, budget } = state;
  const policies = { ...state.policies };

  for (const id of policyIds) {
    const p = POLICY_BY_ID[id];
    budget -= p.cost;
    ({ stats, budget } = applyEffects(stats, budget, p.instant));
    policies[id] = { enactedTurn: state.turn, completeTurn: state.turn + p.buildTime, done: false };
  }

  const next = {
    ...state,
    stats,
    budget,
    policies,
    turnStart: { stats: { ...state.stats }, budget: state.budget },
    enactedThisTurn: policyIds,
  };
  next.pendingEvent = drawEvent(next);
  next.phase = 'event';
  return next;
}

// ── Step 2: events ───────────────────────────────────────────

/** Picks a random event (weighted) and turns it into plain data. */
function drawEvent(state) {
  const eligible = EVENTS.filter(
    (e) => e.id !== state.lastEventId && (!e.condition || e.condition(state)),
  );
  const weights = eligible.map((e) => Math.max(0.05, e.weight(state)));
  const total = weights.reduce((a, b) => a + b, 0);
  let roll = Math.random() * total;
  let chosen = eligible[eligible.length - 1];
  for (let i = 0; i < eligible.length; i++) {
    roll -= weights[i];
    if (roll <= 0) {
      chosen = eligible[i];
      break;
    }
  }

  const sev = severity(state);
  return {
    id: chosen.id,
    icon: chosen.icon,
    title: chosen.title(state),
    description: chosen.description(state),
    base: chosen.base(state, sev),
    choices: chosen.choices(state, sev),
    citizen: chosen.citizen(state),
  };
}

/** Applies the event + the player's choice, then simulates the rest of the term. */
export function resolveEvent(state, choiceIndex) {
  const event = state.pendingEvent;
  const choice = event.choices[choiceIndex] ?? event.choices[0];

  let { stats, budget } = applyEffects(state.stats, state.budget, event.base);
  ({ stats, budget } = applyEffects(stats, budget, choice.effects));

  const afterEvent = { ...state, stats, budget };
  const { state: simulated, completed, income, upkeep } = simulateEndOfTerm(afterEvent);

  // Who comments this term: policy reactions first, then the event.
  const reactions = [];
  for (const id of state.enactedThisTurn) {
    const r = POLICY_BY_ID[id].reactions?.[0];
    if (r) reactions.push(r);
  }
  reactions.push(choice.reaction ?? event.citizen);

  let election = null;
  if (isElectionTurn(state.turn)) {
    const approval = Math.round(simulated.stats.approval);
    election = { year: yearOfTurn(state.turn + 1), approval, won: approval >= VOTE_OUT_THRESHOLD };
  }

  return {
    ...simulated,
    phase: 'report',
    pendingEvent: null,
    lastEventId: event.id,
    report: {
      term: termLabel(state.turn),
      before: state.turnStart,
      after: { stats: { ...simulated.stats }, budget: simulated.budget },
      income,
      upkeep,
      completed,
      enacted: state.enactedThisTurn,
      event: { icon: event.icon, title: event.title, choice: choice.label },
      reactions: reactions.slice(0, 3),
      election,
    },
    timeline: [
      ...state.timeline,
      {
        turn: state.turn,
        term: termLabel(state.turn),
        policies: state.enactedThisTurn,
        event: { id: event.id, icon: event.icon, title: event.title, choice: choice.label },
      },
    ],
  };
}

/** The "natural" part of each term: construction, ongoing effects, money, climate drift. */
function simulateEndOfTerm(state) {
  let { stats, budget } = state;
  const policies = { ...state.policies };
  const completed = [];

  // 1. Ongoing effects of projects that were already finished
  for (const [id, p] of Object.entries(policies)) {
    if (p.done) ({ stats, budget } = applyEffects(stats, budget, POLICY_BY_ID[id].perTurn));
  }

  // 2. Projects that finish construction this term
  for (const [id, p] of Object.entries(policies)) {
    if (!p.done && p.completeTurn <= state.turn) {
      policies[id] = { ...p, done: true };
      completed.push(id);
      ({ stats, budget } = applyEffects(stats, budget, POLICY_BY_ID[id].onComplete));
    }
  }

  // 3. Money: taxes in, upkeep out
  const tmp = { ...state, stats, policies };
  const income = grossIncome(tmp);
  const upkeep = totalUpkeep(tmp);
  budget += income - upkeep;

  // 4. Natural drift: the economy grows, the climate gets harsher
  const drift = {
    gdp: 2,
    emissions: 2 * (1 - stats.renewable / 100),
    water: -(1.5 + state.turn * 0.1),
    ecosystem: -1,
    resilience: -1,
    airQuality: (100 - stats.emissions - stats.airQuality) * 0.15, // air slowly follows emissions
  };
  ({ stats, budget } = applyEffects(stats, budget, drift));

  // 5. How people feel about all of this
  const gdpChange = stats.gdp - state.turnStart.stats.gdp;
  let approvalChange = (50 - stats.approval) * 0.1 + gdpChange * 0.3;
  if (budget < 0) approvalChange -= 5;
  if (stats.airQuality < 30) approvalChange -= 2;
  if (stats.water < 25) approvalChange -= 3;
  stats = { ...stats, approval: clamp(stats.approval + approvalChange) };

  return { state: { ...state, stats, budget, policies }, completed, income, upkeep };
}

// ── Step 3: next term ────────────────────────────────────────

export function nextTurn(state) {
  const history = [...state.history, snapshot(state, state.turn + 1)];
  const base = { ...state, history, report: null, enactedThisTurn: [], turnStart: null };

  if (state.report?.election && !state.report.election.won) {
    return { ...base, phase: 'ended', ending: 'votedOut', endedAt: Date.now() };
  }
  if (state.turn + 1 >= TOTAL_TURNS) {
    return { ...base, turn: TOTAL_TURNS, phase: 'ended', ending: determineEnding(state), endedAt: Date.now() };
  }

  const turn = state.turn + 1;
  if (turn === TURNING_POINT_TURN) return { ...base, turn, phase: 'chapter', chapter: 'turningPoint' };
  return { ...base, turn, phase: 'planning' };
}

// ── Endings ──────────────────────────────────────────────────

export function determineEnding(state) {
  const sdg = computeSdgScores(state.stats);
  const overall = overallScore(state.stats);
  if (overall >= 70 && Object.values(sdg).every((v) => v >= 45)) return 'greenHaven';
  if (state.stats.gdp >= 65 && sdg.sdg13 < 40) return 'richButBurning';
  if (state.stats.resilience < 30 && sdg.sdg13 < 45) return 'sinkingIsland';
  if (overall >= 52) return 'balancedFuture';
  return 'strugglingIsland';
}

/** 'good' | 'mixed' | 'bad': which version of Chapter 2 to show. */
export function turningPointMood(state) {
  const overall = overallScore(state.stats);
  if (overall >= 58) return 'good';
  if (overall >= 44) return 'mixed';
  return 'bad';
}

// ── For the island map ───────────────────────────────────────

/** { offshoreWind: 'none' | 'building' | 'done', ... } */
export function islandFeatures(state) {
  const features = {};
  for (const p of POLICIES) {
    const s = state?.policies?.[p.id];
    features[p.id] = !s ? 'none' : s.done ? 'done' : 'building';
  }
  return features;
}

// ── For the Hall of Islands ──────────────────────────────────

export function summarizeRun(state) {
  return {
    id: `${state.startedAt}`,
    islandName: state.islandName,
    difficulty: state.difficulty,
    ending: state.ending,
    overall: overallScore(state.stats),
    sdg: computeSdgScores(state.stats),
    yearReached: yearOfTurn(state.history.at(-1).turn),
    policies: Object.keys(state.policies),
    finishedAt: state.endedAt,
  };
}
