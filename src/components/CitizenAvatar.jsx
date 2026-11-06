// Shows a citizen's face. Uses the photo in /public/citizens/<id>-<mood>.jpg
// if it exists; otherwise draws an emoji placeholder in their color.
import { useState } from 'react';
import { CITIZENS } from '../game/citizens.js';
import './CitizenAvatar.css';

const MOOD_BADGE = { happy: '😊', neutral: '😐', angry: '😠' };
const missingPhotos = new Set(); // remember which photos don't exist, so we don't keep asking

export default function CitizenAvatar({ id, mood = 'neutral', size = 64, showBadge = true }) {
  const citizen = CITIZENS[id];
  const src = `/citizens/${id}-${mood}.jpg`;
  const [failed, setFailed] = useState(missingPhotos.has(src));
  const usePhoto = !failed && !missingPhotos.has(src);

  return (
    <div
      className={`avatar avatar-${mood}`}
      style={{ width: size, height: size, '--avatar-color': citizen.color }}
      title={`${citizen.name}, ${citizen.role}`}
    >
      {usePhoto ? (
        <img
          src={src}
          alt={`${citizen.name} looking ${mood}`}
          onError={() => {
            missingPhotos.add(src);
            setFailed(true);
          }}
        />
      ) : (
        <span className="avatar-emoji" style={{ fontSize: size * 0.48 }} aria-hidden="true">
          {citizen.emoji}
        </span>
      )}
      {showBadge && (
        <span className="avatar-badge" style={{ fontSize: Math.max(12, size * 0.26) }} aria-label={mood}>
          {MOOD_BADGE[mood]}
        </span>
      )}
    </div>
  );
}
