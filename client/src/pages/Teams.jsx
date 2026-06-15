import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, MapPin, ArrowRight } from 'lucide-react';
import { getAllTeams } from '../api/teamApi';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import './Teams.css';

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'Cricket Teams — CricBuzz';
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const res = await getAllTeams();
      const data = res.data?.data || res.data || res;
      setTeams(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-content flex-center" style={{ minHeight: '60vh' }}>
        <Loader message="Loading teams..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content container">
        <EmptyState title="Error" message={error} />
        <div className="flex-center" style={{ marginTop: '16px' }}>
          <button onClick={fetchTeams} className="retry-btn">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content container">
      <div className="section-header">
        <h1 className="page-title flex items-center gap-2">
          <Shield className="icon text-primary" size={24} />
          Cricket Teams
        </h1>
      </div>

      {teams.length === 0 ? (
        <EmptyState
          icon={Shield}
          title="No teams found"
          message="Teams list is currently empty."
        />
      ) : (
        <div className="teams-grid">
          {teams.map((team) => (
            <Link key={team._id} to={`/teams/${team._id}`} className="team-card animate-fade-in-up">
              <div className="team-card__logo-large">
                {team.shortName || team.name?.substring(0, 3).toUpperCase() || 'TM'}
              </div>
              <div>
                <h3 className="team-card__name">{team.name}</h3>
                <span className="team-card__code">{team.shortName || 'INTL'}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
