// End-of-term report: what changed, who reacted, and (sometimes) the election result.
import { motion } from 'framer-motion';
import Modal from '../Modal.jsx';
import CitizenAvatar from '../CitizenAvatar.jsx';
import { formatMoney } from '../Bits.jsx';
import { CITIZENS } from '../../game/citizens.js';
import { POLICY_BY_ID } from '../../game/policies.js';
import { STAT_INFO, TOTAL_TURNS, yearOfTurn } from '../../game/constants.js';

const ROWS = ['approval', 'gdp', 'emissions', 'renewable', 'water', 'airQuality', 'ecosystem', 'resilience'];

export default function ReportModal({ game, onContinue }) {
  const r = game.report;
  const isLast = game.turn + 1 >= TOTAL_TURNS;
  const lostElection = r.election && !r.election.won;
  const budgetChange = r.after.budget - r.before.budget;

  let buttonText = `Continue to ${yearOfTurn(game.turn + 1)} →`;
  if (lostElection) buttonText = 'Accept the result';
  else if (isLast) buttonText = 'See your 2050 →';

  return (
    <Modal wide label={`Term report ${r.term}`}>
      <div className="report">
        <span className="kicker">Term report</span>
        <h2>{r.term}</h2>
        <p className="report-event">
          {r.event.icon} {r.event.title}: you chose <b>{r.event.choice.toLowerCase()}</b>.
        </p>

        {r.completed.length > 0 && (
          <div className="report-completed">
            {r.completed.map((id) => (
              <div key={id}>
                ✅ <b>{POLICY_BY_ID[id].name}</b> is finished and now active!
              </div>
            ))}
          </div>
        )}

        <div className="report-grid">
          <div>
            <h4>What changed</h4>
            <table className="report-table">
              <tbody>
                {ROWS.map((key) => {
                  const before = Math.round(r.before.stats[key]);
                  const after = Math.round(r.after.stats[key]);
                  const diff = after - before;
                  const info = STAT_INFO[key];
                  const good = info.goodWhenHigh ? diff > 0 : diff < 0;
                  return (
                    <tr key={key}>
                      <td>
                        {info.icon} {info.label}
                      </td>
                      <td className="muted">{before}</td>
                      <td>→ {after}</td>
                      <td className={diff === 0 ? 'muted' : good ? 'good' : 'bad'}>
                        {diff > 0 ? '+' : ''}
                        {diff === 0 ? '–' : diff}
                      </td>
                    </tr>
                  );
                })}
                <tr className="report-budget">
                  <td>💰 Budget</td>
                  <td className="muted">{formatMoney(r.before.budget)}</td>
                  <td>→ {formatMoney(r.after.budget)}</td>
                  <td className={budgetChange >= 0 ? 'good' : 'bad'}>
                    {budgetChange >= 0 ? '+' : ''}
                    {formatMoney(budgetChange)}
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="muted small">
              Taxes {formatMoney(r.income)} · Upkeep {formatMoney(r.upkeep)} · Spending & events make up the rest
            </p>
          </div>

          <div>
            <h4>What people are saying</h4>
            <div className="report-quotes">
              {r.reactions.map((q, i) => (
                <motion.div
                  key={i}
                  className="quote"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.25 }}
                >
                  <CitizenAvatar id={q.citizen} mood={q.mood} size={48} />
                  <div>
                    <div className="quote-name">{CITIZENS[q.citizen].name}</div>
                    <p>“{q.text}”</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {r.election && (
          <motion.div
            className={`election ${r.election.won ? 'won' : 'lost'}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span className="election-icon">🗳</span>
            <div>
              <b>Election {r.election.year}</b>
              <div>
                {r.election.won
                  ? `You were re-elected with ${r.election.approval}% approval.`
                  : `With only ${r.election.approval}% approval, the people have voted you out.`}
              </div>
            </div>
          </motion.div>
        )}

        <div className="report-actions">
          <button className="btn btn-primary btn-lg" onClick={onContinue} autoFocus>
            {buttonText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
