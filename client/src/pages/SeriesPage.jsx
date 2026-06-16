/**
 * Series Management Page
 */

import { useAppStore } from '../context/appStore';
import { useEffect, useState } from 'react';

export const SeriesPage = () => {
  const { series, fetchSeries, createSeries, isLoading, error } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    format: 'T20',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchSeries();
  }, [fetchSeries]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSeries(formData);
      setFormData({
        name: '',
        shortName: '',
        format: 'T20',
        startDate: '',
        endDate: '',
      });
      setShowForm(false);
    } catch (err) {
      console.error('Error creating series:', err);
    }
  };

  return (
    <div className="series-page">
      <div className="page-header">
        <h1>🏆 Series Management</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Create New Series'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="card form-card">
          <h2>Create New Series</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-2">
              <div className="form-group">
                <label>Series Name</label>
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
                <label>Format</label>
                <select
                  value={formData.format}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                >
                  <option>T10</option>
                  <option>T20</option>
                  <option>ODI</option>
                  <option>TEST</option>
                </select>
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-success" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Series'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-3">
        {isLoading ? (
          <p>Loading series...</p>
        ) : series.length > 0 ? (
          series.map((s) => (
            <div key={s._id} className="card">
              <h3>{s.name}</h3>
              <p>
                <strong>Format:</strong> {s.format}
              </p>
              <p>
                <strong>Status:</strong> <span className="badge badge-primary">{s.status}</span>
              </p>
              <p>
                <small>
                  {new Date(s.startDate).toLocaleDateString()} -{' '}
                  {new Date(s.endDate).toLocaleDateString()}
                </small>
              </p>
              <div className="card-actions">
                <button className="btn btn-sm btn-secondary">Edit</button>
                <button className="btn btn-sm btn-danger">Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No series available. Create one to get started.</p>
        )}
      </div>
    </div>
  );
};

export default SeriesPage;
