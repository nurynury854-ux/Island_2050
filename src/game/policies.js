// ─────────────────────────────────────────────────────────────
//  POLICIES: the cards the player can choose each term.
//
//  Every policy can be enacted once. Fields:
//    cost        one-time price in $M when enacted
//    upkeep      $M per term once finished (negative = it EARNS money)
//    buildTime   terms before it is finished (0 = finished at end of this term)
//    instant     stat changes the moment you enact it (usually public reaction)
//    onComplete  stat changes once, when construction finishes
//    perTurn     stat changes every term after it is finished
//    requires    optional { check(stats, state) → true/false, reason }
//    reactions   which citizens comment when you enact it
//    learn       text for the Learn page (real-world context)
//
//  To add a new policy: copy one block, change the id and numbers.
//  (If you want it to appear on the island map, also add a
//   drawing for it in src/components/IslandMap.jsx.)
// ─────────────────────────────────────────────────────────────

export const POLICIES = [
  {
    id: 'offshoreWind',
    name: 'Offshore Wind Farm',
    icon: '🌬️',
    category: 'Energy',
    sdgs: ['sdg7', 'sdg13'],
    cost: 120,
    upkeep: 8,
    buildTime: 2,
    description: 'Build turbines in the strait. Slow and expensive, but a huge source of clean power.',
    instant: { approval: 2 },
    onComplete: { renewable: 20, emissions: -15, ecosystem: -3 },
    perTurn: { renewable: 1.5 },
    reactions: [
      { citizen: 'kai', mood: 'happy', text: 'Stable green power? Chip customers abroad are going to love this.' },
      { citizen: 'ahhai', mood: 'neutral', text: 'Those turbines better not scare away my fish…' },
    ],
    learn: {
      summary: 'Wind turbines built at sea, where winds are stronger and steadier than on land.',
      realWorld:
        'The Taiwan Strait has some of the best offshore wind conditions in the world. Formosa 1, Taiwan’s first commercial offshore wind farm, began full operation in 2019, and offshore wind is a core part of Taiwan’s net-zero plan.',
      tradeoff: 'Takes years to build and costs a lot up front. Construction can disturb marine life and fishing grounds.',
    },
  },
  {
    id: 'solar',
    name: 'Rooftop Solar Subsidy',
    icon: '☀️',
    category: 'Energy',
    sdgs: ['sdg7'],
    cost: 50,
    upkeep: 8,
    buildTime: 0,
    description: 'Pay families and businesses to put solar panels on their roofs.',
    instant: { approval: 3 },
    onComplete: { renewable: 8, emissions: -5 },
    perTurn: { renewable: 1.5 },
    reactions: [{ citizen: 'lin', mood: 'happy', text: 'My farmhouse roof makes money now! Who knew?' }],
    learn: {
      summary: 'Subsidies make it cheaper for ordinary people to install solar panels on their own buildings.',
      realWorld:
        'Taiwan has used feed-in tariffs (guaranteed prices for solar electricity) to encourage rooftop solar on homes, factories and schools. Rooftops avoid using up scarce farmland.',
      tradeoff: 'Solar only works when the sun shines. Without storage, it can’t fully replace power plants.',
    },
  },
  {
    id: 'coalPhaseOut',
    name: 'Phase Out Coal',
    icon: '🏭',
    category: 'Energy',
    sdgs: ['sdg13', 'sdg11'],
    cost: 40,
    upkeep: 0,
    buildTime: 1,
    description: 'Shut down the old coal power plant. Big climate win, but jobs will be lost.',
    instant: { approval: -5 },
    onComplete: { emissions: -22, airQuality: 15, gdp: -4 },
    perTurn: {},
    requires: {
      check: (stats) => stats.renewable >= 30,
      reason: 'Needs at least 30% renewables, or the lights go out.',
    },
    reactions: [
      { citizen: 'wei', mood: 'angry', text: 'Thirty years I worked at that plant. What am I supposed to do now?' },
      { citizen: 'mei', mood: 'happy', text: 'Finally! I can see the mountains from campus again.' },
    ],
    learn: {
      summary: 'Closing coal power plants, the single biggest source of carbon emissions and air pollution in many countries.',
      realWorld:
        'Taichung Power Plant is one of the largest coal-fired power plants in the world, and air pollution in central Taiwan has long been a public concern. Phasing out coal is part of Taiwan’s 2050 net-zero pathway.',
      tradeoff: 'Coal plants employ many workers, and closing them before enough clean power exists risks blackouts. A “just transition” means retraining those workers.',
    },
  },
  {
    id: 'carbonTax',
    name: 'Carbon Tax',
    icon: '💸',
    category: 'Economy',
    sdgs: ['sdg13'],
    cost: 0,
    upkeep: -20,
    buildTime: 0,
    description: 'Make polluters pay for every ton of CO₂. Earns money every term, but nobody likes new taxes.',
    instant: { approval: -8 },
    onComplete: { emissions: -8, gdp: -2 },
    perTurn: { emissions: -1 },
    reactions: [
      { citizen: 'wei', mood: 'angry', text: 'The factory says the tax means no raises this year. Thanks a lot.' },
      { citizen: 'mei', mood: 'happy', text: 'Polluters paying for pollution. That’s only fair.' },
    ],
    learn: {
      summary: 'A fee on each ton of greenhouse gas a company emits, so polluting costs money and clean options become cheaper by comparison.',
      realWorld:
        'Taiwan introduced a carbon fee for its largest emitters, starting with 2025 emissions. Many countries, including Sweden, Canada and the EU members, put a price on carbon.',
      tradeoff: 'Raises costs for businesses and consumers and is usually unpopular, though the money can fund green projects.',
    },
  },
  {
    id: 'mrt',
    name: 'MRT Expansion',
    icon: '🚇',
    category: 'Cities',
    sdgs: ['sdg11', 'sdg13'],
    cost: 100,
    upkeep: 10,
    buildTime: 1,
    description: 'Extend the metro so people can leave their scooters and cars at home.',
    instant: { approval: 2 },
    onComplete: { emissions: -6, airQuality: 8, approval: 4, gdp: 2 },
    perTurn: { airQuality: 0.5 },
    reactions: [{ citizen: 'mei', mood: 'happy', text: 'No more 40-minute scooter rides in the rain to get to class!' }],
    learn: {
      summary: 'Public transport moves many more people per unit of energy than private cars and scooters.',
      realWorld:
        'Taipei Metro opened in 1996 and is known as one of Asia’s most reliable metro systems. Cities around Taiwan, including Kaohsiung and Taichung, have since built their own.',
      tradeoff: 'Very expensive to build and maintain, and it only helps if the network goes where people actually need to go.',
    },
  },
  {
    id: 'fab',
    name: 'Chip Fab Expansion',
    icon: '🔬',
    category: 'Economy',
    sdgs: ['sdg8'],
    cost: 60,
    upkeep: -22,
    buildTime: 1,
    description: 'Give incentives for a new semiconductor factory. Huge for the economy, but it drinks a lot of water.',
    instant: { approval: 3 },
    onComplete: { gdp: 12, approval: 3 },
    perTurn: { water: -3, emissions: 1 },
    reactions: [
      { citizen: 'kai', mood: 'happy', text: 'A new fab means my whole team gets promoted. Let’s go!' },
      { citizen: 'lin', mood: 'angry', text: 'Where is the water for my rice going to come from now?' },
    ],
    learn: {
      summary: 'Semiconductor fabs make the chips inside phones, cars and computers, and they bring high-paying jobs.',
      realWorld:
        'Taiwan makes most of the world’s most advanced chips. Chip fabs use huge amounts of ultra-pure water and electricity. During the 2021 drought, water for the fabs became a national issue.',
      tradeoff: 'Big economic boost, but more pressure on water and energy, two things an island has in limited supply.',
    },
  },
  {
    id: 'wetland',
    name: 'Wetland & Mangrove Restoration',
    icon: '🌿',
    category: 'Nature',
    sdgs: ['sdg14', 'sdg11'],
    cost: 30,
    upkeep: 3,
    buildTime: 1,
    description: 'Bring back coastal wetlands. Nature’s own storm barrier and a nursery for fish.',
    instant: {},
    onComplete: { ecosystem: 12, resilience: 8 },
    perTurn: { ecosystem: 1 },
    reactions: [{ citizen: 'ahhai', mood: 'happy', text: 'The crabs are back near the river mouth. That’s a good sign.' }],
    learn: {
      summary: 'Restoring wetlands and mangrove forests along the coast, which absorb storm waves and shelter young fish.',
      realWorld:
        'Taiwan passed a Wetland Conservation Act, and places like the Tamsui River mangrove reserve protect coastal habitats. Scientists call this kind of protection a “nature-based solution”.',
      tradeoff: 'Cheap and good for nature, but uses coastal land that developers or farmers might want.',
    },
  },
  {
    id: 'waterRecycling',
    name: 'Water Recycling Plants',
    icon: '💧',
    category: 'Water',
    sdgs: ['sdg6'],
    cost: 70,
    upkeep: 8,
    buildTime: 1,
    description: 'Clean used water so factories can reuse it instead of using fresh water from reservoirs.',
    instant: {},
    onComplete: { water: 15 },
    perTurn: { water: 2 },
    reactions: [{ citizen: 'lin', mood: 'happy', text: 'If the factories use recycled water, maybe there’s enough left for us farmers.' }],
    learn: {
      summary: 'Treating wastewater until it is clean enough to reuse, especially for industry.',
      realWorld:
        'Taiwan has built reclaimed-water plants, such as Fengshan in Kaohsiung, that supply treated water to industrial parks, which reduces pressure on reservoirs.',
      tradeoff: 'Costs money and energy to run, but makes the island far less vulnerable to droughts.',
    },
  },
  {
    id: 'seaWall',
    name: 'Sea Wall',
    icon: '🧱',
    category: 'Cities',
    sdgs: ['sdg11'],
    cost: 90,
    upkeep: 5,
    buildTime: 1,
    description: 'A concrete barrier protecting the capital from storm surges and rising seas.',
    instant: { approval: 1 },
    onComplete: { resilience: 18, ecosystem: -5 },
    perTurn: {},
    reactions: [{ citizen: 'ahhai', mood: 'neutral', text: 'Safer, sure. But I can’t see the sea from my house anymore.' }],
    learn: {
      summary: 'Hard engineering that blocks waves and flooding from reaching the coast.',
      realWorld:
        'Much of Taiwan’s coastline is already lined with concrete sea walls and tetrapods. They protect towns but can destroy beaches and habitats, so planners increasingly combine them with wetlands.',
      tradeoff: 'Strong, fast protection for people, but bad for coastal ecosystems.',
    },
  },
];

export const POLICY_BY_ID = Object.fromEntries(POLICIES.map((p) => [p.id, p]));
