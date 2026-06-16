/**
 * Matches Management Page
 */

import { useAppStore } from '../context/appStore';
import { useEffect, useState } from 'react';

export const MatchesPage = () => {
  const { matches, fetchMatches, createMatch, isLoading, error } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    team1: '',
    team2: '',
    seriesId: '',
    venue: '',
    scheduledDate: '',
  });

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMatch(formData);
      setFormData({ team1: '', team2: '', seriesId: '', venue: '', scheduledDate: '' });
      setShowForm(false);
    } catch (err) {
      console.error('Error creating match:', err);
    }
  };

  return (
    <div className="matches-page">
      <div className="page-header">
        <h1>🏏 Matches Management</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Create New Match'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="card form-card">
          <h2>Create New Match</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-2">
              <div className="form-group">
                <label>Team 1</label>
                <input
                  type="text"
                  value={formData.team1}
                  onChange={(e) => setFormData({ ...formData, team1: e.target.value })}
                  placeholder="Team 1 ID"
                  required
                />
              </div>
              <div className="form-group">
                <label>Team 2</label>
                <input
                  type="text"
                  value={formData.team2}
                  onChange={(e) => setFormData({ ...formData, team2: e.target.value })}
                  placeholder="Team 2 ID"
                  required
                />
              </div>
              <div className="form-group">
                <label>Series</label>
                <input
                  type="text"
                  value={formData.seriesId}
                  onChange={(e) => setFormData({ ...formData, seriesId: e.target.value })}
                  placeholder="Series ID"
                  required
                />
              </div>
              <div className="form-group">
                <label>Venue</label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Scheduled Date</label>
                <input
                  type="datetime-local"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-success" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Match'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-2">
        {isLoading ? (
          <p>Loading matches...</p>
        ) : matches.length > 0 ? (
          matches.map((match) => (
            <div key={match._id} className="card">
              <h3>{match.team1} vs {match.team2}</h3>
              <p>
                <strong>Status:</strong> <span className="badge badge-primary">{match.status}</span>
              </p>
              <p>
                <strong>Venue:</strong> {match.venue || 'N/A'}
              </p>
              {match.scheduledDate && (
                <p>
                  <strong>Scheduled:</strong> {new Date(match.scheduledDate).toLocaleString()}
                </p>
              )}
              <div className="card-actions">
                <button className="btn btn-sm btn-success">Manage</button>
                <button className="btn btn-sm btn-secondary">Edit</button>
              </div>
            </div>
          ))
        ) : (
          <p>No matches available. Create one to get started.</p>
        )}
      </div>
    </div>
  );
};

export default MatchesPage;
