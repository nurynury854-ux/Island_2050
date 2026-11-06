import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useGame } from '../game/GameContext.jsx';
import { islandFeatures } from '../game/engine.js';
import { SDGS, computeSdgScores, overallScore } from '../game/sdgs.js';
import { ENDING_BY_ID, fillIsland } from '../game/story.js';
import { POLICY_BY_ID } from '../game/policies.js';
import { DIFFICULTIES } from '../game/constants.js';
import IslandMap from '../components/IslandMap.jsx';
import { Meter } from '../components/Bits.jsx';
import './Results.css';

const grade = (score) => (score >= 80 ? 'A' : score >= 65 ? 'B' : score >= 50 ? 'C' : score >= 35 ? 'D' : 'F');

const CHART_LINES = [
  { key: 'overall', label: 'SDG score', color: '#12415a', width: 3 },
  { key: 'gdp', label: 'Economy', color: '#A21942' },
  { key: 'emissions', label: 'Emissions', color: '#7d7464' },
  { key: 'renewable', label: 'Renewables %', color: '#e0a400' },
  { key: 'approval', label: 'Approval', color: '#1d7a8c' },
];

export default function Results() {
  const { game } = useGame();
  const [copied, setCopied] = useState(false);

  if (!game || game.phase !== 'ended') {
    return (
      <div className="container page-header results-empty">
        <span className="kicker">2050 report card</span>
        <h1>No finished game yet</h1>
        <p>Play through to 2050 (or get voted out trying) and your island’s report card will appear here.</p>
        <Link to={game ? '/play' : '/play/setup'} className="btn btn-primary">
          {game ? 'Continue your game' : 'Start a game'} →
        </Link>
      </div>
    );
  }

  const ending = ENDING_BY_ID[game.ending];
  const scores = computeSdgScores(game.stats);
  const overall = overallScore(game.stats);
  const finalYear = game.history.at(-1).year;
  const chartData = game.history.map((h) => ({
    year: h.year,
    overall: h.overall,
    gdp: Math.round(h.stats.gdp),
    emissions: Math.round(h.stats.emissions),
    renewable: Math.round(h.stats.renewable),
    approval: Math.round(h.stats.approval),
  }));

  async function share() {
    const text = `I led ${game.islandName} to the “${ending.title}” ending in Island 2050 with an SDG score of ${overall}/100. Can you do better?`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: ignore */
    }
  }

  return (
    <div className="results">
      {/* ── Ending ── */}
      <section className="results-hero" style={{ '--ending': ending.color }}>
        <div className="container results-hero-inner">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="kicker">
              {game.islandName} · {finalYear} · {DIFFICULTIES[game.difficulty].label}
            </span>
            <div className="ending-icon">{ending.icon}</div>
            <h1>{ending.title}</h1>
            <p className="ending-text">{fillIsland(ending.text, game.islandName)}</p>
            <div className="results-actions">
              <Link to="/play/setup" className="btn btn-primary">
                Play again
              </Link>
              <button className="btn btn-ghost" onClick={share}>
                {copied ? 'Copied!' : 'Copy result to share'}
              </button>
            </div>
          </motion.div>
          <motion.div
            className="results-map"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <IslandMap stats={game.stats} features={islandFeatures(game)} />
          </motion.div>
        </div>
      </section>

      <div className="container results-body">
        {/* ── Report card ── */}
        <section className="card report-card">
          <div className="report-card-head">
            <div>
              <span className="kicker">Report card</span>
              <h2>How {game.islandName} did on the SDGs</h2>
            </div>
            <div className="big-score">
              <span>{overall}</span>
              <small>/100</small>
              <div className={`grade grade-${grade(overall)}`}>{grade(overall)}</div>
            </div>
          </div>
          <div className="report-card-rows">
            {SDGS.map((sdg, i) => (
              <motion.div
                key={sdg.id}
                className="rc-row"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
              >
                <span className="rc-num" style={{ background: sdg.color }}>
                  {sdg.number}
                </span>
                <div className="rc-name">
                  <b>{sdg.name}</b>
                  <span className="muted">{sdg.measuredBy}</span>
                </div>
                <Meter value={scores[sdg.id]} color={sdg.color} height={12} />
                <span className="rc-score">{scores[sdg.id]}</span>
                <span className={`grade grade-${grade(scores[sdg.id])}`}>{grade(scores[sdg.id])}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Chart ── */}
        <section className="card">
          <span className="kicker">Over time</span>
          <h2>Your island, year by year</h2>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={chartData} margin={{ top: 10, right: 16, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="#eee5d3" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 13 }} />
                {CHART_LINES.map((l) => (
                  <Line
                    key={l.key}
                    type="monotone"
                    dataKey={l.key}
                    name={l.label}
                    stroke={l.color}
                    strokeWidth={l.width ?? 2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* ── Timeline ── */}
        <section className="card">
          <span className="kicker">Your decisions</span>
          <h2>Timeline</h2>
          <ol className="timeline">
            {game.timeline.map((t) => (
              <li key={t.turn}>
                <div className="tl-term">{t.term}</div>
                <div className="tl-body">
                  <div>
                    {t.policies.length ? (
                      t.policies.map((id) => (
                        <span key={id} className="tl-policy">
                          {POLICY_BY_ID[id].icon} {POLICY_BY_ID[id].name}
                        </span>
                      ))
                    ) : (
                      <span className="muted">No new policies</span>
                    )}
                  </div>
                  <div className="tl-event">
                    {t.event.icon} {t.event.title} → <i>{t.event.choice}</i>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="results-next">
          <h2>Want to understand what happened?</h2>
          <p className="muted">Every policy in the game is based on real choices that Taiwan and other countries are making right now.</p>
          <div className="results-actions">
            <Link to="/learn" className="btn btn-dark">
              Explore the policies
            </Link>
            <Link to="/hall" className="btn btn-ghost">
              Hall of Islands
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
