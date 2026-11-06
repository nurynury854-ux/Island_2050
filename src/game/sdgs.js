// ─────────────────────────────────────────────────────────────
//  The six SDGs the game tracks, and how each score is calculated
//  from the island's stats. Each score is 0–100.
//  Colors are the official UN SDG colors.
// ─────────────────────────────────────────────────────────────

const clamp = (n) => Math.max(0, Math.min(100, n));

export const SDGS = [
  {
    id: 'sdg7',
    number: '7',
    short: 'Energy',
    name: 'Affordable & Clean Energy',
    color: '#FCC30B',
    measuredBy: 'Share of energy from renewables (80% or more = full score).',
    why: 'Most of an island’s emissions come from burning coal and gas for electricity. Clean energy is the foundation of almost every other goal.',
    score: (s) => clamp(s.renewable * 1.25),
  },
  {
    id: 'sdg13',
    number: '13',
    short: 'Climate',
    name: 'Climate Action',
    color: '#3F7E44',
    measuredBy: 'Low emissions (70%) plus readiness for climate disasters (30%).',
    why: 'Climate action means two things: cutting emissions so things don’t get worse, and adapting to the changes that are already coming.',
    score: (s) => clamp((100 - s.emissions) * 0.7 + s.resilience * 0.3),
  },
  {
    id: 'sdg11',
    number: '11',
    short: 'Cities',
    name: 'Sustainable Cities & Communities',
    color: '#FD9D24',
    measuredBy: 'Disaster resilience (50%) plus air quality (50%).',
    why: 'Most people live in cities. A sustainable city is one that is safe from storms and floods, and has air you can breathe.',
    score: (s) => clamp(s.resilience * 0.5 + s.airQuality * 0.5),
  },
  {
    id: 'sdg6',
    number: '6',
    short: 'Water',
    name: 'Clean Water & Sanitation',
    color: '#26BDE2',
    measuredBy: 'Water reserves.',
    why: 'Islands can’t import rivers. Farms, homes and factories all compete for the same rain, and droughts are getting worse.',
    score: (s) => clamp(s.water),
  },
  {
    id: 'sdg8',
    number: '8',
    short: 'Economy',
    name: 'Decent Work & Economic Growth',
    color: '#A21942',
    measuredBy: 'The economy index.',
    why: 'Sustainability isn’t only about nature. People need jobs and income, and a broke government can’t pay for green projects.',
    score: (s) => clamp(s.gdp),
  },
  {
    id: 'sdg14',
    number: '14·15',
    short: 'Nature',
    name: 'Life Below Water & On Land',
    color: '#0A97D9',
    measuredBy: 'Ecosystem health: fish stocks, wetlands, forests.',
    why: 'An island’s fishermen, farmers and tourists all depend on healthy oceans and land, and so does its protection from storms.',
    score: (s) => clamp(s.ecosystem),
  },
];

export function computeSdgScores(stats) {
  const scores = {};
  for (const sdg of SDGS) scores[sdg.id] = Math.round(sdg.score(stats));
  return scores;
}

export function overallScore(stats) {
  const scores = Object.values(computeSdgScores(stats));
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}
