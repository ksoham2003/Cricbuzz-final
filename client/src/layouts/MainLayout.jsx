/**
 * Main Layout Component
 * Wrapper layout with header and sidebar
 */

import { useAuthStore } from '../context/authStore';
import './MainLayout.css';

export const MainLayout = ({ children }) => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <div className="main-layout">
      <header className="main-header">
        <div className="header-left">
          <h1 className="logo">🏏 CricBuzz</h1>
        </div>

        <div className="header-center">
          <nav className="nav-menu">
            {['SUPER_ADMIN', 'ADMIN'].includes(user?.role) && (
              <>
                <a href="/series">Series</a>
                <a href="/teams">Teams</a>
                <a href="/players">Players</a>
                <a href="/squads">Squads</a>
                <a href="/matches">Matches</a>
              </>
            )}
            {user?.role === 'SUPER_ADMIN' && (
              <a href="/users">Users</a>
            )}
            {user?.role === 'SCORER' && (
              <a href="/live-scoring">Live Scoring</a>
            )}
          </nav>
        </div>

        <div className="header-right">
          <div className="user-info">
            <span>{user?.name}</span>
            <small>({user?.role})</small>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </header>

      <main className="main-content">{children}</main>

      <footer className="main-footer">
        <p>&copy; 2024 CricBuzz. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainLayout;
