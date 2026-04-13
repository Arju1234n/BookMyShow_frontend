import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiStar } from 'react-icons/fi';

// Movie poster placeholder colors based on genre
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

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movies/${movie.movie_id}`);
  };

  const gradient = genreColors[movie.genre] || genreColors.default;

  // Generate a pseudo-random rating from movie_id for demo
  const idString = String(movie.movie_id || '');
  let hash = 0;
  for (let i = 0; i < idString.length; i += 1) {
    hash = (hash * 31 + idString.charCodeAt(i)) % 1000;
  }
  const ratingSeed = Number.isFinite(Number(movie.movie_id)) ? Number(movie.movie_id) : hash;
  const rating = ((ratingSeed * 7 + 3) % 30 + 60) / 10;

  return (
    <div
      className="movie-card animate-fadeInUp"
      onClick={handleClick}
      id={`movie-card-${movie.movie_id}`}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${movie.title}`}
    >
      <div className="movie-card__poster">
        {movie.poster_url ? (
          <img
            className="movie-card__poster-img"
            src={movie.poster_url}
            alt={movie.title}
            onError={(e) => {
              // If image fails to load, swap it out for the gradient placeholder
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : null}
        <div
          className="movie-card__poster-img"
          style={{
            background: gradient,
            display: movie.poster_url ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '3rem' }}>🎬</span>
          <span
            style={{
              color: 'rgba(255,255,255,0.9)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '1rem',
              textAlign: 'center',
              padding: '0 16px',
            }}
          >
            {movie.title}
          </span>
        </div>
        <div className="movie-card__poster-overlay" />
        <div className="movie-card__rating">
          <FiStar size={12} />
          {rating.toFixed(1)}
        </div>
      </div>


      <div className="movie-card__info">
        <h3 className="movie-card__title">{movie.title}</h3>
        <div className="movie-card__meta">
          <span className="movie-card__tag">{movie.genre || 'Movie'}</span>
          <span className="movie-card__tag">{movie.language || 'Hindi'}</span>
          {movie.duration && (
            <span className="movie-card__tag">
              <FiClock size={10} style={{ marginRight: 3 }} />
              {movie.duration} min
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
