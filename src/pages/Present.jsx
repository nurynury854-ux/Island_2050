// ─────────────────────────────────────────────────────────────
//  The presentation: slides that live inside the website.
//
//  The slides themselves are data in src/presentation/slides.jsx.
//  This file is the "projector": it shows one slide at a time,
//  scales it to fit any screen, and handles the keyboard.
//
//  Keys:  → / Space / PageDown  next      ← / PageUp  back
//         Home / End  first / last       F  full screen
//         N  speaker notes               O  list of all slides
//  The slide number is in the URL (/present/5), so refreshing
//  or pressing the browser's Back button keeps your place.
// ─────────────────────────────────────────────────────────────

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { SLIDES } from '../presentation/slides.jsx';
import { clearReturnSlide } from '../game/storage.js';
import './Present.css';

// Every slide is designed on a 1280×720 (16:9) canvas, then scaled to fit the screen.
const STAGE_W = 1280;
const STAGE_H = 720;

export default function Present() {
  const params = useParams();
  const navigate = useNavigate();
  const index = Math.min(SLIDES.length - 1, Math.max(0, (Number(params.slide) || 1) - 1));
  const slide = SLIDES[index];

  const [showNotes, setShowNotes] = useState(false);
  const [showList, setShowList] = useState(false);
  const [scale, setScale] = useState(1);
  const viewportRef = useRef(null);

  // Remember which way we moved, so the slide animates in from the correct side.
  const previous = useRef(index);
  const direction = index >= previous.current ? 1 : -1;
  useEffect(() => {
    previous.current = index;
  }, [index]);

  // Back from the live demo: the "Back to slides" button isn't needed any more.
  useEffect(() => clearReturnSlide(), []);

  useEffect(() => {
    document.title = `${slide.title} · Island 2050 presentation`;
    return () => {
      document.title = 'Island 2050';
    };
  }, [slide.title]);

  // replace: true, so clicking through 12 slides doesn't fill up the browser history.
  const goTo = useCallback(
    (i) => navigate(`/present/${Math.min(SLIDES.length, Math.max(1, i + 1))}`, { replace: true }),
    [navigate],
  );

  // Keyboard controls. Presentation clickers send PageDown / PageUp.
  useEffect(() => {
    function onKey(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return; // leave browser shortcuts alone
      if (e.target.closest?.('input, textarea')) return;
      const key = e.key.toLowerCase();
      if (['arrowright', 'pagedown', ' '].includes(key)) {
        e.preventDefault();
        goTo(index + 1);
      } else if (['arrowleft', 'pageup'].includes(key)) {
        e.preventDefault();
        goTo(index - 1);
      } else if (key === 'home') goTo(0);
      else if (key === 'end') goTo(SLIDES.length - 1);
      else if (key === 'n') setShowNotes((v) => !v);
      else if (key === 'o') setShowList((v) => !v);
      else if (key === 'escape') setShowList(false);
      else if (key === 'f') toggleFullscreen();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, goTo]);

  // Scale the 1280×720 stage to fit the space available (it changes when the notes open).
  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const fit = () => setScale(Math.min(el.clientWidth / STAGE_W, el.clientHeight / STAGE_H));
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const SlideContent = slide.Slide;

  return (
    <div className="present">
      <div className="present-viewport" ref={viewportRef}>
        <div className="present-frame" style={{ width: STAGE_W * scale, height: STAGE_H * scale }}>
          <div className="present-stage" style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})` }}>
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={slide.id}
                className="present-slide"
                custom={direction}
                initial={{ opacity: 0, x: 40 * direction }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 * direction }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <SlideContent slideNumber={index + 1} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {showNotes && (
        <aside className="present-notes" aria-label="Speaker notes">
          <div className="present-notes-head">
            Speaker notes · {index + 1}. {slide.title}
            {slide.time && <span> · about {slide.time}</span>}
          </div>
          <ul>
            {slide.notes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </aside>
      )}

      <div className="present-bar">
        <button className="present-arrow" onClick={() => goTo(index - 1)} disabled={index === 0} aria-label="Previous slide">
          ‹
        </button>
        <span className="present-count">
          {index + 1} / {SLIDES.length}
        </span>
        <button
          className="present-arrow"
          onClick={() => goTo(index + 1)}
          disabled={index === SLIDES.length - 1}
          aria-label="Next slide"
        >
          ›
        </button>
        <div className="present-progress" aria-hidden="true">
          <div style={{ width: `${((index + 1) / SLIDES.length) * 100}%` }} />
        </div>
        <button className="present-key" onClick={() => setShowNotes((v) => !v)} aria-pressed={showNotes}>
          <kbd>N</kbd> notes
        </button>
        <button className="present-key" onClick={() => setShowList((v) => !v)} aria-pressed={showList}>
          <kbd>O</kbd> slides
        </button>
        <button className="present-key" onClick={toggleFullscreen}>
          <kbd>F</kbd> full screen
        </button>
      </div>

      {showList && (
        <div className="present-list" onClick={() => setShowList(false)}>
          <div className="present-list-inner" onClick={(e) => e.stopPropagation()}>
            <h2>All slides</h2>
            <ol>
              {SLIDES.map((s, i) => (
                <li key={s.id}>
                  <button
                    className={i === index ? 'current' : ''}
                    onClick={() => {
                      goTo(i);
                      setShowList(false);
                    }}
                  >
                    <span className="present-list-num">{i + 1}</span>
                    <span>{s.title}</span>
                    {s.time && <span className="present-list-time">{s.time}</span>}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen?.();
  else document.documentElement.requestFullscreen?.().catch(() => {});
}
