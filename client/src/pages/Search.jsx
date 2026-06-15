import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, Users, Trophy, Shield, PlayCircle, Radio } from 'lucide-react';
import { search } from '../api/searchApi';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import './Search.css';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [query, setQuery] = useState(queryParam);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setResults(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await search(searchQuery.trim());
      const data = res.data || res;
      setResults(data);
    } catch (err) {
      setError(err.message || 'Search request failed');
    } finally {
      setLoading(false);
    }
  }, []);

  // Update input field when URL query param changes
  useEffect(() => {
    setQuery(queryParam);
    performSearch(queryParam);
  }, [queryParam, performSearch]);

  // Handle manual input change with a minor debounce or on form submit
  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setSearchParams({ q: val });
  };

  const searchResults = results?.results || {};
  const hasResults =
    results &&
    (searchResults.players?.length > 0 ||
      searchResults.teams?.length > 0 ||
      searchResults.series?.length > 0);

  return (
    <div className="page-content container">
      <div className="search-bar-container">
        <div className="search-input-wrapper">
          <SearchIcon size={20} />
          <input
            type="text"
            placeholder="Search players, teams, series..."
            value={query}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {loading && (
        <div className="flex-center" style={{ minHeight: '30vh' }}>
          <Loader message="Searching CricBuzz database..." />
        </div>
      )}

      {error && <EmptyState title="Search Error" message={error} />}

      {!loading && !error && query.trim().length < 2 && (
        <EmptyState
          icon={SearchIcon}
          title="Search CricBuzz"
          message="Enter at least 2 characters to search for matches, series, players, and teams."
        />
      )}

      {!loading && !error && query.trim().length >= 2 && !hasResults && results && (
        <EmptyState
          icon={Radio}
          title="No results found"
          message={`We couldn't find any series, players, or teams for "${query}".`}
        />
      )}

      {!loading && !error && hasResults && (
        <div className="animate-fade-in">
          {/* Series */}
          {searchResults.series?.length > 0 && (
            <div className="search-results-section">
              <h2 className="search-results-section__title flex items-center gap-2">
                <Trophy size={18} /> Series
              </h2>
              <div className="search-results-list">
                {searchResults.series.map((series) => (
                  <Link key={series._id} to={`/series/${series._id}`} className="search-result-item">
                    <div className="search-result-icon">
                      <Trophy size={18} />
                    </div>
                    <div>
                      <div className="font-bold text-primary">{series.name}</div>
                      <div className="text-xs text-muted">{series.category || series.format || 'Tournament'}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Teams */}
          {searchResults.teams?.length > 0 && (
            <div className="search-results-section">
              <h2 className="search-results-section__title flex items-center gap-2">
                <Shield size={18} /> Teams
              </h2>
              <div className="search-results-list">
                {searchResults.teams.map((team) => (
                  <Link key={team._id} to={`/teams/${team._id}`} className="search-result-item">
                    <div className="search-result-icon">
                      <Shield size={18} />
                    </div>
                    <div>
                      <div className="font-bold text-primary">{team.name}</div>
                      <div className="text-xs text-muted">{team.shortName || 'Code'}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Players */}
          {searchResults.players?.length > 0 && (
            <div className="search-results-section">
              <h2 className="search-results-section__title flex items-center gap-2">
                <Users size={18} /> Players
              </h2>
              <div className="search-results-list">
                {searchResults.players.map((player) => (
                  <Link key={player._id} to={`/players/${player._id}`} className="search-result-item">
                    <div className="search-result-icon">
                      <Users size={18} />
                    </div>
                    <div>
                      <div className="font-bold text-primary">{player.fullName || `${player.firstName} ${player.lastName}`}</div>
                      <div className="text-xs text-muted">
                        {player.role || player.playingRole} • {player.country}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
