// About page. The creator and "why" texts are Nury's own words. The Sources section is filled in for the final version.
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
            <p>
              My name is Nursoltan (Nury), and I’m currently an Informatics student at YZU. Every citizen in the game is
              played by me, so you can enjoy me in different costumes there, heheh.
            </p>
          </div>
        </section>

        <section className="card">
          <h2>Why I made this</h2>
          <p>
            Well, I’ve always wondered why some politicians make certain decisions, and what would have happened if they had
            made the decision I wanted. So I made a game, or you could say a simulator, that simulates the decisions you make
            and shows you their results and consequences.
          </p>
          <p>
            This way, players can learn and realize that every decision has a reason behind it, because it affects something
            else. Every SDG improvement leads to something else being affected. The main message I want players to take away
            is that sustainability is about tradeoffs, and everything requires a sacrifice.
          </p>
          <p>
            As for why an island: managing an entire country would be complicated, so a simple island is a good starting
            point, hehehe.
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
