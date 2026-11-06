// ─────────────────────────────────────────────────────────────
//  Game-wide settings. Change numbers here to tune the game.
// ─────────────────────────────────────────────────────────────

export const START_YEAR = 2026;
export const YEARS_PER_TURN = 2;
export const TOTAL_TURNS = 12; // 2026 → 2050
export const MAX_POLICIES_PER_TURN = 2; // "political capital" per term
export const ELECTION_EVERY = 2; // turns → an election every 4 years
export const VOTE_OUT_THRESHOLD = 35; // approval below this at an election = game over
export const TURNING_POINT_TURN = 5; // Chapter 2 starts at the beginning of this turn (2036)

export const DEFAULT_ISLAND_NAME = 'Penglai';

export const DIFFICULTIES = {
  relaxed: {
    label: 'Relaxed',
    blurb: 'More money, gentler storms. Good for a first try.',
    startBudget: 420,
    incomeMult: 1.2,
    eventSeverity: 0.75,
  },
  standard: {
    label: 'Standard',
    blurb: 'The intended experience. Tough but fair.',
    startBudget: 320,
    incomeMult: 1,
    eventSeverity: 1,
  },
  hard: {
    label: 'Hard',
    blurb: 'Tight budget, brutal climate. For experienced leaders.',
    startBudget: 240,
    incomeMult: 0.85,
    eventSeverity: 1.35,
  },
};

// Starting values for every stat (0–100 scale).
export const START_STATS = {
  gdp: 50,
  approval: 60,
  emissions: 70, // higher = worse
  renewable: 10, // % of energy from renewables
  water: 65,
  airQuality: 45,
  ecosystem: 50,
  resilience: 35,
};

// How each stat is shown on screen.
// goodWhenHigh tells the UI whether going up is good (green) or bad (red).
export const STAT_INFO = {
  gdp: { label: 'Economy', icon: '📈', goodWhenHigh: true },
  approval: { label: 'Approval', icon: '👍', goodWhenHigh: true, unit: '%' },
  emissions: { label: 'Emissions', icon: '🏭', goodWhenHigh: false },
  renewable: { label: 'Renewables', icon: '🔋', goodWhenHigh: true, unit: '%' },
  water: { label: 'Water', icon: '💧', goodWhenHigh: true },
  airQuality: { label: 'Air quality', icon: '🌬️', goodWhenHigh: true },
  ecosystem: { label: 'Ecosystem', icon: '🐟', goodWhenHigh: true },
  resilience: { label: 'Resilience', icon: '🛡️', goodWhenHigh: true },
  budget: { label: 'Budget', icon: '💰', goodWhenHigh: true, money: true },
};

export const yearOfTurn = (turn) => START_YEAR + turn * YEARS_PER_TURN;
export const termLabel = (turn) => `${yearOfTurn(turn)}–${yearOfTurn(turn) + YEARS_PER_TURN - 1}`;
export const isElectionTurn = (turn) =>
  (turn + 1) % ELECTION_EVERY === 0 && turn + 1 < TOTAL_TURNS;
