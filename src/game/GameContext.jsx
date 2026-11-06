// ─────────────────────────────────────────────────────────────
//  GameContext: makes the game state available to every page.
//
//  React idea: a "context" is like a global variable that any
//  component can read with useGame(). When the state changes,
//  every component that uses it re-draws automatically.
//
//  The actual rules are in engine.js. This file just connects
//  the engine to React and saves progress to the browser.
// ─────────────────────────────────────────────────────────────

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as engine from './engine.js';
import { loadGame, saveGame, addRun } from './storage.js';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  // Load a saved game (if there is one) when the site opens.
  const [game, setGame] = useState(() => {
    const saved = loadGame();
    return engine.isValidSave(saved) ? saved : null;
  });

  // Every time the game changes, save it. Finished games also go to the Hall.
  useEffect(() => {
    saveGame(game);
    if (game?.phase === 'ended') addRun(engine.summarizeRun(game));
  }, [game]);

  // The actions pages can call. Each one runs an engine function.
  const actions = useMemo(
    () => ({
      newGame: (options) => setGame(engine.createGame(options)),
      closeChapter: () => setGame((g) => engine.closeChapter(g)),
      enactPolicies: (ids) => setGame((g) => engine.enactPolicies(g, ids)),
      resolveEvent: (choiceIndex) => setGame((g) => engine.resolveEvent(g, choiceIndex)),
      nextTurn: () => setGame((g) => engine.nextTurn(g)),
      quit: () => setGame(null),
    }),
    [],
  );

  return <GameContext.Provider value={{ game, ...actions }}>{children}</GameContext.Provider>;
}

/** Use inside any component: const { game, enactPolicies } = useGame(); */
export function useGame() {
  return useContext(GameContext);
}
