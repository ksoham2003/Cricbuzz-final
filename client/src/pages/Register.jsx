import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, AlertCircle } from 'lucide-react';
import { register, clearError } from '../redux/slices/authSlice';
import './Auth.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    document.title = 'Register — CricBuzz Control';
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      const dest = user?.role === 'SCORER' || user?.role === 'ADMIN' ? '/scorer' : '/';
      navigate(dest, { replace: true });
    }
  }, [isAuthenticated, navigate, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!name || !email || !password) {
      setValidationError('Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      setValidationError('Password must be at least 8 characters long');
      return;
    }

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    if (!regex.test(password)) {
      setValidationError('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)');
      return;
    }

    dispatch(register({ name, email, password }));
  };

  return (
    <div className="auth-container">
      <div className="auth-card animate-fade-in-up">
        <div className="auth-header">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Register to start managing matches & live scorecards</p>
        </div>

        {validationError && (
          <div className="auth-error flex items-center gap-2 justify-center">
            <AlertCircle size={16} />
            <span style={{ fontSize: '0.8rem', textAlign: 'left' }}>{validationError}</span>
          </div>
        )}

        {error && (
          <div className="auth-error flex items-center gap-2 justify-center">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              className="form-input"
              placeholder="e.g., Soham Kadam"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="e.g., soham@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="Min. 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Must contain 8+ characters, including at least one uppercase, lowercase, number, and special character.
            </span>
          </div>

          <button type="submit" className="auth-btn" disabled={isLoading}>
            <UserPlus size={18} />
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}
