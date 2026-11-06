import { useState } from 'react';
import { Link } from 'react-router-dom';
import { loadRuns, clearRuns } from '../game/storage.js';
import { ENDING_BY_ID } from '../game/story.js';
import { DIFFICULTIES } from '../game/constants.js';
import './Content.css';

export default function Hall() {
  const [runs, setRuns] = useState(loadRuns);
  const sorted = [...runs].sort((a, b) => b.overall - a.overall);

  return (
    <div className="content-page">
      <header className="container page-header">
        <span className="kicker">Hall of Islands</span>
        <h1>Islands that came before</h1>
        <p>Every island you finish is recorded here. Can you beat your best score?</p>
      </header>

      <div className="container hall">
        <div className="wip-banner">
          🌐 <b>Coming in the final version:</b> a global leaderboard shared by all players, plus stats like “68% of leaders
          kept the coal plant running past 2040.” For now, this list only shows games played in this browser.
        </div>

        {sorted.length === 0 ? (
          <div className="card hall-empty">
            <div className="hall-empty-icon">🏝️</div>
            <h2>No islands yet</h2>
            <p className="muted">Finish a game and it will show up here.</p>
            <Link to="/play/setup" className="btn btn-primary">
              Start your first term
            </Link>
          </div>
        ) : (
          <div className="card hall-table-wrap">
            <table className="hall-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Island</th>
                  <th>Ending</th>
                  <th>Score</th>
                  <th>Difficulty</th>
                  <th>Played</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((r, i) => {
                  const ending = ENDING_BY_ID[r.ending];
                  return (
                    <tr key={r.id}>
                      <td className="muted">{i + 1}</td>
                      <td>
                        <b>{r.islandName}</b>
                        {r.yearReached < 2050 && <span className="muted small"> (until {r.yearReached})</span>}
                      </td>
                      <td>
                        <span className="ending-pill" style={{ background: ending?.color }}>
                          {ending?.icon} {ending?.title}
                        </span>
                      </td>
                      <td className="hall-score">{r.overall}</td>
                      <td>{DIFFICULTIES[r.difficulty]?.label}</td>
                      <td className="muted small">{r.finishedAt ? new Date(r.finishedAt).toLocaleDateString() : '–'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <button
              className="btn btn-ghost btn-sm hall-clear"
              onClick={() => {
                if (confirm('Delete all saved results from this browser?')) {
                  clearRuns();
                  setRuns([]);
                }
              }}
            >
              Clear history
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
