/**
 * Squads Management Page
 */

export const SquadsPage = () => {
  return (
    <div className="squads-page">
      <h1>👨‍👩‍👧‍👦 Squads Management</h1>
      <div className="card">
        <h2>Squad Management Features</h2>
        <ul>
          <li>Create squads for each team in a series</li>
          <li>Add players to squad (11-25 players)</li>
          <li>Remove players from squad</li>
          <li>Select playing XI from squad</li>
          <li>Manage substitutions</li>
        </ul>
        <p>This feature is coming soon...</p>
        <a href="/dashboard" className="btn btn-primary">
          Back to Dashboard
        </a>
      </div>
    </div>
  );
};

export default SquadsPage;
