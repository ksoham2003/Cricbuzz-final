/**
 * Dashboard Page
 * Main dashboard with role-based content
 */

import { useAuthStore } from '../context/authStore';
import { useAppStore } from '../context/appStore';
import { useEffect } from 'react';

export const DashboardPage = () => {
  const { user } = useAuthStore();
  const { fetchMatches, fetchSeries, matches, series, isLoading } = useAppStore();

  useEffect(() => {
    fetchMatches();
    if (['SUPER_ADMIN', 'ADMIN'].includes(user?.role)) {
      fetchSeries();
    }
  }, [user?.role, fetchMatches, fetchSeries]);

  return (
    <div className="dashboard-page">
      <h1>Welcome, {user?.name}!</h1>
      <p className="subtitle">Role: <strong>{user?.role}</strong></p>

      <div className="dashboard-grid grid grid-2">
        {/* Quick Stats */}
        <div className="card">
          <h3>📊 Statistics</h3>
          {['SUPER_ADMIN', 'ADMIN'].includes(user?.role) && (
            <div className="stats">
              <div className="stat-item">
                <div className="stat-value">{series.length}</div>
                <div className="stat-label">Active Series</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{matches.length}</div>
                <div className="stat-label">Total Matches</div>
              </div>
            </div>
          )}
          {user?.role === 'SCORER' && (
            <p>You are ready to score matches in real-time.</p>
          )}
        </div>

        {/* Recent Matches */}
        <div className="card">
          <h3>🏏 Recent Matches</h3>
          {isLoading ? (
            <p>Loading...</p>
          ) : matches.length > 0 ? (
            <ul className="match-list">
              {matches.slice(0, 3).map((match) => (
                <li key={match._id}>
                  <strong>{match.team1}</strong> vs <strong>{match.team2}</strong>
                  <br />
                  <small>Status: {match.status}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p>No matches available</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3>⚡ Quick Actions</h3>
          <div className="action-buttons">
            {['SUPER_ADMIN', 'ADMIN'].includes(user?.role) && (
              <>
                <a href="/series" className="btn btn-primary btn-sm">
                  Manage Series
                </a>
                <a href="/teams" className="btn btn-primary btn-sm">
                  Manage Teams
                </a>
              </>
            )}
            {['SUPER_ADMIN'].includes(user?.role) && (
              <a href="/users" className="btn btn-primary btn-sm">
                Manage Users
              </a>
            )}
            {['SCORER'].includes(user?.role) && (
              <a href="/live-scoring" className="btn btn-primary btn-sm">
                Go to Live Scoring
              </a>
            )}
          </div>
        </div>

        {/* Documentation */}
        <div className="card">
          <h3>📖 Documentation</h3>
          <p>
            Welcome to CricBuzz - Live Cricket Scoring Platform. 
            Use the navigation menu to explore features based on your role.
          </p>
          <div className="doc-links">
            <a href="#help">Get Help</a> | 
            <a href="#docs">Documentation</a> | 
            <a href="#support">Support</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
