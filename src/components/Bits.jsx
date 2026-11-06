// Small reusable pieces used on many pages.
import { motion } from 'framer-motion';
import { STAT_INFO } from '../game/constants.js';
import { SDGS } from '../game/sdgs.js';

const SDG_BY_ID = Object.fromEntries(SDGS.map((s) => [s.id, s]));

/** Colored SDG badge, e.g. [7] Energy */
export function SdgChip({ id, long = false }) {
  const sdg = SDG_BY_ID[id];
  if (!sdg) return null;
  return (
    <span className="sdg-chip" style={{ background: sdg.color }} title={`SDG ${sdg.number}: ${sdg.name}`}>
      <b>{sdg.number}</b>
      {long ? sdg.name : sdg.short}
    </span>
  );
}

export const formatMoney = (n) => `${n < 0 ? '−' : ''}$${Math.abs(Math.round(n))}M`;

/** Turns { gdp: 5, water: -3 } into "▲ +5 Economy  ▼ −3 Water" with green/red colors. */
export function EffectList({ effects = {}, suffix = '' }) {
  const items = Object.entries(effects).filter(([, v]) => Math.round(v * 10) !== 0);
  if (!items.length) return null;
  return (
    <ul className="effects">
      {items.map(([key, value]) => {
        const info = STAT_INFO[key];
        if (!info) return null;
        const good = info.goodWhenHigh ? value > 0 : value < 0;
        const shown = info.money ? formatMoney(value) : `${value > 0 ? '+' : '−'}${Math.abs(Math.round(value * 10) / 10)}`;
        return (
          <li key={key} className={good ? 'good' : 'bad'}>
            {value > 0 ? '▲' : '▼'} {info.money && value > 0 ? '+' : ''}
            {shown} {info.label}
            {suffix}
          </li>
        );
      })}
    </ul>
  );
}

/** A horizontal bar that animates to `value` (0–100). */
export function Meter({ value, color = 'var(--leaf-500)', height = 10 }) {
  return (
    <div className="meter" style={{ height, background: 'rgb(0 0 0 / 0.08)', borderRadius: 999, overflow: 'hidden' }}>
      <motion.div
        style={{ height: '100%', background: color, borderRadius: 999 }}
        initial={false}
        animate={{ width: `${Math.max(2, Math.min(100, value))}%` }}
        transition={{ type: 'spring', stiffness: 80, damping: 18 }}
      />
    </div>
  );
}
