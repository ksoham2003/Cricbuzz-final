import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Calendar, MapPin, ChevronRight } from 'lucide-react';
import { getAllSeries } from '../api/seriesApi';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import StatusBadge from '../components/StatusBadge';
import './SeriesList.css';

export default function SeriesList() {
  const [seriesList, setSeriesList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('ALL');

  useEffect(() => {
    document.title = 'Cricket Series & Tournaments — CricBuzz';
    fetchSeries();
  }, []);

  const fetchSeries = async () => {
    try {
      setLoading(true);
      const res = await getAllSeries();
      const data = res.data?.data || res.data || res;
      setSeriesList(Array.isArray(data) ? data : []);
      setFilteredList(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load series');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeFilter === 'ALL') {
      setFilteredList(seriesList);
    } else {
      setFilteredList(
        seriesList.filter(
          (s) => s.category?.toUpperCase() === activeFilter || s.type?.toUpperCase() === activeFilter
        )
      );
    }
  }, [activeFilter, seriesList]);

  if (loading) {
    return (
      <div className="page-content flex-center" style={{ minHeight: '60vh' }}>
        <Loader message="Loading tournaments..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content container">
        <EmptyState title="Error" message={error} />
        <div className="flex-center" style={{ marginTop: '16px' }}>
          <button onClick={fetchSeries} className="retry-btn">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content container">
      <div className="section-header">
        <h1 className="page-title flex items-center gap-2">
          <Trophy className="icon text-primary" size={24} />
          Cricket Tournaments
        </h1>
      </div>

      {/* Filters */}
      <div className="series-filter">
        {['ALL', 'INTERNATIONAL', 'DOMESTIC', 'LEAGUE'].map((filter) => (
          <button
            key={filter}
            className={`filter-chip ${activeFilter === filter ? 'filter-chip--active' : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter.charAt(0) + filter.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {filteredList.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No tournaments found"
          message={`No cricket series matches the filter "${activeFilter.toLowerCase()}" at this moment.`}
        />
      ) : (
        <div className="series-grid">
          {filteredList.map((series) => (
            <Link key={series._id} to={`/series/${series._id}`} className="series-card animate-fade-in-up">
              <div>
                <div style={{ marginBottom: '8px' }}>
                  <StatusBadge status={series.status} />
                </div>
                <h3 className="series-card__title">{series.name}</h3>
              </div>

              <div className="series-card__meta">
                <span className="flex items-center gap-1">
                  <Calendar size={13} />
                  {series.startDate ? new Date(series.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                </span>
                <span className="flex items-center gap-1">
                  {series.category || series.type || 'Tournament'}
                  <ChevronRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
