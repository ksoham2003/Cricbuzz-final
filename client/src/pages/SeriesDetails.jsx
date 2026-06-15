import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Trophy, Calendar, FileText, ArrowLeft, Radio } from 'lucide-react';
import { getSeriesDetails, getSeriesMatches, getPointsTable } from '../api/seriesApi';
import MatchCard from '../components/MatchCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import StatusBadge from '../components/StatusBadge';
import './SeriesDetails.css';

export default function SeriesDetails() {
  const { seriesId } = useParams();
  const [series, setSeries] = useState(null);
  const [matches, setMatches] = useState([]);
  const [pointsTable, setPointsTable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('matches'); // matches | points-table

  useEffect(() => {
    fetchSeriesInfo();
  }, [seriesId]);

  const fetchSeriesInfo = async () => {
    try {
      setLoading(true);
      const [seriesRes, matchesRes, pointsRes] = await Promise.all([
        getSeriesDetails(seriesId),
        getSeriesMatches(seriesId).catch(() => ({ data: { data: [] } })),
        getPointsTable(seriesId).catch(() => ({ data: { standings: [] } })),
      ]);

      const seriesData = seriesRes.data?.series || seriesRes.data || seriesRes;
      const matchesData = matchesRes.data?.data || matchesRes.data || matchesRes;
      const pointsData = pointsRes.data?.standings || pointsRes.data || [];

      setSeries(seriesData);
      setMatches(Array.isArray(matchesData) ? matchesData : []);
      setPointsTable(Array.isArray(pointsData) ? pointsData : []);

      if (seriesData) {
        document.title = `${seriesData.name} — CricBuzz`;
      }
    } catch (err) {
      setError(err.message || 'Failed to load tournament details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-content flex-center" style={{ minHeight: '60vh' }}>
        <Loader message="Loading series info..." />
      </div>
    );
  }

  if (error || !series) {
    return (
      <div className="page-content container">
        <Link to="/series" className="back-btn">
          <ArrowLeft size={16} /> Back to Tournaments
        </Link>
        <EmptyState title="Not Found" message={error || 'Series not found'} />
      </div>
    );
  }

  return (
    <div className="page-content container">
      {/* Back to all series */}
      <Link to="/series" className="back-btn" style={{ marginBottom: '16px' }}>
        <ArrowLeft size={14} /> Back to Tournaments
      </Link>

      {/* Header */}
      <div className="series-header-card animate-fade-in-up">
        <div className="series-header-card__bg" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: '12px' }}>
            <StatusBadge status={series.status} />
          </div>
          <h1 className="series-title-lg">{series.name}</h1>
          <div className="series-meta-info">
            <span className="flex items-center gap-1">
              <Calendar size={15} />
              {series.startDate ? new Date(series.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
              {' — '}
              {series.endDate ? new Date(series.endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
            </span>
            <span className="bullet-separator" />
            <span>{series.category || series.type || 'Tournament'}</span>
            {series.teams && (
              <>
                <span className="bullet-separator" />
                <span>{series.teams.length} Teams</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="series-tab-container">
        <button
          className={`series-tab ${activeTab === 'matches' ? 'series-tab--active' : ''}`}
          onClick={() => setActiveTab('matches')}
        >
          Matches ({matches.length})
        </button>
        <button
          className={`series-tab ${activeTab === 'points-table' ? 'series-tab--active' : ''}`}
          onClick={() => setActiveTab('points-table')}
        >
          Points Table
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content animate-fade-in">
        {activeTab === 'matches' && (
          <div>
            {matches.length === 0 ? (
              <EmptyState
                icon={Radio}
                title="No matches scheduled"
                message="Matches for this series haven't been created yet."
              />
            ) : (
              <div className="match-grid">
                {matches.map((match, i) => (
                  <MatchCard key={match._id} match={match} index={i} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'points-table' && (
          <div>
            {pointsTable.length === 0 ? (
              <EmptyState
                icon={Trophy}
                title="No points table"
                message="Points table is currently unavailable for this series."
              />
            ) : (
              <div className="points-table-container">
                <table className="points-table">
                  <thead>
                    <tr>
                      <th style={{ width: '60px', textAlign: 'center' }}>Pos</th>
                      <th>Team</th>
                      <th>P</th>
                      <th>W</th>
                      <th>L</th>
                      <th>NR</th>
                      <th>Pts</th>
                      <th>NRR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pointsTable.map((row, idx) => (
                      <tr key={row.teamId || idx}>
                        <td style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                          {idx + 1}
                        </td>
                        <td>
                          <div className="team-cell">
                            <span className="team-logo-sm">
                              {row.teamShortName || 'TM'}
                            </span>
                            <span>{row.teamName || 'Unknown Team'}</span>
                          </div>
                        </td>
                        <td>{row.played || 0}</td>
                        <td>{row.won || 0}</td>
                        <td>{row.lost || 0}</td>
                        <td>{row.noResult || 0}</td>
                        <td style={{ fontWeight: 'bold', color: 'var(--color-primary-light)' }}>
                          {row.points || 0}
                        </td>
                        <td style={{ fontFamily: 'monospace' }}>
                          {row.netRunRate ? (row.netRunRate > 0 ? `+${row.netRunRate.toFixed(3)}` : row.netRunRate.toFixed(3)) : '0.000'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
