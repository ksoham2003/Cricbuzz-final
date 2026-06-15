import { Link } from 'react-router-dom';
import { MapPin, Calendar } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatMatchDate, formatScore, formatOvers, getTeamShort, getInitials } from '../utils/helpers';
import './MatchCard.css';

export default function MatchCard({ match, index = 0 }) {
  if (!match) return null;

  const { _id, team1, team2, venue, startTime, status, series, result, matchNumber } = match;

  const isLive = status === 'LIVE' || status === 'INNINGS_BREAK';

  // Find scores for each team
  const scores = match.scores || [];
  const team1Score = scores.find(s => s.battingTeam === team1?._id || s.battingTeam?._id === team1?._id);
  const team2Score = scores.find(s => s.battingTeam === team2?._id || s.battingTeam?._id === team2?._id);

  return (
    <Link
      to={`/matches/${_id}`}
      className={`match-card ${isLive ? 'match-card--live' : ''}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Header */}
      <div className="match-card__header">
        <span className="match-card__series">
          {series?.shortName || series?.name || matchNumber || 'Match'}
        </span>
        <StatusBadge status={status} />
      </div>

      {/* Teams */}
      <div className="match-card__teams">
        {/* Team 1 */}
        <div className={`match-card__team ${match.winner && match.winner === team1?._id ? 'match-card__team--winner' : ''}`}>
          <div className="match-card__team-info">
            <div className="match-card__team-logo" style={{ background: team1?.primaryColor || 'var(--color-primary)' }}>
              {team1?.logo ? (
                <img src={team1.logo} alt={team1.name} />
              ) : (
                <span>{getInitials(team1?.name)}</span>
              )}
            </div>
            <span className="match-card__team-name">{getTeamShort(team1)}</span>
          </div>
          {team1Score && (
            <div className="match-card__score">
              <span className="match-card__runs">{formatScore(team1Score)}</span>
              <span className="match-card__overs">{formatOvers(team1Score.overs)}</span>
            </div>
          )}
        </div>

        {/* Team 2 */}
        <div className={`match-card__team ${match.winner && match.winner === team2?._id ? 'match-card__team--winner' : ''}`}>
          <div className="match-card__team-info">
            <div className="match-card__team-logo" style={{ background: team2?.primaryColor || 'var(--color-primary-dark)' }}>
              {team2?.logo ? (
                <img src={team2.logo} alt={team2.name} />
              ) : (
                <span>{getInitials(team2?.name)}</span>
              )}
            </div>
            <span className="match-card__team-name">{getTeamShort(team2)}</span>
          </div>
          {team2Score && (
            <div className="match-card__score">
              <span className="match-card__runs">{formatScore(team2Score)}</span>
              <span className="match-card__overs">{formatOvers(team2Score.overs)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Result or Schedule */}
      <div className="match-card__footer">
        {result ? (
          <p className="match-card__result">{result}</p>
        ) : (
          <div className="match-card__meta">
            {venue && (
              <span className="match-card__venue">
                <MapPin size={12} /> {venue}
              </span>
            )}
            {startTime && (
              <span className="match-card__date">
                <Calendar size={12} /> {formatMatchDate(startTime)}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
