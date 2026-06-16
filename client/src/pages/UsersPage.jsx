/**
 * Users Management Page
 */

export const UsersPage = () => {
  return (
    <div className="users-page">
      <h1>👨‍💼 Users Management</h1>
      <div className="card">
        <h2>User Management Features (SUPER_ADMIN Only)</h2>
        <ul>
          <li>Create new users with role assignment</li>
          <li>View all users</li>
          <li>Update user details</li>
          <li>Delete users (soft delete)</li>
          <li>Activate/Deactivate user accounts</li>
          <li>Filter and search users</li>
          <li>Assign roles (SUPER_ADMIN, ADMIN, SCORER)</li>
        </ul>
        <p>This feature is available only to SUPER_ADMIN users.</p>
        <p>Coming soon...</p>
        <a href="/dashboard" className="btn btn-primary">
          Back to Dashboard
        </a>
      </div>
    </div>
  );
};

export default UsersPage;
