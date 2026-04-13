import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await loginUser(form);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-page" id="login-page">
      <div className="auth-card animate-fadeInUp">
        <h1 className="auth-card__title">Welcome Back</h1>
        <p className="auth-card__subtitle">
          Sign in to book your favourite movies
        </p>

        {error && (
          <div className="alert alert--error">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-group__label" htmlFor="login-email">
              <FiMail size={12} style={{ marginRight: 6 }} />
              Email
            </label>
            <input
              className="form-group__input"
              type="email"
              id="login-email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-group__label" htmlFor="login-password">
              <FiLock size={12} style={{ marginRight: 6 }} />
              Password
            </label>
            <input
              className="form-group__input"
              type="password"
              id="login-password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            id="login-submit"
          >
            {loading ? (
              'Signing In...'
            ) : (
              <>
                <FiLogIn style={{ marginRight: 6 }} />
                Sign In
              </>
            )}
          </button>
        </form>

        <p className="auth-card__footer">
          Don't have an account?{' '}
          <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
