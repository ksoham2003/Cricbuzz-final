/**
 * Live Scoring Page
 */

export const ScoringPage = () => {
  return (
    <div className="scoring-page">
      <h1>⚡ Live Scoring</h1>
      <div className="card">
        <h2>Live Match Scoring Features</h2>
        <ul>
          <li>Conduct match toss</li>
          <li>Start match and manage innings</li>
          <li>Record ball-by-ball scores</li>
          <li>Update extras (runs, wides, no-balls)</li>
          <li>Record wickets</li>
          <li>Add live commentary</li>
          <li>Real-time updates via WebSocket</li>
          <li>Complete match and declare results</li>
        </ul>
        <p>This is the live scoring interface for SCORER role.</p>
        <p>Coming soon...</p>
        <a href="/dashboard" className="btn btn-primary">
          Back to Dashboard
        </a>
      </div>
    </div>
  );
};

export default ScoringPage;
