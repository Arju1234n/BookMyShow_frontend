import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiFilm, FiLogOut } from 'react-icons/fi';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) =>
    location.pathname === path ? 'navbar__link navbar__link--active' : 'navbar__link';

  return (
    <nav className="navbar" id="main-navbar">
      <Link to="/" className="navbar__brand">
        <span className="navbar__brand-icon">
          <FiFilm />
        </span>
        BookMyShow
      </Link>

      <div className="navbar__links">
        <Link to="/" className={isActive('/')} id="nav-home">
          Home
        </Link>
        <Link to="/movies" className={isActive('/movies')} id="nav-movies">
          Movies
        </Link>

        {isAuthenticated ? (
          <>
            <Link
              to="/bookings"
              className={isActive('/bookings')}
              id="nav-bookings"
            >
              My Bookings
            </Link>

            <Link to="/profile" className="navbar__user" style={{ textDecoration: 'none' }}>
              <div className="navbar__avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="navbar__username">{user?.name}</span>
            </Link>

            <button
              className="navbar__btn navbar__btn--outline"
              onClick={handleLogout}
              id="nav-logout"
            >
              <FiLogOut style={{ marginRight: 4 }} />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="navbar__btn navbar__btn--outline" id="nav-login">
                Sign In
              </button>
            </Link>
            <Link to="/register">
              <button className="navbar__btn" id="nav-register">
                Sign Up
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
