import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllMovies, getStats } from '../services/api';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';
import { FiArrowRight, FiPlay } from 'react-icons/fi';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [moviesRes, statsRes] = await Promise.all([
        getAllMovies(),
        getStats()
      ]);
      setMovies(moviesRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" id="home-page">
      {/* Hero Section */}
      <section className="hero container">
        <div className="hero__content">
          <span className="hero__eyebrow">Tonight’s picks, curated for you</span>
          <h1 className="hero__title">
            Your Next Great Movie Experience Starts Here
          </h1>
          <p className="hero__subtitle">
            Browse new releases, lock in the perfect showtime, pick your seats, and book tickets in seconds.
          </p>
          <div className="hero__actions">
            <Link to="/movies" className="hero__cta" id="hero-browse-btn">
              <FiPlay />
              Browse Movies
              <FiArrowRight />
            </Link>
            <Link to="/movies" className="hero__ghost">
              Explore Showtimes
            </Link>
          </div>
          <div className="hero__chips">
            <span className="hero__chip">Live seat map</span>
            <span className="hero__chip">Instant QR tickets</span>
            <span className="hero__chip">Curated premieres</span>
          </div>
        </div>
        <div className="hero__media" aria-hidden="true">
          <div className="hero__ticket">
            <div className="hero__ticket-top">
              <span>Premiere Night</span>
              <span>IMAX</span>
            </div>
            <h3 className="hero__ticket-title">Cinematic Showcase</h3>
            <div className="hero__ticket-meta">PVR Orion • 7:30 PM</div>
            <div className="hero__ticket-seats">
              {Array.from({ length: 16 }).map((_, idx) => (
                <span key={idx} className="hero__seat" />
              ))}
            </div>
            <div className="hero__ticket-footer">
              <span>₹320</span>
              <span>42 seats left</span>
            </div>
          </div>
          <div className="hero__poster-stack">
            <div className="hero__poster-card hero__poster-card--one" />
            <div className="hero__poster-card hero__poster-card--two" />
            <div className="hero__poster-card hero__poster-card--three" />
          </div>
        </div>
      </section>

      {/* Featured Movies */}
      <section className="container" style={{ paddingBottom: 60 }}>
        <div className="section-header">
          <h2 className="section-header__title">🔥 Now Showing</h2>
          <Link to="/movies" className="section-header__link">
            View All <FiArrowRight size={12} style={{ marginLeft: 4 }} />
          </Link>
        </div>

        {loading ? (
          <Loader text="Fetching the latest movies..." />
        ) : movies.length === 0 ? (
          <div className="empty-state animate-fadeIn">
            <div className="empty-state__icon">🎬</div>
            <h3 className="empty-state__title">No Movies Available</h3>
            <p className="empty-state__text">
              Check back soon — new movies are added regularly!
            </p>
          </div>
        ) : (
          <div className="movie-grid">
            {movies.slice(0, 8).map((movie, idx) => (
              <div
                key={movie.movie_id}
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Stats / Features — Dynamic */}
      <section className="container stats">
        <div className="stats-grid">
          {[
            { icon: '🎬', label: 'Movies', value: stats?.total_movies || 0, desc: 'Latest releases' },
            { icon: '🏟️', label: 'Theatres', value: stats?.total_theatres || 0, desc: 'Across the city' },
            { icon: '🎟️', label: 'Bookings', value: stats?.total_bookings || 0, desc: 'Happy customers' },
            { icon: '⚡', label: 'Instant', value: 'Booking', desc: 'No waiting' },
          ].map((stat, i) => (
            <div
              key={i}
              className="stat-card animate-fadeInUp"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="stat-card__icon">{stat.icon}</div>
              <div className="stat-card__value">{stat.value}</div>
              <div className="stat-card__label">{stat.label}</div>
              <div className="stat-card__desc">{stat.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p className="footer__text">
          © 2026 <a href="/">BookMyShow</a>. Made with ❤️ for movie lovers.
        </p>
      </footer>
    </div>
  );
};

export default Home;
