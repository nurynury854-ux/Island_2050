// One policy card in the game. Click to select/unselect it.
import { motion } from 'framer-motion';
import { SdgChip, EffectList, formatMoney } from '../Bits.jsx';
import { YEARS_PER_TURN } from '../../game/constants.js';

export default function PolicyCard({ policy, selected, disabledReason, onToggle }) {
  const locked = Boolean(disabledReason) && !selected;
  const oneTime = { ...policy.instant };
  for (const [k, v] of Object.entries(policy.onComplete)) oneTime[k] = (oneTime[k] ?? 0) + v;

  return (
    <motion.button
      type="button"
      layout
      className={`policy-card ${selected ? 'selected' : ''} ${locked ? 'locked' : ''}`}
      onClick={onToggle}
      disabled={locked}
      whileHover={locked ? undefined : { y: -3 }}
      aria-pressed={selected}
    >
      <div className="policy-top">
        <span className="policy-icon" aria-hidden="true">
          {policy.icon}
        </span>
        <span className="policy-category">{policy.category}</span>
        {selected && <span className="policy-check">✓</span>}
      </div>
      <h4>{policy.name}</h4>
      <p className="policy-desc">{policy.description}</p>

      <div className="policy-effects">
        <EffectList effects={oneTime} />
        <EffectList effects={policy.perTurn} suffix="/term" />
      </div>

      <div className="policy-footer">
        <div className="policy-sdgs">
          {policy.sdgs.map((id) => (
            <SdgChip key={id} id={id} />
          ))}
        </div>
        <div className="policy-costs">
          <span className="policy-cost">{policy.cost === 0 ? 'Free' : formatMoney(policy.cost)}</span>
          <span className="muted">
            {policy.upkeep < 0 ? `earns ${formatMoney(-policy.upkeep)}` : `upkeep ${formatMoney(policy.upkeep)}`}/term
            {policy.buildTime > 0 && ` · builds ${policy.buildTime * YEARS_PER_TURN} yrs`}
          </span>
        </div>
      </div>

      {locked && <div className="policy-lock">🔒 {disabledReason}</div>}
    </motion.button>
  );
}
