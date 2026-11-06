// ─────────────────────────────────────────────────────────────
//  EVENTS: one happens every term, after you pick your policies.
//
//  Each event is a set of functions that receive the current game
//  state (and `sev`, a severity multiplier that grows over time):
//    weight(state)        how likely it is (bigger = more likely)
//    condition(state)     optional: only possible when this is true
//    title / description  text shown to the player
//    base(state, sev)     effects that always happen
//    choices(state, sev)  1–3 options; each has its own effects
//    citizen(state)       who reacts and what they say
//
//  The engine turns this into plain data once, when the event is
//  drawn, so it can be saved and shown on screen.
// ─────────────────────────────────────────────────────────────

import { computeSdgScores } from './sdgs.js';

const has = (state, policyId) => Boolean(state.policies[policyId]?.done);
const round = (n) => Math.round(n);

const TYPHOON_NAMES = ['Kalo', 'Meari', 'Haitang', 'Lanni', 'Sora', 'Tapah', 'Nanmo', 'Kujira', 'Fung', 'Ampil'];

export const EVENTS = [
  {
    id: 'typhoon',
    icon: '🌀',
    weight: (s) => 2 + s.turn * 0.35,
    title: () => `Typhoon ${TYPHOON_NAMES[Math.floor(Math.random() * TYPHOON_NAMES.length)]} makes landfall`,
    description: (s) => {
      const protections = [has(s, 'seaWall') && 'sea wall', has(s, 'wetland') && 'restored wetlands'].filter(Boolean);
      if (protections.length)
        return `Wind and rain lash the island for two days. Your ${protections.join(' and ')} absorbed the worst of the storm surge.`;
      return 'Wind and rain lash the island for two days. Storm surge floods the coastal districts of the capital.';
    },
    base: (s, sev) => {
      const damage = Math.max(8, round((48 - s.stats.resilience * 0.55) * sev));
      return { budget: -damage, approval: -round(damage / 12), ecosystem: -2 };
    },
    choices: () => [
      {
        label: 'Fund emergency relief',
        hint: 'Shelters, repairs and cash for families who lost homes.',
        effects: { budget: -30, approval: 6 },
      },
      {
        label: 'Leave it to local governments',
        hint: 'Saves money. People will remember who didn’t show up.',
        effects: { approval: -6 },
      },
    ],
    citizen: (s) =>
      s.stats.resilience >= 55
        ? { citizen: 'ahhai', mood: 'happy', text: 'My boat survived. The coast held up better than I expected.' }
        : { citizen: 'ahhai', mood: 'angry', text: 'The harbor is wrecked. Every year these storms get worse.' },
  },

  {
    id: 'drought',
    icon: '🏜️',
    weight: (s) => 1 + Math.max(0, 70 - s.stats.water) / 8,
    title: () => 'The rains don’t come',
    description: (s) =>
      `The plum rain season was the driest in decades and the reservoirs are running low. ${
        has(s, 'fab') ? 'The chip fabs and the rice farms both need water, and there isn’t enough for both.' : 'Factories and farms are both asking for water.'
      } (Inspired by Taiwan’s real 2021 drought.)`,
    base: (s, sev) => ({ water: -round(6 * sev) }),
    choices: (s) => [
      {
        label: has(s, 'fab') ? 'Cut water to the chip fabs' : 'Ration industrial water',
        hint: 'Farms keep irrigating. Industry slows down.',
        effects: has(s, 'fab') ? { gdp: -6, approval: -1 } : { gdp: -3 },
        reaction: { citizen: 'kai', mood: 'angry', text: 'We had to halt a production line. Customers are furious.' },
      },
      {
        label: 'Suspend farm irrigation',
        hint: 'Industry keeps running. Rice fields go dry for a season.',
        effects: { approval: -6, ecosystem: -3 },
        reaction: { citizen: 'lin', mood: 'angry', text: 'My fields are cracked like old pottery. They paid us to not farm, but that’s not the point.' },
      },
      {
        label: 'Truck in emergency water',
        hint: 'Expensive, but nobody has to lose out.',
        effects: { budget: -50, water: 8 },
      },
    ],
    citizen: () => ({ citizen: 'lin', mood: 'neutral', text: 'In my day we prayed for rain. Now we pray and check the reservoir website.' }),
  },

  {
    id: 'heatwave',
    icon: '🔥',
    weight: (s) => 1 + s.stats.emissions / 40 + s.turn * 0.15,
    title: () => 'Record-breaking heatwave',
    description: (s) =>
      s.stats.renewable >= 30
        ? 'Temperatures hit 40°C. Everyone turns on their air conditioning at once, and your solar and wind keep the grid steady.'
        : 'Temperatures hit 40°C. Everyone turns on their air conditioning at once and the power grid is close to collapse.',
    base: () => ({ approval: -2 }),
    choices: (s) =>
      s.stats.renewable >= 30
        ? [{ label: 'Keep calm and stay cool', hint: 'Clean energy paid off.', effects: { approval: 4 } }]
        : [
            {
              label: 'Rolling blackouts',
              hint: 'Turn off power district by district.',
              effects: { gdp: -4, approval: -5 },
            },
            {
              label: 'Fire up the old gas turbines',
              hint: 'Keeps the lights on, at a cost to the air.',
              effects: { budget: -20, emissions: 4, airQuality: -4 },
            },
          ],
    citizen: (s) =>
      s.stats.renewable >= 30
        ? { citizen: 'mei', mood: 'happy', text: 'Library AC still running. Thank you, solar panels!' }
        : { citizen: 'wei', mood: 'angry', text: 'It’s 38 degrees inside the factory. People are fainting.' },
  },

  {
    id: 'energyPrice',
    icon: '⛽',
    weight: (s) => 1.2 + (100 - s.stats.renewable) / 60,
    title: () => 'Global energy prices spike',
    description: (s) =>
      `A crisis overseas doubles the price of imported coal and gas. ${
        s.stats.renewable >= 40 ? 'Luckily, much of your power is now homegrown.' : 'The island imports almost all of its fuel.'
      }`,
    base: (s, sev) => ({ budget: -round((100 - s.stats.renewable) * 0.55 * sev) }),
    choices: () => [
      {
        label: 'Subsidize household bills',
        hint: 'Protect families from the price shock.',
        effects: { budget: -30, approval: 3 },
      },
      {
        label: 'Let prices rise',
        hint: 'People will feel it in their wallets.',
        effects: { approval: -6 },
      },
    ],
    citizen: () => ({ citizen: 'wei', mood: 'angry', text: 'My electricity bill is higher than my rent this month.' }),
  },

  {
    id: 'climateMarch',
    icon: '📢',
    condition: (s) => s.stats.emissions > 45,
    weight: () => 1.2,
    title: () => 'Youth climate march',
    description: () =>
      'Tens of thousands of students march to the Presidential Office. Their signs read: “It’s OUR 2050.”',
    base: () => ({}),
    choices: () => [
      {
        label: 'Meet the marchers',
        hint: 'Listen, and promise action.',
        effects: { approval: 4 },
        reaction: { citizen: 'mei', mood: 'happy', text: 'They actually listened. Now they’d better deliver.' },
      },
      {
        label: 'Ignore them',
        hint: 'They’ll go home eventually.',
        effects: { approval: -5 },
        reaction: { citizen: 'mei', mood: 'angry', text: 'We’ll remember this at the next election.' },
      },
    ],
    citizen: () => ({ citizen: 'mei', mood: 'neutral', text: 'I skipped my exam for this. It had better matter.' }),
  },

  {
    id: 'techBoom',
    icon: '📈',
    weight: (s) => (has(s, 'fab') ? 1.6 : 0.8),
    title: () => 'Global tech boom',
    description: (s) =>
      has(s, 'fab')
        ? 'AI companies around the world are desperate for chips, and your new fab is running day and night.'
        : 'AI companies around the world are desperate for chips. The island’s tech sector grows, though it could have grown more.',
    base: (s) => (has(s, 'fab') ? { gdp: 8, budget: 60 } : { gdp: 4, budget: 25 }),
    choices: () => [{ label: 'Celebrate', hint: 'Good news, for once.', effects: { approval: 2 } }],
    citizen: () => ({ citizen: 'kai', mood: 'happy', text: 'Bonus season! Dinner’s on me tonight.' }),
  },

  {
    id: 'fishCollapse',
    icon: '🐟',
    condition: (s) => s.stats.ecosystem < 45 && !has(s, 'fishingQuota'), // quotas prevent collapses
    weight: (s) => 1 + (45 - s.stats.ecosystem) / 10,
    title: () => 'Fish stocks collapse',
    description: () =>
      'Fishing boats come back to harbor nearly empty. Scientists warn that years of overfishing and coastal damage have pushed the sea to its limit.',
    base: () => ({ gdp: -2, approval: -2 }),
    choices: () => [
      {
        label: 'Ban fishing for a season',
        hint: 'Painful now, but the fish can recover.',
        effects: { ecosystem: 9, approval: -4, budget: -15 },
        reaction: { citizen: 'ahhai', mood: 'angry', text: 'A whole season with no income… I hope this works.' },
      },
      {
        label: 'Keep the boats going out',
        hint: 'Fishermen need to eat. The sea will get worse.',
        effects: { ecosystem: -5, approval: 1 },
      },
    ],
    citizen: () => ({ citizen: 'ahhai', mood: 'angry', text: 'My grandfather fished these waters. I may be the last one.' }),
  },

  // ── Added in phase 2 ──────────────────────────────────────

  {
    id: 'earthquake',
    icon: '🫨',
    weight: () => 0.9,
    title: () => 'A strong earthquake hits the east coast',
    description: (s) =>
      `Buildings sway, roads crack, and landslides cut off mountain villages. ${
        has(s, 'nuclear') ? 'The nuclear plant shut down automatically, as designed, and inspectors are on their way. ' : ''
      }(Taiwan sits on the Pacific “Ring of Fire”. A magnitude 7.4 quake struck Hualien in 2024.)`,
    base: (s, sev) => {
      const damage = Math.max(10, round((50 - s.stats.resilience * 0.5) * sev));
      return { budget: -damage, gdp: -2, approval: -2 };
    },
    choices: () => [
      {
        label: 'Rebuild stronger',
        hint: 'Stricter building codes and retrofits. Costly, but safer next time.',
        effects: { budget: -40, resilience: 6 },
      },
      {
        label: 'Quick repairs only',
        hint: 'Patch things up and move on.',
        effects: { budget: -10, approval: -3 },
      },
    ],
    citizen: () => ({ citizen: 'wei', mood: 'neutral', text: 'The factory shook like a boat in a storm. Everyone got out, thank goodness.' }),
  },

  {
    id: 'airCrisis',
    icon: '😷',
    condition: (s) => s.stats.airQuality < 32,
    weight: (s) => 1.5 + (32 - s.stats.airQuality) / 8,
    title: () => 'Purple air alert',
    description: () =>
      'The air quality index hits “hazardous”. Schools close, and hospitals fill with children and elderly people who can’t breathe properly.',
    base: () => ({ approval: -3, gdp: -1 }),
    choices: () => [
      {
        label: 'Order factories to cut output',
        hint: 'Clears the air quickly, but hurts the economy.',
        effects: { gdp: -4, airQuality: 8, emissions: -2 },
        reaction: { citizen: 'wei', mood: 'angry', text: 'Half shifts for two weeks. That’s half my paycheck.' },
      },
      {
        label: 'Hand out masks and wait for the wind',
        hint: 'Cheap. Doesn’t fix anything.',
        effects: { budget: -10, approval: -3 },
      },
    ],
    citizen: () => ({ citizen: 'mei', mood: 'angry', text: 'I can taste the air. That can’t be normal.' }),
  },

  {
    id: 'climateSummit',
    icon: '🌐',
    condition: (s) => s.turn >= 2,
    weight: () => 1,
    title: () => 'The world climate summit',
    description: (s) =>
      computeSdgScores(s.stats).sdg13 >= 55
        ? 'World leaders praise the island as a climate leader. Green investors are lining up to fund your next projects.'
        : 'The island is named as a climate laggard. Trading partners announce carbon border taxes on your exports. (The EU has started a real one, called CBAM.)',
    base: (s) => (computeSdgScores(s.stats).sdg13 >= 55 ? { budget: 50, gdp: 3 } : { gdp: -5 }),
    choices: (s) =>
      computeSdgScores(s.stats).sdg13 >= 55
        ? [{ label: 'Accept the green investment', hint: 'Your reputation pays off.', effects: { approval: 2 } }]
        : [
            {
              label: 'Help exporters pay the tax',
              hint: 'Protects jobs for now. Doesn’t cut emissions.',
              effects: { budget: -40, gdp: 3 },
            },
            {
              label: 'Accept the hit',
              hint: 'Exporters will be angry.',
              effects: { approval: -3 },
            },
          ],
    citizen: (s) =>
      computeSdgScores(s.stats).sdg13 >= 55
        ? { citizen: 'kai', mood: 'happy', text: 'Customers abroad want “green chips” now, and we can actually deliver.' }
        : { citizen: 'kai', mood: 'angry', text: 'Two big customers just switched to cleaner suppliers overseas.' },
  },

  {
    id: 'factoryOffer',
    icon: '🏗️',
    condition: (s) => s.turn <= 9,
    weight: () => 1,
    title: () => 'A giant company wants to move in',
    description: () =>
      'A global electronics company offers to build a huge factory complex on the west coast. Thousands of jobs, but it will need water, land and power.',
    base: () => ({}),
    choices: (s) => {
      const greenReady = has(s, 'waterRecycling') && s.stats.renewable >= 40;
      return [
        {
          label: 'Welcome them, no conditions',
          hint: 'Jobs and tax money now. The island pays later.',
          effects: { gdp: 8, budget: 30, water: -6, emissions: 4, ecosystem: -3 },
          reaction: { citizen: 'wei', mood: 'happy', text: 'Thousands of jobs! My son might finally move back home.' },
        },
        greenReady
          ? {
              label: 'Only with clean power and recycled water',
              hint: 'You have the green infrastructure to make this demand.',
              effects: { gdp: 5, budget: 15, approval: 2 },
            }
          : {
              label: 'Only with clean power and recycled water',
              hint: 'Without enough renewables and water recycling, they’ll probably walk away.',
              effects: { approval: -1 },
            },
        {
          label: 'Turn them down',
          hint: 'Protect the land. Lose the jobs.',
          effects: { approval: -3 },
        },
      ];
    },
    citizen: () => ({ citizen: 'lin', mood: 'neutral', text: 'Factories come and go. The land stays, if we let it.' }),
  },

  {
    id: 'seaLevelWarning',
    icon: '🌊',
    condition: (s) => s.turn >= 6,
    weight: (s) => 0.8 + s.turn * 0.1,
    title: () => 'Seas are rising faster than expected',
    description: (s) =>
      has(s, 'seaWall') || has(s, 'wetland')
        ? 'Scientists confirm that sea levels around the island are rising faster than predicted. Thanks to your coastal defences, most of the coast is safe for now.'
        : 'Scientists confirm that sea levels around the island are rising faster than predicted. High tides now flood coastal streets every month.',
    base: (s) =>
      has(s, 'seaWall') || has(s, 'wetland') ? { approval: 1 } : { resilience: -6, approval: -3, ecosystem: -2 },
    choices: (s) =>
      has(s, 'seaWall') || has(s, 'wetland')
        ? [{ label: 'Keep monitoring', hint: 'Your earlier choices bought you time.', effects: {} }]
        : [
            {
              label: 'Fund a coastal adaptation plan',
              hint: 'Raise roads, protect key buildings.',
              effects: { budget: -50, resilience: 10 },
            },
            {
              label: 'Help families move inland',
              hint: 'Cheaper, but people don’t want to leave their homes.',
              effects: { budget: -20, approval: -5, resilience: 5 },
            },
          ],
    citizen: (s) =>
      has(s, 'seaWall') || has(s, 'wetland')
        ? { citizen: 'ahhai', mood: 'neutral', text: 'The water’s higher at the harbor, but the wetlands take the worst of it.' }
        : { citizen: 'ahhai', mood: 'angry', text: 'High tide reached my front door last week. My front door!' },
  },

  {
    id: 'quietYear',
    icon: '🌤️',
    weight: () => 0.8,
    title: () => 'A quiet term',
    description: () => 'No storms, no crises. Life on the island goes on, and your projects make progress.',
    base: () => ({ approval: 1 }),
    choices: () => [{ label: 'Enjoy the calm', hint: 'It won’t last.', effects: {} }],
    citizen: () => ({ citizen: 'lin', mood: 'happy', text: 'A good harvest this year. Come over for some rice.' }),
  },
];
