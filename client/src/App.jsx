/**
 * Main App Component
 * Routing configuration and main layout
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './context/authStore';
import { initSocket } from './services/socket';
import { useEffect } from 'react';


// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import SeriesPage from './pages/SeriesPage';
import TeamsPage from './pages/TeamsPage';
import PlayersPage from './pages/PlayersPage';
import SquadsPage from './pages/SquadsPage';
import MatchesPage from './pages/MatchesPage';
import ScoringPage from './pages/ScoringPage';
import UsersPage from './pages/UsersPage';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

// Styles
import './styles/globals.css';
import './App.css';

function App() {
  const { isAuthenticated, getCurrentUser } = useAuthStore();

  useEffect(() => {
    // Initialize socket connection if authenticated
    if (isAuthenticated) {
      initSocket();
      getCurrentUser().catch(() => {
        // Silent failure - user session may have expired
      });
    }
  }, [isAuthenticated, getCurrentUser]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/series"
          element={
            <ProtectedRoute requiredRoles={['SUPER_ADMIN', 'ADMIN']}>
              <MainLayout>
                <SeriesPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/teams"
          element={
            <ProtectedRoute requiredRoles={['SUPER_ADMIN', 'ADMIN']}>
              <MainLayout>
                <TeamsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/players"
          element={
            <ProtectedRoute requiredRoles={['SUPER_ADMIN', 'ADMIN']}>
              <MainLayout>
                <PlayersPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/squads"
          element={
            <ProtectedRoute requiredRoles={['SUPER_ADMIN', 'ADMIN']}>
              <MainLayout>
                <SquadsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/matches"
          element={
            <ProtectedRoute requiredRoles={['SUPER_ADMIN', 'ADMIN']}>
              <MainLayout>
                <MatchesPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Scorer Routes */}
        <Route
          path="/live-scoring"
          element={
            <ProtectedRoute requiredRoles={['SUPER_ADMIN', 'ADMIN', 'SCORER']}>
              <MainLayout>
                <ScoringPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Super Admin Routes */}
        <Route
          path="/users"
          element={
            <ProtectedRoute requiredRoles={['SUPER_ADMIN']}>
              <MainLayout>
                <UsersPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* 404 and Unauthorized */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

/**
 * Unauthorized Page
 */
function UnauthorizedPage() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h1>403 - Unauthorized</h1>
      <p>You don't have permission to access this resource.</p>
      <a href="/dashboard" className="btn btn-primary">
        Go to Dashboard
      </a>
    </div>
  );
}

/**
 * Not Found Page
 */
function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a href="/dashboard" className="btn btn-primary">
        Go to Dashboard
      </a>
    </div>
  );
}

export default App;
