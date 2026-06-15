import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, X, Search, Zap, Trophy, Shield, UserCircle, LogIn, LogOut, LayoutDashboard } from 'lucide-react';
import { logout } from '../redux/slices/authSlice';
import './Navbar.css';

const NAV_LINKS = [
  { path: '/', label: 'Home', icon: Zap },
  { path: '/series', label: 'Series', icon: Trophy },
  { path: '/teams', label: 'Teams', icon: Shield },
  { path: '/players', label: 'Players', icon: UserCircle },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isSearchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const isScorerOrAdmin = user && ['SCORER', 'ADMIN', 'SUPER_ADMIN'].includes(user.role);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-icon">
            <Zap size={20} />
          </div>
          <span className="navbar__logo-text">CricBuzz</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="navbar__links">
          {NAV_LINKS.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`navbar__link ${location.pathname === path ? 'navbar__link--active' : ''}`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          ))}

          {isScorerOrAdmin && (
            <Link
              to="/scorer"
              className={`navbar__link ${location.pathname.startsWith('/scorer') ? 'navbar__link--active' : ''}`}
              style={{ color: 'var(--color-accent)' }}
            >
              <LayoutDashboard size={16} />
              <span>Scoring Panel</span>
            </Link>
          )}
        </div>

        {/* Search & Menu */}
        <div className="navbar__actions">
          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="navbar__search-form">
            <Search size={16} className="navbar__search-icon" />
            <input
              type="text"
              placeholder="Search players, teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="navbar__search-input"
              minLength={2}
            />
          </form>

          {/* User Auth Controls (Desktop) */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-secondary font-medium max-w-[120px] truncate" title={user?.name}>
                  Hi, {user?.name?.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="navbar__link"
                  style={{ cursor: 'pointer' }}
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="navbar__link">
                <LogIn size={16} />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Search Toggle */}
          <button
            className="navbar__icon-btn navbar__search-toggle"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Toggle search"
          >
            <Search size={20} />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="navbar__icon-btn navbar__menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="navbar__mobile-search animate-fade-in">
          <form onSubmit={handleSearch} className="container">
            <div className="navbar__mobile-search-inner">
              <Search size={18} />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search players, teams, series..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="navbar__mobile-search-input"
                minLength={2}
              />
            </div>
          </form>
        </div>
      )}

      {/* Mobile Nav Menu */}
      {isOpen && (
        <div className="navbar__mobile-menu animate-fade-in">
          <div className="container flex flex-col gap-1">
            {NAV_LINKS.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`navbar__mobile-link ${location.pathname === path ? 'navbar__mobile-link--active' : ''}`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}

            {isScorerOrAdmin && (
              <Link
                to="/scorer"
                className={`navbar__mobile-link ${location.pathname.startsWith('/scorer') ? 'navbar__mobile-link--active' : ''}`}
                style={{ color: 'var(--color-accent)' }}
              >
                <LayoutDashboard size={18} />
                <span>Scoring Panel</span>
              </Link>
            )}

            <hr className="my-2" style={{ borderColor: 'var(--border-color)', opacity: 0.5 }} />

            {isAuthenticated ? (
              <>
                <div className="px-4 py-2 text-sm text-secondary font-medium">
                  Signed in as: <span className="text-primary font-bold">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="navbar__mobile-link w-full text-left"
                  style={{ cursor: 'pointer', background: 'none', border: 'none' }}
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="navbar__mobile-link">
                <LogIn size={18} />
                <span>Login / Register</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
