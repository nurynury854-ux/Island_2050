import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import IslandMap from '../components/IslandMap.jsx';
import CitizenAvatar from '../components/CitizenAvatar.jsx';
import { SDGS } from '../game/sdgs.js';
import { CITIZENS, CITIZEN_IDS } from '../game/citizens.js';
import { SCENES } from '../game/scenes.js';
import { useGame } from '../game/GameContext.jsx';
import './Home.css';

const STEPS = [
  {
    icon: '📜',
    title: 'Pass policies',
    text: 'Every two years, choose up to two policies: wind farms, carbon taxes, metro lines, chip fabs. Each one has a price and a tradeoff.',
  },
  {
    icon: '🌀',
    title: 'Face the world',
    text: 'Typhoons, droughts, heatwaves and price shocks. Your earlier choices decide how hard they hit.',
  },
  {
    icon: '🗳️',
    title: 'Answer to your people',
    text: 'Fishermen, farmers, students and workers all react. Lose their trust and you’ll be voted out.',
  },
  {
    icon: '📊',
    title: 'See your 2050',
    text: 'Get a report card on six Sustainable Development Goals and find out which future you built.',
  },
];

export default function Home() {
  const { game } = useGame();
  const [sceneIndex, setSceneIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const scene = SCENES[sceneIndex];
  const inProgress = game && game.phase !== 'ended';

  // Switch scenes automatically every 5 seconds (until the user clicks one).
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setSceneIndex((i) => (i + 1) % SCENES.length), 5000);
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <div className="home">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="container hero-inner">
          <motion.div className="hero-text" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="kicker">An SDG simulation game</span>
            <h1>
              One island.
              <br />
              Twenty-four years.
              <br />
              <em>Every choice counts.</em>
            </h1>
            <p className="hero-lede">
              You’ve just been elected leader of Penglai, a small island a lot like Taiwan. Can you reach 2050 with clean
              energy, safe water and a working economy, without losing the people who elected you?
            </p>
            <div className="hero-actions">
              <Link to="/play/setup" className="btn btn-primary btn-lg">
                Begin your term →
              </Link>
              {inProgress && (
                <Link to="/play" className="btn btn-ghost btn-lg">
                  Continue {game.islandName}
                </Link>
              )}
            </div>
            <p className="hero-meta">⏱ About 10 minutes · No sign-up · Progress saves automatically</p>
          </motion.div>

          <div className="hero-visual">
            <div className="hero-map-frame">
              <IslandMap stats={scene.stats} features={scene.features} />
              <AnimatePresence mode="wait">
                <motion.p
                  key={scene.id}
                  className="hero-caption"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  {scene.caption}
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="scene-tabs" role="tablist" aria-label="Island scenarios">
              {SCENES.map((s, i) => (
                <button
                  key={s.id}
                  role="tab"
                  aria-selected={i === sceneIndex}
                  className={i === sceneIndex ? 'active' : ''}
                  onClick={() => {
                    setSceneIndex(i);
                    setPaused(true);
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="section">
        <div className="container">
          <span className="kicker">How it works</span>
          <h2 className="section-title">Twelve terms to shape a future</h2>
          <div className="steps">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.title}
                className="card step"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="step-icon">{s.icon}</div>
                <div className="step-num">0{i + 1}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SDGs ── */}
      <section className="section section-sand">
        <div className="container">
          <span className="kicker">What’s at stake</span>
          <h2 className="section-title">Six goals. They don’t always agree.</h2>
          <p className="section-lede">
            The UN’s 17 Sustainable Development Goals are a shared plan for a better world by 2030. Island 2050 follows six
            of them. The hard part is that helping one can hurt another.
          </p>
          <div className="sdg-grid">
            {SDGS.map((sdg) => (
              <div key={sdg.id} className="sdg-tile" style={{ '--sdg': sdg.color }}>
                <div className="sdg-tile-num">{sdg.number}</div>
                <div>
                  <h3>{sdg.name}</h3>
                  <p>{sdg.why}</p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/sdgs" className="btn btn-dark">
            How the game measures each goal →
          </Link>
        </div>
      </section>

      {/* ── Citizens ── */}
      <section className="section">
        <div className="container">
          <span className="kicker">The people</span>
          <h2 className="section-title">Meet the islanders</h2>
          <p className="section-lede">Every policy helps someone and costs someone else. They’ll let you know how they feel.</p>
          <div className="citizens-row">
            {CITIZEN_IDS.map((id) => (
              <div key={id} className="citizen-card">
                <CitizenAvatar id={id} mood="happy" size={88} showBadge={false} />
                <h3>{CITIZENS[id].name}</h3>
                <div className="muted">{CITIZENS[id].role}</div>
                <div className="citizen-cares">Cares about {CITIZENS[id].cares}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why an island ── */}
      <section className="section section-ocean">
        <div className="container why">
          <div>
            <span className="kicker">Why an island?</span>
            <h2>Islands feel the future first.</h2>
          </div>
          <div>
            <p>
              On an island there’s nowhere to hide from your choices. Fresh water only comes from the rain, almost all fuel has
              to be imported, and when the sea rises, the coast is where everyone lives.
            </p>
            <p>
              Penglai is fictional, but it is inspired by Taiwan: a rich, high-tech island that runs on imported coal and gas,
              that chip factories and rice farmers depend on for water, and that typhoons hit every year. Every policy in the
              game links to real-world facts on the <Link to="/learn">Learn</Link> page.
            </p>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="section final-cta">
        <div className="container">
          <h2>The people of Penglai are waiting.</h2>
          <Link to="/play/setup" className="btn btn-primary btn-lg">
            Take office →
          </Link>
        </div>
      </section>
    </div>
  );
}
