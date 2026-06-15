import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shield, ArrowLeft, Globe, Users, Trophy } from 'lucide-react';
import { getTeamDetails } from '../api/teamApi';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import './Teams.css';

export default function TeamDetails() {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeamInfo();
  }, [teamId]);

  const fetchTeamInfo = async () => {
    try {
      setLoading(true);
      const res = await getTeamDetails(teamId);
      const data = res.data?.team || res.data || res;
      setTeam(data);
      if (data) {
        document.title = `${data.name} — CricBuzz`;
      }
    } catch (err) {
      setError(err.message || 'Failed to load team profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-content flex-center" style={{ minHeight: '60vh' }}>
        <Loader message="Loading team details..." />
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="page-content container">
        <Link to="/teams" className="back-btn">
          <ArrowLeft size={16} /> Back to Teams
        </Link>
        <EmptyState title="Not Found" message={error || 'Team not found'} />
      </div>
    );
  }

  return (
    <div className="page-content container">
      {/* Back link */}
      <Link to="/teams" className="back-btn" style={{ marginBottom: '16px' }}>
        <ArrowLeft size={14} /> Back to Teams
      </Link>

      {/* Header Profile */}
      <div className="team-profile-header animate-fade-in-up">
        <div className="team-profile-logo">
          {team.shortName || team.name?.substring(0, 3).toUpperCase()}
        </div>
        <div>
          <h1 className="team-profile-name">{team.name}</h1>
          <div className="team-profile-meta">
            <span className="flex items-center gap-1">
              <Globe size={15} />
              Code: {team.shortName || 'N/A'}
            </span>
            <span className="bullet-separator" />
            <span className="flex items-center gap-1">
              <Shield size={15} />
              {team.category || 'National Cricket Team'}
            </span>
          </div>
        </div>
      </div>

      {/* Info Block */}
      <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
        <EmptyState
          icon={Users}
          title="Team Squad"
          message="Squad listings and past records for this team will be shown during live series matching."
        />
      </div>
    </div>
  );
}
