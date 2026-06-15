import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Activity, Award } from 'lucide-react';
import { getPlayerDetails } from '../api/playerApi';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import './Players.css';

export default function PlayerDetails() {
  const { playerId } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlayerInfo();
  }, [playerId]);

  const fetchPlayerInfo = async () => {
    try {
      setLoading(true);
      const res = await getPlayerDetails(playerId);
      const data = res.data?.player || res.data || res;
      setPlayer(data);
      if (data) {
        document.title = `${data.fullName || data.name} Profile — CricBuzz`;
      }
    } catch (err) {
      setError(err.message || 'Failed to load player bio');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-content flex-center" style={{ minHeight: '60vh' }}>
        <Loader message="Loading player profile..." />
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="page-content container">
        <Link to="/players" className="back-btn">
          <ArrowLeft size={16} /> Back to Players
        </Link>
        <EmptyState title="Not Found" message={error || 'Player not found'} />
      </div>
    );
  }

  const pName = player.fullName || `${player.firstName} ${player.lastName}`;

  return (
    <div className="page-content container">
      {/* Back button */}
      <Link to="/players" className="back-btn" style={{ marginBottom: '16px' }}>
        <ArrowLeft size={14} /> Back to Players
      </Link>

      {/* Profile Header */}
      <div className="player-profile-header animate-fade-in-up">
        <div className="player-profile-avatar">
          {pName ? pName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'PL'}
        </div>
        <div>
          <h1 className="player-profile-name">{pName}</h1>
          <p className="player-profile-country">{player.nationality || player.country || 'International Player'}</p>
          <div className="player-profile-badges">
            <span className="player-badge player-badge--accent">
              {player.role || player.playingRole || 'Cricketer'}
            </span>
            {player.battingStyle && (
              <span className="player-badge">
                Batting: {player.battingStyle}
              </span>
            )}
            {player.bowlingStyle && (
              <span className="player-badge">
                Bowling: {player.bowlingStyle}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
        <h2 className="stats-section-title flex items-center gap-2">
          <Activity size={20} className="text-primary" />
          Career Statistics
        </h2>

        {/* Batting Stats */}
        <h3 className="text-secondary text-sm font-semibold mb-3">BATTING STATS</h3>
        <div className="stats-grid">
          <div className="stat-box">
            <span className="stat-box__label">Matches</span>
            <span className="stat-box__value">{player.stats?.batting?.matches || 0}</span>
          </div>
          <div className="stat-box">
            <span className="stat-box__label">Runs</span>
            <span className="stat-box__value">{player.stats?.batting?.runs || 0}</span>
          </div>
          <div className="stat-box">
            <span className="stat-box__label">Highest Score</span>
            <span className="stat-box__value">{player.stats?.batting?.highestScore || 0}</span>
          </div>
          <div className="stat-box">
            <span className="stat-box__label">Average</span>
            <span className="stat-box__value">
              {player.stats?.batting?.average ? player.stats.batting.average.toFixed(2) : '0.00'}
            </span>
          </div>
        </div>

        {/* Bowling Stats */}
        <h3 className="text-secondary text-sm font-semibold mb-3">BOWLING STATS</h3>
        <div className="stats-grid">
          <div className="stat-box">
            <span className="stat-box__label">Wickets</span>
            <span className="stat-box__value">{player.stats?.bowling?.wickets || 0}</span>
          </div>
          <div className="stat-box">
            <span className="stat-box__label">Best Figures</span>
            <span className="stat-box__value">{player.stats?.bowling?.bestFigures || 'N/A'}</span>
          </div>
          <div className="stat-box">
            <span className="stat-box__label">Economy</span>
            <span className="stat-box__value">
              {player.stats?.bowling?.economy ? player.stats.bowling.economy.toFixed(2) : '0.00'}
            </span>
          </div>
          <div className="stat-box">
            <span className="stat-box__label">Average</span>
            <span className="stat-box__value">
              {player.stats?.bowling?.average ? player.stats.bowling.average.toFixed(2) : '0.00'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
