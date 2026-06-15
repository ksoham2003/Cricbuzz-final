import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Award, Users, CheckCircle, MessageSquare, Plus, Zap, AlertTriangle, FileText } from 'lucide-react';
import { getMatchDetails } from '../api/matchApi';
import { getAllPlayers } from '../api/playerApi';
import {
  recordToss,
  selectPlayingXi,
  startMatch,
  inningsBreak,
  completeMatch,
  createScore,
  updateScore,
  getScores,
  postCommentary
} from '../api/scorerApi';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import './Scorer.css';

export default function ScorerPanel() {
  const { matchId } = useParams();
  const navigate = useNavigate();

  // State variables
  const [match, setMatch] = useState(null);
  const [players, setPlayers] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Form states
  // 1. Toss Form
  const [tossWinner, setTossWinner] = useState('');
  const [tossDecision, setTossDecision] = useState('BAT');

  // 2. Playing XI Form
  const [selectedTeam1Players, setSelectedTeam1Players] = useState([]); // Array of player IDs
  const [selectedTeam2Players, setSelectedTeam2Players] = useState([]); // Array of player IDs
  const [team1Captain, setTeam1Captain] = useState('');
  const [team1WK, setTeam1WK] = useState('');
  const [team2Captain, setTeam2Captain] = useState('');
  const [team2WK, setTeam2WK] = useState('');

  // 3. Score Form
  const [activeScoreTab, setActiveScoreTab] = useState(0); // Index of active score
  const [scoreRuns, setScoreRuns] = useState(0);
  const [scoreWickets, setScoreWickets] = useState(0);
  const [scoreOvers, setScoreOvers] = useState('0.0');
  const [scoreRunRate, setScoreRunRate] = useState(0);
  const [scoreTarget, setScoreTarget] = useState('');

  // 4. Commentary Form
  const [commOver, setCommOver] = useState(0);
  const [commBall, setCommBall] = useState(1);
  const [commText, setCommText] = useState('');
  const [commType, setCommType] = useState('NORMAL');

  // 5. Match End Form
  const [matchWinner, setMatchWinner] = useState('');
  const [matchResultText, setMatchResultText] = useState('');

  useEffect(() => {
    fetchPanelData();
  }, [matchId]);

  const fetchPanelData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch match, scores, and all players
      const [matchRes, playersRes, scoresRes] = await Promise.all([
        getMatchDetails(matchId),
        getAllPlayers().catch(() => ({ data: [] })),
        getScores(matchId).catch(() => ({ data: [] }))
      ]);

      const matchData = matchRes.data?.match || matchRes.match || matchRes;
      const playersData = playersRes.data || playersRes;
      const scoresData = scoresRes.data || scoresRes;

      setMatch(matchData);
      setPlayers(playersData || []);
      setScores(scoresData || []);

      if (matchData) {
        document.title = `Score Match: ${matchData.team1?.name} vs ${matchData.team2?.name}`;
        
        // Initialize Form defaults
        setTossWinner(matchData.team1?._id || '');
        setMatchWinner(matchData.team1?._id || '');
        
        // If playing XI exists in match, pre-fill the selections
        if (matchData.playingXI?.team1?.length > 0) {
          setSelectedTeam1Players(matchData.playingXI.team1.map(p => p.player?._id || p.player));
          const cap = matchData.playingXI.team1.find(p => p.isCaptain);
          const wk = matchData.playingXI.team1.find(p => p.isWicketKeeper);
          if (cap) setTeam1Captain(cap.player?._id || cap.player);
          if (wk) setTeam1WK(wk.player?._id || wk.player);
        }
        if (matchData.playingXI?.team2?.length > 0) {
          setSelectedTeam2Players(matchData.playingXI.team2.map(p => p.player?._id || p.player));
          const cap = matchData.playingXI.team2.find(p => p.isCaptain);
          const wk = matchData.playingXI.team2.find(p => p.isWicketKeeper);
          if (cap) setTeam2Captain(cap.player?._id || cap.player);
          if (wk) setTeam2WK(wk.player?._id || wk.player);
        }
      }

      // Initialize score update fields if scores exist
      if (scoresData && scoresData.length > 0) {
        const activeScore = scoresData[activeScoreTab] || scoresData[0];
        setScoreRuns(activeScore.score || 0);
        setScoreWickets(activeScore.wickets || 0);
        setScoreOvers(activeScore.overs || '0.0');
        setScoreRunRate(activeScore.runRate || 0);
        setScoreTarget(activeScore.target || '');
      }
    } catch (err) {
      setError(err.message || 'Failed to load match or players');
    } finally {
      setLoading(false);
    }
  };

  // Sync score input values when activeScoreTab changes
  useEffect(() => {
    if (scores && scores[activeScoreTab]) {
      const activeScore = scores[activeScoreTab];
      setScoreRuns(activeScore.score || 0);
      setScoreWickets(activeScore.wickets || 0);
      setScoreOvers(activeScore.overs || '0.0');
      setScoreRunRate(activeScore.runRate || 0);
      setScoreTarget(activeScore.target || '');
    }
  }, [activeScoreTab, scores]);

  // Filters players belonging to Team 1 and Team 2
  const team1Players = players.filter(p => p.teamId === (match?.team1?._id || match?.team1));
  const team2Players = players.filter(p => p.teamId === (match?.team2?._id || match?.team2));

  // Handler for Toss Form submission
  const handleRecordToss = async (e) => {
    e.preventDefault();
    if (!tossWinner || !tossDecision) return;

    try {
      setSubmitting(true);
      setError(null);
      setMessage(null);
      await recordToss(matchId, { tossWinner, decision: tossDecision });
      setMessage('Toss recorded successfully!');
      fetchPanelData();
    } catch (err) {
      setError(err.message || 'Failed to record toss');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle selection for Team 1 players
  const toggleTeam1Player = (playerId) => {
    setSelectedTeam1Players(prev => 
      prev.includes(playerId) ? prev.filter(id => id !== playerId) : [...prev, playerId]
    );
  };

  // Toggle selection for Team 2 players
  const toggleTeam2Player = (playerId) => {
    setSelectedTeam2Players(prev => 
      prev.includes(playerId) ? prev.filter(id => id !== playerId) : [...prev, playerId]
    );
  };

  // Handler for Selecting Playing XI Form
  const handleSelectPlayingXi = async (e) => {
    e.preventDefault();
    
    if (selectedTeam1Players.length !== 11 || selectedTeam2Players.length !== 11) {
      setError('You must select exactly 11 players for each team.');
      return;
    }

    if (!team1Captain || !team2Captain) {
      setError('Please select a captain for both teams.');
      return;
    }

    if (!team1WK || !team2WK) {
      setError('Please select a wicketkeeper for both teams.');
      return;
    }

    // Map selections to structure expected by backend
    const team1Data = selectedTeam1Players.map(id => ({
      player: id,
      isCaptain: id === team1Captain,
      isWicketKeeper: id === team1WK
    }));

    const team2Data = selectedTeam2Players.map(id => ({
      player: id,
      isCaptain: id === team2Captain,
      isWicketKeeper: id === team2WK
    }));

    try {
      setSubmitting(true);
      setError(null);
      setMessage(null);
      await selectPlayingXi(matchId, { team1: team1Data, team2: team2Data });
      setMessage('Playing XI selected successfully!');
      fetchPanelData();
    } catch (err) {
      setError(err.message || 'Failed to save Playing XI');
    } finally {
      setSubmitting(false);
    }
  };

  // Start match handler
  const handleStartMatch = async () => {
    try {
      setSubmitting(true);
      setError(null);
      setMessage(null);
      await startMatch(matchId);
      setMessage('Match is now LIVE!');
      fetchPanelData();
    } catch (err) {
      setError(err.message || 'Failed to start match');
    } finally {
      setSubmitting(false);
    }
  };

  // Innings break handler
  const handleInningsBreak = async () => {
    try {
      setSubmitting(true);
      setError(null);
      setMessage(null);
      await inningsBreak(matchId);
      setMessage('Match entered innings break.');
      fetchPanelData();
    } catch (err) {
      setError(err.message || 'Failed to transition to innings break');
    } finally {
      setSubmitting(false);
    }
  };

  // End match handler
  const handleEndMatch = async (e) => {
    e.preventDefault();
    if (!matchWinner || !matchResultText) return;

    try {
      setSubmitting(true);
      setError(null);
      setMessage(null);
      await completeMatch(matchId, { winner: matchWinner, result: matchResultText });
      setMessage('Match marked as COMPLETED.');
      fetchPanelData();
    } catch (err) {
      setError(err.message || 'Failed to complete match');
    } finally {
      setSubmitting(false);
    }
  };

  // Initialize Score document for 1st or 2nd innings
  const handleInitializeScore = async (inningsNum) => {
    // Determine batting team
    // Innings 1 batting team:
    // If tossWinner === team1 and decision === BAT: team1 bats. If decision === BOWL: team2 bats.
    const isTeam1TossWin = match.tossWinner === (match.team1?._id || match.team1);
    const tossDecisionBat = match.tossDecision === 'BAT';
    
    let battingTeamId = '';
    if (inningsNum === 1) {
      battingTeamId = (isTeam1TossWin && tossDecisionBat) || (!isTeam1TossWin && !tossDecisionBat)
        ? (match.team1?._id || match.team1)
        : (match.team2?._id || match.team2);
    } else {
      battingTeamId = (isTeam1TossWin && tossDecisionBat) || (!isTeam1TossWin && !tossDecisionBat)
        ? (match.team2?._id || match.team2)
        : (match.team1?._id || match.team1);
    }

    try {
      setSubmitting(true);
      setError(null);
      setMessage(null);

      const targetVal = inningsNum === 2 && scores[0] ? scores[0].score + 1 : undefined;

      await createScore({
        matchId,
        innings: inningsNum,
        battingTeam: battingTeamId,
        score: 0,
        wickets: 0,
        overs: '0.0',
        runRate: 0,
        target: targetVal
      });

      setMessage(`Innings ${inningsNum} scorecard initialized!`);
      fetchPanelData();
    } catch (err) {
      setError(err.message || 'Failed to initialize score card');
    } finally {
      setSubmitting(false);
    }
  };

  // Update Score scorecard details
  const handleUpdateScore = async (e) => {
    e.preventDefault();
    const activeScore = scores[activeScoreTab];
    if (!activeScore) return;

    try {
      setSubmitting(true);
      setError(null);
      setMessage(null);

      await updateScore(activeScore._id, {
        score: Number(scoreRuns),
        wickets: Number(scoreWickets),
        overs: scoreOvers,
        runRate: Number(scoreRunRate),
        target: scoreTarget ? Number(scoreTarget) : null
      });

      setMessage('Scorecard updated!');
      fetchPanelData();
    } catch (err) {
      setError(err.message || 'Failed to update scorecard');
    } finally {
      setSubmitting(false);
    }
  };

  // Submit ball commentary
  const handlePostCommentary = async (e) => {
    e.preventDefault();
    if (!commText) return;

    try {
      setSubmitting(true);
      setError(null);
      setMessage(null);

      await postCommentary({
        matchId,
        over: Number(commOver),
        ball: Number(commBall),
        text: commText.trim(),
        type: commType
      });

      setCommText('');
      // Auto advance ball
      if (commBall < 6) {
        setCommBall(prev => prev + 1);
      } else {
        setCommBall(1);
        setCommOver(prev => prev + 1);
      }

      setMessage('Ball commentary posted!');
      fetchPanelData();
    } catch (err) {
      setError(err.message || 'Failed to post commentary');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-content flex-center" style={{ minHeight: '60vh' }}>
        <Loader message="Loading scoring dashboard..." />
      </div>
    );
  }

  if (error && !match) {
    return (
      <div className="page-content container">
        <Link to="/scorer" className="back-btn">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <EmptyState title="Error" message={error} />
      </div>
    );
  }

  const isScheduled = match.status === 'UPCOMING';
  const isTossCompleted = match.status === 'TOSS_COMPLETED';
  const isPlayingXISelected = match.status === 'PLAYING_XI_SELECTED';
  const isLive = match.status === 'LIVE';
  const isInningsBreak = match.status === 'INNINGS_BREAK';

  return (
    <div className="page-content container scorer-layout">
      {/* Header back button */}
      <Link to="/scorer" className="back-btn" style={{ marginBottom: '16px' }}>
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>

      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Zap className="icon text-primary animate-pulse" size={24} />
            {match.team1?.name} vs {match.team2?.name}
          </h1>
          <p className="text-secondary text-sm">
            Venue: {match.venue} • Format: {match.format} • Status: <span className="font-bold text-primary">{match.status}</span>
          </p>
        </div>
      </div>

      {message && (
        <div className="alert bg-green-950/20 border border-green-500/30 text-green-400 p-4 rounded-lg text-sm text-center mb-6">
          {message}
        </div>
      )}

      {error && (
        <div className="auth-error mb-6">
          {error}
        </div>
      )}

      <div className="panel-grid">
        {/* Left Side: Lifecycle & Action Cards */}
        <div className="flex flex-col gap-6">
          {/* TOSS SETUP */}
          {isScheduled && (
            <div className="panel-card animate-fade-in-up">
              <h2 className="panel-card__title flex items-center gap-2">
                <Award size={18} className="text-primary" /> Setup Toss Result
              </h2>
              <form onSubmit={handleRecordToss} className="auth-form">
                <div className="form-group">
                  <label className="form-label">Toss Winner</label>
                  <select
                    className="form-select"
                    value={tossWinner}
                    onChange={(e) => setTossWinner(e.target.value)}
                  >
                    <option value={match.team1?._id || match.team1}>{match.team1?.name}</option>
                    <option value={match.team2?._id || match.team2}>{match.team2?.name}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Toss Decision</label>
                  <select
                    className="form-select"
                    value={tossDecision}
                    onChange={(e) => setTossDecision(e.target.value)}
                  >
                    <option value="BAT">Batting First</option>
                    <option value="BOWL">Bowling First</option>
                  </select>
                </div>

                <button type="submit" className="auth-btn" disabled={submitting}>
                  Confirm Toss Result
                </button>
              </form>
            </div>
          )}

          {/* PLAYING XI SETUP */}
          {(isTossCompleted || isScheduled) && (
            <div className="panel-card animate-fade-in-up">
              <h2 className="panel-card__title flex items-center gap-2">
                <Users size={18} className="text-primary" /> Select Playing XI (11 Players Each)
              </h2>
              {isScheduled && (
                <div className="text-amber-500 text-xs flex items-center gap-1 mb-4 bg-amber-950/20 p-2 rounded">
                  <AlertTriangle size={12} />
                  <span>We recommend completing the Toss before submitting the final Playing XI.</span>
                </div>
              )}
              <form onSubmit={handleSelectPlayingXi} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Team 1 Players */}
                  <div>
                    <h3 className="text-primary text-sm font-semibold mb-2">{match.team1?.name} ({selectedTeam1Players.length}/11)</h3>
                    <div className="playing-xi-list">
                      {team1Players.length === 0 ? (
                        <div className="text-xs text-muted p-2">No players added for this team yet.</div>
                      ) : (
                        team1Players.map(p => (
                          <div key={p._id} className="xi-player-row">
                            <label className={`xi-player-info ${selectedTeam1Players.includes(p._id) ? 'xi-player-info--selected' : ''}`}>
                              <input
                                type="checkbox"
                                checked={selectedTeam1Players.includes(p._id)}
                                onChange={() => toggleTeam1Player(p._id)}
                              />
                              <span>{p.fullName || `${p.firstName} ${p.lastName}`}</span>
                            </label>
                            {selectedTeam1Players.includes(p._id) && (
                              <div className="xi-player-options">
                                <button
                                  type="button"
                                  className={`xi-option-btn ${team1Captain === p._id ? 'xi-option-btn--active' : ''}`}
                                  onClick={() => setTeam1Captain(p._id)}
                                  title="Captain"
                                >
                                  C
                                </button>
                                <button
                                  type="button"
                                  className={`xi-option-btn ${team1WK === p._id ? 'xi-option-btn--active-wk' : ''}`}
                                  onClick={() => setTeam1WK(p._id)}
                                  title="Wicket Keeper"
                                >
                                  WK
                                </button>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Team 2 Players */}
                  <div>
                    <h3 className="text-primary text-sm font-semibold mb-2">{match.team2?.name} ({selectedTeam2Players.length}/11)</h3>
                    <div className="playing-xi-list">
                      {team2Players.length === 0 ? (
                        <div className="text-xs text-muted p-2">No players added for this team yet.</div>
                      ) : (
                        team2Players.map(p => (
                          <div key={p._id} className="xi-player-row">
                            <label className={`xi-player-info ${selectedTeam2Players.includes(p._id) ? 'xi-player-info--selected' : ''}`}>
                              <input
                                type="checkbox"
                                checked={selectedTeam2Players.includes(p._id)}
                                onChange={() => toggleTeam2Player(p._id)}
                              />
                              <span>{p.fullName || `${p.firstName} ${p.lastName}`}</span>
                            </label>
                            {selectedTeam2Players.includes(p._id) && (
                              <div className="xi-player-options">
                                <button
                                  type="button"
                                  className={`xi-option-btn ${team2Captain === p._id ? 'xi-option-btn--active' : ''}`}
                                  onClick={() => setTeam2Captain(p._id)}
                                  title="Captain"
                                >
                                  C
                                </button>
                                <button
                                  type="button"
                                  className={`xi-option-btn ${team2WK === p._id ? 'xi-option-btn--active-wk' : ''}`}
                                  onClick={() => setTeam2WK(p._id)}
                                  title="Wicket Keeper"
                                >
                                  WK
                                </button>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <button type="submit" className="auth-btn" disabled={submitting}>
                  Save Playing XI Roster
                </button>
              </form>
            </div>
          )}

          {/* START / FLOW LIFECYCLE */}
          {(isPlayingXISelected || isTossCompleted || isInningsBreak) && (
            <div className="panel-card animate-fade-in-up text-center">
              <h2 className="panel-card__title flex items-center justify-center gap-2">
                <CheckCircle size={18} className="text-primary" /> Advance Match Status
              </h2>
              <div className="match-flow-controls">
                {isInningsBreak ? (
                  <>
                    <p className="text-secondary text-sm mb-4">The match is currently at the innings break.</p>
                    <button
                      onClick={handleStartMatch}
                      className="auth-btn"
                      disabled={submitting}
                    >
                      Start 2nd Innings
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-secondary text-sm mb-4">Toss is recorded & XI is selected. Advance to live play.</p>
                    <button
                      onClick={handleStartMatch}
                      className="auth-btn"
                      disabled={submitting}
                    >
                      Start Live Play
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* LIVE SCORING PANEL */}
          {(isLive || isInningsBreak) && (
            <div className="panel-card animate-fade-in-up">
              <h2 className="panel-card__title flex items-center gap-2">
                <CheckCircle size={18} className="text-primary" /> Update Innings Scorecard
              </h2>

              {scores.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-secondary text-sm mb-4">No scorecard has been initialized for this match yet.</p>
                  <button
                    onClick={() => handleInitializeScore(1)}
                    className="auth-btn w-full"
                    disabled={submitting}
                  >
                    Initialize 1st Innings Scorecard
                  </button>
                </div>
              ) : (
                <div>
                  {/* Select Scorecard Tabs (if 2nd innings exist) */}
                  {scores.length > 1 && (
                    <div className="flex border-b border-white/5 mb-4">
                      {scores.map((score, idx) => (
                        <button
                          key={score._id}
                          className={`series-tab ${activeScoreTab === idx ? 'series-tab--active' : ''}`}
                          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                          onClick={() => setActiveScoreTab(idx)}
                        >
                          Innings {score.innings} ({score.battingTeam?.shortName || 'Team'})
                        </button>
                      ))}
                    </div>
                  )}

                  <form onSubmit={handleUpdateScore} className="auth-form">
                    <div className="score-inputs-row">
                      <div className="form-group">
                        <label className="form-label">Runs</label>
                        <input
                          type="number"
                          className="form-input"
                          value={scoreRuns}
                          onChange={(e) => setScoreRuns(e.target.value)}
                          min="0"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Wickets</label>
                        <input
                          type="number"
                          className="form-input"
                          value={scoreWickets}
                          onChange={(e) => setScoreWickets(e.target.value)}
                          min="0"
                          max="10"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Overs (X.Y)</label>
                        <input
                          type="text"
                          className="form-input"
                          value={scoreOvers}
                          onChange={(e) => setScoreOvers(e.target.value)}
                          placeholder="e.g., 14.2"
                          pattern="^\d+\.[0-5]$"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Run Rate</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-input"
                          value={scoreRunRate}
                          onChange={(e) => setScoreRunRate(e.target.value)}
                          min="0"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Target (Optional)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={scoreTarget}
                        onChange={(e) => setScoreTarget(e.target.value)}
                        placeholder="e.g., 185"
                        min="0"
                      />
                    </div>

                    <button type="submit" className="auth-btn" disabled={submitting}>
                      Update Score
                    </button>
                  </form>

                  {/* Innings Transitions buttons */}
                  {isLive && scores.length === 1 && (
                    <button
                      onClick={handleInningsBreak}
                      className="scorer-action-btn mt-4 w-full"
                      style={{ background: 'rgba(245, 166, 35, 0.1)', color: '#f5a623', borderColor: '#f5a623' }}
                      disabled={submitting}
                    >
                      Declare Innings & Enter Innings Break
                    </button>
                  )}

                  {isInningsBreak && scores.length === 1 && (
                    <button
                      onClick={() => handleInitializeScore(2)}
                      className="scorer-action-btn mt-4 w-full"
                      style={{ background: 'rgba(4, 106, 56, 0.1)', color: 'var(--color-primary-light)', borderColor: 'var(--color-primary-light)' }}
                      disabled={submitting}
                    >
                      Initialize 2nd Innings Scorecard
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* COMPLETE MATCH FORM */}
          {isLive && scores.length > 0 && (
            <div className="panel-card animate-fade-in-up">
              <h2 className="panel-card__title flex items-center gap-2">
                <FileText size={18} className="text-primary" /> End Match & Declare Winner
              </h2>
              <form onSubmit={handleEndMatch} className="auth-form">
                <div className="form-group">
                  <label className="form-label">Winning Team</label>
                  <select
                    className="form-select"
                    value={matchWinner}
                    onChange={(e) => setMatchWinner(e.target.value)}
                  >
                    <option value={match.team1?._id || match.team1}>{match.team1?.name}</option>
                    <option value={match.team2?._id || match.team2}>{match.team2?.name}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Result Status Text</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., Mumbai Indians won by 6 wickets"
                    value={matchResultText}
                    onChange={(e) => setMatchResultText(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="auth-btn bg-red-600 hover:bg-red-700" disabled={submitting}>
                  Complete Match
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Side: LIVE BALL-BY-BALL COMMENTARY PANEL */}
        <div>
          {isLive ? (
            <div className="panel-card animate-fade-in-up">
              <h2 className="panel-card__title flex items-center gap-2">
                <MessageSquare size={18} className="text-primary" /> Add Ball Commentary
              </h2>
              <form onSubmit={handlePostCommentary} className="auth-form">
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Current Over</label>
                    <input
                      type="number"
                      className="form-input"
                      value={commOver}
                      onChange={(e) => setCommOver(e.target.value)}
                      min="0"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ball (1-6)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={commBall}
                      onChange={(e) => setCommBall(e.target.value)}
                      min="1"
                      max="6"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Event Type</label>
                  <select
                    className="form-select"
                    value={commType}
                    onChange={(e) => setCommType(e.target.value)}
                  >
                    <option value="NORMAL">Normal Delivery</option>
                    <option value="FOUR">Four (4 Runs)</option>
                    <option value="SIX">Six (6 Runs)</option>
                    <option value="WICKET">Wicket Fall</option>
                    <option value="MILESTONE">Milestone (50/100/Toss)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Commentary Description</label>
                  <textarea
                    className="form-input"
                    rows="4"
                    placeholder="Describe the ball event... e.g., Bumrah to Kohli, FOUR, guided through third man with soft hands!"
                    value={commText}
                    onChange={(e) => setCommText(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="auth-btn bg-emerald-700 hover:bg-emerald-800" disabled={submitting}>
                  <Plus size={16} /> Submit Commentary
                </button>
              </form>
            </div>
          ) : (
            <div className="panel-card animate-fade-in-up text-center py-8">
              <MessageSquare size={36} className="text-muted mx-auto mb-3" />
              <h3 className="text-primary font-bold mb-1">Live Commentary Unavailable</h3>
              <p className="text-secondary text-xs">Commentary can only be posted once the match status is LIVE.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
