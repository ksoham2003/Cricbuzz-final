import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './redux/store';
import { fetchMe } from './redux/slices/authSlice';

// Components & Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import MatchCenter from './pages/MatchCenter';
import SeriesList from './pages/SeriesList';
import SeriesDetails from './pages/SeriesDetails';
import Teams from './pages/Teams';
import TeamDetails from './pages/TeamDetails';
import Players from './pages/Players';
import PlayerDetails from './pages/PlayerDetails';
import Search from './pages/Search';
import Login from './pages/Login';
import Register from './pages/Register';
import ScorerDashboard from './pages/ScorerDashboard';
import ScorerPanel from './pages/ScorerPanel';

// AppWrapper handles fetching current logged-in user on mount
function AppWrapper({ children }) {
  const dispatch = useDispatch();
  const token = localStorage.getItem('cricbuzz_token');

  useEffect(() => {
    if (token) {
      dispatch(fetchMe());
    }
  }, [dispatch, token]);

  return <>{children}</>;
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppWrapper>
          <div className="app-layout">
            <Navbar />
            <main className="main-content">
              <Routes>
                {/* Public Fan Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/matches/:matchId" element={<MatchCenter />} />
                
                <Route path="/series" element={<SeriesList />} />
                <Route path="/series/:seriesId" element={<SeriesDetails />} />
                
                <Route path="/teams" element={<Teams />} />
                <Route path="/teams/:teamId" element={<TeamDetails />} />
                
                <Route path="/players" element={<Players />} />
                <Route path="/players/:playerId" element={<PlayerDetails />} />
                
                <Route path="/search" element={<Search />} />
                
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Scorer Dashboard */}
                <Route
                  path="/scorer"
                  element={
                    <ProtectedRoute allowedRoles={['SCORER', 'ADMIN', 'SUPER_ADMIN']}>
                      <ScorerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/scorer/match/:matchId"
                  element={
                    <ProtectedRoute allowedRoles={['SCORER', 'ADMIN', 'SUPER_ADMIN']}>
                      <ScorerPanel />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback Redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AppWrapper>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
