// The three versions of the island used by the Home page hero and the presentation:
// today, 2050 if we act, and 2050 if we don't.
import { START_STATS } from './constants.js';
import { POLICIES } from './policies.js';

const allBuilt = Object.fromEntries(POLICIES.map((p) => [p.id, 'done']));
export const SCENES = [
  {
    id: 'today',
    label: '2026 · Today',
    caption: 'Coal smoke, a shrinking reservoir, and typhoons that get stronger every year.',
    stats: START_STATS,
    features: {},
  },
  {
    id: 'act',
    label: '2050 · If we act',
    caption: 'Wind in the strait, clean air over the city, and wetlands that hold back the sea.',
    stats: { gdp: 74, approval: 66, emissions: 20, renewable: 72, water: 62, airQuality: 85, ecosystem: 78, resilience: 72 },
    features: allBuilt,
  },
  {
    id: 'neglect',
    label: '2050 · If we don’t',
    caption: 'Thick smog, a dry reservoir, dying forests and flooded coasts.',
    stats: { gdp: 66, approval: 30, emissions: 96, renewable: 10, water: 12, airQuality: 8, ecosystem: 16, resilience: 12 },
    features: {},
  },
];
