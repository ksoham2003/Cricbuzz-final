/**
 * Home Page
 * Public landing page with live data from public APIs
 */

import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/home.css';

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [series, setSeries] = useState([]);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        setLoading(true);
        
        // Fetch home data (live, upcoming, recent matches)
        const homeRes = await axios.get(`${API_BASE_URL}/home`);
        const homeData = homeRes.data.data || {};

        // Fetch all series
        const seriesRes = await axios.get(`${API_BASE_URL}/series?page=1&limit=6`);
        setSeries(seriesRes.data.data || []);

        // Fetch all teams
        const teamsRes = await axios.get(`${API_BASE_URL}/teams?page=1&limit=6`);
        setTeams(teamsRes.data.data || []);

        // Fetch all players
        const playersRes = await axios.get(`${API_BASE_URL}/players?page=1&limit=6`);
        setPlayers(playersRes.data.data || []);

        setError(null);
      } catch (err) {
        console.log('Error fetching public data:', err.message);
        setError(null); // Don't show error, fall back to static content
      } finally {
        setLoading(false);
      }
    };

    fetchPublicData();
  }, [API_BASE_URL]);

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="header-content">
          <h1 className="header-logo">🏏 CricBuzz</h1>
          <p className="header-tagline">Live Cricket Scoring Platform</p>
        </div>
        <div className="header-buttons">
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/register')}
          >
            Register
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h2>Welcome to CricBuzz</h2>
          <p>The Ultimate Live Cricket Scoring & Tournament Management Platform</p>
          <div className="hero-buttons">
            <button 
              className="btn btn-lg btn-primary"
              onClick={() => navigate('/login')}
            >
              Get Started
            </button>
            <button 
              className="btn btn-lg btn-outline"
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </button>
          </div>
        </div>
        <div className="hero-illustration">
          <div className="cricket-icon">🏏</div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Live Scoring</h3>
            <p>Real-time ball-by-ball scoring with instant updates across all devices</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Tournament Management</h3>
            <p>Create and manage multiple tournament series with teams and players</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Role-Based Access</h3>
            <p>SUPER_ADMIN, ADMIN, and SCORER roles with granular permissions</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>Real-Time Updates</h3>
            <p>WebSocket integration for instant score, commentary, and match updates</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Squad Management</h3>
            <p>Build squads (11-25 players) and select playing XI for each match</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Live Commentary</h3>
            <p>Add match events and commentary in real-time with multiple categories</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h4>Register Account</h4>
            <p>Create your account to get started</p>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <h4>Create Series</h4>
            <p>Set up a tournament with dates and format</p>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <h4>Add Teams & Players</h4>
            <p>Build teams and add cricket players</p>
          </div>

          <div className="step">
            <div className="step-number">4</div>
            <h4>Schedule Matches</h4>
            <p>Create matches and schedule dates</p>
          </div>

          <div className="step">
            <div className="step-number">5</div>
            <h4>Live Scoring</h4>
            <p>Score matches in real-time with commentary</p>
          </div>

          <div className="step">
            <div className="step-number">6</div>
            <h4>View Statistics</h4>
            <p>Track scores, stats, and match results</p>
          </div>
        </div>
      </section>

      {/* Live Data Section - From Public APIs */}
      <section className="live-data-section">
        <h2>🔴 Live on CricBuzz</h2>
        
        {loading ? (
          <div className="loading-spinner">Loading live data...</div>
        ) : (
          <>
            {/* Series Section */}
            {series.length > 0 && (
              <div className="live-data-subsection">
                <h3>Active Series & Tournaments</h3>
                <div className="live-grid">
                  {series.map((s) => (
                    <div key={s._id} className="live-card">
                      <div className="live-card-header">
                        <h4>{s.name}</h4>
                        <span className="format-badge">{s.format}</span>
                      </div>
                      <p className="series-shortname">{s.shortName}</p>
                      <p className="series-status">
                        <span className={`status-badge status-${s.status?.toLowerCase()}`}>
                          {s.status || 'UPCOMING'}
                        </span>
                      </p>
                      <p className="series-info">
                        {s.totalTeams || 0} teams • {s.startDate ? new Date(s.startDate).toLocaleDateString() : 'TBA'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Teams Section */}
            {teams.length > 0 && (
              <div className="live-data-subsection">
                <h3>Featured Teams</h3>
                <div className="live-grid">
                  {teams.map((t) => (
                    <div key={t._id} className="live-card team-card">
                      <div className="team-logo">
                        {t.logo ? <img src={t.logo} alt={t.name} /> : <div className="logo-placeholder">🏏</div>}
                      </div>
                      <h4>{t.name}</h4>
                      <p className="team-shortname">{t.shortName}</p>
                      <p className="team-city">{t.city || 'City TBA'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Players Section */}
            {players.length > 0 && (
              <div className="live-data-subsection">
                <h3>Top Players</h3>
                <div className="live-grid">
                  {players.map((p) => (
                    <div key={p._id} className="live-card player-card">
                      <div className="player-avatar">
                        {p.profileImage ? <img src={p.profileImage} alt={p.name} /> : <div className="avatar-placeholder">👤</div>}
                      </div>
                      <h4>{p.name}</h4>
                      <p className="player-role">{p.role || 'Player'}</p>
                      {p.jerseyNumber && <p className="jersey-number">Jersey #{p.jerseyNumber}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* Roles Section */}
      <section className="roles-section">
        <h2>User Roles</h2>
        <div className="roles-grid">
          <div className="role-card">
            <h3>👑 SUPER_ADMIN</h3>
            <ul>
              <li>Complete platform access</li>
              <li>User management</li>
              <li>Role assignment</li>
              <li>System settings</li>
              <li>All ADMIN features</li>
            </ul>
          </div>

          <div className="role-card">
            <h3>⚙️ ADMIN</h3>
            <ul>
              <li>Series management</li>
              <li>Team management</li>
              <li>Player management</li>
              <li>Squad creation</li>
              <li>Match scheduling</li>
              <li>Playing XI selection</li>
            </ul>
          </div>

          <div className="role-card">
            <h3>✏️ SCORER</h3>
            <ul>
              <li>Conduct match toss</li>
              <li>Start matches</li>
              <li>Ball-by-ball scoring</li>
              <li>Wicket recording</li>
              <li>Live commentary</li>
              <li>Complete matches</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Join thousands of cricket enthusiasts managing tournaments with CricBuzz</p>
        <div className="cta-buttons">
          <button 
            className="btn btn-lg btn-primary"
            onClick={() => navigate('/register')}
          >
            Create Account
          </button>
          <button 
            className="btn btn-lg btn-secondary"
            onClick={() => navigate('/login')}
          >
            Sign In
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <p>&copy; 2024 CricBuzz. All rights reserved.</p>
          <div className="footer-links">
            <a href="#features">Features</a>
            <a href="#roles">Roles</a>
            <a href="mailto:support@cricbuzz.com">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
