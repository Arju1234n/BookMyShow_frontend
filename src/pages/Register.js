import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import { FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await registerUser(form);
      navigate('/login');
    } catch (err) {
      setError(
        err.response?.data?.error || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-page" id="register-page">
      <div className="auth-card animate-fadeInUp">
        <h1 className="auth-card__title">Create Account</h1>
        <p className="auth-card__subtitle">
          Join BookMyShow and start booking movies today
        </p>

        {error && (
          <div className="alert alert--error">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-group__label" htmlFor="register-name">
              <FiUser size={12} style={{ marginRight: 6 }} />
              Full Name
            </label>
            <input
              className="form-group__input"
              type="text"
              id="register-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label className="form-group__label" htmlFor="register-email">
              <FiMail size={12} style={{ marginRight: 6 }} />
              Email
            </label>
            <input
              className="form-group__input"
              type="email"
              id="register-email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-group__label" htmlFor="register-password">
              <FiLock size={12} style={{ marginRight: 6 }} />
              Password
            </label>
            <input
              className="form-group__input"
              type="password"
              id="register-password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min 6 characters"
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            id="register-submit"
          >
            {loading ? (
              'Creating Account...'
            ) : (
              <>
                <FiUserPlus style={{ marginRight: 6 }} />
                Create Account
              </>
            )}
          </button>
        </form>

        <p className="auth-card__footer">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
