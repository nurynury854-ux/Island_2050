import { Link } from 'react-router-dom';
import { SDGS } from '../game/sdgs.js';
import { POLICIES } from '../game/policies.js';
import './Content.css';

export default function Sdgs() {
  return (
    <div className="content-page">
      <header className="container page-header">
        <span className="kicker">The Sustainable Development Goals</span>
        <h1>17 goals for the world. 6 for one island.</h1>
        <p>
          In 2015, all 193 UN member states agreed on 17 Sustainable Development Goals: a shared plan to end poverty, protect
          the planet and improve lives by 2030. Island 2050 focuses on the six that an island’s government has to juggle every
          day.
        </p>
      </header>

      <div className="container sdg-detail-list">
        {SDGS.map((sdg) => {
          const helpers = POLICIES.filter((p) => p.sdgs.includes(sdg.id));
          return (
            <article key={sdg.id} className="sdg-detail" style={{ '--sdg': sdg.color }}>
              <div className="sdg-detail-badge">
                <span>SDG</span>
                <b>{sdg.number}</b>
              </div>
              <div className="sdg-detail-body">
                <h2>{sdg.name}</h2>
                <p>{sdg.why}</p>
                <div className="sdg-detail-meta">
                  <div>
                    <h3>How the game measures it</h3>
                    <p>{sdg.measuredBy}</p>
                  </div>
                  <div>
                    <h3>Policies that help</h3>
                    <p>
                      {helpers.map((p, i) => (
                        <span key={p.id}>
                          <Link to={`/learn#${p.id}`}>
                            {p.icon} {p.name}
                          </Link>
                          {i < helpers.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          );
        })}

        <div className="card sdg-tradeoffs">
          <h2>Why you can’t max out everything</h2>
          <p>
            The goals depend on each other, and sometimes they conflict. A chip fab helps <b>SDG 8</b> (jobs) but drains water
            from <b>SDG 6</b>. A sea wall protects cities (<b>SDG 11</b>) but harms coastal life (<b>SDG 14</b>). Closing coal
            plants helps the climate (<b>SDG 13</b>) but costs workers their jobs. Real governments face exactly these
            tradeoffs, and that’s what the game is about.
          </p>
          <a href="https://sdgs.un.org/goals" target="_blank" rel="noreferrer">
            Read about all 17 goals at the United Nations ↗
          </a>
        </div>
      </div>
    </div>
  );
}
