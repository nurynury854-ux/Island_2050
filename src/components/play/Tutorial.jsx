// ─────────────────────────────────────────────────────────────
//  First-game tutorial: dims the screen, puts a "spotlight" on one
//  part of the game at a time, and explains it in a small card.
//
//  Each step points at an element marked with data-tour="..."
//  (see Hud.jsx, SidePanel.jsx and Play.jsx).
// ─────────────────────────────────────────────────────────────

import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MAX_POLICIES_PER_TURN, VOTE_OUT_THRESHOLD } from '../../game/constants.js';

const STEPS = [
  {
    target: 'hud',
    title: 'Money & trust',
    text: `Your budget and your approval. Taxes come in every term, and finished projects cost upkeep. Keep approval above ${VOTE_OUT_THRESHOLD}%, because there's an election every 4 years.`,
  },
  {
    target: 'map',
    title: 'Your island',
    text: 'The map changes as you play. Watch the smog over the city, the reservoir and rice paddies, the forests, and every project you build.',
  },
  {
    target: 'sdgs',
    title: 'The six SDGs',
    text: 'This is how your island will be judged in 2050. Hover over a goal to see how it is measured. Aim for balance: pushing one goal often hurts another.',
  },
  {
    target: 'citizens',
    title: 'Your people',
    text: 'Each citizen cares about something different. Their faces show how they feel about the island right now.',
  },
  {
    target: 'policy-card',
    title: 'Policies',
    text: `Pick up to ${MAX_POLICIES_PER_TURN} policies per term. Each card shows the cost, upkeep, build time, and effects. “/term” effects repeat every term once a project is finished.`,
  },
  {
    target: 'endbar',
    title: 'End the term',
    text: 'When you’re ready, end the term. Something will happen in the world, and you’ll see a report of what changed. Good luck, Leader!',
  },
];

const PAD = 8; // space around the spotlight

export default function Tutorial({ onClose }) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState(null);
  const current = STEPS[step];
  const last = step === STEPS.length - 1;

  const next = useCallback(() => (last ? onClose() : setStep((s) => s + 1)), [last, onClose]);

  // Find the highlighted element, scroll to it, and keep its position updated.
  useLayoutEffect(() => {
    const el = document.querySelector(`[data-tour="${current.target}"]`);
    if (!el) return;
    el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    const update = () => setRect(el.getBoundingClientRect());
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    const timer = setInterval(update, 200); // catches the smooth scroll as it moves
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
      clearInterval(timer);
    };
  }, [current.target]);

  // Keyboard: → = next, ← = back, Esc = close (Enter presses the focused Next button)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') setStep((s) => Math.max(0, s - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, onClose]);

  // Put the card below the spotlight if there's room, else above, else at the bottom of the screen.
  let cardStyle = { left: '50%', bottom: 24, transform: 'translateX(-50%)' };
  if (rect) {
    const vh = window.innerHeight;
    const left = Math.min(Math.max(16, rect.left + rect.width / 2 - 180), window.innerWidth - 376);
    if (vh - rect.bottom > 220) cardStyle = { left, top: rect.bottom + PAD + 12 };
    else if (rect.top > 260) cardStyle = { left, top: rect.top - PAD - 12, transform: 'translateY(-100%)' };
  }

  return (
    <div className="tour" role="dialog" aria-modal="true" aria-label="How to play">
      <div className="tour-blocker" onClick={(e) => e.stopPropagation()} />
      {rect && (
        <div
          className="tour-spotlight"
          style={{
            top: rect.top - PAD,
            left: rect.left - PAD,
            width: rect.width + PAD * 2,
            height: rect.height + PAD * 2,
          }}
        />
      )}
      <motion.div key={step} className="tour-card" style={cardStyle} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="tour-progress">
          How to play · {step + 1}/{STEPS.length}
        </div>
        <h3>{current.title}</h3>
        <p>{current.text}</p>
        <div className="tour-actions">
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            Skip tutorial
          </button>
          <div className="tour-nav">
            {step > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={() => setStep((s) => s - 1)}>
                Back
              </button>
            )}
            <button className="btn btn-primary btn-sm" onClick={next} autoFocus>
              {last ? 'Let’s go!' : 'Next →'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
