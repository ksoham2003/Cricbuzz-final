import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Clock, Trophy, ChevronRight, Radio } from 'lucide-react';
import MatchCard from '../components/MatchCard';
import Loader, { SkeletonCard } from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { getHomeData } from '../api/matchApi';
import './Home.css';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'CricBuzz — Live Cricket Scores & Updates';
    fetchHome();
  }, []);

  const fetchHome = async () => {
    try {
      setLoading(true);
      const res = await getHomeData();
      setData(res.data || res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-content">
        <div className="container">
          <div className="home-hero-skeleton">
            <div className="skeleton" style={{ height: '200px', borderRadius: '16px' }} />
          </div>
          <div className="match-grid" style={{ marginTop: '32px' }}>
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content">
        <div className="container">
          <EmptyState
            title="Unable to load data"
            message={error}
          />
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button onClick={fetchHome} className="retry-btn">Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  const liveMatches = data?.liveMatches || [];
  const upcomingMatches = data?.upcomingMatches || [];
  const recentMatches = data?.recentMatches || [];

  return (
    <div className="page-content">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="container">
          <div className="home-hero__content animate-fade-in-up">
            <div className="home-hero__badge">
              <Zap size={14} />
              <span>Live Cricket</span>
            </div>
            <h1 className="home-hero__title">
              Your Cricket <span className="gradient-text">Command Center</span>
            </h1>
            <p className="home-hero__subtitle">
              Real-time scores, ball-by-ball commentary, and complete cricket coverage
            </p>
          </div>
        </div>
        <div className="home-hero__bg" />
      </section>

      <div className="container">
        {/* Live Matches */}
        {liveMatches.length > 0 && (
          <section className="home-section animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="section-header">
              <h2 className="section-title">
                <Radio size={20} className="icon live-icon" />
                Live Matches
              </h2>
              <Link to="/matches?status=live" className="section-link">
                View All <ChevronRight size={16} />
              </Link>
            </div>
            <div className="match-grid">
              {liveMatches.map((match, i) => (
                <MatchCard key={match._id} match={match} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Matches */}
        {upcomingMatches.length > 0 && (
          <section className="home-section animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="section-header">
              <h2 className="section-title">
                <Clock size={20} className="icon" />
                Upcoming
              </h2>
              <Link to="/matches?status=upcoming" className="section-link">
                View All <ChevronRight size={16} />
              </Link>
            </div>
            <div className="match-grid">
              {upcomingMatches.map((match, i) => (
                <MatchCard key={match._id} match={match} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Recent Results */}
        {recentMatches.length > 0 && (
          <section className="home-section animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="section-header">
              <h2 className="section-title">
                <Trophy size={20} className="icon" />
                Recent Results
              </h2>
              <Link to="/matches?status=completed" className="section-link">
                View All <ChevronRight size={16} />
              </Link>
            </div>
            <div className="match-grid">
              {recentMatches.map((match, i) => (
                <MatchCard key={match._id} match={match} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* No matches at all */}
        {!liveMatches.length && !upcomingMatches.length && !recentMatches.length && (
          <EmptyState
            icon={Radio}
            title="No matches available"
            message="Check back later for upcoming cricket matches and live scores."
          />
        )}
      </div>
    </div>
  );
}
