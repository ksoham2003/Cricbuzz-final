import { getStatusLabel, getStatusClass } from '../utils/helpers';

export default function StatusBadge({ status }) {
  const label = getStatusLabel(status);
  const cls = getStatusClass(status);

  return (
    <span className={`status-badge status-badge--${cls}`}>
      {cls === 'live' && <span className="dot" />}
      {label}
    </span>
  );
}
