import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { MapPin, Calendar, ArrowLeft, Radio, Info, BarChart3, MessageSquare, Users } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { useSocket } from '../hooks/useSocket';
import { getMatchCenter, getScorecard, getCommentary } from '../api/matchApi';
import { formatMatchDate, formatScore, formatOvers, getTeamShort, getInitials, getRoleLabel } from '../utils/helpers';
import './MatchCenter.css';

const TABS = [
  { key: 'info', label: 'Info', icon: Info },
  { key: 'live', label: 'Live', icon: Radio },
  { key: 'scorecard', label: 'Scorecard', icon: BarChart3 },
  { key: 'commentary', label: 'Commentary', icon: MessageSquare },
  { key: 'playing-xi', label: 'Playing XI', icon: Users },
];

export default function MatchCenter() {
  const { matchId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTab = searchParams.get('tab') || 'live';

  const [matchData, setMatchData] = useState(null);
  const [scorecard, setScorecard] = useState(null);
  const [commentary, setCommentary] = useState([]);
  const [commentaryPage, setCommentaryPage] = useState(1);
  const [hasMoreCommentary, setHasMoreCommentary] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [flashScore, setFlashScore] = useState(false);

  // Socket.IO for real-time updates
  useSocket(matchId, {
    onScoreUpdate: (data) => {
      setMatchData(prev => {
        if (!prev) return prev;
        return { ...prev, liveScore: data };
      });
      setFlashScore(true);
      setTimeout(() => setFlashScore(false), 1000);
    },
    onCommentary: (data) => {
      setCommentary(prev => [data, ...prev]);
    },
    onMatchCompleted: (data) => {
      setMatchData(prev => prev ? { ...prev, matchInfo: { ...prev.matchInfo, ...data } } : prev);
    },
    onMatchStarted: (data) => {
      setMatchData(prev => prev ? { ...prev, matchInfo: { ...prev.matchInfo, ...data } } : prev);
    },
  });

  useEffect(() => {
    fetchMatchData();
  }, [matchId]);

  useEffect(() => {
    if (activeTab === 'commentary') {
      fetchCommentary(1);
    } else if (activeTab === 'scorecard') {
      fetchScorecard();
    }
  }, [activeTab, matchId]);

  const fetchMatchData = async () => {
    try {
      setLoading(true);
      const res = await getMatchCenter(matchId);
      const d = res.data || res;
      setMatchData(d);
      document.title = `${getTeamShort(d.matchInfo?.team1)} vs ${getTeamShort(d.matchInfo?.team2)} — CricBuzz`;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchScorecard = async () => {
    try {
      const res = await getScorecard(matchId);
      setScorecard(res.data || res);
    } catch (err) {
      console.error('Scorecard error:', err);
    }
  };

  const fetchCommentary = async (page) => {
    try {
      const res = await getCommentary(matchId, page);
      const items = res.data || res;
      if (page === 1) {
        setCommentary(Array.isArray(items) ? items : []);
      } else {
        setCommentary(prev => [...prev, ...(Array.isArray(items) ? items : [])]);
      }
      setHasMoreCommentary(Array.isArray(items) && items.length >= 50);
      setCommentaryPage(page);
    } catch (err) {
      console.error('Commentary error:', err);
    }
  };

  const setTab = (tab) => {
    setSearchParams({ tab });
  };

  if (loading) return <div className="page-content"><Loader text="Loading match..." /></div>;
  if (error) return (
    <div className="page-content">
      <div className="container">
        <EmptyState title="Match not found" message={error} />
      </div>
    </div>
  );

  const match = matchData?.matchInfo;
  const liveScore = matchData?.liveScore;
  const playingXI = matchData?.playingXI || match?.playingXI;
  const isLive = match?.status === 'LIVE' || match?.status === 'INNINGS_BREAK';

  return (
    <div className="page-content">
      <div className="container">
        {/* Back Button */}
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        {/* Match Header */}
        <div className={`match-header ${isLive ? 'match-header--live' : ''}`}>
          <div className="match-header__top">
            <span className="match-header__series">{match?.series?.name || match?.matchNumber}</span>
            <StatusBadge status={match?.status} />
          </div>

          <div className="match-header__scores">
            {/* Team 1 */}
            <div className="match-header__team">
              <div className="match-header__team-logo" style={{ background: match?.team1?.primaryColor || 'var(--color-primary)' }}>
                {match?.team1?.logo ? <img src={match.team1.logo} alt="" /> : <span>{getInitials(match?.team1?.name)}</span>}
              </div>
              <div className="match-header__team-details">
                <span className="match-header__team-name">{match?.team1?.name}</span>
                <span className="match-header__team-short">{getTeamShort(match?.team1)}</span>
              </div>
            </div>

            {/* Score Display */}
            <div className={`match-header__score-box ${flashScore ? 'score-flash' : ''}`}>
              {liveScore ? (
                Array.isArray(liveScore) ? (
                  liveScore.map((s, i) => (
                    <div key={i} className="match-header__innings-score">
                      <span className="match-header__score-value">{formatScore(s)}</span>
                      <span className="match-header__score-overs">{formatOvers(s.overs)}</span>
                    </div>
                  ))
                ) : (
                  <div className="match-header__innings-score">
                    <span className="match-header__score-value">{formatScore(liveScore)}</span>
                    <span className="match-header__score-overs">{formatOvers(liveScore.overs)}</span>
                  </div>
                )
              ) : (
                <span className="match-header__vs">VS</span>
              )}
            </div>

            {/* Team 2 */}
            <div className="match-header__team match-header__team--right">
              <div className="match-header__team-details" style={{ textAlign: 'right' }}>
                <span className="match-header__team-name">{match?.team2?.name}</span>
                <span className="match-header__team-short">{getTeamShort(match?.team2)}</span>
              </div>
              <div className="match-header__team-logo" style={{ background: match?.team2?.primaryColor || 'var(--color-primary-dark)' }}>
                {match?.team2?.logo ? <img src={match.team2.logo} alt="" /> : <span>{getInitials(match?.team2?.name)}</span>}
              </div>
            </div>
          </div>

          {match?.result && (
            <p className="match-header__result">{match.result}</p>
          )}

          <div className="match-header__meta">
            {match?.venue && <span><MapPin size={14} /> {match.venue}</span>}
            {match?.startTime && <span><Calendar size={14} /> {formatMatchDate(match.startTime)}</span>}
          </div>
        </div>

        {/* Tabs */}
        <div className="tab-list">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`tab-item ${activeTab === key ? 'active' : ''}`}
              onClick={() => setTab(key)}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="tab-content animate-fade-in">
          {activeTab === 'info' && <InfoTab match={match} />}
          {activeTab === 'live' && <LiveTab match={match} liveScore={liveScore} />}
          {activeTab === 'scorecard' && <ScorecardTab scorecard={scorecard} match={match} />}
          {activeTab === 'commentary' && (
            <CommentaryTab
              commentary={commentary}
              hasMore={hasMoreCommentary}
              onLoadMore={() => fetchCommentary(commentaryPage + 1)}
            />
          )}
          {activeTab === 'playing-xi' && <PlayingXITab playingXI={playingXI} match={match} />}
        </div>
      </div>
    </div>
  );
}

/* ─── Tab Components ─── */

function InfoTab({ match }) {
  if (!match) return null;
  return (
    <div className="info-tab">
      <div className="info-card">
        <h3>Match Details</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Series</span>
            <span className="info-value">{match.series?.name || '—'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Match</span>
            <span className="info-value">{match.matchNumber || '—'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Venue</span>
            <span className="info-value">{match.venue || '—'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Date & Time</span>
            <span className="info-value">{formatMatchDate(match.startTime)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Status</span>
            <span className="info-value"><StatusBadge status={match.status} /></span>
          </div>
          {match.tossWinner && (
            <div className="info-item">
              <span className="info-label">Toss</span>
              <span className="info-value">
                {match.tossWinner?.name || match.tossWinner?.shortName} won the toss and elected to {match.tossDecision?.toLowerCase()}
              </span>
            </div>
          )}
          {match.result && (
            <div className="info-item info-item--full">
              <span className="info-label">Result</span>
              <span className="info-value info-value--result">{match.result}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LiveTab({ match, liveScore }) {
  const scores = Array.isArray(liveScore) ? liveScore : (liveScore ? [liveScore] : []);

  return (
    <div className="live-tab">
      {scores.length > 0 ? (
        scores.map((s, i) => (
          <div key={i} className="live-score-card">
            <div className="live-score-card__header">
              <span className="live-score-card__innings">
                {i === 0 ? '1st Innings' : '2nd Innings'}
              </span>
              {s.runRate > 0 && (
                <span className="live-score-card__rr">CRR: {s.runRate?.toFixed(2)}</span>
              )}
            </div>
            <div className="live-score-card__score">
              <span className="live-score-card__runs">{formatScore(s)}</span>
              <span className="live-score-card__overs">{formatOvers(s.overs)}</span>
            </div>
            {s.target && (
              <p className="live-score-card__target">Target: {s.target}</p>
            )}
          </div>
        ))
      ) : (
        <EmptyState
          icon={Radio}
          title="No live score available"
          message="Score will appear here once the match goes live."
        />
      )}
    </div>
  );
}

function ScorecardTab({ scorecard, match }) {
  if (!scorecard) return <Loader text="Loading scorecard..." />;

  const innings1 = scorecard.innings1 || scorecard[0];
  const innings2 = scorecard.innings2 || scorecard[1];
  const allInnings = [innings1, innings2].filter(Boolean);

  if (!allInnings.length) {
    return <EmptyState icon={BarChart3} title="No scorecard available" message="Scorecard will be available once the match starts." />;
  }

  return (
    <div className="scorecard-tab">
      {allInnings.map((inning, idx) => (
        <div key={idx} className="scorecard-innings">
          <h3 className="scorecard-innings__title">
            {idx === 0 ? '1st Innings' : '2nd Innings'}
            {inning.battingTeam && (
              <span className="scorecard-innings__team"> — {inning.battingTeam?.name || inning.battingTeam?.shortName}</span>
            )}
          </h3>
          <div className="scorecard-innings__summary">
            <span className="scorecard-innings__score">{formatScore(inning)}</span>
            <span className="scorecard-innings__overs">{formatOvers(inning.overs)}</span>
            {inning.runRate > 0 && <span className="scorecard-innings__rr">RR: {inning.runRate?.toFixed(2)}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function CommentaryTab({ commentary, hasMore, onLoadMore }) {
  if (!commentary.length) {
    return <EmptyState icon={MessageSquare} title="No commentary yet" message="Ball-by-ball commentary will appear here." />;
  }

  return (
    <div className="commentary-tab">
      {commentary.map((c, i) => (
        <div
          key={c._id || i}
          className={`commentary-item commentary--${(c.type || 'normal').toLowerCase()}`}
          style={{ animationDelay: `${i * 30}ms` }}
        >
          <div className="commentary-item__header">
            <span className="commentary-item__over">{c.over}.{c.ball}</span>
            {c.type && c.type !== 'NORMAL' && (
              <span className={`commentary-type commentary-type--${c.type.toLowerCase()}`}>
                {c.type}
              </span>
            )}
          </div>
          <p className="commentary-item__text">{c.text}</p>
        </div>
      ))}

      {hasMore && (
        <button className="load-more-btn" onClick={onLoadMore}>
          Load More Commentary
        </button>
      )}
    </div>
  );
}

function PlayingXITab({ playingXI, match }) {
  const team1XI = playingXI?.team1 || [];
  const team2XI = playingXI?.team2 || [];

  if (!team1XI.length && !team2XI.length) {
    return <EmptyState icon={Users} title="Playing XI not announced" message="Playing XI will be available after team selection." />;
  }

  return (
    <div className="playing-xi-tab">
      <div className="playing-xi-grid">
        {/* Team 1 */}
        <div className="playing-xi-team">
          <div className="playing-xi-team__header" style={{ borderColor: match?.team1?.primaryColor || 'var(--color-primary)' }}>
            <div className="playing-xi-team__logo" style={{ background: match?.team1?.primaryColor || 'var(--color-primary)' }}>
              {match?.team1?.logo ? <img src={match.team1.logo} alt="" /> : <span>{getInitials(match?.team1?.name)}</span>}
            </div>
            <h3>{match?.team1?.name || 'Team 1'}</h3>
          </div>
          <div className="playing-xi-list">
            {team1XI.map((p, i) => (
              <PlayerRow key={p.player?._id || i} player={p} index={i} />
            ))}
          </div>
        </div>

        {/* Team 2 */}
        <div className="playing-xi-team">
          <div className="playing-xi-team__header" style={{ borderColor: match?.team2?.primaryColor || 'var(--color-primary-dark)' }}>
            <div className="playing-xi-team__logo" style={{ background: match?.team2?.primaryColor || 'var(--color-primary-dark)' }}>
              {match?.team2?.logo ? <img src={match.team2.logo} alt="" /> : <span>{getInitials(match?.team2?.name)}</span>}
            </div>
            <h3>{match?.team2?.name || 'Team 2'}</h3>
          </div>
          <div className="playing-xi-list">
            {team2XI.map((p, i) => (
              <PlayerRow key={p.player?._id || i} player={p} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayerRow({ player, index }) {
  const p = player?.player || player;
  return (
    <div className="player-row animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="player-row__info">
        <span className="player-row__num">{index + 1}</span>
        <div className="player-row__avatar">
          {p?.image ? <img src={p.image} alt="" /> : <span>{getInitials(p?.name)}</span>}
        </div>
        <span className="player-row__name">{p?.name || 'Unknown'}</span>
      </div>
      <div className="player-row__badges">
        {player?.isCaptain && <span className="badge badge--captain">C</span>}
        {player?.isWicketKeeper && <span className="badge badge--wk">WK</span>}
        {p?.role && <span className="badge badge--role">{getRoleLabel(p.role)}</span>}
      </div>
    </div>
  );
}
