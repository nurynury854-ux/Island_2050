// ─────────────────────────────────────────────────────────────
//  The people of the island. Each citizen's mood is calculated
//  from the stats they care about.
//
//  PHOTOS: put files in /public/citizens/ named `<id>-<mood>.jpg`
//  (e.g. mei-happy.jpg). Until a photo exists, the emoji
//  placeholder below is shown instead.
// ─────────────────────────────────────────────────────────────

export const CITIZENS = {
  advisor: {
    id: 'advisor',
    name: 'Your Chief Advisor', // ← change to your own name if you like
    role: 'Chief Advisor',
    emoji: '🧑‍💼',
    color: '#12415a',
    mood: () => 'neutral',
  },
  ahhai: {
    id: 'ahhai',
    name: 'Ah-Hai',
    role: 'Fisherman',
    emoji: '🎣',
    color: '#1d7a8c',
    cares: 'healthy seas',
    mood: (s) => s.ecosystem,
  },
  mei: {
    id: 'mei',
    name: 'Mei',
    role: 'University student',
    emoji: '🎒',
    color: '#3f9b5a',
    cares: 'the climate & clean air',
    mood: (s) => (100 - s.emissions + s.airQuality) / 2,
  },
  wei: {
    id: 'wei',
    name: 'Wei',
    role: 'Factory worker',
    emoji: '👷',
    color: '#c2702d',
    cares: 'jobs & wages',
    mood: (s) => s.gdp,
  },
  lin: {
    id: 'lin',
    name: 'Grandma Lin',
    role: 'Rice farmer',
    emoji: '👵',
    color: '#8a6d3b',
    cares: 'water & land',
    mood: (s) => (s.water * 2 + s.ecosystem) / 3,
  },
  kai: {
    id: 'kai',
    name: 'Kai',
    role: 'Chip engineer',
    emoji: '💻',
    color: '#5b5fc7',
    cares: 'the economy & tech',
    mood: (s) => (s.gdp * 2 + s.renewable) / 3,
  },
};

// The everyday citizens (everyone except the advisor), in display order.
export const CITIZEN_IDS = ['ahhai', 'mei', 'wei', 'lin', 'kai'];

/** Turns a citizen's 0–100 satisfaction into 'happy' | 'neutral' | 'angry'. */
export function citizenMood(citizenId, stats) {
  const c = CITIZENS[citizenId];
  const value = typeof c.mood === 'function' ? c.mood(stats) : 50;
  if (typeof value === 'string') return value;
  if (value >= 60) return 'happy';
  if (value >= 38) return 'neutral';
  return 'angry';
}
