// Right-hand panel: SDG scores, the island's stats, citizens' moods, and your projects.
import CitizenAvatar from '../CitizenAvatar.jsx';
import { Meter } from '../Bits.jsx';
import { SDGS, computeSdgScores, overallScore } from '../../game/sdgs.js';
import { CITIZENS, CITIZEN_IDS, citizenMood } from '../../game/citizens.js';
import { STAT_INFO, yearOfTurn } from '../../game/constants.js';
import { POLICY_BY_ID } from '../../game/policies.js';

const STAT_ORDER = ['gdp', 'emissions', 'renewable', 'water', 'airQuality', 'ecosystem', 'resilience'];

export default function SidePanel({ game }) {
  const scores = computeSdgScores(game.stats);
  const overall = overallScore(game.stats);
  const projects = Object.entries(game.policies);

  return (
    <aside className="side-panel">
      <section className="panel-block" data-tour="sdgs">
        <div className="panel-head">
          <h3>SDG scores</h3>
          <span className="overall" title="Average of all six goals">
            {overall}
            <small>/100</small>
          </span>
        </div>
        <div className="sdg-meters">
          {SDGS.map((sdg) => (
            <div key={sdg.id} className="sdg-meter" title={sdg.measuredBy}>
              <span className="sdg-meter-num" style={{ background: sdg.color }}>
                {sdg.number}
              </span>
              <span className="sdg-meter-name">{sdg.short}</span>
              <Meter value={scores[sdg.id]} color={sdg.color} />
              <span className="sdg-meter-val">{scores[sdg.id]}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel-block">
        <h3>Island stats</h3>
        <div className="stat-grid">
          {STAT_ORDER.map((key) => {
            const info = STAT_INFO[key];
            return (
              <div key={key} className="stat-tile">
                <span className="stat-icon">{info.icon}</span>
                <span className="stat-label">{info.label}</span>
                <span className="stat-val">
                  {Math.round(game.stats[key])}
                  {info.unit ?? ''}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="panel-block" data-tour="citizens">
        <h3>Citizens</h3>
        <div className="citizen-moods">
          {CITIZEN_IDS.map((id) => (
            <div key={id} className="citizen-mood" title={`${CITIZENS[id].name} cares about ${CITIZENS[id].cares}`}>
              <CitizenAvatar id={id} mood={citizenMood(id, game.stats)} size={44} />
              <span>{CITIZENS[id].name.replace('Grandma ', '')}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel-block">
        <h3>Your projects</h3>
        {projects.length === 0 ? (
          <p className="muted small">Nothing yet. Pick policies below to get started.</p>
        ) : (
          <ul className="project-list">
            {projects.map(([id, p]) => (
              <li key={id}>
                <span>
                  {POLICY_BY_ID[id].icon} {POLICY_BY_ID[id].name}
                </span>
                {p.done ? (
                  <span className="tag tag-done">Active</span>
                ) : (
                  <span className="tag tag-building">🚧 ready {yearOfTurn(p.completeTurn + 1)}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </aside>
  );
}
