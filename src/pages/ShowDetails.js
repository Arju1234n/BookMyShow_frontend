import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getShowsByMovie, getAllMovies, getAllTheatres } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { FiClock, FiMapPin, FiCalendar, FiGlobe } from 'react-icons/fi';

const genreColors = {
  Action: 'linear-gradient(135deg, #e74c3c, #c0392b)',
  Comedy: 'linear-gradient(135deg, #f39c12, #e67e22)',
  Drama: 'linear-gradient(135deg, #3498db, #2980b9)',
  Horror: 'linear-gradient(135deg, #2c3e50, #1a1a2e)',
  Romance: 'linear-gradient(135deg, #e91e63, #c2185b)',
  Thriller: 'linear-gradient(135deg, #8e44ad, #6c3483)',
  'Sci-Fi': 'linear-gradient(135deg, #00bcd4, #0097a7)',
  default: 'linear-gradient(135deg, #e23744, #c1293a)',
};

const ShowDetails = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [theatres, setTheatres] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId]);

  const fetchData = async () => {
    try {
      const [moviesRes, showsRes, theatresRes] = await Promise.all([
        getAllMovies(),
        getShowsByMovie(movieId),
        getAllTheatres(),
      ]);

      const found = moviesRes.data.find(
        (m) => String(m.movie_id) === String(movieId)
      );
      setMovie(found);
      setShows(showsRes.data);

      // Map theatres by ID for quick lookup
      const theatreMap = {};
      theatresRes.data.forEach((t) => {
        theatreMap[t.theatre_id] = t;
      });
      setTheatres(theatreMap);
    } catch (err) {
      console.error('Failed to fetch show details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookShow = (show) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/booking/${show.show_id}`, {
      state: { show, movie, theatre: theatres[show.theatre_id] },
    });
  };

  const formatDateTime = (dt) => {
    const date = new Date(dt);
    return {
      date: date.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      }),
      time: date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  if (loading) return <div className="page"><Loader text="Loading show details..." /></div>;
  if (!movie) {
    return (
      <div className="page container">
        <div className="empty-state">
          <div className="empty-state__icon">🎬</div>
          <h3 className="empty-state__title">Movie Not Found</h3>
          <p className="empty-state__text">The movie you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const gradient = genreColors[movie.genre] || genreColors.default;

  return (
    <div className="page container" id="show-details-page">
      <div className="show-details">
        {/* Movie Banner */}
        <div className="show-details__movie-banner animate-fadeInUp">
          <div className="show-details__poster">
            {movie.poster_url ? (
              <img
                src={movie.poster_url}
                alt={movie.title}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
                style={{
                  width: '100%',
                  aspectRatio: '2/3',
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-lg)',
                  display: 'block',
                }}
              />
            ) : null}
            <div
              style={{
                width: '100%',
                aspectRatio: '2/3',
                background: gradient,
                borderRadius: 'var(--radius-lg)',
                display: movie.poster_url ? 'none' : 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <span style={{ fontSize: '3.5rem' }}>🎬</span>
              <span
                style={{
                  color: 'rgba(255,255,255,0.9)',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  textAlign: 'center',
                  padding: '0 12px',
                }}
              >
                {movie.title}
              </span>
            </div>
          </div>


          <div className="show-details__movie-info">
            <h1 className="show-details__movie-title">{movie.title}</h1>
            <div className="show-details__movie-meta">
              {movie.genre && (
                <span className="show-details__meta-badge">🎭 {movie.genre}</span>
              )}
              {movie.language && (
                <span className="show-details__meta-badge">
                  <FiGlobe size={13} /> {movie.language}
                </span>
              )}
              {movie.duration && (
                <span className="show-details__meta-badge">
                  <FiClock size={13} /> {movie.duration} min
                </span>
              )}
              {movie.release_date && (
                <span className="show-details__meta-badge">
                  <FiCalendar size={13} />{' '}
                  {new Date(movie.release_date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              )}
            </div>
            <p className="show-details__synopsis">
              Experience the magic of <strong>{movie.title}</strong> on the big screen.
              Book your tickets now for an unforgettable cinematic journey.
              {movie.genre && ` A ${movie.genre.toLowerCase()} masterpiece`}
              {movie.language && ` in ${movie.language}`}.
            </p>
          </div>
        </div>

        {/* Available Shows */}
        <div className="section-header" style={{ marginTop: 16 }}>
          <h2 className="section-header__title">🎟️ Available Shows</h2>
        </div>

        {shows.length === 0 ? (
          <div className="empty-state animate-fadeIn">
            <div className="empty-state__icon">📅</div>
            <h3 className="empty-state__title">No Shows Available</h3>
            <p className="empty-state__text">
              No shows are currently scheduled for this movie. Check back later!
            </p>
          </div>
        ) : (
          <div className="shows-list">
            {shows.map((show, idx) => {
              const { date, time } = formatDateTime(show.show_time);
              const theatre = theatres[show.theatre_id];
              return (
                <div
                  className="show-item animate-fadeInUp"
                  key={show.show_id}
                  style={{ animationDelay: `${idx * 0.08}s` }}
                  id={`show-item-${show.show_id}`}
                >
                  <div className="show-item__info">
                    <div>
                      <div className="show-item__time">{time}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {date}
                      </div>
                    </div>
                    <div>
                      <div className="show-item__theatre">
                        {theatre?.name || 'Theatre'}
                      </div>
                      <div className="show-item__location">
                        <FiMapPin size={11} style={{ marginRight: 4 }} />
                        {theatre?.location || 'Location'}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div className="show-item__price">₹{show.price}</div>
                    <button
                      className="show-item__btn"
                      onClick={() => handleBookShow(show)}
                      id={`book-show-${show.show_id}`}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowDetails;
