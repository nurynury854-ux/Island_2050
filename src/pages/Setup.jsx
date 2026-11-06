import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CitizenAvatar from '../components/CitizenAvatar.jsx';
import { DIFFICULTIES, DEFAULT_ISLAND_NAME, TOTAL_TURNS, MAX_POLICIES_PER_TURN } from '../game/constants.js';
import { CITIZENS } from '../game/citizens.js';
import { useGame } from '../game/GameContext.jsx';
import { formatMoney } from '../components/Bits.jsx';
import './Setup.css';

export default function Setup() {
  const { game, newGame } = useGame();
  const navigate = useNavigate();
  const [islandName, setIslandName] = useState(DEFAULT_ISLAND_NAME);
  const [difficulty, setDifficulty] = useState('standard');
  const inProgress = game && game.phase !== 'ended';

  function start(e) {
    e.preventDefault();
    newGame({ islandName: islandName.slice(0, 24), difficulty });
    navigate('/play');
  }

  return (
    <div className="setup">
      <div className="container setup-inner">
        <form className="setup-form card" onSubmit={start}>
          <span className="kicker">New game</span>
          <h1>Take office</h1>

          <label className="field">
            <span className="field-label">Name your island</span>
            <input
              value={islandName}
              onChange={(e) => setIslandName(e.target.value)}
              maxLength={24}
              placeholder={DEFAULT_ISLAND_NAME}
            />
            <span className="field-hint">“Penglai” (蓬萊) is an old poetic name for a mythical island paradise.</span>
          </label>

          <fieldset className="field">
            <legend className="field-label">Difficulty</legend>
            <div className="difficulty-options">
              {Object.entries(DIFFICULTIES).map(([id, d]) => (
                <label key={id} className={`difficulty ${difficulty === id ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="difficulty"
                    value={id}
                    checked={difficulty === id}
                    onChange={() => setDifficulty(id)}
                  />
                  <b>{d.label}</b>
                  <span>{d.blurb}</span>
                  <small>Starting budget {formatMoney(d.startBudget)}</small>
                </label>
              ))}
            </div>
          </fieldset>

          {inProgress && (
            <p className="setup-warning">
              ⚠️ You have a game in progress on <b>{game.islandName}</b> ({game.history.at(-1).year}). Starting a new one
              will replace it. <Link to="/play">Continue it instead</Link>
            </p>
          )}

          <button className="btn btn-primary btn-lg" type="submit">
            Begin in 2026 →
          </button>
        </form>

        <aside className="setup-side">
          <div className="advisor-card">
            <CitizenAvatar id="advisor" mood="neutral" size={96} showBadge={false} />
            <div>
              <div className="advisor-name">{CITIZENS.advisor.name}</div>
              <p>
                “Welcome, Leader. I’ll be at your side for the next 24 years. Here’s what you need to know before we
                begin.”
              </p>
            </div>
          </div>
          <ul className="rules">
            <li>
              <b>🗓 {TOTAL_TURNS} terms</b> of 2 years each, from 2026 to 2050.
            </li>
            <li>
              <b>📜 Up to {MAX_POLICIES_PER_TURN} policies</b> per term, if you can afford them. Some take years to build.
            </li>
            <li>
              <b>🌀 One event</b> every term. Your earlier choices decide how much it hurts.
            </li>
            <li>
              <b>🗳 Elections</b> every 4 years. Below 35% approval and you’re out.
            </li>
            <li>
              <b>📊 Six SDGs</b> are scored at the end. Aim for balance, not perfection.
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
