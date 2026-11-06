// ✏️ This page is a DRAFT. The parts marked "write in your own words" are for you to fill in.
import { Link } from 'react-router-dom';
import CitizenAvatar from '../components/CitizenAvatar.jsx';
import './Content.css';

const TECH = [
  ['React', 'builds the interface from reusable components'],
  ['Vite', 'runs the development server and builds the site'],
  ['React Router', 'gives each page its own URL'],
  ['Framer Motion', 'animations: pop-ups, meters, the island'],
  ['Recharts', 'the charts on the results page'],
  ['SVG', 'the island map is drawn entirely in code'],
  ['localStorage', 'saves your game and past results in the browser'],
];

export default function About() {
  return (
    <div className="content-page">
      <header className="container page-header">
        <span className="kicker">About</span>
        <h1>Behind Island 2050</h1>
        <p>A Web Programming final project about the UN Sustainable Development Goals.</p>
      </header>

      <div className="container about">
        <section className="card about-creator">
          <CitizenAvatar id="advisor" mood="happy" size={120} showBadge={false} />
          <div>
            <h2>The creator</h2>
            <p className="placeholder">
              ✏️ Write in your own words: who you are, your major and year, and the fun fact that every citizen in the game
              is played by you.
            </p>
          </div>
        </section>

        <section className="card">
          <h2>Why I made this</h2>
          <p className="placeholder">
            ✏️ Write in your own words: why a game instead of an info page, why an island, and what you want players to take
            away (sustainability is about tradeoffs, not easy answers).
          </p>
        </section>

        <section className="card">
          <h2>How it was built</h2>
          <ul className="tech-list">
            {TECH.map(([name, what]) => (
              <li key={name}>
                <b>{name}</b> {what}
              </li>
            ))}
          </ul>
          <p className="muted">
            The game’s rules live in plain JavaScript files (the “engine”), separate from the interface. Policies, events and
            citizens are data, so new content can be added without changing the code. Parts of the React code were written
            with the help of an AI coding assistant.
          </p>
        </section>

        <section className="card">
          <h2>Sources</h2>
          <p className="placeholder">
            🚧 Coming in the final version: links to official sources for every fact on the <Link to="/learn">Learn</Link>{' '}
            page (Taiwan’s National Development Council, Ministry of Environment, Water Resources Agency, Central Weather
            Administration, the UN SDG site, and more).
          </p>
          <p className="muted small">
            Penglai is a fictional island. The game’s numbers are simplified for gameplay and are not a scientific model.
          </p>
        </section>
      </div>
    </div>
  );
}
