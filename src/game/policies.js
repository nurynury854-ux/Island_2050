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
      check: (stats, state) => stats.renewable >= 30 || Boolean(state.policies.nuclear?.done),
      reason: 'Needs at least 30% renewables (or nuclear power), or the lights go out.',
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
    upkeep: -12,
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
    upkeep: -12,
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

  // ── Added in phase 2 ──────────────────────────────────────

  {
    id: 'batteryStorage',
    name: 'Grid Battery Storage',
    icon: '🔋',
    category: 'Energy',
    sdgs: ['sdg7', 'sdg13'],
    cost: 80,
    upkeep: 6,
    buildTime: 1,
    description: 'Giant batteries that store solar and wind power for the evening and for windless days.',
    instant: { approval: 1 },
    onComplete: { renewable: 10, emissions: -6 },
    perTurn: { renewable: 0.5 },
    requires: {
      check: (stats, state) => Boolean(state.policies.solar?.done || state.policies.offshoreWind?.done),
      reason: 'Needs working solar or wind power to store first.',
    },
    reactions: [{ citizen: 'kai', mood: 'happy', text: 'No more flicker in the fab’s power supply. Batteries are underrated.' }],
    learn: {
      summary: 'Large battery systems connected to the power grid that charge when there is extra clean power and release it later.',
      realWorld:
        'Taiwan has been adding grid-scale battery systems to keep its grid stable as solar grows. Solar output drops every evening, right when electricity demand is still high.',
      tradeoff: 'Batteries are expensive and need minerals like lithium, and mining those has its own environmental and social costs.',
    },
  },
  {
    id: 'offshoreWind2',
    name: 'Offshore Wind Phase 2',
    icon: '🌊',
    category: 'Energy',
    sdgs: ['sdg7', 'sdg13'],
    cost: 140,
    upkeep: 10,
    buildTime: 2,
    description: 'A second, bigger wind farm farther out at sea. Even more clean power, even more cost.',
    instant: { approval: 1 },
    onComplete: { renewable: 18, emissions: -12, ecosystem: -4 },
    perTurn: { renewable: 1 },
    requires: {
      check: (stats, state) => Boolean(state.policies.offshoreWind?.done),
      reason: 'Finish the first offshore wind farm first.',
    },
    reactions: [{ citizen: 'ahhai', mood: 'angry', text: 'Another wind farm? My fishing grounds get smaller every year.' }],
    learn: {
      summary: 'Expanding offshore wind in a later “round”, usually bigger and farther from the coast in deeper water.',
      realWorld:
        'Taiwan plans its offshore wind in several rounds. Later rounds move farther offshore, where the wind is stronger but construction is harder and more expensive.',
      tradeoff: 'Each round is bigger and costs more, and conflicts with fishing grounds, shipping lanes and marine life grow.',
    },
  },
  {
    id: 'evSubsidy',
    name: 'Electric Scooter & EV Subsidy',
    icon: '🛵',
    category: 'Cities',
    sdgs: ['sdg11', 'sdg13'],
    cost: 60,
    upkeep: 8,
    buildTime: 0,
    description: 'Help people trade their petrol scooters and cars for electric ones.',
    instant: { approval: 2 },
    onComplete: { emissions: -5, airQuality: 6 },
    perTurn: { emissions: -1, airQuality: 0.5 },
    reactions: [{ citizen: 'mei', mood: 'happy', text: 'Traded my old two-stroke scooter for an electric one. My lungs say thanks.' }],
    learn: {
      summary: 'Subsidies that make electric scooters and cars cheaper than petrol ones, plus charging and battery-swap stations.',
      realWorld:
        'Taiwan has one of the highest rates of scooter ownership in the world. Electric scooters with battery-swapping stations have become a common sight in its cities.',
      tradeoff: 'Electric vehicles are only as clean as the electricity that charges them. On a coal-heavy grid, the climate benefit is much smaller.',
    },
  },
  {
    id: 'nuclear',
    name: 'Nuclear Restart Referendum',
    icon: '⚛️',
    category: 'Energy',
    sdgs: ['sdg13'],
    cost: 150,
    upkeep: 12,
    buildTime: 2,
    description: 'Let the people vote on restarting the old nuclear plant. Steady low-carbon power, but the island is divided.',
    instant: { approval: -3 },
    onComplete: { emissions: -20, airQuality: 6, gdp: 2 },
    perTurn: {},
    reactions: [
      { citizen: 'kai', mood: 'happy', text: 'Steady, low-carbon power day and night. The fabs need exactly that.' },
      { citizen: 'lin', mood: 'angry', text: 'A reactor on an island full of earthquakes? And where does the waste go?' },
    ],
    learn: {
      summary: 'Restarting a retired nuclear power plant after a public vote. Nuclear power produces almost no carbon emissions, but it is not renewable.',
      realWorld:
        'Taiwan decided to phase out nuclear power, and its last reactor was shut down in 2025. Whether to restart has been put to public referendums, and voters remain divided.',
      tradeoff:
        'Supporters point to steady, low-carbon power that doesn’t depend on the weather. Opponents point to earthquake risk, the lack of a permanent site for nuclear waste, and the cost of safety upgrades. Both sides want a low-carbon future. They disagree on how to get there.',
    },
  },
  {
    id: 'reforestation',
    name: 'Reforestation',
    icon: '🌳',
    category: 'Nature',
    sdgs: ['sdg14', 'sdg6'],
    cost: 40,
    upkeep: 3,
    buildTime: 2,
    description: 'Replant native forest on bare hillsides. Slow to grow, but it protects water, soil and wildlife.',
    instant: { approval: 1 },
    onComplete: { ecosystem: 10, emissions: -4 },
    perTurn: { ecosystem: 1, water: 1 },
    reactions: [{ citizen: 'lin', mood: 'happy', text: 'My grandson planted trees on the hill behind the farm. The stream runs clear again.' }],
    learn: {
      summary: 'Planting native trees on deforested land so forests can recover.',
      realWorld:
        'Forests cover roughly 60% of Taiwan, one of the highest shares in Asia. Mountain forests soak up rainwater, feed rivers and reservoirs, and help prevent landslides during typhoons.',
      tradeoff: 'Trees take decades to grow, and planting the wrong species in the wrong place can actually harm biodiversity.',
    },
  },
  {
    id: 'greenBuilding',
    name: 'Green Building Code',
    icon: '🏢',
    category: 'Cities',
    sdgs: ['sdg11', 'sdg13'],
    cost: 30,
    upkeep: 2,
    buildTime: 0,
    description: 'Require new buildings to be insulated, shaded and energy-efficient.',
    instant: { approval: -2 },
    onComplete: { emissions: -3, gdp: -2 },
    perTurn: { emissions: -1.5, airQuality: 0.5 },
    reactions: [{ citizen: 'wei', mood: 'neutral', text: 'New rules for insulation and green roofs. More work for builders, at least.' }],
    learn: {
      summary: 'Building rules that cut the energy buildings need for cooling, lighting and water.',
      realWorld:
        'Taiwan has a green building certification system (EEWH) for energy- and water-saving buildings. In a hot climate, air conditioning makes up a large share of a city’s electricity use.',
      tradeoff: 'Makes new buildings more expensive, which can push up already high housing prices.',
    },
  },
  {
    id: 'fishingQuota',
    name: 'Fishing Quotas',
    icon: '🎣',
    category: 'Nature',
    sdgs: ['sdg14'],
    cost: 20,
    upkeep: 2,
    buildTime: 0,
    description: 'Limit how many fish can be caught each year so stocks can recover. Prevents fish stock collapses.',
    instant: { approval: -4 },
    onComplete: { ecosystem: 4 },
    perTurn: { ecosystem: 2 },
    reactions: [{ citizen: 'ahhai', mood: 'angry', text: 'Quotas? Fine. But if the fish come back, I want my boat to still be here.' }],
    learn: {
      summary: 'Scientific catch limits and protected zones that stop fish from being caught faster than they can reproduce.',
      realWorld:
        'Taiwan has one of the world’s largest distant-water fishing fleets. Worldwide, the UN Food and Agriculture Organization estimates that more than a third of fish stocks are overfished.',
      tradeoff: 'Fishing communities lose income in the short term, even though healthy fish stocks help them in the long run.',
    },
  },
  {
    id: 'smartIrrigation',
    name: 'Smart Irrigation',
    icon: '🌾',
    category: 'Water',
    sdgs: ['sdg6'],
    cost: 45,
    upkeep: 4,
    buildTime: 1,
    description: 'Sensors and modern canals so farms use only the water their crops actually need.',
    instant: { approval: 1 },
    onComplete: { water: 6 },
    perTurn: { water: 1.5, ecosystem: 0.5 },
    reactions: [{ citizen: 'lin', mood: 'happy', text: 'A little sensor tells me when the paddies need water. Less waste, same rice.' }],
    learn: {
      summary: 'Upgrading irrigation with sensors, lined canals and better scheduling to cut water waste on farms.',
      realWorld:
        'Agriculture uses most of Taiwan’s water, more than homes and industry combined, so even small efficiency gains on farms free up a lot of water.',
      tradeoff: 'Farmers need training and up-front money, and older farmers may be slow to trust new technology.',
    },
  },
];


export const POLICY_BY_ID = Object.fromEntries(POLICIES.map((p) => [p.id, p]));
