// Full-screen story chapter, narrated by the advisor. Lines appear one at a time.
import { useState } from 'react';
import { motion } from 'framer-motion';
import CitizenAvatar from '../CitizenAvatar.jsx';
import { CHAPTERS, fillIsland } from '../../game/story.js';
import { CITIZENS } from '../../game/citizens.js';
import { turningPointMood } from '../../game/engine.js';

export default function ChapterOverlay({ game, onClose }) {
  const chapter = CHAPTERS[game.chapter];
  const lines = game.chapter === 'turningPoint' ? chapter[turningPointMood(game)] : chapter.lines;
  const [shown, setShown] = useState(1);
  const done = shown >= lines.length;

  return (
    <motion.div className="chapter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="chapter-inner">
        <span className="kicker">{chapter.kicker}</span>
        <h1>{chapter.title}</h1>
        <div className="chapter-body">
          <CitizenAvatar id="advisor" mood={game.chapter === 'turningPoint' && turningPointMood(game) === 'bad' ? 'angry' : 'neutral'} size={84} showBadge={false} />
          <div className="chapter-lines">
            <div className="chapter-speaker">{CITIZENS.advisor.name}</div>
            {lines.slice(0, shown).map((line, i) => (
              <motion.p key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                {fillIsland(line, game.islandName)}
              </motion.p>
            ))}
          </div>
        </div>
        <div className="chapter-actions">
          {!done && (
            <button className="btn btn-ghost" onClick={() => setShown(lines.length)}>
              Skip
            </button>
          )}
          <button className="btn btn-primary btn-lg" onClick={() => (done ? onClose() : setShown((n) => n + 1))} autoFocus>
            {done ? 'Begin →' : 'Continue'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
