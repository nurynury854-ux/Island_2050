// ─────────────────────────────────────────────────────────────
//  The illustrated island. It is drawn entirely in SVG (code),
//  and reacts to the game:
//    stats    → smog, city size, reservoir level, forest, land color, floods
//    features → which projects exist ('none' | 'building' | 'done')
//
//  Coordinates are in a 800×500 drawing space (the viewBox).
// ─────────────────────────────────────────────────────────────

import { motion } from 'framer-motion';
import { START_STATS } from '../game/constants.js';
import './IslandMap.css';

const ISLAND_PATH =
  'M 230 300 C 200 240, 250 170, 330 140 C 400 112, 480 100, 545 130 C 610 158, 640 210, 620 270 C 600 330, 540 380, 460 395 C 380 410, 290 380, 250 345 C 235 330, 232 315, 230 300 Z';

// Buildings: [x, bottomY, width, height]. The first ones always show; more appear as the economy grows.
const BUILDINGS = [
  [300, 318, 20, 60],
  [340, 318, 22, 72],
  [322, 318, 16, 42],
  [280, 318, 18, 34],
  [318, 290, 18, 52],
  [364, 318, 16, 38],
  [354, 290, 16, 44],
  [300, 290, 16, 38],
  [382, 318, 14, 26],
  [338, 290, 14, 30],
  [316, 342, 18, 34],
  [296, 342, 16, 26],
  [372, 292, 14, 50],
];

const TREES = [
  [470, 175], [500, 160], [430, 150], [585, 185], [600, 225], [560, 300], [520, 330],
  [590, 290], [455, 205], [415, 190], [540, 170], [500, 360], [545, 345], [610, 255],
  [480, 140], [420, 365], [445, 225], [575, 320],
];

const TURBINES = [
  [120, 190], [165, 220], [100, 255], [150, 280], [118, 330], [170, 345], [195, 175],
];

const TURBINES_2 = [[62, 215], [52, 295], [78, 372], [140, 400], [205, 405], [222, 130]];

// Young trees planted by the Reforestation policy
const NEW_TREES = [
  [425, 348], [455, 372], [525, 288], [565, 336], [604, 292], [478, 228], [520, 378], [440, 172], [395, 205], [368, 220],
];

// Rice paddies south-east of the reservoir: [x, y]
const PADDIES = [0, 1, 2, 3].flatMap((c) => [0, 1].map((r) => [440 + c * 15, 350 + r * 11]));

const WETLANDS = [
  [266, 250, 18, 9], [252, 280, 14, 8], [276, 205, 20, 9], [302, 176, 16, 8], [244, 300, 10, 6],
];

const clamp01 = (n) => Math.max(0, Math.min(1, n));

/** Blend two hex colors. t=0 → a, t=1 → b */
function mix(a, b, t) {
  const pa = a.match(/\w\w/g).map((h) => parseInt(h, 16));
  const pb = b.match(/\w\w/g).map((h) => parseInt(h, 16));
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(',')})`;
}

// A feature fades and grows in when it appears.
function Feature({ status, children, title }) {
  if (status === 'none') return null;
  return (
    <motion.g
      key={status}
      className={status === 'building' ? 'feature-building' : ''}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: status === 'building' ? 0.55 : 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <title>{status === 'building' ? `${title} (under construction)` : title}</title>
      {children}
    </motion.g>
  );
}

function Turbine({ x, y, spinning }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="2" rx="7" ry="2.5" fill="rgb(255 255 255 / 0.25)" />
      <line x1="0" y1="0" x2="0" y2="-34" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <g transform="translate(0 -34)">
        {spinning && (
          <g>
            {[0, 120, 240].map((a) => (
              <path key={a} d="M0 0 L -2 -15 L 0 -17 L 2 -15 Z" fill="white" transform={`rotate(${a})`} />
            ))}
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="3.2s" repeatCount="indefinite" />
          </g>
        )}
        <circle r="2.6" fill="#dfe7ea" />
      </g>
    </g>
  );
}

// fit="slice" fills a wide frame by cropping a little ocean off the top and bottom.
export default function IslandMap({ stats = START_STATS, features = {}, className = '', fit = 'meet' }) {
  const f = (id) => features[id] ?? 'none';

  const eco = clamp01(stats.ecosystem / 100);
  const landColor = mix('b5a35f', '4fa868', eco);
  const landDark = mix('8e7f45', '2f7d48', eco);
  const smog = clamp01((100 - stats.airQuality) / 100) * 0.8;
  const visibleBuildings = BUILDINGS.slice(0, Math.round(4 + (stats.gdp / 100) * (BUILDINGS.length - 4)));
  const visibleTrees = TREES.slice(0, Math.round((stats.ecosystem / 100) * TREES.length));
  const lakeRx = 8 + stats.water * 0.26;
  const coalStatus = f('coalPhaseOut');
  const smokeLevel = coalStatus === 'done' ? 0 : clamp01(stats.emissions / 100);
  const flooding = stats.resilience < 25 && f('seaWall') !== 'done';
  const paddyColor = mix('c9a86a', '8cc63f', clamp01((stats.water - 15) / 55));
  const greenRoofs = f('greenBuilding') === 'done';

  return (
    <svg
      className={`island-map ${className}`}
      viewBox="0 0 800 500"
      preserveAspectRatio={`xMidYMid ${fit}`}
      role="img"
      aria-label="Map of the island"
    >
      <defs>
        <radialGradient id="ocean" cx="50%" cy="45%" r="75%">
          <stop offset="0%" stopColor="#2b8fa3" />
          <stop offset="60%" stopColor="#176477" />
          <stop offset="100%" stopColor="#0d3a4e" />
        </radialGradient>
        <filter id="blur-lg" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id="blur-sm">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <clipPath id="island-clip">
          <path d={ISLAND_PATH} />
        </clipPath>
      </defs>

      {/* Ocean + waves */}
      <rect width="800" height="500" fill="url(#ocean)" />
      <g className="waves" stroke="rgb(255 255 255 / 0.22)" strokeWidth="2" fill="none" strokeLinecap="round">
        {[
          [60, 90], [180, 60], [660, 80], [720, 200], [700, 380], [90, 420], [560, 450], [260, 450], [40, 300],
        ].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y} q 8 -6 16 0 t 16 0`} style={{ animationDelay: `${i * 0.4}s` }} />
        ))}
      </g>

      {/* Protected fishing zone (east sea) */}
      <Feature status={f('fishingQuota')} title="Protected fishing zone (quotas)">
        <ellipse cx="695" cy="270" rx="58" ry="110" fill="rgb(255 255 255 / 0.05)" stroke="rgb(255 255 255 / 0.55)" strokeWidth="2" strokeDasharray="6 6" />
        {[
          [695, 160], [752, 270], [695, 380], [638, 270],
        ].map(([x, y]) => (
          <g key={x + y}>
            <circle cx={x} cy={y} r="5" fill="#f08a3c" stroke="white" strokeWidth="1.5" />
          </g>
        ))}
        {[[690, 230], [715, 300], [675, 320]].map(([x, y]) => (
          <path key={x} d={`M${x} ${y} q 6 -5 12 0 q -6 5 -12 0 l -4 -3 v 6 z`} fill="#bfe3ea" />
        ))}
      </Feature>

      {/* Shallow water + beach + land */}
      <path d={ISLAND_PATH} fill="none" stroke="#5fb8c0" strokeOpacity="0.55" strokeWidth="46" />
      <path d={ISLAND_PATH} fill="none" stroke="#efdcae" strokeWidth="16" strokeLinejoin="round" />
      <path d={ISLAND_PATH} fill={landColor} style={{ transition: 'fill 1s' }} />

      <g clipPath="url(#island-clip)">
        {/* Flood water on the south-west coast when the island isn't protected */}
        {flooding && (
          <motion.path
            d="M 220 300 C 250 330, 290 350, 330 400 L 200 420 Z"
            fill="#3b98b5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
          >
            <title>Coastal flooding</title>
          </motion.path>
        )}

        {/* Wetlands (behind everything on the north-west coast) */}
        <Feature status={f('wetland')} title="Restored wetlands & mangroves">
          {WETLANDS.map(([x, y, rx, ry], i) => (
            <g key={i}>
              <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#5aa0a0" opacity="0.7" />
              <circle cx={x - rx / 2} cy={y - 2} r="4" fill="#2e6b45" />
              <circle cx={x + rx / 3} cy={y - 3} r="5" fill="#2e6b45" />
            </g>
          ))}
        </Feature>
      </g>

      {/* Reservoir: dry lake bed + water that shrinks with the water stat */}
      <ellipse cx="470" cy="315" rx="36" ry="19" fill="#cdb98c" />
      <ellipse cx="470" cy="315" rx={lakeRx} ry={lakeRx * 0.53} fill="#4fb3d9" style={{ transition: 'all 1s' }}>
        <title>Reservoir</title>
      </ellipse>

      {/* Rice paddies: green when there is water, brown in a drought */}
      <g>
        <title>Rice paddies</title>
        {PADDIES.map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="13" height="9" rx="1.5" fill={paddyColor} style={{ transition: 'fill 1s' }} />
        ))}
      </g>
      <Feature status={f('smartIrrigation')} title="Smart irrigation">
        <path d="M436 361 H 502 M 454 348 V 372 M 469 348 V 372 M 484 348 V 372" stroke="#4fb3d9" strokeWidth="2" />
        {[[447, 353], [477, 364], [492, 353]].map(([x, y]) => (
          <circle key={x} cx={x} cy={y} r="1.8" fill="white" />
        ))}
      </Feature>

      {/* Mountains */}
      <g>
        {[
          [545, 220, 42, 85],
          [500, 245, 36, 70],
          [588, 255, 30, 55],
          [462, 272, 26, 40],
        ].map(([x, y, hw, h], i) => (
          <g key={i}>
            <path d={`M${x - hw} ${y} L${x} ${y - h} L${x + hw} ${y} Z`} fill={landDark} style={{ transition: 'fill 1s' }} />
            <path d={`M${x - hw * 0.28} ${y - h * 0.72} L${x} ${y - h} L${x + hw * 0.28} ${y - h * 0.72} Z`} fill="#f4f1ea" />
          </g>
        ))}
      </g>

      {/* Forest: more trees when the ecosystem is healthy */}
      <g>
        {visibleTrees.map(([x, y], i) => (
          <g key={i}>
            <rect x={x - 1} y={y} width="2" height="6" fill="#5b4a2f" />
            <circle cx={x} cy={y - 2} r="6.5" fill="#2f7d48" />
          </g>
        ))}
      </g>

      {/* Young forest from the Reforestation policy */}
      <Feature status={f('reforestation')} title="Reforestation">
        {(f('reforestation') === 'done' ? NEW_TREES : NEW_TREES.slice(0, 4)).map(([x, y], i) => (
          <g key={i}>
            <rect x={x - 0.75} y={y} width="1.5" height="5" fill="#5b4a2f" />
            <circle cx={x} cy={y - 1.5} r={f('reforestation') === 'done' ? 5.5 : 3} fill="#5fb15f" />
          </g>
        ))}
      </Feature>

      {/* Chip fab (north) */}
      <Feature status={f('fab')} title="Chip fab">
        <rect x="360" y="152" width="70" height="26" rx="3" fill="#f2f5f7" stroke="#b9c3c9" />
        <rect x="360" y="162" width="70" height="5" fill="#5b5fc7" />
        <rect x="372" y="144" width="14" height="8" fill="#d6dde1" />
        <rect x="402" y="144" width="14" height="8" fill="#d6dde1" />
      </Feature>

      {/* Nuclear plant (north-east coast) */}
      <Feature status={f('nuclear')} title="Nuclear power plant">
        <rect x="578" y="178" width="30" height="10" fill="#dfe5e8" stroke="#b9c3c9" />
        <path d="M 584 178 a 9 9 0 0 1 18 0 Z" fill="#f2f5f7" stroke="#b9c3c9" />
        <path d="M 612 188 l 3 -20 h 8 l 3 20 Z" fill="#cfd8dc" stroke="#b9c3c9" />
      </Feature>

      {/* Coal plant (south-west) */}
      <g>
        <title>{coalStatus === 'done' ? 'Coal plant (closed)' : 'Coal power plant'}</title>
        <g opacity={coalStatus === 'done' ? 0.45 : 1} style={{ transition: 'opacity 1s' }}>
          <rect x="296" y="350" width="44" height="22" fill="#6d6560" />
          <rect x="302" y="322" width="8" height="30" fill="#857b74" />
          <rect x="316" y="316" width="8" height="36" fill="#857b74" />
        </g>
        {smokeLevel > 0 && (
          <g className="smoke" fill="#8d8d8d" opacity={0.35 + smokeLevel * 0.5}>
            {[0, 1, 2].map((i) => (
              <circle key={`a${i}`} cx="306" cy="316" r={6 + smokeLevel * 6} style={{ animationDelay: `${i * 1}s` }} />
            ))}
            {[0, 1, 2].map((i) => (
              <circle key={`b${i}`} cx="320" cy="310" r={6 + smokeLevel * 7} style={{ animationDelay: `${i * 1 + 0.5}s` }} />
            ))}
          </g>
        )}
      </g>

      {/* City buildings (+ solar panels on the roofs) */}
      <g>
        {[...visibleBuildings]
          .sort((a, b) => a[1] - b[1])
          .map(([x, by, w, h], i) => (
            <motion.g key={`${x}-${by}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect
                x={x}
                y={by - h}
                width={w}
                height={h}
                fill={greenRoofs ? '#e9f4e7' : '#eef1f3'}
                stroke={greenRoofs ? '#8cc58f' : '#c2ccd2'}
                strokeWidth="1"
              />
              {greenRoofs && <rect x={x} y={by - h - 1.5} width={w} height="1.5" fill="#5fb15f" />}
              {Array.from({ length: Math.floor(h / 10) }).map((_, r) => (
                <rect key={r} x={x + 3} y={by - h + 5 + r * 10} width={w - 6} height="3" fill="#9fb3bf" />
              ))}
              {f('solar') !== 'none' && (f('solar') === 'done' || i % 3 === 0) && (
                <rect x={x + 1} y={by - h - 3} width={w - 2} height="3" fill="#2f5fb3" opacity={f('solar') === 'done' ? 1 : 0.5} />
              )}
            </motion.g>
          ))}
      </g>

      {/* Water recycling plant */}
      <Feature status={f('waterRecycling')} title="Water recycling plant">
        <rect x="402" y="330" width="16" height="16" fill="#cfe9f2" stroke="#7fb6c9" />
        <ellipse cx="410" cy="330" rx="8" ry="3" fill="#7fc6de" />
        <rect x="422" y="334" width="16" height="12" fill="#cfe9f2" stroke="#7fb6c9" />
        <ellipse cx="430" cy="334" rx="8" ry="3" fill="#7fc6de" />
      </Feature>

      {/* Grid battery storage */}
      <Feature status={f('batteryStorage')} title="Grid battery storage">
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={350 + i * 11} y="372" width="9" height="12" rx="1" fill="#f2f5f7" stroke="#8cc58f" />
            <path d={`M${355 + i * 11} 375 l -2 4 h 3 l -2 4`} stroke="#3f9b5a" strokeWidth="1.2" fill="none" />
          </g>
        ))}
      </Feature>

      {/* MRT line */}
      <Feature status={f('mrt')} title="MRT metro line">
        <polyline
          points="270,330 300,300 350,268 405,262 445,292"
          fill="none"
          stroke="#e0603f"
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray={f('mrt') === 'building' ? '6 6' : undefined}
        />
        {[
          [270, 330], [300, 300], [350, 268], [405, 262], [445, 292],
        ].map(([x, y]) => (
          <circle key={x} cx={x} cy={y} r="4.5" fill="white" stroke="#e0603f" strokeWidth="2.5" />
        ))}
      </Feature>

      {/* Sea wall along the south-west coast */}
      <Feature status={f('seaWall')} title="Sea wall">
        <path
          d="M 222 296 C 224 320, 236 342, 254 354 C 274 372, 300 388, 336 398"
          fill="none"
          stroke="#8d969c"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={f('seaWall') === 'building' ? '10 8' : undefined}
        />
      </Feature>

      {/* Offshore wind farm (west, in the strait) */}
      <Feature status={f('offshoreWind')} title="Offshore wind farm">
        {(f('offshoreWind') === 'done' ? TURBINES : TURBINES.slice(0, 3)).map(([x, y]) => (
          <Turbine key={x} x={x} y={y} spinning={f('offshoreWind') === 'done'} />
        ))}
      </Feature>

      <Feature status={f('offshoreWind2')} title="Offshore wind farm, phase 2">
        {(f('offshoreWind2') === 'done' ? TURBINES_2 : TURBINES_2.slice(0, 2)).map(([x, y]) => (
          <Turbine key={x} x={x} y={y} spinning={f('offshoreWind2') === 'done'} />
        ))}
      </Feature>

      {/* Smog over the city, and a haze over everything */}
      <ellipse cx="330" cy="290" rx="120" ry="70" fill="#7d7464" opacity={smog * 0.9} filter="url(#blur-lg)" style={{ transition: 'opacity 1s' }} />
      <rect width="800" height="500" fill="#8a8270" opacity={smog * 0.22} style={{ transition: 'opacity 1s' }} pointerEvents="none" />

      {/* Drifting clouds */}
      <g className="clouds" fill="white" opacity="0.75">
        <g className="cloud cloud-1">
          <ellipse cx="0" cy="0" rx="34" ry="11" />
          <ellipse cx="14" cy="-8" rx="18" ry="10" />
        </g>
        <g className="cloud cloud-2">
          <ellipse cx="0" cy="0" rx="26" ry="9" />
          <ellipse cx="-10" cy="-6" rx="14" ry="8" />
        </g>
      </g>
    </svg>
  );
}
