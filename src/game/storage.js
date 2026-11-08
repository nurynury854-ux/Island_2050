// ─────────────────────────────────────────────────────────────
//  Saving to the browser (localStorage).
//  Wrapped in try/catch because storage can be blocked (e.g. in
//  private browsing). The game still works, it just won't save.
// ─────────────────────────────────────────────────────────────

const SAVE_KEY = 'island2050.save';
const RUNS_KEY = 'island2050.runs';
const TUTORIAL_KEY = 'island2050.tutorialSeen';

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable: ignore */
  }
}

export const loadGame = () => read(SAVE_KEY, null);
export const saveGame = (state) => write(SAVE_KEY, state);

export const loadRuns = () => read(RUNS_KEY, []);
export function addRun(run) {
  const runs = loadRuns().filter((r) => r.id !== run.id); // don't save the same game twice
  write(RUNS_KEY, [run, ...runs].slice(0, 50));
}
export const clearRuns = () => write(RUNS_KEY, null);

export const hasSeenTutorial = () => read(TUTORIAL_KEY, false);
export const markTutorialSeen = () => write(TUTORIAL_KEY, true);

// ── Presentation ─────────────────────────────────────────────
// When the presenter jumps from a slide into the live demo, remember the slide so
// every page can show a "Back to slides" button. sessionStorage forgets it when the tab closes.
const RETURN_SLIDE_KEY = 'island2050.returnSlide';
export function setReturnSlide(n) {
  try {
    sessionStorage.setItem(RETURN_SLIDE_KEY, String(n));
  } catch {
    /* storage unavailable: ignore */
  }
}
export function getReturnSlide() {
  try {
    return Number(sessionStorage.getItem(RETURN_SLIDE_KEY)) || null;
  } catch {
    return null;
  }
}
export function clearReturnSlide() {
  try {
    sessionStorage.removeItem(RETURN_SLIDE_KEY);
  } catch {
    /* storage unavailable: ignore */
  }
}
