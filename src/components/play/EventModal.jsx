// The event pop-up: what happened, and what you do about it.
import Modal from '../Modal.jsx';
import CitizenAvatar from '../CitizenAvatar.jsx';
import { EffectList } from '../Bits.jsx';
import { CITIZENS } from '../../game/citizens.js';
import { termLabel } from '../../game/constants.js';

export default function EventModal({ game, onChoose }) {
  const event = game.pendingEvent;
  const quote = event.citizen;

  return (
    <Modal label={event.title}>
      <div className="event">
        <div className="event-icon" aria-hidden="true">
          {event.icon}
        </div>
        <span className="kicker">Event · {termLabel(game.turn)}</span>
        <h2>{event.title}</h2>
        <p className="event-desc">{event.description}</p>

        {Object.keys(event.base).length > 0 && (
          <div className="event-impact">
            <span className="event-impact-label">Impact</span>
            <EffectList effects={event.base} />
          </div>
        )}

        {quote && (
          <div className="quote">
            <CitizenAvatar id={quote.citizen} mood={quote.mood} size={52} />
            <div>
              <div className="quote-name">
                {CITIZENS[quote.citizen].name} · <span className="muted">{CITIZENS[quote.citizen].role}</span>
              </div>
              <p>“{quote.text}”</p>
            </div>
          </div>
        )}

        <div className="event-choices">
          <span className="event-impact-label">{event.choices.length > 1 ? 'What do you do?' : ''}</span>
          {event.choices.map((choice, i) => (
            <button key={i} className="choice" onClick={() => onChoose(i)} autoFocus={i === 0}>
              <span className="choice-label">{choice.label}</span>
              <span className="choice-hint">{choice.hint}</span>
              <EffectList effects={choice.effects} />
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}
