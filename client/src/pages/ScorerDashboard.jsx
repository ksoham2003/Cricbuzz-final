import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PlayCircle, Shield, Calendar, User, LayoutDashboard, Plus, RotateCw } from 'lucide-react';
import { getMatches } from '../api/matchApi';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import StatusBadge from '../components/StatusBadge';
import './Scorer.css';

export default function ScorerDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Scorer Dashboard — CricBuzz';
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch all matches to display on dashboard
      const res = await getMatches();
      const data = res.data || res;
      setMatches(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load matches list');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-content flex-center" style={{ minHeight: '60vh' }}>
        <Loader message="Loading scorer dashboard..." />
      </div>
    );
  }

  return (
    <div className="page-content container">
      {/* Welcome banner */}
      <div className="team-profile-header animate-fade-in-up" style={{ padding: '24px', marginBottom: '24px' }}>
        <div className="player-profile-avatar" style={{ width: '64px', height: '64px', fontSize: '1.5rem' }}>
          <User size={24} />
        </div>
        <div style={{ textAlign: 'left' }}>
          <h1 className="scorer-dashboard-title" style={{ fontSize: '1.5rem', marginBottom: '4px' }}>
            Scorer Command Center
          </h1>
          <p className="text-secondary text-sm">
            Welcome, <span className="text-primary font-bold">{user?.name}</span> • Role: <span className="font-bold text-accent">{user?.role}</span>
          </p>
        </div>
        <button 
          onClick={fetchMatches} 
          className="scorer-action-btn flex items-center justify-center gap-2"
          style={{ marginLeft: 'auto', maxWidth: '140px', padding: '8px 12px' }}
        >
          <RotateCw size={14} /> Refresh
        </button>
      </div>

      <div className="section-header">
        <h2 className="section-title">Matches for Live Operations</h2>
      </div>

      {error && (
        <div className="auth-error" style={{ marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {matches.length === 0 ? (
        <EmptyState
          icon={PlayCircle}
          title="No Matches Scheduled"
          message="There are currently no scheduled cricket matches in the system. Check the admin console to add new matches."
        />
      ) : (
        <div className="match-grid animate-fade-in" style={{ animationDelay: '100ms' }}>
          {matches.map((match) => {
            const isCompleted = match.status === 'COMPLETED' || match.status === 'ABANDONED';
            return (
              <div key={match._id} className="scorer-match-card">
                <div className="scorer-match-card__header">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} />
                    {match.matchDate ? new Date(match.matchDate).toLocaleDateString() : 'N/A'} • {match.format || 'T20'}
                  </span>
                  <StatusBadge status={match.status} />
                </div>

                <div className="scorer-match-card__teams">
                  <div className="flex justify-between items-center">
                    <span>{match.team1?.name || match.teamA?.name}</span>
                    <span className="text-xs text-muted">vs</span>
                    <span>{match.team2?.name || match.teamB?.name}</span>
                  </div>
                </div>

                <div className="text-xs text-secondary italic">
                  Venue: {match.venue || 'Neutral Ground'}
                </div>

                <div className="scorer-match-card__actions">
                  {isCompleted ? (
                    <div className="text-xs text-center text-muted w-full font-semibold bg-white/5 py-2 rounded">
                      Match Finished • Result: {match.result || 'Declared'}
                    </div>
                  ) : (
                    <Link
                      to={`/scorer/match/${match._id}`}
                      className="scorer-action-btn scorer-action-btn--primary"
                    >
                      <LayoutDashboard size={14} />
                      {match.status === 'SCHEDULED' ? 'Select Playing XI & Toss' : 'Scoring Panel'}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
