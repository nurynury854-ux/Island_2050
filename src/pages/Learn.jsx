import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { POLICIES } from '../game/policies.js';
import { SdgChip, EffectList, formatMoney } from '../components/Bits.jsx';
import { YEARS_PER_TURN } from '../game/constants.js';
import './Content.css';

const CATEGORIES = ['All', ...new Set(POLICIES.map((p) => p.category))];

export default function Learn() {
  const [category, setCategory] = useState('All');
  const shown = POLICIES.filter((p) => category === 'All' || p.category === category);

  return (
    <div className="content-page">
      <header className="container page-header">
        <span className="kicker">Policy encyclopedia</span>
        <h1>The real choices behind the game</h1>
        <p>
          Every policy card in Island 2050 is based on a real decision that Taiwan and other countries face. Here’s what each
          one is, what it looks like in the real world, and why it isn’t an easy yes.
        </p>
        <div className="filter-row" role="tablist" aria-label="Filter by category">
          {CATEGORIES.map((c) => (
            <button key={c} role="tab" aria-selected={c === category} className={c === category ? 'active' : ''} onClick={() => setCategory(c)}>
              {c}
            </button>
          ))}
        </div>
      </header>

      <div className="container learn-list">
        <AnimatePresence mode="popLayout">
          {shown.map((p) => {
            const oneTime = { ...p.instant };
            for (const [k, v] of Object.entries(p.onComplete)) oneTime[k] = (oneTime[k] ?? 0) + v;
            return (
              <motion.article
                key={p.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="card learn-card"
                id={p.id}
              >
                <div className="learn-head">
                  <span className="learn-icon">{p.icon}</span>
                  <div>
                    <span className="kicker">{p.category}</span>
                    <h2>{p.name}</h2>
                  </div>
                  <div className="learn-sdgs">
                    {p.sdgs.map((id) => (
                      <SdgChip key={id} id={id} long />
                    ))}
                  </div>
                </div>
                <p className="learn-summary">{p.learn.summary}</p>
                <div className="learn-cols">
                  <div className="learn-box learn-real">
                    <h3>🌏 In the real world</h3>
                    <p>{p.learn.realWorld}</p>
                  </div>
                  <div className="learn-box learn-trade">
                    <h3>⚖️ The tradeoff</h3>
                    <p>{p.learn.tradeoff}</p>
                  </div>
                  <div className="learn-box learn-game">
                    <h3>🎮 In the game</h3>
                    <p className="muted small">
                      {p.cost === 0 ? 'Free' : formatMoney(p.cost)} ·{' '}
                      {p.upkeep < 0 ? `earns ${formatMoney(-p.upkeep)}` : `upkeep ${formatMoney(p.upkeep)}`}/term
                      {p.buildTime > 0 && ` · ${p.buildTime * YEARS_PER_TURN} years to build`}
                    </p>
                    <EffectList effects={oneTime} />
                    <EffectList effects={p.perTurn} suffix="/term" />
                    {p.requires && <p className="small muted">Requires: {p.requires.reason}</p>}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>

        <div className="wip-banner">
          🚧 <b>Work in progress:</b> links to an official source for every fact are coming in the final version.
        </div>

        <div className="content-cta">
          <Link to="/play/setup" className="btn btn-primary btn-lg">
            Try them in the game →
          </Link>
        </div>
      </div>
    </div>
  );
}
