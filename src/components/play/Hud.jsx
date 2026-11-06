// The top bar of the game screen: year, progress, budget, approval.
import { formatMoney } from '../Bits.jsx';
import { TOTAL_TURNS, VOTE_OUT_THRESHOLD, termLabel, isElectionTurn, yearOfTurn } from '../../game/constants.js';
import { projectedIncome } from '../../game/engine.js';

export default function Hud({ game, onQuit, onHelp }) {
  const income = projectedIncome(game);
  const approval = Math.round(game.stats.approval);
  const election = isElectionTurn(game.turn);
  const approvalDanger = approval < VOTE_OUT_THRESHOLD + 8;
  // The next term that ends with an election (if any are left)
  let nextElectionTurn = game.turn;
  while (nextElectionTurn < TOTAL_TURNS && !isElectionTurn(nextElectionTurn)) nextElectionTurn++;
  const nextElectionYear = nextElectionTurn < TOTAL_TURNS ? yearOfTurn(nextElectionTurn + 1) : null;

  return (
    <div className="hud">
      <div className="hud-island">
        <div className="hud-name">{game.islandName}</div>
        <div className="hud-term">
          {termLabel(game.turn)} · Term {game.turn + 1}/{TOTAL_TURNS}
        </div>
        <div className="hud-progress" aria-hidden="true">
          <div style={{ width: `${((game.turn + 1) / TOTAL_TURNS) * 100}%` }} />
        </div>
      </div>

      <div className="hud-stats" data-tour="hud">
      <div className="hud-stat">
        <span className="hud-label">Budget</span>
        <span className={`hud-value ${game.budget < 0 ? 'neg' : ''}`}>💰 {formatMoney(game.budget)}</span>
        <span className={`hud-sub ${income < 0 ? 'neg' : ''}`}>
          {income >= 0 ? '+' : ''}
          {formatMoney(income)} / term
        </span>
      </div>

      <div className="hud-stat">
        <span className="hud-label">Approval</span>
        <span className={`hud-value ${approvalDanger ? 'neg' : ''}`}>👍 {approval}%</span>
        <span className="hud-sub">
          need {VOTE_OUT_THRESHOLD}%{nextElectionYear && !election ? ` · next election ${nextElectionYear}` : ''}
        </span>
      </div>
      </div>

      {election && (
        <div className="hud-election" title="Your approval at the end of this term decides the election">
          🗳 Election at the end of this term
        </div>
      )}

      <div className="hud-buttons">
        <button className="btn btn-ghost btn-sm" onClick={onHelp} disabled={game.phase !== 'planning'}>
          ? How to play
        </button>
        <button className="btn btn-ghost btn-sm" onClick={onQuit}>
          Save & exit
        </button>
      </div>
    </div>
  );
}
