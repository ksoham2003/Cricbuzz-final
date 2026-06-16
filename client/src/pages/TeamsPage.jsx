/**
 * Teams Management Page
 */

import { useAppStore } from '../context/appStore';
import { useEffect, useState } from 'react';

export const TeamsPage = () => {
  const { teams, fetchTeams, createTeam, isLoading, error } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    city: '',
    seriesId: '',
  });

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTeam(formData);
      setFormData({ name: '', shortName: '', city: '', seriesId: '' });
      setShowForm(false);
    } catch (err) {
      console.error('Error creating team:', err);
    }
  };

  return (
    <div className="teams-page">
      <div className="page-header">
        <h1>👥 Teams Management</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Create New Team'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="card form-card">
          <h2>Create New Team</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-2">
              <div className="form-group">
                <label>Team Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Short Name</label>
                <input
                  type="text"
                  value={formData.shortName}
                  onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Series</label>
                <input
                  type="text"
                  value={formData.seriesId}
                  onChange={(e) => setFormData({ ...formData, seriesId: e.target.value })}
                  placeholder="Series ID"
                />
              </div>
            </div>
            <button type="submit" className="btn btn-success" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Team'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-3">
        {isLoading ? (
          <p>Loading teams...</p>
        ) : teams.length > 0 ? (
          teams.map((team) => (
            <div key={team._id} className="card">
              <h3>{team.name}</h3>
              <p>
                <strong>Short Name:</strong> {team.shortName}
              </p>
              <p>
                <strong>City:</strong> {team.city || 'N/A'}
              </p>
              <div className="card-actions">
                <button className="btn btn-sm btn-secondary">Edit</button>
                <button className="btn btn-sm btn-danger">Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No teams available. Create one to get started.</p>
        )}
      </div>
    </div>
  );
};

export default TeamsPage;
