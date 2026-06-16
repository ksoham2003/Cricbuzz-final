/**
 * Players Management Page
 */

export const PlayersPage = () => {
  return (
    <div className="players-page">
      <h1>🎯 Players Management</h1>
      <div className="card">
        <h2>Player Management Features</h2>
        <ul>
          <li>Create and manage cricket players</li>
          <li>Add players to teams</li>
          <li>Upload player images</li>
          <li>Manage player statistics</li>
          <li>Update player roles (batsman, bowler, all-rounder)</li>
        </ul>
        <p>This feature is coming soon...</p>
        <a href="/dashboard" className="btn btn-primary">
          Back to Dashboard
        </a>
      </div>
    </div>
  );
};

export default PlayersPage;
