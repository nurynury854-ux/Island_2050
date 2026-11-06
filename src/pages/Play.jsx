// ─────────────────────────────────────────────────────────────
//  The game screen. It shows the island, the stats, and the
//  policy cards, plus whichever pop-up belongs to the current phase:
//    'chapter'  → story screen
//    'planning' → pick policies (no pop-up)
//    'event'    → event pop-up
//    'report'   → term report pop-up
//    'ended'    → go to the results page
// ─────────────────────────────────────────────────────────────

import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useGame } from '../game/GameContext.jsx';
import { POLICIES, POLICY_BY_ID } from '../game/policies.js';
import { canEnact, islandFeatures } from '../game/engine.js';
import { MAX_POLICIES_PER_TURN, termLabel } from '../game/constants.js';
import IslandMap from '../components/IslandMap.jsx';
import Hud from '../components/play/Hud.jsx';
import SidePanel from '../components/play/SidePanel.jsx';
import PolicyCard from '../components/play/PolicyCard.jsx';
import ChapterOverlay from '../components/play/ChapterOverlay.jsx';
import EventModal from '../components/play/EventModal.jsx';
import ReportModal from '../components/play/ReportModal.jsx';
import { formatMoney } from '../components/Bits.jsx';
import './Play.css';

export default function Play() {
  const { game, closeChapter, enactPolicies, resolveEvent, nextTurn } = useGame();
  const navigate = useNavigate();

  if (!game) return <Navigate to="/play/setup" replace />;
  if (game.phase === 'ended') return <Navigate to="/play/results" replace />;

  return (
    <div className="play">
      <Hud game={game} onQuit={() => navigate('/')} />

      <div className="play-body">
        <div className="play-main">
          <div className="map-card">
            <IslandMap stats={game.stats} features={islandFeatures(game)} fit="slice" />
            <div className="map-year">{termLabel(game.turn)}</div>
          </div>

          {/* key={game.turn} gives the tray a fresh, empty selection every term */}
          <PolicyTray key={game.turn} game={game} onEnact={enactPolicies} />
        </div>

        <SidePanel game={game} />
      </div>

      <AnimatePresence>
        {game.phase === 'chapter' && <ChapterOverlay key="chapter" game={game} onClose={closeChapter} />}
        {game.phase === 'event' && <EventModal key="event" game={game} onChoose={resolveEvent} />}
        {game.phase === 'report' && <ReportModal key="report" game={game} onContinue={nextTurn} />}
      </AnimatePresence>
    </div>
  );
}

function PolicyTray({ game, onEnact }) {
  const [selected, setSelected] = useState([]);
  const [category, setCategory] = useState('All');
  const available = POLICIES.filter((p) => !game.policies[p.id]);
  const categories = ['All', ...new Set(available.map((p) => p.category))];
  // Cards you could afford at the start of the term come first; locked ones go to the end.
  // (Sorted by the start-of-term state so cards don't jump around while you select.)
  const shown = available
    .filter((p) => category === 'All' || p.category === category)
    .map((p) => ({ policy: p, check: canEnact(game, p.id, selected), openAtStart: canEnact(game, p.id, []).ok }))
    .sort((a, b) => Number(b.openAtStart) - Number(a.openAtStart));
  const totalCost = selected.reduce((sum, id) => sum + POLICY_BY_ID[id].cost, 0);
  const planning = game.phase === 'planning';

  function toggle(id) {
    setSelected((sel) => (sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]));
  }

  return (
    <section className="tray">
      <div className="tray-head">
        <div>
          <h2>Policies this term</h2>
          <p className="muted">
            Choose up to {MAX_POLICIES_PER_TURN}. Effects marked “/term” repeat every term once the project is finished.
          </p>
        </div>
      </div>

      {available.length === 0 ? (
        <div className="card tray-empty">
          🎉 You’ve enacted every policy available in this version. More are coming in the final version! Keep ending
          terms to reach 2050.
        </div>
      ) : (
        <>
          <div className="filter-row tray-filters" role="tablist" aria-label="Filter policies by category">
            {categories.map((c) => (
              <button key={c} role="tab" aria-selected={c === category} className={c === category ? 'active' : ''} onClick={() => setCategory(c)}>
                {c}
                <span className="filter-count">
                  {c === 'All' ? available.length : available.filter((p) => p.category === c).length}
                </span>
              </button>
            ))}
          </div>
          <div className="policy-grid">
            {shown.map(({ policy, check }) => (
              <PolicyCard
                key={policy.id}
                policy={policy}
                selected={selected.includes(policy.id)}
                disabledReason={check.ok ? null : check.reason}
                onToggle={() => toggle(policy.id)}
              />
            ))}
          </div>
        </>
      )}

      <div className="end-bar">
        <div className="end-bar-info">
          {!planning ? (
            <span>The term is ending…</span>
          ) : (
            <>
          <span>
            <b>
              {selected.length}/{MAX_POLICIES_PER_TURN}
            </b>{' '}
            selected
          </span>
          <span>
            Cost <b>{formatMoney(totalCost)}</b>
          </span>
          <span>
            Left after <b className={game.budget - totalCost < 50 ? 'warn' : ''}>{formatMoney(game.budget - totalCost)}</b>
          </span>
            </>
          )}
        </div>
        <button className="btn btn-primary btn-lg" disabled={!planning} onClick={() => onEnact(selected)}>
          {selected.length === 0 ? 'Skip & end term →' : 'Pass policies & end term →'}
        </button>
      </div>
    </section>
  );
}
