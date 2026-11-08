// The frame around every page: navigation bar on top, footer at the bottom.
// <Outlet /> is where the current page gets drawn.
import { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useGame } from '../game/GameContext.jsx';
import { getReturnSlide } from '../game/storage.js';
import './Layout.css';

const NAV_LINKS = [
  { to: '/learn', label: 'Learn' },
  { to: '/sdgs', label: 'The SDGs' },
  { to: '/hall', label: 'Hall of Islands' },
  { to: '/about', label: 'About' },
];

export default function Layout({ bare = false }) {
  const { pathname, hash } = useLocation();
  const { game } = useGame();
  const hasGameInProgress = game && game.phase !== 'ended';
  // Set when the presenter jumps from the slides into the live demo.
  const returnSlide = getReturnSlide();

  // When the page changes: jump to #section if the link has one, otherwise go to the top.
  useEffect(() => {
    const target = hash && document.getElementById(hash.slice(1));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
    else window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <div className={`layout ${bare ? 'layout-bare' : ''}`}>
      <header className="nav">
        <div className="nav-inner">
          <Link to="/" className="nav-logo" aria-label="Island 2050 home">
            <LogoMark />
            <span>
              Island <b>2050</b>
            </span>
          </Link>
          {/* Shown after the presenter jumps from the slides into the live demo */}
          {returnSlide && (
            <Link to={`/present/${returnSlide}`} className="back-to-slides">
              ← Back to slides
            </Link>
          )}
          <nav className="nav-links" aria-label="Main">
            {NAV_LINKS.map((l) => (
              <NavLink key={l.to} to={l.to}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <Link to={hasGameInProgress ? '/play' : '/play/setup'} className="btn btn-primary btn-sm nav-cta">
            {hasGameInProgress ? 'Continue' : 'Play'}
          </Link>
        </div>
      </header>

      <main className="layout-main">
        <Outlet />
      </main>

      {!bare && (
        <footer className="footer">
          <div className="container footer-inner">
            <div>
              <div className="footer-logo">
                <LogoMark /> Island 2050
              </div>
              <p className="muted">
                A Web Programming final project about the UN Sustainable Development Goals.
                Penglai is a fictional island inspired by Taiwan.
              </p>
            </div>
            <div className="footer-links">
              <Link to="/play/setup">Play</Link>
              {NAV_LINKS.map((l) => (
                <Link key={l.to} to={l.to}>
                  {l.label}
                </Link>
              ))}
              <Link to="/present">Presentation</Link>
              <a href="https://sdgs.un.org/goals" target="_blank" rel="noreferrer">
                UN SDGs ↗
              </a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

function LogoMark() {
  return (
    <svg viewBox="0 0 64 64" width="30" height="30" aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill="#1d7a8c" />
      <path d="M14 38c2-9 10-17 20-18s16 6 15 14-9 12-18 12-18-2-17-8z" fill="#3f9b5a" stroke="#f2e6cc" strokeWidth="3" />
      <path d="M30 30l5-8 5 8z" fill="#2a6b3e" />
    </svg>
  );
}
