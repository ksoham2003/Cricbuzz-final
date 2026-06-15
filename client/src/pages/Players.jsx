import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, User, Filter } from 'lucide-react';
import { getAllPlayers } from '../api/playerApi';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import './Players.css';

export default function Players() {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');

  useEffect(() => {
    document.title = 'Cricket Players & Biographies — CricBuzz';
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const res = await getAllPlayers();
      const data = res.data?.data || res.data || res;
      setPlayers(Array.isArray(data) ? data : []);
      setFilteredPlayers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load players');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = players;

    if (selectedRole !== 'ALL') {
      result = result.filter(
        (p) => p.role?.toUpperCase() === selectedRole || p.playingRole?.toUpperCase() === selectedRole
      );
    }

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(query) ||
          p.country?.toLowerCase().includes(query)
      );
    }

    setFilteredPlayers(result);
  }, [searchTerm, selectedRole, players]);

  if (loading) {
    return (
      <div className="page-content flex-center" style={{ minHeight: '60vh' }}>
        <Loader message="Loading players directory..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content container">
        <EmptyState title="Error" message={error} />
        <div className="flex-center" style={{ marginTop: '16px' }}>
          <button onClick={fetchPlayers} className="retry-btn">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content container">
      <div className="section-header">
        <h1 className="page-title flex items-center gap-2">
          <Users className="icon text-primary" size={24} />
          Cricket Players
        </h1>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="navbar__mobile-search-inner flex-1" style={{ background: 'var(--bg-card)' }}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by player name or country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="navbar__mobile-search-input"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {['ALL', 'BATSMAN', 'BOWLER', 'ALL_ROUNDER', 'WICKETKEEPER'].map((role) => (
            <button
              key={role}
              className={`filter-chip ${selectedRole === role ? 'filter-chip--active' : ''}`}
              onClick={() => setSelectedRole(role)}
            >
              {role === 'ALL_ROUNDER' ? 'All Rounder' : role === 'WICKETKEEPER' ? 'Wicket Keeper' : role.charAt(0) + role.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {filteredPlayers.length === 0 ? (
        <EmptyState
          icon={User}
          title="No players found"
          message="Try adjusting your filters or search terms."
        />
      ) : (
        <div className="players-grid">
          {filteredPlayers.map((player) => (
            <Link key={player._id} to={`/players/${player._id}`} className="player-card animate-fade-in-up">
              <div className="player-card__avatar">
                {player.fullName ? player.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'PL'}
              </div>
              <div className="player-card__info">
                <h3 className="player-card__name">{player.fullName || `${player.firstName} ${player.lastName}`}</h3>
                <span className="player-card__role">{player.role || player.playingRole || 'Player'}</span>
                <span className="player-card__country">{player.country || 'N/A'}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
