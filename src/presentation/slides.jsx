// ─────────────────────────────────────────────────────────────
//  THE SLIDES for the Nov 27 progress presentation (5–10 min).
//
//  Each slide is a block of data: an id, a title, how long to
//  talk, speaker notes (press N), and a component that draws it.
//  To change the order, move a block. To add a slide, copy one.
//  Numbers like "17 policies" are counted from the game's data,
//  so they stay correct when content is added.
// ─────────────────────────────────────────────────────────────

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import IslandMap from '../components/IslandMap.jsx';
import CitizenAvatar from '../components/CitizenAvatar.jsx';
import { formatMoney } from '../components/Bits.jsx';
import { SCENES } from '../game/scenes.js';
import { SDGS } from '../game/sdgs.js';
import { POLICIES } from '../game/policies.js';
import { EVENTS } from '../game/events.js';
import { ENDINGS, ENDING_BY_ID } from '../game/story.js';
import { CITIZENS, CITIZEN_IDS } from '../game/citizens.js';
import { TOTAL_TURNS, MAX_POLICIES_PER_TURN, VOTE_OUT_THRESHOLD, termLabel } from '../game/constants.js';
import { islandFeatures } from '../game/engine.js';
import { useGame } from '../game/GameContext.jsx';
import { createDemoGame } from '../game/demo.js';
import { markTutorialSeen, setReturnSlide } from '../game/storage.js';

// ── Small building blocks ──────────────────────────────────────

function Header({ kicker, children }) {
  return (
    <header className="s-header">
      <span className="kicker">{kicker}</span>
      <h2>{children}</h2>
    </header>
  );
}

// ── 1. Title ───────────────────────────────────────────────────

function TitleSlide() {
  const [sceneIndex, setSceneIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setSceneIndex((i) => (i + 1) % SCENES.length), 3500);
    return () => clearInterval(timer);
  }, []);
  const scene = SCENES[sceneIndex];

  return (
    <div className="slide slide-ocean s-title">
      <div className="s-title-text">
        <span className="kicker">Web Programming · Final project · Progress demo</span>
        <h1>
          Island <em>2050</em>
        </h1>
        <p className="s-title-sub">A game about the UN Sustainable Development Goals</p>
        <p className="s-title-meta">One island · 24 years · every choice counts</p>
        <p className="s-title-by">Nury · Nov 27, 2026</p>
      </div>
      <div className="s-title-map">
        <IslandMap stats={scene.stats} features={scene.features} />
        <AnimatePresence mode="wait">
          <motion.span
            key={scene.id}
            className="s-map-label"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            {scene.label}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── 2. The idea ────────────────────────────────────────────────

const TRADEOFFS = [
  { icon: '🏭', choice: 'Close the coal plant', good: 'Cleaner air, lower emissions', bad: 'Factory workers lose their jobs' },
  { icon: '💾', choice: 'Build a chip fab', good: 'Jobs and economic growth', bad: 'Drinks the water farmers need' },
  { icon: '🧱', choice: 'Build a sea wall', good: 'The city is safe from storms', bad: 'Coastal wildlife suffers' },
];

function IdeaSlide() {
  return (
    <div className="slide">
      <Header kicker="The idea">
        Sustainability isn’t one right answer.
        <br />
        It’s <em>tradeoffs</em>.
      </Header>
      <div className="s-tradeoffs">
        {TRADEOFFS.map((t) => (
          <div key={t.choice} className="s-card s-tradeoff">
            <div className="s-tradeoff-icon">{t.icon}</div>
            <h3>{t.choice}</h3>
            <p className="s-good">▲ {t.good}</p>
            <p className="s-bad">▼ {t.bad}</p>
          </div>
        ))}
      </div>
      <p className="s-foot">
        Instead of a website that <b>tells</b> you about the SDGs, Island 2050 makes you <b>make the choices</b> as the
        leader of <b>Penglai (蓬萊)</b>, a fictional island inspired by Taiwan.
      </p>
    </div>
  );
}

// ── 3. The SDGs ────────────────────────────────────────────────

function SdgSlide() {
  return (
    <div className="slide">
      <Header kicker="What’s at stake">Six SDGs, one island</Header>
      <div className="s-sdgs">
        {SDGS.map((sdg) => (
          <div key={sdg.id} className="s-sdg" style={{ '--sdg': sdg.color }}>
            <div className="s-sdg-num">{sdg.number}</div>
            <div>
              <h3>{sdg.name}</h3>
              <p>{sdg.measuredBy}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="s-foot">
        Every score is computed from the island’s stats, and the stats pull against each other. You can’t max out all six.
      </p>
    </div>
  );
}

// ── 4. How a term works ────────────────────────────────────────

const LOOP = [
  { icon: '📜', title: 'Plan', text: `Pass up to ${MAX_POLICIES_PER_TURN} policies you can afford. Some take years to build.` },
  { icon: '🌀', title: 'Event', text: 'Typhoons, droughts, price shocks. Choose how to respond.' },
  { icon: '📊', title: 'Report', text: 'Stats change and the citizens tell you what they think.' },
  { icon: '🗳️', title: 'Election', text: `Every 4 years. Below ${VOTE_OUT_THRESHOLD}% approval, you’re out.` },
];

function LoopSlide() {
  const facts = [
    [TOTAL_TURNS, 'terms, 2026 → 2050'],
    [POLICIES.length, 'policies'],
    [EVENTS.length, 'events'],
    [ENDINGS.length, 'endings'],
  ];
  return (
    <div className="slide">
      <Header kicker="How it works">One term = two years</Header>
      <div className="s-loop">
        {LOOP.map((step, i) => (
          <div key={step.title} className="s-loop-step">
            <div className="s-card">
              <div className="s-loop-icon">{step.icon}</div>
              <h3>
                {i + 1}. {step.title}
              </h3>
              <p>{step.text}</p>
            </div>
            {i < LOOP.length - 1 && <span className="s-loop-arrow">→</span>}
          </div>
        ))}
      </div>
      <div className="s-facts">
        {facts.map(([n, label]) => (
          <div key={label} className="s-fact">
            <b>{n}</b>
            <span>{label}</span>
          </div>
        ))}
        <div className="s-fact s-fact-people">
          <div className="s-avatars">
            {CITIZEN_IDS.map((id) => (
              <CitizenAvatar key={id} id={id} mood="happy" size={44} showBadge={false} />
            ))}
          </div>
          <span>{CITIZEN_IDS.length} citizens who react to everything</span>
        </div>
      </div>
    </div>
  );
}

// ── 5. Live demo ───────────────────────────────────────────────

function DemoSlide({ slideNumber }) {
  const { loadState } = useGame();
  const navigate = useNavigate();
  // Built once so the slide can show the demo island's real numbers.
  const demo = useMemo(() => createDemoGame(), []);
  const built = Object.keys(demo.policies).length;

  function open(finished) {
    setReturnSlide(slideNumber); // shows "← Back to slides" in the top bar
    markTutorialSeen(); // the tutorial would cover the screen on a fresh laptop
    loadState(finished ? createDemoGame({ finished: true }) : demo);
    navigate(finished ? '/play/results' : '/play');
  }

  return (
    <div className="slide slide-ocean s-demo">
      <div className="s-demo-text">
        <span className="kicker">Live demo</span>
        <h2>Let’s play.</h2>
        <p>The real game, with a save prepared so we start in the middle of the action.</p>
      </div>
      <div className="s-demo-options">
        <button className="s-demo-btn" onClick={() => open(false)}>
          <span className="s-demo-icon">🏝️</span>
          <span>
            <b>Demo island · {termLabel(demo.turn)}</b>
            <span>
              Term {demo.turn + 1} of {TOTAL_TURNS} · {built} projects started · {formatMoney(demo.budget)} to spend ·{' '}
              {Math.round(demo.stats.approval)}% approval
            </span>
          </span>
          <span className="s-demo-go">Play →</span>
        </button>
        <button className="s-demo-btn" onClick={() => open(true)}>
          <span className="s-demo-icon">📊</span>
          <span>
            <b>A finished 2050</b>
            <span>The ending, the SDG report card, the chart and the decision timeline</span>
          </span>
          <span className="s-demo-go">Show →</span>
        </button>
      </div>
      <p className="s-demo-small">
        Opens the game with a ready-made save (it replaces any game in progress in this browser). “← Back to slides” in the
        top bar comes back here.
      </p>
      <div className="s-demo-map" aria-hidden="true">
        <IslandMap stats={demo.stats} features={islandFeatures(demo)} />
      </div>
    </div>
  );
}

// ── 6. Site map ────────────────────────────────────────────────

function SitemapSlide() {
  return (
    <div className="slide s-image-slide">
      <img src="/presentation/00-sitemap.png" alt="Site map: Home → Setup → Game → Results → Hall, plus Learn, SDGs and About" />
    </div>
  );
}

// ── 7. Wireframes ──────────────────────────────────────────────

const WIREFRAMES = [
  { file: '01-home', name: 'Home', status: 'built' },
  { file: '02-setup', name: 'Setup', status: 'built' },
  { file: '03a-game', name: 'Game: dashboard', status: 'built' },
  { file: '03b-game-turn', name: 'Game: one term', status: 'built' },
  { file: '04-results', name: 'Results', status: 'built' },
  { file: '05-learn', name: 'Learn', status: 'partial' },
  { file: '06-sdgs', name: 'The SDGs', status: 'built' },
  { file: '07-hall', name: 'Hall of Islands', status: 'partial' },
  { file: '08-about', name: 'About', status: 'partial' },
];

function WireframesSlide() {
  const [open, setOpen] = useState(null);
  return (
    <div className="slide s-wireframes">
      <div className="s-wf-side">
        <Header kicker="Planning">Every page, wireframed</Header>
        <p>8 pages, drawn before and during building. Numbered notes explain each part.</p>
        <ul className="s-wf-legend">
          <li>
            <span className="s-pill s-pill-built">Built</span> works in the live site
          </li>
          <li>
            <span className="s-pill s-pill-partial">Partial</span> works, final parts planned
          </li>
          <li>
            <span className="s-wf-dashed" /> planned parts are drawn with a dashed border
          </li>
        </ul>
        <p className="s-wf-hint">Click a page to enlarge it.</p>
      </div>
      <div className="s-wf-grid">
        {WIREFRAMES.map((w) => (
          <button key={w.file} className="s-wf-thumb" onClick={() => setOpen(w)}>
            <img src={`/presentation/${w.file}.png`} alt={`Wireframe: ${w.name}`} />
            <span className="s-wf-label">
              {w.name}
              <span className={`s-pill s-pill-${w.status}`}>{w.status === 'built' ? 'Built' : 'Partial'}</span>
            </span>
          </button>
        ))}
      </div>
      {open && (
        <button className="s-lightbox" onClick={() => setOpen(null)} aria-label="Close">
          <img src={`/presentation/${open.file}.png`} alt={`Wireframe: ${open.name}`} />
        </button>
      )}
    </div>
  );
}

// ── 8. Under the hood ──────────────────────────────────────────

function CodeSlide() {
  return (
    <div className="slide">
      <Header kicker="Under the hood">The engine is the rules. React is the screen.</Header>
      <div className="s-arch">
        <div className="s-arch-box">
          <h3>📄 Data</h3>
          <code>policies.js · events.js · citizens.js · story.js</code>
          <p>
            {POLICIES.length} policies, {EVENTS.length} events, {ENDINGS.length} endings
          </p>
        </div>
        <span className="s-arch-arrow">→</span>
        <div className="s-arch-box s-arch-engine">
          <h3>⚙️ Engine</h3>
          <code>engine.js</code>
          <p>Plain JavaScript. Game state in → new state out. No React inside.</p>
        </div>
        <span className="s-arch-arrow">→</span>
        <div className="s-arch-box">
          <h3>🖥️ Screens</h3>
          <code>pages/ · components/</code>
          <p>React draws the state and calls the engine when you click.</p>
        </div>
      </div>
      <div className="s-code-row">
        <pre className="s-code">
          <span className="s-code-comment">{'// policies.js: one policy = one block of data\n'}</span>
          {`{
  id: 'carbonTax',
  name: 'Carbon Tax',
  cost: 0,
  upkeep: -12,           `}
          <span className="s-code-comment">{'// earns $12M every term'}</span>
          {`
  instant: { approval: -8 },
  onComplete: { emissions: -8, gdp: -2 },
  perTurn: { emissions: -1 },
  sdgs: ['sdg13'],
}`}
        </pre>
        <ul className="s-also">
          <li>
            <b>The island map</b> is ~400 lines of hand-written SVG, redrawn from the game state
          </li>
          <li>
            <b>8 pages</b> with React Router · animations with Framer Motion · charts with Recharts
          </li>
          <li>
            <b>Saves</b> to the browser (localStorage) · <b>hosted</b> on Vercel
          </li>
          <li>
            <b>These slides</b> are a page of the same site
          </li>
        </ul>
      </div>
    </div>
  );
}

// ── 9. Balance testing ─────────────────────────────────────────

// From `npm run balance` (300 games per strategy, Standard difficulty, run on Nov 8).
const BALANCE = [
  { strategy: 'Do nothing', greenHaven: 0, balancedFuture: 0, votedOut: 1, other: 99 },
  { strategy: 'Random', greenHaven: 46, balancedFuture: 31, votedOut: 23, other: 0 },
  { strategy: 'Green first', greenHaven: 78, balancedFuture: 14, votedOut: 8, other: 0 },
  { strategy: 'Money first', greenHaven: 74, balancedFuture: 26, votedOut: 0, other: 0 },
  { strategy: 'Fix weakest SDG', greenHaven: 52, balancedFuture: 44, votedOut: 4, other: 0 },
];

function BalanceSlide() {
  const bars = [
    { key: 'greenHaven', name: ENDING_BY_ID.greenHaven.title, color: ENDING_BY_ID.greenHaven.color },
    { key: 'balancedFuture', name: ENDING_BY_ID.balancedFuture.title, color: ENDING_BY_ID.balancedFuture.color },
    { key: 'votedOut', name: ENDING_BY_ID.votedOut.title, color: ENDING_BY_ID.votedOut.color },
    { key: 'other', name: 'Other (mostly Rich but Burning)', color: ENDING_BY_ID.richButBurning.color },
  ];
  return (
    <div className="slide">
      <Header kicker="Testing">Bots play 300 games per strategy</Header>
      <div className="s-balance">
        <div className="s-card s-chart">
          <BarChart width={700} height={400} data={BALANCE} layout="vertical" margin={{ top: 4, right: 20, left: 20, bottom: 0 }}>
            <CartesianGrid horizontal={false} stroke="#eee5d3" />
            <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 13 }} />
            <YAxis type="category" dataKey="strategy" width={120} tick={{ fontSize: 14, fontWeight: 700 }} />
            <Tooltip formatter={(v) => `${v}%`} />
            <Legend wrapperStyle={{ fontSize: 13 }} />
            {bars.map((b) => (
              <Bar key={b.key} dataKey={b.key} name={b.name} stackId="endings" fill={b.color} isAnimationActive={false} />
            ))}
          </BarChart>
          <p className="s-chart-note">How each game ended · Standard difficulty · npm run balance</p>
        </div>
        <ul className="s-insights">
          <li>
            <b>Doing nothing</b> ends “Rich but Burning” almost every time.
          </li>
          <li>
            <b>“Money first” wins as often as “green first”</b>: its first pick is the carbon tax, which then pays for the
            green projects.
          </li>
          <li>
            The bots caught that an earlier version was <b>too easy</b> (Green Haven in 75–99% of games), so I retuned
            taxes and income.
          </li>
        </ul>
      </div>
    </div>
  );
}

// ── 10. Challenges ─────────────────────────────────────────────

const CHALLENGES = [
  {
    icon: '⚛️',
    title: 'I hadn’t learned React',
    problem: 'A game has a lot of changing state, and React wasn’t taught in the course.',
    fix: 'Kept the rules in plain JavaScript I can read. AI helped with the React parts, and the code is heavily commented.',
  },
  {
    icon: '🌏',
    title: 'Fictional numbers, real facts',
    problem: 'The game’s numbers are tuned for fun, but the project must be really about the SDGs.',
    fix: 'The Learn page links every policy to real Taiwan facts. Each one is tracked in sources.md and being verified.',
  },
  {
    icon: '⚖️',
    title: 'Balance',
    problem: 'First too much money, then too easy after adding content.',
    fix: 'Wrote a bot tester that plays thousands of games, then tuned until choices really matter.',
  },
];

function ChallengesSlide() {
  return (
    <div className="slide">
      <Header kicker="What was hard">Challenges</Header>
      <div className="s-challenges">
        {CHALLENGES.map((c) => (
          <div key={c.title} className="s-card s-challenge">
            <div className="s-tradeoff-icon">{c.icon}</div>
            <h3>{c.title}</h3>
            <p className="s-problem">{c.problem}</p>
            <p className="s-fix">
              <b>What I did:</b> {c.fix}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 11. Progress & next steps ──────────────────────────────────

const PAGES = [
  ['Home', 'built'],
  ['Setup', 'built'],
  ['Game', 'built'],
  ['Results', 'built'],
  ['The SDGs', 'built'],
  ['Learn', 'partial', 'sources being verified'],
  ['Hall of Islands', 'partial', 'this browser only'],
  ['About', 'partial', 'text to write'],
];

const NEXT = [
  ['Nov 28 – Dec 4', 'Global leaderboard + “% of players chose X” (online database)'],
  ['Dec 5 – 11', 'Citizen photos (all played by me), sound, polish'],
  ['Dec 12 – 18', 'Playtest the finished game, tune difficulty, verify every source'],
];

function ProgressSlide() {
  return (
    <div className="slide">
      <Header kicker="Progress">Playable from 2026 to 2050, today</Header>
      <div className="s-progress">
        <div className="s-card">
          <h3>The 8 pages</h3>
          <ul className="s-pages">
            {PAGES.map(([name, status, note]) => (
              <li key={name}>
                <span className={`s-pill s-pill-${status}`}>{status === 'built' ? 'Built' : 'Partial'}</span>
                <b>{name}</b>
                {note && <span className="s-muted"> · {note}</span>}
              </li>
            ))}
          </ul>
        </div>
        <div className="s-card">
          <h3>Next, until the final version on Dec 18</h3>
          <ol className="s-next">
            {NEXT.map(([when, what]) => (
              <li key={when}>
                <span className="s-next-when">{when}</span>
                <span>{what}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

// ── 12. Thank you ──────────────────────────────────────────────

function ThanksSlide() {
  const act = SCENES.find((s) => s.id === 'act');
  return (
    <div className="slide slide-ocean s-thanks">
      <div>
        <h2>Thank you!</h2>
        <p className="s-thanks-q">Questions?</p>
        <p className="s-thanks-url">
          Play it yourself:
          <br />
          <b>{window.location.host}</b>
        </p>
      </div>
      <div className="s-thanks-map" aria-hidden="true">
        <IslandMap stats={act.stats} features={act.features} />
      </div>
    </div>
  );
}

// ── The running order ──────────────────────────────────────────
// time = roughly how long to talk. Total ≈ 5½ min of slides + 3 min of demo.

export const SLIDES = [
  {
    id: 'title',
    title: 'Island 2050',
    time: '20 s',
    Slide: TitleSlide,
    notes: [
      'Hi, I’m Nury. My project is Island 2050, a game about the UN Sustainable Development Goals.',
      'The island behind me shows three futures: today, 2050 if we act, and 2050 if we don’t.',
    ],
  },
  {
    id: 'idea',
    title: 'The idea',
    time: '40 s',
    Slide: IdeaSlide,
    notes: [
      'Most SDG websites are pages of facts. But the hard part of sustainability isn’t knowing the facts, it’s that every choice has a cost.',
      'Go through one example: a chip fab gives jobs but uses the water farmers need. That’s a real problem in Taiwan (2021 drought).',
      'So the player becomes the leader of Penglai, a fictional island inspired by Taiwan, and has to make these choices.',
    ],
  },
  {
    id: 'sdgs',
    title: 'Six SDGs, one island',
    time: '30 s',
    Slide: SdgSlide,
    notes: [
      'The game follows six of the 17 SDGs: energy, climate, cities, water, economy and nature.',
      'Each score is calculated from the island’s stats, for example SDG 7 is the share of renewable energy.',
      'They pull against each other, so the goal is balance, not maxing one out.',
    ],
  },
  {
    id: 'loop',
    title: 'How a term works',
    time: '40 s',
    Slide: LoopSlide,
    notes: [
      'One term is two years, and there are 12 terms from 2026 to 2050.',
      'Each term: pick up to two policies, face a random event, then see the report and what citizens think.',
      'Every four years there’s an election. If approval is under 35%, you’re voted out, so you can’t ignore people.',
      'The citizens will be played by me, with my own face, in the final version.',
    ],
  },
  {
    id: 'demo',
    title: 'Live demo',
    time: '3 min',
    Slide: DemoSlide,
    notes: [
      'Click “Demo island”. Point at the top bar: budget, income per term, approval and the next election.',
      'Hover a policy card: cost, upkeep, effects, SDGs. Pick the Chip Fab and point out that it uses water.',
      'End the term → the event pop-up → pick a response → the term report with citizen faces. Continue → the Turning Point story.',
      'Click “← Back to slides”, then “A finished 2050” to show the ending, the report card and the timeline. Then back to slides.',
    ],
  },
  {
    id: 'sitemap',
    title: 'Site map',
    time: '30 s',
    Slide: SitemapSlide,
    notes: [
      'The site has 8 pages. The main flow is Home → Setup → Game → Results → Hall of Islands.',
      'Learn, The SDGs and About are always in the top navigation. Learn connects every policy to real Taiwan facts.',
    ],
  },
  {
    id: 'wireframes',
    title: 'Wireframes',
    time: '40 s',
    Slide: WireframesSlide,
    notes: [
      'Every page has a wireframe. Five are fully built and three are partial.',
      'Click Hall of Islands: the dashed parts are the global leaderboard and the “what other players chose” stats, coming next.',
    ],
  },
  {
    id: 'code',
    title: 'Under the hood',
    time: '40 s',
    Slide: CodeSlide,
    notes: [
      'The most important design decision: the game rules are plain JavaScript, separate from React.',
      'Content is data. A policy is just a block like this one, so adding content doesn’t mean changing the code.',
      'The island map is drawn in SVG code, so it can change with every stat.',
    ],
  },
  {
    id: 'balance',
    title: 'Testing with bots',
    time: '40 s',
    Slide: BalanceSlide,
    notes: [
      'With so many numbers, how do you know the game is fair? I wrote a script that plays hundreds of games with different strategies.',
      'Doing nothing gives the “Rich but Burning” ending. Playing well usually reaches Green Haven, but not always.',
      'Interesting finding: “money first” does as well as “green first”, because the carbon tax pays for the green projects.',
    ],
  },
  {
    id: 'challenges',
    title: 'Challenges',
    time: '30 s',
    Slide: ChallengesSlide,
    notes: [
      'The biggest one: React wasn’t taught in class. That’s why the rules are in plain JavaScript I can read and explain.',
      'The game numbers are made up for balance, so the real facts live on the Learn page with sources.',
      'And balance: the bot tester made it possible to tune the game in minutes instead of hours of playing.',
    ],
  },
  {
    id: 'progress',
    title: 'Progress & next steps',
    time: '40 s',
    Slide: ProgressSlide,
    notes: [
      'The game is playable from start to finish today, with all 8 pages online.',
      'Next: a global leaderboard, my photos for the citizens, sound, and checking every source.',
      'The final version is due December 18.',
    ],
  },
  {
    id: 'thanks',
    title: 'Thank you',
    Slide: ThanksSlide,
    notes: ['Thank you! The link is on the screen, so you can play it on your laptop. Any questions?'],
  },
];
