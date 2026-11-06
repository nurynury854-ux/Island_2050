// ─────────────────────────────────────────────────────────────
//  STORY: the chapters between eras, and the endings.
//  `{island}` is replaced with the player's island name.
// ─────────────────────────────────────────────────────────────

export const CHAPTERS = {
  inauguration: {
    kicker: 'Chapter 1',
    title: 'The Inauguration',
    lines: [
      'Congratulations, Leader. The people of {island} have chosen you.',
      'The island is doing well for now. Factories hum and the cities are growing. But most of our power still comes from burning coal, the reservoirs drop a little lower every summer, and the typhoons keep getting stronger.',
      'The world has agreed on goals for a sustainable future. You have until 2050 to show that {island} can meet them without leaving its people behind.',
      'Every two years you can pass up to two major policies. Choose carefully: every choice has a cost, and the people will judge you at each election.',
    ],
  },
  // Chapter 2 depends on how well the player is doing.
  turningPoint: {
    kicker: 'Chapter 2',
    title: 'The Turning Point',
    good: [
      'It’s 2036. Ten years in, {island} is becoming a model for the region. Delegations from other islands come to study your policies.',
      'But the second half will be harder: the climate keeps changing no matter what one island does. Stay the course.',
    ],
    mixed: [
      'It’s 2036. Ten years in, {island} is holding on, but only just. For every step forward there has been a step back.',
      'Scientists say the choices of the next decade will decide the island’s future. There is still time to change direction.',
    ],
    bad: [
      'It’s 2036. Ten years in, {island} is in trouble. The air is thick, the reservoirs are shallow, and people are losing faith.',
      'Your advisors are blunt: if nothing changes, the 2050 your citizens inherit will be a hard one. It’s not too late, but it’s close.',
    ],
  },
};

export const ENDINGS = [
  {
    id: 'votedOut',
    icon: '🗳️',
    title: 'Voted Out',
    color: '#7a7f87',
    text: 'The people of {island} have chosen a new leader. Sustainable change only works if you bring people along with you. Policies that nobody supports don’t last.',
  },
  {
    id: 'greenHaven',
    icon: '🌏',
    title: 'Green Haven',
    color: '#3f9b5a',
    text: 'In 2050, {island} runs on clean energy, its reefs are recovering, and its cities stood firm through the storms. Other nations now ask how a small island did it. Your answer: one hard choice at a time.',
  },
  {
    id: 'richButBurning',
    icon: '💰',
    title: 'Rich but Burning',
    color: '#e0603f',
    text: '{island} is wealthy. The chips sell, the towers rise. But the summers are unbearable, the air is grey, and every typhoon season brings new damage. Growth was bought with the future.',
  },
  {
    id: 'sinkingIsland',
    icon: '🌊',
    title: 'Sinking Island',
    color: '#12415a',
    text: 'The seas rose and the storms grew, and {island} wasn’t ready. Coastal towns have been abandoned. The children of 2050 ask why nobody acted when there was still time.',
  },
  {
    id: 'balancedFuture',
    icon: '⚖️',
    title: 'Balanced Future',
    color: '#f4b740',
    text: '{island} isn’t perfect, but it’s better. Cleaner power, steadier water, and an economy that still works. You didn’t win every battle, but you left the island more prepared than you found it.',
  },
  {
    id: 'strugglingIsland',
    icon: '🌫️',
    title: 'Struggling Island',
    color: '#8a6d3b',
    text: '{island} made it to 2050, but it is tired. Water is rationed, the air is heavy, and the economy sputters. The goals were within reach, and the island didn’t quite reach them.',
  },
];

export const ENDING_BY_ID = Object.fromEntries(ENDINGS.map((e) => [e.id, e]));

export const fillIsland = (text, island) => text.replaceAll('{island}', island);
